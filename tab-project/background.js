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


chrome.tabs.onUpdated.addListener(function(tabid) {
  //sender returns an object with id, url,
 //request is the message send
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      updateTabs();
      if(request === 'tab'){
          sendResponse(allTabs);
        } else if( request === 'popup'){
          sendResponse(allTabs);
        }
    }
  );
});

chrome.tabs.onCreated.addListener((function(tabid) {
  //sender returns an object with id, url,
 //request is the message send
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      updateTabs();
      if(request === 'tab'){
          sendResponse(allTabs);
        } else if( request === 'popup'){
          sendResponse(allTabs);
        }
    }
  )
}))

