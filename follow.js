function clickFollow() {
	document.querySelector("button[data-a-target='follow-button']").click();
}

function waitForElement(timeout) {
	return new Promise((resolve, reject) => {
		var timer = false;
		const observer = new MutationObserver(() => {
			if (document.querySelector("button[data-a-target='follow-button']").length) {
				if (timer !== false) clearTimeout(timer);
				return resolve();
			}
			if (document.querySelector("button[data-a-target='unfollow-button']").length) {
				observer.disconnect();
				if (timer !== false) clearTimeout(timer);
				setTimeout(clickFollow, 1000);
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

waitForElement(5000)
	.then(function () {
		console.log("Unfollow button found.");
	})
	.catch(() => {
		console.log("Timeout");
	});
