import React, { useRef } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/tokyo-night-dark.css";

function TestFieldComponent() {
  const textInputFieldRef = useRef(null);
  const codePreviewRef = useRef(null);

  const highlightCode = () => {
    const html = hljs.highlightAuto(textInputFieldRef.current.value).value;
    console.log("HTML: ", html);
    textInputFieldRef.current.innerHTML = `<pre>${html}</pre>`;
    return html;
  };

  const handleValueChange = () => {
    const enteredValue = textInputFieldRef.current.value;
    console.log(enteredValue);
    highlightCode();
  };

  return (
    <div style={{ display: "flex", margin: "20px 20px", gap: "10px" }}>
      <textarea
        name="textField"
        id="textField1"
        style={{
          width: "50%",
          height: "500px",
          borderRadius: "12px",
        }}
        spellCheck="false"
        ref={textInputFieldRef}
        onChange={handleValueChange}
      ></textarea>

      <div
        style={{
          width: "50%",
          fontFamily: "Poppins",
          fontSize: "14px",
          letterSpacing: ".5px",
          background: "#1D3557",
          padding: "16px",
          borderRadius: "12px",
          color: "#dddeee",
        }}
      >
        <pre ref={codePreviewRef} style={{ width: "100%" }}></pre>
      </div>
    </div>
  );
}

export default TestFieldComponent;
