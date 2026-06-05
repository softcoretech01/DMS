<<<<<<< HEAD
# Document Management System (DMS) Frontend

A complete, production-ready React-based Document Management System with comprehensive features for managing, organizing, and tracking documents across multiple clients and modules.

## Features

### 1. **Document Dashboard**
- Overview screen with document statistics
- Quick access widgets showing Total Documents, Recent Uploads
- Filters for Client, Module, and Document Type
- Real-time status summary

### 2. **Folder Structure Manager**
- Visual hierarchy display (Client → Financial Year → Bills/General)
- Create and manage folder structures
- Parent folder selection
- Auto-organization capabilities
- Tree view visualization

### 3. **Document Upload Screen**
- Multi-file upload capability
- Drag-and-drop support
- Form validation with detailed error messages
- File preview before submission
- Document metadata input (Client, Module, Type, Financial Year)
- Tag assignment with predefined suggestions
- File size validation

### 4. **Document List View**
- Table/grid display with comprehensive columns
- Advanced filtering (Client, Document Type, Date Range, Tags)
- Row actions: View, Download, Edit, Delete, Share
- Bulk operations support
- Responsive design

### 5. **Document Detail View**
- Full document information display
- File metadata and preview
- Version history timeline
- Linked records section
- Actions: Download, Share, Add Version

### 6. **Search & Tags**
- Full-text search across all documents
- Tag-based filtering
- Smart tag suggestions based on search results
- Popular tags display
- Recent searches

### 7. **Access Control & Permissions**
- Role-based access levels (Admin, Partner, Manager, Staff, Client-restricted)
- Permission types: View, Download, Upload, Edit, Delete, Share
- Document-level permission management
- Role hierarchy visualization

### 8. **Bulk Operations**
- Multi-document upload via Zip
- Bulk download capability
- Folder-level operations
- Batch tagging

### 9. **Reports & Analytics**
- Document Inventory Report
- Status Distribution Report
- Client-wise Documents Report
- Upload Activity Report
- Module Distribution Charts
- Downloadable reports (CSV format)

## Tech Stack

