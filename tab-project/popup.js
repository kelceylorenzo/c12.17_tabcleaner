chrome.runtime.sendMessage(
    "content script to background.js ",
    function (response) {
        response.forEach(function(tabInfo){
          var tabEl = document.createElement('p');
          tabEl.className = "id" + tabInfo.id;
          var addText = document.createTextNode(tabInfo.title);
          tabEl.append(addText);
          tabEl.addEventListener('click', clickEvent.bind(this, tabInfo.id))
          document.body.appendChild(tabEl);
        })
    }
);

function clickEvent(id, event) {
  chrome.tabs.remove(id);
  var elem = document.querySelector('.id' + id);
  elem.parentNode.removeChild(elem);
}
