"use strict";

const form = document.querySelector("[data-contact-form]");
const fallback = document.querySelector("[data-contact-fallback]");
const endpoint = form.getAttribute("action");

if (/^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(endpoint)) {
  const button = form.querySelector("button");
  const status = form.querySelector("[data-contact-status]");
  form.hidden = false;
  fallback.hidden = true;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (button.disabled) return;

    button.disabled = true;
    button.textContent = "Sending...";
    status.textContent = "";
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const result = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
        signal: controller.signal,
      });
      if (result.ok) {
        form.reset();
        status.textContent = "Inquiry sent. We will follow up by email.";
      } else if (result.status === 429) {
        status.textContent = "Too many requests. Please wait a minute and try again.";
      } else {
        status.textContent = "We could not send your inquiry. Please try again.";
      }
    } catch {
      status.textContent = "We could not reach the form service. Please try again.";
    } finally {
      clearTimeout(timeout);
      button.disabled = false;
      button.textContent = "Send inquiry";
    }
  });
}
