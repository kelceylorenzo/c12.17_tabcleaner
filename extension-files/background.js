var user;
const BASE_URL = 'http://www.closeyourtabs.com';
const COOKIE_NAME =  'connect.sid';

/**
 * User class keeps track of current tab information and logged in status
 */
class User {
	constructor() {
		this.loggedIn = false;
		this.tabsSortedByWindow = {};
		this.activeTabIndex = {};
		this.tabIds = {};
		this.name = '',
		this.photo = ''
	}
	login() {
		if(user.loggedIn){
			return; 
		}
		chrome.cookies.get({ url: BASE_URL, name: COOKIE_NAME }, function(cookie) {
			if(cookie){
				var date = new Date();
				var currenttime = date.getTime();
				var ifExpire = currenttime - cookie.expirationDate; 
				if(ifExpire > 0){
					console.log('user logged in');
					user.loggedIn = true; 
					user.changeBrowserIcon('images/extension-green-logo.png');
					clearPreviousTabData();
					user.sendAllTabsToServer();
				} else {
					console.log('user NOT logged in');
					user.changeBrowserIcon('images/iconpurple.png');
					user.loggedIn = false; 
				}
			}else {
				console.log('user NOT logged in, no cookie');
				user.changeBrowserIcon('images/iconpurple.png');
				user.loggedIn = false; 
			}
		});
	}
	logout() {
		chrome.cookies.remove({url: BASE_URL, name: COOKIE_NAME }, function(result){
			if(result.name === COOKIE_NAME){
				console.log('success logout');
				user.changeBrowserIcon('images/iconpurple.png')
				console.log(user)
				if(user.loggedIn){
					clearPreviousTabData();
					user.loggedIn = false;
					//loop throuhg all tabs
					//find cloe you tabs and reload 
					for (var window in user.tabsSortedByWindow) {
						for (var tab in user.tabsSortedByWindow[window]) {
							var matchedTab = user.tabsSortedByWindow[window][tab]; 
							let domain = (matchedTab.url).match(/closeyourtabs.com/gi)
							if(domain){
								chrome.tabs.reload(matchedTab.id);
							}
						}
					}

				}
			} else {
				console.log('fail logout')
			}
		})


	}
	sendAllTabsToServer() {
		for (var window in this.tabsSortedByWindow) {
			for (var tab in this.tabsSortedByWindow[window]) {
				var currentTab = this.tabsSortedByWindow[window][tab];
				createNewTabRequest(currentTab);
			}
		}
	}
	changeBrowserIcon(imagePath){
		chrome.browserAction.setIcon({path: imagePath})
	}
}


/**
* Creates a Tab object, if highlighted sets time of activation
* Checks to see if tab is occupying spot to place new tab
*@param {object} tab 
*@param {object} currentTime
*/
function createNewTab(tab, currentTime){
	if(user.tabIds[tab.windowId].indexOf(tab.id) !== -1){
		return; 
	}

	if(user.tabIds[tab.windowId].indexOf(tab.id) === -1){
		user.tabIds[tab.windowId].push(tab.id);
	}

  var tabObject = {
    id: tab.id,
    windowId: tab.windowId,
    favicon: tab.favIconUrl,
    title: tab.title,
    url: tab.url,
    index: tab.index,
    activeTimeElapsed: 0,
    inactiveTimeElapsed: 0,
    screenshot: '', 
    databaseTabID: user.userID, 
    highlighted: tab.highlighted

  }
  
  var tabArray = user.tabsSortedByWindow[tab.windowId]; 
  if(tabObject.index < tabArray.length){
		var currentActiveTab = user.activeTabIndex[tab.windowId];
		if(tab.index <= currentActiveTab){
			user.activeTabIndex[tabObject.windowId]--; 
		}
    user.tabsSortedByWindow[tabObject.windowId].splice(tabObject.index, 0, tabObject);
		var nextIndex = tab.index + 1; 
    updateIndex(nextIndex, (user.tabsSortedByWindow[tabObject.windowId].length - 1), tabObject.windowId);
  } else {
    user.tabsSortedByWindow[tab.windowId].push(tabObject);
	}
	
	if(tabObject.highlighted){
		user.activeTabIndex[tab.windowId] = tab.index; 
    tabObject.timeOfActivation = currentTime;
    tabObject.timeOfDeactivation = 0;  
  } else {
    tabObject.timeOfActivation = 0;
    tabObject.timeOfDeactivation = currentTime;  
	} 
	
  return tabObject;
}

