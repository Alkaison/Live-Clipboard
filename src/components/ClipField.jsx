import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { appDatabase } from "../firebase/config";
import { ref, update, onValue } from "firebase/database";
import SvgDelete from "./SvgDelete";
import SvgDownload from "./SvgDownload";

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

  const imageExists = useCallback(
    (name, src) => {
      return images.some((image) => image.name === name && image.src === src);
    },
    [images]
  );

  // upload the image to the cloud
  const uploadImageOnCloudinary = async (imageData) => {
    const payload = new FormData();

    // Payload creation
    payload.append("file", imageData);
    payload.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_CLOUD_UPLOAD_PRESET_NAME
    );
    payload.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

    // API Request
    fetch(
      `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
      }/image/upload`,
      {
        method: "post",
        body: payload,
      }
    )
      .then((response) => response.json())
      .then((response) => {
        console.log("Image Uploaded: ", response);
      })
      .catch((error) => {
        console.log("Image Could Not be Uploaded: ", error);
      });
  };

  const fileHandler = useCallback(
    (file, name, type) => {
      const error = errorRef.current;

      if (type.split("/")[0] !== "image") {
        error.innerHTML = "Please upload an image.";
        return false;
      }

      error.innerHTML = "";
      let reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        const src = reader.result;

        if (!imageExists(name, src)) {
          setImages((prevImages) => [{ src: src, name: name }]);
          uploadImageOnCloudinary(src);
        } else {
          error.innerHTML = "Image already exists";
        }
      };
    },
    [imageExists]
  );

  const handleDeleteImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleDownloadImage = (src, name) => {
    const link = document.createElement("a");
    link.href = src;
    link.download = name;
    link.click();
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
  }, [fileHandler]);

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

  return (
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
        <p className="feature-label-text">New Feature</p>

        {images.length === 0 && (
          <>
            <input
              type="file"
              name="file-input"
              id="upload-btn"
              className="file-input"
              accept="image/*"
              max="5242880" // 5 MB in bytes
              ref={uploadBtnRef}
            />

            <img
              id="upload-img"
              src="../assets/upload.png"
              alt="Upload Assets"
            />

            <label id="file-label" htmlFor="upload-btn">
              Select or drop the image here
            </label>
          </>
        )}

        <div id="error" ref={errorRef}></div>

        {/* Uploaded Images Container */}
        {images.length === 1 && (
          <div id="image-display">
            {/* Render Images */}
            {images.map((image, index) => (
              <div key={index}>
                <img src={image.src} alt={image.name} />
                <figcaption title={image.name}>{image.name}</figcaption>

                <div className="images-action-buttons-container">
                  <button
                    className="file-download-Btn"
                    onClick={() => handleDownloadImage(image.src, image.name)}
                  >
                    <SvgDownload />
                    <span>Download</span>
                  </button>

                  <button
                    className="bin-button"
                    onClick={() => handleDeleteImage(index)}
                  >
                    <SvgDelete />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Message for Information */}
        {images.length === 1 && (
          <div className="message-text-information-img-upload">
            <span>Info:</span> Please note that we currently support sharing
            only one image at a time.
          </div>
        )}
      </div>
    </div>
  );
}

export default ClipField;
