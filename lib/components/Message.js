"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FBMessage = (function () {
    function FBMessage() {
        this.data = {};
    }
    FBMessage.prototype.text = function (text) {
        if (text) {
            this.data.text = text;
        }
        return this;
    };
    FBMessage.prototype.attachment = function (attachment) {
        if (attachment) {
            this.data.attachment = attachment.toAttachment ? attachment.toAttachment() : attachment;
        }
        return this;
    };
    FBMessage.prototype.quickReplies = function (list) {
        if (list) {
            this.data.quick_replies = [];
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                this.data.quick_replies.push(item.toQuickReply ? item.toQuickReply() : item);
            }
        }
        else {
            delete this.data.quick_replies;
        }
        return this;
    };
    FBMessage.prototype.toMessage = function () {
        return this.data;
    };
    return FBMessage;
}());
exports.FBMessage = FBMessage;
