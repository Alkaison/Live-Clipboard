import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { appDatabase } from "../firebase/config";
import { ref, update, onValue } from "firebase/database";

function ClipField() {
  let timeoutId;
  const { code } = useParams();
  const textInputFieldRef = useRef(null);
  const uploadBtnRef = useRef(null);
  const errorRef = useRef(null);
  const fileContainerRef = useRef(null);
  const database = appDatabase; // Firebase database instance
  const roomRef = ref(database, `/${code}`); // Reference to the database

  const [images, setImages] = useState([]); // State to store the list of uploaded images

  // update value and lastUpdated dateTime, for the specific room code
  const updateValueInDatabase = (value) => {
    const now = new Date().toISOString(); // date stored
    update(roomRef, { text: value, lastUpdated: now }); // data store into firebase
  };

  // avoid continuous data spamming with 0.5 seconds delay
  const handleValueChange = () => {
    clearTimeout(timeoutId);
    const enteredValue = textInputFieldRef.current.value;

    // Set a new timeout
    if (!(enteredValue.trim() === "")) {
      timeoutId = setTimeout(() => {
        updateValueInDatabase(enteredValue); //data store
      }, 500);
    }
  };

  // get text in firebase and show on clipboard
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

  const fileHandler = (file, name, type) => {
    const error = errorRef.current;

    if (type.split("/")[0] !== "image") {
      error.innerHTML = "Please upload an image";
      return false;
    }

    error.innerHTML = "";
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImages((prevImages) => [
        ...prevImages,
        { src: reader.result, name: name },
      ]);
    };
  };

  // Set up file input event listener
  useEffect(() => {
    const upload_Btn = uploadBtnRef.current;

    const handleFileChange = () => {
      Array.from(upload_Btn.files).forEach((file) => {
        fileHandler(file, file.name, file.type);
      });
    };

    if (upload_Btn) {
      upload_Btn.addEventListener("change", handleFileChange);

      // Cleanup the event listener on component unmount
      return () => {
        upload_Btn.removeEventListener("change", handleFileChange);
      };
    }
  }, []);

  // Set up drag and drop event listeners
  useEffect(() => {
    const fileContainer = fileContainerRef.current;

    const handleDragEnter = (e) => {
      e.preventDefault();
      e.stopPropagation();
      fileContainer.classList.add("active");
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      fileContainer.classList.remove("active");
    };

    const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
      fileContainer.classList.add("active");
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      fileContainer.classList.remove("active");

      const files = e.dataTransfer.files;
      Array.from(files).forEach((file) => {
        fileHandler(file, file.name, file.type);
      });
    };

    if (fileContainer) {
      fileContainer.addEventListener("dragenter", handleDragEnter, false);
      fileContainer.addEventListener("dragleave", handleDragLeave, false);
      fileContainer.addEventListener("dragover", handleDragOver, false);
      fileContainer.addEventListener("drop", handleDrop, false);

      // Cleanup the event listeners on component unmount
      return () => {
        fileContainer.removeEventListener("dragenter", handleDragEnter, false);
        fileContainer.removeEventListener("dragleave", handleDragLeave, false);
        fileContainer.removeEventListener("dragover", handleDragOver, false);
        fileContainer.removeEventListener("drop", handleDrop, false);
      };
    }
  }, []);

  const handleDeleteImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleDownloadImage = (src, name) => {
    const link = document.createElement("a");
    link.href = src;
    link.download = name;
    link.click();
  };

  return (
    <>
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

      <div className="file-container" ref={fileContainerRef}>
        <input
          type="file"
          name="file-input"
          id="upload-btn"
          className="file-input"
          multiple
          accept="image/*"
          ref={uploadBtnRef}
        />
        <label id="file-label" htmlFor="upload-btn">Choose or drop file</label>
        <div id="error" ref={errorRef}></div>
        <div id="image-display">
          {images.map((image, index) => (
            <figure key={index}>
              <img src={image.src} alt={image.name} />
              <figcaption>{image.name}</figcaption>
              <button onClick={() => handleDownloadImage(image.src, image.name)}>
                Download
              </button>
              <button onClick={() => handleDeleteImage(index)}>Delete</button>
            </figure>
          ))}
        </div>
      </div>
    </>
  );
}

export default ClipField;
