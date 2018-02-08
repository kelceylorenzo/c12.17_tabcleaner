var allTabs = {};
var closedTabs = {};
var currentActiveTabId = null; 
var siteUsageTime = {}

/**
* Updates a Tab object
*@param {object} 
*/
function updateTab(tab, timeStamp){
  //if the site changed, get the elapsed time during active state and save to its url
  //set new activetime stamp for new site 
  allTabs[tab.id] = {...tab}
}

/**
* Creates a Tab object, sets timestamp for initial open
*@param {object} 
*/
function createNewTab(tab, currentTime){
  tab.timeOfSiteOpen = currentTime;
  if(tab.active){
    tab.timeOfActivation = currentTime;
  } else {
    tab.timeOfActivation = null;
  }
  allTabs[tab.id] = tab; 
}


/**
* Remove Tab object from object and move to closedTabs object
*@param {id} 
*/
chrome.tabs.onRemoved.addListener(function (id){
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
  var timeStamp = new Date();
  //start time for most recent active tab

  //set newMostActivatedTab
  chrome.tabs.get(activeInfo.tabId, function(tab){
    if(currentActiveTabId){
      allTabs[currentActiveTabId].active = false;  
    }
     if(allTabs[tab.id]){
       var timeOfActivation = timeStamp;
       updateTab(tab, timeStamp);
       //find out how much time has passed that previous active tab was active and save to siteusagetime
       //get the accumulated time and save to url
       //reset timeSinceActive to current time 
       //change the current active tab 
       //set the most recent active tab to start timer for being inactive
     } else {
      createNewTab(tab, timeStamp);
     }
     currentActiveTabId = tab.id; 
  });
}); 

/**
* Gets all tabs currently in the browser
*calls createNewTab
*/
function getAllTabs(){
  chrome.tabs.query({}, function(tabs) {
    tabs.forEach(function(tab){
      createNewTab(tab);
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
    var timeStamp = new Date();
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
* Runs function when first installed
*@param {string}
*@param {object}
*@param {object}
* sends response back to the caller
*/
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request === 'popup'){
      sendResponse(allTabs);
    } 
  });
