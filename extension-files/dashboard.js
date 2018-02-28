const BASE_URL = 'http://www.closeyourtabs.com';
const COOKIE_NAME =  'connect.sid'; 
console.log('STAAAAAAAAB');

function init(){
    checkUserLoginStatus();
    var logoutBtn = document.getElementById('log-out-button');
    logoutBtn.addEventListener('click', logoutUser);
    setTimeout(function(){addClickHandlersToTabs()}, 500)
}


function addClickHandlersToTabs(){
    var closeBtn = document.getElementsByClassName("close-favicon");
    for(var index = 0; index < closeBtn.length ; index++ ){
        console.log(closeBtn[index])
        closeBtn[index].addEventListener('click', removeElement)
    }
}

function removeElement(event){
    var parent = event.target.closest('.tab-container');
    var window = parent.getAttribute('data-windowid');
    var index = parent.getAttribute('data-tabindex');
    var tabInfo = {};
    tabInfo['window'] = window;
    tabInfo['index'] = index; 
    chrome.runtime.sendMessage({type: "removeTab", data: tabInfo}, function(response) {
        if(response.success){
            parent.style.display = 'none';
        } 
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

