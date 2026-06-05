import React, {
  useState
} from 'react';

import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem
} from '@mui/material';

const Login = () => {

  const [formData, setFormData] = useState({

    username: '',
    password: '',
    role: ''

  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value

    });
  };

  const handleLogin = async () => {

    try {

      setLoading(true);

      const response = await fetch(

        'http://127.0.0.1:5000/api/auth/login',

        {

          method: 'POST',

          headers: {

            'Content-Type': 'application/json'

          },

          body: JSON.stringify(formData)

        }
      );

      const data = await response.json();

      console.log(data);

      if (!response.ok) {

        alert(

          data.error || 'Login failed'

        );

        return;
      }

      // SAVE TOKEN

      localStorage.setItem(

        'token',

        data.token

      );

      // SAVE USER

      localStorage.setItem(

        'user',

        JSON.stringify(data.user)

      );

      // CHECK TOKEN

      const savedToken = localStorage.getItem(

        'token'

      );

      console.log(

        'SAVED TOKEN =>',

        savedToken

      );

      if (savedToken) {

        setTimeout(() => {

  window.location.href = '/home';

}, 500);

      } else {

        alert(

          'Token not saved'

        );

      }

    } catch (error) {

      console.error(error);

      alert(

        'Server error'

      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <Box

      sx={{

        height: '100vh',

        display: 'flex',

        justifyContent: 'center',

        alignItems: 'center',

        backgroundColor: '#f5f5f5'

      }}
    >

      <Card

        sx={{

          width: 400,

          borderRadius: 3,

          boxShadow: 5

        }}
      >

        <CardContent sx={{ p: 4 }}>

          <Typography

            variant="h4"

            sx={{

              fontWeight: 'bold',

              textAlign: 'center',

              mb: 1

            }}
          >

            DMS Login

          </Typography>

          <Typography

            variant="body2"

            color="text.secondary"

            sx={{

              textAlign: 'center',

              mb: 3

            }}
          >

            Document Management System

          </Typography>

          <TextField

            fullWidth

            label="Username"

            name="username"

            margin="normal"

            value={formData.username}

            onChange={handleChange}

          />

          <TextField

            fullWidth

            label="Password"

            type="password"

            name="password"

            margin="normal"

            value={formData.password}

            onChange={handleChange}

          />

          <TextField

            select

            fullWidth

            label="Role"

            name="role"

            margin="normal"

            value={formData.role}

            onChange={handleChange}

          >

            <MenuItem value="Admin">
              Admin
            </MenuItem>

            <MenuItem value="Manager">
              Manager
            </MenuItem>

            <MenuItem value="Staff">
              Staff
            </MenuItem>

            <MenuItem value="Client-restricted">
              Client-restricted
            </MenuItem>

            

          </TextField>

          <Button

            fullWidth

            variant="contained"

            sx={{

              mt: 3,

              py: 1.3,

              fontWeight: 'bold'

            }}

            onClick={handleLogin}

            disabled={loading}

          >

            {

              loading

                ? 'Logging in...'

                : 'Login'

            }

          </Button>

        </CardContent>

      </Card>

    </Box>
  );
};

export default Login;