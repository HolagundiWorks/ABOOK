import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RefreshCw, RotateCcw } from 'lucide-react';
import { resetAllToSampleData } from '../../utils/storage';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetAndReload = () => {
    if (confirm('This will reset your local practice cache to default CoA standards and reload the studio app. Proceed?')) {
      try {
        localStorage.clear();
        resetAllToSampleData();
      } catch (e) {
        console.error('Error clearing storage:', e);
      }
      window.location.href = '/';
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#161616] text-white flex flex-col items-center justify-center p-4 font-sans antialiased">
          <div className="max-w-md w-full bg-[#262626] border border-[#da1e28] p-6 shadow-2xl space-y-5">
            {/* Header */}
            <div className="flex items-center space-x-3 text-[#da1e28]">
              <div className="p-2.5 bg-[#da1e28]/10 border border-[#da1e28]">
                <AlertOctagon className="w-6 h-6 text-[#da1e28]" />
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#8d8d8d]">
                  Recovery System
                </span>
                <h1 className="text-lg font-bold uppercase tracking-tight text-white">
                  Studio Suite Render Error
                </h1>
              </div>
            </div>

            <p className="text-xs text-[#c6c6c6] leading-relaxed">
              The application encountered an unexpected runtime exception during startup. Your database records in local storage remain secure.
            </p>

            {this.state.error && (
              <div className="p-3 bg-[#161616] border border-[#393939] text-[11px] font-mono text-[#ff8389] overflow-x-auto max-h-36">
                <strong>Error:</strong> {this.state.error.message || this.state.error.toString()}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-[#0f62fe] hover:bg-[#0353e9] text-white font-bold text-xs uppercase tracking-wider transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Application</span>
              </button>

              <button
                onClick={this.handleResetAndReload}
                className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-transparent hover:bg-[#393939] border border-[#da1e28] text-[#ff8389] font-bold text-xs uppercase tracking-wider transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Practice Data to Defaults</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
