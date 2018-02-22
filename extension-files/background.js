var user; 


/**
* User class keeps track of current tab information and whether logged in state
*/
class User{
  constructor(){
    this.loggedIn =  false; 
    this.tabsSortedByWindow = {};
    this.activeTabIndex = {};
    this.tabIds = {};
  }
  login(){
    this.loggedIn = true; 
    this.sendAllTabsToServer();
  }
  logout(){
    this.loggedIn = false; 
  }
  sendAllTabsToServer(){
    for(var window in this.tabsSortedByWindow){
      for(var tab in this.tabsSortedByWindow[window]){
        var currentTab = this.tabsSortedByWindow[window][tab];
        createNewTabRequest(currentTab);
      }
    }
  }
}

/**
* Creates a Tab object, if highlighted sets time of activation
* Checks to see if tab is occupying spot to place new tab
*@param {object} tab 
*@param {object} currentTime
*/
function createNewTab(tab, currentTime){

  user.tabIds[tab.windowId].push(tab.id);

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
  if(tabObject.highlighted){
    tabObject.timeOfActivation = currentTime;
    tabObject.timeOfDeactivation = 0;  
  } else {
    tabObject.timeOfActivation = 0;
    tabObject.timeOfDeactivation = currentTime;  
  } 
  
  var tabArray = user.tabsSortedByWindow[tab.windowId]; 
  if(tabObject.index < tabArray.length){
    user.tabsSortedByWindow[tabObject.windowId].splice(tabObject.index, 0, tabObject);
    var nextIndex = tab.index + 1; 
    console.log(user);
    updateIndex(nextIndex, (user.tabsSortedByWindow[tabObject.windowId].length - 1), tabObject.windowId);
  } else {
    user.tabsSortedByWindow[tab.windowId].push(tabObject);
  }
  return tabObject;
}


/**
* Updates a Tab object and returns an object to send to server 
*@param {object} tab 
*@param {object} timeStamp
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
    index: tab.index, 
    screenshot: '',
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
chrome.tabs.onRemoved.addListener(function (id, removeInfo){
  //remove tabs from array AND index list
  var tabArray = user.tabsSortedByWindow[removeInfo.windowId];
  var indexInIdsArray = user.tabIds[removeInfo.windowId].indexOf(id);
  var tabID; 
  user.tabIds[removeInfo.windowId].splice(indexInIdsArray, 1);
  for(var tab = 0; tab < tabArray.length ; tab++){
    if(tabArray[tab].id === id){
      tabID = user.tabsSortedByWindow[removeInfo.windowId][tab].databaseTabID;
      user.tabsSortedByWindow[removeInfo.windowId].splice(tab, 1);
      break; 
    }
  }

  user.activeTabIndex[removeInfo.windowId] = null; 

  if(user.loggedIn){
      var tabObject = {};
      tabObject['databaseTabID'] = tabID;
      sendDataToServer('DELETE', 'http://www.closeyourtabs.com/tabs/database', tabObject);
  }
})



/**
* Listens to for when a tab updates, updates information and sends info to database
*@param {integer} tab tab id
*@param {object} changeInfo changed info of the tab
*@param {object} tab  object containing props about the tab
*/
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
  if (tab.url !== undefined && changeInfo.status == "complete") {
    var window  = JSON.stringify(tab.windowId);
    var stringId = JSON.stringify(tab.id);
    var date = new Date()
    var timeStamp = date.getTime();

    //check to see if tab already exists
    if(user.tabIds[tab.windowId].indexOf(tab.id) !== -1){
      var dataForServer = updateTabInformation(tab);
      if(user.loggedIn){
        sendDataToServer('PUT', 'http://www.closeyourtabs.com/tabs/', dataForServer);
      }
    }
  }
})



/**
* Listens for when a tab becomes active by user clicking on the tab
*@param {object} activeInfo includes props about the tab clicked
*call setTime, createNewTab
*/
chrome.tabs.onHighlighted.addListener(function(hightlightInfo){
  chrome.tabs.get(hightlightInfo.tabIds[0], function(tab){
    var time = new Date();
    var timeStamp = time.getTime();
    // var currentDBTab = user.tabsSortedByWindow[tab.windowId][tab.index].googleTabId;
    if(user.tabIds[tab.windowId].indexOf(tab.id) !== -1){
      // var tabUpdated = updateTabInformation(tab, timeStamp);
      user.tabsSortedByWindow[tab.windowId][tab.index].highlighted = true; 
      if(user.loggedIn){
        activateTimeTab(user.tabsSortedByWindow[tab.windowId][tab.index].databaseTabID);
      }
    } else {
      var newTab = createNewTab(tab, timeStamp);
      if(user.loggedIn){
          createNewTabRequest(newTab);
      }
    }
    var previousIndex = user.activeTabIndex[tab.windowId];
    user.activeTabIndex[tab.windowId] = tab.index;
    if(previousIndex === null){
      return; 
    }
    deactivateTimeTab(user.tabsSortedByWindow[tab.windowId][previousIndex].databaseTabID);
    updatePreviousHighlightedTab(previousIndex, tab.windowId, timeStamp);

  });
})

