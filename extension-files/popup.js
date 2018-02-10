var lengthOfString = 40; 

chrome.runtime.sendMessage(
  "popup",
  function (response) {
    for(var item in response){
      var tabInfo = response[item];
      var tabElement = createDomElement(tabInfo); 
      document.getElementById('tag-titles').appendChild(tabElement);
    }
  }
);

function refreshContent(){
  document.getElementById('tag-titles').innerHTML = "";
  chrome.runtime.sendMessage(
    "popup",
    function (response) {
      for(var item in response){
        var tabInfo = response[item];
        var tabElement = createDomElement(tabInfo); 
        document.getElementById('tag-titles').appendChild(tabElement);
      }
    }
  );
}


function createDomElement(tabObject){
  console.log(tabObject.favicon)

  if(!tabObject.title){
    return; 
  }
  if(tabObject.highlighted){
    tabObject.color = 'green activetab';
  } else if (tabObject.inactiveTimeElapsed < 10000) {
    tabObject.color = 'green';
  } else if (tabObject.inactiveTimeElapsed < 25000) {
    tabObject.color = 'orange';
  } else {
    tabObject.color = 'red';
  }
  var tabEl = document.createElement('LI');
  var trashcan = document.createElement('i');
  var favicon = document.createElement('span');
  var faviconImage = document.createElement('img');
  faviconImage.src = tabObject.favicon || 'iconpurple.png';
  favicon.appendChild(faviconImage);
  trashcan.className = "far fa-trash-alt";
  var addText = document.createTextNode((tabObject.title).substring(0, lengthOfString));
  tabEl.className = "id" + tabObject.id + " " + tabObject.color;
  tabEl.appendChild(favicon)
  tabEl.append(addText);
  trashcan.addEventListener('click', clickEvent.bind(this, tabObject.id));
  tabEl.addEventListener('click', highlightTab.bind(this, tabObject.index))
  tabEl.appendChild(trashcan);
  return tabEl;
}

function clickEvent(id, event) {
  chrome.tabs.remove(id);
  var elem = document.querySelector('.id' + id);
  elem.parentNode.removeChild(elem);
}


function highlightTab(index, event){
  chrome.tabs.highlight({'tabs': index})
}

document.getElementById('refresh').addEventListener('click', refreshContent);