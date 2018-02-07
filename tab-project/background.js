// get local storage
// var previousTabs = chrome.storage.local.get(null, function(items){
//set local storage
// chrome.storage.local.set(obj);

var allTabs = {};
var closedTabs = {};

/**
* Update Time of all the tabs
*/


/**
* Updates a Tab object
*@param {object} 
*/
function updateTab(tab){
  allTabs[tab.id] = {...tab}
}

/**
* Creates a Tab object
*@param {object} 
*/
function createNewTab(tab){
  allTabs[tab.id] = tab; 
}


/**
* Remove Tab object from object and move to closedTabs object
*@param {id} 
*/
chrome.tabs.onRemoved.addListener(function (id){
  closedTabs[id] = allTabs[id]
  delete allTabs[id];
})


/**
* Listens for when a tab becomes active by user clicking on the tab
*@param {id}
*call setTime 
*/
chrome.tabs.onActivated.addListener(function(activeInfo) {
  // how to fetch tab url using activeInfo.tabid
  chrome.tabs.get(activeInfo.tabId, function(tab){
     if(allTabs[tab.id]){
       console.log('set time');
       //reset time for this id
     } else {
      console.log('new tab')
       createNewTab(tab);
        //start time for this id
     }
  });
}); 

/**
* Gets all tabs on window start up
*@param {sender} 
*@param {request} 
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
*@param {integer} tabId
*@param {object} changed info
*@param {object} tab object
*/
chrome.tabs.onUpdated.addListener(function(tab, changeInfo, tab){
  if (tab.url !== undefined && changeInfo.status == "complete") {
    updateTab(tab);
  }
})


/**
* Runs function when first browser loads
*/
chrome.runtime.onStartup.addListener(function(){
  console.log('start up')
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
