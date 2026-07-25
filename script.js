(function () {
  "use strict";

  // // navbar
  
  // const header = document.getElementById("site-header");
  // const navToggle = document.querySelector(".nav-toggle");
  // const mainNav = document.querySelector(".main-nav");
  // const dropdowns = Array.from(document.querySelectorAll(".has-dropdown"));
  // const dropdownToggles = Array.from(document.querySelectorAll(".dropdown-toggle"));
  



  // function setHeaderState() {
  //   header.classList.toggle("scrolled", window.scrollY > 24);
  // }

  // function closeDropdowns(except) {
  //   dropdowns.forEach((item) => {
  //     if (item !== except) {
  //       item.classList.remove("open");
  //       const button = item.querySelector(".dropdown-toggle");
  //       if (button) button.setAttribute("aria-expanded", "false");
  //     }
  //   });
  // }

  // function closeNavigation(returnFocus) {
  //   header.classList.remove("menu-visible");
  //   document.body.classList.remove("nav-open");
  //   navToggle.setAttribute("aria-expanded", "false");
  //   navToggle.setAttribute("aria-label", "Open navigation");
  //   closeDropdowns();
  //   if (returnFocus) navToggle.focus();
  // }

  // function openNavigation() {
  //   header.classList.add("menu-visible");
  //   document.body.classList.add("nav-open");
  //   navToggle.setAttribute("aria-expanded", "true");
  //   navToggle.setAttribute("aria-label", "Close navigation");
  // }

  // navToggle.addEventListener("click", function () {
  //   const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  //   if (isOpen) closeNavigation(false);
  //   else openNavigation();
  // });

  // dropdownToggles.forEach((button) => {
  //   button.addEventListener("click", function () {
  //     const parent = button.closest(".has-dropdown");
  //     const willOpen = !parent.classList.contains("open");
  //     closeDropdowns(parent);
  //     parent.classList.toggle("open", willOpen);
  //     button.setAttribute("aria-expanded", String(willOpen));
  //   });
  // });

  // window.addEventListener("scroll", setHeaderState, { passive: true });
  // setHeaderState();




  // hero-animation

  const hero = document.getElementById("home");
  const parallaxLayers = Array.from(hero.querySelectorAll(".parallax-layer"));
  const biometricDevice = hero.querySelector(".biometric-device");
  const heroCopy = hero.querySelector(".hero-copy");
  const heroVisual = hero.querySelector(".hero-visual");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let scrollFrameRequested = false;

  function resetPointerParallax() {
    parallaxLayers.forEach((layer) => {
      layer.style.setProperty("--px", "0px");
      layer.style.setProperty("--py", "0px");
    });
    hero.style.setProperty("--grid-x", "0px");
    hero.style.setProperty("--grid-y", "0px");
    biometricDevice.style.setProperty("--scene-rx", "0deg");
    biometricDevice.style.setProperty("--scene-ry", "0deg");
  }

  function updateScrollParallax() {
    scrollFrameRequested = false;
    if (reducedMotion.matches) {
      heroCopy.style.setProperty("--section-parallax-y", "0px");
      heroVisual.style.setProperty("--section-parallax-y", "0px");
      biometricDevice.style.setProperty("--scene-rz", "0deg");
      return;
    }
    const heroHeight = hero.offsetHeight;
    const scrolledThroughHero = Math.max(
      0,
      Math.min(heroHeight, -hero.getBoundingClientRect().top)
    );
    const progress = scrolledThroughHero / heroHeight;
    const enableScrollParallax = window.innerWidth > 1024;
    // Apply the requested parallax multipliers directly, without compensating
    // for the page's own scroll movement. Ease each distance into a maximum
    // travel so the columns do not separate enough to leave a large empty gap.
    const copyUpwardRate = enableScrollParallax ? 1.25 : 0;
    const visualDownwardRate = enableScrollParallax ? 0.35 : 0;
    const copyTravel = enableScrollParallax
      ? 72 * (1 - Math.exp((-scrolledThroughHero * copyUpwardRate) / 72))
      : 0;
    const visualTravel = scrolledThroughHero * visualDownwardRate;
    heroCopy.style.setProperty(
      "--section-parallax-y",
      `${-copyTravel}px`
    );
    heroVisual.style.setProperty(
      "--section-parallax-y",
      `${visualTravel}px`
    );
    parallaxLayers.forEach((layer) => {
      const depth = Number(layer.dataset.depth || 1);
      layer.style.setProperty(
        "--sy",
        enableScrollParallax ? `${progress * depth * -2.6}px` : "0px"
      );
    });
    biometricDevice.style.setProperty(
      "--scene-rz",
      enableScrollParallax ? `${progress * -3.5}deg` : "0deg"
    );
  }

  hero.addEventListener("pointermove", function (event) {
    if (reducedMotion.matches || event.pointerType === "touch") return;
    const bounds = hero.getBoundingClientRect();
    const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
    const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;

    hero.style.setProperty("--grid-x", `${horizontal * -24}px`);
    hero.style.setProperty("--grid-y", `${vertical * -18}px`);
    biometricDevice.style.setProperty("--scene-rx", `${vertical * -10}deg`);
    biometricDevice.style.setProperty("--scene-ry", `${horizontal * 14}deg`);

    parallaxLayers.forEach((layer) => {
      const depth = Number(layer.dataset.depth || 1);
      layer.style.setProperty("--px", `${horizontal * depth * 1.25}px`);
      layer.style.setProperty("--py", `${vertical * depth * 0.95}px`);
    });
  });
  hero.addEventListener("pointerleave", resetPointerParallax);

  window.addEventListener(
    "scroll",
    function () {
      if (!scrollFrameRequested) {
        scrollFrameRequested = true;
        window.requestAnimationFrame(updateScrollParallax);
      }
    },
    { passive: true }
  );
  window.addEventListener("resize", updateScrollParallax, { passive: true });
  updateScrollParallax();

  const revealItems = document.querySelectorAll(".reveal");
  if (reducedMotion.matches || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -45px" }
    );
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  // About visual scroll expansion: start
  const aboutVisual = document.querySelector(".about-visual");
  const aboutIntro = document.querySelector(".about-intro");
  const gsapLibrary = window.gsap;
  const scrollTriggerPlugin = window.ScrollTrigger;

  if (aboutVisual && aboutIntro && gsapLibrary && scrollTriggerPlugin) {
    gsapLibrary.registerPlugin(scrollTriggerPlugin);

    const aboutMotionQuery = window.matchMedia(
      "(min-width: 1025px) and (prefers-reduced-motion: no-preference)"
    );
    let aboutExpansionTrigger = null;

    function setAboutExpansionProgress(progress, immediate) {
      const nextScale = 0.75 + progress * 0.25;

      if (immediate) {
        gsapLibrary.killTweensOf(aboutVisual);
        gsapLibrary.set(aboutVisual, {
          scale: nextScale,
          transformOrigin: "center center",
        });
        return;
      }

      gsapLibrary.to(aboutVisual, {
        scale: nextScale,
        transformOrigin: "center center",
        duration: 0.35,
        ease: "power2.out",
        overwrite: "auto",
      });
    }

    function setupAboutExpansion() {
      if (aboutExpansionTrigger) {
        aboutExpansionTrigger.kill();
        aboutExpansionTrigger = null;
      }

      gsapLibrary.killTweensOf(aboutVisual);
      gsapLibrary.set(aboutVisual, { clearProps: "transform" });

      if (!aboutMotionQuery.matches) return;

      setAboutExpansionProgress(0, true);

      aboutExpansionTrigger = scrollTriggerPlugin.create({
        trigger: aboutIntro,
        start: "top center",
        end: "bottom top",
        invalidateOnRefresh: true,
        onUpdate: function (self) {
          setAboutExpansionProgress(self.progress, false);
        },
      });

      scrollTriggerPlugin.refresh();
    }

    if (typeof aboutMotionQuery.addEventListener === "function") {
      aboutMotionQuery.addEventListener("change", setupAboutExpansion);
    } else {
      aboutMotionQuery.addListener(setupAboutExpansion);
    }

    setupAboutExpansion();
  }
  // About visual scroll expansion: end




  // CTA-section animation

  
      gsap.registerPlugin(ScrollTrigger);

      const section   = document.querySelector('.cta-section');
      const container = document.querySelector('.cta-section .container');
      const bg         = document.querySelector('.bg');

      let st; // holds the current ScrollTrigger instance so we can kill/rebuild on resize

      function buildAnimation() {
        if (st) st.kill();
        gsap.set(bg, { clearProps: 'clipPath' });
        container.classList.remove('js-expand');
        bg.classList.remove('js-expand');

        // 1. Measure the box in its natural (small, centered, rounded) state.
        const sectionRect = section.getBoundingClientRect();
        const bgRect = bg.getBoundingClientRect();

        const top    = bgRect.top - sectionRect.top;
        const left   = bgRect.left - sectionRect.left;
        const right  = sectionRect.right - bgRect.right;
        const bottom = sectionRect.bottom - bgRect.bottom;

        // inset(120.67px 526.855px 121.68px round 167.5px)

        const radius = window.innerWidth < 768 ? 90 : 167.5;

        const startClip = `inset(${top}px ${right}px ${bottom}px ${left}px round ${radius}px)`;
        // const endClip   = `inset(0px 0px 0px 0px round 0px)`;
        // const endClip   = `inset(35px 50px 35px 50px round 30px)`;
        const endClip = window.innerWidth < 768 ? `inset(0px 0px 0px 0px round 0px)` : `inset(35px 50px 35px 50px round 30px)`

        // 2. Re-anchor .bg to fill the whole section, then use clip-path to
        //    visually "fake" the original small rounded box (no layout jump).
        container.classList.add('js-expand');
        bg.classList.add('js-expand');
        gsap.set(bg, { clipPath: startClip });

        // 3. Pin the section once it's fully in view, and scrub the clip-path
        //    open as the user scrolls. When the tween finishes, ScrollTrigger
        //    unpins automatically and normal scrolling resumes.
        st = ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: '+=100%',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          animation: gsap.timeline().fromTo(
            bg,
            { clipPath: startClip },
            { clipPath: endClip, ease: 'none' }
          )
        });
      }

      window.addEventListener('load', buildAnimation);

      let resizeTimer;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(buildAnimation, 200);
      });
    












})();




