console.log("SCRIPT LOADED");

// ── Monaco Editor ─────────────────────────────
let editor;

require.config({
  paths: {
    vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs"
  }
});

require(["vs/editor/editor.main"], function () {
  editor = monaco.editor.create(document.getElementById("editor"), {
    value: "// Write your code here",
    language: "python",
    theme: "vs-dark",
    fontSize: 16,
    minimap: { enabled: false },
    automaticLayout: true
  });

  window._monacoEditor = editor;
});

// ── Loading UI ─────────────────────────────
function setLoading(on) {
  const overlay = document.getElementById("loadingOverlay");
  const btn = document.getElementById("reviewBtn");

  overlay.classList.toggle("active", on);
  btn.disabled = on;
}

// ── MAIN FUNCTION ─────────────────────────────
async function reviewCode() {
  if (!editor) return;

  const code = editor.getValue().trim();
  if (!code) return;

  document.getElementById("review").scrollIntoView({
    behavior: "smooth"
  });

  setLoading(true);

  try {
    const response = await fetch(
      "https://ai-code-reviewer-apol.onrender.com/review",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
      }
    );

    const data = await response.json();

    document.getElementById("result").innerHTML =
      marked.parse(data.review || "");

    document.getElementById("Security").innerHTML =
      marked.parse(data.Vulnerabilities || "");

    document.getElementById("UIUX").innerHTML =
      marked.parse(data.UIUX || "");

    updateInfoBar({
      rating: data.rating,
      bugs: data.bugs,
      improvements: data.improvements,
      threats: data.nVulnerabilities,
      readings: data.Readability,
      language: data.Language
    });

  } catch (err) {
    console.error(err);
    alert("Error: " + err.message);
  } finally {
    setLoading(false);
  }
}

// ── Info Bar ─────────────────────────────
function updateInfoBar({ rating, bugs, improvements, language, threats, readings }) {
  if (language) {
    document.getElementById("infoLanguage").innerHTML =
      `<span class="lang-badge">${language}</span>`;
  }

  if (rating != null) {
    document.getElementById("infoRating").textContent = rating + "/10";
    document.getElementById("infoRatingBar").style.width = rating * 10 + "%";
  }

  if (bugs != null) {
    document.getElementById("infoBugs").textContent = bugs;
  }

  if (improvements != null) {
    document.getElementById("infoImprovements").textContent = improvements;
  }

  if (threats != null) {
    document.getElementById("numberOfThreats").textContent = threats;
  }

  if (readings != null) {
    document.getElementById("inforeading").textContent = readings + "/10";
    document.getElementById("inforeadingBar").style.width = readings * 10 + "%";
  }
}

// ── Monaco language switch ─────────────────────────────
function changeLanguage(lang) {
  if (window._monacoEditor) {
    monaco.editor.setModelLanguage(
      window._monacoEditor.getModel(),
      lang
    );
  }
}