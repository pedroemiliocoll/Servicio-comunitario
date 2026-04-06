import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-[400px] flex items-center justify-center p-8">
                    <div className="text-center max-w-md">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-error/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-4xl text-error" style={{ fontVariationSettings: "'FILL' 1" }}>
                                error
                            </span>
                        </div>
                        <h2 className="text-xl font-headline font-black text-on-surface mb-2">
                            Algo salió mal
                        </h2>
                        <p className="text-on-surface-variant text-sm mb-6">
                            Estamos trabajando para solucionarlo. Por favor intenta de nuevo.
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={this.handleRetry}
                                className="px-6 py-2.5 bg-primary text-white font-bold text-sm rounded-full hover:bg-primary/90 transition-colors"
                            >
                                Reintentar
                            </button>
                            <a
                                href="/"
                                className="px-6 py-2.5 border border-outline text-on-surface font-semibold text-sm rounded-full hover:bg-surface-container-low transition-colors"
                            >
                                Ir al inicio
                            </a>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

export function PageErrorBoundary({ children, name }) {
    return (
        <ErrorBoundary fallback={
            <div className="min-h-[300px] flex items-center justify-center p-6">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-error/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-3xl text-error">warning</span>
                    </div>
                    <p className="text-on-surface-variant text-sm">
                        Error al cargar {name || 'este contenido'}
                    </p>
                    <p className="text-on-surface-variant/60 text-xs mt-1">
                        Por favor recarga la página
                    </p>
                </div>
            </div>
        }>
            {children}
        </ErrorBoundary>
    );
}
