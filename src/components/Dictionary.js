import React, { useState } from "react";
import "./Dictionary.css";
import { FaTrashAlt, FaCopy } from "react-icons/fa";

export default function Dictionary() {
  const [text, setText] = useState("");
  const [translation, setTranslation] = useState("");
  const [fromLang, setFromLang] = useState("en");
  const [toLang, setToLang] = useState("ur");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [copyStatus, setCopyStatus] = useState("");

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
        const result = data.responseData.translatedText;
        setTranslation(result);
        setHistory([{ original: text, translated: result }]);
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
    setHistory([]);
  };

  const handleDeleteClick = () => {
    setText("");
    setTranslation("");
    setHistory([]);
    setCopyStatus("");
  };

  const handleCopy = () => {
    if (translation) {
      navigator.clipboard.writeText(translation);
      setCopyStatus("Copied!");
      setTimeout(() => setCopyStatus(""), 2000);
    }
  };

  const switchLabel =
    fromLang === "en" ? " Switch to English → Urdu" : " Switch to Urdu → English";

  return (
    <div className="container">
      <div className="card">
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
            fromLang === "en" ? "Enter text in English" : "اردو میں متن درج کریں"
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
            className="translate-btn"
          >
            {loading ? "Translating..." : "Translate"}
          </button>

          <button
            className="btn btn-md-dark mx-2 my-1"
            onClick={handleDeleteClick}
          >
            <FaTrashAlt style={{ marginRight: "6px" }} /> Delete
          </button>

          <button onClick={handleCopy} className="btn btn-md-dark mx-2 my-1">
            <FaCopy style={{ marginRight: "6px" }} /> Copy
          </button>

          <button onClick={handleSwitch} className="switch-btn">
            {switchLabel}
          </button>
        </div>

        {copyStatus && (
          <p className="copy-status" style={{ textAlign: "center", color: "#ffb6c1" }}>{copyStatus}</p>
        )}

        {error && <p className="error">{error}</p>}

        {translation && !loading && (
          <div
            className="translation"
            style={{ direction: toLang === "ur" ? "rtl" : "ltr" }}
          >
            {translation}
          </div>
        )}

        {history.length > 0 && (
          <div className="translation" style={{ marginTop: "20px", textAlign: "center" }}>
            <strong style={{ display: "block", marginBottom: "8px", color: "#ffb6c1" }}>
              History
            </strong>
            {history[0].original} — {history[0].translated}
          </div>
        )}
      </div>
    </div>
  );
}
