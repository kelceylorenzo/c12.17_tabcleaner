var closeBtn = document.getElementsByClassName("tab-title");
console.log('content script ran');

function addClickHandler(){
    for(var index = 0; index < closeBtn.length ; index++ ){
        closeBtn[index].addEventListener('click', removeElement.bind(null, closeBtn[index]), false)
        console.log('added click listener', closeBtn[index])
    }
}

function removeElement(tab){
    var container = document.getElementsByClassName('tab-window');
    var parent = tab.closest('.tab-container')
    container[0].removeChild(parent);
    //get the window and index from the element and send to background page to delete
    // chrome.runtime.sendMessage({type: "remove-tab"}, function(response) {
    //     console.log(response);
    //   });
}


function deleteAllTabs(){
    //get all tab-contaier
    //loop through and send message to backgroud page
}


setTimeout(function(){addClickHandler()}, 500)