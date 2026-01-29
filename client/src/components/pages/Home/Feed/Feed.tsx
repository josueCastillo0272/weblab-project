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

  useEffect(() => {
    get("/api/video/feed").then((data) => setVideos(data));
  }, []);

  return (
    <div className="feed-container">
      <h1>Public Feed</h1>
      {videos.length === 0 ? (
        <p>No videos yet.</p>
      ) : (
        videos.map((v) => <FeedItem key={v._id} video={v} />)
      )}
    </div>
  );
}
