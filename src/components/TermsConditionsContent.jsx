import React from "react";
import { Link } from "react-router-dom";

function TermsConditionsContent() {
  return (
    <div className="privacy-policy-container">
      <h1>Terms and Conditions</h1>
      <p>
        <strong>Effective Date:</strong> 01 September 2024
      </p>

      <p>
        Welcome to Realtime Clipboard! These Terms and Conditions govern your
        use of our web application. By using our service, you agree to these
        terms. If you do not agree, please do not use our platform.
      </p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using Realtime Clipboard, you agree to comply with and
        be bound by these Terms and Conditions and our Privacy Policy. We may
        update these terms from time to time, and your continued use of the
        service constitutes acceptance of any changes.
      </p>

      <h2>2. Description of Service</h2>
      <p>
        Realtime Clipboard is a web application that enables users to share text
        and images in real-time. It is designed for developers, content
        creators, and teams to collaborate and share content instantly.
      </p>

      <h2>3. Use of Service</h2>
      <ul>
        <li>
          <strong>Eligibility:</strong> You must be at least 13 years old to use
          Realtime Clipboard. By using our service, you confirm that you meet
          this age requirement.
        </li>
        <li>
          <strong>Account Requirements:</strong> No account creation is required
          to use our service. The platform is open for anonymous use.
        </li>
        <li>
          <strong>Prohibited Uses:</strong> You agree not to use Realtime
          Clipboard for any unlawful purposes or to transmit any content that
          violates applicable laws or regulations.
        </li>
      </ul>

      <h2>4. Data Handling</h2>
      <ul>
        <li>
          <strong>Personal Data:</strong> We do not collect any personal data
          from users. Our platform operates anonymously.
        </li>
        <li>
          <strong>Data Collection:</strong> The data entered or uploaded by
          users is only used for real-time sharing within the same room code and
          is not stored persistently.
        </li>
      </ul>

      <h2>5. Intellectual Property</h2>
      <p>
        All content and materials on Realtime Clipboard, including but not
        limited to text, graphics, logos, and software, are the property of
        Realtime Clipboard or its licensors and are protected by intellectual
        property laws. You may not use any content from our platform without
        prior written permission.
      </p>

      <h2>6. Limitation of Liability</h2>
      <p>
        Realtime Clipboard is provided &quot;as is&quot; and &quot;as
        available&quot; without warranties of any kind, either express or
        implied. We do not guarantee that the service will be uninterrupted or
        error-free. We shall not be liable for any indirect, incidental, or
        consequential damages arising from the use of our service.
      </p>

      <h2>7. Termination</h2>
      <p>
        We reserve the right to terminate or suspend your access to Realtime
        Clipboard at our discretion, without notice, for any reason, including
        violation of these Terms and Conditions.
      </p>

      <h2>8. Changes to Terms</h2>
      <p>
        We may update these Terms and Conditions from time to time. Any changes
        will be posted on this page, and your continued use of the service
        constitutes acceptance of the updated terms.
      </p>

      <h2>9. Governing Law</h2>
      <p>
        These Terms and Conditions are governed by and construed in accordance
        with the laws of India. Any disputes arising from these terms will be
        subject to the exclusive jurisdiction of the courts in India.
      </p>

      <h2>10. Contact Us</h2>
      <p>
        If you have any questions or concerns about these Terms and Conditions,
        please contact us via the <Link to="/feedback">feedback form</Link> or
        by email at{" "}
        <Link to="mailto:505ganeshmourya@gmail.com">
          505ganeshmourya@gmail.com
        </Link>
        . .
      </p>
    </div>
  );
}

export default TermsConditionsContent;
