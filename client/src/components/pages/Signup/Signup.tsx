import React, { useState, useRef, useLayoutEffect } from "react";
import { useOutletContext, Navigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { post } from "../../../utilities";
import { AuthContext } from "../../../../../shared/types";
import PictureSelector from "../Settings/PictureSelector";
import "./Signup.css";

gsap.registerPlugin(ScrollTrigger);

const IMAGES = [
  "https://images.unsplash.com/photo-1478860409698-8707f313ee8b?q=80&w=3870&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1584720223124-466ff369e7c2?w=900&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1503417680882-163c1609fd2f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://www.shutterstock.com/image-photo/portrait-three-female-friends-looking-600nw-2477131451.jpg",
];

export default function Signup() {
  const { user } = useOutletContext<AuthContext>();
  const [username, setUsername] = useState("");
  const [pfp, setPfp] = useState(user?.profilepicture || "");
  const container = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!container.current || !track.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: track.current,
          scroller: container.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
        },
        defaults: { ease: "power1.inOut" },
      });

      tl.fromTo(
        ".hero",
        { width: "100vw", height: "100vh", borderRadius: "0px" },
        {
          width: "22vw",
          height: "50vh",
          borderRadius: "16px",
          duration: 1,
        },
        0
      );

      tl.to(".hero-content", { opacity: 0, duration: 0.2 }, 0);

      const positions = [
        {
          sel: ".left-top",
          start: { x: "-40vw", y: "-20vh" },
          end: { x: "10vw", y: "8vh" },
          time: 0,
        },
        {
          sel: ".left-mid",
          start: { x: "-60vw", y: "20vh" },
          end: { x: "10vw", y: "40vh" },
          time: 0.1,
        },
        {
          sel: ".left-bot",
          start: { x: "-80vw", y: "100vh" },
          end: { x: "10vw", y: "72vh" },
          time: 0.2,
        },
        {
          sel: ".right-top",
          start: { x: "140vw", y: "-20vh" },
          end: { x: "70vw", y: "8vh" },
          time: 0,
        },
        {
          sel: ".right-mid",
          start: { x: "160vw", y: "50vh" },
          end: { x: "70vw", y: "40vh" },
          time: 0.15,
        },
        {
          sel: ".right-bot",
          start: { x: "140vw", y: "100vh" },
          end: { x: "70vw", y: "72vh" },
          time: 0.2,
        },
      ];

      positions.forEach((p) => tl.fromTo(p.sel, p.start, { ...p.end, duration: 1 }, p.time));

      tl.fromTo(
        ".content-inner",
        { opacity: 0, pointerEvents: "none" },
        { opacity: 1, pointerEvents: "auto", duration: 0.2 },
        0.8
      );
    }, container);
    return () => ctx.revert();
  }, []);

  if (!user) return <Navigate to="/login" replace />;

  const submit = () => {
    post("/api/user/update", { username, profilepicture: pfp }).then(
      () => (window.location.href = "/home")
    );
  };

  return (
    <div className="viewport" ref={container}>
      <div className="track" ref={track}>
        <div className="stage">
          <div className="hero">
            <img src={IMAGES[0]} className="cover-img hero-img-dim" alt="Hero" />
            <div className="hero-content">
              <h1>SIDEQUEST</h1>
              <p>SCROLL TO BEGIN</p>
            </div>
          </div>

          <div className="card polaroid-frame left-top">
            <div className="polaroid-inner">
              <img className="cover-img" src={IMAGES[1]} alt="" />
            </div>
          </div>
          <div className="card polaroid-frame left-mid">
            <div className="polaroid-inner">
              <img className="cover-img" src={IMAGES[2]} alt="" />
            </div>
          </div>
          <div className="card polaroid-frame right-top">
            <div className="polaroid-inner">
              <img className="cover-img" src={IMAGES[3]} alt="" />
            </div>
          </div>

          <div className="card func-card rectangle left-bot">
            <div className="content-inner">
              <span className="label">IDENTITY</span>
              <input
                className="input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="USERNAME"
                maxLength={12}
              />
            </div>
          </div>

          <div className="card func-card square right-mid">
            <div className="content-inner">
              <span className="label">AVATAR</span>
              <PictureSelector onPictureChange={setPfp} currentUrl={pfp} />
            </div>
          </div>

          <div className="card func-card rectangle right-bot">
            <div className="content-inner">
              <button disabled={!username} onClick={submit} className="button">
                INITIALIZE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
