// ==UserScript==
// @name         IRE: Message DateTime to Local
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  We don't all live in GMT, so show us our local times!
// @author       Patroklos
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.6.15/browser-polyfill.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.6.15/browser.min.js
// @match        http://www.ironrealms.com/game/messages*
// ==/UserScript==

/* jshint ignore:start */
var inline_src = (<><![CDATA[
/* jshint ignore:end */
/* jshint esnext: true */

const container = document.getElementById('ire-messages');

if (container) {
    const myTable = container.getElementsByClassName('sticky-table');
    //See if you're on the main messages page or not
    if (myTable.length > 0) {
        for (let tr of myTable[0].rows) {
            const td = tr.cells[2];
            const msgTags = td.innerHTML.match(/<[\/]?(\w+)>/g);
            const bTag = msgTags ? true : false;
            let msgDate = getUTCDate(td.innerText);

            if (msgDate) {
                td.innerHTML = getLocalString(msgDate, true);
                if (bTag) {
                    td.innerHTML = `${msgTags[0]}${td.innerHTML}${msgTags[1]}`;
                }
                td.style.whiteSpace = "nowrap";
            }
        }
    }
    else {
    //Should be a single message
    let msgSender = container.getElementsByClassName('ire-message-sender');
    if (msgSender.length > 0) {
        const span = msgSender[0];
        msgSender = span.innerHTML;
        let msgArray = msgSender.split(/<[\/]?strong>/g);
        let currentDate = getUTCDate(msgArray[3]);
        if (currentDate) {
            currentDate = getLocalString(currentDate, false);
            span.innerHTML = `${msgArray[0]}<strong>${msgArray[1]}</strong>${msgArray[2]}<strong>${currentDate}</strong>`;
        }
    }
    }
}

function getUTCDate(dateString) {
    const currentYear = new Date(Date.now()).getYear() + 1900;
    const arrDate = dateString.split('/');

    if (arrDate.length === 3) {
        const msgTime = arrDate[2].split(':');
        if (msgTime.length === 2) {
            return new Date(Date.UTC(currentYear, arrDate[0], arrDate[1], msgTime[0], msgTime[1]));
        }
    }
    return null;
}

function getLocalString(thisDate, bTable) {
	const year = (thisDate.getYear() + 1900).toString().substring(2,4);
    const month = padString(thisDate.getMonth().toString());
    const day = padString(thisDate.getDate().toString());
    let hours = thisDate.getHours() + (isDST(thisDate) ? 1 : 0);
    if (hours > 23) {
        hours = '0';
    }
    hours = padString(hours.toString());
    const minutes = padString(thisDate.getMinutes().toString());
    if (bTable) {
        return `${month}/${day} ${hours}:${minutes}`;
    }
    else {
    	return `${month}/${day}/${year} at ${hours}${minutes}`;
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