/**

* Updates a Tab object and returns an object to send to server 
*@param {object} tab 
*@return {object} dataForServer
*/

function updateTabInformation(tab){
  //if the site changed, get the elapsed time during active state and save to its url
  var currentInfo = user.tabsSortedByWindow[tab.windowId][tab.index]; 
  var updatedInfo = {...currentInfo, 
    id: tab.id,
    windowId: tab.windowId,
    favicon: tab.favIconUrl,
    title: tab.title,
    url: tab.url,
    screenshot: tab.screenshot, 
    index: tab.index, 
    highlighted: tab.highlighted
  }

  user.tabsSortedByWindow[tab.windowId][tab.index] = updatedInfo;

  var dataForServer = {
    databaseTabID: updatedInfo.databaseTabID, 
    tabTitle: updatedInfo.title, 
    browserTabIndex: updatedInfo.index, 
    url: updatedInfo.url,
    favicon: updatedInfo.favicon,
  } 

  return dataForServer; 
}

/**
 * Remove tab and tab id from user, calls database to remove
 *@param {integer} id iD of tab removed
 *@param {object} removeInfo windowid
 */
chrome.tabs.onRemoved.addListener(function(id, removeInfo) {
	//remove tabs from array AND index list
	var tabArray = user.tabsSortedByWindow[removeInfo.windowId];
	var indexInIdsArray = user.tabIds[removeInfo.windowId].indexOf(id);
	var tabID;
	var tabIndex; 
	user.tabIds[removeInfo.windowId].splice(indexInIdsArray, 1);
	for (var tab = 0; tab < tabArray.length; tab++) {
		if (tabArray[tab].id === id) {
			var tabToRemoveInfo = user.tabsSortedByWindow[removeInfo.windowId][tab]; 
			tabID = tabToRemoveInfo.databaseTabID;
			tabIndex = tabToRemoveInfo.index; 
			user.tabsSortedByWindow[removeInfo.windowId].splice(tabIndex, 1);
			break;
		}
	}

	//update all the indexes for the tabs
	if(tabIndex < tabArray.length - 1){
		updateIndex(tabIndex, user.tabsSortedByWindow[removeInfo.windowId].length-1, removeInfo.windowId);
	}

	user.activeTabIndex[removeInfo.windowId] = null;


	if (user.loggedIn) {
		var tabObject = {};
		tabObject['databaseTabID'] = tabID;
		sendDataToServer('DELETE', `${BASE_URL}/tabs/database`, tabObject);
	}

	updatedElaspedDeactivation();
});

function removeTab(id, windowID){
	var tabArray = user.tabsSortedByWindow[windowID];
	var indexInIdsArray = user.tabIds[windowID].indexOf(id);
	var tabID;
	var tabIndex; 
	user.tabIds[windowID].splice(indexInIdsArray, 1);
	for (var tab = 0; tab < tabArray.length; tab++) {
		if (tabArray[tab].id === id) {
			var tabToRemoveInfo = user.tabsSortedByWindow[windowID][tab]; 
			tabID = tabToRemoveInfo.databaseTabID;
			tabIndex = tabToRemoveInfo.index; 
			user.tabsSortedByWindow[windowID].splice(tabIndex, 1);
			break;
		}
	}

	//update all the indexes for the tabs
	if(tabIndex < tabArray.length - 1){
		updateIndex(tabIndex, user.tabsSortedByWindow[windowID].length-1, windowID);
	}

	user.activeTabIndex[windowID] = null;


	if (user.loggedIn) {
		var tabObject = {};
		tabObject['databaseTabID'] = tabID;
		sendDataToServer('DELETE', `${BASE_URL}/tabs/database`, tabObject);
	}

	updatedElaspedDeactivation();
}

