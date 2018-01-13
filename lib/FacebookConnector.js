"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Bot = require("messenger-bot");
var botbuilder_1 = require("botbuilder");
var async = require("async");
var helpers_1 = require("./helpers");
var FacebookConnector = (function () {
    function FacebookConnector(bot, settings) {
        var _this = this;
        this.bot = bot;
        this.settings = settings;
        if (this.bot && this.settings) {
            throw new Error("Can't have both an instance of the bot and settings");
        }
        if (this.settings) {
            this.bot = new Bot(settings);
        }
        this.bot.on("message", function (payload, reply, actions) {
            _this.dispatch(payload);
        });
        this.bot.on("postback", function (payload, reply, actions) {
            _this.dispatch(payload);
        });
    }
    FacebookConnector.prototype.listen = function () {
        return this.bot.middleware();
    };
    FacebookConnector.prototype.onEvent = function (handler) {
        this.onEventHandler = handler;
    };
    FacebookConnector.prototype.send = function (messages, done) {
        var _this = this;
        var addresses = [];
        async.forEachOfSeries(messages, function (msg, idx, cb) {
            try {
                if (msg.type == 'delay') {
                    setTimeout(cb, msg.value);
                }
                else if (msg.address) {
                    _this.postMessage(msg, (idx == messages.length - 1), function (err, address) {
                        addresses.push(address);
                        cb(err);
                    });
                }
                else {
                    console.error('FacebookConnector: send - message is missing address.');
                    cb(new Error('Message missing address.'));
                }
            }
            catch (e) {
                cb(e);
            }
        }, function (err) {
            done(err, !err ? addresses : null);
        });
    };
    FacebookConnector.prototype.startConversation = function (address, done) {
        console.log("startConversation");
        if (address && address.user && address.bot) {
            done(null, address);
        }
        else {
            console.error('FacebookConnector: startConversation - address is invalid.');
            done(new Error('Invalid address.'));
        }
    };
    FacebookConnector.prototype.fromFacebookMessage = function (msg) {
        var sender = msg.sender.id;
        var recipient = msg.recipient.id;
        var m = new botbuilder_1.Message()
            .address({
            channelId: "facebook",
            user: { id: sender },
            bot: { id: recipient },
            conversation: { isGroup: false, id: sender + "-" + recipient }
        })
            .attachments(((msg.message ? msg.message.attachments : false) || []).map(function (a) {
            var attachment = {
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
        }
        else if (msg.postback) {
            m.text(msg.postback.title);
            m.value(msg.postback.payload);
        }
        return m.toMessage();
    };
    FacebookConnector.prototype.postMessage = function (msg, lastMsg, cb) {
        console.info("FacebookConnector: sending message");
        if (process.env.DEBUG) {
            console.info("Raw botbuilder message", JSON.stringify(msg, null, "  "));
        }
        if (msg.sourceEvent) {
            if (process.env.DEBUG) {
                console.info("Raw Facebook payload (sourceEvent)", JSON.stringify(msg.sourceEvent, null, "  "));
            }
            this.bot.sendMessage(msg.address.user.id, msg.sourceEvent, function (err, info) {
                if (err) {
                    cb(new Error(err.message), null);
                }
                else {
                    cb(null, msg.address);
                }
            });
            return;
        }
        var messages = helpers_1.IMessageToFBMessage(msg);
        var bot = this.bot;
        async.forEachOfSeries(messages, function (message, idx, cb) {
            if (process.env.DEBUG) {
                console.info("Raw Facebook payload", JSON.stringify(message, null, "  "));
            }
            bot.sendMessage(msg.address.user.id, message, function (err, info) {
                cb(err);
            });
        }, function (err) {
            if (err) {
                cb(new Error(err.message), null);
            }
            else {
                cb(null, msg.address);
            }
        });
    };
    FacebookConnector.prototype.dispatch = function (payload) {
        if (process.env.DEBUG) {
            console.log("FacebookConnector: message received", JSON.stringify(payload, null, "  "));
        }
        var msg = this.fromFacebookMessage(payload);
        if (process.env.DEBUG) {
            console.log("FacebookConnector: converted message", JSON.stringify(msg, null, "  "));
        }
        if (this.onEventHandler) {
            this.onEventHandler([msg]);
        }
    };
    return FacebookConnector;
}());
exports.FacebookConnector = FacebookConnector;
