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

function applySavedProfile() {
  const data = JSON.parse(localStorage.getItem("profileData") || "{}");
  Object.entries(data).forEach(([key, value]) => {
    applyValue(key, value);
  });
}

applySavedProfile();