/**
* Takes previous highlighted tab and sets time of deactivation
*@param {integer} uniqueID 
*call sendDataToServer
*/
function updatePreviousHighlightedTab(previousIndex, windowId,  timeStamp){
  var allTabs = user.tabsSortedByWindow[windowId]; 
  if(allTabs[previousIndex]){
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
  var tabIndex = user.tabIds[detachInfo.oldWindowId].indexOf(tab.id);
  user.tabIds[detachInfo.oldWindowId].splice(tabIndex, 1);
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
  console.log('attached', attachInfo)
  console.log(tabId);
  //if the index of the attached is less than the current active, add 1 to the current active 
  var windowTabs = user.tabsSortedByWindow[attachInfo.newWindowId];
  var currentActiveIndex = user.activeTabIndex[attachInfo.newWindowId];
  if(currentActiveIndex > attachInfo.newPosition){
    user.activeTabIndex[attachInfo.newWindowId] = currentActiveIndex++; 
  }
  //

  // var tab = user.tabsSortedByWindow[detachInfo.oldWindowId][detachInfo.oldPosition];
  // var tabIndex = user.tabIds[detachInfo.oldWindowId].indexOf(tab.id);
  // user.tabIds[detachInfo.oldWindowId].splice(tabIndex, 1);
  // user.tabsSortedByWindow[detachInfo.oldWindowId].splice(detachInfo.oldPosition, 1);
  // if(user.activeTabIndex[detachInfo.oldWindowId] === detachInfo.oldPosition){
  //   user.activeTabIndex[detachInfo.oldWindowId] = null; 
  // }
  // updateIndex(detachInfo.oldPosition, user.tabsSortedByWindow[detachInfo.oldWindowId].length-1, detachInfo.oldWindowId);
})

/**
* Runs function when receive a message from the shared port, (popup content script) 
*@param {object} port 
*@param {object} message 
* sends response back to the caller
*/
chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name == "tab");
  port.onMessage.addListener(function(message) {

    updatedElaspedDeactivation();
    var responseObject = {};
    responseObject.userStatus = user.loggedIn; 
    responseObject.allTabs =  user.tabsSortedByWindow; 

    if (message.type == "popup"){
      if(user.loggedIn){
        //get request from database 
        port.postMessage({sessionInfo: responseObject})
      } else {
        port.postMessage({sessionInfo: responseObject})
      }
    } else if(message.type === 'logout'){
      user.logout(); 
      requestToServerNoData('GET', "http://www.closeyourtabs.com/auth/google/logout");
    } else if (message.type === 'login'){
      checkForUserAccount().then(resp=>{
        if(resp){
          user.login();
          port.postMessage({loginStatus: true});
        } else {
          port.postMessage({loginStatus: false});

        }
      }).catch(error=>{
        console.log(error);
      })
    }
  });
});




/**
* Calls database to activate the time for tab
*@param {integer} uniqueID 
*call sendDataToServer
*/
function activateTimeTab(uniqueID){
  var tabObject = {};
  tabObject['databaseTabID'] = uniqueID;
  sendDataToServer('PUT', 'http://www.closeyourtabs.com/tabs/activatedTime', tabObject);
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
    sendDataToServer('PUT', 'http://www.closeyourtabs.com/tabs/deactivatedTime', tabObject)
  }
}

/**
* basic request to server in which the return callback does not need to do anything 
*@param {string} method types of request, ex. get, post, etc
*@param {string} action the target route on the server
*@param {object} data the data that will be sent 
*/
function sendDataToServer(method, action, data){
  if(data === null){
    return; 
  }
  var xhr = new XMLHttpRequest();
  xhr.open(method, action);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 & xhr.status === 200) {
        console.log(xhr.responseText)
      }
    }
  xhr.send(JSON.stringify(data))
}

/**
* Get request to receive all tabs of user from database 
*/
function requestToServerNoData(method, route){
  var xhr = new XMLHttpRequest();
  xhr.open(method, route, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      if(xhr.status === 200){
        console.log(xhr.responseText)
      }
    } 
  }
  xhr.send()
}

