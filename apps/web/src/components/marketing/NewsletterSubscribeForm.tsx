"use client";

import React, { useState } from "react";
import { trackEvent } from "@/lib/analytics/analytics";

export function NewsletterSubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    
    // Simulate API call for newsletter subscription
    setTimeout(() => {
      setStatus("success");
      setEmail("");
      
      // Track successful subscription
      trackEvent({
        eventType: 'NEWSLETTER_SUBSCRIBE',
        metadata: { source: 'footer' }
      });
    }, 1000);
  };

  if (status === "success") {
    return <p className="text-sm text-green-600 dark:text-green-400">Thanks for subscribing!</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        className="px-3 py-2 border border-border rounded-md bg-surface-card text-sm flex-1 focus:outline-brand-primary"
      />
      <button 
        type="submit" 
        disabled={status === "loading"}
        className="px-4 py-2 bg-brand-primary text-white text-sm font-medium rounded-md hover:bg-brand-primary/90 disabled:opacity-50"
      >
        {status === "loading" ? "..." : "Subscribe"}
      </button>
    </form>
  );
}
