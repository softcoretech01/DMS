import React, {
  useState,
  useEffect
} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Chip,

  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Share as ShareIcon,

  ArrowBack as BackIcon,
  Upload as UploadIcon,
} from '@mui/icons-material';

import { getAccessToken } from '../utils/api';
const DocumentDetailView = () => {
const { id } = useParams();
console.log("ROUTE ID =", id);
const navigate = useNavigate();
const canEditDocument = () => true;
  const [document, setDocument] = useState(null);
  const [versionHistory, setVersionHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [addVersionDialogOpen, setAddVersionDialogOpen] = useState(false);
  const [newVersionFile, setNewVersionFile] = useState(null);
  const [shareUser, setShareUser] = useState('');

  useEffect(() => {

  const fetchDocument = async () => {

    try {

      const token = getAccessToken();

      const response = await fetch(
        `http://127.0.0.1:5000/api/documents/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();
      console.log("DOCUMENT DATA =", data);
      console.log("FULL DOCUMENT =", data);


      setDocument(data);

      const versionResponse = await fetch(
  `http://127.0.0.1:5000/api/documents/versions/${id}`,
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);

const versionData = await versionResponse.json();

console.log(
  "VERSION HISTORY =",
  versionData
);

setVersionHistory(versionData);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  fetchDocument();

}, [id]);

if (loading) {

  return (
    <Typography>
      Loading...
    </Typography>
  );

}

  if (!document) {
    return (
      <Box sx={{ textAlign: 'center', py: 5 }}>
        <Typography variant="h5" color="error" sx={{ mb: 2 }}>
          Document not found
        </Typography>
        <Button onClick={() => navigate('/documents')} startIcon={<BackIcon />}>
          Back to Documents
        </Button>
      </Box>
    );
  }

  const linkedRecords =
  document.linked_records || [];  


  const handleDownload = () => {

  window.open(
    `http://127.0.0.1:5000/api/documents/download/${document.id}`,
    '_blank'
  );

};

  const handleShare = () => {
    setShareDialogOpen(true);
  };

  const handleShareSubmit = async () => {

  try {

    const token = getAccessToken();

    const response = await fetch(
      'http://127.0.0.1:5000/api/documents/share',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          document_id: document.id,
          shared_to: shareUser
        })
      }
    );

    const result = await response.json();

    console.log("SHARE RESULT =", result);

    alert("Document Shared Successfully");

    setShareDialogOpen(false);

  } catch (error) {

    console.error(error);

  }

};

  const handleAddVersion = () => {
    setAddVersionDialogOpen(true);
  };

  const handleAddVersionSubmit = async () => {

  if (!newVersionFile) {
    alert("Please select a file");
    return;
  }

  try {

    const formData = new FormData();

    formData.append(
      "document_id",
      document.id
    );

    formData.append(
      "file",
      newVersionFile
    );

    const response = await fetch(
      "http://127.0.0.1:5000/api/documents/version",
      {
        method: "POST",
        body: formData
      }
    );

    const result = await response.json();

    console.log(
      "ADD VERSION RESULT =",
      result
    );

    alert("Version Uploaded");
    window.location.reload();

    setAddVersionDialogOpen(false);
    setNewVersionFile(null);

  } catch (error) {

    console.error(error);

    alert("Upload Failed");

  }

};
  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<BackIcon />}
            onClick={() => navigate('/documents')}
          >
            Back
          </Button>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {document.name}
            </Typography>
            <Typography color="text.secondary">
            Uploaded on {new Date(document.upload_date).toLocaleString("en-IN")}
