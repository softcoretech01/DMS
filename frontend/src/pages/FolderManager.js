import React, {
  useEffect,
  useState
} from 'react';

import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';

import FolderIcon from '@mui/icons-material/Folder';

const FolderManager = () => {

  const [folders, setFolders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [openDialog, setOpenDialog] = useState(false);

  const [formData, setFormData] = useState({

    client_id: '',
    client_name: '',
    financial_year: '',
    custom_folder: ''


  });

  const fetchFolders = async () => {

    try {

      const response = await fetch(

        'http://127.0.0.1:5000/api/folders/'

      );

      const data = await response.json();

      setFolders(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    fetchFolders();

  }, []);

  const handleCreate = () => {

    setFormData({

      client_id: '',
      client_name: '',
      financial_year: ''

    });

    setOpenDialog(true);
  };

  



const handleSave = async () => {

  try {

    await fetch(

      'http://127.0.0.1:5000/api/folders/',

      {

        method: 'POST',

        headers: {

          'Content-Type': 'application/json'

        },

        body: JSON.stringify({

          client_id: formData.client_id,
          client_name: formData.client_name,
          financial_year: formData.financial_year,
          custom_folder: formData.custom_folder


        })

      }

    );
    setFormData({

  client_id: '',
  client_name: '',
  financial_year: ''

  

});


setOpenDialog(false);

await fetchFolders();

  } catch (error) {

    console.error(error);

  }

};

  

  const renderTree = (parentId = null, level = 0) => {

    return folders

      .filter(
        folder =>
          folder.parent_id === parentId
      )

      .map(folder => (

        <Box key={folder.id}>

          <ListItem
            sx={{
              pl: level * 4,
              borderRadius: 2,
              mb: 1,
              backgroundColor:
                level === 0
                  ? '#f3f6ff'
                  : '#fafafa'
            }}
  
          >

            <FolderIcon
              sx={{
                mr: 2,
                color:
                  level === 0
                    ? '#1976d2'
                    : '#ff9800'
              }}
            />

            <ListItemText

              primary={folder.name}

              secondary={

                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    mt: 1,
                    flexWrap: 'wrap'
                  }}
                >

                  <Chip
                    label={folder.type}
                    size="small"
                    color="primary"
                  />

                  <Chip
                    label={`FY ${folder.financial_year}`}
                    size="small"
                    color="secondary"
                  />

                </Box>

              }

            />

          </ListItem>

          {renderTree(
            folder.id,
            level + 1
          )}

        </Box>
      ));
  };

  return (

    <Box sx={{ p: 3 }}>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3
        }}
      >

        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold'
          }}
        >
          Folder Manager
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Create Client Folder
        </Button>

      </Box>

      <Card>

        <CardContent>

          {loading ? (

            <Typography>
              Loading folders...
            </Typography>

          ) : (

            <>

              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: 'bold'
                }}
              >
                Folder Structure
              </Typography>

              <Divider sx={{ mb: 2 }} />

              <List>

                {renderTree()}

              </List>

            </>

          )}

        </CardContent>

      </Card>


      <Dialog
        open={openDialog}
        onClose={() =>
          setOpenDialog(false)
        }
        fullWidth
        maxWidth="sm"
      >

        <DialogTitle>

          Create Folder Structure

        </DialogTitle>

        <DialogContent>

          <TextField
            fullWidth
            margin="normal"
            label="Client ID"
            value={formData.client_id}
            onChange={(e) =>
              setFormData({

                ...formData,

                client_id: e.target.value

              })
            }
          />

          <TextField
            fullWidth
            margin="normal"
            label="Client Name"
            value={formData.client_name}
            onChange={(e) =>
              setFormData({

                ...formData,

                client_name: e.target.value

              })
            }
          />

          <TextField
            fullWidth
            margin="normal"
            label="Financial Year"
            value={formData.financial_year}
            onChange={(e) =>
              setFormData({

                ...formData,

                financial_year: e.target.value

              })
            }
          />

          <TextField
  fullWidth
  margin="normal"
  label="Custom Folder Name"
  value={formData.custom_folder}
  onChange={(e) =>
    setFormData({
      ...formData,
      custom_folder: e.target.value
    })
  }
/>

        </DialogContent>

        <DialogActions>

          <Button
            onClick={() =>
              setOpenDialog(false)
            }
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSave}
          >
            Save
          </Button>

        </DialogActions>

      </Dialog>

    </Box>
  );
};

export default FolderManager;