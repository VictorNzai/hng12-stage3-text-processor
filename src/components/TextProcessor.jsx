import { useState, useEffect } from "react";

const TextProcessor = () => {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);
  const [isSupported, setIsSupported] = useState(true); // Tracks browser compatibility
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Check if Chrome AI Language Detector is available
    if (!self.ai || !self.ai.languageDetector) {
      setIsSupported(false);
      setErrorMessage(
        "⚠️ Language detection is not available on this browser or device. You can still enter and display text."
      );
    }
  }, []);

  const handleChange = (event) => {
    setInputText(event.target.value);
  };

  const handleProcessText = async () => {
    if (inputText.trim() === "") return;

    let detectedLanguage = "Unavailable"; // Default value when AI is not supported

    if (isSupported) {
      try {
        const languageDetectorCapabilities =
          await self.ai.languageDetector.capabilities();
        const canDetect = languageDetectorCapabilities.capabilities;
        let detector;

        if (canDetect === "no") {
          console.error("Language detection is not available.");
        } else if (canDetect === "readily") {
          detector = await self.ai.languageDetector.create();
        } else {
          detector = await self.ai.languageDetector.create({
            monitor(m) {
              m.addEventListener("downloadprogress", (e) => {
                console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
              });
            },
          });
          await detector.ready;
        }

        const results = await detector.detect(inputText);
        detectedLanguage =
          results.length > 0 ? results[0].detectedLanguage : "Unknown";
      } catch (error) {
        console.error("Language detection failed:", error);
        detectedLanguage = "Error";
      }
    }

    // Add message with detected language (or "Unavailable" if not supported)
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: inputText, language: detectedLanguage },
    ]);

    setInputText(""); // Clear input field
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleProcessText();
    }
  };

  return (
    <section>
      {/* Show warning if language detection is not supported */}
      {!isSupported && (
        <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>
      )}

      <div>
        {messages.map((message, index) => (
          <div
            key={index}
            className="message-output"
            style={{ marginBottom: "10px" }}
          >
            <p>{message.text}</p>
            <p>
              Detected Language:{" "}
              {new Intl.DisplayNames(["en"], { type: "language" }).of(
                message.language
              ) ||
                message.language.charAt(0).toUpperCase() +
                  message.language.slice(1).toLowerCase()}
            </p>
          </div>
        ))}
      </div>

      <div className="input-container">
        <textarea
          className="message-input text-input"
          placeholder="Enter your message here.."
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          value={inputText}
        ></textarea>

        <button onClick={handleProcessText}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="#000000"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="#000"
            className="size-6"
            width="24px"
            height="24px"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
            />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default TextProcessor;

//       {/* Input Section */}
//       <div className="input-container">
//         <textarea
//           className="message-input text-input"
//           placeholder="Enter your message here..."
//           onChange={handleChange}
//           onKeyDown={handleKeyDown}
//           value={inputText}
//         ></textarea>

//         {/* Button to submit text */}
//         <button onClick={handleProcessText}>
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             fill="#000000"
//             viewBox="0 0 24 24"
//             strokeWidth={1.5}
//             stroke="#000"
//             className="size-6"
//             width="24px"
//             height="24px"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
//             />
//           </svg>
//         </button>
//       </div>
//     </section>
//   );
// };

// export default TextProcessor;
