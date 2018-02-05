//gets info of current tab that was updated
// chrome.tabs.onUpdated.addListener(function(tabid) {
//     console.log(tabid + ': tab updated or created')
//   });


chrome.runtime.sendMessage("tab");

// chrome.tabs.onUpdated.addListener(function(tabid) {
//     //sender returns an object with id, url,
//    //request is the message send
//     // chrome.runtime.onMessage.addListener(
//     //   function(request, sender, sendResponse) {
//     //     updateTabs();
//     //     sendResponse(allTabs);
//     //   }
//     // );
//     // updateTabs()
//     console.log('tab updated')
//   });

//   chrome.runtime.sendMessage('hello', function(response) {
//     console.log(response);
//   });
