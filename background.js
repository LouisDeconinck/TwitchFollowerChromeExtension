var list;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	// When load button is clicked
	if (request.type == "list") {
		list = request.csvlist["data"].flat();
		console.log(list);
	}
	// When the start button is clicked
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
