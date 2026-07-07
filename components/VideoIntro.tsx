"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import styles from "./VideoIntro.module.css";

interface VideoIntroProps {
  children?: React.ReactNode;
}

export default function VideoIntro({ children }: VideoIntroProps) {
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const fgVideoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const soundHintRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showSoundHint, setShowSoundHint] = useState(true);
  const [showBanner, setShowBanner] = useState(false);

  // Keep both video layers in sync
  const syncVideos = useCallback(() => {
    const bg = bgVideoRef.current;
    const fg = fgVideoRef.current;
    if (!bg || !fg) return;
    if (Math.abs(bg.currentTime - fg.currentTime) > 0.15) {
      bg.currentTime = fg.currentTime;
    }
  }, []);

  useEffect(() => {
    const fg = fgVideoRef.current;
    if (!fg) return;
    const interval = setInterval(syncVideos, 1000);
    return () => clearInterval(interval);
  }, [syncVideos]);

  // Handle unmuted autoplay attempts and fallback to muted if blocked by browser policy
  useEffect(() => {
    const fg = fgVideoRef.current;
    const bg = bgVideoRef.current;
    if (!fg || !bg) return;

    // Reset scroll restoration and scroll to top on reload so the video talks again
    if (typeof window !== "undefined") {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
      window.scrollTo(0, 0);
    }

    fg.muted = isMuted;
    bg.muted = true; // Ambient blur background is always muted

    const playPromiseFg = fg.play();
    if (playPromiseFg !== undefined) {
      playPromiseFg.catch((error) => {
        console.warn("Autoplay unmuted blocked by browser policy, falling back to muted:", error);
        fg.muted = true;
        setIsMuted(true);
        setShowBanner(true); // Show banner if unmuted autoplay is blocked by browser policy
        fg.play().catch(e => console.error("Autoplay retry failed:", e));
      });
    }

    // Unmute instantly upon the first user interaction (click/touch/scroll) on the document
    // and restart the video from the beginning so they hear the full talk
    const unmuteOnInteraction = () => {
      if (fg.muted) {
        fg.muted = false;
        fg.currentTime = 0; // Restart so they hear the full talk from the start
        setIsMuted(false);
        setShowBanner(false);
      }
      cleanupListeners();
    };

    const cleanupListeners = () => {
      window.removeEventListener("click", unmuteOnInteraction);
      window.removeEventListener("touchstart", unmuteOnInteraction);
      window.removeEventListener("scroll", unmuteOnInteraction);
    };

    window.addEventListener("click", unmuteOnInteraction);
    window.addEventListener("touchstart", unmuteOnInteraction);
    window.addEventListener("scroll", unmuteOnInteraction);

    return () => {
      cleanupListeners();
    };
  }, []);

  // Entrance animation for background and floating controls
  useEffect(() => {
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
    });

    gsap.set([overlayRef.current, controlsRef.current], { opacity: 0 });

    tl.to(overlayRef.current, {
      opacity: 1,
      duration: 1.2,
      ease: "power2.out",
    }).to(controlsRef.current, { opacity: 1, duration: 0.8 }, 0.5);

    return () => {
      tl.kill();
    };
  }, []);

  // Auto-hide sound hint
  useEffect(() => {
    if (!showSoundHint) return;
    const timer = setTimeout(() => {
      setShowSoundHint(false);
    }, 6000);
    return () => clearTimeout(timer);
  }, [showSoundHint]);

  useEffect(() => {
    if (!soundHintRef.current) return;
    if (showSoundHint) {
      gsap.to(soundHintRef.current, { opacity: 1, duration: 0.5 });
    } else {
      gsap.to(soundHintRef.current, {
        opacity: 0,
        duration: 0.6,
        ease: "power2.in",
      });
    }
  }, [showSoundHint]);

  const togglePlay = () => {
    const fg = fgVideoRef.current;
    const bg = bgVideoRef.current;
    if (!fg || !bg) return;
    if (isPlaying) {
      fg.pause();
      bg.pause();
    } else {
      fg.play();
      bg.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const fg = fgVideoRef.current;
    if (!fg) return;
    fg.muted = !fg.muted;
    setIsMuted(fg.muted);
    setShowSoundHint(false);
  };

  // Callback when the introduction video finishes playing
  const handleVideoEnded = () => {
    // Automatically mute when it completes speaking
    const fg = fgVideoRef.current;
    if (fg) {
      fg.muted = true;
    }
    setIsMuted(true);

    // Trigger a beautiful cyber-flash warp transition and auto-scroll to the intro section immediately
    if (flashRef.current) {
      const tl = gsap.timeline();
      tl.to(flashRef.current, {
        opacity: 1,
        duration: 0.35,
        ease: "power2.inOut",
        onComplete: () => {
          const target = document.getElementById("intro-section");
          target?.scrollIntoView({ behavior: "auto" }); // Instant jump under the cover of the flash
        },
      }).to(flashRef.current, {
        opacity: 0,
        duration: 0.9,
        ease: "power2.out",
      });
    }
  };

  return (
    <div className={styles.stageWrapper}>
      {/* Visual Warp Transition Flash Overlay */}
      <div ref={flashRef} className={styles.flashOverlay} />

      {/* 3D Model Audio Telemetry Signal Alert */}
      {showBanner && (
        <div
          className={styles.audioAlertBanner}
          onClick={(e) => {
            e.stopPropagation();
            const fg = fgVideoRef.current;
            if (fg && fg.muted) {
              fg.muted = false;
              fg.currentTime = 0; // Restart so they hear the full talk from the start
              setIsMuted(false);
              setShowBanner(false);
            }
          }}
        >
          <div className={styles.audioAlertDot} />
          <span className={styles.audioAlertText}>[SIGNAL ALERT: PLEASE TAP ON THE SCREEN TO UNMUTE]</span>
        </div>
      )}

      {/* 1. Fixed Background Stage */}
      <div ref={overlayRef} className={styles.bgStage}>
        {/* Ambient blurred background video */}
        <video
          ref={bgVideoRef}
          className={styles.bgVideo}
          src="/videos/hero.mp4"
          autoPlay
          loop={false}
          muted
          playsInline
          aria-hidden="true"
        />

        {/* Foreground sharp video */}
        <video
          ref={fgVideoRef}
          className={styles.fgVideo}
          src="/videos/hero.mp4"
          autoPlay
          loop={false}
          muted={isMuted}
          playsInline
          onEnded={handleVideoEnded}
        />

        {/* Cinematic gradient overlays */}
        <div className={styles.gradientTop} />
        <div className={styles.gradientBottom} />
        <div className={styles.vignette} />

        {/* Static background image for subsequent slides */}
        <img
          className={styles.bgImage}
          src="/background.png"
          alt=""
        />
      </div>

      {/* 2. Floating Media Controls */}
      <div ref={controlsRef} className={styles.floatingControls}>
        <button
          className={styles.controlButton}
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
      </div>

      {/* 3. Page Content Overlay */}
      <div className={styles.scrollOverlay}>
        {children}
      </div>
    </div>
  );
}

/* --- Inline icon components --- */

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
    </svg>
  );
}

function MuteIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.5 12A4.5 4.5 0 0 0 14 8v2.18l2.45 2.45c.03-.2.05-.42.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z" />
    </svg>
  );
}

function UnmuteIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    </svg>
  );
}
