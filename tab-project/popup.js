chrome.runtime.sendMessage(
    "popup",
    function (response) {
      var index = 0 
      for(var item in response){
        var tabInfo = response[item];
        var tabEl = document.createElement('LI');
        var span = document.createElement('span');
        var addSpanText = document.createTextNode(" | DELETE");
        var addText = document.createTextNode(tabInfo.title);
        tabEl.className = "id" + tabInfo.id;
        span.append(addSpanText);
        tabEl.append(addText);
        span.addEventListener('click', clickEvent.bind(this, tabInfo.id));
        tabEl.addEventListener('click', highlightTab.bind(this, index))
        tabEl.appendChild(span);
        document.getElementById('tag-titles').appendChild(tabEl);
        index++
      }
    }
);

function clickEvent(id, event) {
  chrome.tabs.remove(id);
  var elem = document.querySelector('.id' + id);
  elem.parentNode.removeChild(elem);
}


function highlightTab(index, event){
  chrome.tabs.highlight({'tabs': index})
}