import React from 'react';

import classes from './UserProfile.module.css';
import RequestsList from './RequestsList';

const UserProfile = () => {
  return (
    <section className={classes.profile}>
      <h1>הבקשות שלך</h1>
      <RequestsList />
    </section>
  );
};

export default UserProfile;