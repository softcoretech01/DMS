import React, { useState,  useEffect
} from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Switch,
  FormControlLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem
} 
from '@mui/material';
import {
  Security as SecurityIcon,
  AdminPanelSettings as AdminIcon,
  GroupWork as PartnerIcon,
  ManageAccounts as ManagerIcon,
  Person as StaffIcon,
  Lock as RestrictedIcon,
} from '@mui/icons-material';
import { useDMS } from '../context/DMSContext';
import { ROLES, ROLE_PERMISSIONS, PERMISSIONS as PermissionConstants } 
from '../utils/constants';

const AccessControl = () => {

 const {
  users,
  currentUser
} = useDMS();

  const [rolePermissions, setRolePermissions] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

const [newUser, setNewUser] = useState({
  name: "",
  email: "",
  username: "",
  password: "",
  role_id: 4
});

const [openUserDialog, setOpenUserDialog] = useState(false);

  
 
  useEffect(() => {

  fetch("http://127.0.0.1:5000/api/permissions/")
    .then(res => res.json())
    .then(data => {

      console.log("ROLE PERMISSIONS =", data);

      setRolePermissions(data);

    })
    .catch(console.error);

}, []);
  useEffect(() => {

  fetch("http://127.0.0.1:5000/api/users/")
    .then(res => res.json())
    .then(data => {

      console.log("USERS =", data);

      setAllUsers(data);

    })
    .catch(console.error);

}, []);

  
  const getRoleIcon = (role) => {
    switch (role) {
      case ROLES.ADMIN:
        return <AdminIcon />;
      case ROLES.PARTNER:
        return <PartnerIcon />;
      case ROLES.MANAGER:
        return <ManagerIcon />;
      case ROLES.STAFF:
        return <StaffIcon />;
      case ROLES.CLIENT_RESTRICTED:
        return <RestrictedIcon />;
      default:
        return <SecurityIcon />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case ROLES.ADMIN:
        return 'error';
      case ROLES.PARTNER:
        return 'success';
      case ROLES.MANAGER:
        return 'warning';
      case ROLES.STAFF:
        return 'info';
      case ROLES.CLIENT_RESTRICTED:
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getAvailablePermissions = (role) => {
    return ROLE_PERMISSIONS[role] || [];
  };

  const updatePermission = async (
  roleId,
  screenId,
  permission,
  value
) => {

  try {

    await fetch(
      "http://127.0.0.1:5000/api/permissions/update",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          role_id: roleId,
          screen_id: screenId,
          permission,
          value
        })
      }
    );

    setRolePermissions(prev =>
      prev.map(row =>
        row.role_id === roleId &&
        row.screen_id === screenId
          ? {
              ...row,
              [permission]: value
            }
          : row
      )
    );

  } catch (error) {

    console.error(error);

  }

};

const groupedPermissions = rolePermissions.reduce(
  (acc, row) => {

    if (!acc[row.role_name]) {
      acc[row.role_name] = [];
    }

    acc[row.role_name].push(row);

    return acc;

  },
  {}
);

  const canManagePermissions = currentUser.role === ROLES.ADMIN;
  const createUser = async () => {

  try {

    const response = await fetch(
      "http://127.0.0.1:5000/api/users/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newUser)
      }
    );

    const data = await response.json();

    alert(data.message);

    window.location.reload();

  } catch (error) {

    console.error(error);

  }

};

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          Access Control & Permissions
        </Typography>
        <Typography color="text.secondary">
          Manage role-based access levels and document permissions
        </Typography>
      </Box>

      <Grid item xs={12}>
  <Card>
    <CardContent>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2
        }}
      >
       

      </Box>

    </CardContent>
  </Card>
</Grid>

      <Grid container spacing={3}>
        <Grid item xs={12}>
  <Card>
    <CardContent>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2
        }}
      >
        <Typography variant="h6">
          User Management
        </Typography>


      <Button
          variant="contained"
          onClick={() => setOpenUserDialog(true)}
      >
           Add User
      </Button>  



      </Box>

      <TableContainer component={Paper}>
        <Table>

          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>

            {allUsers.map(user => (

              <TableRow key={user.id}>

                <TableCell>
                  {user.id}
                </TableCell>

                <TableCell>
                  {user.name}
                </TableCell>

                <TableCell>
                  {user.email}
                </TableCell>

                <TableCell>
                  {user.role}
                </TableCell>

              </TableRow>

            ))}

          </TableBody>

        </Table>
      </TableContainer>

    </CardContent>
  </Card>
