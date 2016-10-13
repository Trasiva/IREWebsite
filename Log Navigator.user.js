// ==UserScript==
// @name         IRE: Log Navigator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Why doesn't the logs have an easy way to navigate besides going back to
//                   the previous page or manipulate the url?
// @author       Patroklos
// @match        http://www.ironrealms.com/game/orglog?*
// @grant        none
// ==/UserScript==
/* jshint -W097 */
'use strict';

var head = document.getElementsByTagName('head')[0];
var link = document.createElement('link');
link.rel = 'stylesheet';
link.type = 'text/css';
link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
link.media = 'all';
head.appendChild(link);

var myOrg = getParameterByName("org");
var day = Number(getParameterByName("day"));

var div = document.createElement("div");

var oldLink = document.createElement("a");
oldLink.setAttribute("href", "http://www.ironrealms.com/game/orglog?org=" + myOrg + "&day=" + (day - 1));

var newLink = document.createElement("a");
newLink.setAttribute("href", "http://www.ironrealms.com/game/orglog?org=" + myOrg + "&day=" + (day + 1));

var imgOld = document.createElement("i");
imgOld.setAttribute("class", "material-icons dp48");
if (day <= 0 && myOrg)
{
	imgOld.setAttribute("style", "display:none");
}
imgOld.innerText = "chevron_left";

var imgNew = document.createElement("i");
imgNew.setAttribute("class", "material-icons dp48");
imgNew.setAttribute("style", "float:right");
if (day >= 6 && myOrg)
{
	imgNew.setAttribute("style", "display:none");
}
imgNew.innerText = "chevron_right";

var orgLink = document.getElementsByClassName('active')[0];
var parentDiv = orgLink.parentElement;
oldLink.appendChild(imgOld);
newLink.appendChild(imgNew);

div.appendChild(oldLink);
div.appendChild(newLink);
div.innerHTML = div.innerHTML + "<br />";

parentDiv.appendChild(div);

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    url = url.toLowerCase(); // This is just to avoid case sensitiveness  
    name = name.replace(/[\[\]]/g, "\\$&").toLowerCase();// This is just to avoid case sensitiveness for query parameter name
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}