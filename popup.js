// When the start button is clicked, a counter is set to 0
start.addEventListener("click", async () => {
	chrome.runtime.sendMessage({ start: true });
});
