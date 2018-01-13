"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentTypes = {
    image: "image",
    video: "video",
    audio: "audio",
    file: "file",
};
var Attachment = (function () {
    function Attachment() {
        this.data = {};
    }
    Attachment.prototype.type = function (text) {
        if (text) {
            this.data.type = text;
        }
        return this;
    };
    Attachment.prototype.payload = function (payload) {
        if (payload) {
            this.data.payload = payload.toPayload ? payload.toPayload() : payload;
        }
        return this;
    };
    Attachment.prototype.toAttachment = function () {
        return this.data;
    };
    Attachment.image = function (url, is_reusable) {
        return new Attachment().type(exports.AttachmentTypes.image).payload({ url: url, is_reusable: is_reusable });
    };
    Attachment.video = function (url, is_reusable) {
        return new Attachment().type(exports.AttachmentTypes.video).payload({ url: url, is_reusable: is_reusable });
    };
    Attachment.audio = function (url, is_reusable) {
        return new Attachment().type(exports.AttachmentTypes.audio).payload({ url: url, is_reusable: is_reusable });
    };
    Attachment.file = function (url, is_reusable) {
        return new Attachment().type(exports.AttachmentTypes.file).payload({ url: url, is_reusable: is_reusable });
    };
    return Attachment;
}());
exports.Attachment = Attachment;