/**
* POST request for new tab, saves tabId to user, activates tab when completed  
*@param {object} tabObject the data that will be sent 
*/
function createNewTabRequest(tabObject){
  var dataForServer = {
    windowID: tabObject.windowId,
    tabTitle: tabObject.title,
    activatedTime: 0, 
    deactivatedTime: 0, 
    browserTabIndex: tabObject.index, 
    url: tabObject.url,
    favicon: tabObject.favIconUrl
  }
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://www.closeyourtabs.com/tabs/');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 & xhr.status === 200) {
        console.log(xhr.responseText);
        if(JSON.parse(xhr.responseText).insertId){
          var result = JSON.parse(xhr.responseText).insertId; 
          activateTimeTab(result);
          var tabObj = user.tabsSortedByWindow[tabObject.windowId][tabObject.index]; 
          user.tabsSortedByWindow[tabObj.windowId][tabObj.index] = {...tabObj, databaseTabID: result}

        } else {
          console.log('tab was not created')
        }
      }
  };
  xhr.onerror = function (){
    reject('error')
  }
  xhr.send(JSON.stringify(dataForServer));
}


/**
*Check if user has an account 
*/
function checkForUserAccount(){
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://www.closeyourtabs.com/auth/google/verify", true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        if(xhr.status == "200"){
          var result = xhr.responseText;
          if(result === 'true'){
            clearPreviousTabData();
            resolve(true);
          } else {
            resolve(false);
          }
        }else {
          resolve(false);
        }
      } 
    }
    xhr.onerror = function(){
      console.log('connect error')
      reject(false);
    }
    xhr.send()
  })

}

/**
*Deletes user information from database
*/
function clearPreviousTabData(){
  requestToServerNoData('DELETE', 'http://www.closeyourtabs.com/tabs/google');
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
    if(user.loggedIn){
      sendDataToServer('PUT', 'http://www.closeyourtabs.com/tabs', dataForServer)
    }
  }
}



/**
*Sets key value pair in local storage
*@param {string} keyName
*@param {any value} value
*/
function setLocalStorage(keyName, value){
  var object = {};
  object[keyName] = value; 
  chrome.storage.local.set(object);
}

/**
*Checks elapsed deactivate time and updates the elapsed deactivated time
* 
*/
function updatedElaspedDeactivation(){
  var date = new Date();
  var currentTime = date.getTime();
  var windows =  user.tabsSortedByWindow; 
  for(var window in windows){
    for(var index in windows[window]){
      if(!windows[window][index].highlighted){
        windows[window][index].inactiveTimeElapsed = currentTime - windows[window][index].timeOfDeactivation;
      }
    }
  }
}

/**
* Gets all tabs currently in the browser
*calls createNewTab
*/
function getAllTabs(){
  chrome.tabs.query({}, function(tabs) {
    var date = new Date()
    var timeStamp = date.getTime();
    tabs.forEach(function(tab){
      createNewTab(tab, timeStamp);
      if(tab.highlighted){
        user.activeTabIndex[tab.windowId] = tab.index; 
      }
    })
  })
}

/**
* clears local storage of any previous windows and creates an instance of user session
*checks to see if user is already logged in 
*calls getAllTabs, new instance of User object
*/
function newExtensionSession(){
  user = new User();
  chrome.windows.getAll(function(windows){
    windows.forEach(function(window){
      newWindowForUser(window);
    })
  })
  getAllTabs();
  checkForUserAccount().then(resp=>{
    if(resp){
      console.log('user logged in');
      user.login();
    } else {
      console.log('user is not logged in ')
      //show user this info
    }
  }).catch(error=>{
    console.log('ERROR', error)
  })
}

/**
* clears local storage of any previous windows and creates an instance of user session
*@param {object} window window object 
*/
function newWindowForUser(window){
  user.tabsSortedByWindow[window.id] = [];
  user.activeTabIndex[window.id] = null;
  user.tabIds[window.id] = [];
}

/**
* Runs function when first browser loads
*@param {object} details
*calls getAllTabs
*/
chrome.runtime.onStartup.addListener(function(details){
  console.log('browser open');
  newExtensionSession();
})

/**
* Runs function when first installed
*@param {object} details
*calls getAllTabs
*/
chrome.runtime.onInstalled.addListener(function(details){
  console.log('installed');
    // setLocalStorage('googleID', null);
  newExtensionSession();
})

/**
* Listens for window created
*@param {object} window
*calls newWindowForUser
*/
chrome.windows.onCreated.addListener(function(window){
  newWindowForUser(window)
})


chrome.windows.onRemoved.addListener(function(windowId){
  //remove all tabs from database
  if(user.loggedIn){
    var arrayOfTabs = user.tabsSortedByWindow[windowId];
    for(var tab = 0; tab < arrayOfTabs.length ; tab++){
      //remove from database
      console.log('remove from DB')
    }
  }
  delete user.tabsSortedByWindow[windowId];
  delete user.activeTabIndex[windowId];
  delete user.tabIds[windowId];
})