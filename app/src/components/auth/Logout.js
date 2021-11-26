import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { logout } from "../../actions/auth";

const Logout = (props) => {
  const dispatch = useDispatch();

	useEffect(() => {
    dispatch(logout());
		window.top.location.replace("https://stats2win.net");
	},[dispatch]);
  
	return (
    <div></div>
  );
};

export default Logout;
