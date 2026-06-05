import React, {

  useEffect,
  useState

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
  TextField,
  MenuItem

} from '@mui/material';

import {

  Description as DocumentIcon,
  Folder as FolderIcon,
  People as PeopleIcon,
  Business as ClientIcon

} from '@mui/icons-material';

import {

  getAccessToken

} from '../utils/api';

import {
  usePermissions
} from '../context/PermissionContext';


const Dashboard = () => {

  const [documents, setDocuments] = useState([]);
  const [clients, setClients] = useState([]);
  const [clientFilter, setClientFilter] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');
  const [documentTypeFilter, setDocumentTypeFilter] = useState('');

  const [stats, setStats] = useState({

    totalDocuments: 0,
    totalClients: 0,
    totalFolders: 0,
    totalUsers: 0

  });


  const fetchDashboardData = async () => {

    try {

      const token = getAccessToken();

      // DOCUMENTS

      const docResponse = await fetch(

        'http://127.0.0.1:5000/api/documents/',

        {

          headers: {

            Authorization: `Bearer ${token}`

          }

        }
      );

      const docs = await docResponse.json();

      console.log(

        'DOCUMENTS =>',

        docs

      );

      setDocuments(

        Array.isArray(docs)

          ? docs

          : []

      );

      // CLIENTS

      const clientResponse = await fetch(

        'http://127.0.0.1:5000/api/clients/'

      );

      const clients = await clientResponse.json();
      setClients(clients);

      // FOLDERS

      const folderResponse = await fetch(

        'http://127.0.0.1:5000/api/folders/'

      );

      const folders = await folderResponse.json();

      // USERS

      const userResponse = await fetch(

        'http://127.0.0.1:5000/api/users/'

      );

      const users = await userResponse.json();

      setStats({

        totalDocuments: Array.isArray(docs)
          ? docs.length
          : 0,

        totalClients: Array.isArray(clients)
          ? clients.length
          : 0,

        totalFolders: Array.isArray(folders)
          ? folders.length
          : 0,

        totalUsers: Array.isArray(users)
          ? users.length
          : 0

      });

    } catch (error) {

      console.error(error);
    }
  };
  const {
  hasPermission
} = usePermissions();

console.log(
  hasPermission(
    'Documents',
    'can_delete'
  )
);


  useEffect(() => {

    fetchDashboardData();

  }, []);


  return (

    <Box>

      {/* HEADER */}

      <Box sx={{ mb: 4 }}>

        <Typography

          variant="h4"

          sx={{

            fontWeight: 'bold',

            mb: 1

          }}
        >

          Dashboard

        </Typography>

        <Typography color="text.secondary">

          Live DMS Dashboard

        </Typography>
      <Box
  sx={{
    display: 'flex',
    gap: 2,
    mt: 3,
    mb: 3,
    flexWrap: 'wrap'
  }}
>

  <TextField
  select
  label="Client"
  size="small"
  value={clientFilter}
  onChange={(e) =>
    setClientFilter(e.target.value)
  }
  sx={{ minWidth: 200 }}
>

  <MenuItem value="">
    All Clients
  </MenuItem>

  {clients.map((client) => (

    <MenuItem
      key={client.id}
      value={client.id}
    >
      {client.name}
    </MenuItem>

  ))}

</TextField>

  

  <TextField
    select
    label="Module"
    size="small"
    value={moduleFilter}
    onChange={(e) =>
      setModuleFilter(e.target.value)
    }
    sx={{ minWidth: 200 }}
  >
    <MenuItem value="">
      All Modules
    </MenuItem>

    <MenuItem value="GST">
      GST
    </MenuItem>

    <MenuItem value="Bulk Upload">
      Bulk Upload
    </MenuItem>
  </TextField>

  <TextField
    select
    label="Document Type"
    size="small"
    value={documentTypeFilter}
    onChange={(e) =>
      setDocumentTypeFilter(e.target.value)
    }
    sx={{ minWidth: 200 }}
  >
    <MenuItem value="">
      All Types
    </MenuItem>

    <MenuItem value="PDF">
      PDF
    </MenuItem>

    <MenuItem value="DOCX">
      DOCX
    </MenuItem>

    <MenuItem value="ZIP">
      ZIP
    </MenuItem>
  </TextField>

</Box>  

      </Box>


      {/* STATS */}

      <Grid container spacing={3} sx={{ mb: 4 }}>

        {/* DOCUMENTS */}

        <Grid item xs={12} sm={6} md={3}>

          <Card>

            <CardContent>

              <DocumentIcon

                sx={{

                  fontSize: 40,

                  color: 'primary.main'

                }}
              />

              <Typography variant="h5">

                {stats.totalDocuments}

              </Typography>

              <Typography color="text.secondary">

                Documents

              </Typography>

            </CardContent>

          </Card>

        </Grid>


        {/* CLIENTS */}

        <Grid item xs={12} sm={6} md={3}>

          <Card>

            <CardContent>

              <ClientIcon

                sx={{

                  fontSize: 40,

                  color: 'success.main'

                }}
              />

              <Typography variant="h5">

                {stats.totalClients}

              </Typography>

              <Typography color="text.secondary">

                Clients

              </Typography>

            </CardContent>

          </Card>

        </Grid>


        {/* FOLDERS */}

        <Grid item xs={12} sm={6} md={3}>

          <Card>

            <CardContent>

              <FolderIcon

                sx={{

                  fontSize: 40,

                  color: 'warning.main'

                }}
              />

              <Typography variant="h5">

                {stats.totalFolders}

              </Typography>

              <Typography color="text.secondary">

                Folders

              </Typography>

            </CardContent>

          </Card>

        </Grid>


        {/* USERS */}

        <Grid item xs={12} sm={6} md={3}>

          <Card>

            <CardContent>

              <PeopleIcon

                sx={{

                  fontSize: 40,

                  color: 'info.main'

                }}
              />

              <Typography variant="h5">

                {stats.totalUsers}

              </Typography>

              <Typography color="text.secondary">

                Users

              </Typography>

            </CardContent>

          </Card>

        </Grid>

      </Grid>


      {/* RECENT DOCUMENTS */}

      <Card>

        <CardContent>

          <Typography

            variant="h6"

            sx={{

              mb: 2,

              fontWeight: 'bold'

            }}
          >

            Recent Documents

          </Typography>


          <TableContainer component={Paper}>

            <Table>

              <TableHead>

                <TableRow>

                  <TableCell>
                    ID
                  </TableCell>

                  <TableCell>
                    File Name
                  </TableCell>

                  <TableCell>
                    Module
                  </TableCell>

                  <TableCell>
                    Type
                  </TableCell>

                  <TableCell>
                    Description
                  </TableCell>

                </TableRow>

              </TableHead>


              <TableBody>

                {Array.isArray(documents) &&

                  documents.map((doc) => (

                    <TableRow key={doc.id}>

                      <TableCell>
                        {doc.id}
                      </TableCell>

                      <TableCell>
                        {doc.name}
                      </TableCell>

                      <TableCell>
                        {doc.module}
                      </TableCell>

                      <TableCell>

                        <Chip

                          label={doc.document_type}

                          color="primary"

                          size="small"

                        />

                      </TableCell>

                      <TableCell>
                        {doc.description}
                      </TableCell>

                    </TableRow>

                  ))}

              </TableBody>

            </Table>

          </TableContainer>

        </CardContent>

      </Card>

    </Box>
  );
};

export default Dashboard;