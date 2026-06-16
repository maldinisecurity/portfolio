const projectsToggle = document.getElementById("projects-toggle");
const collapsibleProjects = document.querySelectorAll(".project-row.is-collapsed");

if (projectsToggle && collapsibleProjects.length) {
  projectsToggle.addEventListener("click", () => {
    const isExpanded = projectsToggle.getAttribute("aria-expanded") === "true";

    collapsibleProjects.forEach((project) => {
      project.classList.toggle("is-collapsed", isExpanded);
    });

    projectsToggle.setAttribute("aria-expanded", String(!isExpanded));
    projectsToggle.textContent = isExpanded ? "Show more" : "Show less";
  });
}

const burgerBtn = document.getElementById("burger-btn");
const mainNav = document.getElementById("main-nav");

if (burgerBtn && mainNav) {
  burgerBtn.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    burgerBtn.classList.toggle("collapsed", !isOpen);
    burgerBtn.setAttribute("aria-expanded", String(isOpen));
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("is-open");
      burgerBtn.classList.add("collapsed");
      burgerBtn.setAttribute("aria-expanded", "false");
    });
  });
}
