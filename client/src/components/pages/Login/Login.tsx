import React, { useLayoutEffect, useRef, useMemo } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Navigate, useOutletContext } from "react-router-dom";
import gsap from "gsap";
import type { AuthContext } from "../../App";
import "./Login.css";

const IMAGES: string[] = [
  "https://images.unsplash.com/photo-1594523960192-62b92c04089d?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1535182463927-440364075d9c?q=80&w=2672&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1614523231064-bc523f2c2bf4?q=80&w=4048&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1522509585149-c9cd39d1ff08?q=80&w=2697&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1682687981630-cefe9cd73072?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1602878714398-b28d40926846?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1616429553002-faf23468952d?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1521336575822-6da63fb45455?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1711279746155-dc9b9f023d05?q=80&w=2669&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1513308292712-6a10f308a4fe?q=80&w=2678&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1565103420311-8cbbc3cd87b8?q=80&w=2669&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1595917513241-e9d7a9d8f0a0?q=80&w=2291&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1467803738586-46b7eb7b16a1?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1617939533073-6c94c709370c?q=80&w=2672&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1562700761-c366adad5788?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1696522852621-df3dda84286a?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1643240186544-e830997d9cbb?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1606144447933-6d5e5b2d2863?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1659221876406-31a3746f41b9?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1762430815620-fcca603c240c?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1615133684206-dd7eeb4c041b?q=80&w=3200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1533088339408-74fcf62b8e6a?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Login() {
  const { handleLogin, userId } = useOutletContext<AuthContext>();
  const comp = useRef<HTMLDivElement>(null);
  const shuffledImages = useMemo(() => shuffle(IMAGES), []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".modal", { autoAlpha: 0 });
      gsap.set(".modal-card", {
        autoAlpha: 0,
        y: 20,
        scale: 0.98,
      });

      const tl = gsap.timeline({ delay: 0 });

      tl.add("signal");

      tl.to(".col", { top: 0, duration: 2, ease: "power4.out", force3D: true }, "signal");
      tl.to(".c-1 .item", { top: 0, stagger: 0.5, duration: 3, ease: "power4.out" }, "signal");
      tl.to(".c-5 .item", { top: 0, stagger: 0.3, duration: 3, ease: "power4.out" }, "signal");
      tl.to(".c-2 .item", { top: 0, stagger: -0.3, duration: 3, ease: "power4.out" }, "signal");
      tl.to(".c-3 .item", { top: 0, stagger: 0.3, duration: 3, ease: "power4.out" }, "signal");
      tl.to(".c-4 .item", { top: 0, stagger: -0.5, duration: 3, ease: "power4.out" }, "signal");

      tl.to(
        ".container",
        {
          scale: 6,
          duration: 4,
          ease: "power4.inOut",
          onStart: () => {
            gsap.set(".hero-item", { willChange: "auto" });
          },
        },
        "signal+=1"
      );

      tl.add("afterZoom", "signal+=5");

      tl.to(".modal", { autoAlpha: 1, duration: 0.01 }, "afterZoom+=0.05");
      tl.to(
        ".modal-card",
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: "power3.out",
        },
        "afterZoom+=0.08"
      );
    }, comp);

    return () => ctx.revert();
  }, []);

  if (userId) return <Navigate to="/home" replace />;

  return (
    <div ref={comp} className="login-root">
      <div className="container">
        {["c-1", "c-2", "c-3", "c-4", "c-5"].map((c, colIndex) => (
          <div key={c} className={`col ${c}`}>
            {shuffledImages.slice(colIndex * 5, colIndex * 5 + 5).map((src, rowIndex) => {
              const isCenter = colIndex === 2 && rowIndex === 2; // Targets the exact middle
              return (
                <div
                  key={`${colIndex}-${rowIndex}`}
                  className={`item ${isCenter ? "hero-item" : ""}`}
                >
                  <img src={src} alt="" />
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="modal">
        <div className="modal-card">
          <div className="title">
            <p>SideQuest</p>
            <div className="auth-wrapper">
              <GoogleLogin
                onSuccess={handleLogin}
                onError={() => console.log("Error logging in")}
                theme="filled_black"
                shape="pill"
              />
            </div>
          </div>
        </div>
        <div className="hero"></div>
      </div>
    </div>
  );
}
