import React, { useState, useEffect } from 'react';

import axios from 'axios';

import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Paper,
  Grid,
  Alert,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

import {
  CloudUpload as UploadIcon,
  CheckCircle as SuccessIcon,
} from '@mui/icons-material';

import { useDMS } from '../context/DMSContext';

import {
  formatFileSize,
  validateDocumentForm
} from '../utils/helpers';

import {
  PREDEFINED_TAGS
} from '../utils/constants';

import {
  getAccessToken
} from '../utils/api';

const DocumentUpload = () => {



  const { addNotification } = useDMS();

  const [loading, setLoading] = useState(false);

  const [uploadSuccess, setUploadSuccess] = useState(null);

  const [dragActive, setDragActive] = useState(false);

  const [modules, setModules] = useState([]);

  const [documentTypes, setDocumentTypes] = useState([]);

  const [financialYears, setFinancialYears] = useState([]);

  const [clients, setClients] = useState([]);

  const [formData, setFormData] = useState({

    client: '',
    customClient: '',

    module: '',
    customModule: '',

    documentType: '',
    customDocumentType: '',

    financialYear: '',
    customFinancialYear: '',

    description: '',

    tags: [],

    files: [],

  });

  const [errors, setErrors] = useState({});


  useEffect(() => {

    fetchDropdowns();

  }, []);

  const fetchDropdowns = async () => {

    try {

      const [

        modulesResponse,
        documentTypesResponse,
        financialYearsResponse,
        clientsResponse

      ] = await Promise.all([

        axios.get(
          'http://127.0.0.1:5000/api/dropdowns/modules'
        ),

        axios.get(
          'http://127.0.0.1:5000/api/dropdowns/document-types'
        ),

        axios.get(
          'http://127.0.0.1:5000/api/dropdowns/financial-years'
        ),

        axios.get(
          'http://127.0.0.1:5000/api/clients'
        )

      ]);

      setModules(

        modulesResponse.data.modules || []

      );

      setDocumentTypes(

        documentTypesResponse.data.document_types || []

      );

      setFinancialYears(

        financialYearsResponse.data.financial_years || []

      );

      setClients(

        clientsResponse.data || []

      );

    }

    catch (error) {

      console.error(

        'Dropdown fetch error:',

        error

      );

    }

  };


  const handleInputChange = (field, value) => {

    setFormData(prev => ({

      ...prev,

      [field]: value,

    }));

  };


  const handleTagToggle = (tag) => {

    setFormData(prev => ({

      ...prev,

      tags: prev.tags.includes(tag)

        ? prev.tags.filter(t => t !== tag)

        : [...prev.tags, tag],

    }));

  };


  const handleFileSelect = (e) => {

    const selectedFiles = Array.from(e.target.files);

    setFormData(prev => ({

      ...prev,

      files: [...prev.files, ...selectedFiles],

    }));

  };


  const handleDrag = (e) => {

    e.preventDefault();

    e.stopPropagation();

    if (

      e.type === 'dragenter'

      ||

      e.type === 'dragover'

    ) {

      setDragActive(true);

    }

    else if (

      e.type === 'dragleave'

    ) {

      setDragActive(false);

    }

  };


  const handleDrop = (e) => {

    e.preventDefault();

    e.stopPropagation();

    setDragActive(false);

    const droppedFiles = Array.from(
      e.dataTransfer.files
    );

    setFormData(prev => ({

      ...prev,

      files: [...prev.files, ...droppedFiles],

    }));

  };


  const removeFile = (index) => {

    setFormData(prev => ({

      ...prev,

      files: prev.files.filter(
        (_, i) => i !== index
      ),

    }));

  };

  const handleBulkUpload = async () => {

  alert("BULK UPLOAD CLICKED");

};


  const handleSubmit = async () => {

    const handleBulkUpload = async () => {

  try {

    const token = getAccessToken();

    const uploadData = new FormData();

    uploadData.append(
      'client_id',
      formData.client
    );

    uploadData.append(
      'folder_id',
      '1'
    );

    uploadData.append(
      'module',
      formData.module
    );

    uploadData.append(
      'document_type',
      formData.documentType
    );

    uploadData.append(
      'description',
      formData.description
    );

    formData.files.forEach(file => {

      uploadData.append(
        'files',
        file
      );

    });

    const response = await fetch(

      'http://127.0.0.1:5000/api/documents/multi-upload',

      {

        method: 'POST',

        headers: {

          Authorization: `Bearer ${token}`

        },

        body: uploadData

      }

    );

    const result = await response.json();

    console.log(result);

    alert('Bulk Upload Success');

  }

  catch (error) {

    console.error(error);

    alert('Bulk Upload Failed');

  }

};


    const validationErrors = validateDocumentForm({

      ...formData,

      file: formData.files.length > 0,

    });

    if (Object.keys(validationErrors).length > 0) {

      setErrors(validationErrors);

      addNotification(
        'Please fix the errors in the form',
        'error'
      );

      return;

    }

    setLoading(true);

    try {

      const token = getAccessToken();

      const finalClient =

        formData.client === 'Others'

          ? formData.customClient

          : formData.client;

      const finalModule =

        formData.module === 'Others'

          ? formData.customModule

          : formData.module;

      const finalDocumentType =

        formData.documentType === 'Others'

          ? formData.customDocumentType

          : formData.documentType;

      const finalFinancialYear =

        formData.financialYear === 'Others'

          ? formData.customFinancialYear

          : formData.financialYear;

      for (const file of formData.files) {

        const uploadData = new FormData();

        uploadData.append(
          'client_id',
          finalClient
        );

        uploadData.append(
          'folder_id',
          '1'
        );

        uploadData.append(
          'module',
          finalModule
        );

        uploadData.append(
          'document_type',
          finalDocumentType
        );

        uploadData.append(
          'financial_year',
          finalFinancialYear
        );

        uploadData.append(
          'description',
          formData.description
        );

        uploadData.append(
          'file',
          file
        );

        const response = await fetch(

          'http://127.0.0.1:5000/api/documents/upload',

          {

            method: 'POST',

            headers: {

              Authorization: `Bearer ${token}`

            },

            body: uploadData

          }

        );

        const result = await response.json();

        if (!response.ok) {

          throw new Error(
            result.error || 'Upload failed'
          );

        }

      }

      setUploadSuccess({

        count: formData.files.length,

        files: formData.files.map(
          f => f.name
        ),

      });

      addNotification(

        `${formData.files.length} document(s) uploaded successfully`,

        'success'

      );

      setFormData({

        client: '',
        customClient: '',

        module: '',
        customModule: '',

        documentType: '',
        customDocumentType: '',

        financialYear: '',
        customFinancialYear: '',

        description: '',

        tags: [],

        files: [],

      });

    }

    catch (error) {

      addNotification(

        error.message || 'Upload failed',

        'error'

      );

    }

    finally {

      setLoading(false);

    }

  };


  return (

    <Box>

      <Box sx={{ mb: 4 }}>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            mb: 1
          }}
        >

          Document Upload

        </Typography>

        <Typography color="text.secondary">

          Upload single or multiple documents

        </Typography>

      </Box>


      {uploadSuccess && (

        <Alert
          severity="success"
          sx={{ mb: 3 }}
          icon={<SuccessIcon />}
        >

          Successfully uploaded
          {' '}
          {uploadSuccess.count}
          {' '}
          document(s)

        </Alert>

      )}


      <Grid container spacing={3}>

        <Grid item xs={12} md={8}>

          <Card>

            <CardContent>

              {/* CLIENT */}

              <FormControl fullWidth sx={{ mb: 2 }}>

                <InputLabel>

                  Client

                </InputLabel>

                <Select
                  value={formData.client}
                  onChange={(e) =>
                    handleInputChange(
                      'client',
                      e.target.value
                    )
                  }
                  label="Client"
                >

                  <MenuItem value="">
  All Clients
