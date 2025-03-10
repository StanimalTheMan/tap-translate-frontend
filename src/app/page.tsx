"use client";
import { useState } from "react";

export default function Home() {
  const [translation, setTranslation] = useState(null);
  const [romanizedTranslation, setRomanizedTranslation] = useState(null);
  const [songs, setSongs] = useState([]);
  const [selectedText, setSelectedText] = useState("");

  const handleTranslate = async () => {
    if (!selectedText) return;

    const response = await fetch("http://localhost:8000/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: selectedText, target_lang: "en" }),
    });
    const data = await response.json();
    setTranslation(data.translation);
  };

  const handleRomanize = async () => {
    if (!selectedText) return;

    const response = await fetch("http://localhost:8000/romanize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: selectedText }),
    });
    const data = await response.json();
    setRomanizedTranslation(data.romanization);
  };

  const handleGetSongs = async () => {
    const res = await fetch(`http://localhost:8000/songs?query=gaho`);
    const data = await res.json();
    console.log(data);
    setSongs(data.songs);
    console.log(data.songs);
  };

  // Get selected text
  const handleSelection = () => {
    const selection = window.getSelection()?.toString();
    if (selection) setSelectedText(selection);
  };

  // Speak the selected text
  const speakText = () => {
    if (!selectedText) return;
    const speech = new SpeechSynthesisUtterance(selectedText);
    speech.lang = "ko"; // Korean
    speech.rate = 0.7;
    speechSynthesis.speak(speech);
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-xl font-bold mb-4">Music Translation App</h1>
      <div className="flex gap-4 mt-4">
        <button
          onClick={handleGetSongs}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Get Songs
        </button>
        <button
          onClick={handleTranslate}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Translate
        </button>
      </div>
      {translation && <p className="mt-4">Translation: {translation}</p>}
      {songs.length > 0 && (
        <ul className="mt-4">
          {songs.map((song, index) => (
            <li key={index}>
              <a
                href={song.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600"
              >
                {song.name} - {song.artist}
              </a>
              <div>
                <h1>Select Lyrics to Hear Pronunciation</h1>
                <p
                  onMouseUp={handleSelection}
                  style={{ cursor: "pointer", userSelect: "text" }}
                >
                  {song.lyrics}
                </p>
                <div className="divider">ENGLISH TRANSLATION</div>
                <p>{translation}</p>
                <p>{romanizedTranslation}</p>
                <button onClick={speakText} disabled={!selectedText}>
                  Pronounce Selected Text
                </button>
                <button
                  onClick={handleTranslate}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Translate Selected Text
                </button>
                <button
                  onClick={handleRomanize}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  See Romanized Version of Selected Text
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
