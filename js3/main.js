const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const isEnglish = document.documentElement.lang.toLowerCase().startsWith("en");
const interfaceText = isEnglish
  ? {
      projectImage: (title) => `${title} - project image`,
      showImage: (index) => `Show image ${index}`,
      galleryImage: (title, index, total) => `${title} — image ${index} of ${total}`,
      projectFallback: "Project",
    }
  : {
      projectImage: (title) => `${title} - зображення проєкту`,
      showImage: (index) => `Показати зображення ${index}`,
      galleryImage: (title, index, total) => `${title} — зображення ${index} з ${total}`,
      projectFallback: "Проєкт",
    };

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const filterButtons = document.querySelectorAll("[data-filter]");
const workCards = document.querySelectorAll("[data-category]");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");

    workCards.forEach((card) => {
      const categories = card.dataset.category.split(/\s+/);
      const isVisible = filter === "all" || categories.includes(filter);
      card.classList.toggle("is-hidden", !isVisible);
    });
  });
});

const modal = document.querySelector(".project-modal");
const modalImage = document.querySelector(".modal-image");
const modalThumbs = document.querySelector(".modal-thumbs");
const modalTitle = document.querySelector("#modal-title");
const modalCategory = document.querySelector(".modal-category");
const modalDescription = document.querySelector(".modal-description");
const modalDetail = document.querySelector(".modal-detail");
const openProjectButtons = document.querySelectorAll(".project-open");
const closeModalButtons = document.querySelectorAll("[data-close-modal]");

const setActiveImage = (src, title) => {
  if (!modalImage || !modalThumbs) return;

  modalImage.src = src;
  modalImage.alt = interfaceText.projectImage(title);

  modalThumbs.querySelectorAll(".modal-thumb").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.src === src);
  });
};

const closeProjectModal = () => {
  if (!modal) return;

  modal.hidden = true;
  document.body.style.overflow = "";
  lastFocusedProject?.focus();
};

let lastFocusedProject = null;

openProjectButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!modal || !modalImage || !modalThumbs || !modalTitle || !modalCategory || !modalDescription || !modalDetail) return;

    const images = button.dataset.images.split(",").map((item) => item.trim()).filter(Boolean);
    const title = button.dataset.title;
    lastFocusedProject = button;

    modalTitle.textContent = title;
    modalCategory.textContent = button.dataset.categoryLabel;
    modalDescription.textContent = button.dataset.description;
    const detail = button.dataset.detail?.trim();
    modalDetail.textContent = detail || "";
    modalDetail.hidden = !detail;
    modalThumbs.innerHTML = "";

    images.forEach((src, index) => {
      const thumb = document.createElement("button");
      const image = document.createElement("img");

      thumb.className = "modal-thumb";
      thumb.type = "button";
      thumb.dataset.src = src;
      thumb.setAttribute("aria-label", interfaceText.showImage(index + 1));
      image.src = src;
      image.alt = "";
      thumb.append(image);
      thumb.addEventListener("click", () => setActiveImage(src, title));
      modalThumbs.append(thumb);
    });

    modal.hidden = false;
    document.body.style.overflow = "hidden";
    setActiveImage(images[0], title);
    modal.querySelector(".modal-close")?.focus();
  });
});

closeModalButtons.forEach((button) => {
  button.addEventListener("click", closeProjectModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeProjectModal();
  }
});

document.querySelectorAll("[data-gallery]").forEach((gallery) => {
  const image = gallery.querySelector(".case-slider-image");
  const counter = gallery.querySelector(".case-slider-counter");
  const thumbs = [...gallery.querySelectorAll("[data-gallery-src]")];
  const previous = gallery.querySelector("[data-gallery-prev]");
  const next = gallery.querySelector("[data-gallery-next]");
  const galleryTitle = gallery.dataset.galleryTitle || document.querySelector(".case-hero h1")?.textContent?.trim() || interfaceText.projectFallback;
  let activeIndex = 0;

  const showImage = (index) => {
    if (!image || !thumbs.length) return;

    activeIndex = (index + thumbs.length) % thumbs.length;
    const activeThumb = thumbs[activeIndex];
    image.src = activeThumb.dataset.gallerySrc;
    image.alt = interfaceText.galleryImage(galleryTitle, activeIndex + 1, thumbs.length);
    if (counter) counter.textContent = `${activeIndex + 1} / ${thumbs.length}`;

    thumbs.forEach((thumb, thumbIndex) => {
      const isActive = thumbIndex === activeIndex;
      thumb.classList.toggle("is-active", isActive);
      thumb.setAttribute("aria-current", isActive ? "true" : "false");
    });

    activeThumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  thumbs.forEach((thumb, index) => {
    thumb.addEventListener("click", () => showImage(index));
  });

  previous?.addEventListener("click", () => showImage(activeIndex - 1));
  next?.addEventListener("click", () => showImage(activeIndex + 1));

  gallery.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") showImage(activeIndex - 1);
    if (event.key === "ArrowRight") showImage(activeIndex + 1);
  });
});
