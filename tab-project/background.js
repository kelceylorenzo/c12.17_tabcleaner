// get local storage
// var previousTabs = chrome.storage.local.get(null, function(items){
//set local storage
// chrome.storage.local.set(obj);

var allTabs = {};

function updateTabs(){
  chrome.tabs.query({}, function(tabs) {
    tabs.forEach(function(tab){
      var id = tab.id; 
      var time = Date.now();
      if(allTabs[id]){
        allTabs[id].timeElapsed = time - allTabs[id].time;
      }else {
        tab.time = time; 
        tab.timeElapsed = 0; 
        allTabs[id] = tab;
      }
    })
  })
}

chrome.tabs.onRemoved.addListener(function (id){
  delete allTabs[id];
})

chrome.tabs.onCreated.addListener(function (id){
  updateTabs();
})


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request === 'popup'){
      sendResponse(allTabs);
    } else if(request === 'tab'){
      updateTabs();
    }
  });

  chrome.windows.onCreated.addListener(function(window){
    updateTabs();
  });