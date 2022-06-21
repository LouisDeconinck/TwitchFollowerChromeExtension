// Click the user avatar
function clickAvatar() {
	document.querySelector("button[data-a-target='user-menu-toggle']").click();
	console.log("Avatar clicked.");
}

const observer = new MutationObserver(() => {
	// If the menu is present, click the avatar to see display name
	if (document.querySelectorAll("button[data-a-target='user-menu-toggle']").length) {
		console.log("Avatar found.");
		setTimeout(clickAvatar, 1500);
	}

	// If the display name is present send it to background.js
	if (document.querySelectorAll("h6[data-a-target='user-display-name']").length) {
		observer.disconnect();
		console.log("Name found.");
		let name = document.querySelector("h6[data-a-target='user-display-name']").textContent;
		console.log(name);
		chrome.runtime.sendMessage({ name: name, send: true });
	}
});

observer.observe(document.body, {
	childList: true,
	subtree: true,
});
