import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { logout } from "../../actions/auth";

const Logout = (props) => {
  const dispatch = useDispatch();

	useEffect(() => {
    dispatch(logout());
		window.location.replace("https://soccer.s4upro.com");
	},[dispatch]);
  
	return (
    <div></div>
  );
};

export default Logout;
