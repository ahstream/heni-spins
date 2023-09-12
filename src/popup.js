document.getElementById('spinBlackWhite').addEventListener('click', (event) => {
  chrome.runtime.sendMessage({ cmd: 'spinBlackWhite' });
  window.close();
});

document.getElementById('spinColor').addEventListener('click', (event) => {
  chrome.runtime.sendMessage({ cmd: 'spinColor' });
  window.close();
});
