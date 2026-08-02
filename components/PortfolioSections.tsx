"use client";

import React, { useState, useEffect } from "react";
import { resumeData } from "./resumeData";
import styles from "./PortfolioSections.module.css";

export default function PortfolioSections() {
  const [activeSkillCategory, setActiveSkillCategory] = useState(
    resumeData.skills[0].category
  );
  const [activeSection, setActiveSection] = useState("hero");
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [formErrorMessage, setFormErrorMessage] = useState("");

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setFormStatus("success");
        setFormErrorMessage("");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        console.error("Form submit error:", result);
        setFormErrorMessage(result?.message || "Unable to send message right now. Please try again later.");
        setFormStatus("error");
      }
    } catch (error) {
      console.error("Form submit error:", error);
      setFormStatus("error");
    }
  };

  // IntersectionObserver to update the fixed sidebar navigation highlight in real-time
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-35% 0px -35% 0px", 
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          const sectionName = id.replace("-section", "");
          setActiveSection(sectionName);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const sections = ["hero-section", "intro-section", "about-section", "skills-section", "projects-section", "contact-section"];
    
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  // 3D Card Hover Tilt Effect handler
  const handleCardTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const tiltX = (yc - y) / 12; 
    const tiltY = (x - xc) / 12; 

    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.03, 1.03, 1.03)`;
    
    const px = (x / rect.width) * 100;
    const py = (y / rect.height) * 100;
    card.style.setProperty("--glow-x", `${px}%`);
    card.style.setProperty("--glow-y", `${py}%`);
  };

  const handleCardReset = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  };

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    section?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={styles.wrapper}>
      {/* 3D CINEMATIC FIXED SIDEBAR NAVIGATOR */}
      <div className={styles.sidebarNav}>
        {["hero", "intro", "about", "skills", "projects", "contact"].map((secName, idx) => (
          <div
            key={secName}
            className={`${styles.sidebarItem} ${activeSection === secName ? styles.sidebarItemActive : ""}`}
            onClick={() => scrollToSection(`${secName}-section`)}
            role="button"
            tabIndex={0}
            aria-label={`Scroll to ${secName} section`}
          >
            <span className={styles.sidebarNum}>0{idx + 1}</span>
            <span className={styles.sidebarLabel}>{secName.toUpperCase()}</span>
          </div>
        ))}
      </div>

      {/* 1. HERO / SPEAKING SECTION (CLEAN VIEW OF MODEL WITH TOP-LEFT BRANDING) */}
      <section id="hero-section" className={`${styles.section} ${styles.heroSection}`}>
        {/* Top Left Branding Unit */}
        <div className={styles.brandingHeader}>
          <div className={styles.thickLine} />
          <span className={styles.brandName}>Vaibhav</span>
        </div>

        <div
          className={styles.scrollIndicator}
          onClick={() => scrollToSection("intro-section")}
        >
          <span className={styles.scrollText}>ENTER PORTFOLIO</span>
          <div className={styles.scrollMouse}>
            <div className={styles.scrollWheel} />
          </div>
        </div>
      </section>

      {/* 2. INTRODUCTION SECTION (DIRECTED TO AFTER MODEL SPEAKS - SAI YELEM TITLE) */}
      <section id="intro-section" className={`${styles.section} ${styles.introSection}`}>
        <div className={styles.heroContent}>
          <div className={`${styles.badge} anim-sec-title`}>
            COMPUTER SCIENCE UNDERGRADUATE @ KLU
          </div>
          <h1 className={`${styles.glitchName} anim-sec-title`}>
            <span className={styles.firstName}>{resumeData.firstName}</span>
            <span className={styles.lastName}>{resumeData.lastName}</span>
          </h1>
          <p className={`${styles.heroSub} anim-sec-title`}>
            {resumeData.summary}
          </p>
          <div className={`${styles.heroButtons} anim-sec-title`}>
            <button
              onClick={() => scrollToSection("projects-section")}
              className={styles.primaryBtn}
            >
              Explore Projects
            </button>
            <button
              onClick={() => scrollToSection("about-section")}
              className={styles.secondaryBtn}
            >
              About &amp; Education
            </button>
          </div>
        </div>
        <div
          className={styles.scrollIndicator}
          onClick={() => scrollToSection("about-section")}
        >
          <span className={styles.scrollText}>SCROLL DOWN</span>
          <div className={styles.scrollMouse}>
            <div className={styles.scrollWheel} />
          </div>
        </div>
      </section>

      {/* 3. ABOUT & EDUCATION SECTION */}
      <section id="about-section" className={styles.section}>
        <div className={styles.container}>
          <h2 className={`${styles.sectionTitle} anim-sec-title`}>About &amp; Education</h2>
          
          <div className={styles.aboutLayout}>
            {/* Left: Bio & Strengths */}
            <div className={`${styles.aboutInfo} anim-about-card`}>
              <div
                className={styles.glassCard}
                onMouseMove={handleCardTilt}
                onMouseLeave={handleCardReset}
              >
                <div className={styles.cardGlow} />
                <h3 className={styles.cardHeader}>Core Strengths</h3>
                <div className={styles.strengthsGrid}>
                  {resumeData.strengths.map((strength, index) => (
                    <div key={index} className={styles.strengthTag}>
                      <span className={styles.tagDot} />
                      {strength}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Education Timeline */}
            <div className={styles.educationTimeline}>
              <h3 className={`${styles.timelineHeader} anim-about-card`}>Academic Journey</h3>
              <div className={styles.timeline}>
                {resumeData.education.map((edu, index) => (
                  <div key={index} className={`${styles.timelineItem} anim-timeline-item`}>
                    <div className={styles.timelineNode}>
                      <div className={styles.timelineNodePulse} />
                    </div>
                    <div
                      className={`${styles.glassCard} ${styles.timelineCard}`}
                      onMouseMove={handleCardTilt}
                      onMouseLeave={handleCardReset}
                    >
                      <div className={styles.cardGlow} />
                      <div className={styles.timelineHeaderRow}>
                        <span className={styles.timelinePeriod}>{edu.period}</span>
                        <span className={styles.timelineLocation}>{edu.location}</span>
                      </div>
                      <h4 className={styles.timelineInst}>{edu.institution}</h4>
                      <p className={styles.timelineDeg}>{edu.degree}</p>
                      <span className={styles.timelineGrade}>{edu.details}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TECHNICAL SKILLS SECTION */}
      <section id="skills-section" className={styles.section}>
        <div className={styles.container}>
          <h2 className={`${styles.sectionTitle} anim-sec-title`}>Technical Toolkit</h2>
          
          <div className={styles.skillsContainer}>
            {/* Category Navigation */}
            <div className={`${styles.skillsNav} anim-skill-btn`}>
              {resumeData.skills.map((skillGroup, index) => (
                <button
                  key={index}
                  className={`${styles.skillsNavBtn} ${
                    activeSkillCategory === skillGroup.category ? styles.activeNavBtn : ""
                  }`}
                  onClick={() => setActiveSkillCategory(skillGroup.category)}
                >
                  {skillGroup.category}
                </button>
              ))}
            </div>

            {/* Skills Panel */}
            <div className={`${styles.skillsPanel} anim-skill-card`}>
              <div
                className={styles.glassCard}
                onMouseMove={handleCardTilt}
                onMouseLeave={handleCardReset}
              >
                <div className={styles.cardGlow} />
                <h3 className={styles.skillPanelTitle}>{activeSkillCategory}</h3>
                <div className={styles.skillsGrid}>
                  {resumeData.skills
                    .find((g) => g.category === activeSkillCategory)
                    ?.items.map((skill, index) => (
                      <div
                        key={index}
                        className={styles.skillItem}
                        style={{
                          animation: `${styles.fadeInUp} 0.4s ease forwards ${index * 0.04}s`
                        }}
                      >
                        <span className={styles.skillIcon}>⚡</span>
                        <span className={styles.skillText}>{skill}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PROJECTS SECTION */}
      <section id="projects-section" className={styles.section}>
        <div className={styles.container}>
          <h2 className={`${styles.sectionTitle} anim-sec-title`}>Featured Work</h2>
          
          <div className={styles.projectsList}>
            {resumeData.projects.map((proj, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={index}
                  className={`${styles.projectRow} ${isEven ? styles.rowNormal : styles.rowReverse} anim-project-card`}
                >
                  {/* PROJECT CONTENT */}
                  <div className={styles.projectContent}>
                    <span className={styles.projectBadge}>Featured Project</span>
                    <h3 className={styles.projectTitle}>{proj.title}</h3>
                    <h4 className={styles.projectSubtitle}>{proj.subtitle}</h4>
                    
                    {/* Glassmorphism Overlapping Description Card */}
                    <div
                      className={`${styles.glassCard} ${styles.projectDescCard}`}
                      onMouseMove={handleCardTilt}
                      onMouseLeave={handleCardReset}
                    >
                      <div className={styles.cardGlow} />
                      <p className={styles.projectDesc}>{proj.description}</p>
                    </div>

                    <div className={styles.projectTags}>
                      {proj.tags.map((tag, tIndex) => (
                        <span key={tIndex} className={styles.projTag}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className={styles.projectLinks}>
                      {proj.demoUrl && (
                        <a
                          href={proj.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.projectLinkBtn}
                        >
                          Live Demo ↗
                        </a>
                      )}
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${styles.projectLinkBtn} ${styles.githubLinkBtn}`}
                      >
                        GitHub ↗
                      </a>
                    </div>
                  </div>

                  {/* PROJECT WIREFRAME MOCKUP WRAPPER */}
                  <div className={styles.projectMockupWrapper}>
                    {index === 0 && (
                      <div className={`${styles.mockupContainer} ${styles.agriWireframe}`}>
                        <div className={styles.mockupHeader}>
                          <span className={styles.mockupDotRed} />
                          <span className={styles.mockupDotYellow} />
                          <span className={styles.mockupDotGreen} />
                          <span className={styles.mockupTitle}>agrivalue-connect.com</span>
                        </div>
                        <div className={`${styles.mockupBody} ${styles.mockupBodyImage}`}>
                          <img
                            src="/images/project1.png"
                            alt="AgriValue Connect Platform"
                            className={styles.mockupImage}
                          />
                        </div>
                      </div>
                    )}

                    {index === 1 && (
                      <div className={`${styles.mockupContainer} ${styles.aiWireframe}`}>
                        <div className={styles.mockupHeader}>
                          <span className={styles.mockupDotRed} />
                          <span className={styles.mockupDotYellow} />
                          <span className={styles.mockupDotGreen} />
                          <span className={styles.mockupTitle}>truthlens-ai.vercel.app</span>
                        </div>
                        <div className={`${styles.mockupBody} ${styles.mockupBodyImage}`}>
                          <img
                            src="/images/project2.png"
                            alt="TruthLens AI Platform"
                            className={styles.mockupImage}
                          />
                        </div>
                      </div>
                    )}

                    {index === 2 && (
                      <div className={`${styles.mockupContainer} ${styles.healthWireframe}`}>
                        <div className={styles.mockupHeader}>
                          <span className={styles.mockupDotRed} />
                          <span className={styles.mockupDotYellow} />
                          <span className={styles.mockupDotGreen} />
                          <span className={styles.mockupTitle}>healthai-telemetry.vercel.app</span>
                        </div>
                        <div className={`${styles.mockupBody} ${styles.mockupBodyImage}`}>
                          <img
                            src="/images/project3.png"
                            alt="HealthAI System"
                            className={styles.mockupImage}
                          />
                        </div>
                      </div>
                    )}

                    {index === 3 && (
                      <div className={`${styles.mockupContainer} ${styles.apiWireframe}`}>
                        <div className={styles.mockupHeader}>
                          <span className={styles.mockupDotRed} />
                          <span className={styles.mockupDotYellow} />
                          <span className={styles.mockupDotGreen} />
                          <span className={styles.mockupTitle}>api.transactions.io/v1/swagger</span>
                        </div>
                        <div className={styles.mockupBody}>
                          <div className={styles.wfPage}>
                            <div className={styles.wfTopBar}>
                              <div className={styles.wfLogoBox}><div className={styles.wfDiagonalX} /></div>
                              <span className={styles.wfLabel}>SWAGGER CONSOLE API</span>
                            </div>
                            <div className={styles.wfConsole}>
                              <div className={styles.wfConsoleHeader}>
                                <span className={styles.wfMethod}>POST</span>
                                <span className={styles.wfPath}>/api/v1/transactions/process</span>
                              </div>
                              <div className={styles.wfConsoleBody}>
                                <div className={styles.wfCodeLine}><span>Request headers:</span> Authorization: Bearer TOKEN</div>
                                <div className={styles.wfCodeLine}><span>Response code:</span> 200 OK (JWT Verified)</div>
                                <div className={styles.wfCodeBox}>
                                  {"{\n  \"transaction_id\": \"TX_892301\",\n  \"status\": \"SUCCESS\"\n}"}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. CERTIFICATIONS & CONTACT SECTION */}
      <section id="contact-section" className={styles.section}>
        <div className={styles.container}>
          <h2 className={`${styles.sectionTitle} anim-sec-title`}>
            <span className={styles.sectionNumber}>06</span> Contact Me
          </h2>

          <div className={styles.contactMainLayout}>
            {/* Left Column: Contact Form */}
            <div className={`${styles.contactFormPanel} anim-contact-card`}>
              <div
                className={styles.glassCard}
                onMouseMove={handleCardTilt}
                onMouseLeave={handleCardReset}
              >
                <div className={styles.cardGlow} />
                {formStatus === "success" ? (
                  <div className={styles.successContainer}>
                    <div className={styles.successIcon}>✓</div>
                    <h3>Message Sent!</h3>
                    <p>Thank you for reaching out. I will get back to you as soon as possible.</p>
                    <button onClick={() => setFormStatus("idle")} className={styles.sendBtn} style={{ maxWidth: '240px' }}>
                      Send Another Message
                    </button>
                  </div>
                ) : formStatus === "error" ? (
                  <div className={styles.successContainer}>
                    <div className={styles.errorIcon}>✗</div>
                    <h3>Sending Failed</h3>
                    <p>{formErrorMessage || "There was a problem sending your message. Please check your connection or try again later."}</p>
                    <button onClick={() => {
                      setFormErrorMessage("");
                      setFormStatus("idle");
                    }} className={styles.sendBtn} style={{ maxWidth: '240px' }}>
                      Try Again
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className={styles.contactForm}>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor="contact-name" className={styles.formLabel}>Name</label>
                        <input
                          type="text"
                          id="contact-name"
                          placeholder="Your name"
                          className={styles.formInput}
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="contact-email" className={styles.formLabel}>Email</label>
                        <input
                          type="email"
                          id="contact-email"
                          placeholder="Your email"
                          className={styles.formInput}
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="contact-subject" className={styles.formLabel}>Subject</label>
                      <input
                        type="text"
                        id="contact-subject"
                        placeholder="Subject of contact"
                        className={styles.formInput}
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="contact-message" className={styles.formLabel}>Message</label>
                      <textarea
                        id="contact-message"
                        placeholder="Write message..."
                        className={styles.formInput}
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={formStatus === "sending"}
                      className={styles.sendBtn}
                    >
                      {formStatus === "sending" ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Right Column: Orbit System */}
            <div className={`${styles.contactOrbitPanel} anim-cert-card`}>
              <div className={styles.orbitWrapper}>
                <div className={styles.orbitCenter}>
                  <svg className={styles.centerIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                
                <div className={styles.orbitCircle}>
                  {/* GitHub */}
                  <div className={`${styles.orbitItem} ${styles.orbitItem1}`}>
                    <a href={resumeData.github} target="_blank" rel="noopener noreferrer" className={styles.orbitLink} aria-label="GitHub">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
                      </svg>
                    </a>
                  </div>
                  {/* LinkedIn */}
                  <div className={`${styles.orbitItem} ${styles.orbitItem2}`}>
                    <a href={resumeData.linkedin} target="_blank" rel="noopener noreferrer" className={styles.orbitLink} aria-label="LinkedIn">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </a>
                  </div>
                  {/* Email */}
                  <div className={`${styles.orbitItem} ${styles.orbitItem3}`}>
                    <a href={`mailto:${resumeData.email}`} className={styles.orbitLink} aria-label="Email">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: Industry Certifications */}
          <div className={`${styles.certificationsWrapper} anim-cert-card`}>
            <div
              className={styles.glassCard}
              onMouseMove={handleCardTilt}
              onMouseLeave={handleCardReset}
            >
              <div className={styles.cardGlow} />
              <h3 className={styles.cardHeader}>Professional Credentials</h3>
              <div className={styles.certList}>
                {resumeData.certifications.map((cert, index) => (
                  <div key={index} className={styles.certItem}>
                    <div className={styles.certIcon}>🏆</div>
                    <div className={styles.certInfo}>
                      <h4 className={styles.certName}>{cert.name}</h4>
                      <p className={styles.certVal}>{cert.validity}</p>
                      <span className={styles.certIssuer}>{cert.issuer}</span>
                    </div>
                  </div>
                ))}
              </div>
              <a
                href={resumeData.certificateRepo}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.certRepoBtn}
              >
                View Credentials Repository ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerDivider} />
        <p className={styles.footerText}>
          &copy; {new Date().getFullYear()} {resumeData.firstName} {resumeData.lastName}. Designed with Next.js, Three.js &amp; GSAP.
        </p>
      </footer>
    </div>
  );
}
