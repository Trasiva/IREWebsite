// ==UserScript==
// @name         IRE Logs Date/Time to Local
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Take IRE Logs and converts them to local time.
// @author       Patroklos
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.6.15/browser-polyfill.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.6.15/browser.min.js
// @match        http://www.ironrealms.com/game/orglog?org=*
// ==/UserScript==

/* jshint ignore:start */
var inline_src = (<><![CDATA[
/* jshint ignore:end */
/* jshint esnext: true */

const div = document.getElementById("content-area");

if (div) {
    div.innerHTML = div.innerHTML.replace(/((\d+)\/(\d+)\/(\d+) (\d+):(\d+):(\d+))/g, getLocalString);
}


function getUTCDate(dateString) {
	const arrDateTime = dateString.split(" ");
    if (arrDateTime.length === 2){
      const arrDate = arrDateTime[0].split('/');
      if (arrDate.length === 3) {
          const msgTime = arrDateTime[1].split(':');
          if (msgTime.length === 3) {
              return new Date(Date.UTC(arrDate[0], arrDate[1], arrDate[2], msgTime[0], msgTime[1], msgTime[2]));
          }
      }
    }
    return null;
}

function getLocalString(thisDate) {
		thisDate = getUTCDate(thisDate);
    if (thisDate !== null){
      const year = (thisDate.getYear() + 1900).toString().substring(2,4);
      const month = padString(thisDate.getMonth().toString());
      const day = padString(thisDate.getDate().toString());
      let hours = thisDate.getHours() + (isDST(thisDate) ? 0 : 1);
      if (hours > 23) {
          hours = '0';
      }
      hours = padString(hours.toString());
      const minutes = padString(thisDate.getMinutes().toString());
      const seconds = padString(thisDate.getSeconds().toString());

      return `${month}/${day} ${hours}:${minutes}:${seconds}`;
    }
}

function padString(myString) {
    const pad = "00";
    myString = pad.substring(0, pad.length - myString.length) + myString;
    return myString;
}

function isDST(t) { //t is the date object to check, returns true if daylight saving time is in effect.
    var jan = new Date(t.getFullYear(),0,1);
    var jul = new Date(t.getFullYear(),6,1);
    return Math.min(jan.getTimezoneOffset(),jul.getTimezoneOffset()) == t.getTimezoneOffset();
}

/* jshint ignore:start */
]]></>).toString();
var c = babel.transform(inline_src);
eval(c.code);
/* jshint ignore:end */