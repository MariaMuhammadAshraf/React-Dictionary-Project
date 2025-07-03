import React, { useState } from "react";
import "./Dictionary.css";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faBookOpen } from "@fortawesome/free-solid-svg-icons";

export default function Dictionary(props) {
  const [text, setText] = useState("");
  const [translation, setTranslation] = useState("");
  const [fromLang, setFromLang] = useState("en");
  const [toLang, setToLang] = useState("ur");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError("");
    setTranslation("Translating...");

    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          text
        )}&langpair=${fromLang}|${toLang}`
      );
      const data = await response.json();

      if (data?.responseData?.translatedText) {
        setTranslation(data.responseData.translatedText);
        setError("");
      } else {
        setTranslation("");
        setError("Translation failed.");
      }
    } catch (err) {
      setError("Something went wrong.");
      setTranslation("");
    } finally {
      setLoading(false);
    }
  };

  const handleSwitch = () => {
    const newFrom = fromLang === "en" ? "ur" : "en";
    const newTo = toLang === "ur" ? "en" : "ur";

    setFromLang(newFrom);
    setToLang(newTo);
    setText("");
    setTranslation("");
    setError("");
  };

  // Remove Case
  const handleRemoveClick = () => {
    let newText = " ";
    setText(newText);
  };

  // ✅ Corrected: this now shows the current translation direction
  const switchLabel =
    fromLang === "en"
      ? " Switch to English → Urdu"
      : " Switch to Urdu → English";

  return (
    <div className="container">
      <div className="card">
        {/* <h1>
    <FontAwesomeIcon icon={faBookOpen} style={{ marginRight: "8px", color: "#ff69b4" }} />
    {fromLang === "en"
    ? "English → Urdu Translator"
    : "Urdu → English Translator"}
   </h1> */}

        <h1 className="heading">
          <img
            src={`${process.env.PUBLIC_URL}/favicon-96x96.png`}
            alt="Book Icon"
            className="heading-icon"
          />
          {fromLang === "en"
            ? "English → Urdu Translator"
            : "Urdu → English Translator"}
        </h1>

        <textarea
          rows="4"
          placeholder={
            fromLang === "en"
              ? "Enter text in English"
              : "اردو میں متن درج کریں"
          }
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="text-area"
          style={{ direction: fromLang === "ur" ? "rtl" : "ltr" }}
        />

        <div className="button-group">

          <button
            onClick={handleTranslate}
            disabled={loading}
            className="translate-btn">
            {loading ? "Translating..." : "Translate"}
          </button>

            <button
            className="btn btn-md-dark mx-2 my-1"
            onClick={handleRemoveClick}>Clear</button>

          <button onClick={handleSwitch} className="switch-btn">
            {switchLabel}
          </button>

        </div>

        {error && <p className="error">{error}</p>}

        {translation && !loading && (
          <div className="translation"
            style={{ direction: toLang === "ur" ? "rtl" : "ltr" }}>
            {translation}
          </div>
        )}

        
      </div>
    </div>
  );
}
