//plan for tab move
//store tabs by index in the window
//when tab is moved, get the indexes between the 2 numbers to update tabs

setLocalStorage('googleID', 101760331504672280672); //TEST USER

var user; 

class User{
  constructor(){
    this.loggedIn =  false; 
    this.tabsSortedByWindow = {};
    this.activeTabIndex = {};
    this.tabIds = {};
  }
  login(){
    this.loggedIn = true; 
    getAllTabs();
  }
  logout(){
    this.loggedIn = false; 
  }
}

/**
* Creates a Tab object, sets timestamp for initial open
*@param {object} tab 
*@param {object} currentTime
*/
function createNewTab(tab, currentTime){
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
    googleTabId: null, 
    highlighted: tab.highlighted

  }
  if(tabObject.highlighted){
    user.activeTabIndex[tab.windowId] = tab.index; 
    tabObject.timeOfActivation = currentTime;
    tabObject.timeOfDeactivation = 0;  
  } else {
    tabObject.timeOfActivation = 0;
    tabObject.timeOfDeactivation = currentTime;  
  } 

  user.tabIds[tab.windowId].push(tab.id);
  var tabArray = user.tabsSortedByWindow[tab.windowId]; 
  if(tabArray.indexOf(tab.index) !== -1){
    console.log('spot taken ')
  } else {
    user.tabsSortedByWindow[tab.windowId].push(tabObject);
  }
  return tabObject;
}

/**
* Updates a Tab object
*@param {object} 
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
* Remove Tab object from object and move to closedTabs object
*@param {id} 
*/
chrome.tabs.onRemoved.addListener(function (id, removeInfo){
  //remove tabs from array AND index list
  var tabArray = user.tabsSortedByWindow[removeInfo.windowId];
  var indexInIdsArray = user.tabIds[removeInfo.windowId].indexOf(id);
  console.log(indexInIdsArray)
  for(var tab = 0; tab < tabArray.length ; tab++){
    if(tabArray[tab].id === id){
      user.tabsSortedByWindow[removeInfo.windowId].splice(tab, 1);
      break; 
    }
  }
  console.log(user)

  // var window  = JSON.stringify(removeInfo.windowId);
  // if(user.loggedIn){
  //   chrome.storage.local.get(window, function(item){
  //     var stringId = JSON.stringify(id);
  //     var googleIdDb = item[window][stringId];
  //     var tabObject = {};
  //     tabObject['databaseTabID'] = googleIdDb;
  //     serverRequest('DELETE', 'http://www.closeyourtabs.com/tabs/database', tabObject);
  //   })
  // }
  // delete user.tabsSortedByWindow[removeInfo.windowId][id];
})



/**
* Listens to for when a tab updates
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
    var time = new Date();
    var timeStamp = time.getTime();
    var previousIndex = user.activeTabIndex[tab.windowId];
    // var currentDBTab = user.tabsSortedByWindow[tab.windowId][tab.index].googleTabId;
    if(user.tabIds[tab.windowId].indexOf(tab.id) !== -1){
      // var tabUpdated = updateTabInformation(tab, timeStamp);
      if(user.loggedIn){
        activateTimeTab(tabUpdated.databaseTabID);
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
    deactivateTimeTab(user.tabsSortedByWindow[tab.windowId][previousIndex].googleTabId);
    updatePreviousHighlightedTab(previousIndex, tab.windowId, timeStamp);
    user.activeTabIndex[tab.windowId] = tab.index;
  });
})

function activateTimeTab(uniqueID){
  var tabObject = {};
  tabObject['databaseTabID'] = uniqueID;
  serverRequest('PUT', 'http://www.closeyourtabs.com/tabs/activatedTime', tabObject);
}

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

function updatePreviousHighlightedTab(previousIndex, windowId,  timeStamp){
  var allTabs = user.tabsSortedByWindow[windowId]; 
  if(allTabs[previousIndex]){
      allTabs[previousIndex].highlighted = false;  
      allTabs[previousIndex].timeOfDeactivation = timeStamp;  
      allTabs[previousIndex].activeTimeElapsed = timeStamp - allTabs[previousIndex].timeOfActivation;
      allTabs[previousIndex].inactiveTimeElapsed = 0;
  }
}


/**
* Listens to for when a tab moves in a window
*/
chrome.tabs.onMoved.addListener(function(tabId, moveInfo){
  //update the database with all new indexes
  //call get all tabs, to get all the new
  console.log(moveInfo)
})


/**
* Runs function when receive a message from the shared port 
*@param {object} port 
*@param {object} message 
* sends response back to the caller
*/

chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name == "tab");
  port.onMessage.addListener(function(message) {
    if (message.type == "popup"){
      updatedElaspedDeactivation();
      var responseObject = {};
      responseObject.userStatus = user.loggedIn; 
      responseObject.allTabs =     user.tabsSortedByWindow; 
      port.postMessage({sessionInfo: responseObject})
    } else if(message.type = 'login'){
        chrome.storage.local.get('googleID', function(id){
          if(id.googleID){
            if(!user.loggedIn){
              user.login();
            }
            port.postMessage({'loginStatus': true})
          } else {
            port.postMessage({'loginStatus': false})
          }
        })
    }
  });
});



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

function createNewTabRequest(tabObject){
  var dataForServer = {
    windowID: tabObject.windowId,
    tabTitle: tabObject.title,
    activatedTime: 0, 
    deactivatedTime: 0, 
    browserTabIndex: tabObject.index, 
    googleID: tabObject.googleID, 
    url: tab.url,
    favicon: tab.favIconUrl
  }
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://www.closeyourtabs.com/tabs/');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 & xhr.status === 200) {
        var result = JSON.parse(xhr.responseText);
        //store the googlebaseTabID into the objecy

        activateTimeTab(result.data.insertId);
        var tabObj = user.tabsSortedByWindow[tabObject.windowId][tabObject.index]; 
        user.tabsSortedByWindow[tabObject.windowId][tabObject.index] = {...tabObject, databaseTabID: result.data.insertId}
      }
  };
  xhr.onerror = function (){
    reject('error')
  }
  xhr.send(JSON.stringify(dataForServer));

}


/**
*Check if user has an account 
* calls setLocalStorage
*/
function checkForUserAccount(){
  return new Promise( (resolve, reject)=> {
    //check to see if they have an account
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://www.closeyourtabs.com/auth/google/verify", true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == "200") {

        var result = JSON.parse(xhr.responseText);
        if(result){
          setLocalStorage('googleID', result);
          resolve(result);
        }else {
          reject('no user');
        }
      } 
    }
    xhr.onerror = function(){
      reject('No such user exists');
    }
    xhr.send()
  })
 
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
      var newTab = createNewTab(tab, timeStamp);
      user.tabIds[tab.windowId].push(newTab.id);
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
      user.tabsSortedByWindow[window.id] = [];
      user.activeTabIndex[window.id] = null;
      user.tabIds[window.id] = [];
    })
  })
  getAllTabs();
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