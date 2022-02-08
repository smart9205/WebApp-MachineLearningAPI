import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { logout } from "../../actions/auth";

const Logout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logout());
  }, [dispatch]);

  return (
    <></>
  );
};

export default Logout;
