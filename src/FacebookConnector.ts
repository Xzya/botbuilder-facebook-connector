import * as Bot from "messenger-bot";
import { IConnector, IEvent, IMessage, IAddress, Message, HeroCard, IThumbnailCard, ICardAction, Keyboard, IAttachment, MemoryBotStorage } from "botbuilder";
import * as async from "async";
import { IMessageToFBMessage } from "./helpers";

export interface IFacebookConnectorSettings {
    token?: string;
    verify?: string;
}

export class FacebookConnector implements IConnector {
    private onEventHandler: (events: IEvent[], cb?: (err: Error) => void) => void;

    constructor(protected bot?: any, protected settings?: IFacebookConnectorSettings) {
        if (this.bot && this.settings) {
            throw new Error("Can't have both an instance of the bot and settings");
        }

        if (this.settings) {
            this.bot = new Bot(settings);
        }

        this.bot.on("message", (payload: any, reply: any, actions: any) => {
            this.dispatch(payload);
        });

        this.bot.on("postback", (payload: any, reply: any, actions: any) => {
            this.dispatch(payload);
        });
    }

    public listen() {
        return this.bot.middleware();
    }

    onEvent(handler: (events: IEvent[], callback?: (err: Error) => void) => void): void {
        this.onEventHandler = handler;
    }

    send(messages: IMessage[], done: (err: Error, addresses?: IAddress[]) => void): void {
        let addresses: IAddress[] = [];
        async.forEachOfSeries(messages, (msg, idx, cb) => {
            try {
                if (msg.type == 'delay') {
                    setTimeout(cb, (<any>msg).value);
                } else if (msg.address) {
                    this.postMessage(msg, (idx == messages.length - 1), (err, address) => {
                        addresses.push(address);
                        cb(err);
                    });
                } else {
                    console.error('FacebookConnector: send - message is missing address.')
                    cb(new Error('Message missing address.'));
                }
            } catch (e) {
                cb(e);
            }
        }, (err: Error) => {
            done(err, !err ? addresses : null)
        });
    }

    startConversation(address: IAddress, done: (err: Error, address?: IAddress) => void): void {
        console.log("startConversation")
        if (address && address.user && address.bot) {
            done(null, address);
        } else {
            console.error('FacebookConnector: startConversation - address is invalid.')
            done(new Error('Invalid address.'))
        }
    }

    private fromFacebookMessage(msg: any): IMessage {
        const sender = msg.sender.id;
        const recipient = msg.recipient.id;

        let m = new Message()
            .address({
                channelId: "facebook",
                // TODO: - replace this with the bot/user name
                user: { id: sender },
                bot: { id: recipient },
                conversation: { isGroup: false, id: `${sender}-${recipient}` }
            })
            .attachments(((msg.message ? msg.message.attachments : false) || []).map((a: any) => {
                let attachment: IAttachment = {
                    contentType: a.type
                };
                if (a.title) {
                    attachment.name = a.title;
                }
                if (a.url) {
                    attachment.contentUrl = a.url;
                }
                if (a.payload) {
                    attachment.content = a.payload;
                    if (a.payload.url) {
                        attachment.contentUrl = a.payload.url;
                    }
                }
                return attachment;
            }))
            .timestamp()
            .sourceEvent(msg);

        if (msg.message) {
            m.text(msg.message.text);
            if (msg.message.quick_reply) {
                m.value(msg.message.quick_reply.payload);
            }
        } else if (msg.postback) {
            m.text(msg.postback.title);
            m.value(msg.postback.payload);
        }

        return m.toMessage();
    }

    private postMessage(msg: IMessage, lastMsg: boolean, cb: (err: Error, address: IAddress) => void): void {
        console.info("FacebookConnector: sending message")
        if (process.env.DEBUG) {
            console.info("Raw botbuilder message", JSON.stringify(msg, null, "  "))
        }

        if (msg.sourceEvent) {
            if (process.env.DEBUG) {
                console.info("Raw Facebook payload (sourceEvent)", JSON.stringify(msg.sourceEvent, null, "  "))
            }
            this.bot.sendMessage(msg.address.user.id, msg.sourceEvent, function (err: any, info: any) {
                if (err) {
                    cb(new Error(err.message), null);
                } else {
                    cb(null, msg.address)
                }
            });
            return;
        }

        let messages = IMessageToFBMessage(msg);

        let bot = this.bot;
        async.forEachOfSeries(messages, (message, idx, cb) => {
            if (process.env.DEBUG) {
                console.info("Raw Facebook payload", JSON.stringify(message, null, "  "))
            }
            bot.sendMessage(msg.address.user.id, message, function (err: any, info: any) {
                cb(err);
            });
        }, (err: any) => {
            if (err) {
                cb(new Error(err.message), null);
            } else {
                cb(null, msg.address);
            }
        });
    }

    private dispatch(payload: any) {
        if (process.env.DEBUG) {
            console.log("FacebookConnector: message received", JSON.stringify(payload, null, "  "));
        }

        let msg = this.fromFacebookMessage(payload);

        if (process.env.DEBUG) {
            console.log("FacebookConnector: converted message", JSON.stringify(msg, null, "  "));
        }

        if (this.onEventHandler) {
            this.onEventHandler([msg]);
        }
    }

}
