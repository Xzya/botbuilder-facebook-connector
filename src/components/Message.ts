import { IIsFBMessage, IFBMessage, IIsAttachment, IQuickReply, IIsQuickReply, IAttachment } from "../interfaces";

export class FBMessage implements IIsFBMessage {
    protected data = <IFBMessage>{};

    text(text: string): this {
        if (text) {
            this.data.text = text;
        }
        return this;
    }

    attachment(attachment: IAttachment | IIsAttachment): this {
        if (attachment) {
            this.data.attachment = (<IIsAttachment>attachment).toAttachment ? (<IIsAttachment>attachment).toAttachment() : <IAttachment>attachment;
        }
        return this;
    }

    quickReplies(list: IQuickReply[] | IIsQuickReply[]): this {
        if (list) {
            this.data.quick_replies = [];
            for (let i = 0; i < list.length; i++) {
                let item = list[i];
                this.data.quick_replies.push((<IIsQuickReply>item).toQuickReply ? (<IIsQuickReply>item).toQuickReply() : <IQuickReply>item);
            }
        } else {
            delete this.data.quick_replies;
        }
        return this;
    }

    toMessage(): IFBMessage {
        return this.data;
    }
}
