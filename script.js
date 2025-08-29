const LINKS = [
  {
    title: "Jamdrop.ai",
    desc: "AI music generator — make a track in minutes",
    url: "https://jamdrop.ai",
    tag: "Product",
    emoji: "🐝"
  },
  {
    title: "GitHub",
    desc: "Code, projects, experiments",
    url: "https://github.com/caiocarvalho93",
    tag: "Code",
    emoji: "💻"
  },
  {
    title: "LinkedIn",
    desc: "Work history, certifications, references",
    url: "https://www.linkedin.com/in/caio-carvalho-6b9119262/",
    tag: "Career",
    emoji: "🔗"
  },
  {
    title: "Spotify — AI Artist Caitrippie",
    desc: "Latest releases & playlists",
    url: "https://open.spotify.com/album/4TqzRoP4XhdSdrCHfnAu95?si=DllQp6knRua2wtUSKbgMTg",
    tag: "Music",
    emoji: "🎧"
  },
  {
    title: "Current — Projects",
    desc: "What I'm working on now",
    url: "https://hypeddit.com/caiocarvalhosoftwareengineer/ssecretlinks",
    tag: "Campaign",
    emoji: "✨"
  },
  {
    title: "Resume (PDF)",
    desc: "1-page resume — updated",
    url: "resume.pdf",
    tag: "Docs",
    emoji: "📄"
  },
  {
    title: "Email Me",
    desc: "cai@jamdrop.com (click to copy)",
    url: "mailto:cai@jamdrop.com",
    tag: "Contact",
    emoji: "✉️",
    copy: "cai@jamdrop.com"
  },
  {
    title: "YouTube",
    desc: "Clips, demos, walkthroughs",
    url: "https://www.youtube.com/@caitrippie",
    tag: "Video",
    emoji: "📺"
  }
];


const $ = (sel, parent = document) => parent.querySelector(sel);
const $$ = (sel, parent = document) => [...parent.querySelectorAll(sel)];
const toast = (msg, ms = 1800) => {
  const el = $("#toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("show"), ms);
};


function renderLinks(data) {
  const grid = $("#linksGrid");
  grid.innerHTML = "";
  data.forEach((item, idx) => {
    const a = document.createElement("a");
    a.href = item.url;
    a.target = item.url.startsWith("http") ? "_blank" : "_self";
    a.rel = "noopener";
    a.className = "card";
    a.setAttribute("data-tag", item.tag);
    a.setAttribute("tabindex", "0");
    a.style.animationDelay = `${idx * 60}ms`;
    a.innerHTML = `
      <div class="icon">${item.emoji || "🔗"}</div>
      <div>
        <div class="card-title">${item.title}</div>
        <div class="card-desc">${item.desc}</div>
      </div>
      <div class="tag">${item.tag}</div>
    `;

    a.addEventListener("click", (e) => {
      // If card has copy text and user used modifier click, copy instead of navigate
      if (item.copy && (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1)) {
        e.preventDefault();
        navigator.clipboard.writeText(item.copy).then(() => toast("Copied to clipboard"));
        return;
      }
      const circle = document.createElement("span");
      circle.className = "ripple";
      const rect = a.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      circle.style.width = circle.style.height = `${size}px`;
      circle.style.left = `${e.clientX - rect.left - size / 2}px`;
      circle.style.top = `${e.clientY - rect.top - size / 2}px`;
      a.appendChild(circle);
      circle.addEventListener("animationend", () => circle.remove());

      console.log(`[link] ${item.title} -> ${item.url}`);
    });

    a.addEventListener("contextmenu", (e) => {
      if (item.copy) {
        e.preventDefault();
        navigator.clipboard.writeText(item.copy).then(() => toast("Copied email to clipboard"));
      }
    });
    grid.appendChild(a);

    requestAnimationFrame(() => a.classList.add("reveal"));
  });

  $("#stats").textContent = `Showing ${data.length} link${data.length !== 1 ? "s" : ""}`;
}


function setupSearch() {
  const input = $("#searchInput");
  // Focus search on pressing '/'
  window.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== input) {
      e.preventDefault();
      input.focus();
      input.select();
    }
  });
  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    const filtered = LINKS.filter(l =>
      l.title.toLowerCase().includes(q) ||
      l.desc.toLowerCase().includes(q) ||
      l.tag.toLowerCase().includes(q)
    );
    renderLinks(filtered);
  });
}

