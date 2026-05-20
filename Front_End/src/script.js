// ── Monaco editor setup ──────────────────────────────────────────────────────
let editor;

require.config({
  paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs" }
});

require(["vs/editor/editor.main"], function () {
  editor = monaco.editor.create(document.getElementById("editor"), {
    value: "Write your code here",
    language: "python",
    theme: "vs-dark",
    fontSize: 16,
    minimap: { enabled: false },
    automaticLayout: true,
    scrollBeyondLastLine: false
  });

  // expose globally so changeLanguage() can reach it
  window._monacoEditor = editor;
});

// ── Loading helpers ───────────────────────────────────────────────────────────
function setLoading(on) {
  const overlay  = document.getElementById("loadingOverlay");
  const btn      = document.getElementById("reviewBtn");
  const btnText  = document.getElementById("btnText");

  if (on) {
    overlay.classList.add("active");
    btn.disabled   = true;
    btnText.textContent = "⏳ Reviewing…";
  } else {
    overlay.classList.remove("active");
    btn.disabled   = false;
    btnText.textContent = "⚡ Review Code";
  }
}

// ── Info-bar updater (Language, Rating, Bugs, Improvements) ─────────────────
function updateInfoBar({ rating, bugs, improvements, language, threats, readings }) {

  // — Language badge —
  if (language != null && language !== "") {
    document.getElementById("infoLanguage").innerHTML =
      `<span class="lang-badge">${language}</span>`;

    // also sync Monaco syntax highlighting if possible
    changeLanguage(language.toLowerCase());
  }

  // — Rating —
  if (rating != null) {
    const r = parseFloat(rating);
    document.getElementById("infoRating").textContent = r.toFixed(1) + "/10";
    // animate bar on next frame so CSS transition fires
    requestAnimationFrame(() => {
      document.getElementById("infoRatingBar").style.width = (r * 10) + "%";
    });
  }

  // // -Threats-

  if (threats != null){
    document.getElementById("numberOfThreats").textContent = threats;
    const threatsDots = document.getElementById("numberOfThreatsDots");
    threatsDots.innerHTML="";
    for (let i = 0; i < Math.min(threats, 12); i++) {
      const d = document.createElement("div");
      d.className = "stat-dot w-2 h-2 rounded-full bg-red-800 shadow-[0_0_6px_#f87171]";
      threatsDots.appendChild(d);
      setTimeout(() => d.classList.add("active"), i * 80);
    }
  }

  // — Bugs —
  if (bugs != null) {
    document.getElementById("infoBugs").textContent = bugs;
    const bugDots = document.getElementById("infoBugDots");
    bugDots.innerHTML = "";
    for (let i = 0; i < Math.min(bugs, 12); i++) {
      const d = document.createElement("div");
      d.className = "stat-dot w-2 h-2 rounded-full bg-red-400 shadow-[0_0_6px_#f87171]";
      bugDots.appendChild(d);
      setTimeout(() => d.classList.add("active"), i * 80);
    }
  }


    // — Reading Score —

      if (readings != null) {
    const r = parseFloat(readings);
    document.getElementById("inforeading").textContent = r.toFixed(1) + "/10";
    // animate bar on next frame so CSS transition fires
    requestAnimationFrame(() => {
      document.getElementById("inforeadingBar").style.width = (r * 10) + "%";
    });
  }

  // — Improvements —
  if (improvements != null) {
    document.getElementById("infoImprovements").textContent = improvements;
    const impDots = document.getElementById("infoImprovementDots");
    impDots.innerHTML = "";
    for (let i = 0; i < Math.min(improvements, 12); i++) {
      const d = document.createElement("div");
      d.className = "stat-dot w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]";
      impDots.appendChild(d);
      setTimeout(() => d.classList.add("active"), i * 80);
    }
  }
}

// ── Main review function ──────────────────────────────────────────────────────
async function reviewCode() {
  if (!editor) return;

  const code = editor.getValue().trim();
  if (!code) return;

  // scroll smoothly to results section
  document.getElementById("review").scrollIntoView({ behavior: "smooth", block: "start" });

  setLoading(true);

  try {
    const response = await fetch("http://localhost:3000/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    });

    const data = await response.json();

    document.getElementById("result").innerHTML = marked.parse(data.review ?? "");
    document.getElementById("Security").innerHTML = marked.parse(data.Vulnerabilities ?? "");
    document.getElementById("UIUX").innerHTML = marked.parse(data.UIUX ?? "");

    // — Update info bar with AI-detected language + stats —
    updateInfoBar({
      rating:       data.rating,
      bugs:         data.bugs,
      improvements: data.improvements,
      threats:      data.nVulnerabilities,
      readings:     data.Readability,
      language:     data.Language   // comes back from your JSON
    });

  } catch (err) {
    console.error("Review error:", err);
    document.getElementById("result").innerHTML =
      `<p class="text-red-400 font-sans text-sm">⚠️ Failed to fetch review. Is the server running?<br><code>${err.message}</code></p>`;
  } finally {
    setLoading(false);
  }
}

// ── Monaco language switcher ──────────────────────────────────────────────────
function changeLanguage(lang) {
  if (window._monacoEditor && window.monaco) {
    const model = window._monacoEditor.getModel();
    if (model) window.monaco.editor.setModelLanguage(model, lang);
  }
}