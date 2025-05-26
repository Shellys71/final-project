// client/src/App.js
import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("");
  const [postData, setPostData] = useState("");
  const [response, setResponse] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/data")
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  }, []);

  const handlePost = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/data", {
        data: postData,
      });
      setResponse(res.data.received);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Fragment>
      <h1>{message}</h1>

      <input
        type="text"
        value={postData}
        onChange={(e) => setPostData(e.target.value)}
      />
      <button onClick={handlePost}>Send Data</button>

      {response && <p>{response}</p>}
    </Fragment>
  );
}

export default App;
