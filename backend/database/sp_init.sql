-- Stored procedures for DMS
-- Note: MySQL 8+ recommended.

DELIMITER $$

-- Generic permission check based on role or document shares
CREATE PROCEDURE sp_check_document_permission (
  IN p_user_id INT,
  IN p_document_id INT,
  IN p_action VARCHAR(32)
)
BEGIN
  DECLARE v_role_id INT;
  DECLARE v_is_admin_role INT;
  DECLARE v_allowed BOOLEAN DEFAULT FALSE;

  SELECT role_id INTO v_role_id FROM users WHERE id = p_user_id;
  SELECT id INTO v_is_admin_role FROM roles WHERE name='Admin' LIMIT 1;

  IF v_role_id = v_is_admin_role THEN
    SET v_allowed = TRUE;
  ELSE
    -- document_shares
    IF p_action='View' THEN
      SELECT EXISTS(SELECT 1 FROM document_shares ds WHERE ds.document_id=p_document_id
        AND (ds.shared_with_user_id=p_user_id OR ds.shared_with_role_id=v_role_id)
        AND ds.can_view=TRUE) INTO v_allowed;
    ELSEIF p_action='Download' THEN
      SELECT EXISTS(SELECT 1 FROM document_shares ds WHERE ds.document_id=p_document_id
        AND (ds.shared_with_user_id=p_user_id OR ds.shared_with_role_id=v_role_id)
        AND ds.can_download=TRUE) INTO v_allowed;
    ELSEIF p_action='Edit' THEN
      SELECT EXISTS(SELECT 1 FROM document_shares ds WHERE ds.document_id=p_document_id
        AND (ds.shared_with_user_id=p_user_id OR ds.shared_with_role_id=v_role_id)
        AND ds.can_edit=TRUE) INTO v_allowed;
    ELSEIF p_action='Delete' THEN
      SELECT EXISTS(SELECT 1 FROM document_shares ds WHERE ds.document_id=p_document_id
        AND (ds.shared_with_user_id=p_user_id OR ds.shared_with_role_id=v_role_id)
        AND ds.can_delete=TRUE) INTO v_allowed;
    ELSEIF p_action='Share' THEN
      SELECT EXISTS(SELECT 1 FROM document_shares ds WHERE ds.document_id=p_document_id
        AND (ds.shared_with_user_id=p_user_id OR ds.shared_with_role_id=v_role_id)
        AND ds.can_share=TRUE) INTO v_allowed;
    END IF;

    -- role permissions fallback (resource='document')
    IF v_allowed = FALSE THEN
      SELECT EXISTS(
        SELECT 1 FROM permissions p
        WHERE p.role_id=v_role_id AND p.action=p_action AND p.resource='document'
      ) INTO v_allowed;
    END IF;
  END IF;

  SELECT v_allowed AS allowed;
END$$

-- Dashboard: total documents + recent uploads
CREATE PROCEDURE sp_dashboard (
  IN p_user_id INT
)
BEGIN
  SELECT COUNT(*) AS total_documents,
         SUM(status='Approved') AS approved_documents,
         SUM(status='Pending Review') AS pending_documents
  FROM documents d
  WHERE d.id IN (SELECT d2.id FROM documents d2 WHERE d2.client_id IN (
    SELECT c.id FROM clients c JOIN users u ON u.id=p_user_id
    -- For demo: unrestricted
  ) OR 1=1);

  SELECT d.id, d.name, c.name AS client, d.module, d.uploaded_by, d.upload_date, d.status
  FROM documents d
  JOIN clients c ON c.id=d.client_id
  ORDER BY d.upload_date DESC
  LIMIT 5;
END$$

