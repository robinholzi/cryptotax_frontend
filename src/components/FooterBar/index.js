
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Copyright from '../copyright';

export const FooterWidget = () => {
  return (
    <Box sx={{ bgcolor: 'transparent', p: 6 }} component="footer">
      <Typography variant="h6" align="center" gutterBottom>
      CryptoTax
      </Typography>
      {/* <Typography
        variant="subtitle1"
        align="center"
        color="text.secondary"
        component="p"
      >
        Crypto portfolio analysis.
      </Typography> */}
      <Copyright />
    </Box>
  );
};
