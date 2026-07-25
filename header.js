(function () {
  "use strict";

  // navbar
  
  const header = document.getElementById("site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const mainNav = document.querySelector(".main-nav");
  const dropdowns = Array.from(document.querySelectorAll(".has-dropdown"));
  const dropdownToggles = Array.from(document.querySelectorAll(".dropdown-toggle"));
//   const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");



  function setHeaderState() {
    header.classList.toggle("scrolled", window.scrollY > 24);
  }

  function closeDropdowns(except) {
    dropdowns.forEach((item) => {
      if (item !== except) {
        item.classList.remove("open");
        const button = item.querySelector(".dropdown-toggle");
        if (button) button.setAttribute("aria-expanded", "false");
      }
    });
  }

  function closeNavigation(returnFocus) {
    header.classList.remove("menu-visible");
    document.body.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation");
    closeDropdowns();
    if (returnFocus) navToggle.focus();
  }

  function openNavigation() {
    header.classList.add("menu-visible");
    document.body.classList.add("nav-open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close navigation");
  }

  navToggle.addEventListener("click", function () {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    if (isOpen) closeNavigation(false);
    else openNavigation();
  });

  dropdownToggles.forEach((button) => {
    button.addEventListener("click", function () {
      const parent = button.closest(".has-dropdown");
      const willOpen = !parent.classList.contains("open");
      closeDropdowns(parent);
      parent.classList.toggle("open", willOpen);
      button.setAttribute("aria-expanded", String(willOpen));
    });
  });

  window.addEventListener("scroll", setHeaderState, { passive: true });
  setHeaderState();


})();