/**

* Listens to for when a tab updates, updates information and sends info to database
*@param {integer} tab tab id
*@param {object} changeInfo changed info of the tab
*@param {object} tab  object containing props about the tab
*/
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
  if (tab.url !== undefined && changeInfo.status == "complete") {
	console.log('update')
		// chrome.tabs.executeScript(null, { file: "content_script.js" }); 
    chrome.tabs.captureVisibleTab({quality: 50},function(dataUrl){
      tab.screenshot = dataUrl; 
      var window  = JSON.stringify(tab.windowId);
      var stringId = JSON.stringify(tab.id);
      var timeStamp = getTimeStamp();

      //check to see if tab already exists
      if(user.tabIds[tab.windowId].indexOf(tab.id) !== -1){
        var dataForServer = updateTabInformation(tab);
        if(user.loggedIn && tab.url !== ''){
          sendDataToServer('PUT', `${BASE_URL}/tabs`, dataForServer);
        }
      } else {
				var newTab = createNewTab(tab, timeStamp);
			}
    })
  }
})


chrome.tabs.onCreated.addListener(function(tab){
		var timeStamp = getTimeStamp();
		var newTab = createNewTab(tab, timeStamp);
		if(user.loggedIn){
				createNewTabRequest(newTab);
		}

})




/**
* Listens for when a tab becomes active by user clicking on the tab
*@param {object} activeInfo includes props about the tab clicked
*call setTime, createNewTab
*/
chrome.tabs.onHighlighted.addListener(function(hightlightInfo){
	console.log('highlight')

  chrome.tabs.get(hightlightInfo.tabIds[0], function(tab){
    var timeStamp = getTimeStamp();
		// var previousIndex = user.activeTabIndex[tab.windowId];
		updatePreviousHighlightedTab(user.activeTabIndex[tab.windowId], tab.windowId, timeStamp, tab.url);

		// var currentDBTab = user.tabsSortedByWindow[tab.windowId][tab.index].googleTabId;
		if (user.tabsSortedByWindow[tab.windowId].length !== user.tabIds[tab.windowId].length){
			var timeStamp = getTimeStamp();
			var newTab = createNewTab(tab, timeStamp);
			if(user.loggedIn){	
					createNewTabRequest(newTab);
			}
		} else if(user.tabIds[tab.windowId].indexOf(tab.id) !== -1){
      // var tabUpdated = updateTabInformation(tab, timeStamp);
      user.tabsSortedByWindow[tab.windowId][tab.index].highlighted = true; 
      user.activeTabIndex[tab.windowId] = tab.index;
      if(user.loggedIn){
        activateTimeTab(user.tabsSortedByWindow[tab.windowId][tab.index].databaseTabID);
      }
    } 
		updatedElaspedDeactivation();
  });
})


/**
 * Takes previous highlighted tab and sets time of deactivation
 *@param {integer} uniqueID
 *call sendDataToServer
 */
function updatePreviousHighlightedTab(previousIndex, windowId, timeStamp) {
  if(previousIndex === null){
    return; 
  }
  deactivateTimeTab(user.tabsSortedByWindow[windowId][previousIndex].databaseTabID);
	var allTabs = user.tabsSortedByWindow[windowId];
	if (allTabs[previousIndex]) {
		allTabs[previousIndex].highlighted = false;
		allTabs[previousIndex].timeOfDeactivation = timeStamp;
	}
}

