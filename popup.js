// Start stop button
const button = document.getElementById("startstop");
let turnedOn = false;
let nameFound = false;

button.addEventListener("click", async (e) => {
	if (turnedOn) {
		turnedOn = false;
		e.currentTarget.textContent = "START";
		console.log("Stop");
		chrome.runtime.sendMessage({ start: false });
	} else {
		turnedOn = true;
		e.currentTarget.textContent = "STOP";
		console.log("Start");
		chrome.runtime.sendMessage({ start: true });
	}
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	// Total accounts to follow
	if (document.getElementById("links").innerHTML === "0") {
		document.getElementById("links").innerHTML = request.total;
	}

	// Accounts followed so far
	if (request.handled !== undefined) {
		document.getElementById("handled").innerHTML = request.handled;
	}

	// If user does not have access
	if (request.access == false) {
		const accessbox = document.getElementById("access");
		accessbox.innerHTML = "You don't have access, join <a href='https://discord.gg/aePbQSZKVy'>Solaito's community</a> for access.";
	}
});

// Open link from popup in browser
window.addEventListener("click", function (e) {
	if (e.target.href !== undefined) {
		chrome.tabs.update({ url: e.target.href });
	}
});
