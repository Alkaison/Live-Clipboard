import React from "react";
import { Link } from "react-router-dom";
import "../styles/PrivacyPolicy.css";

function PrivacyPolicyContent() {
  return (
    <div className="privacy-policy-container">
      <h1>Privacy Policy</h1>
      <p>
        <strong>Effective Date:</strong> 01 September 2024
      </p>

      <p>
        Welcome to Realtime Clipboard! This Privacy Policy explains how we
        handle user information for our web application.
      </p>

      <h2>1. What Does Realtime Clipboard Do?</h2>
      <p>
        Realtime Clipboard is a powerful and easy-to-use web app that lets you
        share text and images instantly. It enables real-time collaboration for
        developers, content creators, and teams.
      </p>

      <h2>2. Who Is the Target Audience?</h2>
      <p>
        Our platform is designed for developers, content creators, and teams who
        need to share text and images in real-time.
      </p>

      <h2>3. What Personal Data Do We Collect?</h2>
      <p>
        We do not collect any personal data. Our platform does not require users
        to create an account, and no personal information is collected.
      </p>

      <h2>4. How Is Data Collected?</h2>
      <p>
        We do not collect personal data. Any data typed or pasted by the user on
        the website is only collected for the purpose of real-time sharing
        within the clipboard room.
      </p>

      <h2>5. Do Users Need to Create an Account?</h2>
      <p>
        No, users can use Realtime Clipboard anonymously. No account creation is
        required.
      </p>

      <h2>6. How Do We Use the Collected Data?</h2>
      <p>
        We do not collect personal data. The data that is typed or pasted by
        users is shared in real-time within the same room code and is visible to
        all users within that room.
      </p>

      <h2>7. Do We Share User Data with Third Parties?</h2>
      <p>No, we do not share user data with third parties.</p>

      <h2>8. How Do We Handle Text and Images Users Share?</h2>
      <p>
        All data is securely stored in our database and shared only within the
        same room code.
      </p>

      <h2>9. Where Is User Data Stored?</h2>
      <p>
        We do not store any user data. Data is shared in real-time within the
        same room code and is not stored persistently.
      </p>

      <h2>10. What Security Measures Do We Have to Protect User Data?</h2>
      <p>
        We do not store user data. The data is shared only among users with the
        same room code and is not accessible by others.
      </p>

      <h2>11. How Long Do We Keep User Data?</h2>
      <p>We do not store user data.</p>

      <h2>
        12. Do Users Have Rights to Access, Correct, or Delete Their Data?
      </h2>
      <p>
        Users can access, correct, or delete data within the room code they are
        part of. However, since data is not stored persistently, these actions
        are limited to the current session.
      </p>

      <h2>13. Do We Use Cookies or Similar Tracking Technologies?</h2>
      <p>No, we do not use cookies or similar tracking technologies.</p>

      <h2>14. Where Is Our Service Based?</h2>
      <p>We are based in India.</p>

      <h2>15. Compliance with Laws:</h2>
      <p>
        As our platform does not store or use personal information, compliance
        with specific laws such as GDPR is not applicable at this time. However,
        we reserve the right to make changes to this policy as needed.
      </p>

      <h2>
        16. Are There Any Restrictions on How Users Can Use Realtime Clipboard?
      </h2>
      <p>
        Currently, there are no specific restrictions on the use of Realtime
        Clipboard.
      </p>

      <h2>17. How Do We Handle Service Downtime or Data Loss?</h2>
      <p>
        As a free-to-use platform, we do not store critical user information.
        Downtime is rare, and we will endeavor to restore services as quickly as
        possible.
      </p>

      <h2>18. How Will We Inform Users of Changes to Our Policies?</h2>
      <p>
        We do not store user information, so the primary way to inform users of
        policy changes is through our Privacy Policy page. Users are encouraged
        to check this page regularly for updates.
      </p>

      <h2>19. Do We Plan to Modify or Discontinue the Service?</h2>
      <p>Currently, there are no plans to modify or discontinue the service.</p>

      <h2>20. How Can Users Contact Us with Questions About Our Policies?</h2>
      <p>
        Users can contact us via the <Link to="/feedback">feedback form</Link>{" "}
        or by email at{" "}
        <Link to="mailto:505ganeshmourya@gmail.com">
          505ganeshmourya@gmail.com
        </Link>
        .
      </p>
    </div>
  );
}

export default PrivacyPolicyContent;