// here is where I toggle dark/light mode
function setupTheme() {
  const toggle = $("#themeToggle");
  const saved = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", saved);
  toggle.checked = (saved === "dark");
  $(".switch-label").textContent = saved === "dark" ? "Dark" : "Light";
  toggle.addEventListener("change", () => {
    const next = toggle.checked ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    $(".switch-label").textContent = next === "dark" ? "Dark" : "Light";
  });
}

//dont forget to share my resume here - photo or link?
function setupShare() {
  const btn = $("#shareBtn");
  btn.addEventListener("click", async () => {
    const shareData = {
      title: document.title,
      text: "My secret links — code, music, socials.",
      url: location.href
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        /* user cancelled share */
      }
    } else {
      await navigator.clipboard.writeText(location.href);
      toast("Link copied to clipboard");
    }
  });
}

// Miscellaneous setup
function setupMisc() {
  // dynamic year
  $("#year").textContent = new Date().getFullYear();
  // avatar fallback if image fails to load
  $("#avatar").addEventListener("error", (e) => {
    e.target.src = "data:image/svg+xml;utf8," + encodeURIComponent(`
      <svg xmlns='http://www.w3.org/2000/svg' width='256' height='256'>
        <rect width='100%' height='100%' fill='#111'/>
        <text x='50%' y='54%' fill='#6cf8c6' font-size='24' font-family='system-ui' text-anchor='middle'>C A I</text>
      </svg>
    `);
  });
}

// 5 times world champs babeee
function setBrazilMode(on) {
  const root = document.documentElement;
  const btn = $("#brToggle");
  const modeBadge = document.querySelector(".badges .badge:last-child");  // "Dark mode 🖤" 
  if (on) {
    root.setAttribute("data-flag", "br");
    localStorage.setItem("flag", "br");
    if (btn) btn.setAttribute("aria-pressed", "true");

    const themeToggle = $("#themeToggle");
    if (themeToggle) themeToggle.disabled = true;

    if (modeBadge) modeBadge.textContent = "Dark mode 💙";
  } else {
    root.removeAttribute("data-flag");
    localStorage.removeItem("flag");
    if (btn) btn.setAttribute("aria-pressed", "false");
//should i leave dark / bright when brasil on?    
    if (themeToggle) themeToggle.disabled = false;
// Change heart back to black
    if (modeBadge) modeBadge.textContent = "Dark mode 🖤";
  }
}

function setupBrazilToggle() {
  const btn = $("#brToggle");
  if (!btn) return;
  // Apply saved Brazil mode state on load
  const savedOn = localStorage.getItem("flag") === "br";
  setBrazilMode(savedOn);
  btn.addEventListener("click", () => {
    const isOn = document.documentElement.getAttribute("data-flag") === "br";
    // If turning Brazil on, ensure Mario mode is off
    if (!isOn) setMarioMode(false);
    setBrazilMode(!isOn);
    toast(!isOn ? "Brazil mode ON 🇧🇷" : "Brazil mode OFF");
  });
}

// nitendo 64 vibes
function setMarioMode(on) {
  const root = document.documentElement;
  const btn = $("#marioToggle");
  const modeBadge = document.querySelector(".badges .badge:last-child");  // Dark mode badge
  if (on) {
    root.setAttribute("data-game", "mario");
    localStorage.setItem("game", "mario");
    if (btn) btn.setAttribute("aria-pressed", "true");
    // Disable other theme themes when Mario mode is on
    const themeToggle = $("#themeToggle");
    if (themeToggle) themeToggle.disabled = true;
    // hert to that star u get to beat everyone in mario kart
    if (modeBadge) modeBadge.textContent = "Dark mode ⭐";
  } else {
    root.removeAttribute("data-game");
    localStorage.removeItem("game");
    if (btn) btn.setAttribute("aria-pressed", "false");

    const themeToggle = $("#themeToggle");
    if (themeToggle) themeToggle.disabled = false;
    // Restore badge text to default black heart (unless Brazil mode is on which will handle it)
    if (modeBadge) modeBadge.textContent = "Dark mode 🖤";
  }
}

function setupMarioToggle() {
  const btn = $("#marioToggle");
  if (!btn) return;

  const savedOn = localStorage.getItem("game") === "mario";
  setMarioMode(savedOn);
  btn.addEventListener("click", () => {
    const isOn = document.documentElement.getAttribute("data-game") === "mario";

    if (!isOn) setBrazilMode(false);
    setMarioMode(!isOn);
    toast(!isOn ? "Mario mode ON 🍄" : "Mario mode OFF");
  });
}

// Boot it and toot it. DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  renderLinks(LINKS);
  setupSearch();
  setupTheme();
  setupShare();
  setupMisc();
  setupBrazilToggle();
  setupMarioToggle();
});
