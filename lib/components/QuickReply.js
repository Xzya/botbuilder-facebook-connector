"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuickReplyTypes = {
    text: "text",
    location: "location",
};
var QuickReply = (function () {
    function QuickReply() {
        this.data = {};
        this.data.content_type = exports.QuickReplyTypes.text;
    }
    QuickReply.prototype.contentType = function (text) {
        if (text) {
            this.data.content_type = text;
        }
        return this;
    };
    QuickReply.prototype.title = function (text) {
        if (text) {
            this.data.title = text;
        }
        return this;
    };
    QuickReply.prototype.payload = function (payload) {
        if (payload) {
            this.data.payload = payload;
        }
        return this;
    };
    QuickReply.prototype.imageURL = function (text) {
        if (text) {
            this.data.image_url = text;
        }
        return this;
    };
    QuickReply.prototype.toQuickReply = function () {
        return this.data;
    };
    QuickReply.text = function (title, payload, imageURL) {
        return new QuickReply().contentType(exports.QuickReplyTypes.text).title(title).payload(payload).imageURL(imageURL);
    };
    QuickReply.location = function () {
        return new QuickReply().contentType(exports.QuickReplyTypes.location);
    };
    return QuickReply;
}());
exports.QuickReply = QuickReply;
