// let tabs = {};
//
// chrome.tabs.query({}, function(tabs) {
//   tabs.forEach(function(tab){
//     setEventListener(tab);
//   })
// })
//
// function setEventListener(tab){
//   let id = tab.id;
//   if(tabs[tab.id]){
//     console.log('same id')
//     let currentDateTime = new Date().now;
//     tab.time = currentDateTime - tab.time;
//   } else {
//     tabs[tab.id] = tab
//     tab.time = 0;
//   }
//   $('.tab-container').text(tab.id);
// }
