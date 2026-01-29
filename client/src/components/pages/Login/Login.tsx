import React, { useLayoutEffect, useRef, useMemo } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Navigate, useOutletContext, Link } from "react-router-dom";
import gsap from "gsap";
import { AuthContext } from "../../../../../shared/types";
import "./Login.css";

const IMAGES: string[] = [
  "https://images.unsplash.com/photo-1594523960192-62b92c04089d?q=80&w=2670",
  "https://images.unsplash.com/photo-1535182463927-440364075d9c?q=80&w=2672",
  "https://images.unsplash.com/photo-1614523231064-bc523f2c2bf4?q=80&w=4048",
  "https://images.unsplash.com/photo-1522509585149-c9cd39d1ff08?q=80&w=2697",
  "https://images.unsplash.com/photo-1682687981630-cefe9cd73072?q=80&w=2671",
  "https://images.unsplash.com/photo-1602878714398-b28d40926846?q=80&w=2671",
  "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2670",
  "https://images.unsplash.com/photo-1616429553002-faf23468952d?q=80&w=2670",
  "https://images.unsplash.com/photo-1521336575822-6da63fb45455?q=80&w=2670",
  "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=2670",
  "https://images.unsplash.com/photo-1711279746155-dc9b9f023d05?q=80&w=2669",
  "https://images.unsplash.com/photo-1513308292712-6a10f308a4fe?q=80&w=2678",
  "https://images.unsplash.com/photo-1565103420311-8cbbc3cd87b8?q=80&w=2669",
  "https://images.unsplash.com/photo-1595917513241-e9d7a9d8f0a0?q=80&w=2291",
  "https://images.unsplash.com/photo-1467803738586-46b7eb7b16a1?q=80&w=3132",
  "https://images.unsplash.com/photo-1617939533073-6c94c709370c?q=80&w=2672",
  "https://images.unsplash.com/photo-1562700761-c366adad5788?q=80&w=2671",
  "https://images.unsplash.com/photo-1696522852621-df3dda84286a?q=80&w=2670",
  "https://images.unsplash.com/photo-1643240186544-e830997d9cbb?q=80&w=2670",
  "https://images.unsplash.com/photo-1606144447933-6d5e5b2d2863?q=80&w=2670",
  "https://images.unsplash.com/photo-1659221876406-31a3746f41b9?q=80&w=2670",
  "https://images.unsplash.com/photo-1762430815620-fcca603c240c?q=80&w=2670",
  "https://images.unsplash.com/photo-1615133684206-dd7eeb4c041b?q=80&w=3200",
  "https://images.unsplash.com/photo-1533088339408-74fcf62b8e6a?q=80&w=2670",
  "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2670",
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
  const { handleLogin, userId, user } = useOutletContext<AuthContext>();
  const comp = useRef<HTMLDivElement>(null);
  const shuffledImages = useMemo(() => shuffle(IMAGES), []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".modal", { autoAlpha: 0 });
      gsap.set(".modal-card", { autoAlpha: 0, y: 20, scale: 0.98 });

      const tl = gsap.timeline();

      tl.add("signal");

      tl.to(".col", { top: 0, duration: 2, ease: "power4.out" }, "signal");
      tl.to(".c-1 .item", { top: 0, stagger: 0.3, duration: 2.5, ease: "power4.out" }, "signal");
      tl.to(".c-5 .item", { top: 0, stagger: 0.3, duration: 2.5, ease: "power4.out" }, "signal");
      tl.to(".c-2 .item", { top: 0, stagger: -0.3, duration: 2.5, ease: "power4.out" }, "signal");
      tl.to(".c-3 .item", { top: 0, stagger: 0.3, duration: 2.5, ease: "power4.out" }, "signal");
      tl.to(".c-4 .item", { top: 0, stagger: -0.3, duration: 2.5, ease: "power4.out" }, "signal");

      tl.to(
        ".container",
        {
          scale: 6,
          duration: 3.5,
          ease: "power4.inOut",
        },
        "signal+=0.8"
      );

      tl.to(".modal", { autoAlpha: 1, duration: 0.2 }, ">-0.6");
      tl.to(
        ".modal-card",
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: "power3.out",
        },
        "<"
      );
    }, comp);
    return () => ctx.revert();
  }, []);

  if (userId)
    return user?.username ? <Navigate to="/home" replace /> : <Navigate to="/signup" replace />;

  return (
    <div ref={comp} className="login-root">
      <div className="container">
        {["c-1", "c-2", "c-3", "c-4", "c-5"].map((c, colIndex) => (
          <div key={c} className={`col ${c}`}>
            {shuffledImages.slice(colIndex * 5, colIndex * 5 + 5).map((src, rowIndex) => {
              const isCenter = colIndex === 2 && rowIndex === 2;
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
                onError={() => {}}
                theme="filled_black"
                shape="pill"
              />
            </div>
            <Link to="/about" className="minimal-about-link">
              About
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
