import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { appDatabase } from "../firebase/config";
import { ref, update, onValue } from "firebase/database";

function ClipField() {
  let timeoutId;
  const { code } = useParams();
  const textInputFieldRef = useRef(null);
  const database = appDatabase; // Firebase database instance
  const roomRef = ref(database, `/${code}`); // Reference to the database

  const updateValueInDatabase = (value) => {
    const now = new Date().toISOString();
    update(roomRef, { text: value, lastUpdated: now });
  };

  const handleValueChange = () => {
    clearTimeout(timeoutId);
    const enteredValue = textInputFieldRef.current.value;

    // Set a new timeout
    if (!(enteredValue.trim() === "")) {
      timeoutId = setTimeout(() => {
        updateValueInDatabase(enteredValue);
      }, 500);
    }
  };

  // onValue listener for value update
  useEffect(() => {
    const onValueCallback = (snapshot) => {
      if (snapshot.exists()) {
        const { text } = snapshot.val() || "";
        textInputFieldRef.current.value = text;
      }
    };

    onValue(roomRef, onValueCallback);
  }, [code, database, roomRef]);

  return (
    <div className="input">
      <textarea
        name="textarea"
        id="input-box"
        placeholder="Type here"
        autoFocus
        ref={textInputFieldRef}
        onChange={handleValueChange}
      ></textarea>
    </div>
  );
}

export default ClipField;
