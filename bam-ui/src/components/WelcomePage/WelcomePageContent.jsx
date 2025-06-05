import React, { useEffect, useState } from "react";
import classes from "./WelcomePageContent.module.css";

const StartingPageContent = () => {
    const [userName, setUserName] = useState("");

    useEffect(() => {
        const signedUser = JSON.parse(localStorage.getItem("user"));
        setUserName(signedUser.name);
    }, []);

  return (
    <section className={classes.starting}>
      <h1>ברוך הבא {userName}</h1>
    </section>
  );
};

export default StartingPageContent;