</Grid>
        {/* Role Overview */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                Role-Based Access Levels
              </Typography>
              <Grid container spacing={2}>
                {Object.values(ROLES).map(role => {
                  const rolePermissions = getAvailablePermissions(role);
                  return (
                    <Grid item xs={12} sm={6} md={4} lg={2.4} key={role}>
                      <Paper
                        sx={{
                          p: 2,
                          backgroundColor: 'action.hover',
                          borderLeft: '4px solid',
                          borderColor: `${getRoleColor(role)}.main`,
                          height: '100%',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          {getRoleIcon(role)}
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {role}
                          </Typography>
                          <Dialog
  open={openUserDialog}
  onClose={() => setOpenUserDialog(false)}
  maxWidth="sm"
  fullWidth
>
  <DialogTitle>
    Add New User
  </DialogTitle>

  <DialogContent>

    <TextField
      fullWidth
      margin="normal"
      label="Name"
      value={newUser.name}
      onChange={(e) =>
        setNewUser({
          ...newUser,
          name: e.target.value
        })
      }
    />

    <TextField
      fullWidth
      margin="normal"
      label="Email"
      value={newUser.email}
      onChange={(e) =>
        setNewUser({
          ...newUser,
          email: e.target.value
        })
      }
    />

    <TextField
      fullWidth
      margin="normal"
      label="Username"
      value={newUser.username}
      onChange={(e) =>
        setNewUser({
          ...newUser,
          username: e.target.value
        })
      }
    />

    <TextField
      fullWidth
      margin="normal"
      label="Password"
      type="password"
      value={newUser.password}
      onChange={(e) =>
        setNewUser({
          ...newUser,
          password: e.target.value
        })
      }
    />

    <TextField
      select
      fullWidth
      margin="normal"
      label="Role"
      value={newUser.role_id}
      onChange={(e) =>
        setNewUser({
          ...newUser,
          role_id: e.target.value
        })
      }
    >
      <MenuItem value={1}>Admin</MenuItem>
      <MenuItem value={3}>Manager</MenuItem>
      <MenuItem value={4}>Staff</MenuItem>
      <MenuItem value={5}>Client</MenuItem>
    </TextField>

  </DialogContent>

  <DialogActions>

    <Button
      onClick={() =>
        setOpenUserDialog(false)
      }
    >
      Cancel
    </Button>

    <Button
      variant="contained"
      onClick={createUser}
    >
      Save
    </Button>

  </DialogActions>

</Dialog>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          {rolePermissions.map(perm => (
                        <Typography key={perm}>
                           ✓ {perm}
                        </Typography>
                        ))} 
                        </Box>
                      </Paper>
                    </Grid>
                    
                  );
                })}
              </Grid>

              <Grid item xs={12}>
  <Card>
    <CardContent>

      <Typography
        variant="h6"
        sx={{
          mb: 2,
          fontWeight: "bold"
        }}
      >
        Database Permissions
      </Typography>

      {Object.entries(groupedPermissions).map(
        ([roleName, permissions]) => (

          <Paper
            key={roleName}
            sx={{
              p: 2,
              mb: 3
            }}
          >

            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: "primary.main"
              }}
            >
              {roleName}
            </Typography>

            {permissions.map(row => (

              <Box
                key={row.id}
                sx={{
                  mb: 2,
                  p: 2,
                  border: "1px solid #ddd",
                  borderRadius: 2
                }}
              >

                <Typography
                  sx={{
                    fontWeight: "bold",
                    mb: 1
                  }}
                >
                  {row.screen_name}
                </Typography>

                <FormControlLabel
                  control={
                    <Switch
                      checked={Number(row.can_view) === 1}
                      onChange={(e) =>
                        updatePermission(
                          row.role_id,
                          row.screen_id,
                          "can_view",
                          e.target.checked ? 1 : 0
                        )
                      }
                    />
                  }
                  label="View"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={Number(row.can_upload) === 1}
                      onChange={(e) =>
                        updatePermission(
                          row.role_id,
                          row.screen_id,
                          "can_upload",
                          e.target.checked ? 1 : 0
                        )
                      }
                    />
                  }
                  label="Upload"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={Number(row.can_edit) === 1}
                      onChange={(e) =>
                        updatePermission(
                          row.role_id,
                          row.screen_id,
                          "can_edit",
                          e.target.checked ? 1 : 0
                        )
                      }
                    />
                  }
                  label="Edit"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={Number(row.can_delete) === 1}
                      onChange={(e) =>
                        updatePermission(
                          row.role_id,
                          row.screen_id,
                          "can_delete",
                          e.target.checked ? 1 : 0
                        )
                      }
                    />
                  }
                  label="Delete"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={Number(row.can_share) === 1}
                      onChange={(e) =>
                        updatePermission(
                          row.role_id,
                          row.screen_id,
                          "can_share",
                          e.target.checked ? 1 : 0
                        )
                      }
                    />
                  }
                  label="Share"
                />

              </Box>

            ))}

          </Paper>

     ))}   

    </CardContent>
  </Card>
</Grid>
              
            </CardContent>
          </Card>
        </Grid>
        
        

      </Grid>
      
    
    </Box>
  );

};
export default AccessControl;
