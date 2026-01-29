import React, { useState, useEffect } from "react";
import { get, post } from "../../../../utilities";
import YouTubeEmbed from "../../../modules/YouTubeEmbed";
import CommentSection from "../../../modules/CommentSection";
import "./Feed.css";
interface Video {
  _id: string;
  videourl: string;
  userid: string;
  questid: string;
}

export default function FeedItem({ video }: { video: Video }) {
  const [likes, setLikes] = useState(0);
  const [authorName, setAuthorName] = useState("Loading...");

  useEffect(() => {
    get(`/api/user/${video.userid}`)
      .then((u) => setAuthorName(u.username))
      .catch(() => setAuthorName("Unknown"));

    get(`/api/like/count/${video._id}`).then((res) => setLikes(res.count));
  }, [video._id, video.userid]);

  const handleLike = () => {
    post("/api/like/toggle", { parentid: video._id }).then((res) => {
      setLikes((n) => (res.liked ? n + 1 : n - 1));
    });
  };

  return (
    <div className="feed-item">
      <div className="item-header">
        <strong>User:</strong> {authorName} <br />
        <small>Quest ID: {video.questid}</small>
      </div>

      <YouTubeEmbed url={video.videourl} />

      <div className="action-bar">
        <button onClick={handleLike}>[ Like ]</button>
        <span>Likes: {likes}</span>
      </div>

      <CommentSection parentid={video._id} />
    </div>
  );
}