/**

* Listens to for when a tab moves in a window
*@param { integer } tabId id of tab moved
*@param { object } moveInfo fromIndex, toIndex, windowId
*/
chrome.tabs.onMoved.addListener(function(tabId, moveInfo){
  var tab = user.tabsSortedByWindow[moveInfo.windowId][moveInfo.fromIndex];
  user.tabsSortedByWindow[moveInfo.windowId].splice(moveInfo.fromIndex, 1);
  user.tabsSortedByWindow[moveInfo.windowId].splice(moveInfo.toIndex, 0, tab);
  user.activeTabIndex[tab.windowId] = moveInfo.toIndex; 
  if(moveInfo.fromIndex > moveInfo.toIndex){
    updateIndex(moveInfo.toIndex, moveInfo.fromIndex, moveInfo.windowId);
  } else{
    updateIndex(moveInfo.fromIndex, moveInfo.toIndex, moveInfo.windowId);

  }
})


/**
* Listens for when a tab is detached from window 
*@param {integer} tabId 
*@param {object} detachInfo  oldPosition, oldWindowId
*/
chrome.tabs.onDetached.addListener(function(tabId, detachInfo){
  var tab = user.tabsSortedByWindow[detachInfo.oldWindowId][detachInfo.oldPosition];
  var tabIDIndex = user.tabIds[detachInfo.oldWindowId].indexOf(tab.id);
  user.tabIds[detachInfo.oldWindowId].splice(tabIDIndex, 1);
  user.tabsSortedByWindow[detachInfo.oldWindowId].splice(detachInfo.oldPosition, 1);
  if(user.activeTabIndex[detachInfo.oldWindowId] === detachInfo.oldPosition){
    user.activeTabIndex[detachInfo.oldWindowId] = null; 
  }
  updateIndex(detachInfo.oldPosition, user.tabsSortedByWindow[detachInfo.oldWindowId].length-1, detachInfo.oldWindowId);
})

/**
* Listens for when a tab is attached to window 
*@param {integer} tabId 
*@param {object} detachInfo  newPosition, newWindowId
*/
chrome.tabs.onAttached.addListener(function(tabId, attachInfo){
	user.tabIds[attachInfo.newWindowId].push(tabId);
})

/**
 * Runs function when receive a message from the shared port, (popup content script)
 *@param {object} port
 *@param {object} message
 * sends response back to the caller
 */
chrome.runtime.onConnect.addListener(function(port) {
  var lastFocused = null;
	console.assert(port.name == 'tab');
	port.onMessage.addListener(function(message) {
		updatedElaspedDeactivation();
		if (message.type == 'popup') {
			chrome.windows.getAll(function(window){
				for(let array = 0; array<window.length; array++) {
					if(window[array].focused === true) {
						var responseObject = {};
						responseObject.userStatus = user.loggedIn;
						responseObject.allTabs = user.tabsSortedByWindow;
						responseObject.currentWindow = window[array].id;
						lastFocused = window[array].id
						port.postMessage({ sessionInfo: responseObject });
					}
				}			
			})
		} else if(message.type === 'refresh') {
			chrome.windows.getLastFocused(function(window) {
				var responseObject = {};
				responseObject.userStatus = user.loggedIn;
				responseObject.allTabs = user.tabsSortedByWindow;
				responseObject.currentWindow = lastFocused;
				port.postMessage({ sessionInfo: responseObject});
			})
		} else if (message.type === 'logout') {
			user.logout();
		}  
	});
});

/**
 * Sets new badge number on extension icon
 *@param {integer} number
 */
function setBadgeNumber(number){
	if(number > 0){
		chrome.browserAction.setBadgeText({text: number.toString()});
		chrome.browserAction.setBadgeBackgroundColor({color: '#FF0000'});
	} else {
		chrome.browserAction.setBadgeText({text: ''});
	}
}

/**
 * Calls database to activate the time for tab
 *@param {integer} uniqueID
 *call sendDataToServer
 */
