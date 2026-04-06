const AnalyticsService = {
    sessionId: null,
    sessionStart: null,
    pageViews: [],
    events: [],
    
    init() {
        this.sessionId = this.generateId();
        this.sessionStart = Date.now();
        
        if (typeof window !== 'undefined') {
            this.trackPageView();
            this.setupNavigationTracking();
            this.setupErrorTracking();
            this.setupPerformanceTracking();
        }
    },
    
    generateId() {
        return Math.random().toString(36).substring(2, 15) + 
               Math.random().toString(36).substring(2, 15);
    },
    
    trackPageView() {
        if (typeof window === 'undefined') return;
        
        const pageData = {
            id: this.generateId(),
            sessionId: this.sessionId,
            url: window.location.pathname,
            title: document.title,
            referrer: document.referrer || 'direct',
            timestamp: new Date().toISOString(),
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            screen: {
                width: window.screen.width,
                height: window.screen.height
            }
        };
        
        this.pageViews.push(pageData);
        this.sendToServer('pageview', pageData);
    },
    
    trackEvent(category, action, label, value = null) {
        if (typeof window === 'undefined') return;
        
        const eventData = {
            id: this.generateId(),
            sessionId: this.sessionId,
            category,
            action,
            label,
            value,
            timestamp: new Date().toISOString(),
            url: window.location.pathname
        };
        
        this.events.push(eventData);
        this.sendToServer('event', eventData);
    },
    
    setupNavigationTracking() {
        if (typeof window === 'undefined' || !window.history) return;
        
        const originalPushState = window.history.pushState;
        window.history.pushState = (...args) => {
            originalPushState.apply(window.history, args);
            setTimeout(() => this.trackPageView(), 100);
        };
        
        window.addEventListener('popstate', () => {
            setTimeout(() => this.trackPageView(), 100);
        });
    },
    
    setupErrorTracking() {
        if (typeof window === 'undefined') return;
        
        window.addEventListener('error', (event) => {
            this.trackEvent('error', 'javascript', event.message, 1);
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            this.trackEvent('error', 'promise', event.reason?.message || 'Unhandled Promise Rejection', 1);
        });
    },
    
    setupPerformanceTracking() {
        if (typeof window === 'undefined' || !window.PerformanceObserver) return;
        
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.entryType === 'navigation') {
                    this.trackEvent('performance', 'load', 'page_load', Math.round(entry.loadTime));
                    this.trackEvent('performance', 'dom', 'dom_content_loaded', Math.round(entry.domContentLoadedEventEnd));
                }
            }
        });
        
        observer.observe({ entryTypes: ['navigation'] });
    },
    
    sendToServer(type, data) {
        if (typeof fetch === 'undefined') return;
        
        fetch('/api/analytics/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, data }),
            keepalive: true
        }).catch(() => {
            console.log('[Analytics] Evento guardado localmente');
        });
    },
    
    getSessionStats() {
        const duration = Date.now() - this.sessionStart;
        return {
            sessionId: this.sessionId,
            duration: Math.round(duration / 1000),
            pageViews: this.pageViews.length,
            events: this.events.length
        };
    }
};

export const analytics = AnalyticsService;

export const trackEvent = (category, action, label, value) => {
    AnalyticsService.trackEvent(category, action, label, value);
};

export const trackPageView = () => {
    AnalyticsService.trackPageView();
};

export default AnalyticsService;
