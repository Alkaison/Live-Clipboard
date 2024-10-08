/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { appDatabase } from "../firebase/config";
import { ref, update, onValue } from "firebase/database";
import { userIdentifier } from "../scripts/userIdentifier";
import { sanitizeString } from "../scripts/sanitizeString";
import { TailSpin } from "react-loader-spinner";
import SvgDelete from "./SvgDelete";
import SvgDownload from "./SvgDownload";

const USER_UUID = userIdentifier();

function ClipField() {
  let timeoutId;
  const { code } = useParams();
  const textInputFieldRef = useRef(null);
  const lineNumbersContainerRef = useRef(null);
  const uploadBtnRef = useRef(null);
  const errorRef = useRef(null);
  const fileContainerRef = useRef(null);
  const database = appDatabase; // Firebase database instance
  const roomRef = ref(database, `/${code}`); // Reference to the database
  const [firebaseData, setFirebaseData] = useState({});
  const [images, setImages] = useState([]); // State to store the list of uploaded images
  const [loader, setLoader] = useState(false);

  // update text value and lastUpdated dateTime, for the specific room code
  const updateValueInDatabase = (value) => {
    const now = new Date().toISOString().replace(/\.\d+Z$/, "Z"); // date stored in ISO format without milliseconds
    update(roomRef, {
      text: value,
      images: firebaseData.images || [],
      users: firebaseData?.users?.length ? firebaseData.users : [USER_UUID],
      lastUpdated: now,
    }); // data store into firebase
  };

  // update image value to firebase
  const addNewImagesValueInDatabase = (name, src, bytes, lastUpdated) => {
    const encodedFileName = sanitizeString(name);

    const data = {
      text: textInputFieldRef.current.value,
      images: [
        ...(firebaseData.images || []),
        {
          name: encodedFileName,
          src: src,
          bytes: bytes,
          downloads: 0,
          deleted: false,
          user: USER_UUID,
          lastUpdated: lastUpdated,
        },
      ],
      users: firebaseData?.users?.length ? firebaseData.users : [USER_UUID],
      lastUpdated: lastUpdated,
    };

    update(roomRef, data);
    setLoader(false);
  };

  // update images properties into database
  const updateImagesInDatabase = (imageSrc, action) => {
    const now = new Date().toISOString().replace(/\.\d+Z$/, "Z");

    if (action === "download") {
      // update the image property of downloads to +1 in firebase
      setFirebaseData((prev) => {
        const imagesData = prev.images || [];

        const updatedImagesData = imagesData.map((data) =>
          data.src === imageSrc
            ? { ...data, downloads: data.downloads + 1, lastUpdated: now }
            : data
        );

        // structure the new data
        const updatedData = {
          ...prev,
          images: updatedImagesData,
          lastUpdated: now,
        };

        // update in firebase
        update(roomRef, updatedData);

        return updatedData;
      });
    } else if (action === "delete") {
      // update the image property to deleted in firebase
      setFirebaseData((prev) => {
        const imagesData = prev.images || [];

        const updatedImagesData = imagesData.map((data) =>
          data.src === imageSrc
            ? { ...data, deleted: true, lastUpdated: now }
            : data
        );

        // structure the new data
        const updatedData = {
          ...prev,
          images: updatedImagesData,
          lastUpdated: now,
        };

        // update in firebase
        update(roomRef, updatedData);

        return updatedData;
      });
    } else {
      return;
    }
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

  // check if the image at display is same as the new image
  const imageExists = (name, src) =>
    images.find((image) => image.name === name && image.src === src);

  // upload the image to the cloud
  const uploadImageOnCloudinary = async (src, name) => {
    const payload = new FormData();

    // Payload creation
    payload.append("file", src);
    payload.append("public_id", `${code}_${firebaseData?.images?.length ?? 0}`);
    payload.append(
      "upload_preset",
      import.meta.env.VITE_APP_CLOUDINARY_CLOUD_UPLOAD_PRESET_NAME
    );
    payload.append(
      "cloud_name",
      import.meta.env.VITE_APP_CLOUDINARY_CLOUD_NAME
    );

    // API Request
    fetch(
      `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_APP_CLOUDINARY_CLOUD_NAME
      }/image/upload`,
      {
        method: "post",
        body: payload,
      }
    )
      .then((response) => response.json())
      .then((response) => {
        addNewImagesValueInDatabase(
          name,
          response.url,
          response.bytes,
          response.created_at
        );
      })
      .catch(() => {
        setImages([]);
        errorRef.textContent = "Image Could Not be Uploaded.";
        setLoader(false);
      });
  };

  // handle file uploading on client side
  const fileHandler = (file, name, type) => {
    const error = errorRef.current;

    if (images.length === 1) {
      error.textContent =
        "Only one image can be uploaded at a time. Read the note below.";
      return false;
    }

    if (type.split("/")[0] !== "image") {
      error.textContent = "Please upload an image.";
      return false;
    }

    error.textContent = "";
    setLoader(true);
    let reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      const src = reader.result;

      if (!imageExists(name, src)) {
        setImages(() => [{ src: src, name: name }]);
        uploadImageOnCloudinary(src, name);
      } else {
        error.textContent = "Image already exists";
        setLoader(false);
      }
    };
  };

  // delete the image
  const handleDeleteImage = (imageSrc) => {
    setImages([]);
    updateImagesInDatabase(imageSrc, "delete");
  };

  // handle image paste event on client side
  const handlePaste = (event) => {
    const clipboardData = event.clipboardData || window.clipboardData;
    const items = clipboardData.items;
    const error = errorRef.current;

    if (images.length === 1) {
      error.textContent =
        "Only one image can be uploaded at a time. Read the note below.";
      return false;
    }

    let isValid = false;

    for (let item of items) {
      // Check if the item is a text or an image
      if (
        item.type.indexOf("text") !== -1 ||
        item.type.indexOf("image") !== -1
      ) {
        isValid = true;

        // Handle image paste
        if (item.type.indexOf("image") !== -1) {
          error.textContent = "";
          setLoader(true);

          const file = item.getAsFile();
          const reader = new FileReader();

          reader.onload = () => {
            const src = reader.result;
            console.log("Event: ", event);
            console.log("Reader: ", reader);

            if (!imageExists("clipboard-pasted-image", src)) {
              setImages(() => [{ src: src, name: "clipboard-pasted-image" }]);
              uploadImageOnCloudinary(src, "clipboard-pasted-image");
            } else {
              error.textContent = "Image already exists";
              setLoader(false);
            }
          };

          reader.readAsDataURL(file);
          break;
        }
      }
    }

    if (!isValid) {
      error.textContent = "Please upload an image or paste text.";
      event.preventDefault(); // Prevent the default paste action
      return false;
    }
  };

  // handle image downloading on client side for base64 data or external URL
  const handleDownloadImage = (src, name) => {
    const link = document.createElement("a");

    // Function to trigger the download
    const triggerDownload = (href, fileName) => {
      link.href = href;
      link.download = fileName;
      link.click();
    };

    // Check if the URL is from Cloudinary and append fl_attachment
    const addAttachmentFlag = (url, name) => {
      const urlParts = url.split("/upload/");

      if (urlParts.length === 2) {
        let formattedURL = `${urlParts[0]}/upload/fl_attachment:${name}/${urlParts[1]}`;
        const secureUrl = formattedURL.replace(/^http:/, "https:");
        return secureUrl;
      }

      return url;
    };

    const encodedFileName = sanitizeString(name);

    if (src.startsWith("data:image/")) {
      // If src is base64 data, directly set the href to the base64 data
      triggerDownload(src, encodedFileName);
    } else {
      // If src is an external URL, try to fetch the image
      const downloadUrl = addAttachmentFlag(src, encodedFileName);
      triggerDownload(downloadUrl, encodedFileName);
    }

    updateImagesInDatabase(src, "download");
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
        const snapShotData = snapshot.val();

        if (textInputFieldRef.current) {
          // update text
          textInputFieldRef.current.value = snapShotData?.text ?? "";

          // update Line Numbers Changes
          const numberOfLines =
            textInputFieldRef.current.value.split("\n").length;

          lineNumbersContainerRef.current.innerHTML = Array(numberOfLines)
            .fill("<span></span>")
            .join("");
        }

        let users = snapShotData?.users ?? [];

        // if users array is empty, add the user uuid
        if (!users.length) {
          users = [USER_UUID];
        } else if (!users.includes(USER_UUID)) {
          users.push(USER_UUID);
        }

        // update firebase data to keep track of changes
        setFirebaseData({ ...snapshot.val(), users: users });

        // update image, if found
        if (
          snapShotData &&
          snapShotData?.images &&
          Array.isArray(snapShotData?.images) &&
          snapShotData?.images?.length > 0
        ) {
          // get all unDeleted images
          const unDeletedImages = snapShotData.images.filter(
            (data) => !data.deleted
          );

          // return if no unDeleted images found
          if (unDeletedImages.length === 0) {
            setImages([]);
            return;
          }

          // extract the latest uploaded images from unDeletedImages
          const latestImage = unDeletedImages.reduce((latest, current) =>
            new Date(current.lastUpdated) > new Date(latest.lastUpdated)
              ? current
              : latest
          );

          // set the latest image
          setImages([latestImage]);
        }
      }
    };

    onValue(roomRef, onValueCallback);
  }, []);

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

  // handle Next Line Numbers Change
  useEffect(() => {
    const lineNumbersContainer = lineNumbersContainerRef.current;
    const textAreaInputField = textInputFieldRef.current;

    const handleLineNumberChanges = () => {
      const numberOfLines = textAreaInputField.value.split("\n").length;

      lineNumbersContainer.innerHTML = Array(numberOfLines)
        .fill("<span></span>")
        .join("");
    };

    textAreaInputField.addEventListener("keyup", handleLineNumberChanges);

    return () => {
      textAreaInputField.removeEventListener("keyup", handleLineNumberChanges);
    };
  }, []);

  // handle Tab Click
  useEffect(() => {
    const handleTabClick = (event) => {
      if (event.key === "Tab") {
        const textarea = textInputFieldRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        // Insert tab character at the caret position
        textarea.value =
          textarea.value.substring(0, start) +
          "\t" +
          textarea.value.substring(end);

        // Move the caret position after the inserted tab character
        textarea.selectionStart = start + 1;
        textarea.selectionEnd = start + 1;

        // Set focus back to the textarea to keep the user in the same position
        textarea.focus();

        // Prevent the default tab behavior (which usually moves focus)
        event.preventDefault();
      }
    };

    const textarea = textInputFieldRef.current;
    textarea.addEventListener("keydown", handleTabClick);

    return () => {
      textarea.removeEventListener("keydown", handleTabClick);
    };
  }, []);

  // handle TextArea and LineNumbers Changes Syncing
  useEffect(() => {
    const lineNumbersContainer = lineNumbersContainerRef.current;
    const textAreaInputField = textInputFieldRef.current;

    const syncScroll = (source) => {
      if (source === "textarea") {
        lineNumbersContainer.scrollTop = textAreaInputField.scrollTop;
      } else if (source === "linenumbers") {
        textAreaInputField.scrollTop = lineNumbersContainer.scrollTop;
      }
    };

    const handleScroll = (e) => {
      if (e.target === textAreaInputField) {
        syncScroll("textarea");
      } else if (e.target === lineNumbersContainer) {
        syncScroll("linenumbers");
      }
    };

    textAreaInputField.addEventListener("scroll", handleScroll);
    lineNumbersContainer.addEventListener("scroll", handleScroll);

    return () => {
      textAreaInputField.removeEventListener("scroll", handleScroll);
      lineNumbersContainer.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="Clipboard-container">
      <div className="input">
        <div className="line-numbers" ref={lineNumbersContainerRef}>
          <span></span>
        </div>

        <textarea
          name="textarea"
          id="input-box"
          placeholder="Type your text or paste images using Ctrl + V."
          autoFocus={true}
          autoComplete="off"
          spellCheck="false"
          ref={textInputFieldRef}
          onChange={handleValueChange}
          onPaste={handlePaste}
        ></textarea>
      </div>

      <div
        className="file-container"
        ref={fileContainerRef}
        onClick={() => uploadBtnRef.current.click()}
      >
        <p className="feature-label-text">New Feature</p>

        {images.length === 0 && (
          <div className="image-upload-container">
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

            <p>Select, paste or drop the image here.</p>
          </div>
        )}

        {/* Uploaded Images Container */}
        {images.length === 1 && (
          <div id="image-display">
            {/* Render Images */}
            {images.map((image, index) => (
              <div key={index}>
                <div className="uploaded-image-container">
                  <img src={image.src} alt={image.name} />

                  {loader && (
                    <div className="uploaded-image-loader-container">
                      <TailSpin
                        visible={true}
                        height="80"
                        width="80"
                        color="#1d3557"
                        ariaLabel="tail-spin-loading"
                        radius="1"
                      />
                    </div>
                  )}
                </div>

                {/* Render when the loader gets off */}
                {!loader && (
                  <>
                    <figcaption title={image.name}>{image.name}</figcaption>

                    <div className="images-action-buttons-container">
                      <button
                        className="file-download-Btn"
                        onClick={() =>
                          handleDownloadImage(image.src, image.name)
                        }
                      >
                        <SvgDownload />
                        <span>Download</span>
                      </button>

                      <button
                        className="bin-button"
                        onClick={() => handleDeleteImage(image.src)}
                      >
                        <SvgDelete />
                        <span>Delete</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        <div id="error" ref={errorRef}></div>

        {/* Message for Information */}
        <div className="message-text-information-img-upload">
          <span>Note:</span> Only one image can be shared at a time. Please
          delete the current image before uploading a new one.
        </div>
      </div>
    </div>
  );
}

export default ClipField;
