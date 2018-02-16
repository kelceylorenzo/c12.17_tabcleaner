var allTabs = {};
var siteUsageTime = {}

/**
*Get user id from data base using XML HTTP Request
* calls setLocalStorage
*/
function getUserInfoRequest(){
  //get call to database and save ID into local storage
  setLocalStorage('googleID', 101760331504672280672);
  // var xhr = new XMLHttpRequest();
  // xhr.open("GET", "http://www.closeyourtabs.com/auth/google/verify", true);
  // xhr.onreadystatechange = function() {
  //   if (xhr.readyState == 4 && xhr.status == "200") {
  //     // var userObject = xhr.responseText
  //     var result = JSON.parse(xhr.responseText);
  //     setLocalStorage('userId', result.googleID);
  //     console.log(result)
  //   } 
  // }
  // xhr.send()
}

/**
*Check if user has an account 
* calls setLocalStorage
*/
function checkForUserAccount(){
  chrome.storage.local.get('googleID', function(item){
    if(item.userId){
      console.log('user has an account');
    } else {
      getUserInfoRequest();
      console.log('create user, save googleID');
 
    }
  })
}

/**
*Sets key value pair in local storage
*@param {string} keyName
*@param {any value} value
*/
function setLocalStorage(keyName, value){
  chrome.storage.local.set({keyName : value})
}

/**
*Checks elapsed deactivate time and updates the elapsed deactivated time
* 
*/
function updatedElaspedDeactivation(){
  var date = new Date();
  var currentTime = date.getTime();
  for(var tab in allTabs){
    if(!allTabs[tab].highlighted){
      allTabs[tab].inactiveTimeElapsed = currentTime - allTabs[tab].timeOfDeactivation;
    }
  }
}

/**
* Updates a Tab object
*@param {object} 
*/
function updateTab(tab, timeStamp){
  //if the site changed, get the elapsed time during active state and save to its url
  allTabs[tab.id] = {
    id: tab.id,
    windowId: tab.windowId,
    favicon: tab.favIconUrl,
    title: tab.title,
    url: tab.url,
    index: tab.index, 
    screenshot: '',
    highlighted: tab.highlighted
  }
  return allTabs[tab.id]; 
}

/**
* Creates a Tab object, sets timestamp for initial open
*@param {object} 
*/
function createNewTab(tab, currentTime){
  var tabObject = {
    id: tab.id,
    windowId: tab.windowId,
    favicon: tab.favIconUrl,
    title: tab.title,
    url: tab.url,
    index: tab.index,
    activeTimeElapsed: 0,
    inactiveTimeElapsed: 0,
    screenshot: '', 
    highlighted: tab.highlighted
  }
  if(tabObject.highlighted){
    tabObject.timeOfActivation = currentTime;
    tabObject.timeOfDeactivation = 0;  
  } else {
    tabObject.timeOfActivation = 0;
    tabObject.timeOfDeactivation = currentTime;  
  }
  allTabs[tab.id] = tabObject; 

  var dataForServer = {
    windowId: tab.windowId,
    favicon: tab.favIconUrl,
    title: tab.title,
    url: tab.url,
    index: tab.index,
  }
  createNewTabRequest(allTabs[tab.id]);
  //get back database tab id associated with the google tab id
  //save into local storage as window id: {tabid: googletabID} 
}


/**
* Remove Tab object from object and move to closedTabs object
*@param {id} 
*/
chrome.tabs.onRemoved.addListener(function (id){
  if(allTabs[id].highlighted){
    setLocalStorage('activeTab', null); 
  }
  delete allTabs[id];
})


/**
* Listens for when a tab becomes active by user clicking on the tab
*@param {object} activeInfo includes props about the tab clicked
*call setTime, createNewTab
*/

chrome.tabs.onHighlighted.addListener(function(hightlightInfo){
  var time = new Date();
  var timeStamp = time.getTime();
  
  //start time for most recent active tab
  //set newMostActivatedTab
  chrome.tabs.get(hightlightInfo.tabIds[0], function(tab){
    chrome.storage.local.get('activeTab', function(item){
      var previousId = item.activeTab; 
      var newTab = null; 
      if(previousId){
          allTabs[previousId].highlighted = false;  
          allTabs[previousId].timeOfDeactivation = timeStamp;  
          allTabs[previousId].activeTimeElapsed = timeStamp - allTabs[previousId].timeOfActivation;
          allTabs[previousId].inactiveTimeElapsed = 0;
      }
      if(allTabs[tab.id]){
        updateTab(tab, timeStamp);

      } else {
        createNewTab(tab, timeStamp);
      }
      setLocalStorage('activeTab', tab.id);
    })
  });
})

