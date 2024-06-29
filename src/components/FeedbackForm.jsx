import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { clickLogging } from "../scripts/analyticsLogging";

export default function FeedbackForm() {
  const form = useRef();
  const requestActive = useRef(null);
  const [loader, setLoader] = useState(false);
  const [rating, setRating] = useState(0);
  const [formSubmitMessage, setFormSubmitMessage] = useState("");

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  // feedBack Email sending code
  const sendEmail = (e) => {
    e.preventDefault();
    setFormSubmitMessage("");

    if (rating) {
      setLoader(true);
      clickLogging("User Feedback Submitted");

      const secret = {
        service: import.meta.env.VITE_APP_EMAILJSSERVICE_KEY,
        template: import.meta.env.VITE_APP_EMAILJSTEMPLATE_KEY,
        key: import.meta.env.VITE_APP_EMAILJSAPIKEY,
      };

      if (!requestActive.current) {
        requestActive.current = true;

        emailjs
          .sendForm(secret.service, secret.template, form.current, {
            publicKey: secret.key,
          })
          .then(() => {
            setFormSubmitMessage("Thank You! Your feedback is sent 🚀");
            form.current.reset();
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
    } else {
      setFormSubmitMessage("Please give us rating before senting.");
    }
  };

  return (
    <div className="feedback-container">
      <form ref={form} onSubmit={sendEmail}>
        <h1 className="feedback-h1">User Feedback</h1>
        <p>Let us know how&apos;s your experience with our platform</p>

        <div className="feedback-form">
          <input
            className="form-input"
            type="text"
            name="user_Firstname"
            placeholder="First Name"
            onChange={() => setFormSubmitMessage("")}
            required
          />
          <input
            className="form-input"
            type="text"
            name="user_Lastname"
            placeholder="Last Name"
            required
          />
          <input
            className="form-input"
            type="email"
            id="email"
            name="user_email"
            placeholder="Email Address"
            required
          />
        </div>

        <textarea
          name="message"
          rows="5"
          cols="50"
          placeholder="Your Message"
          required
        ></textarea>

        <input
          type="number"
          name="rating_star"
          value={rating}
          onChange={() => {}} // operation is handled below
          style={{ display: "none" }}
        />

        <div className="rating-star">
          <label className="rate-exp">Rate Experience:</label>

          <div>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => handleRatingChange(star)}
                style={{
                  cursor: "pointer",
                  color: star <= rating ? "gold" : "gray",
                }}
              >
                &#9733;
              </span>
            ))}
          </div>
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
      </form>
    </div>
  );
}
