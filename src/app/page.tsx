"use client";
import { useState } from "react";

export default function Home() {
  const [word, setWord] = useState("");
  const [translation, setTranslation] = useState(null);
  const [songs, setSongs] = useState([]);
  const [selectedText, setSelectedText] = useState("");

  const handleTranslate = async () => {
    const res = await fetch(`http://localhost:8000/translate`);
    const data = await res.json();
    setTranslation(data.translation);
    console.log(data);

    // Get pronunciation audio
    const ttsRes = await fetch("http://localhost:8000/tts");

    // Handle the response as an audio stream (not JSON)
    const audioBlob = await ttsRes.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);

    // Wait for the audio to load before playing
    audio.addEventListener("canplaythrough", () => {
      audio.play();
    });

    // Handle errors when loading audio
    audio.addEventListener("error", (e) => {
      console.error("Error playing audio:", e);
    });
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
      <input
        type="text"
        value={word}
        onChange={(e) => setWord(e.target.value)}
        placeholder="Enter a word"
        className="p-2 border rounded"
      />
      <div className="flex gap-4 mt-4">
        <button
          onClick={handleTranslate}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Translate
        </button>
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
          Get Songs
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
                <button onClick={speakText} disabled={!selectedText}>
                  Pronounce Selected Text
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