</Typography>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
          >
            Download
          </Button>
          <Button
            variant="outlined"
            startIcon={<ShareIcon />}
            onClick={handleShare}
          >
            Share
          </Button>
          {canEditDocument(document.id) && (
            <Button
              variant="contained"
              startIcon={<UploadIcon />}
              onClick={handleAddVersion}
            >
              Add Version
            </Button>
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>

        {/* File Preview */}
<Card sx={{ mb: 3 }}>
  <CardContent>
    <Typography
      variant="h6"
      sx={{
        mb: 2,
        fontWeight: 'bold'
      }}
    >
      File Preview
    </Typography>

    {
      document.document_type === 'ZIP File'
      ? (
        <Alert severity="info">
          Preview not available for ZIP files.
          Please use the Download button to view the file.
        </Alert>
      )
      : (
        <Alert severity="success">
          Preview available for this file type.
        </Alert>
      )
    }

  </CardContent>
</Card>
<Grid container spacing={3}></Grid>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          {/* Document Information */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Document Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
  <Typography variant="caption" color="text.secondary">
    Document ID
  </Typography>
  <Typography sx={{ fontWeight: '500' }}>
    {document.id}
  </Typography>
</Grid>


<Grid item xs={12} sm={6}>
  <Typography variant="caption" color="text.secondary">
    Upload Date
  </Typography>
  <Typography variant="body2">
  {new Date(document.upload_date).toLocaleString("en-IN")}
</Typography>
</Grid>

<Grid item xs={12} sm={6}>
  <Typography variant="caption" color="text.secondary">
    Expiry Date
  </Typography>
  <Typography variant="body2">
  {new Date(document.expiry_date).toLocaleString("en-IN")}
</Typography>
</Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Client
                  </Typography>
                  <Typography sx={{ fontWeight: '500' }}>
                    {document.client_name || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Module
                  </Typography>
                  <Typography sx={{ fontWeight: '500' }}>
                    {document.module}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Document Type
                  </Typography>
                  <Typography sx={{ fontWeight: '500' }}>
                    {document.document_type}
                  </Typography>
                </Grid>
             
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Status
                  </Typography>
                  <Chip
  label="Uploaded"
  color="success"
  size="small"
  variant="outlined"
/>
                </Grid>
              
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">
                    Description
                  </Typography>
                  <Typography sx={{ fontWeight: '500', whiteSpace: 'pre-wrap' }}>
                    {document.description || 'No description provided'}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Metadata */}
        
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Metadata & Tags
              </Typography>
              <Typography
  variant="caption"
  color="text.secondary"
  display="block"
>
  Client
</Typography>

<Typography
  variant="body2"
  sx={{ mb: 2 }}
>
{document.client_name || "N/A"}
</Typography>

<Typography
  variant="caption"
  color="text.secondary"
  display="block"
>
  Module
</Typography>

<Typography
  variant="body2"
  sx={{ mb: 2 }}
>
  {document.module}
</Typography>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                  Tags
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {document.tags && document.tags.length > 0 ? (
                    document.tags.map(tag => (
                      <Chip key={tag} label={tag} color="primary" variant="outlined" />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No tags assigned
                    </Typography>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Version History */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 2,
                  flexWrap: 'wrap',
                  mb: 2,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Version History
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {versionHistory.map((version) => (
                  <Box
                    key={version.version_number}
                    sx={{
                      backgroundColor:
                        version.version_number === versionHistory[0]?.version_number
                          ? 'primary.light'
                          : 'action.hover',
                      p: 2,
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: 2,
                        flexWrap: 'wrap',
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        Version {version.version_number}
                        {version.version_number === versionHistory[0]?.version_number && (
                          <Chip
                            label="Latest"
                            size="small"
                            color="primary"
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Typography>
                      <Chip
  label="Uploaded"
  color="success"
  size="small"
  variant="outlined"
/>
                  
                    </Box>

                    <Typography
  variant="caption"
  color="text.secondary"
  sx={{ mt: 0.5 }}
>
{new Date(version.created_at).toLocaleString("en-IN")}
</Typography>

                    <Typography variant="body2" sx={{ mt: 1 }}>
  Version uploaded successfully
</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Linked Records */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Linked Records
              </Typography>
              {linkedRecords.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {linkedRecords.map(record => (
                    <Box
                      key={record.id}
                      sx={{
                        p: 1.5,
                        backgroundColor: 'action.hover',
                        borderRadius: 1,
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'action.selected',
                        },
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: '500' }}>
                        {record.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {record.type}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No linked records
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Share Document</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
      <TextField
  fullWidth
  label="User"
  value={shareUser}
  onChange={(e) => setShareUser(e.target.value)}
/>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleShareSubmit} variant="contained">
            Share
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Version Dialog */}
      <Dialog
        open={addVersionDialogOpen}
        onClose={() => setAddVersionDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Version</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            Upload a new file to create a new version. The current document will be preserved.
          </Alert>
          <input
            type="file"
            onChange={e => setNewVersionFile(e.target.files[0])}
            style={{ width: '100%', marginBottom: '16px' }}
          />
          {newVersionFile && (
            <Typography variant="body2">
              <strong>Selected:</strong> {newVersionFile.name}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddVersionDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddVersionSubmit} variant="contained">
            Add Version
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DocumentDetailView;
