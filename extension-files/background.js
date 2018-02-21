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
    this.userID = null; 
  }
  login(){
    this.loggedIn = true; 
    this.sendAllTabsToServer(this.userID);
  }
  logout(){
    this.loggedIn = false; 
  }
  sendAllTabsToServer(googleID){
    for(var window in this.tabsSortedByWindow){
      for(var tab in this.tabsSortedByWindow[window]){
        var currentTab = this.tabsSortedByWindow[window][tab];
        this.tabsSortedByWindow[window][tab].googleTabId = this.userID;
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
    googleTabId: user.userID, 
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
  if(tabArray.indexOf(tab.index) !== -1){
    console.log('spot taken ')
    //updates the indexes for all the tabs 
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

function updateTabInformation(tab, timeStamp){
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
    databaseTabID: tab.googleTabId, 
    tabTitle: tab.title, 
    browserTabIndex: tab.index, 
    url: tab.url,
    favicon: tab.favicon,
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
      tabID = user.tabsSortedByWindow[removeInfo.windowId][tab].googleTabId;
      user.tabsSortedByWindow[removeInfo.windowId].splice(tab, 1);
      break; 
    }
  }

  user.activeTabIndex[removeInfo.windowId] = null; 

  if(user.loggedIn){
      var tabObject = {};
      tabObject['databaseTabID'] = tabID;
      serverRequest('DELETE', 'http://www.closeyourtabs.com/tabs/database', tabObject);
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
      var dataForServer = updateTabInformation(tab, timeStamp);
      if(user.loggedIn){
        serverRequest('PUT', 'http://www.closeyourtabs.com/tabs/', dataForServer);
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
    console.log('updated')
    var time = new Date();
    var timeStamp = time.getTime();
    // var currentDBTab = user.tabsSortedByWindow[tab.windowId][tab.index].googleTabId;
    if(user.tabIds[tab.windowId].indexOf(tab.id) !== -1){
      // var tabUpdated = updateTabInformation(tab, timeStamp);
      user.tabsSortedByWindow[tab.windowId][tab.index].highlighted = true; 
      if(user.loggedIn){
        activateTimeTab(tab.googleTabId);
      }
    } else {
      var newTab = createNewTab(tab, timeStamp);
      if(user.loggedIn){
        chrome.storage.local.get('googleID', function(userID){
          newTab.googleID = userID; 
          createNewTabRequest(newTab);
        })
      }
    }
    var previousIndex = user.activeTabIndex[tab.windowId];
    user.activeTabIndex[tab.windowId] = tab.index;
    if(previousIndex === null){
      return; 
    }
    deactivateTimeTab(user.tabsSortedByWindow[tab.windowId][previousIndex].googleTabId);
    updatePreviousHighlightedTab(previousIndex, tab.windowId, timeStamp);

  });
})

/**
* Takes previous highlighted tab and sets time of deactivation
*@param {integer} uniqueID 
*call serverRequest
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
*@param { object } moveInfo movedTo, movedFrom
*/
chrome.tabs.onMoved.addListener(function(tabId, moveInfo){
  //update the database with all new indexes
  //call get all tabs, to get all the new
  console.log(moveInfo)
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
    if (message.type == "popup"){
      if(user.loggedIn){
        //get request from database 

        //temporary 
        updatedElaspedDeactivation();
        var responseObject = {};
        responseObject.userStatus = user.loggedIn; 
        responseObject.allTabs =     user.tabsSortedByWindow; 
        port.postMessage({sessionInfo: responseObject})
      }else {
        updatedElaspedDeactivation();
        var responseObject = {};
        responseObject.userStatus = user.loggedIn; 
        responseObject.allTabs =     user.tabsSortedByWindow; 
        port.postMessage({sessionInfo: responseObject})
      }
    } else if(message.type = 'login'){
        chrome.storage.local.get('googleID', function(id){
          if(id.googleID){
            user.userID = id.googleID;
            user.login();
            port.postMessage({'loginStatus': true})
          } else {
            //call database to check if user has account 
            port.postMessage({'loginStatus': false})
          }
        })
    }
  });
});




/**
* Calls database to activate the time for tab
*@param {integer} uniqueID 
*call serverRequest
*/
function activateTimeTab(uniqueID){
  var tabObject = {};
  tabObject['databaseTabID'] = uniqueID;
  serverRequest('PUT', 'http://www.closeyourtabs.com/tabs/activatedTime', tabObject);
}

/**
* Calls database to deactivate the time for tab
*@param {integer} uniqueID 
*call serverRequest
*/
function deactivateTimeTab(uniqueID){
  if(uniqueID === null){
    return; 
  }
  chrome.storage.local.get('googleID', function (id){
    var userGoogleID = id['googleID'];
    if(userGoogleID && user.loggedIn){
      var tabObject = {};
      tabObject['databaseTabID'] = uniqueID;
      tabObject['googleID'] = userGoogleID
      serverRequest('PUT', 'http://www.closeyourtabs.com/tabs/deactivatedTime', tabObject)
    }
  })
}

/**
* basic request to server in which the return callback does not need to do anything 
*@param {string} method types of request, ex. get, post, etc
*@param {string} action the target route on the server
*@param {object} data the data that will be sent 
*/
function serverRequest(method, action, data){
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
function getAllDataFromServer(){
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "http://www.closeyourtabs.com/tabs", true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 & xhr.status === 200) {
      console.log(xhr.responseText)
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
    googleID: tabObject.googleID, 
    url: tabObject.url,
    favicon: tabObject.favIconUrl
  }
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://www.closeyourtabs.com/tabs/');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 & xhr.status === 200) {
        var result = JSON.parse(xhr.responseText);
        console.log(result);
        // activateTimeTab(result.data.insertId);
        // var tabObj = user.tabsSortedByWindow[tabObject.windowId][tabObject.index]; 
        // user.tabsSortedByWindow[tabObject.windowId][tabObject.index] = {...tabObject, databaseTabID: result.data.insertId}
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
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "http://www.closeyourtabs.com/auth/google/verify", true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == "200") {
      var result = JSON.parse(xhr.responseText);
      console.log(result)
    } 
  }
  xhr.onerror = function(){
    reject('No such user exists');
  }
  xhr.send()

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