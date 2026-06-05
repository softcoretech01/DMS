import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';

const PermissionContext = createContext();

export const PermissionProvider = ({
  children
}) => {

  const [permissions, setPermissions] = useState([]);

  useEffect(() => {

  const user = JSON.parse(
    localStorage.getItem('user')
  );

  if (user) {

    fetch(
      `http://127.0.0.1:5000/api/permissions/user/${user.id}`
    )
      .then(res => res.json())
      .then(data => {

        console.log(
          "PERMISSION API =",
          data
        );

        setPermissions(data);

      })
      .catch(console.error);

  }

}, []);

  const hasPermission = (
    screen,
    permission
  ) => {

    const row = permissions.find(
      p => p.screen_name === screen
    );

    if (!row) return false;

    return row[permission] === 1;
  };

  return (

    

    <PermissionContext.Provider
      value={{
        permissions,
        hasPermission
      }}
    >

      {children}

    </PermissionContext.Provider>

  );
};

export const usePermissions = () =>
  useContext(PermissionContext);