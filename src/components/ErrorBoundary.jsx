import React from 'react';

/**
 * Catches render-time errors anywhere in the tree below it and shows a
 * recoverable message instead of an unmounted (blank white) screen.
 *
 * Without this, a single thrown error during render — e.g. formatting an
 * invalid date — tears down the whole app, which on a phone looks like a
 * "brief flash of the page, then a blank screen".
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Surface the error in the console for debugging without crashing the UI.
    console.error('Caught a render error:', error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-amber-50 px-6">
          <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-lg border border-amber-100 text-center">
            <div className="text-5xl mb-4">🐄</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h1>
            <p className="text-gray-600 mb-6">
              The page ran into an unexpected problem. Reloading usually fixes it.
            </p>
            <button
              onClick={this.handleReload}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-white font-medium bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-orange-200 transition-colors"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
