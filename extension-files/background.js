var allTabs = {};
var closedTabs = {};
var currentHighlightTabId = null; 
var siteUsageTime = {}



/**
*Periodically checks elapsed deactivate time and updates the elapsed deactivated time
* 
*/
function updatedElaspedDeactivation(){
  var date = new Date()
  var currentTime = date.getTime();
  for(var tab in allTabs){
    if(!allTabs[tab].highlighted){
      allTabs[tab].inactiveTimeElapsed = currentTime - allTabs[tab].timeOfDeactivation;
    }
    console.log(allTabs[tab])
  }
}

/**
* Updates a Tab object
*@param {object} 
*/
function updateTab(tab, timeStamp){
  //if the site changed, get the elapsed time during active state and save to its url
  //set new activetime stamp for new site 
  if(tab.highlighted){
    tab.timeOfActivation = timeStamp;
  }
  allTabs[tab.id] = {
    id: tab.id,
    windowId: tab.windowId,
    sessionId: tab.sessionId,
    favicon: tab.favIconUrl,
    title: tab.title,
    url: tab.url,
    index: tab.index,
    activeTimeElapsed: 0,
    inactiveTimeElapsed: null,
    timeOfDeactivation : null,
    screenShotUrl: '',
    highlighted: tab.highlighted
  }
  console.log(allTabs[tab.id].favicon)

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
    screenShotUrl: '',
    highlighted: tab.highlighted
  }
  if(tabObject.highlighted){
    tabObject.timeOfActivation = currentTime;
    tabObject.timeOfDeactivation = null;  
  } else {
    tabObject.timeOfActivation = null;
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
  if(currentHighlightTabId === activeInfo.id ){
    console.log('higlighted tab become in active')
  }
  // var timeStamp = new Date();
  // //start time for most recent active tab

  // //set newMostActivatedTab
  // chrome.tabs.get(activeInfo.tabId, function(tab){
  //   if(currentHighlightTabId){
  //     allTabs[currentActiveTabId].highlighted = false;  
  //     allTabs[currentActiveTabId].timeOfDeactivation = timeStamp;  
  //     allTabs[currentActiveTabId].inactiveTimeElapsed = timeStamp - allTabs[currentActiveTabId].timeOfActivation;
  //   }
  //   if(allTabs[tab.id]){
  //     updateTab(tab, timeStamp);
  //     //find out how much time has passed that previous active tab was active and save to siteusagetime
  //     //get the accumulated time and save to url
  //     //reset timeSinceActive to current time 
  //     //change the current active tab 
  //     //set the most recent active tab to start timer for being inactive
  //   } else {
  //   createNewTab(tab, timeStamp);
  //   }
  //     currentActiveTabId = tab.id; 
  // }); 
})



chrome.tabs.onHighlighted.addListener(function(hightlightInfo){



  var timeStamp = new Date();
  //start time for most recent active tab
  //set newMostActivatedTab
  chrome.tabs.get(hightlightInfo.tabIds[0], function(tab){
    if(currentHighlightTabId){
      allTabs[currentHighlightTabId].highlighted = false;  
      allTabs[currentHighlightTabId].timeOfDeactivation = timeStamp;  
      allTabs[currentHighlightTabId].inactiveTimeElapsed = timeStamp - allTabs[currentHighlightTabId].timeOfActivation;
    }
    if(allTabs[tab.id]){
      updateTab(tab, timeStamp);
      //find out how much time has passed that previous active tab was active and save to siteusagetime
      //get the accumulated time and save to url
      //reset timeSinceActive to current time 
      //change the current active tab 
      //set the most recent active tab to start timer for being inactive
    } else {
    createNewTab(tab, timeStamp);
    }
      currentHighlightTabId = tab.id; 
  });
})



function sendXMLRequest(){
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(){
    if (xhr.readyState == 4 && xhr.status == 200) {
      //Request was successful
      var response = xhr.responseText;
      console.log(response)
     }
  }; // Implemented elsewhere.
  xhr.open("GET", chrome.extension.getURL('/data.js'), true);
  xhr.send();
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
    var date = new Date()
    var timeStamp = date.getTime();
    console.log(tab.favIconUrl)
    updateTab(tab, timeStamp);
  }
})


/**
* Runs function when first browser loads
*/
chrome.runtime.onStartup.addListener(function(){
  console.log('browser open')
  getAllTabs();
})

/**
* Runs function when first installed
*@param {object}
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
    sendXMLRequest();
    updatedElaspedDeactivation();
    if(request === 'popup'){
      sendResponse(allTabs);
    } 
  });
