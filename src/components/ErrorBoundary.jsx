import React from 'react';

/**
 * Top-level error boundary.
 *
 * With React 18's createRoot, an uncaught error thrown during render unmounts the
 * entire app and leaves a blank white screen. This boundary catches those errors
 * and shows a recoverable message instead, so users always see *something*.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('App crashed:', error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-gradient-to-b from-white to-slate-50">
          <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-lg border border-slate-100 text-center">
            <div className="text-5xl mb-4">🐄</div>
            <h1 className="text-2xl font-bold text-slate-900 mb-3">Something went wrong</h1>
            <p className="text-slate-600 mb-6">
              The app ran into an unexpected problem and couldn't finish loading. Reloading usually fixes it.
            </p>
            <button
              onClick={this.handleReload}
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-orange-200 transition-colors"
            >
              Reload app
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