- **Frontend Framework**: React 18 with JavaScript
- **UI Library**: Material-UI (MUI) v5
- **Routing**: React Router v6
- **State Management**: Context API
- **Styling**: Emotion (MUI's CSS-in-JS solution)
- **Charts**: Recharts
- **Date Utilities**: date-fns
- **Package Manager**: npm

## Project Structure

```
DMS/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Layout.js              (Navigation & Layout)
│   │   └── NotificationCenter.js  (Toast Notifications)
│   ├── pages/
│   │   ├── Dashboard.js
│   │   ├── FolderManager.js
│   │   ├── DocumentUpload.js
│   │   ├── DocumentListView.js
│   │   ├── DocumentDetailView.js
│   │   ├── SearchAndTags.js
│   │   ├── AccessControl.js
│   │   └── Reports.js
│   ├── context/
│   │   └── DMSContext.js          (Global State Management)
│   ├── utils/
│   │   ├── constants.js           (App Constants)
│   │   └── helpers.js             (Utility Functions)
│   ├── App.js                      (Main App with Routing)
│   └── index.js                    (Entry Point)
├── package.json
├── .gitignore
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Steps

1. **Navigate to project directory**
   ```bash
   cd d:\DMS
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open in browser**
   - The application will automatically open at `http://localhost:3000`
   - If not, manually navigate to this URL

## Usage Guide

### Initial Setup

1. **Login & Role Selection**
   - Click the user avatar in the top-right corner
   - Switch between different roles (Admin, Manager, Staff, Partner) to test role-based features
   - Current role is always displayed in the sidebar

2. **Navigate Through Screens**
   - Use the sidebar menu to navigate between different sections
   - The active page is highlighted in the navigation menu

### Dashboard
- View overall document statistics
- See recent uploads at a glance
- Apply filters to view specific documents

### Uploading Documents
1. Go to "Upload Document" screen
2. Select Client, Module, Document Type, Financial Year
3. Add description and tags
4. Drag and drop files or click to browse
5. Preview files before submission
6. Click "Upload" to submit

### Searching Documents
1. Go to "Search & Tags" screen
2. Enter search terms (searches document name, client, description, tags)
3. Click on tags to filter results
4. Use smart suggestions for better results

### Managing Permissions
1. Go to "Permissions" screen
2. View role-based access levels
3. See team members and their roles
4. (Admin only) Edit document-level permissions

### Viewing Reports
1. Go to "Reports" screen
2. View summary statistics
3. Analyze charts and data visualizations
4. Download reports in CSV format

## Features Breakdown

### State Management
- **Documents**: CRUD operations, search, filtering
- **Folders**: Create hierarchical folder structures
- **Users**: Role management, permission tracking
- **Permissions**: Document-level access control
- **Notifications**: Toast messages for user feedback

### Form Validation
- Client-side validation on all forms
- Real-time error messages
- File size and type validation

### User Feedback
- Toast notifications for all actions
- Error handling with user-friendly messages
- Loading states during async operations

### Responsive Design
- Mobile-first approach
- Desktop, tablet, and mobile support
- Adaptive navigation (drawer on mobile)
- Flexible grid layouts

### Accessibility
- Semantic HTML structure
- ARIA labels where appropriate
- Keyboard navigation support
- Color contrast compliance

## Mock Data

The application comes pre-populated with mock data:
- **Documents**: 4 sample documents across different clients and modules
- **Folders**: Client and financial year folder structure
- **Users**: 4 team members with different roles
- **Permissions**: Sample permission configurations

## Available Scripts

### `npm start`
Runs the app in development mode.
- Opens [http://localhost:3000](http://localhost:3000) in the browser
- The page will automatically reload on code changes

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder.

### `npm run eject`
Ejects the Create React App configuration (irreversible).

## Role-Based Permissions

### Admin
- ✓ View all documents
- ✓ Download documents
- ✓ Upload documents
- ✓ Edit documents
- ✓ Delete documents
- ✓ Share documents
- ✓ Manage permissions

### Partner
- ✓ View all documents
- ✓ Download documents
- ✓ Upload documents
- ✓ Edit documents
- ✓ Share documents

### Manager
- ✓ View all documents
- ✓ Download documents
- ✓ Upload documents
- ✓ Edit documents

### Staff
- ✓ View all documents
- ✓ Download documents
- ✓ Upload documents

### Client-restricted
- ✓ View assigned documents
- ✓ Download assigned documents

## Testing the Application

### Test Different Roles
1. Click the user avatar in the top menu
2. Select a different role
3. Notice how features and permissions change based on the role

### Test Upload Flow
1. Navigate to "Upload Document"
2. Fill in all required fields
3. Drag and drop a file
4. Review the uploaded document in "Document List"

### Test Search & Filtering
1. Go to "Search & Tags"
2. Search for a document
3. Apply tag filters
4. Verify results update in real-time

### Test Reports
1. Navigate to "Reports"
2. View different charts and statistics
3. Download a report and verify file is generated

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimizations

- Memoized components to prevent unnecessary re-renders
- Lazy loading for better initial load time
- Efficient state updates in Context API
- Optimized chart rendering with Recharts

## Future Enhancements

- Backend API integration
- Real file upload/download
- User authentication with JWT
- Email notifications
- Advanced search with Elasticsearch
- Document versioning system
- Audit logging
- Export to multiple formats
- Real-time collaboration
- Mobile app

## Troubleshooting

### Port 3000 already in use
```bash
# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# On macOS/Linux
lsof -ti:3000 | xargs kill -9
```

### Dependencies not installing
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Application not starting
1. Ensure Node.js is installed: `node --version`
2. Ensure npm is installed: `npm --version`
3. Try deleting `node_modules` and reinstalling
4. Check if port 3000 is available

## Contributing

This is a complete DMS frontend implementation. For modifications:
1. Follow the existing code structure
2. Maintain the component hierarchy
3. Keep the Context API pattern for state management
4. Use Material-UI components consistently
5. Add comments for complex logic

## License

MIT License - Feel free to use this project for your needs.

## Support

For issues or questions about the application, please refer to the code comments and the project structure documentation above.

---

**Note**: This is a frontend-only application with mock data. For production use, integrate with a real backend API and implement proper authentication and data persistence.
=======
# DMS
>>>>>>> cb98474eb714de3b31c6f7fba5c4d6336a41c382
