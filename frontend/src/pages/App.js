import React from 'react';

import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

import {
  ThemeProvider,
  createTheme,
  CssBaseline
} from '@mui/material';

import Layout from '../components/Layout';

import NotificationCenter from '../components/NotificationCenter';

import { DMSProvider } from '../context/DMSContext';


// PAGES

import Login from './Login';

import Dashboard from './Dashboard';

import FolderManager from './FolderManager';

import DocumentUpload from './DocumentUpload';

import DocumentListView from './DocumentListView';

import DocumentDetailView from './DocumentDetailView';

import SearchAndTags from './SearchAndTags';

import AccessControl from './AccessControl';

import Reports from './Reports';

import BulkOperations from './BulkOperations';



const theme = createTheme({

  palette: {

    primary: {

      main: '#1976d2'

    }

  }

});


function App() {

  return (

    <ThemeProvider theme={theme}>

      <CssBaseline />

      <DMSProvider>

        <Router>

          <NotificationCenter />

          <Routes>

            {/* LOGIN */}

            <Route
              path="/"
              element={<Login />}
            />

            {/* HOME */}

            <Route
              path="/home"
              element={
                <Layout>
                  <Dashboard />
                </Layout>
              }
            />

            {/* FOLDERS */}

            <Route
              path="/folders"
              element={
                <Layout>
                  <FolderManager />
                </Layout>
              }
            />

            {/* UPLOAD */}

            <Route
              path="/upload"
              element={
                <Layout>
                  <DocumentUpload />
                </Layout>
              }
            />

            {/* BULK */}

            <Route
              path="/bulk"
              element={
                <Layout>
                  <BulkOperations />
                </Layout>
              }
            />

            {/* DOCUMENTS */}

            <Route
              path="/documents"
              element={
                <Layout>
                  <DocumentListView />
                </Layout>
              }
            />

            {/* DETAILS */}

            <Route
              path="/documents/:id"
              element={
                <Layout>
                  <DocumentDetailView />
                </Layout>
              }
            />

            {/* SEARCH */}

            <Route
              path="/search"
              element={
                <Layout>
                  <SearchAndTags />
                </Layout>
              }
            />

            {/* ACCESS */}

            <Route
              path="/permissions"
              element={
                <Layout>
                  <AccessControl />
                </Layout>
              }
            />

            {/* REPORTS */}

            <Route
              path="/reports"
              element={
                <Layout>
                  <Reports />
                </Layout>
              }
            />
           
          </Routes>

        </Router>

      </DMSProvider>

    </ThemeProvider>

  );
}

export default App;