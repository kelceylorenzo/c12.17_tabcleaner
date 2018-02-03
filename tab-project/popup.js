let tabs = {};

var previousTabs = chrome.storage.local.get(null, function(items){
  for(var item in items){
    console.log(item);
  }
})

chrome.tabs.query({}, function(tabs) {
  tabs.forEach(function(tab){
    setEventListener(tab);
  })
})

function setEventListener(tab){

  var tabEl = document.createElement('p');
  var addText = document.createTextNode(tab.discarded);
  tabEl.append(addText);
  document.body.appendChild(tabEl);
  setStorage(tab.title, tab );
}

function setStorage(title, object){
  console.log(title)
  chrome.storage.local.set({title : object})
}



