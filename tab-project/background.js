// get local storage
// var previousTabs = chrome.storage.local.get(null, function(items){
//set local storage
//   // chrome.storage.local.set(obj);


//gets info of current tab that was updated
chrome.tabs.onUpdated.addListener(function(tabid) {
  console.log('tab updated')
});

function getTabInfo(){
  let allTabs = [];
  chrome.tabs.query({}, function(tabs) {
    tabs.forEach(function(tab){
      allTabs.push(tab);
    })
  })
  return allTabs;
}

var tabs = getTabInfo();

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log("background.js got a message")
        console.log(request);
        console.log(sender);
        updateTabs()
        sendResponse(tabs);
    }
);

function updateTabs(){
  getTabInfo();
}
