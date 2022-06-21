// Click follow button
function clickFollow() {
	document.querySelector("button[data-a-target='follow-button']").click();
	console.log("Follow button clicked.");
}

/**
 * Check for unfollow or follow button
 * @param {Integer} timeout - Milliseconds to wait before timing out, or 0 for no timeout
 */
function checkButtons(timeout) {
	return new Promise((resolve, reject) => {
		var timer = false;
		const observer = new MutationObserver(() => {
			// If there's an unfollow button go to next link
			if (document.querySelectorAll("button[data-a-target='unfollow-button']").length) {
				observer.disconnect();
				console.log("Unfollow button found.");
				if (timer !== false) clearTimeout(timer);
				return resolve();
			}

			// If there's a follow button click it
			if (document.querySelectorAll("button[data-a-target='follow-button']").length) {
				console.log("Follow button found");
				setTimeout(clickFollow, 1500);
			}
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});

		if (timeout)
			timer = setTimeout(() => {
				observer.disconnect();
				reject();
			}, timeout);
	});
}

checkButtons(8000)
	.then(function () {
		console.log("Button found.");
	})
	.catch(() => {
		console.log("No button loaded in 5 seconds");
	});
