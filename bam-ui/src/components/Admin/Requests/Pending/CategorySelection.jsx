import React, { useRef } from "react";

import classes from "./CategorySelection.module.css";

const CategorySelection = (props) => {
  const descriptionInputRef = useRef();

  const changeCategryHandler = () => {
    const enteredDescription = descriptionInputRef.current.value;
    props.onCategoryChange(enteredDescription);
  };

  return (
    <div className={classes.content}>
      <label htmlFor="description">סוג הבקשה</label>
      <select id="description" ref={descriptionInputRef} onChange={changeCategryHandler}>
        <option value=""> </option>
        <option value="בקשת השחרה">בקשת השחרה</option>
        <option value='בקשת אישור כניסה רגלי/רכוב לבה"ד'>
          בקשת אישור כניסה רגלי/רכוב לבה"ד
        </option>
        <option value="בקשת קידוד חוגר">בקשת קידוד חוגר</option>
        <option value='בקשת טופס חתימה על שו"ס'>בקשת טופס חתימה על שו"ס</option>
      </select>
    </div>
  );
};

export default CategorySelection;
