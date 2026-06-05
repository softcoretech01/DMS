import { format, parseISO } from 'date-fns';

// Date formatting utilities
export const formatDate = (date) => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'MMM dd, yyyy');
  } catch {
    return 'Invalid date';
  }
};

export const formatDateTime = (date) => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'MMM dd, yyyy HH:mm');
  } catch {
    return 'Invalid date';
  }
};

// File utilities
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

export const getFileExtension = (filename) => {
  return filename.split('.').pop().toUpperCase();
};

export const isImageFile = (filename) => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
  const ext = filename.split('.').pop().toLowerCase();
  return imageExtensions.includes(ext);
};

export const isPdfFile = (filename) => {
  return filename.toLowerCase().endsWith('.pdf');
};

// Validation utilities
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateDocumentForm = (formData) => {

  const errors = {};

  if (!formData.client || formData.client.trim() === '') {

    errors.client = 'Client is required';
  }

  if (!formData.module || formData.module.trim() === '') {

    errors.module = 'Module is required';
  }

  if (!formData.documentType || formData.documentType.trim() === '') {

    errors.documentType = 'Document Type is required';
  }

  if (!formData.file && formData.files.length === 0) {

    errors.file = 'File is required';
  }

  if (
    formData.description &&
    formData.description.length > 500
  ) {

    errors.description =
      'Description cannot exceed 500 characters';
  }

  return errors;
};
// Search utilities
export const highlightSearchTerm = (text, searchTerm) => {
  if (!searchTerm) return text;

  const regex = new RegExp(`(${searchTerm})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) =>
    regex.test(part) ? `<mark>${part}</mark>` : part
  ).join('');
};

// Sorting utilities
export const sortByDate = (items, dateField, descending = true) => {
  return [...items].sort((a, b) => {
    const dateA = new Date(a[dateField]);
    const dateB = new Date(b[dateField]);
    return descending ? dateB - dateA : dateA - dateB;
  });
};

export const sortByString = (items, stringField, descending = false) => {
  return [...items].sort((a, b) => {
    const valueA = a[stringField].toLowerCase();
    const valueB = b[stringField].toLowerCase();
    const comparison = valueA.localeCompare(valueB);
    return descending ? -comparison : comparison;
  });
};

// Chart data utilities
export const generateChartData = (data, groupBy, countField = 'id') => {
  const grouped = {};

  data.forEach(item => {
    const key = item[groupBy];
    grouped[key] = (grouped[key] || 0) + 1;
  });

  return Object.entries(grouped).map(([name, value]) => ({
    name,
    value,
  }));
};

// Mock API utilities
export const simulateApiCall = (delayMs = 500) => {
  return new Promise(resolve => setTimeout(resolve, delayMs));
};

export const simulateFileDownload = (filename, content = '') => {
  const element = document.createElement('a');
  const file = new Blob([content || `Mock content for ${filename}`], {
    type: 'text/plain',
  });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

export const simulateZipDownload = (filenames) => {
  // In a real app, this would create a zip file
  // For now, we'll just download the first file
  if (filenames.length > 0) {
    simulateFileDownload(filenames[0]);
  }
};
