const channel = new BroadcastChannel("my-editor-channel");

// Store original bracket/paren placeholder text so we can restore it
const fillSpans = document.querySelectorAll(".fill");
fillSpans.forEach(span => {
  span.dataset.original = span.textContent;
});

// Click-to-erase: only works on erasable ([]) spans
fillSpans.forEach(span => {
  if (span.classList.contains("erasable")) {
    span.style.cursor = "pointer";
    span.addEventListener("click", () => {
      span.textContent = "";
      span.classList.add("erased");
    });
  }
});

// Fill in a value for every span matching a given key,
// but only if it hasn't been erased
function applyValue(key, value) {
  document.querySelectorAll(`.fill[data-key="${key}"]`).forEach(span => {
    if (!span.classList.contains("erased")) {
      span.textContent = value;
    }
  });
}

channel.addEventListener("message", (event) => {
  const data = event.data;
  if (data.request === "ack") return; // ignore internal acks, see below
  Object.entries(data).forEach(([key, value]) => {
    applyValue(key, value);
  });
});

// Ask Page A to resend current values on load (fixes race condition)
channel.postMessage({ request: "sync" });