</MenuItem>

{clients.map(client => (

  <MenuItem
    key={client.id}
    value={client.id}
  >
    {client.name}
  </MenuItem>

))}


                  <MenuItem value="">
  All Clients
</MenuItem>

{clients.map(client => (

  <MenuItem
    key={client.id}
    value={client.id}
  >
    {client.name}
  </MenuItem>

))}

                </Select>

              </FormControl>

              {

                formData.client === 'Others' && (

                  <TextField
                    fullWidth
                    label="Enter Client"
                    value={formData.customClient}
                    onChange={(e) =>
                      handleInputChange(
                        'customClient',
                        e.target.value
                      )
                    }
                    sx={{ mb: 2 }}
                  />

                )

              }


              {/* MODULE */}

              <FormControl fullWidth sx={{ mb: 2 }}>

                <InputLabel>

                  Module

                </InputLabel>

                <Select
                  value={formData.module}
                  onChange={(e) =>
                    handleInputChange(
                      'module',
                      e.target.value
                    )
                  }
                  label="Module"
                >

                  {modules.map(module => (

                    <MenuItem
                      key={module.id}
                      value={module.name}
                    >

                      {module.name}

                    </MenuItem>

                  ))}

                  <MenuItem value="Others">

                    Others

                  </MenuItem>

                </Select>

              </FormControl>

              {

                formData.module === 'Others' && (

                  <TextField
                    fullWidth
                    label="Enter Module"
                    value={formData.customModule}
                    onChange={(e) =>
                      handleInputChange(
                        'customModule',
                        e.target.value
                      )
                    }
                    sx={{ mb: 2 }}
                  />

                )

              }


              {/* DOCUMENT TYPE */}

              <FormControl fullWidth sx={{ mb: 2 }}>

                <InputLabel>

                  Document Type

                </InputLabel>

                <Select
                  value={formData.documentType}
                  onChange={(e) =>
                    handleInputChange(
                      'documentType',
                      e.target.value
                    )
                  }
                  label="Document Type"
                >

                  {documentTypes.map(type => (

                    <MenuItem
                      key={type.id}
                      value={type.name}
                    >

                      {type.name}

                    </MenuItem>

                  ))}

                  <MenuItem value="Others">

                    Others

                  </MenuItem>

                </Select>

              </FormControl>

              {

                formData.documentType === 'Others' && (

                  <TextField
                    fullWidth
                    label="Enter Document Type"
                    value={formData.customDocumentType}
                    onChange={(e) =>
                      handleInputChange(
                        'customDocumentType',
                        e.target.value
                      )
                    }
                    sx={{ mb: 2 }}
                  />

                )

              }


              {/* FINANCIAL YEAR */}

              <FormControl fullWidth sx={{ mb: 2 }}>

                <InputLabel>

                  Financial Year

                </InputLabel>

                <Select
                  value={formData.financialYear}
                  onChange={(e) =>
                    handleInputChange(
                      'financialYear',
                      e.target.value
                    )
                  }
                  label="Financial Year"
                >

                  {financialYears.map(year => (

                    <MenuItem
                      key={year.id}
                      value={year.name}
                    >

                      {year.name}

                    </MenuItem>

                  ))}

                  <MenuItem value="Others">

                    Others

                  </MenuItem>

                </Select>

              </FormControl>

              {

                formData.financialYear === 'Others' && (

                  <TextField
                    fullWidth
                    label="Enter Financial Year"
                    value={formData.customFinancialYear}
                    onChange={(e) =>
                      handleInputChange(
                        'customFinancialYear',
                        e.target.value
                      )
                    }
                    sx={{ mb: 2 }}
                  />

                )

              }


              {/* DESCRIPTION */}

              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  handleInputChange(
                    'description',
                    e.target.value
                  )
                }
                sx={{ mb: 3 }}
              />


              {/* TAGS */}

              <Typography sx={{ mb: 1 }}>

                Tags

              </Typography>

              <Box sx={{ mb: 3 }}>

                {PREDEFINED_TAGS.map(tag => (

                  <Chip
                    key={tag}
                    label={tag}
                    clickable
                    color={
                      formData.tags.includes(tag)

                        ? 'primary'

                        : 'default'
                    }
                    onClick={() =>
                      handleTagToggle(tag)
                    }
                    sx={{ mr: 1, mb: 1 }}
                  />

                ))}

              </Box>

            </CardContent>

          </Card>

        </Grid>


        <Grid item xs={12} md={4}>

          <Card>

            <CardContent>

              <Paper
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  border: '2px dashed',
                  borderColor: dragActive
                    ? 'primary.main'
                    : 'divider',
                  mb: 2,
                }}
              >

                <input
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                  id="file-input"
                />

                <label htmlFor="file-input">

                  <UploadIcon
                    sx={{
                      fontSize: 48,
                      color: 'primary.main'
                    }}
                  />

                  <Typography>

                    Upload Files

                  </Typography>

                </label>

              </Paper>


              {formData.files.length > 0 && (

                <List>

                  {formData.files.map((file, index) => (

                    <ListItem key={index}>

                      <ListItemText
                        primary={file.name}
                        secondary={formatFileSize(file.size)}
                      />

                      <Button
                        color="error"
                        onClick={() =>
                          removeFile(index)
                        }
                      >

                        Remove

                      </Button>

                    </ListItem>

                  ))}

                </List>

              )}
              <Button
  fullWidth
  variant="contained"
  onClick={handleSubmit}
  disabled={
    loading ||
    formData.files.length === 0
  }
>

  {
    loading
      ? 'Uploading...'
      : 'Upload'
  }

</Button>

<Button
  fullWidth
  variant="outlined"
  sx={{ mt: 2 }}

  onClick={handleBulkUpload}
  disabled={
    loading ||
    formData.files.length === 0
  }
>

  Bulk Upload

</Button>
             
            </CardContent>

          </Card>

        </Grid>

      </Grid>

    </Box>

  );

};


export default DocumentUpload;