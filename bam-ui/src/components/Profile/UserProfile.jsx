import React from 'react';

import ProfileForm from './ProfileForm';
import classes from './UserProfile.module.css';
import RequestsList from './RequestsList';

const UserProfile = () => {
  return (
    <section className={classes.profile}>
      <h1>האזור האישי שלך</h1>
      {/* <ProfileForm /> */}
      <RequestsList />
    </section>
  );
};

export default UserProfile;