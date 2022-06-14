// Start button
start.addEventListener("click", async () => {
	chrome.runtime.sendMessage({ start: true, type: "start" });
});

// Read csv
let loadButton = document.getElementById("load").addEventListener("click", () => {
	Papa.parse(document.getElementById("csvFile").files[0], {
		complete: function (results, file) {
			console.log("Parsing complete:", results, file);
			chrome.runtime.sendMessage({ csvlist: results, type: "list" });
		},
	});
});