/**
* Gets all tabs currently in the browser
*calls createNewTab
*/
function getAllTabs(){
  chrome.tabs.query({}, function(tabs) {
    var date = new Date()
    var timeStamp = date.getTime();
    tabs.forEach(function(tab){
      createNewTab(tab, timeStamp);
    })
  })
}


/**
* Listens to for when a tab updates
*@param {integer} tab tab id
*@param {object} changeInfo changed info of the tab
*@param {object} tab  object containing props about the tab
*/
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
  if (tab.url !== undefined && changeInfo.status == "complete") {
    var date = new Date()
    var timeStamp = date.getTime();
    updateTab(tab, timeStamp);
  }
})


/**
* Listens to for when a tab moves in a window
*/
chrome.tabs.onMoved.addListener(function(tabId, moveInfo){
  //update the database with all new indexes
  //call get all tabs, to get all the new
})



/**
* Runs function when first browser loads
*@param {object}
*calls getAllTabs
*/
chrome.runtime.onStartup.addListener(function(details){
  console.log('browser open')
  getAllTabs();
  checkForUserAccount();

})

/**
* Runs function when first installed
*@param {object}
*calls getAllTabs
*/
chrome.runtime.onInstalled.addListener(function(details){
  console.log('installed')
  getAllTabs();
  checkForUserAccount();
  chrome.storage.local.set({'userId' : null})
  chrome.storage.local.set({'activeTab' : null})

})

/**
* Runs function when receive a message
*@param {string}
*@param {object}
*@param {object}
* sends response back to the caller
*/
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // getAllDataFromServer()
    updatedElaspedDeactivation();
    if(request === 'popup'){
      sendResponse(allTabs);
    } 
  });

/**
* XMLHTTPRequest to server
*@param {string} method types of request, ex. get, post, etc
*@param {string} action the target route on the server
*@param {object} data the data that will be sent 
*/

// function serverRequest(method, action, data=null){
//   var xhr = new XMLHttpRequest();
//   xhr.open(method, "http://localhost:9000/" + action, true);
//   if(method === 'POST'){
//     data = JSON.stringify(data);
//     http.setRequestHeader('Content-type','application/json; charset=utf-8');
//   }
//   xhr.onreadystatechange = function() {
//     if (xhr.readyState == 4 && xhr.status == "200") {
//       // JSON.parse does not evaluate the attacker's scripts.
//       var resp = JSON.parse(xhr.responseText);
//     } else {
//       console.error(message)
//     }
//   }
//   xhr.send(data);
// }

function getAllDataFromServer(){
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "http://www.closeyourtabs.com/tabs", true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == "200") {
      console.log(xhr.responseText)
    } 
  }
  xhr.send()
}


function createNewTabRequest(object){
  // chrome.storage.local.get('userId', function(item){
  //   object.googleID = item.userId
  //   var xhr = new XMLHttpRequest();
  //   xhr.open('post', "http://www.closeyourtabs.com/tabs/", true);
  //   data = JSON.stringify(object);
  //   xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
  //   xhr.onreadystatechange = function() {
  //     if (xhr.readyState == 4 && xhr.status == "200") {
  //       // JSON.parse does not evaluate the attacker's scripts.
  //       var resp = JSON.parse(xhr.responseText);
  //     } else {
  //       console.error('error')
  //     }
  //   }
  //   xhr.send(data);
  // })
  // chrome.storage.local.get('userId', function(item){
    // object.userId = item.userId; 
    // var payload = {message: 'hi'};

    // var data = new FormData();
    // data.append("json", JSON.stringify( payload ) );
  
    // fetch("http://www.closeyourtabs.com/tabs/",
    // {
    //     method: "POST",
    //     body: data,
    //     headers : { 
    //       'Content-Type': 'application/json',
    //       'Accept': 'application/json'
    //      }
    // })
    // .then(function(res){ console.log(res)})
    // .then(function(data){ console.log(data) })

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://www.closeyourtabs.com/tabs/');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            console.log(xhr.responseText);
        }
    };
    xhr.send(JSON.stringify({
        message: 'hello server!'
    }));
    // })

//     fetch('http://www.closeyourtabs.com/tabs', {
//   method: 'post',
//   headers: {
//     'Accept': 'application/json, text/plain, */*',
//     'Content-Type': 'application/json'
//   },
//   body: JSON.stringify({a: 7, str: 'Some string: &=&'})
// }).then(res=>res.json())
//   .then(res => console.log(res));

  }