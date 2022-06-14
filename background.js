const list = ["https://www.twitch.tv/hello1", "https://www.twitch.tv/hello2", "https://www.twitch.tv/hello3"];

// When the start button is clicked
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.start === true) {
		// Loop through every link
		(async () => {
			for (const link of list) {
				console.log(link);
				await new Promise((resolve) => {
					chrome.tabs.update({ url: link }, (tab) => {
						chrome.tabs.onUpdated.addListener(function onUpdated(tabId, info) {
							chrome.tabs.onUpdated.removeListener(onUpdated);
							console.log("Executing script.");
							chrome.scripting.executeScript(
								{
									target: { tabId: tab.id },
									files: ["follow.js"],
								},
								() => {
									resolve();
								}
							);
						});
					});
				});
			}
		})();
	}
});
