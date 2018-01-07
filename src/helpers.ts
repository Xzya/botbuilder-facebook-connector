import { ICardAction, IMessage, IThumbnailCard, IAnimationCard, IVideoCard, IAudioCard, IMediaCard, AnimationCard, VideoCard, AudioCard } from "botbuilder";
import { IButton, IQuickReply, IKeyboard, IFBMessage, ITemplateElement } from "./interfaces";
import { Button, ButtonTypes } from "./components/Button";
import { QuickReply, QuickReplyTypes } from "./components/QuickReply";
import { TemplateElement } from "./components/TemplateElement";
import { FBMessage } from "./components/Message";
import { Template } from "./components/Template";
import { Attachment } from "./components/Attachment";

export function ActionToFBButton(msg: ICardAction): IButton {
    switch (msg.type) {
        case "imBack":
        case "postBack":
            return Button.postback(msg.title, msg.value).toButton();
        case "openUrl":
            return Button.webURL(msg.title, msg.value).toButton();
        default:
            // TODO: - what other types can there be?
            return undefined;
    }
}

export function ActionsToFBButtons(buttons: ICardAction[]): IButton[] {
    return buttons.map((button) => {
        return ActionToFBButton(button);
    })
}

export function KeyboardToQuickReply(k: IKeyboard) {
    let quick_replies: IQuickReply[] = [];

    k.buttons.map((action: ICardAction) => {
        switch (action.type) {
            case 'imBack':
            case 'postBack':
                quick_replies.push(new QuickReply()
                    .contentType(QuickReplyTypes.text)
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

export function IMessageToFBMessage(msg: IMessage) {
    let messages: IFBMessage[] = [];

    switch (msg.type) {
        case "message":

            let hasQuickReplies = false;

            if (msg.attachments) {

                let genericElements: ITemplateElement[] = [];

                for (let i = 0; i < msg.attachments.length; i++) {
                    let a = msg.attachments[i];

                    switch (a.contentType) {
                        case 'application/vnd.microsoft.card.hero':
                        case 'application/vnd.microsoft.card.thumbnail': {
                            let tc: IThumbnailCard = a.content;

                            let el = new TemplateElement()
                                .title(tc.title)
                                .subtitle(tc.subtitle)

                            // TODO: - is this a good approach?
                            if (tc.images && tc.images.length) {
                                el.imageURL(tc.images[0].url);
                            }

                            if (tc.buttons && tc.buttons.length) {
                                let buttons = ActionsToFBButtons(tc.buttons);
                                el.buttons(buttons);

                                // if there is only one button of type `web_url`, also set it as default action
                                if (buttons.length == 1 && buttons[0].type == ButtonTypes.web_url) {
                                    let [defaultAction] = ActionsToFBButtons(tc.buttons);
                                    delete defaultAction.title;
                                    el.defaultAction(defaultAction)
                                }
                            }

                            if (tc.text) {
                                // not supported
                            }

                            // TODO: - I'm not sure if this is correct
                            if (tc.tap) {
                                el.defaultAction(
                                    Button.webURL(tc.tap.title, tc.tap.value)
                                )
                            }

                            genericElements.push(el.toElement());

                            break;
                        }

                        case "application/vnd.microsoft.card.animation":
                        case "application/vnd.microsoft.card.video":
                        case "application/vnd.microsoft.card.audio": {

                            let card: IMediaCard = a.content;

                            if (card.media && card.media.length) {
                                for (let j = 0; j < card.media.length; j++) {
                                    switch (a.contentType) {
                                        case "application/vnd.microsoft.card.animation":
                                            messages.push(
                                                new FBMessage().attachment(
                                                    Attachment.image(card.media[j].url, true)
                                                ).toMessage()
                                            )
                                            break;
                                        case "application/vnd.microsoft.card.video":
                                            messages.push(
                                                new FBMessage().attachment(
                                                    Attachment.video(card.media[j].url, true)
                                                ).toMessage()
                                            )
                                            break;
                                        case "application/vnd.microsoft.card.audio":
                                            messages.push(
                                                new FBMessage().attachment(
                                                    Attachment.audio(card.media[j].url, true)
                                                ).toMessage()
                                            )
                                            break;
                                    }
                                }
                            }

                            let hasProperties = false;

                            let el = new TemplateElement();

                            if (card.title) {
                                el.title(card.title);
                                hasProperties = true;
                            }

                            if (card.subtitle) {
                                el.subtitle(card.title);
                                hasProperties = true;
                            }

                            if (card.image && card.image.url) {
                                el.imageURL(card.image.url)
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
                                let quickReplies = KeyboardToQuickReply(a.content);
                                messages.push(
                                    new FBMessage()
                                        .text(msg.text)
                                        .quickReplies(quickReplies)
                                        .toMessage()
                                )
                                hasQuickReplies = true;
                            }

                            break;
                        }
                    }
                }

                if (genericElements.length) {
                    messages.push(
                        Template.generic(genericElements).toMessage()
                    );
                }
            }

            if (msg.text && !hasQuickReplies) {
                messages.push(
                    new FBMessage()
                        .text(msg.text)
                        .toMessage()
                );
            }

            break;

        // TODO: - what other types are there? (check `delay`)
        default:
            break;
    }

    return messages;
}
