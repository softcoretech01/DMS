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
  Button,
  Checkbox,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';

import {
  CloudUpload as UploadIcon,
  Download as DownloadIcon,
  Folder as FolderIcon
} from '@mui/icons-material';

import {
  getAccessToken
} from '../utils/api';

const BulkOperations = () => {

  const [documents, setDocuments] = useState([]);

  const [folders, setFolders] = useState([]);

  const [selectedDocuments, setSelectedDocuments] = useState([]);

  const [loading, setLoading] = useState(false);

  const [successMessage, setSuccessMessage] = useState('');

  const [zipFile, setZipFile] = useState(null);

  const fetchDocuments = async () => {

    try {

      const token = getAccessToken();

      const response = await fetch(

        'http://127.0.0.1:5000/api/documents/',

        {

          headers: {

            Authorization: `Bearer ${token}`

          }

        }
      );

      const data = await response.json();

      setDocuments(data);

    } catch (error) {

      console.error(error);
    }
  };

  const fetchFolders = async () => {

    try {

      const response = await fetch(

        'http://127.0.0.1:5000/api/folders/'

      );

      const data = await response.json();

      setFolders(data);

    } catch (error) {

      console.error(error);
    }
  };

  useEffect(() => {

    fetchDocuments();

    fetchFolders();

  }, []);

  const handleSelectDocument = (id) => {

    setSelectedDocuments((prev) =>

      prev.includes(id)

        ? prev.filter(docId => docId !== id)

        : [...prev, id]
    );
  };

  const handleSelectAll = () => {

    if (

      selectedDocuments.length === documents.length

    ) {

      setSelectedDocuments([]);

    } else {

      setSelectedDocuments(

        documents.map(doc => doc.id)
      );
    }
  };

  const handleBulkDownload = async () => {

    try {

      setLoading(true);

      const selectedDocs = documents.filter(doc =>

        selectedDocuments.includes(doc.id)
      );

      const filenames = selectedDocs.map(doc => doc.name);

      const response = await fetch(

        'http://127.0.0.1:5000/api/bulk/download',

        {

          method: 'POST',

          headers: {

            'Content-Type': 'application/json'

          },

          body: JSON.stringify({

            documents: filenames

          })
        }
      );

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');

      a.href = url;

      a.download = 'bulk_download.zip';

      a.click();

      setSuccessMessage(

        'Bulk download successful'
      );

      setSelectedDocuments([]);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);
    }
  };

  const handleFolderDownload = async (folderId) => {

    try {

      const response = await fetch(

        `http://127.0.0.1:5000/api/bulk/folder/${folderId}`

      );

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');

      a.href = url;

      a.download = `folder_${folderId}.zip`;

      a.click();

      setSuccessMessage(

        'Folder download successful'
      );

    } catch (error) {

      console.error(error);
    }
  };

  const handleZipUpload = async () => {

  if (!zipFile) return;

  

  const formData = new FormData();

  formData.append(
    'file',
    zipFile
  );

  try {

    setLoading(true);

    const response = await fetch(
      'http://127.0.0.1:5000/api/bulk/upload',
      {
        method: 'POST',
        body: formData
      }
    );

    const result = await response.json();

    console.log(result);

    setSuccessMessage(
      'ZIP uploaded successfully'
    );

    window.location.reload();

    fetchDocuments();

  } catch (error) {

    console.error(error);

  } finally {

    setLoading(false);

  }

};

  return (

    <Box sx={{ p: 3 }}>

      <Typography
        variant="h4"
        sx={{
          fontWeight: 'bold',
          mb: 3
        }}
      >
        Bulk Operations
      </Typography>

      {successMessage && (

        <Alert
          severity="success"
          sx={{ mb: 3 }}
        >
          {successMessage}
        </Alert>
      )}

      <Grid container spacing={3}>

        <Grid item xs={12} md={6}>

          <Card>

            <CardContent>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 2
                }}
              >

                <UploadIcon color="primary" />

                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 'bold'
                  }}
                >
                  Bulk Upload ZIP
                </Typography>

              </Box>

              <input
  type="file"
  accept=".zip"
  onChange={(e) =>
    setZipFile(e.target.files[0])
  }
/>

<Button
  variant="contained"
  sx={{ mt: 2 }}
  startIcon={<UploadIcon />}
  disabled={!zipFile}
  onClick={handleZipUpload}
>
  Upload ZIP
</Button>

            

            </CardContent>

          </Card>

        </Grid>

        <Grid item xs={12} md={6}>

          <Card>

            <CardContent>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  mb: 2
                }}
              >
                Bulk Download
              </Typography>

              <Button

                fullWidth

                variant="contained"

                startIcon={<DownloadIcon />}

                disabled={
                  selectedDocuments.length === 0
                }

                onClick={handleBulkDownload}

              >

                Download Selected

              </Button>

            </CardContent>

          </Card>

        </Grid>

      </Grid>

      <Card sx={{ mt: 4 }}>

        <CardContent>

          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: 'bold'
            }}
          >
            Select Documents to Download
          </Typography>

          <TableContainer component={Paper}>

            <Table>

              <TableHead>

                <TableRow>

                  <TableCell>

                    <Checkbox

                      checked={

                        selectedDocuments.length === documents.length

                      }

                      onChange={handleSelectAll}

                    />

                  </TableCell>

                  <TableCell>
                    File Name
                  </TableCell>

                  <TableCell>
                    Module
                  </TableCell>

                  <TableCell>
                    Document Type
                  </TableCell>

                  <TableCell>
                    Status
                  </TableCell>

                </TableRow>

              </TableHead>

              <TableBody>

                {documents.map((doc) => (

                  <TableRow key={doc.id} hover>

                    <TableCell>

                      <Checkbox

                        checked={

                          selectedDocuments.includes(doc.id)

                        }

                        onChange={() =>

                          handleSelectDocument(doc.id)

                        }

                      />

                    </TableCell>

                    <TableCell>
                      {doc.name}
                    </TableCell>

                    <TableCell>
                      {doc.module}
                    </TableCell>

                    <TableCell>
                      {doc.document_type}
                    </TableCell>

                    <TableCell>
                      {doc.status}
                    </TableCell>

                  </TableRow>

                ))}

              </TableBody>

            </Table>

          </TableContainer>

        </CardContent>

      </Card>

      <Card sx={{ mt: 4 }}>

        <CardContent>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 2
            }}
          >

            <FolderIcon color="primary" />

            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold'
              }}
            >
              Folder Level Download
            </Typography>

          </Box>

          <Grid container spacing={2}>

            {folders.map((folder) => (

              <Grid
                item
                xs={12}
                md={4}
                key={folder.id}
              >

                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >

                  <Box>

                    <Typography
                      sx={{
                        fontWeight: 'bold'
                      }}
                    >
                      {folder.name}
                    </Typography>

                    <Typography
                      variant="caption"
                    >
                      {folder.type}
                    </Typography>

                  </Box>

                  <Button

                    size="small"

                    startIcon={<DownloadIcon />}

                    onClick={() =>

                      handleFolderDownload(folder.id)

                    }

                  >

                    Download

                  </Button>

                </Paper>

              </Grid>

            ))}

          </Grid>

        </CardContent>

      </Card>

      {loading && (

        <Box
          sx={{
            mt: 3,
            textAlign: 'center'
          }}
        >

          <CircularProgress />

        </Box>

      )}

    </Box>
  );
};

export default BulkOperations;