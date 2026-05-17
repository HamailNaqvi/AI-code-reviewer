// Monaco editor instance
let editor;

require.config({
  paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs" }
});

require(["vs/editor/editor.main"], function () {

  editor = monaco.editor.create(document.getElementById("editor"), {
    value: "// Write your code here",
    language: "javascript",
    theme: "vs-dark",

    fontSize: 16,
    minimap: { enabled: false },

    automaticLayout: true,
    scrollBeyondLastLine: false
  });

});

// Button click function
async function reviewCode () {
  const code = editor.getValue() // IMPORTANT FIX

  const response = await fetch('http://localhost:3000/review', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ code })
  })

  const data = await response.json()

  document.getElementById('result').innerHTML = marked.parse(data.review);
  // document.getElementById('result').style.color = "white";
  // document.getElementById('result').style.padding="5px";
  document.getElementById('bugsCount').innerText = data.bugs;
  document.getElementById('improvementsCount').innerText= data.improvements;
  document.getElementById('sidebarRating').innerText= data.rating;
  document.getElementById('UIUX').innerHTML = marked.parse(data.UIUX);
  // document.getElementById('ratingBar').innerText= data.ratinginpercentage;
  document.getElementById('ratingLabel').innerHTML = data.ratinglable;


  function updateSidebar({ rating, bugs, improvements }) {
      if (rating != null) {
        const r = parseFloat(rating);
        document.getElementById('sidebarRating').textContent = r.toFixed(1) + '/10';
        document.getElementById('ratingBar').style.width = (r * 10) + '%';
        const labels = ['Needs work', 'Fair', 'Average', 'Good', 'Great', 'Excellent'];
        document.getElementById('ratingLabel').textContent = labels[Math.min(Math.floor(r / 2), 5)];
      }
      if (bugs != null) {
        document.getElementById('bugsCount').textContent = bugs;
        const bugDots = document.getElementById('bugDots');
        bugDots.innerHTML = '';
        for (let i = 0; i < Math.min(bugs, 12); i++) {
          const d = document.createElement('div');
          d.className = 'stat-dot w-2 h-2 rounded-full bg-red-400 shadow-[0_0_6px_#f87171]';
          bugDots.appendChild(d);
          setTimeout(() => d.classList.add('active'), i * 80);
        }
      }
      if (improvements != null) {
        document.getElementById('improvementsCount').textContent = improvements;
        const impDots = document.getElementById('improvementDots');
        impDots.innerHTML = '';
        for (let i = 0; i < Math.min(improvements, 12); i++) {
          const d = document.createElement('div');
          d.className = 'stat-dot w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]';
          impDots.appendChild(d);
          setTimeout(() => d.classList.add('active'), i * 80);
        }
      }
    }

    function changeLanguage(lang) {
      if (window._monacoEditor && window.monaco) {
        const model = window._monacoEditor.getModel();
        if (model) window.monaco.editor.setModelLanguage(model, lang);
      }
    }
}
