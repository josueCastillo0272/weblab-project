import React, { useState, useEffect } from "react";
import { get } from "../../../../utilities";
import FeedItem from "./FeedItem";
import "./Feed.css";

interface Video {
  _id: string;
  videourl: string;
  userid: string;
  questid: string;
}

export default function Feed() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    get("/api/video/feed").then((data) => setVideos(data));
  }, []);

  const handleNext = () => {
    if (index < videos.length - 1) setIndex(index + 1);
  };

  const handlePrev = () => {
    if (index > 0) setIndex(index - 1);
  };

  if (videos.length === 0) {
    return (
      <div className="feed-container">
        <p>No videos yet.</p>
      </div>
    );
  }

  return (
    <div className="feed-container">
      <div className="feed-content">
        <FeedItem key={videos[index]._id} video={videos[index]} />
      </div>

      <div className="feed-nav">
        <button onClick={handlePrev} disabled={index === 0}>
          ▲
        </button>
        <button onClick={handleNext} disabled={index === videos.length - 1}>
          ▼
        </button>
      </div>
    </div>
  );
}
