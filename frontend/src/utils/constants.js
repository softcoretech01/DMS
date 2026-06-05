// Constants for the DMS application

export const ROLES = {
  ADMIN: 'Admin',
  PARTNER: 'Partner',
  MANAGER: 'Manager',
  STAFF: 'Staff',
  CLIENT_RESTRICTED: 'Client-restricted',
};

export const MODULES = {
  GST: 'GST',
  IT: 'IT',
  AUDIT: 'Audit',
  GENERAL: 'General',
};

export const DOCUMENT_TYPES = {
  TAX_RETURN: 'Tax Return',
  AUDIT_REPORT: 'Audit Report',
  BANK_STATEMENT: 'Bank Statement',
  INVOICE: 'Invoice',
  BILL: 'Bill',
  RECEIPT: 'Receipt',
  BALANCE_SHEET: 'Balance Sheet',
  PROFIT_LOSS: 'Profit & Loss',
  OTHER: 'Other',
};

export const STATUS = {
  PENDING_REVIEW: 'Pending Review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  COMPLETED: 'Completed',
  ARCHIVED: 'Archived',
};

export const PERMISSIONS = {
  VIEW: 'View',
  DOWNLOAD: 'Download',
  UPLOAD: 'Upload',
  EDIT: 'Edit',
  DELETE: 'Delete',
  SHARE: 'Share',
};

export const PREDEFINED_TAGS = [
  'GST',
  'Audit',
  'Bank',
  'High Priority',
  'Urgent',
  'Tax',
  'Compliance',
  'Approved',
  'Pending',
  'Important',
];

export const CLIENTS = [
  'ABC Corporation',
  'XYZ Ltd',
  'Tech Solutions Inc',
  'Finance Partners LLC',
  'Global Traders',
];

export const FINANCIAL_YEARS = [
  'FY 2024-25',
  'FY 2023-24',
  'FY 2022-23',
  'FY 2021-22',
  'FY 2020-21',
];

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    PERMISSIONS.VIEW,
    PERMISSIONS.DOWNLOAD,
    PERMISSIONS.UPLOAD,
    PERMISSIONS.EDIT,
    PERMISSIONS.DELETE,
    PERMISSIONS.SHARE,
  ],
  [ROLES.PARTNER]: [
    PERMISSIONS.VIEW,
    PERMISSIONS.DOWNLOAD,
    PERMISSIONS.UPLOAD,
    PERMISSIONS.EDIT,
    PERMISSIONS.SHARE,
  ],
  [ROLES.MANAGER]: [
    PERMISSIONS.VIEW,
    PERMISSIONS.DOWNLOAD,
    PERMISSIONS.UPLOAD,
    PERMISSIONS.EDIT,
  ],
  [ROLES.STAFF]: [
    PERMISSIONS.VIEW,
    PERMISSIONS.DOWNLOAD,
    PERMISSIONS.UPLOAD,
  ],
  [ROLES.CLIENT_RESTRICTED]: [
    PERMISSIONS.VIEW,
    PERMISSIONS.DOWNLOAD,
  ],
};

export const THEME_COLORS = {
  primary: '#1976d2',
  secondary: '#dc004e',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3',
};
