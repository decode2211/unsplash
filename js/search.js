const searchInput = document.getElementById("search-input");
const searchForm = document.getElementById("search-form");
const clearButton = document.getElementById("clear-search");
const searchContainer = document.getElementById("search-container");

function updateSearchUI() {
    if (searchInput.value.trim().length > 0) {
        searchContainer.classList.add("has-text");
    } else {
        searchContainer.classList.remove("has-text");
    }
}

searchInput.addEventListener("input", updateSearchUI);

clearButton.addEventListener("click", () => {
    searchInput.value = "";
    updateSearchUI();
    searchInput.focus();
});

searchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const query = searchInput.value.trim();

    if (!query) {
        return;
    }

    window.location.href =
        `https://www.google.com/search?q=${encodeURIComponent(query)}`;
});

// Collapsed pill has pointer-events:none on the input until hover/focus
// finishes expanding it — a fast click could land before that happens.
// Clicking anywhere on the container reliably focuses the input instead.
searchContainer.addEventListener("click", () => {
    searchInput.focus();
});