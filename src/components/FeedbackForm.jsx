import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function FeedbackForm() {
  // Rating Star code
  const [rating, setRating] = useState(0);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  // Feedback Receive code
  const form = useRef();
  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm("service_qt384lh", "template_seosl0n", form.current, {
        publicKey: "gJM8h3OHoo8Xowk4F",
      })

      .then(
        () => {
          console.log("SUCCESS!");
        },
        (error) => {
          console.log("FAILED...", error.text);
        }
      );

    // refresh page after sumbit form
    setTimeout(function () {
      window.location.reload(1);
    }, 5000);

    // Feedback sumbit pop-up
    toast.success("Thank you for your feedback!", {
      position: "top-right",
    });
  };

  return (
    <>
      <ToastContainer theme="colored" autoClose={4000} />

      <div className="feedback-container">
        <form ref={form} onSubmit={sendEmail}>
          <h1 className="feedback-h1">Feedback</h1>
          <div className="feedback-form">
            <input
              className="form-input"
              type="text"
              name="user_Firstname"
              placeholder="First Name"
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
              placeholder="email"
              required
            />
          </div>
          <textarea
            name="message"
            rows="5"
            cols="50"
            placeholder="Message"
            required
          ></textarea>

          {/* input use for rating send to email */}
          <input
            type="number"
            name="rating_star"
            value={rating}
            style={{ display: "none" }}
          />

          <div className="rating-star">
            <label>Rating:</label>
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

          <button className="form-btn1" type="submit" value="send">
            submit
          </button>
        </form>
      </div>
    </>
  );
}
