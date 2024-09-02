import React from "react";

function FAQsContent({ question, answer }) {
  return (
    <div className="faqs-content-container">
      <p>
        <span>※</span> {question}
      </p>
      <p>{answer}</p>
    </div>
  );
}

export default FAQsContent;
