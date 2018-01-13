"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Button_1 = require("./components/Button");
var QuickReply_1 = require("./components/QuickReply");
var TemplateElement_1 = require("./components/TemplateElement");
var Message_1 = require("./components/Message");
var Template_1 = require("./components/Template");
var Attachment_1 = require("./components/Attachment");
function ActionToFBButton(msg) {
    switch (msg.type) {
        case "imBack":
        case "postBack":
            return Button_1.Button.postback(msg.title, msg.value).toButton();
        case "openUrl":
            return Button_1.Button.webURL(msg.title, msg.value).toButton();
        default:
            return undefined;
    }
}
exports.ActionToFBButton = ActionToFBButton;
function ActionsToFBButtons(buttons) {
    return buttons.map(function (button) {
        return ActionToFBButton(button);
    });
}
exports.ActionsToFBButtons = ActionsToFBButtons;
function KeyboardToQuickReply(k) {
    var quick_replies = [];
    k.buttons.map(function (action) {
        switch (action.type) {
            case 'imBack':
            case 'postBack':
                quick_replies.push(new QuickReply_1.QuickReply()
                    .contentType(QuickReply_1.QuickReplyTypes.text)
                    .title(action.title)
                    .payload(action.value)
                    .toQuickReply());
                break;
            default:
                console.warn("Invalid keyboard '%s' button sent to facebook.", action.type);
                break;
        }
    });
    return quick_replies;
}
exports.KeyboardToQuickReply = KeyboardToQuickReply;
function IMessageToFBMessage(msg) {
    var messages = [];
    switch (msg.type) {
        case "message":
            var hasQuickReplies = false;
            if (msg.attachments) {
                var genericElements = [];
                for (var i = 0; i < msg.attachments.length; i++) {
                    var a = msg.attachments[i];
                    switch (a.contentType) {
                        case 'application/vnd.microsoft.card.hero':
                        case 'application/vnd.microsoft.card.thumbnail': {
                            var tc = a.content;
                            var el = new TemplateElement_1.TemplateElement()
                                .title(tc.title)
                                .subtitle(tc.subtitle);
                            if (tc.images && tc.images.length) {
                                el.imageURL(tc.images[0].url);
                            }
                            if (tc.buttons && tc.buttons.length) {
                                var buttons = ActionsToFBButtons(tc.buttons);
                                el.buttons(buttons);
                                if (buttons.length == 1 && buttons[0].type == Button_1.ButtonTypes.web_url) {
                                    var defaultAction = ActionsToFBButtons(tc.buttons)[0];
                                    delete defaultAction.title;
                                    el.defaultAction(defaultAction);
                                }
                            }
                            if (tc.text) {
                            }
                            if (tc.tap) {
                                el.defaultAction(Button_1.Button.webURL(null, tc.tap.value));
                            }
                            genericElements.push(el.toElement());
                            break;
                        }
                        case 'application/vnd.microsoft.card.signin': {
                            console.error("Not implemented");
                            break;
                        }
                        case 'application/vnd.microsoft.card.receipt': {
                            console.error("Not implemented");
                            break;
                        }
                        case "application/vnd.microsoft.card.animation":
                        case "application/vnd.microsoft.card.video":
                        case "application/vnd.microsoft.card.audio": {
                            var card = a.content;
                            if (card.media && card.media.length) {
                                for (var j = 0; j < card.media.length; j++) {
                                    switch (a.contentType) {
                                        case "application/vnd.microsoft.card.animation":
                                            messages.push(new Message_1.FBMessage().attachment(Attachment_1.Attachment.image(card.media[j].url, true)).toMessage());
                                            break;
                                        case "application/vnd.microsoft.card.video":
                                            messages.push(new Message_1.FBMessage().attachment(Attachment_1.Attachment.video(card.media[j].url, true)).toMessage());
                                            break;
                                        case "application/vnd.microsoft.card.audio":
                                            messages.push(new Message_1.FBMessage().attachment(Attachment_1.Attachment.audio(card.media[j].url, true)).toMessage());
                                            break;
                                    }
                                }
                            }
                            var hasProperties = false;
                            var el = new TemplateElement_1.TemplateElement();
                            if (card.title) {
                                el.title(card.title);
                                hasProperties = true;
                            }
                            if (card.subtitle) {
                                el.subtitle(card.title);
                                hasProperties = true;
                            }
                            if (card.image && card.image.url) {
                                el.imageURL(card.image.url);
                                hasProperties = true;
                            }
                            if (card.buttons && card.buttons.length) {
                                el.buttons(ActionsToFBButtons(card.buttons));
                                hasProperties = true;
                            }
                            if (hasProperties) {
                                genericElements.push(el.toElement());
                            }
                            break;
                        }
                        case "application/vnd.microsoft.keyboard": {
                            if (msg.text) {
                                var quickReplies = KeyboardToQuickReply(a.content);
                                messages.push(new Message_1.FBMessage()
                                    .text(msg.text)
                                    .quickReplies(quickReplies)
                                    .toMessage());
                                hasQuickReplies = true;
                            }
                            break;
                        }
                    }
                }
                if (genericElements.length) {
                    messages.push(Template_1.Template.generic(genericElements).toMessage());
                }
            }
            if (msg.text && !hasQuickReplies) {
                messages.push(new Message_1.FBMessage()
                    .text(msg.text)
                    .toMessage());
            }
            break;
        default:
            break;
    }
    return messages;
}
exports.IMessageToFBMessage = IMessageToFBMessage;
