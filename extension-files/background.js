var allTabs = {};
var siteUsageTime = {}

/**
*Get user id from data base using XML HTTP Request
* calls setLocalStorage
*/
function getUserInfoRequest(){
  //get call to database and save ID into local storage
  setLocalStorage('googleID', 101760331504672280672);
  // var xhr = new XMLHttpRequest();
  // xhr.open("GET", "http://www.closeyourtabs.com/auth/google/verify", true);
  // xhr.onreadystatechange = function() {
  //   if (xhr.readyState == 4 && xhr.status == "200") {
  //     // var userObject = xhr.responseText
  //     var result = JSON.parse(xhr.responseText);
  //     setLocalStorage('userId', result.googleID);
  //     console.log(result)
  //   } 
  // }
  // xhr.send()
}

/**
*Check if user has an account 
* calls setLocalStorage
*/
function checkForUserAccount(){
  chrome.storage.local.get('googleID', function(item){
    if(item.userId){
      console.log('user has an account');
    } else {
      // getUserInfoRequest();
      console.log('create user, save googleID');
    }
    console.log('user id: ' + item.userId)
  })
}



/**
* Creates a Tab object, sets timestamp for initial open
*@param {object} 
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
  allTabs[tab.id] = tabObject; 

  var dataForServer = {
    windowID: tab.windowId,
    tabTitle: tab.title,
    activatedTime: 0, 
    deactivatedTime: 0, 
    googleTabIndex: tab.index, 
    googleID: 101760331504672280672, 
    url: tab.url,
    favicon: tab.favIconUrl
  }
  createNewTabRequest(dataForServer, tab.id);
  //get back database tab id associated with the google tab id
  //save into local storage as window id: {tabid: googletabID} 
}


/**
*Sets key value pair in local storage
*@param {string} keyName
*@param {any value} value
*/
// function setLocalStorage(keyName, value){
//   chrome.storage.local.set({keyName : value})
// }

/**
*Checks elapsed deactivate time and updates the elapsed deactivated time
* 
*/
function updatedElaspedDeactivation(){
  var date = new Date();
  var currentTime = date.getTime();
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
function updateTab(tab, timeStamp){
  //if the site changed, get the elapsed time during active state and save to its url
  allTabs[tab.id] = {
    id: tab.id,
    windowId: tab.windowId,
    favicon: tab.favIconUrl,
    title: tab.title,
    url: tab.url,
    index: tab.index, 
    screenshot: '',
    highlighted: tab.highlighted
  }

  return allTabs[tab.id]
}


/**
* Remove Tab object from object and move to closedTabs object
*@param {id} 
*/
chrome.tabs.onRemoved.addListener(function (id){
  console.log('tab removed')
  if(allTabs[id].highlighted){
      chrome.storage.local.set({'activeTab' : null})
  }
  delete allTabs[id];
})


/**
* Listens for when a tab becomes active by user clicking on the tab
*@param {object} activeInfo includes props about the tab clicked
*call setTime, createNewTab
*/
chrome.tabs.onHighlighted.addListener(function(hightlightInfo){
  var time = new Date();
  var timeStamp = time.getTime();
  
  //call server to give info about previous tab and new tab highlight
  chrome.tabs.get(hightlightInfo.tabIds[0], function(tab){
    chrome.storage.local.get('activeTab', function(item){
      var previousId = item.activeTab; 
      var newTab = null; 
      if(previousId){
          allTabs[previousId].highlighted = false;  
          allTabs[previousId].timeOfDeactivation = timeStamp;  
          allTabs[previousId].activeTimeElapsed = timeStamp - allTabs[previousId].timeOfActivation;
          allTabs[previousId].inactiveTimeElapsed = 0;
      }
      if(allTabs[tab.id]){
        updateTab(tab, timeStamp);

      } else {
        createNewTab(tab, timeStamp);
      }
      chrome.storage.local.set({'activeTab' : tab.id})
    
    })
  });
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
    var date = new Date()
    var timeStamp = date.getTime();
    var window  = JSON.stringify(tab.windowId);
    chrome.storage.local.get(window, function(item){
      var stringId = JSON.stringify(tabId);
      var googleIdDb = item[window][stringId];
      var updatedTab = updateTab(tab, timeStamp);
      var dataForServer = {
        databaseTabID: googleIdDb, 
        tabTitle: updatedTab.title, 
        googleTabIndex: updatedTab.index, 
        url: updatedTab.url,
        favicon: updatedTab.favIconUrl,
      }
      updateTabRequest(dataForServer);
    })
     
      //get back database tab id associated with the google tab id
      //save into local storage as window id: {tabid: googletabID} 
  }
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
*@param {object}
*calls getAllTabs
*/
chrome.runtime.onStartup.addListener(function(details){
  console.log('browser open')
  getAllTabs();
  checkForUserAccount();

})

/**
* Runs function when first installed
*@param {object}
*calls getAllTabs
*/
chrome.runtime.onInstalled.addListener(function(details){
  console.log('installed')
  getAllTabs();
  checkForUserAccount();
  chrome.storage.local.set({'userId' : null})
  chrome.storage.local.set({'activeTab' : null})

})

/**
* Runs function when receive a message
*@param {string}
*@param {object}
*@param {object}
* sends response back to the caller
*/
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // getAllDataFromServer()
    updatedElaspedDeactivation();
    if(request === 'popup'){
      sendResponse(allTabs);
    } 
  });

/**
* XMLHTTPRequest to server
*@param {string} method types of request, ex. get, post, etc
*@param {string} action the target route on the server
*@param {object} data the data that will be sent 
*/

// function serverRequest(method, action, data=null){
//   var xhr = new XMLHttpRequest();
//   xhr.open(method, "http://localhost:9000/" + action, true);
//   if(method === 'POST'){
//     data = JSON.stringify(data);
//     http.setRequestHeader('Content-type','application/json; charset=utf-8');
//   }
//   xhr.onreadystatechange = function() {
//     if (xhr.readyState == 4 && xhr.status == "200") {
//       // JSON.parse does not evaluate the attacker's scripts.
//       var resp = JSON.parse(xhr.responseText);
//     } else {
//       console.error(message)
//     }
//   }
//   xhr.send(data);
// }
function updateTabRequest(tabObject){
  var xhr = new XMLHttpRequest();
  xhr.open('PUT', 'http://www.closeyourtabs.com/tabs/');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 & xhr.status === 200) {
        console.log(xhr.responseText)
      }
    }
  xhr.send(JSON.stringify(tabObject))
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
            object[window] = addNewTabItem; 
            chrome.storage.local.set(object);
          }else {
            chrome.storage.local.set(object);
          }
        })

      }
  };
  xhr.send(JSON.stringify(tabObject));
}