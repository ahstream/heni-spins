// RUNTIME -------------------------------------------------------------------

importScripts('/config/config.js');
importScripts('/src/hxUtils.js');

let spinsPageTab = null;

// EVENT HANDLERS -------------------------------------------------------------------

chrome.runtime.onInstalled.addListener(async () => {
  console.log('Extension installed!');
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  console.log('onMessage. request, sender:', request, sender);

  switch (request.cmd) {
    case 'addSpin':
      //addSpin(request.data);
      sendResponse();
      return true;
    case 'spinBlackWhite':
      spinsPageTab = await chrome.tabs.create({ url: chrome.runtime.getURL('/html/spins.html') });
      chrome.tabs.query({}, (tabs) => {
        for (let tab of tabs) {
          if (tab.url.startsWith('https://heni.com/spins/generate')) {
            chrome.tabs.sendMessage(tab.id, {
              cmd: 'spinBlackWhite',
            });
            return;
          }
        }
      });
      sendResponse();
      return true;
    case 'spinColor':
      spinsPageTab = await chrome.tabs.create({ url: chrome.runtime.getURL('/html/spins.html') });
      chrome.tabs.query({}, (tabs) => {
        for (let tab of tabs) {
          if (tab.url.startsWith('https://heni.com/spins')) {
            chrome.tabs.sendMessage(tab.id, {
              cmd: 'spinColor',
            });
            return;
          }
        }
      });
      sendResponse();
      return true;
    default:
      console.error('Received unexpected message!', request, sender);
      break;
  }

  sendResponse();
});

// CUSTOM FUNCS -------------------------------------------------------------------

async function addSpin(data) {
  await sleep(100);
  chrome.tabs.sendMessage(spinsPageTab.id, {
    cmd: 'addSpin',
    data,
  });
  console.log('done');
  return false;
}
