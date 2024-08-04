import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import ReactStars from "react-stars";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { clickLogging } from "../scripts/analyticsLogging";
import { userIdentifier } from "../scripts/userIdentifier";

const USER_UUID = userIdentifier();

export default function FeedbackForm() {
  const feedbackFormSchema = yup.object({
    firstName: yup.string().required("Please enter your first name"),
    lastName: yup.string().required("Please enter your last name"),
    email: yup
      .string()
      .email("Invalid email")
      .required("Please enter your email"),
    message: yup.string().required("Please enter a message"),
  });

  const form = useRef();
  const requestActive = useRef(null);
  const [loader, setLoader] = useState(false);
  const [rating, setRating] = useState(5);
  const [formSubmitMessage, setFormSubmitMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(feedbackFormSchema),
  });

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  // handle form submission to sheet
  const submitFeedbackFormToSheet = async (data) => {
    // Retrieve additional form data
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const currentTime = new Date().toISOString(); // Current date and time in ISO format
    const formSubmissionTime = new Date().toISOString(); // Time when the form is submitted
    const userAgent = navigator?.userAgent || "NA";
    const language = navigator?.language || navigator?.userLanguage || "NA";

    const formData = new FormData();
    formData.append("firstName", data?.firstName);
    formData.append("lastName", data?.lastName);
    formData.append("email", data?.email);
    formData.append("message", data?.message);
    formData.append("rating", rating);
    formData.append("timezone", timezone);
    formData.append("currentTime", currentTime);
    formData.append("formSubmissionTime", formSubmissionTime);
    formData.append("userId", USER_UUID);
    formData.append("userAgent", userAgent);
    formData.append("language", language);

    try {
      await fetch(import.meta.env.VITE_APP_SHEET_URL, {
        method: "POST",
        body: formData,
        muteHttpExceptions: true,
      });
    } catch (error) {
      /* Empty */
    }
  };

  // feedBack Email sending code
  const sendEmail = (data) => {
    setFormSubmitMessage("");

    if (!rating) {
      setFormSubmitMessage("Please give us rating before senting.");
      return;
    }

    setLoader(true);
    clickLogging("User Feedback Submitted");

    if (!requestActive.current) {
      requestActive.current = true;

      // Sheet Submission
      submitFeedbackFormToSheet(data);

      const secret = {
        service: import.meta.env.VITE_APP_EMAILJSSERVICE_KEY,
        template: import.meta.env.VITE_APP_EMAILJSTEMPLATE_KEY,
        key: import.meta.env.VITE_APP_EMAILJSAPIKEY,
      };

      // data template
      const formDataTemplate = {
        firstName: data?.firstName,
        lastName: data?.lastName,
        email: data?.email,
        message: data?.message,
        rating: rating,
        user: USER_UUID,
      };

      // Email Submission
      emailjs
        .send(secret.service, secret.template, formDataTemplate, {
          publicKey: secret.key,
        })
        .then(() => {
          setFormSubmitMessage("Thank You! Your feedback is sent 🚀");
          form.current.reset();

          // update the data to stop showing toast messages
          const getData = JSON.parse(localStorage.getItem("feedback")) || {};
          localStorage.setItem(
            "feedback",
            JSON.stringify({
              ...getData,
              hasSubmittedFeedbackResponse: true,
            })
          );

          setRating(0);
          setLoader(false);
          requestActive.current = false;
        })
        .catch(() => {
          setFormSubmitMessage(
            "Oops! Couldn't sent your feedback. Please try again."
          );
          requestActive.current = false;
          setLoader(false);
        });
    }
  };

  return (
    <div className="feedback-container">
      <div className="feedback-img-container">
        <img src="./assets/feedbackAvatar.png" alt="Feedback Form Avatar" />
      </div>

      <form ref={form} onSubmit={handleSubmit(sendEmail)}>
        <h1 className="feedback-h1">We&apos;d Love Your Feedback! 💛</h1>
        <p>
          Please let us know how you like our product and what we can improve.
        </p>

        <div className="feedback-form">
          <div className="form-double-input-container">
            <div className="form-input-container">
              <label htmlFor="firstName">First Name:</label>
              <input
                className="form-input"
                type="text"
                name="user_Firstname"
                id="firstName"
                {...register("firstName")}
              />
              <p className="error">{errors.firstName?.message}</p>
            </div>

            <div className="form-input-container">
              <label htmlFor="lastName">Last Name:</label>
              <input
                className="form-input"
                type="text"
                name="user_Lastname"
                id="lastName"
                {...register("lastName")}
              />
              <p className="error">{errors.lastName?.message}</p>
            </div>
          </div>

          <div className="form-input-container">
            <label htmlFor="email">Email:</label>
            <input
              className="form-input"
              type="email"
              id="email"
              name="user_email"
              {...register("email")}
            />
            <p className="error">{errors.email?.message}</p>
          </div>

          <div className="form-input-container">
            <label htmlFor="message">Message:</label>
            <textarea
              name="message"
              rows="5"
              cols="50"
              id="message"
              {...register("message")}
            ></textarea>
            <p className="error">{errors.message?.message}</p>
          </div>

          <input
            type="number"
            name="rating_star"
            id="rating"
            value={rating}
            onChange={() => {}} // operation is handled below
            style={{ display: "none" }}
          />

          <div className="rating-star form-input-container">
            <label className="rate-exp">Rate Experience:</label>

            <ReactStars
              count={5}
              onChange={handleRatingChange}
              size={32}
              value={rating}
              color2={"#ffd700"}
            />
          </div>

          <button
            className="form-btn1"
            type="submit"
            value="Submit"
            onClick={() => setFormSubmitMessage("")}
          >
            Submit
            {loader ? (
              <div className="loader"></div>
            ) : (
              <svg
                width="800px"
                height="800px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20.7639 12H10.0556M3 8.00003H5.5M4 12H5.5M4.5 16H5.5M9.96153 12.4896L9.07002 15.4486C8.73252 16.5688 8.56376 17.1289 8.70734 17.4633C8.83199 17.7537 9.08656 17.9681 9.39391 18.0415C9.74792 18.1261 10.2711 17.8645 11.3175 17.3413L19.1378 13.4311C20.059 12.9705 20.5197 12.7402 20.6675 12.4285C20.7961 12.1573 20.7961 11.8427 20.6675 11.5715C20.5197 11.2598 20.059 11.0295 19.1378 10.5689L11.3068 6.65342C10.2633 6.13168 9.74156 5.87081 9.38789 5.95502C9.0808 6.02815 8.82627 6.24198 8.70128 6.53184C8.55731 6.86569 8.72427 7.42461 9.05819 8.54246L9.96261 11.5701C10.0137 11.7411 10.0392 11.8266 10.0493 11.9137C10.0583 11.991 10.0582 12.069 10.049 12.1463C10.0387 12.2334 10.013 12.3188 9.96153 12.4896Z"
                  stroke="#003049"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>

          {formSubmitMessage && (
            <p
              style={{
                color: formSubmitMessage.includes("Thank")
                  ? "#00ff5f"
                  : "#FF0000",
              }}
            >
              {formSubmitMessage}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
