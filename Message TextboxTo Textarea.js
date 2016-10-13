// ==UserScript==
// @name         IRE: Message Textbox to TextArea
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Turn the textbox into a text area so you can actually read what you write.
// @author       Patroklos
// @match        http://www.ironrealms.com/game/messages*
// @grant        none
// ==/UserScript==
/* jshint -W097 */
'use strict';

var textbox = document.getElementsByClassName("ire-message-send")[0];
var textArea = document.createElement('textarea');
textArea.setAttribute('class', 'ire-message-send');
textArea.setAttribute('name', 'msgtext');
textArea.setAttribute('cols', '50');
textArea.setAttribute('rows', '6');
var text = textbox.value;
var parent = textbox.parentNode;
parent.replaceChild(textArea, textbox);