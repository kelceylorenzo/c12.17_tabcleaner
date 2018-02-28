const BASE_URL = 'http://www.closeyourtabs.com';
const COOKIE_NAME =  'connect.sid'; 
console.log('STAAAAAAAAB');

function init(){
    var logoutBtn = document.getElementById('log-out-button');
    var deleteBtn = document.getElementsByClassName('sidebar-delete');
    checkUserLoginStatus();
    logoutBtn.addEventListener('click', logoutUser);
    deleteBtn[0].addEventListener('click', removeSelectedTabs);
    setTimeout(function(){addClickHandlersToTabs()}, 800)
}


function addClickHandlersToTabs(){
    var closeBtn = document.getElementsByClassName("close-favicon");
    for(var index = 0; index < closeBtn.length ; index++ ){
        closeBtn[index].addEventListener('click', removeSingleTab)
    }
}

function removeSingleTab(event){
    var parent = event.target.closest('.tab-container');
    removeElement(parent);
}

function removeSelectedTabs(){
    var tabContainers = document.getElementsByClassName('tab-container');
    for(var tab = 0; tab < tabContainers.length; tab++){

        var parent = tabContainers[tab];
        var descendents = parent.childNodes;
        var title = descendents[1].childNodes[0].innerText;
        let domain = (title).match(/close your tabs/gi);
        var classes = tabContainers[tab].className.split(" ");
        if(!domain && classes.indexOf('tab-selected') !== -1){
            removeElement(tabContainers[tab]);
        }
    }
}

function removeElement(parent){
    console.log(parent)
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

function logoutUser(){
    chrome.runtime.sendMessage({type: "logoutUser"});
}

function checkUserLoginStatus(){
    chrome.runtime.sendMessage({type: "checkLogin"});
}

init();

