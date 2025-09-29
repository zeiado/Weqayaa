import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Bug } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-wellness flex items-center justify-center p-4">
          <Card className="glass-card max-w-2xl w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-6 h-6" />
                حدث خطأ في التطبيق
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-gray-600">
                <p className="mb-2">عذراً، حدث خطأ غير متوقع في التطبيق.</p>
                <p className="text-sm">يمكنك المحاولة مرة أخرى أو إعادة تحميل الصفحة.</p>
              </div>

              {this.state.error && (
                <details className="bg-red-50 p-3 rounded-lg border border-red-200">
                  <summary className="cursor-pointer text-red-800 font-medium mb-2">
                    تفاصيل الخطأ (للمطورين)
                  </summary>
                  <div className="text-sm text-red-700 space-y-2">
                    <div>
                      <strong>الخطأ:</strong> {this.state.error.message}
                    </div>
                    {this.state.error.stack && (
                      <div>
                        <strong>Stack Trace:</strong>
                        <pre className="text-xs bg-white p-2 rounded border mt-1 overflow-auto max-h-32">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    )}
                    {this.state.errorInfo && (
                      <div>
                        <strong>Component Stack:</strong>
                        <pre className="text-xs bg-white p-2 rounded border mt-1 overflow-auto max-h-32">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}

              <div className="flex gap-2">
                <Button onClick={this.handleReload} className="bg-gradient-primary">
                  <RefreshCw className="w-4 h-4 ml-2" />
                  إعادة تحميل الصفحة
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => this.setState({ hasError: false })}
                >
                  المحاولة مرة أخرى
                </Button>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2">نصائح لحل المشكلة:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• تأكد من اتصال الإنترنت</li>
                  <li>• امسح ذاكرة التخزين المؤقت للمتصفح</li>
                  <li>• تأكد من تسجيل الدخول</li>
                  <li>• إذا استمرت المشكلة، تواصل مع الدعم الفني</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
