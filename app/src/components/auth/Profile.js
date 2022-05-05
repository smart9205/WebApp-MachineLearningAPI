import React from "react";
import { Redirect } from 'react-router-dom';
import { useSelector } from "react-redux";
import Button from '@mui/material/Button';

const Profile = () => {
  const { user: currentUser } = useSelector((state) => state.auth);

  if (!currentUser) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>
          My Profile
        </h3>
      </header>

      <p>
        <strong>User:</strong> {currentUser.first_name} {currentUser.last_name}
      </p>
      <p>
        <strong>Email:</strong> {currentUser.email}
      </p>
      <p>
        <strong>Country:</strong> {currentUser.country}
      </p>
      <p>
        <strong>Phone:</strong> {currentUser.phone}
      </p>
      <strong>Authorities:</strong>
      <ul>
        {currentUser.roles &&
          currentUser.roles.map((role, index) => <li key={index}>{role}</li>)}
      </ul>
      <p>
        <strong>Subscriptions:</strong> {currentUser.subscription.name} ({currentUser.subscription.start_date.substring(0, 10)} - {currentUser.subscription.end_date.substring(0, 10)})
      </p>
      <Button variant="contained" color="default" >Change Profile</Button>
    </div>
  );
};

export default Profile;
