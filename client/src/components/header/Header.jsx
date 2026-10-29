import { useState, useContext } from 'react';
import { AppBar, Box, Toolbar, IconButton, Menu, Container, Button, MenuItem } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import Logo from '../../assets/logo-transparent.png';
import LogoDark from '../../assets/logo-transparent-dark.png';

import { API } from '../../service/api';
import { DataContext } from '../../context/DataProvider';
import { useColorMode } from '../../context/ColorModeContext';
import { getAccessToken, getRefreshToken } from '../../utils/common-utils';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' }
];

const menuTextSx = {
  fontFamily: "'Cinzel', 'Times New Roman', serif",
  fontSize: 15,
  fontWeight: 500,
  letterSpacing: '0.05em'
};

const ResponsiveAppBar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const navigate = useNavigate();
  const { setAccount } = useContext(DataContext);
  const { mode, toggleColorMode } = useColorMode();

  const isLoggedIn = Boolean(getAccessToken());

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const logout = async () => {
    try {
      const token = getRefreshToken();
      if (token) {
        await API.userLogout({ token });
      }
    } finally {
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      setAccount({ name: '', username: '' });
      handleCloseNavMenu();
      navigate('/login');
    }
  };

  return (
    <AppBar position="fixed" sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{ minHeight: { xs: 72, sm: 84, md: 116, lg: 140 } }}
        >
          <Box
            component={Link}
            to="/"
            sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
          >
            <Box
              component="img"
              src={mode === 'dark' ? LogoDark : Logo}
              alt="Zen e Zenzero"
              sx={{ height: { xs: 56, sm: 64, md: 96, lg: 120 }, width: 'auto' }}
            />
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }} />

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
            {navLinks.map((link) => (
              <Button
                key={link.label}
                component={Link}
                to={link.path}
                sx={{ ...menuTextSx, my: 2, color: 'text.primary', display: 'block' }}
              >
                {link.label}
              </Button>
            ))}
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            {isLoggedIn ? (
              <>
                <Button component={Link} to="/create" sx={{ ...menuTextSx, my: 2, color: 'text.primary' }}>
                  Create
                </Button>
                <Button onClick={logout} sx={{ ...menuTextSx, my: 2, color: 'text.primary' }}>
                  Logout
                </Button>
              </>
            ) : (
              <Button
                component={Link}
                to="/login"
                sx={{
                  ...menuTextSx,
                  my: 2,
                  color: 'text.primary',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0.25,
                  lineHeight: 1.2
                }}
              >
                <PersonOutlineIcon sx={{ fontSize: 24 }} />
                Login
              </Button>
            )}
          </Box>

          <IconButton
            size="large"
            onClick={toggleColorMode}
            aria-label={mode === 'dark' ? 'Attiva tema chiaro' : 'Attiva tema scuro'}
            sx={{ color: 'text.primary', ml: { xs: 0, md: 1 } }}
          >
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>

          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="apri menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{ color: mode === 'dark' ? 'text.primary' : 'secondary.main' }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {navLinks.map((link) => (
                <MenuItem
                  key={link.label}
                  component={Link}
                  to={link.path}
                  onClick={handleCloseNavMenu}
                  sx={menuTextSx}
                >
                  {link.label}
                </MenuItem>
              ))}
              {isLoggedIn ? [
                <MenuItem key="create" component={Link} to="/create" onClick={handleCloseNavMenu} sx={menuTextSx}>
                  Create
                </MenuItem>,
                <MenuItem key="logout" onClick={logout} sx={menuTextSx}>Logout</MenuItem>
              ] : (
                <MenuItem component={Link} to="/login" onClick={handleCloseNavMenu} sx={menuTextSx}>
                  Login
                </MenuItem>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default ResponsiveAppBar;
