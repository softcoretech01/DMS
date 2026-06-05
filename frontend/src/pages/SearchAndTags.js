
import React, {

  useEffect,
  useState

} from 'react';

import {

  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment,
  Chip,
  CircularProgress

} from '@mui/material';

import {

  Search as SearchIcon

} from '@mui/icons-material';

import {

  getAccessToken

} from '../utils/api';


const SearchAndTags = () => {

  const [searchQuery, setSearchQuery] = useState('');

  const [documents, setDocuments] = useState([]);

  const [loading, setLoading] = useState(false);


  const searchDocuments = async (query = '') => {

    try {

      setLoading(true);

      const token = getAccessToken();

      const response = await fetch(

        `http://127.0.0.1:5000/api/documents/search?q=${query}`,

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

    } finally {

      setLoading(false);
    }
  };


  useEffect(() => {

    searchDocuments();

  }, []);


  const handleSearch = (value) => {

    setSearchQuery(value);

    searchDocuments(value);
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
          Search Documents
        </Typography>

        <Typography color="text.secondary">
          Live document search from MySQL database
        </Typography>

      </Box>


      <Card sx={{ mb: 3 }}>

        <CardContent>

          <TextField

            fullWidth

            placeholder="Search by file name, module, type, description..."

            value={searchQuery}

            onChange={(e) =>
              handleSearch(e.target.value)
            }

            InputProps={{

              startAdornment: (

                <InputAdornment position="start">

                  <SearchIcon />

                </InputAdornment>
              )
            }}
          />

        </CardContent>

      </Card>


      <Card>

        <CardContent>

          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: 'bold'
            }}
          >
            Search Results
          </Typography>


          {loading ? (

            <Box
              sx={{
                textAlign: 'center',
                py: 4
              }}
            >

              <CircularProgress />

            </Box>

          ) : (

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
                      Document Type
                    </TableCell>

                    <TableCell>
                      Description
                    </TableCell>

                    <TableCell>
                      Status
                    </TableCell>

                  </TableRow>

                </TableHead>


                <TableBody>

                  {documents.length === 0 ? (

                    <TableRow>

                      <TableCell
                        colSpan={6}
                        align="center"
                      >

                        No documents found

                      </TableCell>

                    </TableRow>

                  ) : (

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

                        <TableCell>

                          <Chip
                            label={doc.status}
                            color="success"
                            size="small"
                          />

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

    </Box>
  );
};

export default SearchAndTags;
