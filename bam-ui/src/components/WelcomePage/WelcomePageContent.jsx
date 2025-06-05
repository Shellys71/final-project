import React, { useEffect, useState } from "react";
import classes from "./WelcomePageContent.module.css";

const StartingPageContent = () => {
    const [userName, setUserName] = useState("");

    useEffect(() => {
        const signedUser = JSON.parse(localStorage.getItem("user"));
        if (signedUser) {
            setUserName(signedUser.name);
        }
    }, []);

  return (
    <section className={classes.starting}>
      <h1>ברוך הבא {userName ? userName : "אורח"}</h1>
    </section>
  );
};

export default StartingPageContent;
