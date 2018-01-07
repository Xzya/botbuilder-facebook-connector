import { IQuickReply, IIsQuickReply } from "../interfaces";

export var QuickReplyTypes = {
    text: "text",
    location: "location",
}

export class QuickReply implements IIsQuickReply {
    protected data = <IQuickReply>{};

    constructor() {
        this.data.content_type = QuickReplyTypes.text;
    }

    contentType(text: string): this {
        if (text) {
            this.data.content_type = text;
        }
        return this;
    }

    title(text: string): this {
        if (text) {
            this.data.title = text;
        }
        return this;
    }

    payload(payload: string | number): this {
        if (payload) {
            this.data.payload = payload;
        }
        return this;
    }

    imageURL(text: string): this {
        if (text) {
            this.data.image_url = text;
        }
        return this;
    }

    toQuickReply(): IQuickReply {
        return this.data;
    }

    static text(title: string, payload: string, imageURL?: string): QuickReply {
        return new QuickReply().contentType(QuickReplyTypes.text).title(title).payload(payload).imageURL(imageURL)
    }

    static location(): QuickReply {
        return new QuickReply().contentType(QuickReplyTypes.location)
    }
}
