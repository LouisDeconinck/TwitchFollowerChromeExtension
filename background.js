// Set op variables
let list = [];
let users = [];
let loopflag = false;
let i = 0;

// Fetch list of users with access and put it in a lower case array
async function fetchUsers() {
	let response = await fetch("https://pastebin.com/raw/dYQeN540", {
		cache: "no-cache", // default, no-store, reload, no-cache, force-cache, or only-if-cached
	});
	let usersarray = await response.text();
	users = usersarray.split(" ").map((element) => {
		return element.toLowerCase();
	});
	console.log(users);
}

// Fetch Twitch links to follow and put it in an array
async function fetchLinks() {
	let response = await fetch("https://pastebin.com/raw/pmppXQxj");
	let data = await response.text();
	list = await data.split(/\r?\n/);
}

// Check if a message was sent
chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
	// When the start button is clicked go to Twitch and let access.js run as content script
	if (request.start === true) {
		await fetchLinks();
		await fetchUsers();

		chrome.tabs.update({ url: "https://www.twitch.tv" });

		chrome.runtime.sendMessage({ total: list.length });
	}

	// When the stop button is clicked stop looping through the links
	if (request.start === false) {
		loopflag = false;
	}

	// When a message comes from access.js
	if (request.send === true) {
		// Name of logged in user
		console.log(request.name);

		// If the name is in the allowed users, give acces and start looping links
		if (users.includes(request.name.toLowerCase())) {
			console.log("Granted access.");
			loopflag = true;

			// Else don't give access and give link to Discord
		} else {
			chrome.runtime.sendMessage({ access: false });
			console.log("No access.");
		}
	}
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	// Loop through every link
	(async () => {
		while (i < list.length && loopflag === true) {
			let link = list[i];
			i++;
			console.log(link);
			await new Promise((resolve) => {
				chrome.tabs.update({ url: link }, (tab) => {
					chrome.tabs.onUpdated.addListener(function onUpdated(tabId, info) {
						chrome.tabs.onUpdated.removeListener(onUpdated);

						// Execute the follow script on the new page
						chrome.scripting.executeScript(
							{
								target: { tabId: tab.id },
								files: ["follow.js"],
							},
							() => {
								// Update the amount of links followed
								chrome.runtime.sendMessage({ handled: i });
								resolve();
							}
						);
					});
				});
			});
		}
	})();
});
