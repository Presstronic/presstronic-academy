/**
 * @file
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface ErrorPageProps {
  title?: string;
  message?: string;
  showReload?: boolean;
}

/**
 * Generic error page for server/application errors
 */
export default function ErrorPage({
  title = 'Server Error',
  message = "We're experiencing technical difficulties. Please try again later.",
  showReload = true,
}: ErrorPageProps) {
  const navigate = useNavigate();

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
          500
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
          {title}
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
          {message}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          {showReload && (
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
          )}

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
