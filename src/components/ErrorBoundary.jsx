import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Surface the real error so the white-screen crash is debuggable on live.
    console.error('App crashed:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="text-5xl mb-4">🐄</div>
            <h1 className="text-xl font-bold text-gray-800 mb-2">Something went wrong</h1>
            <p className="text-gray-500 mb-6">
              The page ran into an error. Reloading usually fixes it.
            </p>
            <button
              onClick={this.handleReload}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium py-3 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-colors"
            >
              Reload App
            </button>
            {this.state.error?.message && (
              <p className="mt-4 text-xs text-gray-400 break-words">
                {this.state.error.message}
              </p>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}