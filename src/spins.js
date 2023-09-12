// RUNTIME -----------------------------------------------------------------------------------------

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  console.log('Received message:', request, sender);

  if (request.cmd === 'addSpin') {
    addSpin(request.data);
    return false;
  }

  return true;
});

function loadPage() {}

function addSpin(data) {
  const content = document.getElementById('spins');

  let html = '';

  const a = document.createElement('a');
  a.className = 'candidate';
  a.target = '_blank';
  a.href = data.original_image;

  const img = document.createElement('img');
  img.className = 'candidate';
  img.src = data.thumbnail_image;

  a.appendChild(img);

  content.appendChild(a);
}

document.addEventListener('DOMContentLoaded', loadPage);
