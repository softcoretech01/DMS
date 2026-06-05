export const getAccessToken = () => {

  return localStorage.getItem(

    'token'

  );
};


export const setAccessToken = (token) => {

  if (token) {

    localStorage.setItem(

      'token',

      token

    );

  } else {

    localStorage.removeItem(

      'token'

    );

  }
};