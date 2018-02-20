//plan for tab move
//store tabs by index in the window
//when tab is moved, get the indexes between the 2 numbers to update tabs

setLocalStorage('googleID', 101760331504672280672); //TEST USER

var user; 

class User{
  constructor(){
    this.loggedIn =  false; 
    this.tabsSortedByWindow = {};
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
    highlighted: tab.highlighted

  }
  if(tabObject.highlighted){
    tabObject.timeOfActivation = currentTime;
    tabObject.timeOfDeactivation = 0;  
  } else {
    tabObject.timeOfActivation = 0;
    tabObject.timeOfDeactivation = currentTime;  
  }
  user.tabsSortedByWindow[tab.windowId][tab.index] = tabObject; 

  if(user.loggedIn){
      chrome.storage.local.get('googleID', function(userID){
        var dataForServer = {
          windowID: tab.windowId,
          tabTitle: tab.title,
          activatedTime: 0, 
          deactivatedTime: 0, 
          browserTabIndex: tab.index, 
          googleID: userID.googleID, 
          url: tab.url,
          favicon: tab.favIconUrl
        }
        var result = createNewTabRequest(dataForServer, tab.id); 
          result.then(resp => {
            activateTimeTab(resp);
          }).catch(err => {
            reject(err);
          })
      })
    
  }
}

/**
* Updates a Tab object
*@param {object} 
*/

function updateTabInformation(tab, timeStamp, updateInfo){
  //if the site changed, get the elapsed time during active state and save to its url
  user.tabsSortedByWindow[tab.windowId][tab.index] = {
    id: tab.id,
    windowId: tab.windowId,
    favicon: tab.favIconUrl,
    title: tab.title,
    url: tab.url,
    index: tab.index, 
    screenshot: '',
    highlighted: tab.highlighted
  }

  if(updateInfo && user.loggedIn){
    var dataForServer = {
      databaseTabID: tab.googleTabId, 
      tabTitle: tab.title, 
      browserTabIndex: tab.index, 
      url: tab.url,
      favicon: tab.favicon,
    } 
    serverRequest('PUT', 'http://www.closeyourtabs.com/tabs/', dataForServer);
  } else if (user.loggedIn) {
    activateTimeTab(tab.googleTabId);
  }
}






/**
* Remove Tab object from object and move to closedTabs object
*@param {id} 
*/
chrome.tabs.onRemoved.addListener(function (id, removeInfo){
  
  var window  = JSON.stringify(removeInfo.windowId);
  if(user.loggedIn){
    chrome.storage.local.get(window, function(item){
      var stringId = JSON.stringify(id);
      var googleIdDb = item[window][stringId];
      var tabObject = {};
      tabObject['databaseTabID'] = googleIdDb;
      serverRequest('DELETE', 'http://www.closeyourtabs.com/tabs/database', tabObject);
    })
  }
  delete user.allTabs[id];
})

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
        var activeWindowTab = 'activeTab' + tab.windowId;
        setLocalStorage(activeWindowTab, tab.index);
      }
    })
  })
}

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

    chrome.storage.local.get(window, function(item){
      if (item[window][stringId]) {
        var googleIdDb = item[window][stringId];
        tab.googleTabId = googleIdDb;
      } 
      updateTabInformation(tab, timeStamp, true);
    })
  }
})



/**
* Listens for when a tab becomes active by user clicking on the tab
*@param {object} activeInfo includes props about the tab clicked
*call setTime, createNewTab
*/
chrome.tabs.onHighlighted.addListener(function(hightlightInfo){
  chrome.tabs.get(hightlightInfo.tabIds[0], function(tab){
    var window  = JSON.stringify(tab.windowId);
    var stringId = JSON.stringify(tab.id);
    var time = new Date();
    var timeStamp = time.getTime();
    chrome.storage.local.get(window, function(item){
      var activeWindowTab = 'activeTab' + tab.windowId;
      chrome.storage.local.get(activeWindowTab, function(currentID){
        var previousIndex = currentID[activeWindowTab];
        var previousHighlightedGoogleID = item[window][previousIndex.toString()];
        updateLocalTracking(previousIndex, tab.windowId, timeStamp);
        if (item[window][stringId] >= 0) {
          var currentDBTab = item[window][stringId];
          tab.googleTabId = currentDBTab; 
          updateTabInformation(tab, timeStamp, false);
        } else {
          createNewTab(tab, timeStamp);
        }
        setLocalStorage(activeWindowTab, tab.index);
        deactivateTimeTab(previousHighlightedGoogleID);
      })   
    })
  });
})

function activateTimeTab(uniqueID){
  var tabObject = {};
  tabObject['databaseTabID'] = uniqueID;
  serverRequest('PUT', 'http://www.closeyourtabs.com/tabs/activatedTime', tabObject);
}

function deactivateTimeTab(uniqueID){
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

function updateLocalTracking(previousIndex, windowId,  timeStamp){
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
* clears local storage of any previous windows and creates an instance of user session
*checks to see if user is already logged in 
*calls getAllTabs, new instance of User object
*/
function newExtensionSession(){
  chrome.windows.getAll(function(windows){
    windows.forEach(function(window){
      var windowString = window.id.toString();
      var emptyObject = {}
      setLocalStorage(windowString, emptyObject);
      user.tabsSortedByWindow[window.id] = {}
    })
  })
  user = new User();
  getAllTabs();
}

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

function createNewTabRequest(tabObject, tabId){
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://www.closeyourtabs.com/tabs/');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 & xhr.status === 200) {
          var result = JSON.parse(xhr.responseText);
          var window  = JSON.stringify(tabObject.windowID);
          var object = {};
          chrome.storage.local.get(window, function(item){
            var tabObjectStore = {};
            tabObjectStore[tabId] = result.data.insertId; 
            object[window] = tabObjectStore; 
            if(item){
              var addNewTabItem = {...item[window]}
              addNewTabItem[tabId] = result.data.insertId; 
              setLocalStorage(window, addNewTabItem);
            }else {
              setLocalStorage(window, tabObjectStore);
            }
            var activeWindowTab = 'activeTab' + tabObject.windowId;
            setLocalStorage(activeWindowTab, tabObject.index);
            resolve(result.data.insertId);
          })
        }
    };
    xhr.onerror = function (){
      reject('error')
    }
    xhr.send(JSON.stringify(tabObject));
  })
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