import React, { useState, useEffect } from "react";
import { get, post } from "../../utilities";

interface Comment {
  _id: string;
  text: string;
  userid: string;
}

interface Props {
  parentid: string; // ID of video
}

const CommentSection = ({ parentid }: Props) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    get(`/api/comment/${parentid}`).then((data) => setComments(data));
  }, [parentid]);

  const handleComment = () => {
    if (!commentText) return;
    post("/api/comment", { videoid: parentid, text: commentText }).then((newComment) => {
      setComments((prev) => [...prev, newComment]);
      setCommentText("");
    });
  };

  return (
    <div className="comments-section" style={{ marginTop: "10px" }}>
      <strong>Comments:</strong>
      <ul className="comment-list" style={{ paddingLeft: "20px", marginTop: "5px" }}>
        {comments.map((c) => (
          <li key={c._id}>"{c.text}"</li>
        ))}
      </ul>

      <div
        className="comment-input-group"
        style={{ display: "flex", gap: "5px", marginTop: "10px" }}
      >
        <input
          type="text"
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          style={{ flexGrow: 1 }}
        />
        <button onClick={handleComment}>Post</button>
      </div>
    </div>
  );
};

export default CommentSection;
