"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import VideoIntro from "@/components/VideoIntro";
import PortfolioSections from "@/components/PortfolioSections";

export default function Home() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);

      // 1. Zoom out the fixed background stage as we scroll past the Hero section
      const bgStage = document.querySelector('[class*="bgStage"]');
      if (bgStage) {
        gsap.to(bgStage, {
          scale: 0.85,
          rotateX: 8,
          z: -100,
          opacity: 0.65,
          scrollTrigger: {
            trigger: "#hero-section",
            start: "bottom bottom",
            end: "bottom top",
            scrub: true,
          }
        });
      }

      // 2. Cross-fade the static background image on top of the video as we scroll past the Intro section
      const bgImage = document.querySelector('[class*="bgImage"]');
      if (bgImage) {
        gsap.fromTo(
          bgImage,
          { opacity: 0 },
          {
            opacity: 1,
            scrollTrigger: {
              trigger: "#intro-section",
              start: "bottom bottom",
              end: "bottom top",
              scrub: true,
            }
          }
        );
      }

      // 3. GENERAL SECTION ENTRANCE & EXIT TRANSITIONS (3D Camera Corridor - Limited to full-screen slides)
      const corridorSections = ["#hero-section", "#intro-section"];
      corridorSections.forEach((id) => {
        const section = document.querySelector(id) as HTMLElement;
        if (!section) return;

        gsap.set(section, {
          transformPerspective: 1200,
          transformStyle: "preserve-3d",
        });

        // Zoom In & Fade In on Scroll Entry
        gsap.fromTo(
          section,
          {
            opacity: 0,
            scale: 0.8,
            z: -120,
            rotateX: 10,
          },
          {
            opacity: 1,
            scale: 1,
            z: 0,
            rotateX: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top bottom-=12%",
              end: "top center",
              scrub: 1.2,
            },
          }
        );

        // Zoom Out & Fade Out on Scroll Exit
        gsap.to(section, {
          opacity: 0,
          scale: 1.15,
          z: 120,
          rotateX: -10,
          ease: "power2.in",
          scrollTrigger: {
            trigger: section,
            start: "bottom center",
            end: "bottom top+=12%",
            scrub: 1.2,
          },
        });
      });

      // 2. ADVANCED INTERIOR STAGGER TIMELINES

      // A. About Section: Stagger bio card and vertical timeline entries
      const aboutSec = document.querySelector("#about-section") as HTMLElement;
      if (aboutSec) {
        const bioCard = aboutSec.querySelector(".anim-about-card");
        const timelineItems = aboutSec.querySelectorAll(".anim-timeline-item");

        if (bioCard) {
          gsap.fromTo(
            bioCard,
            { opacity: 0, x: -60, rotateY: 15 },
            {
              opacity: 1,
              x: 0,
              rotateY: 0,
              scrollTrigger: {
                trigger: aboutSec,
                start: "top bottom-=5%",
                end: "top center-=10%",
                scrub: 1,
              },
            }
          );
        }

        if (timelineItems.length > 0) {
          gsap.fromTo(
            timelineItems,
            { opacity: 0, x: 60, rotateY: -15, z: -50 },
            {
              opacity: 1,
              x: 0,
              rotateY: 0,
              z: 0,
              stagger: 0.25,
              scrollTrigger: {
                trigger: aboutSec,
                start: "top center+=20%",
                end: "bottom center+=10%",
                scrub: 1,
              },
            }
          );
        }
      }

      // B. Skills Section: Stagger side menu options and panel entry
      const skillsSec = document.querySelector("#skills-section") as HTMLElement;
      if (skillsSec) {
        const navBtns = skillsSec.querySelectorAll(".anim-skill-btn button");
        const skillPanel = skillsSec.querySelector(".anim-skill-card");

        if (navBtns.length > 0) {
          gsap.fromTo(
            navBtns,
            { opacity: 0, x: -30, stagger: 0.08 },
            {
              opacity: 1,
              x: 0,
              scrollTrigger: {
                trigger: skillsSec,
                start: "top bottom-=5%",
                end: "top center",
                scrub: 1,
              },
            }
          );
        }

        if (skillPanel) {
          gsap.fromTo(
            skillPanel,
            { opacity: 0, scale: 0.9, rotateX: 15, z: -60 },
            {
              opacity: 1,
              scale: 1,
              rotateX: 0,
              z: 0,
              scrollTrigger: {
                trigger: skillsSec,
                start: "top center+=15%",
                end: "top center-=15%",
                scrub: 1.2,
              },
            }
          );
        }
      }

      // C. Projects Section: 3D Staggered rotate-up entry for cards
      const projectsSec = document.querySelector("#projects-section") as HTMLElement;
      if (projectsSec) {
        const projCards = projectsSec.querySelectorAll(".anim-project-card");

        if (projCards.length > 0) {
          gsap.fromTo(
            projCards,
            {
              opacity: 0,
              scale: 0.85,
              z: -120,
              rotateY: -20,
              rotateX: 10,
            },
            {
              opacity: 1,
              scale: 1,
              z: 0,
              rotateY: 0,
              rotateX: 0,
              stagger: 0.3,
              scrollTrigger: {
                trigger: projectsSec,
                start: "top center+=25%",
                end: "bottom center+=20%",
                scrub: 1.5,
              },
            }
          );
        }
      }

      // D. Contact Section: Stagger certifications card and contact panels
      const contactSec = document.querySelector("#contact-section") as HTMLElement;
      if (contactSec) {
        const certCard = contactSec.querySelector(".anim-cert-card");
        const contactCard = contactSec.querySelector(".anim-contact-card");

        if (certCard) {
          gsap.fromTo(
            certCard,
            { opacity: 0, x: -50, rotateY: 10, z: -30 },
            {
              opacity: 1,
              x: 0,
              rotateY: 0,
              z: 0,
              scrollTrigger: {
                trigger: contactSec,
                start: "top bottom-=5%",
                end: "top center",
                scrub: 1,
              },
            }
          );
        }

        if (contactCard) {
          gsap.fromTo(
            contactCard,
            { opacity: 0, x: 50, rotateY: -10, z: -30 },
            {
              opacity: 1,
              x: 0,
              rotateY: 0,
              z: 0,
              scrollTrigger: {
                trigger: contactSec,
                start: "top bottom-=5%",
                end: "top center",
                scrub: 1,
              },
            }
          );
        }
      }
    }
  }, []);

  return (
    <main>
      <VideoIntro>
        <PortfolioSections />
      </VideoIntro>
    </main>
  );
}
