(() => {
  const fvCopy = document.querySelector(".image-section--fv .fv-copy");

  if (fvCopy) {
    const showFvCopy = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => fvCopy.classList.add("is-visible"));
      });
    };

    if (document.readyState === "complete") {
      showFvCopy();
    } else {
      window.addEventListener("load", showFvCopy, { once: true });
    }
  }

  const overlayAssetPattern = /-(?:img|txt)\d*\.webp(?:[?#].*)?$/i;
  const overlays = [...document.querySelectorAll(".section-overlay")].filter((overlay) => {
    return overlayAssetPattern.test(overlay.getAttribute("src") || "");
  });

  if (overlays.length === 0) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll(".image-section").forEach((section) => {
    const sectionOverlays = overlays.filter((overlay) => overlay.parentElement === section);

    sectionOverlays.forEach((overlay, index) => {
      overlay.classList.add("scroll-reveal");
      overlay.style.setProperty("--scroll-reveal-delay", `${index * 140}ms`);
    });
  });

  const showOverlay = (overlay) => {
    requestAnimationFrame(() => {
      overlay.classList.add("is-visible");
    });

    overlay.addEventListener(
      "transitionend",
      () => overlay.classList.add("is-reveal-complete"),
      { once: true }
    );
  };

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    overlays.forEach(showOverlay);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        showOverlay(entry.target);
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.08,
    }
  );

  overlays.forEach((overlay) => observer.observe(overlay));
})();
