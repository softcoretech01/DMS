import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './pages/App';

import {
  PermissionProvider
} from './context/PermissionContext';

const root = ReactDOM.createRoot(
  document.getElementById('root')
);

root.render(
  <React.StrictMode>

    <PermissionProvider>

      <App />

    </PermissionProvider>

  </React.StrictMode>
);