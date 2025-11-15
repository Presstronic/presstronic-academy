/**
 * @file
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import { Box, Button, Typography } from '@mui/material';
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router-dom';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary component for catching React errors
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('Error caught by ErrorBoundary:', error, errorInfo);
    }

    // In production, you could send this to an error tracking service
    // e.g., Sentry, LogRocket, etc.
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

/**
 * Error fallback component displayed when an error occurs
 */
function ErrorFallback({ error }: { error: Error | null }) {
  const navigate = useNavigate();

  // Only show error details in development
  const showDetails = import.meta.env.DEV;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#0d0208',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
          py: 4,
          px: 2,
          maxWidth: '600px',
        }}
      >
        <Typography
          variant="h1"
          sx={{
            color: '#ff0000',
            textShadow: '0 0 10px #ff0000',
            fontFamily: 'monospace',
            fontSize: { xs: '3rem', sm: '4rem', md: '5rem' },
            fontWeight: 'bold',
          }}
        >
          ERROR
        </Typography>

        <Typography
          variant="h5"
          sx={{
            color: '#00ff41',
            textShadow: '0 0 10px #00ff41',
            fontFamily: 'monospace',
            fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
            textAlign: 'center',
          }}
        >
          Something went wrong
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: '#00ff41',
            opacity: 0.8,
            fontFamily: 'monospace',
            fontSize: { xs: '0.85rem', sm: '1rem' },
            textAlign: 'center',
          }}
        >
          {showDetails && error
            ? `Error: ${error.message}`
            : "We're experiencing technical difficulties. Please try again later."}
        </Typography>

        {showDetails && error?.stack && (
          <Box
            component="pre"
            sx={{
              color: '#00ff41',
              opacity: 0.6,
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              textAlign: 'left',
              maxWidth: '100%',
              overflow: 'auto',
              p: 2,
              bgcolor: 'rgba(0, 255, 65, 0.1)',
              borderRadius: 1,
              border: '1px solid rgba(0, 255, 65, 0.3)',
            }}
          >
            {error.stack}
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => window.location.reload()}
            sx={{
              bgcolor: '#003b00',
              color: '#00ff41',
              border: '2px solid #00ff41',
              fontFamily: 'monospace',
              fontSize: { xs: '0.9rem', sm: '1rem' },
              fontWeight: 'bold',
              px: { xs: 3, sm: 4 },
              py: { xs: 1.5, sm: 2 },
              '&:hover': {
                bgcolor: '#005000',
                boxShadow: '0 0 20px #00ff41',
              },
            }}
          >
            Reload Page
          </Button>

          <Button
            variant="outlined"
            size="large"
            onClick={() => {
              void navigate('/');
            }}
            sx={{
              color: '#00ff41',
              border: '2px solid #00ff41',
              fontFamily: 'monospace',
              fontSize: { xs: '0.9rem', sm: '1rem' },
              fontWeight: 'bold',
              px: { xs: 3, sm: 4 },
              py: { xs: 1.5, sm: 2 },
              '&:hover': {
                border: '2px solid #00ff41',
                bgcolor: 'rgba(0, 255, 65, 0.1)',
                boxShadow: '0 0 20px #00ff41',
              },
            }}
          >
            Go Home
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

/**
 * Router error element component
 * Used with React Router's errorElement prop
 */
export function RouterErrorElement() {
  const error = useRouteError();

  // Handle route errors (404, etc.)
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      // This will be handled by the NotFoundPage route
      return null;
    }

    return (
      <ErrorFallback
        error={new Error(`${error.status} ${error.statusText}: ${error.data ?? ''}`)}
      />
    );
  }

  // Handle generic errors
  if (error instanceof Error) {
    return <ErrorFallback error={error} />;
  }

  // Unknown error type
  return <ErrorFallback error={new Error('An unexpected error occurred')} />;
}
