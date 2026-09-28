// Responsibility: Global React Error Boundary to catch render errors gracefully

import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Box } from "@/components/ui/Box";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Box className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <Box className="max-w-md w-full text-center">
            <Card className="p-8">
              <AlertTriangle className="h-16 w-16 text-red-600 mx-auto mb-4" />
              <Heading
                level={1}
                className="text-2xl font-bold text-gray-900 mb-2"
              >
                Something went wrong
              </Heading>
              <Text className="text-gray-600 mb-6">
                An unexpected error occurred. Please refresh the page or contact
                support if the problem persists.
              </Text>
              <Box className="space-y-3">
                <Button
                  onClick={() => window.location.reload()}
                  className="w-full"
                >
                  Reload Page
                </Button>
                <Button
                  variant="secondary"
                  onClick={() =>
                    this.setState({ hasError: false, error: null })
                  }
                  className="w-full"
                >
                  Try Again
                </Button>
              </Box>
              {this.state.error && (
                <Box className="mt-6 text-left p-3 bg-gray-100 rounded text-xs overflow-auto">
                  <Text size="xs" variant="muted">
                    {this.state.error.toString()}
                  </Text>
                </Box>
              )}
            </Card>
          </Box>
        </Box>
      );
    }

    return this.props.children;
  }
}
