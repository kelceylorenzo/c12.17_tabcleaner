//when user install, user state is logged out. 
//when user clicks sign up button, directed to page to sign up
//then user clicks login to check for googleID
//if returns the key, user state is logged in 
//

setLocalStorage('googleID', 101760331504672280672); //TEST USER
var user; 

class User{
  constructor(){
    this.loggedIn =  false; 
    this.allTabs = {}; 
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
*Check if user has an account 
* calls setLocalStorage
*/
function checkForUserAccount(){
  //check to see if they have an account
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "http://www.closeyourtabs.com/auth/google/verify", true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == "200") {
      var result = JSON.parse(xhr.responseText);
      setLocalStorage('googleID', result.googleID);
      return result; 
    } 
  }
  xhr.send()
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
  user.allTabs[tab.id] = tabObject; 

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
      createNewTabRequest(dataForServer, tab.id);
    })
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
  var allTabs = user.allTabs; 
  for(var tab in allTabs){
    if(!allTabs[tab].highlighted){
      allTabs[tab].inactiveTimeElapsed = currentTime - allTabs[tab].timeOfDeactivation;
    }
  }
}


/**
* Updates a Tab object
*@param {object} 
*/

function updateTabInformation(tab, timeStamp, updateInfo){
  //if the site changed, get the elapsed time during active state and save to its url
  user.allTabs[tab.id] = {
    id: tab.id,
    windowId: tab.windowId,
    favicon: tab.favIconUrl,
    title: tab.title,
    url: tab.url,
    index: tab.index, 
    screenshot: '',
    highlighted: tab.highlighted
  }

  if(updateInfo){
    var dataForServer = {
      databaseTabID: tab.googleTabId, 
      tabTitle: tab.title, 
      browserTabIndex: tab.index, 
      url: tab.url,
      favicon: tab.favicon,
    } 
    // serverRequest('PUT', 'http://www.closeyourtabs.com/tabs/', dataForServer);
  } 
}


/**
* Remove Tab object from object and move to closedTabs object
*@param {id} 
*/
chrome.tabs.onRemoved.addListener(function (id, removeInfo){
  //TODO: DELETE from local storage 
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


function setActiveTab(uniqueID, previousId, currentTabID,timeStamp){
  var allTabs = user.allTabs; 
  if(allTabs[previousId]){
      allTabs[previousId].highlighted = false;  
      allTabs[previousId].timeOfDeactivation = timeStamp;  
      allTabs[previousId].activeTimeElapsed = timeStamp - allTabs[previousId].timeOfActivation;
      allTabs[previousId].inactiveTimeElapsed = 0;
  }
  setLocalStorage('activeTab', currentTabID);
  if(user.loggedIn){
    var tabObject = {};
    tabObject['databaseTabID'] = uniqueID;
    serverRequest('PUT', 'http://www.closeyourtabs.com/tabs/activatedTime', tabObject);
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
      setLocalStorage('activeTab', tab.id);
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
    console.log('tab update')
    var window  = JSON.stringify(tab.windowId);
    var stringId = JSON.stringify(tab.id);
    var date = new Date()
    var timeStamp = date.getTime();

    chrome.storage.local.get(window, function(item){
      if (item[window][stringId] || user.allTabs[tab.id]) {
        var googleIdDb = item[window][stringId];
        tab.googleTabId = googleIdDb;
        updateTabInformation(tab, timeStamp, true);
      } else {
        console.log("New Tab");
      }
    })
     
      //get back database tab id associated with the google tab id
      //save into local storage as window id: {tabid: googletabID} 
  }
})


function updateTab(tab){
  var window  = JSON.stringify(tab.windowId);
  var stringId = JSON.stringify(tab.id);
  var date = new Date()
  var timeStamp = date.getTime();

  chrome.storage.local.get(window, function(item){
    if (typeof item.links === 'undefined') {
      console.log("New Tab");
    } else {
      var googleIdDb = item[window][stringId];
      tab.googleTabId = googleIdDb;
      updateTabInformation(tab, timeStamp, true);
    }
  })
     
      //get back database tab id associated with the google tab id
      //save into local storage as window id: {tabid: googletabID} 
}


/**
* Listens for when a tab becomes active by user clicking on the tab
*@param {object} activeInfo includes props about the tab clicked
*call setTime, createNewTab
*/
chrome.tabs.onHighlighted.addListener(function(hightlightInfo){
  chrome.tabs.get(hightlightInfo.tabIds[0], function(tab){
    if(user.loggedIn){

    } else {

    }
    var window  = JSON.stringify(tab.windowId);
    var stringId = JSON.stringify(tab.id);

    chrome.storage.local.get(window, function(item){

      chrome.storage.local.get('activeTab', function(currentID){
        var previousTab = currentID.activeTab;
        var previousHighlightedGoogleID = item[window][previousTab.toString()];
        var time = new Date();
        var timeStamp = time.getTime();
        if (item[window][stringId] >= 0) {
          var currentDBTab = item[window][stringId];
          updateTabInformation(tab, timeStamp, false);

        } else {
          createNewTab(tab, timeStamp);
        }
        var currentActiveHighlight = item[window][stringId];
        setActiveTab(currentDBTab, previousTab,  tab.id, timeStamp);

        if(user.loggedIn){
          chrome.storage.local.get('googleID', function (id){
            var userGoogleID = id['googleID'];
            if(userGoogleID){
              var tabObject = {};
              tabObject['databaseTabID'] = previousHighlightedGoogleID;
              tabObject['googleID'] = userGoogleID
              serverRequest('PUT', 'http://www.closeyourtabs.com/tabs/deactivatedTime', tabObject)
            }
          })
        }
      })   
    })
  });
})


/**
* Listens to for when a tab moves in a window
*/
chrome.tabs.onMoved.addListener(function(tabId, moveInfo){
  //update the database with all new indexes
  //call get all tabs, to get all the new
  console.log(moveInfo)
})

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
    })
  })
  getAllTabs();
  user = new User();
  chrome.storage.local.get('googleID', function(result){
    if(result.googleID){
      user.login();
    } 
  })
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
      responseObject.allTabs = user.allTabs; 
      port.postMessage({sessionInfo: responseObject})
    } else if(message.type = 'login'){
      chrome.storage.local.get('googleID', function(result){
        if(result.googleID){
          user.login();
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
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://www.closeyourtabs.com/tabs/');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 & xhr.status === 200) {
        console.log(xhr.responseText);
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
          setLocalStorage('activeTab', tabId);
        })
      }
  };
  xhr.send(JSON.stringify(tabObject));
}


