import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  useEffect
} from "react";

const DMSContext = createContext(null);

export const DMSProvider = ({ children }) => {

  const [currentUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  console.log(
  "CURRENT USER =",
  currentUser
);

  const [documents, setDocuments] = useState([]);
  const [folders, setFolders] = useState([]);
  const [users, setUsers] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // USERS
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/users/")
      .then(res => res.json())
      .then(data => {
        setUsers(data);
      })
      .catch(console.error);
  }, []);

  // PERMISSIONS
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/permissions/")
      .then(res => res.json())
      .then(data => {
        setPermissions(data);
      })
      .catch(console.error);
  }, []);

  const addNotification = useCallback((message, type = "success") => {

    const id = Date.now();

    setNotifications(prev => [
      ...prev,
      {
        id,
        message,
        type
      }
    ]);

    setTimeout(() => {
      setNotifications(prev =>
        prev.filter(n => n.id !== id)
      );
    }, 4000);

  }, []);

  const removeNotification = useCallback((id) => {

    setNotifications(prev =>
      prev.filter(n => n.id !== id)
    );

  }, []);

  const addDocument = useCallback((doc) => {

    setDocuments(prev => [
      ...prev,
      {
        ...doc,
        uploadedBy: currentUser?.name || "Unknown"
      }
    ]);

  }, [currentUser]);

  const updateDocument = useCallback((id, updates) => {

    setDocuments(prev =>
      prev.map(doc =>
        doc.id === id
          ? { ...doc, ...updates }
          : doc
      )
    );

  }, []);

  const deleteDocument = useCallback((id) => {

    setDocuments(prev =>
      prev.filter(doc => doc.id !== id)
    );

  }, []);

  const searchDocuments = useCallback((query) => {

    return documents.filter(doc =>
      JSON.stringify(doc)
        .toLowerCase()
        .includes(query.toLowerCase())
    );

  }, [documents]);

  const addFolder = useCallback((folder) => {

    setFolders(prev => [
      ...prev,
      folder
    ]);

  }, []);

  const getFolderHierarchy = useCallback(() => {

    return folders;

  }, [folders]);

  const hasPermission = useCallback(() => {

    return true;

  }, []);

  const canViewDocument = useCallback(() => true, []);
  const canEditDocument = useCallback(() => true, []);
  const canDeleteDocument = useCallback(() => true, []);

  const tags = useMemo(() => {

    return [];

  }, []);

  const value = {

    currentUser,

    users,
    permissions,

    documents,
    addDocument,
    updateDocument,
    deleteDocument,
    searchDocuments,

    folders,
    addFolder,
    getFolderHierarchy,

    hasPermission,
    canViewDocument,
    canEditDocument,
    canDeleteDocument,

    tags,

    notifications,
    addNotification,
    removeNotification

  };

  return (
    <DMSContext.Provider value={value}>
      {children}
    </DMSContext.Provider>
  );

};

export const useDMS = () => {

  const ctx = useContext(DMSContext);

  if (!ctx) {
    throw new Error(
      "useDMS must be used within DMSProvider"
    );
  }

  return ctx;

};