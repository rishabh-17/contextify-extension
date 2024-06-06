document.addEventListener("mouseup", function(event) {
    var selectedText = window.getSelection().toString().trim();
    console.log("Selected Text:", selectedText);
    if(selectedText !== "") {
        chrome.runtime.sendMessage({action: "getSelectedText", text: selectedText});
    }
});