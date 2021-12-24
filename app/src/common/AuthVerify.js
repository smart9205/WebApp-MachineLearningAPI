import React from "react";
import { history } from '../helpers/history';
import { getUser, parseJwt } from '../common/utilities'


const AuthVerify = (props) => {
  history.listen(() => {
    const user = getUser();
    
    if (user) {
      const decodedJwt = parseJwt(user.accessToken);

      if (decodedJwt.exp * 1000 < Date.now()) {
        props.logOut();
      }
    }
  });

  return <div></div>;
};

export default AuthVerify;
