/**
 * Copyright (c) 2021
 * FILE DESCRIPTION
 */

// STRING FUNCTIONS

function trimMultipleWhitespace(text) {
  let trimmedText = text.replaceAll('\r', '').replaceAll('\n', '');
  while (trimmedText.search('  ') > -1) {
    trimmedText = trimmedText.replaceAll('  ', ' ');
  }
  trimmedText = trimmedText.trim();
  return trimmedText;
}

function removeMultipleSpace(s) {
  let newString = s;
  while (true) {
    const lastString = newString;
    newString = newString.replace('  ', ' ');
    if (newString === lastString) {
      break;
    }
  }
  return newString;
}

function stringToNum(text) {
  return !text ? null : parseInt(text.replaceAll(',', ''), 10);
}

function stringToFloat(text) {
  return !text ? null : parseFloat(text.replaceAll(',', ''));
}

const countWord = (string, word) => string.split(word).length - 1;

const capitalize = (words) =>
  words
    .split(' ')
    .map((w) => w.substring(0, 1).toUpperCase() + w.substring(1))
    .join(' ');

const normalizeText = (text) => {
  if (!text) {
    return text;
  }
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

function trimChars(str, chars) {
  return trimCharsLeft(trimCharsRight(str, chars), chars);
}

function trimCharsLeft(str, chars) {
  return str.replace(new RegExp(`^[${chars}]+`), '');
}

function trimCharsRight(str, chars) {
  return str.replace(new RegExp(`[${chars}]+$`), '');
}

function trimWhitespace(str) {
  return str.replace(/^\s+|\s+$/g, '');
}

const removeNonNumbersFromString = (val) => val.replace(/\D/g, '');

const findLongest = (words) => Math.max(...words.map((el) => el.length));

const countUpperChars = (s) => {
  return s.length - s.replace(/[A-Ö]/g, '').length;
};

const countLowerChars = (s) => {
  return s.length - s.replace(/[a-ö]/g, '').length;
};

function hashCode(s) {
  var hash = 0,
    i,
    chr;
  if (s.length === 0) return hash;
  for (i = 0; i < s.length; i++) {
    chr = s.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

const slugify = (text) =>
  text
    .replace(/\s|_|\(|\)/g, '-')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

function getLastTokenizedItem(str, token) {
  const items = str.split(token);
  return items.length ? items[items.length - 1] : '';
}

function onlyNumbers(str) {
  return /^[0-9.,]+$/.test(str);
}

function toLowerCase(val) {
  return typeof val === 'string' ? val.toLowerCase() : val;
}

function valOrDefault(val, defaultVal) {
  const returnVal = val === undefined || val === null ? defaultVal : val;
  return returnVal;
}

function convertToHTMLInputFieldString(val) {
  const newVal = valOrDefault(val, '');
  return newVal + '';
}

// HTML DOM FUNCTIONS

async function hasTextContent(text, selector, options) {
  return getElementByText(text, selector, options) !== null;
}

function getElementByText(text, selector, options) {
  const elems = getElementsByText(text, selector, options);
  return elems.length > 0 ? elems[0] : null;
}

function getElementsByText(text, selector, options) {
  if (options.contains) {
    return [...document.querySelectorAll(selector)].filter((e) => e.innerText.includes(text));
  }
  if (options.startsWith) {
    return [...document.querySelectorAll(selector)].filter((e) => e.innerText.startsWith(text));
  }
  return [...document.querySelectorAll(selector)].filter((e) => e.innerText === text);
}

async function waitForTextContent(text, selector, maxWaitMs, intervalMs, options) {
  let tries = 0;
  const maxTries = Math.round(maxWaitMs / intervalMs);
  while (tries < maxTries) {
    tries++;
    const elems = getElementsByText(text, selector, options);
    if (elems && elems.length) {
      return elems[0];
    }
    await sleep(intervalMs);
  }
  return null;
}

async function waitForTextContains(text, selector, maxWaitMs = 30000, intervalMs = 1000) {
  return waitForTextContent(text, selector, maxWaitMs, intervalMs, { contains: true });
}

async function waitForTextStartsWith(text, selector, maxWaitMs = 30000, intervalMs = 1000) {
  return waitForTextContent(text, selector, maxWaitMs, intervalMs, { startsWith: true });
}

async function waitForTextEquals(text, selector, maxWaitMs = 30000, intervalMs = 1000) {
  return waitForTextContent(text, selector, maxWaitMs, intervalMs, { equals: true });
}

async function waitForSelector(selector, maxWaitMs, intervalMs = 100) {
  const stopTime = Date.now() + maxWaitMs;
  while (Date.now() <= stopTime) {
    const elem = document.querySelector(selector);
    if (elem) {
      return elem;
    }
    await sleep(intervalMs);
  }
  return null;
}

async function waitForSelectors(selector, maxTryTimeMs, tryIntervalMs) {
  let tries = 0;
  const maxTries = Math.round(maxTryTimeMs / tryIntervalMs);
  while (tries < maxTries) {
    tries++;
    const elems = document.querySelectorAll(selector);
    if (elems.length) {
      return [...elems];
    }
    await sleep(tryIntervalMs);
  }
  return [];
}

async function waitForNoSelector(selector, maxWaitMs, intervalMs = 100) {
  const stopTime = Date.now() + maxWaitMs;
  while (Date.now() <= stopTime) {
    const elem = document.querySelector(selector);
    if (!elem) {
      return true;
    }
    await sleep(intervalMs);
  }
  return false;
}

async function simulateClick(elem, deltaX = 5, deltaY = 5) {
  const plusOrMinusX = Math.random() < 0.5 ? -1 : 1;
  const plusOrMinusY = Math.random() < 0.5 ? -1 : 1;
  const box = elem.getBoundingClientRect();
  const x = box.left + (box.right - box.left) / 2 + randomMinMax(1, deltaX) * plusOrMinusX;
  const y = box.top + (box.bottom - box.top) / 2 + randomMinMax(1, deltaY) * plusOrMinusY;

  simulateMouseEvent(elem, 'mousedown', x, y);
  await delayBetween(1, 1);
  simulateMouseEvent(elem, 'mouseup', x, y);
  await delayBetween(1, 1);
  simulateMouseEvent(elem, 'click', x, y);
}

function simulateMouseEvent(element, eventName, coordX, coordY) {
  element.dispatchEvent(
    new MouseEvent(eventName, {
      view: window,
      bubbles: true,
      cancelable: true,
      clientX: coordX,
      clientY: coordY,
      button: 0,
    })
  );
}

// MATH FUNCTIONS

function randomMinMax(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const isValidNumber = (n) => typeof n === 'number';

// PROMISE FUNCTIONS

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function pause(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function delayBetween(minMsec, maxMsec) {
  await sleep(randomMinMax(minMsec, maxMsec));
}

async function delayRandom(minDelayMsec, rndPct = 0.2) {
  const maxDelay = minDelayMsec + Math.round(minDelayMsec * rndPct);
  await sleep(randomMinMax(minDelayMsec, maxDelay));
}

// DATE & TIME FUNCTIONS

function convertTextToMonthNum(text) {
  if (!text) {
    return null;
  }

  const monthText = text.toLowerCase().replaceAll('.', '').replaceAll(',', '').trim();
  if (monthText.startsWith('jan')) {
    return 1;
  }
  if (monthText.startsWith('feb')) {
    return 2;
  }
  if (monthText.startsWith('mar')) {
    return 3;
  }
  if (monthText.startsWith('apr')) {
    return 4;
  }
  if (monthText.startsWith('may')) {
    return 5;
  }
  if (monthText.startsWith('jun')) {
    return 6;
  }
  if (monthText.startsWith('jul')) {
    return 7;
  }
  if (monthText.startsWith('aug')) {
    return 8;
  }
  if (monthText.startsWith('sep')) {
    return 9;
  }
  if (monthText.startsWith('oct')) {
    return 10;
  }
  if (monthText.startsWith('nov')) {
    return 11;
  }
  if (monthText.startsWith('dec')) {
    return 12;
  }
  return 0;
}

function convertMonthNumToText(monthNum) {
  if (typeof monthNum !== 'number' || monthNum < 1) {
    return 'Error MonthNum: ' + monthNum;
  }
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  try {
    return months[monthNum - 1];
  } catch (e) {
    return 'Error MonthNum: ' + monthNum;
  }
}

function addToDate(date, { days = null, hours = null, minutes = null, seconds = null }) {
  const newDate = new Date(date);
  const secondsToAdd = (days ? days * 24 * 60 * 60 : 0) + (hours ? hours * 60 * 60 : 0) + (minutes ? minutes * 60 : 0) + (seconds ?? 0);
  newDate.setSeconds(newDate.getSeconds() + secondsToAdd);
  return newDate;
}

function daysBetween(date1, date2) {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const diffDays = Math.round(Math.abs((date1 - date2) / oneDay));
  return diffDays;
}

// An invalid date object returns NaN for getTime() and NaN is the only object not strictly equal to itself.
const isValidDate = (date) => date.getTime() === date.getTime();

const isToday = (someDate) => {
  const today = new Date();
  return someDate.getDate() == today.getDate() && someDate.getMonth() == today.getMonth() && someDate.getFullYear() == today.getFullYear();
};

// WEB FUNCTIONS

function getSearchArg(href, key) {
  return new URL(href).searchParams.get(key);
}

const isValidURL = (uri) => {
  try {
    return new URL(uri);
  } catch (_) {
    return false;
  }
};

function sluggifyUrl(url) {
  return url.replace('https://twitter.com/user/status/', '').replace('https://twitter.com/', '').replace('https://discord.gg/', '').replace('https://discord.com/invite/', '');
}

function removeHashFromUrl(url) {
  const index = url.indexOf('#');
  return index > 0 ? url.substr(0, index) : url;
}

function addSearchParamToUrl(key, val, url) {
  if (!key || !val) {
    return url;
  }
  return url.includes('?') ? `${url}&${key}=${val}` : `${url}?${key}=${val}`;
}

function parseRetryAfterSecs(header, undefinedValue) {
  try {
    const value = Number(header);
    if (!Number.isNaN(value)) {
      return value;
    }
    // Or HTTP date time string
    const dateTime = Date.parse(header);
    if (!Number.isNaN(dateTime)) {
      return Number((dateTime - Date.now()) / 1000);
    }
    return undefinedValue;
  } catch (error) {
    return undefinedValue;
  }
}

// SORT FUNCTIONS

function dynamicSort(property) {
  var sortOrder = 1;
  if (property[0] === '-') {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {
    /* next line works with strings and numbers,
     * and you may want to customize it to your needs
     */
    var result = a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
}

function dynamicSortMultiple() {
  /*
   * save the arguments object as it will be overwritten
   * note that arguments object is an array-like object
   * consisting of the names of the properties to sort by
   */
  var props = arguments;
  return function (obj1, obj2) {
    var i = 0,
      result = 0,
      numberOfProperties = props.length;
    /* try getting a different result from 0 (equal)
     * as long as we have extra properties to compare
     */
    while (result === 0 && i < numberOfProperties) {
      result = dynamicSort(props[i])(obj1, obj2);
      i++;
    }
    return result;
  };
}

const compareOrderedString = (a, b, ascending) => (ascending ? a.toLowerCase().localeCompare(b.toLowerCase()) : b.toLowerCase().localeCompare(a.toLowerCase()));

const compareOrderedNum = (a, b, ascending) => {
  if (typeof a !== 'number' && typeof b !== 'number') {
    return 0;
  }
  if (typeof a !== 'number') {
    return 1;
  }
  if (typeof b !== 'number') {
    return -1;
  }
  if (a === b) {
    return 0;
  }
  return ascending ? a - b : b - a;
};

// ARRAY FUNCTIONS

const range = (start, stop, step = 1) => Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);

function getLastItemOfString(str, token) {
  const items = str.split(token);
  return items.length ? items[items.length - 1] : '';
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function removeDupsFromArray(arr) {
  return arr.filter((value, index) => {
    const _value = JSON.stringify(value);
    return (
      index ===
      arr.findIndex((obj) => {
        return JSON.stringify(obj) === _value;
      })
    );
  });
}

// HTTP FUNCTIONS

async function fetchHelper(url, options, rateLimitHandler = null) {
  try {
    console.debug('Fetch:', url);
    let response;
    while (true) {
      response = await fetch(url, options);
      if (response.status === 429 && rateLimitHandler && (await rateLimitHandler(response))) {
        // rate limit handled by caller, try to fetch again!
        continue;
      }
      break;
    }
    if (response.status === 429) {
      return { error: 429, retryAfter: response.headers.get('retry-after') };
    }
    const data = response.headers.get('content-type')?.includes('application/json') ? await response.json() : await response.text();
    return { data, response, error: response.ok ? 0 : response.status };
  } catch (e) {
    console.error('Fetch error:', e);
    return { data: null, response: e?.response, error: e };
  }
}

async function fetchHelperOrg(url, options) {
  try {
    console.debug('Fetch:', url);
    var response = await fetch(url, options);
    if (response.status === 429) {
      return { error: 429, retryAfter: response.headers.get('retry-after') };
    }
    const data = response.headers.get('content-type')?.includes('application/json') ? await response.json() : await response.text();
    return { data, response, error: response.ok ? 0 : response.status };
  } catch (e) {
    console.error('Fetch error:', e);
    return { data: null, response: e?.response, error: e };
  }
}

// MISC FUNCTIONS

function echo(s) {
  console.log(s);
}

function stringToBool(s) {
  if (typeof s !== 'string') {
    return false;
  }
  return s.toLowerCase() === 'true';
}
