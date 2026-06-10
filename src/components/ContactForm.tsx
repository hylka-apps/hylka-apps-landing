"use client";
import { useState, useRef } from "react";
import "./ContactForm.css";

type Strings = {
  tabs: { suggestion: string; complaint: string };
  form: {
    name: string; namePlaceholder: string;
    email: string; emailPlaceholder: string;
    subject: string; subjectPlaceholder: string;
    message: string; messagePlaceholder: string;
    submit: string;
  };
  success: string;
  error: string;
  emailLine: string;
};

export default function ContactForm({
  strings,
  email,
}: {
  strings: Strings;
  email: string;
}) {
  const [tab, setTab] = useState<"suggestion" | "complaint">("suggestion");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [charCount, setCharCount] = useState(0);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const MAX_CHARS = 500;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (honeypotRef.current?.value) return; // bot trap

    setStatus("sending");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, type: tab }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="cf-wrap">
      {/* Intent tabs */}
      <div className="cf-tabs" role="tablist">
        {(["suggestion", "complaint"] as const).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            className={`cf-tab${tab === t ? " sel" : ""}`}
            onClick={() => setTab(t)}
            type="button"
          >
            {strings.tabs[t]}
          </button>
        ))}
      </div>

      {status === "success" ? (
        <div className="cf-status success">
          <span>✓</span> {strings.success}
        </div>
      ) : (
        <form className="cf-form" onSubmit={handleSubmit} noValidate>
          {/* Honeypot */}
          <input
            ref={honeypotRef}
            name="_gotcha"
            type="text"
            tabIndex={-1}
            aria-hidden="true"
            style={{ display: "none" }}
          />

          <div className="cf-row-2">
            <div className="cf-field">
              <label htmlFor="cf-name">{strings.form.name}</label>
              <input
                id="cf-name"
                name="name"
                type="text"
                placeholder={strings.form.namePlaceholder}
                required
                autoComplete="name"
              />
            </div>
            <div className="cf-field">
              <label htmlFor="cf-email">{strings.form.email}</label>
              <input
                id="cf-email"
                name="email"
                type="email"
                placeholder={strings.form.emailPlaceholder}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="cf-field">
            <label htmlFor="cf-subject">{strings.form.subject}</label>
            <input
              id="cf-subject"
              name="subject"
              type="text"
              placeholder={strings.form.subjectPlaceholder}
            />
          </div>

          <div className="cf-field">
            <div className="cf-label-row">
              <label htmlFor="cf-message">{strings.form.message}</label>
              <span className={`cf-counter${charCount > MAX_CHARS ? " over" : ""}`}>
                {charCount}/{MAX_CHARS}
              </span>
            </div>
            <textarea
              id="cf-message"
              name="message"
              rows={5}
              placeholder={strings.form.messagePlaceholder}
              required
              maxLength={MAX_CHARS}
              onChange={(e) => setCharCount(e.target.value.length)}
            />
          </div>

          {status === "error" && (
            <div className="cf-status error">{strings.error}</div>
          )}

          <div className="cf-foot">
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={status === "sending"}
            >
              {status === "sending" ? "…" : strings.form.submit}
            </button>
            <p className="cf-email-line">
              {strings.emailLine}{" "}
              <a href={`mailto:${email}`} className="textlink">
                {email}
              </a>
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