gsap.registerPlugin(ScrollTrigger);

gsap.from(".fade-left", {
  x: -100,
  opacity: 0,
  duration: 0.8,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".fade-left",
    start: "top 70%", // animation starts when the top reaches 80% of viewport
    toggleActions: "play none none none"
  }
});












 // ===== Philosophy section: sticky centering + smooth image crossfade =====
      const philosophyItems   = gsap.utils.toArray('.philosophy-item');
      const philosophyImages  = gsap.utils.toArray('.philosophy-sticky .philosophy-img');
      // const philosophySticky  = document.querySelector('.philosophy-sticky');
      // const philosophyWrap    = document.querySelector('.philosophy-image-wrap');
      const badgeCurrent      = document.querySelector('.philosophy-badge .current');

      // Position the sticky offset so the image's own vertical CENTER lines up
      // with the viewport's vertical center at the moment it locks in place.
      // function updatePhilosophyStickyOffset() {
      //   if (!philosophySticky || !philosophyWrap) return;
      //   if (window.innerWidth <= 900) return; // mobile: sticky is disabled via CSS, nothing to compute
      //   const offset = (window.innerHeight - philosophyWrap.offsetHeight) / 2;
      //   philosophySticky.style.top = Math.max(16, offset) + 'px';
      // }

      function setActivePhilosophy(index) {
        philosophyItems.forEach((item, i) => item.classList.toggle('is-active', i === index));
        philosophyImages.forEach((img, i) => {
          gsap.to(img, {
            opacity: i === index ? 1 : 0,
            scale: i === index ? 1 : 1.08,
            duration: 1,
            ease: 'power3.out',
            overwrite: 'auto',
          });
        });
        if (badgeCurrent) badgeCurrent.textContent = String(index + 1).padStart(2, '0');
      }

      let philosophyTriggers = [];

      function initPhilosophyScroll() {
        // Reset to a known-good state before (re)measuring, so a stale
        // "active" card never survives a rebuild.
        philosophyTriggers.forEach(t => t.kill());
        philosophyTriggers = [];
        setActivePhilosophy(0);
        // updatePhilosophyStickyOffset();

        philosophyItems.forEach((item, i) => {
          philosophyTriggers.push(
            ScrollTrigger.create({
              trigger: item,
              start: 'top center',
              end: 'bottom center',
              onEnter: () => setActivePhilosophy(i),
              onEnterBack: () => setActivePhilosophy(i),
            })
          );
        });

        ScrollTrigger.refresh();
      }

      // Run only after the CTA section's pin spacer has been added to the
      // page (buildAnimation runs first), so positions are measured against
      // the final page layout instead of a shorter, pre-pin one.
      window.addEventListener('load', () => {
        initPhilosophyScroll();
      });

      let resizeTimer;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          initPhilosophyScroll();
        }, 200);
      });