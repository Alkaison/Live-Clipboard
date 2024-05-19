import React, { useEffect, useRef, useState, useCallback } from "react";
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

  const imageExists = useCallback((name, src) => {
    return images.some(image => image.name === name && image.src === src);
  }, [images]);

  const fileHandler = useCallback((file, name, type) => {
    const error = errorRef.current;
  
    if (type.split("/")[0] !== "image") {
      error.innerHTML = "Please upload an image";
      setTimeout(() => {
        error.innerHTML = "";
      }, 3000); // Clear the error message after 3 seconds
      return false;
    }
  
    error.innerHTML = "";
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const src = reader.result;
      if (!imageExists(name, src)) {
        setImages((prevImages) => [
          ...prevImages,
          { src: src, name: name },
        ]);
      } else {
        error.innerHTML = "Image already exists";
        setTimeout(() => {
          error.innerHTML = "";
        }, 3000); // Clear the error message after 3 seconds
      }
    };
  }, [imageExists]);
  

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
  }, [fileHandler]);

  // Set up drag and drop event listeners
  useEffect(() => {
    const fileContainer = fileContainerRef.current;

    const handleDragEnter = (e) => {
      e.preventDefault();
      e.stopPropagation();
      fileContainer.classList.add("imageDrop-active");
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      fileContainer.classList.remove("imageDrop-active");
    };

    const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
      fileContainer.classList.add("imageDrop-active");
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      fileContainer.classList.remove("imageDrop-active");

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
  }, [fileHandler]);

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
      <div className="Clipboard-container">

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

          {/* <div className="upload-btn"> */}
          <img id="upload-img" src="../assets/upload.png" alt="not loading"  />
          <label id="file-label" htmlFor="upload-btn">Choose or drop file</label>
          <div id="error" ref={errorRef}></div>
          {/* </div> */}
          <div id="image-display">
            {images.map((image, index) => (
              <figure key={index}>
                <img src={image.src} alt={image.name} />
                <figcaption>{image.name}</figcaption>
                <button class="file-download-Btn" onClick={() => handleDownloadImage(image.src, image.name)}>
                  <svg class="svgIcon" viewBox="0 0 384 512" height="1em" xmlns="http://www.w3.org/2000/svg"><path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"></path></svg>
                  <span class="icon2"></span>
                </button>
                <button class="bin-button" onClick={() => handleDeleteImage(index)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 39 7"
                    class="bin-top"
                  >
                    <line stroke-width="4" stroke="white" y2="5" x2="39" y1="5"></line>
                    <line
                      stroke-width="3"
                      stroke="white"
                      y2="1.5"
                      x2="26.0357"
                      y1="1.5"
                      x1="12"
                    ></line>
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 33 39"
                    class="bin-bottom"
                  >
                    <mask fill="white" id="path-1-inside-1_8_19">
                      <path
                        d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"
                      ></path>
                    </mask>
                    <path
                      mask="url(#path-1-inside-1_8_19)"
                      fill="white"
                      d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z"
                    ></path>
                    <path stroke-width="4" stroke="white" d="M12 6L12 29"></path>
                    <path stroke-width="4" stroke="white" d="M21 6V29"></path>
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 89 80"
                    class="garbage"
                  >
                    <path
                      fill="white"
                      d="M20.5 10.5L37.5 15.5L42.5 11.5L51.5 12.5L68.75 0L72 11.5L79.5 12.5H88.5L87 22L68.75 31.5L75.5066 25L86 26L87 35.5L77.5 48L70.5 49.5L80 50L77.5 71.5L63.5 58.5L53.5 68.5L65.5 70.5L45.5 73L35.5 79.5L28 67L16 63L12 51.5L0 48L16 25L22.5 17L20.5 10.5Z"
                    ></path>
                  </svg>
                </button>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
export default ClipField;
