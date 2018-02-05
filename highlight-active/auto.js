chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.tabs.highlight({ tabs: [3, 5] });
});
