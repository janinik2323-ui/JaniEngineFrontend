import React, { useState } from "react";
import "./Results.css";

export default function Results({ results }) {
  const [fullscreenImage, setFullscreenImage] = useState(null);

  // provjera ima li slika / videa
  const hasImages = results.some(r => r.images && r.images.length > 0);
  const hasVideos = results.some(r => r.youtube && r.youtube.thumbnail);

  // scroll funkcija
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="results-container">

      {/* GUMBI ZA SEKCIJE */}
      <div className="section-buttons">
        {hasImages && (
          <button
            onClick={() => scrollToSection("images")}
            className="section-btn"
          >
            Images
          </button>
        )}

        {hasVideos && (
          <button
            onClick={() => scrollToSection("videos")}
            className="section-btn"
          >
            Videos
          </button>
        )}
      </div>

      {/* WEB RESULTS */}
      <section className="web-results">
        <h2>Web Results</h2>
        {results.map((item, i) => (
          <div key={i} className="web-item">
            {item.favicon && <img src={item.favicon} className="favicon" alt="" />}
            <div>
              <a href={item.url} target="_blank" className="title">{item.title}</a>
              <p className="content">{item.content?.slice(0, 200)}...</p>
            </div>
          </div>
        ))}
      </section>

      {/* IMAGES */}
      <section id="images" className="image-results">
        <h2>Images</h2>
        <div className="image-grid">
          {results.flatMap(r => r.images).map((img, i) => (
            <div key={i} className="image-box">
              <img
                src={img}
                alt=""
                onClick={() => setFullscreenImage(img)}
              />
              <a className="download-btn" href={img} download>
                Download
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* VIDEOS */}
      <section id="videos" className="video-results">
        <h2>Videos</h2>
        <div className="video-grid">
          {results
            .filter(r => r.youtube && r.youtube.thumbnail)
            .map((r, i) => (
              <div key={i} className="video-box">
                <img src={r.youtube.thumbnail} className="video-thumb" alt="" />
                <h3>{r.youtube.title}</h3>
                <p>{r.youtube.channel}</p>
                <a
                  href={r.url}
                  target="_blank"
                  className="play-btn"
                >
                  ▶ Play
                </a>
              </div>
            ))}
        </div>
      </section>

      {/* FULLSCREEN IMAGE */}
      {fullscreenImage && (
        <div className="fullscreen-modal" onClick={() => setFullscreenImage(null)}>
          <img src={fullscreenImage} alt="" className="fullscreen-img" />
        </div>
      )}
    </div>
  );
}
