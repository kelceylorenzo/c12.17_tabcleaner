//gets info of current tab that was updated
// chrome.tabs.onUpdated.addListener(function(tabid) {
//     console.log(tabid + ': tab updated or created')
//   });


chrome.runtime.sendMessage(
    "tab",
    function (response) {
        console.log('contentscript.js')
        console.log(response)
    }
);