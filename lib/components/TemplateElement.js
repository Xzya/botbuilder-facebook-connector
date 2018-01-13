"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaTypes = {
    image: "image",
    video: "video",
};
var TemplateElement = (function () {
    function TemplateElement() {
        this.data = {};
    }
    TemplateElement.prototype.title = function (text) {
        if (text) {
            this.data.title = text;
        }
        return this;
    };
    TemplateElement.prototype.subtitle = function (text) {
        if (text) {
            this.data.subtitle = text;
        }
        return this;
    };
    TemplateElement.prototype.imageURL = function (text) {
        if (text) {
            this.data.image_url = text;
        }
        return this;
    };
    TemplateElement.prototype.defaultAction = function (action) {
        if (action) {
            this.data.default_action = action.toButton ? action.toButton() : action;
        }
        return this;
    };
    TemplateElement.prototype.buttons = function (list) {
        if (list) {
            this.data.buttons = [];
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                this.data.buttons.push(item.toButton ? item.toButton() : item);
            }
        }
        else {
            delete this.data.buttons;
        }
        return this;
    };
    TemplateElement.prototype.mediaType = function (text) {
        if (text) {
            this.data.media_type = text;
        }
        return this;
    };
    TemplateElement.prototype.attachmentID = function (text) {
        if (text) {
            this.data.attachment_id = text;
        }
        return this;
    };
    TemplateElement.prototype.url = function (text) {
        if (text) {
            this.data.url = text;
        }
        return this;
    };
    TemplateElement.prototype.toElement = function () {
        return this.data;
    };
    TemplateElement.generic = function (title, subtitle, imageURL, defaultAction, buttons) {
        return new TemplateElement().title(title).subtitle(subtitle).imageURL(imageURL).defaultAction(defaultAction).buttons(buttons);
    };
    TemplateElement.list = function (title, subtitle, imageURL, defaultAction, buttons) {
        return new TemplateElement().title(title).subtitle(subtitle).imageURL(imageURL).defaultAction(defaultAction).buttons(buttons);
    };
    TemplateElement.imageID = function (attachmentID, buttons) {
        return new TemplateElement().mediaType(exports.MediaTypes.image).attachmentID(attachmentID).buttons(buttons);
    };
    TemplateElement.imageURL = function (url, buttons) {
        return new TemplateElement().mediaType(exports.MediaTypes.image).url(url).buttons(buttons);
    };
    TemplateElement.videoID = function (attachmentID, buttons) {
        return new TemplateElement().mediaType(exports.MediaTypes.video).attachmentID(attachmentID).buttons(buttons);
    };
    TemplateElement.videoURL = function (url, buttons) {
        return new TemplateElement().mediaType(exports.MediaTypes.video).url(url).buttons(buttons);
    };
    TemplateElement.openGraph = function (url, buttons) {
        return new TemplateElement().url(url).buttons(buttons);
    };
    return TemplateElement;
}());
exports.TemplateElement = TemplateElement;
