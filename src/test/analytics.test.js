import { describe, it, expect, beforeEach, vi } from 'vitest';
import AnalyticsService from '../services/analyticsService';

describe('AnalyticsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    AnalyticsService.sessionId = null;
    AnalyticsService.sessionStart = null;
    AnalyticsService.pageViews = [];
    AnalyticsService.events = [];
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
    global.window = {
      location: { pathname: '/test' },
      document: { 
        title: 'Test Page',
        referrer: 'http://localhost/'
      },
      innerWidth: 1920,
      innerHeight: 1080,
      screen: { width: 1920, height: 1080 },
      history: { pushState: vi.fn() },
      addEventListener: vi.fn(),
    };
  });

  it('generates unique session ID', () => {
    const id1 = AnalyticsService.generateId();
    const id2 = AnalyticsService.generateId();
    expect(id1).not.toBe(id2);
    expect(id1.length).toBeGreaterThan(10);
  });

  it('initializes with session data', () => {
    AnalyticsService.init();
    expect(AnalyticsService.sessionId).toBeTruthy();
    expect(AnalyticsService.sessionStart).toBeTruthy();
  });

  it('tracks page view event', () => {
    AnalyticsService.init();
    const initialCount = AnalyticsService.pageViews.length;
    AnalyticsService.trackPageView();
    expect(AnalyticsService.pageViews.length).toBe(initialCount + 1);
    expect(AnalyticsService.pageViews[AnalyticsService.pageViews.length - 1].url).toBe('/test');
  });

  it('tracks custom event', () => {
    AnalyticsService.init();
    AnalyticsService.trackEvent('button', 'click', 'submit_form', 1);
    expect(AnalyticsService.events.length).toBe(1);
    expect(AnalyticsService.events[0].category).toBe('button');
    expect(AnalyticsService.events[0].action).toBe('click');
  });

  it('returns session stats', () => {
    AnalyticsService.init();
    const stats = AnalyticsService.getSessionStats();
    expect(stats.sessionId).toBeTruthy();
    expect(stats.duration).toBeGreaterThanOrEqual(0);
    expect(stats.pageViews).toBeGreaterThanOrEqual(1);
  });
});
