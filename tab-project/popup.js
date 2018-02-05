chrome.runtime.sendMessage(
    "popup",
    function (response) {
      for(var item in response){
        var tabInfo = response[item];
        var tabEl = document.createElement('LI');
        tabEl.className = "id" + tabInfo.id;
        var addText = document.createTextNode(tabInfo.title);
        tabEl.append(addText);
        tabEl.addEventListener('click', clickEvent.bind(this, tabInfo.id))
        document.getElementById('tag-titles').appendChild(tabEl);
      }
    }
);

function clickEvent(id, event) {
  chrome.tabs.remove(id);
  var elem = document.querySelector('.id' + id);
  elem.parentNode.removeChild(elem);
}
