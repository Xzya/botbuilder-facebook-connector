"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Message_1 = require("./Message");
exports.TemplateTypes = {
    generic: "generic",
    list: "list",
    media: "media",
    open_graph: "open_graph",
};
exports.ImageAspectRatioTypes = {
    horizontal: "horizontal",
    square: "square",
};
exports.TopElementStyles = {
    compact: "compact",
    large: "large",
};
var Template = (function () {
    function Template() {
        this.data = {};
        this.data.type = "template";
        this.data.payload = {};
    }
    Template.prototype.templateType = function (text) {
        if (text) {
            this.data.payload.template_type = text;
        }
        return this;
    };
    Template.prototype.elements = function (list) {
        if (list) {
            this.data.payload.elements = [];
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                this.data.payload.elements.push(item.toElement ? item.toElement() : item);
            }
        }
        else {
            delete this.data.payload.elements;
        }
        return this;
    };
    Template.prototype.sharable = function (enabled) {
        if (enabled != null) {
            this.data.payload.sharable = enabled;
        }
        return this;
    };
    Template.prototype.imageAspectRatio = function (text) {
        if (text) {
            this.data.payload.image_aspect_ratio = text;
        }
        return this;
    };
    Template.prototype.topElementStyle = function (text) {
        if (text) {
            this.data.payload.top_element_style = text;
        }
        return this;
    };
    Template.prototype.buttons = function (list) {
        if (list) {
            this.data.payload.buttons = [];
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                this.data.payload.buttons.push(item.toButton ? item.toButton() : item);
            }
        }
        else {
            delete this.data.payload.buttons;
        }
        return this;
    };
    Template.prototype.toMessage = function () {
        return new Message_1.FBMessage().attachment(this.data).toMessage();
    };
    Template.generic = function (elements, sharable, imageAspectRatio) {
        return new Template()
            .templateType(exports.TemplateTypes.generic)
            .elements(elements)
            .imageAspectRatio(imageAspectRatio)
            .sharable(sharable);
    };
    Template.list = function (elements, topElementStyle, buttons) {
        return new Template()
            .templateType(exports.TemplateTypes.list)
            .elements(elements)
            .topElementStyle(topElementStyle)
            .buttons(buttons);
    };
    Template.media = function (elements) {
        return new Template()
            .templateType(exports.TemplateTypes.media)
            .elements(elements);
    };
    Template.openGraph = function (elements) {
        return new Template()
            .templateType(exports.TemplateTypes.open_graph)
            .elements(elements);
    };
    return Template;
}());
exports.Template = Template;
