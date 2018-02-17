//functions to write
//when close window, remove from database AND local storage
//
setLocalStorage('googleID', 101760331504672280672);


var allTabs = {};
var siteUsageTime = {}

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
      // var userObject = xhr.responseText
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
  allTabs[tab.id] = tabObject; 

  var dataForServer = {
    windowID: tab.windowId,
    tabTitle: tab.title,
    activatedTime: 0, 
    deactivatedTime: 0, 
    browserTabIndex: tab.index, 
    googleID: 101760331504672280672, 
    url: tab.url,
    favicon: tab.favIconUrl
  }
  //checks to see if user state is logged in to make call to server 
  createNewTabRequest(dataForServer, tab.id);
  //get back database tab id associated with the google tab id
  //save into local storage as window id: {tabid: googletabID} 
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

  if(updateInfo){
    var dataForServer = {
      databaseTabID: tab.googleTabId, 
      tabTitle: tab.title, 
      browserTabIndex: tab.index, 
      url: tab.url,
      favicon: tab.favicon,
    }
    console.log('tab is updated')
    updateTabRequest(dataForServer);
  } else {
    console.log('tab is highlighted')

    //tab is highlighed for the first time 
  }


}


/**
* Remove Tab object from object and move to closedTabs object
*@param {id} 
*/
chrome.tabs.onRemoved.addListener(function (id, removeInfo){
  console.log('tab removed')
  if(allTabs[id].highlighted){
    setLocalStorage('activeTab', null)
  }

  //DELETE from local storage 
  var window  = JSON.stringify(removeInfo.windowId);
  // chrome.storage.local.get(window, function(item){
  //   var stringId = JSON.stringify(id);
  //   var googleIdDb = item[window][stringId];
  //   // deleteTabFromDatabase(googleIdDb);
  //   console.log(googleIdDb)

  // })
  delete allTabs[id];
})


/**
* Listens for when a tab becomes active by user clicking on the tab
*@param {object} activeInfo includes props about the tab clicked
*call setTime, createNewTab
*/
chrome.tabs.onHighlighted.addListener(function(hightlightInfo){
  //call server to give info about previous tab and new tab highlight
  chrome.tabs.get(hightlightInfo.tabIds[0], function(tab){
    //check to see if the id is in local storage. if not, create new tab. 
    var window  = JSON.stringify(tab.windowId);
    var stringId = JSON.stringify(tab.id);
    chrome.storage.local.get(window, function(item){
      chrome.storage.local.get('activeTab', function(currentID){
        var previousHighlighted = currentID.activeTab
        var time = new Date();
        var timeStamp = time.getTime();
        if (item[window][stringId] >= 0) {
          var currentTab = item[window][stringId];
          //send database the id of previous active tab and new active tab
          updateTabInformation(tab, timeStamp, false);

        } else {
          createNewTab(tab, timeStamp);
          //SET AS HIGHLIHGTED
        }

        var previousDBTabId = item[window][stringId];
        setActiveTab(previousHighlighted, tab.id, timeStamp)
         //call deactivated using previoushighligheted ; 
          //call activate with currentTab
      })
    
    })


//     var domain = (previousHighlighted.url).match(/([a-z0-9|-]+\.)*[a-z0-9|-]+\.[a-z]+/g) || (previousHighlighted.url).match(/^(chrome:)[//]{2}[a-zA-Z0-0]*/);
//       if(siteUsageTime[domain[0]]){
//         siteUsageTime[domain[0]] += previousHighlighted.activeTimeElapsed;
//       } else {
//         siteUsageTime[domain[0]] = previousHighlighted.activeTimeElapsed;
//       }
//     }

  });
})

function setActiveTab(previousHighlighted, newlyHighlighted, timeStamp){
  chrome.storage.local.get('activeTab', function(item){
    var previousId = item.activeTab; 
    var newTab = null; 
    if(previousId){
        allTabs[previousId].highlighted = false;  
        allTabs[previousId].timeOfDeactivation = timeStamp;  
        allTabs[previousId].activeTimeElapsed = timeStamp - allTabs[previousId].timeOfActivation;
        allTabs[previousId].inactiveTimeElapsed = 0;
    }
    setLocalStorage('activeTab', newlyHighlighted)
    // updateNewHighlightedTab(previousHighlighted, newlyHighlighted)
  })
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
  // getAllTabs();
  // checkForUserAccount();

})

/**
* Runs function when first installed
*@param {object}
*calls getAllTabs
*/
chrome.runtime.onInstalled.addListener(function(details){
  console.log('installed')
  getAllTabs();
  // setLocalStorage('googleID', null);
  setLocalStorage('activeTab', null);
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
    } else if (request === 'login'){
      chrome.storage.local.get('googleID', function(item){
        if(item.userId){
          //set state to logged in 
          console.log('user has an account');
          return true; 
        } else {
          console.log('user needs to sign in');
          // return sendResponse(checkForUserAccount());
        }
      })
    // } else if(request=== 'update'){
    //   var date = new Date()
    //   var timeStamp = date.getTime();
    //   console.log('update from a message');
    //   updateTabInformation(sender.tab, timeStamp, true);
    //   sendResponse('tab updated from sender ', sender);

    }
  });








// SERVER REQUESTS


/**
* XMLHTTPRequest to server
*@param {string} method types of request, ex. get, post, etc
*@param {string} action the target route on the server
*@param {object} data the data that will be sent 
*/

function updateNewHighlightedTab(previousId, currentId){
  var object = {};
  object['previousID'] = previousId;
  object['currentID'] = currentId; 
  var xhr = new XMLHttpRequest();
  xhr.open('PUT', 'http://www.closeyourtabs.com/tabs/');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 & xhr.status === 200) {
        console.log(xhr.responseText)
      }
    }
  xhr.send(JSON.stringify(object))
}


function updateTabRequest(tabObject){
  console.log(tabObject)
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

function deleteTabFromDatabase(tabId){
  var xhr = new XMLHttpRequest();
  xhr.open('DELETE', 'http://www.closeyourtabs.com/tabs/');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 & xhr.status === 200) {
        console.log(xhr.responseText)
      }
    }
  xhr.send(JSON.stringify(tabId))
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

function activateTabInDatabase(){

}


function deactivateTabInDatabase(){
  
}
