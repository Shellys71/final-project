import React from 'react';

import classes from './UserProfile.module.css';
import RequestsList from './RequestsList';

const UserProfile = () => {
  return (
    <section className={classes.profile}>
      <RequestsList />
    </section>
  );
};

export default UserProfile;