-- Document filtering/search
CREATE PROCEDURE sp_search_documents (
  IN p_query VARCHAR(255),
  IN p_client_id INT,
  IN p_module VARCHAR(32),
  IN p_document_type VARCHAR(64),
  IN p_tag_ids_csv TEXT,
  IN p_date_from DATE,
  IN p_date_to DATE,
  IN p_status VARCHAR(32),
  IN p_limit INT,
  IN p_offset INT
)
BEGIN
  -- Simplified approach using LIKE; tag filtering expects CSV of ids.
  SELECT
    d.id, d.name, c.name AS client, d.module, d.document_type, u.username AS uploaded_by,
    d.upload_date AS upload_date, d.version, d.status, d.description
  FROM documents d
  JOIN clients c ON c.id=d.client_id
  JOIN users u ON u.id=d.uploaded_by
  WHERE
    (p_query IS NULL OR p_query='' OR
      d.name LIKE CONCAT('%',p_query,'%') OR
      c.name LIKE CONCAT('%',p_query,'%') OR
      d.description LIKE CONCAT('%',p_query,'%')
    )
    AND (p_client_id IS NULL OR p_client_id=0 OR d.client_id=p_client_id)
    AND (p_module IS NULL OR p_module='' OR d.module=p_module)
    AND (p_document_type IS NULL OR p_document_type='' OR d.document_type=p_document_type)
    AND (p_status IS NULL OR p_status='' OR d.status=p_status)
    AND (p_date_from IS NULL OR d.upload_date >= p_date_from)
    AND (p_date_to IS NULL OR d.upload_date <= p_date_to)
    AND (
      p_tag_ids_csv IS NULL OR p_tag_ids_csv='' OR EXISTS (
        SELECT 1
        FROM document_tags dt
        WHERE dt.document_id=d.id
          AND FIND_IN_SET(CAST(dt.tag_id AS CHAR), p_tag_ids_csv)
      )
    )
  ORDER BY d.upload_date DESC
  LIMIT p_limit OFFSET p_offset;
END$$

-- Create document (single file): inserts documents + version + tags and writes audit (controller can add audit)
CREATE PROCEDURE sp_create_document (
  IN p_name VARCHAR(200),
  IN p_client_id INT,
  IN p_folder_id INT,
  IN p_module VARCHAR(32),
  IN p_document_type VARCHAR(64),
  IN p_description TEXT,
  IN p_uploaded_by INT,
  IN p_upload_date DATE,
  IN p_status VARCHAR(32),
  IN p_file_path VARCHAR(512),
  IN p_file_size BIGINT,
  IN p_file_type VARCHAR(128),
  IN p_tags_csv TEXT
)
BEGIN
  DECLARE v_doc_id INT;

  INSERT INTO documents(name, client_id, folder_id, module, document_type, description, uploaded_by, upload_date, status, version)
  VALUES(p_name, p_client_id, p_folder_id, p_module, p_document_type, p_description, p_uploaded_by, p_upload_date, p_status, 1);

  SET v_doc_id = LAST_INSERT_ID();

  INSERT INTO document_versions(document_id, version_number, file_path, file_size, file_type, created_by)
  VALUES(v_doc_id, 1, p_file_path, p_file_size, p_file_type, p_uploaded_by);

  INSERT IGNORE INTO file_storage(document_version_id, file_path, file_size, file_type)
  SELECT LAST_INSERT_ID(), p_file_path, p_file_size, p_file_type;

  -- tags
  IF p_tags_csv IS NOT NULL AND p_tags_csv <> '' THEN
    -- assumes tags already exist; tags.csv values are tag names
    -- For simplicity, map by name
    INSERT IGNORE INTO document_tags(document_id, tag_id)
    SELECT v_doc_id, t.id
    FROM tags t
    WHERE FIND_IN_SET(t.name, p_tags_csv);
  END IF;

  SELECT v_doc_id AS document_id;
END$$

-- Add new version
CREATE PROCEDURE sp_add_document_version (
  IN p_document_id INT,
  IN p_new_file_path VARCHAR(512),
  IN p_file_size BIGINT,
  IN p_file_type VARCHAR(128),
  IN p_created_by INT
)
BEGIN
  DECLARE v_next_version INT;

  SELECT COALESCE(MAX(version_number),0)+1 INTO v_next_version
  FROM document_versions
  WHERE document_id=p_document_id;

  INSERT INTO document_versions(document_id, version_number, file_path, file_size, file_type, created_by)
  VALUES(p_document_id, v_next_version, p_new_file_path, p_file_size, p_file_type, p_created_by);

  INSERT IGNORE INTO file_storage(document_version_id, file_path, file_size, file_type)
  SELECT LAST_INSERT_ID(), p_new_file_path, p_file_size, p_file_type;

  UPDATE documents SET version=v_next_version, updated_at=CURRENT_TIMESTAMP WHERE id=p_document_id;

  SELECT v_next_version AS version_number;
