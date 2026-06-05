import React, {
  useState,
  useEffect
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
  Button,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import {
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { useDMS } from '../context/DMSContext';
import { simulateFileDownload } from '../utils/helpers';
const Reports = () => {
  const { addNotification } = useDMS();

const [reportData, setReportData] = useState(null);

useEffect(() => {

  fetch(
    "http://127.0.0.1:5000/api/reports/summary"
  )
    .then(res => res.json())
    .then(data => {

      console.log(data);

      setReportData(data);

    })
    .catch(console.error);

}, []);
 const [chartViewType, setChartViewType] = useState('bar');




  const moduleReport =
  reportData?.modules?.map(item => ({
    name: item.module,
    value: item.count
  })) || [];

  const statusReport = [
  {
    status: "Active",
    count: reportData?.total_documents || 0
  }
];

  const inventoryReport =
reportData?.modules?.map(item => ({
  type: item.module,
  count: item.count,
  percentage: (
    (item.count / reportData.total_documents) * 100
  ).toFixed(1)
})) || [];

const clientReport =
reportData?.clients?.map(item => ({

  client:
    item.client_id === 1
      ? "ABC Client"
      : item.client_id === 2
      ? "ABC Company"
      : `Client ${item.client_id}`,

  total: item.count

})) || [];

const uploadActivityReport =
reportData?.recent_documents?.map((doc,index) => ({
  formattedDate: `Doc ${index+1}`,
  count: index+1
})) || [];
 

  

  const colors = ['#1976d2', '#4caf50', '#ff9800', '#f44336', '#9c27b0'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'success';
      case 'Pending Review':
        return 'warning';
      case 'Rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleDownloadReport = (reportName) => {
    simulateFileDownload(`${reportName}_report.csv`);
    addNotification(`Downloaded ${reportName} report`, 'success');
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          Document Reports
        </Typography>
        <Typography color="text.secondary">
          Analytics and insights on document management
        </Typography>
      </Box>

      {/* Summary Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="caption">
                Total Documents
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1 }}>
                {reportData?.total_documents || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="caption">
                Approved
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1, color: 'success.main' }}>
                0
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="caption">
                Pending Review
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1, color: 'warning.main' }}>
                0
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="caption">
                Total Clients
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1 }}>
                {reportData?.clients?.length || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      

     

      {/* Module Distribution Chart */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Document Distribution by Module
            </Typography>
            <ToggleButtonGroup
              size="small"
              value={chartViewType}
              exclusive
              onChange={(e, newValue) => setChartViewType(newValue)}
            >
              <ToggleButton value="bar">
                <BarChartIcon />
              </ToggleButton>
              <ToggleButton value="pie">
                <PieChartIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {chartViewType === 'bar' ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={moduleReport}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#1976d2" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={moduleReport}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {moduleReport.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Document Inventory */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Document Inventory
                </Typography>
                <Button
                  size="small"
                  startIcon={<DownloadIcon />}
                  onClick={() => handleDownloadReport('Inventory')}
                >
                  Download
                </Button>
              </Box>

              <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'action.hover' }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>Document Type</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>
                        Count
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>
                        Percentage
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {inventoryReport.map((item, idx) => (
                      <TableRow key={idx} hover>
                        <TableCell>{item.type}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: '500' }}>
                          {item.count}
                        </TableCell>
                        <TableCell align="right">
                          <Chip label={`${item.percentage}%`} size="small" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

      </Grid>

    <TableContainer component={Paper}>
  <Table
    sx={{
      tableLayout: "fixed",
      width: "100%"
    }}
  >

    <TableHead>

      <TableRow>

        <TableCell
          width="70%"
          sx={{ fontWeight: "bold" }}
        >
          Client Name
        </TableCell>

        <TableCell
          width="30%"
          align="center"
          sx={{ fontWeight: "bold" }}
        >
          Total Documents
        </TableCell>

      </TableRow>

    </TableHead>

    

      {clientReport.map((item, idx) => (

        <TableRow key={idx} hover>

          <TableCell>
            {item.client}
          </TableCell>

          <TableCell align="center">
            {item.total}
          </TableCell>

        </TableRow>

      ))}

  

  </Table>
</TableContainer>

      {/* Upload Activity Report */}
      <Card>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Upload Activity Report
            </Typography>
            <Button
              size="small"
              startIcon={<DownloadIcon />}
              onClick={() => handleDownloadReport('Activity')}
            >
              Download
            </Button>
          </Box>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={uploadActivityReport}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="formattedDate" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#1976d2"
                name="Documents Uploaded"
              />
            </LineChart>
          </ResponsiveContainer>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            Shows document upload activity over time
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Reports;
