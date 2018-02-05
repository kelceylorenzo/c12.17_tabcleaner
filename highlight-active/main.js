chrome.tabs.query({}, function(tabs) {
	for (var index = 0; index < tabs.length; index++) {
		var div = document.createElement('div');
		div.setAttribute('class', 'site-title');
		var title = document.createTextNode(tabs[index].title);

		div.appendChild(title);
		document.body.appendChild(div);
	}
});

document.addEventListener('DOMContentLoaded', function() {
	var button = document.createElement('button');
	button.setAttribute('id', 'button');
	var text = document.createTextNode('Highlight Text');
	button.appendChild(text);
	document.body.appendChild(button);

	var highlightButton = document.getElementById('button');
	var titlesList = document.getElementsByClassName('site-title');
	highlightButton.addEventListener('click', function() {
		chrome.tabs.highlight({ tabs: [5, 3, 0] });
		titlesList[0].setAttribute('style', 'color: red');
		titlesList[3].setAttribute('style', 'color: red');
		titlesList[5].setAttribute('style', 'color: red');
	});
});
