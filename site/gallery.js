"use strict";

const gallery = document.querySelector("[data-gallery]");
const slides = [...gallery.querySelectorAll("[data-slide]")];
const picker = gallery.querySelector("[data-gallery-picker]");
const count = gallery.querySelector("[data-gallery-count]");
const rotation = gallery.querySelector("[data-gallery-rotation]");
const motion = matchMedia("(prefers-reduced-motion: reduce)");

let current = 0;
let playing = !motion.matches;
let inView = false;
let hovered = false;
let timer;

function showSlide(index) {
  slides[current].hidden = true;
  current = (index + slides.length) % slides.length;
  slides[current].hidden = false;
  picker.selectedIndex = current;
  count.textContent = (current + 1) + " / " + slides.length;
}

function updateRotation() {
  clearInterval(timer);
  const label = playing ? "Pause screenshots" : "Play screenshots";
  rotation.setAttribute("aria-label", label);
  rotation.title = label;
  rotation.toggleAttribute("data-paused", !playing);
  count.setAttribute("aria-live", playing ? "off" : "polite");
  if (playing && inView && !hovered && !document.hidden) {
    timer = setInterval(() => showSlide(current + 1), 6000);
  }
}

function chooseSlide(index) {
  playing = false;
  updateRotation();
  showSlide(index);
}

slides.forEach((slide, index) => {
  picker.add(new Option((index + 1) + ". " + slide.dataset.title));
});
gallery.querySelector("[data-gallery-prev]").addEventListener("click", () => chooseSlide(current - 1));
gallery.querySelector("[data-gallery-next]").addEventListener("click", () => chooseSlide(current + 1));
picker.addEventListener("change", () => chooseSlide(picker.selectedIndex));
gallery.addEventListener("keydown", (event) => {
  if (event.target === picker || event.altKey || event.ctrlKey || event.metaKey) return;
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    event.preventDefault();
    chooseSlide(current + (event.key === "ArrowLeft" ? -1 : 1));
  }
});
rotation.addEventListener("click", () => {
  playing = !playing;
  // An explicit Play takes effect even when the pointer is still on the control.
  if (playing) hovered = false;
  updateRotation();
});
gallery.addEventListener("pointerenter", (event) => {
  if (event.pointerType !== "mouse") return;
  hovered = true;
  updateRotation();
});
gallery.addEventListener("pointerleave", () => {
  hovered = false;
  updateRotation();
});
gallery.addEventListener("focusin", (event) => {
  if (!event.target.matches(":focus-visible")) return;
  playing = false;
  updateRotation();
});
motion.addEventListener("change", (event) => {
  if (event.matches) playing = false;
  updateRotation();
});
document.addEventListener("visibilitychange", updateRotation);
new IntersectionObserver(([entry]) => {
  inView = entry.intersectionRatio >= 0.25;
  updateRotation();
}, { threshold: 0.25 }).observe(gallery);

showSlide(0);
updateRotation();
rotation.hidden = false;
gallery.querySelector("[data-gallery-controls]").hidden = false;
