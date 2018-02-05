// get local storage
// var previousTabs = chrome.storage.local.get(null, function(items){
//set local storage
// chrome.storage.local.set(obj);

var allTabs = {};

function updateTabs(){
  chrome.tabs.query({}, function(tabs) {
    tabs.forEach(function(tab){
      let id = tab.id; 
      allTabs[id] = tab;
    })
  })
}

chrome.tabs.onRemoved.addListener(function (id){
  delete allTabs[id];
})

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request === 'popup'){
      sendResponse(allTabs);
    } else if(request === 'tab'){
      updateTabs();
    }

  });