import React from "react";

interface Props {
  url: string;
}

// handles uploading shorts and videos
const getEmbedUrl = (url: string) => {
  try {
    let videoId = "";
    if (url.includes("youtube.com/watch?v=")) {
      videoId = url.split("v=")[1].split("&")[0];
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1];
    } else if (url.includes("youtube.com/shorts/")) {
      videoId = url.split("shorts/")[1].split("?")[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
  } catch (e) {
    return "";
  }
};

export default function YouTubeEmbed({ url }: Props) {
  const embedUrl = getEmbedUrl(url);

  if (!embedUrl) {
    return (
      <p className="video-error" style={{ color: "red" }}>
        Invalid Video Link: {url}
      </p>
    );
  }

  return <iframe width="100%" height="300" src={embedUrl} title="Video player" allowFullScreen />;
}
