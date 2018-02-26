const BASE_URL = 'www.closeyourtabs.com';
const COOKIE_NAME =  'connect.sid'; 
console.log('script says hi');

function init(){
    checkUserLoginStatus();
    var logoutBtn = document.getElementById('log-out-button');
    logoutBtn.addEventListener('click', logoutUser);
    setTimeout(function(){addClickHandlersToTabs()}, 500)
}


function addClickHandlersToTabs(){
    var closeBtn = document.getElementsByClassName("tab-title");
    for(var index = 0; index < closeBtn.length ; index++ ){
        closeBtn[index].addEventListener('click', removeElement.bind(null, closeBtn[index]), false)
        console.log('added click listener', closeBtn[index])
    }
}

function removeElement(tab){
    var container = document.getElementsByClassName('tab-window');
    var parent = tab.closest('.tab-container');
    var tabInfo = {}
    tabInfo.window = parent.getAttribute('data-windowid');
    tabInfo.index = parent.getAttribute('data-index');
    console.log(tabInfo);
    container[0].removeChild(parent);
    //get the window and index from the element and send to background page to delete
    chrome.runtime.sendMessage({type: "removeTab"}, function(response) {
        console.log(response);
    });
}


function deleteAllTabs(){
    //get all tab-container
    //loop through all tabs, looking for class selected
    //send message to backgroud page to delete if selected
}

function logoutUser(){
    chrome.runtime.sendMessage({type: "logoutUser"});
}

function checkUserLoginStatus(){
    chrome.runtime.sendMessage({type: "checkLogin"});
}

init();

