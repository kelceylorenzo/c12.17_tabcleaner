var allTabs = {};
var closedTabs = {};
var currentHighlightTabId = null; 
var siteUsageTime = {}

/**
*Periodically checks elapsed deactivate time and updates the elapsed deactivated time
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
    sessionId: tab.sessionId,
    favicon: tab.favIconUrl,
    title: tab.title,
    url: tab.url,
    index: tab.index, 
    timeOfSiteOpen: allTabs[tab.id].timeOfSiteOpen,
    screenshot: '',
    highlighted: tab.highlighted,
    activeTimeElapsed: allTabs[tab.id].activeTimeElapsed, 
    inactiveTimeElapsed: allTabs[tab.id].inactiveTimeElapsed,
    timeOfActivation:  0,
    timeOfDeactivation: 0
    }

    if(tab.highlighted){
      allTabs[tab.id].timeOfActivation = timeStamp
    }  
}

/**
* Creates a Tab object, sets timestamp for initial open
*@param {object} 
*/
function createNewTab(tab, currentTime){
  var tabObject = {
    id: tab.id,
    windowId: tab.windowId,
    sessionId: tab.sessionId,
    favicon: tab.favIconUrl,
    title: tab.title,
    url: tab.url,
    index: tab.index,
    activeTimeElapsed: 0,
    inactiveTimeElapsed: 0,
    timeOfSiteOpen: currentTime,
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
}


/**
* Remove Tab object from object and move to closedTabs object
*@param {id} 
*/
chrome.tabs.onRemoved.addListener(function (id){
  if(allTabs[id].highlighted){
    currentHighlightTabId = null; 
  }
  //get current time
  //get elapsed time for active 
  //save to site usage time 
  closedTabs[id] = allTabs[id]
  delete allTabs[id];
})


/**
* Listens for when a tab becomes active by user clicking on the tab
*@param {object} activeInfo includes props about the tab clicked
*call setTime, createNewTab
*/
chrome.tabs.onActivated.addListener(function(activeInfo) {
  console.log('active changed: ', activeInfo)
  if(currentHighlightTabId === activeInfo.id ){
    console.log('higlighted tab become inactive')
  }
})

chrome.tabs.onHighlighted.addListener(function(hightlightInfo){
  var time = new Date();
  var timeStamp = time.getTime();
  //start time for most recent active tab
  //set newMostActivatedTab
  chrome.tabs.get(hightlightInfo.tabIds[0], function(tab){
    if(currentHighlightTabId){
      var previousHighlighted = allTabs[currentHighlightTabId]; 
      previousHighlighted.highlighted = false;  
      previousHighlighted.timeOfDeactivation = timeStamp;  
      previousHighlighted.activeTimeElapsed = timeStamp - previousHighlighted.timeOfActivation;
      previousHighlighted.inactiveTimeElapsed = 0;
    var domain = (previousHighlighted.url).match(/([a-z0-9|-]+\.)*[a-z0-9|-]+\.[a-z]+/g) || (previousHighlighted.url).match(/^(chrome:)[//]{2}[a-zA-Z0-0]*/);
      if(siteUsageTime[domain[0]]){
        siteUsageTime[domain[0]] += previousHighlighted.activeTimeElapsed;
      } else {
        siteUsageTime[domain[0]] = previousHighlighted.activeTimeElapsed;
      }
    }
    if(allTabs[tab.id]){
      updateTab(tab, timeStamp);
    } else {
      createNewTab(tab, timeStamp);
    }
      currentHighlightTabId = tab.id; 
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
    updateTab(tab, timeStamp);
  }
})


/**
* Runs function when first browser loads
*@param {object}
*calls getAllTabs
*/
chrome.runtime.onStartup.addListener(function(details){
  console.log('browser open')
  getAllTabs();
})

/**
* Runs function when first installed
*@param {object}
*calls getAllTabs
*/
chrome.runtime.onInstalled.addListener(function(details){
  console.log('installed')
  getAllTabs();
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
    updatedElaspedDeactivation();
    if(request === 'popup'){
      sendResponse(allTabs);
    } 
  });