function activateTimeTab(uniqueID) {
	var tabObject = {};
	tabObject['databaseTabID'] = uniqueID;
	sendDataToServer('PUT',  `${BASE_URL}/tabs/activatedTime`, tabObject);
}

/**
* Calls database to deactivate the time for tab
*@param {integer} uniqueID 
*call sendDataToServer
*/
function deactivateTimeTab(uniqueID){
  if(user.loggedIn && uniqueID !== null){
    var tabObject = {};
    tabObject['databaseTabID'] = uniqueID;
    sendDataToServer('PUT', `${BASE_URL}/tabs/deactivatedTime`, tabObject)
  }
}

/**
 * basic request to server in which the return callback does not need to do anything
 *@param {string} method types of request, ex. get, post, etc
 *@param {string} action the target route on the server
 *@param {object} data the data that will be sent
 */
function sendDataToServer(method, action, data) {
	if (data === null) {
		return;
	}
	var xhr = new XMLHttpRequest();
	xhr.open(method, action);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if(xhr.status === 200){
				console.log(xhr.responseText);
			} else {
				user.logout();
				console.log('connect error');
			}
		}
	};
	xhr.onerror = function() {
		user.logout();
		console.log('connect error');
	};
	xhr.send(JSON.stringify(data));
}

/**
 * Get request to receive all tabs of user from database
 */
function requestToServerNoData(method, route) {
	var xhr = new XMLHttpRequest();
	xhr.open(method, route, true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if (xhr.status === 200) {
				var result = JSON.parse(xhr.responseText);
			} else {
				user.logout();
				console.log('no server')
			}
		}
	};
	xhr.onerror = function() {
		user.logout();
		console.log('connect error');
	};
	xhr.send();
}


/**
 * POST request for new tab, saves tabId to user, activates tab when completed
 *@param {object} tabObject the data that will be sent
 */
function createNewTabRequest(tabObject) {
	
	var dataForServer = {
		windowID: tabObject.windowId,
		tabTitle: tabObject.title,
		activatedTime: 0,
		deactivatedTime: 0,
		browserTabIndex: tabObject.index,
		url: tabObject.url,
		favicon: tabObject.favIconUrl
	};
	var xhr = new XMLHttpRequest();
	xhr.open('POST', `${BASE_URL}/tabs`);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if (xhr.status === 200) {
				var result = JSON.parse(xhr.responseText)
				if (result.success) {
					console.log('server connect', xhr.responseText)
					var result = JSON.parse(xhr.responseText).data.insertId;
					var tabObj = user.tabsSortedByWindow[tabObject.windowId][tabObject.index];
					user.tabsSortedByWindow[tabObj.windowId][tabObj.index] = { ...tabObj, databaseTabID: result };
					if(tabObject.highlighted){
						activateTimeTab(result);
					} else {
						deactivateTimeTab(result)
					}
				
				} else {
					user.logout();
					console.log('server connect fail', xhr.responseText)
				}
			}
		}
	};
	xhr.onerror = function() {
		user.logout();
		console.log('connect error');
	};
	xhr.send(JSON.stringify(dataForServer));
}

/**
 *Deletes user information from database
 */
function clearPreviousTabData() {
	requestToServerNoData('DELETE',`${BASE_URL}/tabs/google`);
}


/**
*updated index by 1 from beginning to ending index
*@param {integer} beginIndex
*@param {integer} endIndex
*/
function updateIndex(beginIndex, endIndex, windowId){
  
  for(var index = beginIndex ; index <= endIndex ; index++){
    var tabObject = user.tabsSortedByWindow[windowId][index];
    tabObject.index = index;  
    var dataForServer = updateTabInformation(tabObject);
    if(user.loggedIn && tabObject.url !== ''){
      sendDataToServer('PUT', `${BASE_URL}/tabs`, dataForServer)
    }
  }
}


/**
 *Returns current time stamp
 */
function getTimeStamp(){
  var date = new Date()
  return date.getTime();
}


