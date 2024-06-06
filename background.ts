
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create(
    {
      id: "Contextify",
      title: "Contextify It",
      contexts: ["selection"],
    },
    () => chrome.runtime.lastError
  );
  chrome.contextMenus.create({
    id: "ContextifyImg",
    title: "Contextify This Image",
    contexts: ["image"],
  });
});

  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'Contextify') {
      chrome.sidePanel.open({ windowId: tab.windowId });
      setTimeout(() => {     
        chrome.runtime.sendMessage({msg: info.selectionText, img:false});
      }, 1000);
      // console.log("Selected text:", info.selectionText);
    }
    if (info.menuItemId === 'ContextifyImg') {
      // console.log(info.srcUrl)
      chrome.sidePanel.open({ windowId: tab.windowId });
      setTimeout(() => {     
        chrome.runtime.sendMessage({url: info.srcUrl, img:true});
      }, 1000);
    }
  });





//   chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
//     if (message.action === "getSelectedText") {
//         var selectedText = message.text;
//         console.log("Selected Text:", selectedText);
//     }
// });

