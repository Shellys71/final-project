import { useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";

import classes from "./ProfileForm.module.css";
import AuthContext from "../../store/auth-context";

const ProfileForm = () => {
  const navigate = useNavigate();
  const newPasswordInputRef = useRef();
  const newNameInputRef = useRef();
  const authCtx = useContext(AuthContext);

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredNewPassword = newPasswordInputRef.current.value;

    // add validation

    fetch("http://localhost:5000/users/me", {
      method: "POST",
      body: JSON.stringify({
        idToken: authCtx.token,
        password: enteredNewPassword,
        returnSecureToken: false,
      }),
      headers: {
        "Content-type": "application/json",
      },
    }).then((res) => {
      // assumption: Always succeeds!

      navigate("/");
    });
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor="new-name">שם חדש</label>
        <input type="name" id="new-name" ref={newNameInputRef} />
      </div>
      <div className={classes.control}>
        <label htmlFor="new-name">אימייל חדש</label>
        <input type="name" id="new-email" ref={newNameInputRef} />
      </div>
      <div className={classes.control}>
        <label htmlFor="new-password">סיסמא חדשה</label>
        <input
          type="password"
          id="new-password"
          minLength="7"
          ref={newPasswordInputRef}
        />
      </div>
      <div className={classes.action}>
        <button>עדכן פרטים</button>
      </div>
    </form>
  );
};

export default ProfileForm;
