import React from 'react';

/**
 * Top-level error boundary.
 *
 * Without this, any error thrown during render unmounts the entire React
 * tree and the user is left looking at a completely blank page with no
 * indication of what went wrong. This catches those errors and shows a
 * readable fallback instead.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Surface the real error in the console for debugging.
    console.error('Application error:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-50 p-6">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="text-5xl mb-4">🐄</div>
            <h1 className="text-xl font-bold text-gray-800 mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-gray-600 mb-4">
              The app hit an unexpected error and couldn&apos;t finish loading.
              Try reloading the page.
            </p>
            <pre className="text-left text-xs bg-gray-50 border border-gray-100 rounded-lg p-3 overflow-auto text-gray-500 mb-4">
              {String(this.state.error?.message || this.state.error)}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium"
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