END$$

-- Version history
CREATE PROCEDURE sp_document_versions (
  IN p_document_id INT
)
BEGIN
  SELECT dv.id, dv.version_number, dv.file_path, dv.file_size, dv.file_type,
         dv.created_at, u.username AS created_by,
         d.status AS status
  FROM document_versions dv
  JOIN users u ON u.id=dv.created_by
  JOIN documents d ON d.id=dv.document_id
  WHERE dv.document_id=p_document_id
  ORDER BY dv.version_number DESC;
END$$

-- Document details (metadata + tags)
CREATE PROCEDURE sp_document_details (
  IN p_document_id INT
)
BEGIN
  SELECT d.*, c.name AS client_name, u.username AS uploaded_by_name
  FROM documents d
  JOIN clients c ON c.id=d.client_id
  JOIN users u ON u.id=d.uploaded_by
  WHERE d.id=p_document_id;

  SELECT t.id, t.name
  FROM document_tags dt
  JOIN tags t ON t.id=dt.tag_id
  WHERE dt.document_id=p_document_id;
END$$

DELIMITER ;

DELIMITER $$



CREATE PROCEDURE sp_create_folder(
    IN p_client_id INT,
    IN p_parent_id INT,
    IN p_name VARCHAR(128),
    IN p_financial_year VARCHAR(32),
    IN p_type VARCHAR(64)
)
BEGIN

    INSERT INTO folders(
        client_id,
        parent_id,
        name,
        financial_year,
        type
    )
    VALUES(
        p_client_id,
        p_parent_id,
        p_name,
        p_financial_year,
        p_type
    );

END $$



CREATE PROCEDURE sp_get_folders()
BEGIN

    SELECT *
    FROM folders
    ORDER BY created_at DESC;

END $$



CREATE PROCEDURE sp_create_tag(
    IN p_name VARCHAR(64),
    IN p_predefined BOOLEAN
)
BEGIN

    INSERT INTO tags(
        name,
        predefined
    )
    VALUES(
        p_name,
        p_predefined
    );

END $$



CREATE PROCEDURE sp_get_tags()
BEGIN

    SELECT *
    FROM tags
    ORDER BY name ASC;

END $$



CREATE PROCEDURE sp_get_clients()
BEGIN

    SELECT *
    FROM clients
    ORDER BY created_at DESC;

END $$



CREATE PROCEDURE sp_get_users()
BEGIN

    SELECT
        u.id,
        u.username,
        u.email,
        r.name AS role
    FROM users u
    JOIN roles r
        ON u.role_id = r.id
    ORDER BY u.created_at DESC;

END $$



CREATE PROCEDURE sp_add_audit_log(
    IN p_user_id INT,
    IN p_action VARCHAR(32),
    IN p_resource VARCHAR(64),
    IN p_resource_id INT
)
BEGIN

    INSERT INTO audit_logs(
        user_id,
        action,
        resource,
        resource_id
    )
    VALUES(
        p_user_id,
        p_action,
        p_resource,
        p_resource_id
    );

END $$



CREATE PROCEDURE sp_get_audit_logs()
BEGIN

    SELECT
        al.id,
        u.username,
        al.action,
        al.resource,
        al.resource_id,
        al.timestamp
    FROM audit_logs al
    LEFT JOIN users u
        ON al.user_id = u.id
    ORDER BY al.timestamp DESC;

END $$



CREATE PROCEDURE sp_create_document_share(
    IN p_document_id INT,
    IN p_user_id INT,
    IN p_can_view BOOLEAN,
    IN p_can_download BOOLEAN,
    IN p_can_edit BOOLEAN
)
BEGIN

    INSERT INTO document_shares(
        document_id,
        shared_with_user_id,
        can_view,
        can_download,
        can_edit
    )
    VALUES(
        p_document_id,
        p_user_id,
        p_can_view,
        p_can_download,
        p_can_edit
    );

END $$



DELIMITER ;

