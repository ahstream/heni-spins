console.log('content.js start...');

// DATA ----------------------------------------------------------------------------------

const intervalMin = 1000;
const intervalMax = 2000;

const styles = [1, 4, 8, 16];

// RUNTIME ----------------------------------------------------------------------------------

runAtScriptFileLoad();

async function runAtScriptFileLoad() {
  console.log('runAtScriptFileLoad:', window.location.href);
  // window.addEventListener('load', onLoad);
}

async function randomDelay() {
  await sleep(randomMinMax(intervalMin, intervalMax));
}

async function spinBlackWhite() {
  while (true) {
    const r = await getBlackWhiteSpin();
    await chrome.runtime.sendMessage({ cmd: 'addSpin', data: r });
    await randomDelay();
  }
}

async function spinColor() {
  while (true) {
    const r = await getColorSpin();
    await chrome.runtime.sendMessage({ cmd: 'addSpin', data: r });
    await randomDelay();
  }
}

function genRandomColors() {
  const n = randomMinMax(2, 12);
  const arr = Array.apply(null, { length: n }).map(Function.call, () => randomMinMax(1, 251));
  const newArr = [...new Set([...arr])];
  const newArr2 = newArr.length > 1 ? newArr : newArr.push(252);
  return newArr2;
}

async function getBlackWhiteSpin() {
  return getOne(25, [1, 252], randomMinMax(0, 1), randomMinMax(0, 1));
}

async function getColorSpin() {
  const style = randomMinMax(1, 24); // styles[Math.floor(Math.random() * styles.length)];
  const colors = [128, 202, 1]; // genRandomColors()
  const blur = randomMinMax(0, 1); // 0;
  return getOne(style, colors, blur, randomMinMax(1, 1));
}

async function getOne(style, colors, blur, canvas) {
  const r = await fetchHelper('https://api.heni.com/ecomm/spins', {
    headers: {
      accept: '*/*',
      'accept-language': 'en,en-US;q=0.9,sv;q=0.8',
      authorization: 'bearer ZKJGXoZcEMUIEN1wWffNB-3YxAh8fBz4',
      'content-type': 'application/json',
      'platform-id': '3',
      'sec-ch-ua': '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
      Referer: 'https://heni.com/',
      // 'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
    body: `{"parameters":{"colors":[${colors}],"style":${style},"blur":${blur},"canvas":${canvas}}}`,
    // body: '{"parameters":{"colors":[1,252],"style":25,"blur":0,"canvas":1}}',
    method: 'POST',
  });
  //console.log(r);
  return { thumbnail_image: r?.data?.thumbnail_image, original_image: r?.data?.original_image };
}

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  console.log('Received message:', request, sender);

  if (request.cmd === 'spinBlackWhite') {
    spinBlackWhite();
  }
  if (request.cmd === 'spinColor') {
    spinColor();
  }

  sendResponse();
});