/**
 *Sets key value pair in local storage
 *@param {string} keyName
 *@param {any value} value
 */
function setLocalStorage(keyName, value) {
	var object = {};
	object[keyName] = value;
	chrome.storage.local.set(object);
}

/**
 *Checks elapsed deactivate time and updates the elapsed deactivated time
 *
 */
function updatedElaspedDeactivation() {
	var currentTime = getTimeStamp();
	var windows = user.tabsSortedByWindow;
	var overdueTabCount = 0; 
	for (var window in windows) {
		for (var index in windows[window]) {
			tab = windows[window][index];
			if (!tab.highlighted) {
				tab.inactiveTimeElapsed =
					currentTime - tab.timeOfDeactivation;
				if(tab.inactiveTimeElapsed > 25000){
					overdueTabCount++;
				}
			}
		}
	}
	setBadgeNumber(overdueTabCount);
}

/**
 * Gets all tabs currently in the browser
 *calls createNewTab
 */
function getAllTabs() {
	chrome.tabs.query({}, function(tabs) {
		var date = new Date();
		var timeStamp = date.getTime();
		tabs.forEach(function(tab) {
			createNewTab(tab, timeStamp);
			if (tab.highlighted) {
				user.activeTabIndex[tab.windowId] = tab.index;
      }
		});
	});
}

/**
 * clears local storage of any previous windows and creates an instance of user session
 *checks to see if user is already logged in
 *calls getAllTabs, new instance of User object
 */
function newExtensionSession() {
	user = new User();
	chrome.windows.getAll(function(windows) {
		windows.forEach(function(window) {
			newWindowForUser(window);
		});
	});
	getAllTabs();
	user.login();
}

/**
 * clears local storage of any previous windows and creates an instance of user session
 *@param {object} window window object
 */
function newWindowForUser(window) {
	user.tabsSortedByWindow[window.id] = [];
	user.activeTabIndex[window.id] = null;
	user.tabIds[window.id] = [];
}

/**
 * Runs function when first browser loads
 *@param {object} details
 *calls getAllTabs
 */
chrome.runtime.onStartup.addListener(function(details) {
	console.log('browser open');
	newExtensionSession();
});

/**
 * Runs function when first installed
 *@param {object} details
 *calls getAllTabs
 */
chrome.runtime.onInstalled.addListener(function(details) {
	console.log('installed');
	// setLocalStorage('googleID', null);
	newExtensionSession();
});

/**
 * Listens for window created
 *@param {object} window
 *calls newWindowForUser
 */
chrome.windows.onCreated.addListener(function(window) {
	newWindowForUser(window);
});

/**
 * Listens for window removed
 *@param {object} windowId
 */
chrome.windows.onRemoved.addListener(function(windowId) {
	//remove all tabs from database
	if (user.loggedIn) {
		var arrayOfTabs = user.tabsSortedByWindow[windowId];
		for (var tab = 0; tab < arrayOfTabs.length; tab++) {
			//remove from database
			console.log('remove from DB');
		}
	}
	delete user.tabsSortedByWindow[windowId];
	delete user.activeTabIndex[windowId];
	delete user.tabIds[windowId];
});

/**
* Listens for messages from content script
*@param {object} request
*@param {object} sender
*@param {function} sendResponse
*/
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.type == "removeTab"){
		var window = request.data.window;
		var index = request.data.index; 
		var tabID = user.tabsSortedByWindow[window][index].id;
		if(tabID >= 0 ){
			chrome.tabs.remove(tabID);
			sendResponse({success: true})
		} else {
			sendResponse({success: false})
		}

	} else if (request.type == "logoutUser"){
		if(user.loggedIn){
			user.logout();
		}
	} else if(request.type === "checkLogin"){
		if(!user.loggedIn){
			user.login();
		}
	}
});

chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
    chrome.tabs.executeScript(null,{file:"dashboard.js"});
});