async function loadHighlights() {
  const res = await fetch("/highlights.json");
  const data = await res.json();

  const feed = document.getElementById("feed");
  feed.innerHTML = "";

  data.slice().reverse().forEach(entry => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>Source: ${entry.source}</h3>
      <p><b>Text:</b> ${entry.content}</p>
      <p><b>Definition:</b> ${entry.definition || "Processing..."}</p>
    `;
    feed.appendChild(card);
  });
}

setInterval(loadHighlights, 1000);