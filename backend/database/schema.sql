-- DMS MySQL schema
-- Designed for InnoDB with FK integrity.

CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(64) NOT NULL UNIQUE,
  description VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(64) NOT NULL UNIQUE,
  email VARCHAR(128) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT NULL,
  CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS permissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  role_id INT NOT NULL,
  action VARCHAR(32) NOT NULL,
  resource VARCHAR(64) NOT NULL,
  resource_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_permissions (role_id, action, resource, resource_id),
  CONSTRAINT fk_permissions_role FOREIGN KEY (role_id) REFERENCES roles(id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(128) NOT NULL UNIQUE,
  contact_info TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS folders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NULL,
  parent_id INT NULL,
  name VARCHAR(128) NOT NULL,
  financial_year VARCHAR(32) NULL,
  type VARCHAR(64) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT NULL,

  CONSTRAINT fk_folders_client
    FOREIGN KEY (client_id)
    REFERENCES clients(id)
    ON UPDATE CASCADE
    ON DELETE SET NULL,

  CONSTRAINT fk_folders_parent
    FOREIGN KEY (parent_id)
    REFERENCES folders(id)
    ON UPDATE CASCADE
    ON DELETE SET NULL

) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  folder_id INT NULL,
  module VARCHAR(32) NOT NULL,
  document_type VARCHAR(64) NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT NULL,
  uploaded_by INT NOT NULL,
  upload_date DATE NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'Pending Review',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT NULL,

  version INT NOT NULL DEFAULT 1,

  CONSTRAINT fk_documents_client
    FOREIGN KEY (client_id)
    REFERENCES clients(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

  CONSTRAINT fk_documents_folder
    FOREIGN KEY (folder_id)
    REFERENCES folders(id)
    ON UPDATE CASCADE
    ON DELETE SET NULL,

  CONSTRAINT fk_documents_uploaded_by
    FOREIGN KEY (uploaded_by)
    REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

  INDEX idx_documents_client (client_id),
  INDEX idx_documents_module (module),
  INDEX idx_documents_type (document_type),
  INDEX idx_documents_upload_date (upload_date),
  INDEX idx_documents_status (status)

) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS document_versions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  document_id INT NOT NULL,
  version_number INT NOT NULL,
  file_path VARCHAR(512) NOT NULL,
  file_size BIGINT NULL,
  file_type VARCHAR(128) NULL,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY uq_doc_version (
    document_id,
    version_number
  ),

  CONSTRAINT fk_doc_versions_document
    FOREIGN KEY (document_id)
    REFERENCES documents(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,

  CONSTRAINT fk_doc_versions_created_by
    FOREIGN KEY (created_by)
    REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

  INDEX idx_doc_versions_document (document_id)

) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS tags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(64) NOT NULL UNIQUE,
  predefined BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS document_tags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  document_id INT NOT NULL,
  tag_id INT NOT NULL,

  UNIQUE KEY uq_document_tag (
    document_id,
    tag_id
  ),

  CONSTRAINT fk_document_tags_document
    FOREIGN KEY (document_id)
    REFERENCES documents(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,

  CONSTRAINT fk_document_tags_tag
    FOREIGN KEY (tag_id)
    REFERENCES tags(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,

  INDEX idx_document_tags_document (document_id),
  INDEX idx_document_tags_tag (tag_id)

) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS document_shares (
  id INT AUTO_INCREMENT PRIMARY KEY,
  document_id INT NOT NULL,
  shared_with_user_id INT NULL,
  shared_with_role_id INT NULL,

  can_view BOOLEAN NOT NULL DEFAULT TRUE,
  can_download BOOLEAN NOT NULL DEFAULT FALSE,
  can_edit BOOLEAN NOT NULL DEFAULT FALSE,
  can_delete BOOLEAN NOT NULL DEFAULT FALSE,
  can_share BOOLEAN NOT NULL DEFAULT FALSE,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_doc_shares_document
    FOREIGN KEY (document_id)
    REFERENCES documents(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,

  CONSTRAINT fk_doc_shares_user
    FOREIGN KEY (shared_with_user_id)
    REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE SET NULL,

  CONSTRAINT fk_doc_shares_role
    FOREIGN KEY (shared_with_role_id)
    REFERENCES roles(id)
    ON UPDATE CASCADE
    ON DELETE SET NULL,

  INDEX idx_doc_shares_doc (document_id)

) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  action VARCHAR(32) NOT NULL,
  resource VARCHAR(64) NOT NULL,
  resource_id INT NULL,
  metadata TEXT NULL,

  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_audit_logs_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE SET NULL,

  INDEX idx_audit_logs_resource (resource, resource_id),
  INDEX idx_audit_logs_user (user_id),
  INDEX idx_audit_logs_ts (timestamp)

) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS file_storage (
  id INT AUTO_INCREMENT PRIMARY KEY,
  document_version_id INT NOT NULL,
  file_path VARCHAR(512) NOT NULL,
  file_size BIGINT NULL,
  file_type VARCHAR(128) NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_file_storage_version
    FOREIGN KEY (document_version_id)
    REFERENCES document_versions(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,

  UNIQUE KEY uq_file_storage_version (document_version_id)

) ENGINE=InnoDB;

INSERT IGNORE INTO roles (
  id,
  name,
  description
)
VALUES
  (1,'Admin','Administrator'),
  (2,'Partner','Partner'),
  (3,'Manager','Manager'),
  (4,'Staff','Staff'),
  (5,'Client-restricted','Client-restricted');

