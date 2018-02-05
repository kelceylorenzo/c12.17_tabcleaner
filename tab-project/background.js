// get local storage
// var previousTabs = chrome.storage.local.get(null, function(items){
//set local storage
//   // chrome.storage.local.set(obj);

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


chrome.tabs.onUpdated.addListener((function(tabid) {
  updateTabs();
}))

chrome.tabs.onCreated.addListener((function(tabid) {
  updateTabs();
}))

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request === 'popup'){
      console.log('clicked popup')
      sendResponse(allTabs);
    }

  });