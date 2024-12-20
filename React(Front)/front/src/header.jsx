import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  CssBaseline,
  Typography,
  Link,
  TextField,
  InputAdornment,
  Button,
  IconButton,
  Badge,
} from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';

function Header() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  // Fonction de recherche
  const handleSearch = () => {
    if (search.trim()) {
      navigate(`/search?query=${encodeURIComponent(search)}`);
      setSearch(''); // Réinitialise le champ de recherche après la soumission
    }
  };

  

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{
          backgroundColor: '#f4f4f4',
          borderBottom: '1px solid #ddd',
          paddingBottom: 2,
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '16px' }}>
          {/* Titre principal */}
          <Typography
            variant="h6"
            color="inherit"
            sx={{
              flexGrow: 1,
              fontWeight: 'bold',
              textDecoration: 'none',
            }}
          >
            <Link
              component={NavLink}
              to="/"
              underline="none"
              color="textPrimary"
              sx={{
                fontWeight: 'bold',
                fontSize: '1.5rem',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              Coupi&apos;s Shop
            </Link>
          </Typography>

          {/* Barre de recherche */}
          <TextField
            
            variant="outlined"
            placeholder="Search..."
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()} // Déclenchement sur Entrée
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon
                    sx={{ cursor: 'pointer', fontSize: '1.5rem', color: 'primary.main' }}
                    onClick={handleSearch}
                  />
                </InputAdornment>
              ),
            }}
            sx={{
              marginRight: 15,
              marginTop:1,
              width: '300px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '25px', // Bordure arrondie
                border: '1px solid #ddd', // Bordure plus nette
                '&:hover': {
                  borderColor: 'primary.main', // Changement de couleur lors du survol
                },
              },
            }}
          />

          {/* Icône de panier */}
          <IconButton
            component={NavLink}
            to="/cart"
            color="inherit"
            sx={{
              marginRight: 2,
              '&.active': {
                color: 'primary.main',
              },
            }}
          >
            <Badge  color="primary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          {/* Navigation et boutons */}
          <div>
            <Button
              variant="outlined"
              color="primary"
              component={NavLink}
              to="/register"
              sx={{
                marginRight: 1,
                textTransform: 'none',
                color: 'primary.main',
                borderColor: 'primary.main',
                borderRadius: '25px', 
                '&.active': {
                  borderColor: 'primary.main',
                },
              }}
            >
              Register
            </Button>
            <Button
              variant="outlined"
              color="primary"
              component={NavLink}
              to="/login"
              sx={{
                marginRight: 1,
                textTransform: 'none',
                color: 'primary.main',
                borderColor: 'primary.main',
                borderRadius: '25px', 
                '&.active': {
                  borderColor: 'primary.main',
                },
              }}
            >
              Login
            </Button>
            <Button
              variant="outlined"
              color="primary"
              component={NavLink}
              to="/admin"
              sx={{
                marginRight: 1,
                textTransform: 'none',
                color: 'primary.main',
                borderColor: 'primary.main',
                borderRadius: '25px', 
                '&.active': {
                  borderColor: 'primary.main',
                },
              }}
            >
              Admin
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              component={NavLink}
              to="/logout"
              sx={{
                textTransform: 'none',
                color: 'secondary.main',
                borderColor: 'secondary.main',
                borderRadius: '25px', 
                '&.active': {
                  borderColor: 'secondary.main',
                },
              }}
            >
              Logout
            </Button>
          </div>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}

export default Header;
