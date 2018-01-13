"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ButtonTypes = {
    web_url: "web_url",
    postback: "postback",
    element_share: "element_share",
};
exports.WebviewHeightRatioTypes = {
    compact: "compact",
    tall: "tall",
    full: "full",
};
var Button = (function () {
    function Button() {
        this.data = {};
    }
    Button.prototype.type = function (type) {
        if (type) {
            this.data.type = type;
        }
        return this;
    };
    Button.prototype.url = function (url) {
        if (url) {
            this.data.url = url;
        }
        return this;
    };
    Button.prototype.title = function (title) {
        if (title) {
            this.data.title = title;
        }
        return this;
    };
    Button.prototype.payload = function (payload) {
        if (payload) {
            this.data.payload = payload;
        }
        return this;
    };
    Button.prototype.shareContents = function (content) {
        if (content) {
            this.data.share_contents = content;
        }
        return this;
    };
    Button.prototype.messengerExtensions = function (enabled) {
        this.data.messenger_extensions = enabled;
        return this;
    };
    Button.prototype.webviewHeightRatio = function (text) {
        if (text) {
            this.data.webview_height_ratio = text;
        }
        return this;
    };
    Button.prototype.fallbackURL = function (text) {
        if (text) {
            this.data.fallback_url = text;
        }
        return this;
    };
    Button.prototype.toButton = function () {
        return this.data;
    };
    Button.webURL = function (title, url) {
        return new Button().type(exports.ButtonTypes.web_url).title(title).url(url);
    };
    Button.postback = function (title, payload) {
        return new Button().type(exports.ButtonTypes.postback).title(title).payload(payload);
    };
    Button.share = function (contents) {
        return new Button().type(exports.ButtonTypes.element_share).shareContents(contents);
    };
    return Button;
}());
exports.Button = Button;
