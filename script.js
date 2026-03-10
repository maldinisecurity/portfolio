const projects = [
  { name: "Ping Pong Arena", url: "https://maldinisecurity.github.io/neon-pong-arena/", type: "Arcade" },
  { name: "Sugar Rush Blitz", url: "https://maldinisecurity.github.io/sugar-rush-blitz/", type: "Arcade" },
  { name: "Tower Defence", url: "https://maldinisecurity.github.io/tower-defense-mini/", type: "Strategy" },
  { name: "2048 Variant", url: "https://maldinisecurity.github.io/2048-variant/", type: "Puzzle" },
  { name: "Flappy Runner", url: "https://maldinisecurity.github.io/flappy-runner/", type: "Arcade" },
  { name: "Memory Card Battle", url: "https://maldinisecurity.github.io/memory-card-battle/", type: "Puzzle" },
  { name: "Platformer", url: "https://maldinisecurity.github.io/platformer-single-screen/", type: "Arcade" },
  { name: "Grid Crawler", url: "https://maldinisecurity.github.io/roguelite-grid-crawler/", type: "Puzzle" },
  { name: "Snake Arena", url: "https://maldinisecurity.github.io/snake-arena/", type: "Arcade" },
  { name: "Space Shooter", url: "https://maldinisecurity.github.io/space-shooter/", type: "Arcade" },
  { name: "Tetris Puzzle", url: "https://maldinisecurity.github.io/tetris-block-puzzle/", type: "Puzzle" },
  { name: "Tower Defense", url: "https://maldinisecurity.github.io/breakout-blaster/", type: "Strategy" },
];

const countsKey = "portfolioProjectOpenCounts";
const counts = JSON.parse(localStorage.getItem(countsKey) || "{}");

const projectGrid = document.getElementById("project-grid");
const projectSearch = document.getElementById("project-search");
const projectFilters = document.getElementById("project-filters");
const projectSort = document.getElementById("project-sort");
const projectResults = document.getElementById("project-results");
const copyFeedback = document.getElementById("copy-feedback");
const randomLaunch = document.getElementById("random-launch");

let activeType = "All";

function getOpenCount(url) {
  return counts[url] || 0;
}

function saveCounts() {
  localStorage.setItem(countsKey, JSON.stringify(counts));
}

function bumpOpenCount(url) {
  counts[url] = getOpenCount(url) + 1;
  saveCounts();
}

function copyProjectUrl(url) {
  if (!copyFeedback) return;

  navigator.clipboard
    .writeText(url)
    .then(() => {
      copyFeedback.textContent = "Link copied to clipboard.";
      setTimeout(() => {
        copyFeedback.textContent = "";
      }, 1800);
    })
    .catch(() => {
      copyFeedback.textContent = "Could not copy link. Please copy it manually.";
    });
}

function buildFilters() {
  if (!projectFilters) return;

  const types = ["All", ...new Set(projects.map((project) => project.type))];
  projectFilters.innerHTML = "";

  types.forEach((type) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `chip-filter${type === activeType ? " active" : ""}`;
    button.textContent = type;

    button.addEventListener("click", () => {
      activeType = type;
      buildFilters();
      renderProjects();
    });

    projectFilters.appendChild(button);
  });
}

function applySort(list) {
  if (!projectSort || projectSort.value === "az") {
    return [...list].sort((a, b) => a.name.localeCompare(b.name));
  }

  return [...list].sort((a, b) => getOpenCount(b.url) - getOpenCount(a.url) || a.name.localeCompare(b.name));
}

function renderProjects() {
  if (!projectGrid || !projectResults) return;

  const query = projectSearch ? projectSearch.value.trim().toLowerCase() : "";

  const filtered = projects.filter((project) => {
    const typePass = activeType === "All" || project.type === activeType;
    const queryPass = !query || project.name.toLowerCase().includes(query);
    return typePass && queryPass;
  });

  const sorted = applySort(filtered);
  projectGrid.innerHTML = "";

  sorted.forEach((project) => {
    const card = document.createElement("article");
    card.className = "project-card";

    const title = document.createElement("h3");
    title.className = "project-title";
    title.textContent = project.name;

    const meta = document.createElement("div");
    meta.className = "project-meta";

    const typeChip = document.createElement("span");
    typeChip.className = "chip";
    typeChip.textContent = project.type;

    const hostChip = document.createElement("span");
    hostChip.className = "chip";
    hostChip.textContent = "Netlify";

    meta.appendChild(typeChip);
    meta.appendChild(hostChip);

    const actions = document.createElement("div");
    actions.className = "project-buttons";

    const openLink = document.createElement("a");
    openLink.href = project.url;
    openLink.target = "_blank";
    openLink.rel = "noreferrer";
    openLink.textContent = "Open Project";
    openLink.addEventListener("click", () => {
      bumpOpenCount(project.url);
      renderProjects();
    });

    const copyButton = document.createElement("button");
    copyButton.type = "button";
    copyButton.textContent = "Copy Link";
    copyButton.addEventListener("click", () => copyProjectUrl(project.url));

    actions.appendChild(openLink);
    actions.appendChild(copyButton);

    const openCount = document.createElement("p");
    openCount.className = "project-open-count";
    openCount.textContent = `Opened ${getOpenCount(project.url)} time${getOpenCount(project.url) === 1 ? "" : "s"}`;

    card.appendChild(title);
    card.appendChild(meta);
    card.appendChild(actions);
    card.appendChild(openCount);
    projectGrid.appendChild(card);
  });

  projectResults.textContent = `Showing ${sorted.length} of ${projects.length} projects`;
}

if (randomLaunch) {
  randomLaunch.addEventListener("click", () => {
    const query = projectSearch ? projectSearch.value.trim().toLowerCase() : "";

    const available = projects.filter((project) => {
      const typePass = activeType === "All" || project.type === activeType;
      const queryPass = !query || project.name.toLowerCase().includes(query);
      return typePass && queryPass;
    });

    if (!available.length) return;

    const randomProject = available[Math.floor(Math.random() * available.length)];
    bumpOpenCount(randomProject.url);
    renderProjects();
    window.open(randomProject.url, "_blank", "noopener,noreferrer");
  });
}

if (projectSearch) {
  projectSearch.addEventListener("input", renderProjects);
}

if (projectSort) {
  projectSort.addEventListener("change", renderProjects);
}

if (projectGrid && projectFilters && projectResults) {
  buildFilters();
  renderProjects();
}

const projectsToggle = document.getElementById("projects-toggle");
const collapsibleProjects = document.querySelectorAll(".project-item.is-collapsed");

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

// Burger menu toggle for mobile
const burgerBtn = document.getElementById("burger-btn");
const mainNav = document.getElementById("main-nav");

if (burgerBtn && mainNav) {
  burgerBtn.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    burgerBtn.classList.toggle("collapsed", !isOpen);
    burgerBtn.setAttribute("aria-expanded", String(isOpen));
  });

  // Close menu when clicking on a nav link
  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("is-open");
      burgerBtn.classList.add("collapsed");
      burgerBtn.setAttribute("aria-expanded", "false");
    });
  });
}

// Add scroll effect to header
let lastScroll = 0;
const header = document.querySelector('.site-header');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (!header) return;

  if (currentScroll > 100) {
    header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.15)';
  } else {
    header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.08)';
  }
  
  lastScroll = currentScroll;
});
