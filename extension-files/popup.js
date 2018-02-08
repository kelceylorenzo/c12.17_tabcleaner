chrome.runtime.sendMessage(
  "popup",
  function (response) {
    for(var item in response){
      var tabInfo = response[item];
      createDomElement(tabInfo); 
    }
  }
);


function createDomElement(tabObject){
  if(!tabObject.title){
    return; 
  }
  if(tabObject.active){
    tabObject.color = 'green activetab';
  } else if (tabObject.totalElapsedDeactivation < 10000) {
    tabObject.color = 'green';
  } else if (tabObject.totalElapsedDeactivation < 25000) {
    tabObject.color = 'blue';
  } else {
    tabObject.color = 'red';
  }
  var tabEl = document.createElement('LI');
  var span = document.createElement('i');
  span.className = "far fa-trash-alt";
  var addText = document.createTextNode(tabObject.title);
  tabEl.className = "id" + tabObject.id + " " + tabObject.color;
  tabEl.append(addText);
  span.addEventListener('click', clickEvent.bind(this, tabObject.id));
  tabEl.addEventListener('click', highlightTab.bind(this, tabObject.index))
  tabEl.appendChild(span);
  document.getElementById('tag-titles').appendChild(tabEl);
}

function clickEvent(id, event) {
  chrome.tabs.remove(id);
  var elem = document.querySelector('.id' + id);
  elem.parentNode.removeChild(elem);
}


function highlightTab(index, event){
  chrome.tabs.highlight({'tabs': index})
}