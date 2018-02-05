console.log("Test Environment Functioning");

chrome.tabs.query({}, function(tabs) {
	for (var tabLinkIndex = 0; tabLinkIndex < tabs.length; tabLinkIndex++) {
		var paragraph = document.createElement("p");
		var urlId = document.createTextNode(tabs[tabLinkIndex].id);
		paragraph.appendChild(urlId);
		document.body.appendChild(paragraph);
	}
	console.log(tabs);
});

// // console command for forcing re-loading debugger 
// location.reload(true)
