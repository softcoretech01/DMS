import React, {
  useEffect,
  useState
} from 'react';

import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Grid
} from '@mui/material';

import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import {
  getAccessToken
} from '../utils/api';

import {
  usePermissions
} from '../context/PermissionContext';

import { useNavigate } from 'react-router-dom';

const DocumentListView = () => {
  const navigate = useNavigate();

const {
  hasPermission,
  permissions
} = usePermissions();

console.log(
  "PERMISSIONS =",
  permissions
);

console.log(
  "EDIT =",
  hasPermission(
    "Documents",
    "can_edit"
  )
);

console.log(
  "DELETE =",
  hasPermission(
    "Documents",
    "can_delete"
  )
);

console.log(
  "SHARE =",
  hasPermission(
    "Documents",
    "can_share"
  )
);

const [documents, setDocuments] = useState([]);
const [loading, setLoading] = useState(true);

const [anchorEl, setAnchorEl] = useState(null);
const [selectedDoc, setSelectedDoc] = useState(null);

const [editDialogOpen, setEditDialogOpen] = useState(false);

const [editFormData, setEditFormData] = useState({
  name: '',
  module: '',
  document_type: '',
  description: '',
  status: '',
  version: ''
});

const [clientFilter, setClientFilter] = useState('');
const [documentTypeFilter, setDocumentTypeFilter] = useState('');
const [tagFilter, setTagFilter] = useState('');
const [fromDate, setFromDate] = useState('');
const [toDate, setToDate] = useState('');

const [clients, setClients] = useState([]);
const [tags, setTags] = useState([]);
const [shareDialogOpen, setShareDialogOpen] = useState(false);

const [shareUser, setShareUser] = useState('');

const fetchDocuments = async () => {

  try {

    setLoading(true);

    const token = getAccessToken();

    const params = new URLSearchParams();

    if (clientFilter)
      params.append('client_id', clientFilter);

    if (documentTypeFilter)
      params.append('document_type', documentTypeFilter);

    if (tagFilter)
      params.append('tag', tagFilter);

    if (fromDate)
      params.append('from', fromDate);

    if (toDate)
      params.append('to', toDate);

    console.log(params.toString());

    const response = await fetch(
      `http://127.0.0.1:5000/api/documents/?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    setDocuments(
      Array.isArray(data)
        ? data
        : []
    );

  } catch (error) {

    console.error(error);

  } finally {

    setLoading(false);

  }

};

const fetchDropdowns = async () => {

  try {

    const token = getAccessToken();

    const clientsResponse = await fetch(
      'http://127.0.0.1:5000/api/clients/',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const tagsResponse = await fetch(
      'http://127.0.0.1:5000/api/tags/',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const clientsData = await clientsResponse.json();
    const tagsData = await tagsResponse.json();

    setClients(clientsData);
    setTags(tagsData);

  } catch (error) {

    console.error(error);

  }

};


const handleMenuOpen = (event, doc) => {

  

  setAnchorEl(event.currentTarget);

  setSelectedDoc(doc);

};

const handleMenuClose = () => {

  setAnchorEl(null);

};


const handleDownload = (documentId) => {

  window.open(
    `http://127.0.0.1:5000/api/documents/download/${documentId}`,
    '_blank'
  );

};


const handleEditOpen = () => {

  setEditFormData({

    name: selectedDoc?.name || '',
    module: selectedDoc?.module || '',
    document_type: selectedDoc?.document_type || '',
    description: selectedDoc?.description || '',
    status: selectedDoc?.status || '',
    version: selectedDoc?.version || ''

  });

  setEditDialogOpen(true);

  handleMenuClose();

};

const handleDelete = async () => {

  try {

    const token = getAccessToken();

    await fetch(
      `http://127.0.0.1:5000/api/documents/${selectedDoc.id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    alert('Document Deleted');

    fetchDocuments();

  } catch (error) {

    console.error(error);

  }

  handleMenuClose();

};
const handleShare = async () => {

  alert("SHARE CLICKED");

  try {

    const token = getAccessToken();

    console.log("SHARE FUNCTION STARTED");

    const response = await fetch(
  'http://127.0.0.1:5000/api/documents/share',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      document_id: selectedDoc.id,
      shared_to: shareUser
    
    })
  }
);

console.log("STATUS =", response.status);

const result = await response.json();

console.log("RESULT =", result);

alert('Document Shared');


  } catch (error) {

    console.error(error);

  }

};

useEffect(() => {

  fetchDocuments();

  fetchDropdowns();

    // eslint-disable-next-line react-hooks/exhaustive-deps


}, []);

const handleEditSave = async () => {

  try {

    const token = getAccessToken();

    await fetch(

      `http://127.0.0.1:5000/api/documents/${selectedDoc.id}`,

      {

        method: 'PUT',

        headers: {

          'Content-Type': 'application/json',

          Authorization: `Bearer ${token}`

        },

        body: JSON.stringify(editFormData)

      }

    );

    alert('Updated Successfully');

    setEditDialogOpen(false);

    fetchDocuments();

  } catch (error) {

    console.error(error);

  }

};

  return (

    

    <Box sx={{ p: 2 }}>

      {/* HEADER */}

      <Typography

        variant="h4"

        sx={{

          fontWeight: 'bold',

          mb: 3

        }}
      >

        Document List

      </Typography>

      {/* TABLE CARD */}

      <Card>

        <CardContent>

          {loading ? (

            <Typography>

              Loading...

            </Typography>

          ) : (
 <TableContainer
  component={Paper}
  sx={{
    overflowX: 'hidden'
  }}
>
  <Grid container spacing={2} sx={{ mb: 3 }}>

  <Grid item xs={3}>
    <TextField
      select
      fullWidth
      label="Client"
      value={clientFilter}
      onChange={(e) =>
        setClientFilter(e.target.value)
      }
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
  </Grid>

  <Grid item xs={3}>
  <TextField
    select
    fullWidth
    label="Tag"
    value={tagFilter}
    onChange={(e) =>
      setTagFilter(e.target.value)
    }
  >
    <MenuItem value="">
      All Tags
    </MenuItem>

    {tags.map((tag) => (
      <MenuItem
        key={tag.id}
        value={tag.name}
      >
        {tag.name}
      </MenuItem>
    ))}
  </TextField>
</Grid>


  <Grid item xs={2}>
    <TextField
      fullWidth
      type="date"
      label="From"
      InputLabelProps={{
        shrink: true
      }}
      value={fromDate}
      onChange={(e) =>
        setFromDate(e.target.value)
      }
    />
  </Grid>

  <Grid item xs={2}>
    <TextField
      fullWidth
      type="date"
      label="To"
      InputLabelProps={{
        shrink: true
      }}
      value={toDate}
      onChange={(e) =>
        setToDate(e.target.value)
      }
    />
  </Grid>


<Grid item xs={3}>
  <TextField
    fullWidth
    label="Document Type"
    value={documentTypeFilter}
    onChange={(e) =>
      setDocumentTypeFilter(e.target.value)
    }
  />
</Grid>

</Grid>


<Button
  variant="contained"
  onClick={fetchDocuments}
  sx={{ mb: 2 }}
>
  Apply Filters
</Button>


 <Table
  size="small"
  sx={{
    tableLayout: 'fixed',
    width: '100%'
  }}
>

                {/* TABLE HEAD */}

                <TableHead>

                  <TableRow>

                    <TableCell>ID</TableCell>

                    <TableCell sx={{ width: 350 }}>
                      File Name
                    </TableCell>

                    <TableCell>Module</TableCell>

                    <TableCell>Document Type</TableCell>

                    <TableCell>Description</TableCell>

                    <TableCell  sx={{ display: 'none' }}>
                       File Path
                    </TableCell>

                    <TableCell> Uploaded By </TableCell>

                    <TableCell> Upload Date</TableCell>

                    <TableCell>Status</TableCell>

                    <TableCell>Version</TableCell>

                    <TableCell
                      align="center"
                      sx={{
                        minWidth: '80px'
                      }}
                    >
                      Download
                    </TableCell>

                    <TableCell
  align="center"
  sx={{
    width: '150px'
  }}
>
                      Actions
                    </TableCell>

                  </TableRow>

                </TableHead>

                {/* TABLE BODY */}

               {/* TABLE BODY */}

<TableBody>

  {documents.length === 0 ? (

    <TableRow>

      <TableCell
        colSpan={12}
        align="center"
      >

        No documents found

      </TableCell>

    </TableRow>

  ) : (

    documents.map((doc) => (

      <TableRow
        key={doc.id}
        hover
      >

        <TableCell>
          {doc.id}
        </TableCell>

        <TableCell
          sx={{
           maxWidth: 350,
           whiteSpace: 'nowrap',
           overflow: 'hidden',
           textOverflow: 'ellipsis'
        }}
      >
        {doc.name}
        
      </TableCell>

        <TableCell>
          {doc.module}
        </TableCell>

        <TableCell>
          {doc.document_type}
        </TableCell>

        <TableCell>
          {doc.description}
        </TableCell>

        <TableCell  sx={{ display: 'none' }}>
          {doc.file_path}
        </TableCell>

        <TableCell>
          {doc.uploaded_by}
        </TableCell>

        <TableCell>
          {doc.upload_date}
        </TableCell>

        <TableCell>

          <Chip
            label={doc.status}
            color="primary"
            size="small"
          />

        </TableCell>

        <TableCell>
          {doc.version}
        </TableCell>

        <TableCell align="center">

          <Button
            size="small"
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={() =>
              handleDownload(doc.id)
            }
          >

            Download

          </Button>

        </TableCell>

        <TableCell align="center">

          <IconButton
            onClick={(e) =>
              handleMenuOpen(e, doc)
            }
            sx={{
              backgroundColor: '#eeeeee',
              border: '1px solid #999',
              width: '45px',
              height: '45px',
              cursor: 'pointer',
              zIndex: 9999
              
              
            }}
          >

            <MoreVertIcon
              sx={{
                color: '#000',
                fontSize: '28px'
              }}
            />

          </IconButton>

        </TableCell>

      </TableRow>

    ))

  )}

</TableBody>

              </Table>

            </TableContainer>

          )}

        </CardContent>

      </Card>

      {/* MENU */}

     <Menu
  anchorEl={anchorEl}
  open={Boolean(anchorEl)}
  onClose={handleMenuClose}
  anchorOrigin={{
    vertical: 'bottom',
    horizontal: 'right'
  }}
  transformOrigin={{
    vertical: 'top',
    horizontal: 'right'
     }}
  PaperProps={{
    sx: {
      zIndex: 99999
    }
  }}
> 
<MenuItem
  onClick={() => {
    navigate(`/documents/${selectedDoc?.id}`);
    handleMenuClose();
  }}
>
  View
</MenuItem>
  

  <MenuItem
    onClick={() =>
      handleDownload(selectedDoc?.id)
    }
  >
    Download
  </MenuItem>

  {
  hasPermission(
    'Documents',
    'can_edit'
  ) && (

    <MenuItem onClick={handleEditOpen}>
      <EditIcon sx={{ mr: 1 }} />
      Edit
    </MenuItem>

  )
}

  {
  hasPermission(
    'Documents',
    'can_delete'
  ) && (

    <MenuItem onClick={handleDelete}>
      <DeleteIcon sx={{ mr: 1 }} />
      Delete
    </MenuItem>

  )
}

 {
  hasPermission(
    'Documents',
    'can_share'
  ) && (

    <MenuItem
      onClick={() => {
        setShareDialogOpen(true);
        handleMenuClose();
      }}
    >
      Share
    </MenuItem>

  )
}

</Menu>

      {/* EDIT DIALOG */}

      <Dialog

        open={editDialogOpen}

        onClose={() =>

          setEditDialogOpen(false)

        }

        fullWidth

        maxWidth="sm"

      >

        <DialogTitle>

          Edit Document

        </DialogTitle>

        <DialogContent>

          <TextField

            fullWidth

            margin="normal"

            label="File Name"

            value={editFormData.name}

            onChange={(e) =>

              setEditFormData({

                ...editFormData,

                name: e.target.value

              })
            }
          />

          <TextField

            fullWidth

            margin="normal"

            label="Module"

            value={editFormData.module}

            onChange={(e) =>

              setEditFormData({

                ...editFormData,

                module: e.target.value

              })
            }
          />

          <TextField

            fullWidth

            margin="normal"

            label="Document Type"

            value={editFormData.document_type}

            onChange={(e) =>

              setEditFormData({

                ...editFormData,

                document_type: e.target.value

              })
            }
          />

          <TextField

            fullWidth

            multiline

            rows={4}

            margin="normal"

            label="Description"

            value={editFormData.description}

            onChange={(e) =>

              setEditFormData({

                ...editFormData,

                description: e.target.value

              })
            }
          />

          <TextField

            fullWidth

            margin="normal"

            label="Status"

            value={editFormData.status}

            onChange={(e) =>

              setEditFormData({

                ...editFormData,

                status: e.target.value

              })
            }
          />

          <TextField

            fullWidth

            margin="normal"

            label="Version"

            value={editFormData.version}

            onChange={(e) =>

              setEditFormData({

                ...editFormData,

                version: e.target.value

              })
            }
          />

        </DialogContent>

        <DialogActions>

          <Button

            onClick={() =>

              setEditDialogOpen(false)

            }
          >

            Cancel

          </Button>

          <Button

            variant="contained"

            onClick={handleEditSave}

          >

            Update

          </Button>

        </DialogActions>

      </Dialog>
      <Dialog
  open={shareDialogOpen}
  onClose={() => setShareDialogOpen(false)}
>
  <DialogTitle>
    Share Document
  </DialogTitle>

  <DialogContent>

    <TextField
      select
      fullWidth
      label="Select User"
      value={shareUser}
      onChange={(e) =>
        setShareUser(e.target.value)
      }
      sx={{ mt: 2 }}
    >

      <MenuItem value="manager">
        Manager
      </MenuItem>

      <MenuItem value="employee">
        Employee
      </MenuItem>

      <MenuItem value="admin">
        Admin
      </MenuItem>

      <MenuItem value="hr">
        HR
      </MenuItem>

    </TextField>

  </DialogContent>

  <DialogActions>

    <Button
      onClick={() =>
        setShareDialogOpen(false)
      }
    >
      Cancel
    </Button>

    <Button
      variant="contained"
      onClick={() => {

        handleShare();

        setShareDialogOpen(false);

      }}
    >
      Share
    </Button>

  </DialogActions>

</Dialog>

    </Box>
  );

}

export default DocumentListView;