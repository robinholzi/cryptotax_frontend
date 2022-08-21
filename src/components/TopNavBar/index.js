
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Link } from 'react-router-dom';
import { Launch } from '@mui/icons-material';
import { link_portfolios, link_root } from '../../links/links';
import { orange } from '@mui/material/colors';
import { Grid } from '@mui/material';

const pages = ['Portfolios'];  // TODO: 'Upgrade to Premium 💎'
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const TopNavBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link to={link_root} style={{ textDecoration: 'none' }}>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ color: "white", mr: 2, 
                  display: { xs: 'none', md: 'flex' } }}
            >
              CryptoTax 🪙
            </Typography>
          </Link>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <Link key={page} to={link_portfolios}> 
                  <Launch color='primary' />
                </Link>
                // <MenuItem key={page} onClick={handleCloseNavMenu}>
                //   <Typography textAlign="center">{page}</Typography>
                // </MenuItem>
              ))}
            </Menu>
          </Box>
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <Grid item>
            <Link to={link_root} style={{ textDecoration: 'none' }}
              component="span"
              sx={{ flexGrow: 1, display: { xs: 'span', md: 'none' }, color: 'white' }}
            >
              <Typography
                variant="h6"
                noWrap
                component="span"
                onClick={() => window.location = (window.location.origin)}
                sx={{ flexGow: 1, display: { xs: 'span', md: 'none' }, color: 'white' }}
              >
                CryptoTax 🪙
              </Typography>
            </Link>
            </Grid>   
            
          </Grid> 
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
                <Link key={page} to={link_portfolios} style={{ textDecoration: 'none' }}>
                  <Button sx={{ color: 'white' }}> 
                    <Typography textAlign="center">{page}</Typography>
                  </Button>
                </Link>
              // <Button
              //   key={page}
              //   onClick={handleCloseNavMenu}
              //   sx={{ my: 2, color: 'white', display: 'block' }}
              // >
              //   {page}
              // </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default TopNavBar;
