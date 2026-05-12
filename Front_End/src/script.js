// Monaco editor instance
let editor

// Initialize Monaco
require.config({
  paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs' }
})

require(['vs/editor/editor.main'], function () {
  editor = monaco.editor.create(document.getElementById('editor'), {
    value: "console.log('Hello world')",
    language: 'javascript',
    theme: 'vs-dark',
    automaticLayout: true
  })
})

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

  document.getElementById('result').innerText = data.review
}
