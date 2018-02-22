var lengthOfString = 40;
var port = chrome.runtime.connect({ name: 'tab' });

function init() {
	document.getElementById('refresh').addEventListener('click', refreshContent);
	document.getElementById('logout').addEventListener('click', logoutUser);
	document.getElementById('login').addEventListener('click', loginUser);

	document.body.style.opacity = 0;
	document.body.style.transition = 'opacity ease-out .4s';

	requestAnimationFrame(function() {
		document.body.style.opacity = 1;
	});
	sendMessageToGetTabInfo();
}

port.onMessage.addListener(function(response) {
	if (response.sessionInfo) {
		var windows = response.sessionInfo.allTabs;
		console.log(windows);

		for (var window in windows) {
			for (var item in windows[window]) {
				var tabInfo = windows[window][item];
				var tabElement = createDomElement(tabInfo);
				console.log(tabElement);
				document.getElementById('tag-titles').appendChild(tabElement);
			}
			if (response.sessionInfo.userStatus) {
				hideLoginButtons();
			}
		}
	} else if (response.loginStatus) {
		hideLoginButtons();
	}
});

function createDomElement(tabObject) {
	if (!tabObject.title) {
		return;
	}
	if (tabObject.highlighted) {
		tabObject.color = 'activetab';
	} else if (tabObject.inactiveTimeElapsed < 10000) {
		tabObject.color = '';
	} else if (tabObject.inactiveTimeElapsed < 25000) {
		tabObject.color = 'yellow';
	} else {
		tabObject.color = 'red';
	}
	var tab = document.createElement('div');
	var trashcanContainer = document.createElement('div');
	trashcanContainer.className = 'trashcan-container';
	var favicon = document.createElement('div');
	favicon.className = 'favicon-container';
	var title = document.createElement('div');
	title.className = 'title-container';
	var faviconImage = document.createElement('img');
	faviconImage.src = tabObject.favicon || 'images/iconpurple.png';
	favicon.appendChild(faviconImage);
	var trashcan = document.createElement('i');
	trashcan.className = 'far fa-trash-alt';
	trashcanContainer.appendChild(trashcan);
	var addText = document.createTextNode(tabObject.title.substring(0, lengthOfString));
	title.appendChild(addText);
	tab.className = 'tab-container id' + tabObject.id + ' ' + tabObject.color;
	tab.appendChild(trashcanContainer);
	tab.appendChild(favicon);
	tab.append(title);
	trashcan.addEventListener('click', clickEvent.bind(this, tabObject.id));
	tab.addEventListener('click', highlightTab.bind(this, tabObject.index, tabObject.windowId));
	return tab;
}

function clickEvent(id, event) {
	chrome.tabs.remove(id);
	var elem = document.querySelector('.id' + id);
	elem.parentNode.removeChild(elem);
}

function sendMessageToGetTabInfo() {
	port.postMessage({ type: 'popup' });
}

function hideLoginButtons() {
	document.getElementById('signup').style.display = 'none';
	document.getElementById('login').style.display = 'none';
}

function refreshContent() {
	document.getElementById('tag-titles').innerHTML = '';
	sendMessageToGetTabInfo();
}

//try adding window id
function highlightTab(index, windowId, event) {
	chrome.tabs.highlight({ tabs: index, windowId: windowId });
	chrome.windows.update(windowId, { focused: true });
}

function logoutUser() {
	port.postMessage({ type: 'logout' });
	document.getElementById('signup').style.display = 'block';
	document.getElementById('login').style.display = 'block';
}

function loginUser() {
	console.log('login');
	port.postMessage({ type: 'login' });
}

init();
