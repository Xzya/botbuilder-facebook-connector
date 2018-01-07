import { IAttachment, IIsAttachmentPayload, IAttachmentPayload, IIsAttachment } from "../interfaces";

export var AttachmentTypes = {
    image: "image",
    video: "video",
    audio: "audio",
    file: "file",
}

export class Attachment implements IIsAttachment {
    protected data = <IAttachment>{};

    type(text: string): this {
        if (text) {
            this.data.type = text;
        }
        return this;
    }

    payload(payload: IAttachmentPayload): this {
        if (payload) {
            this.data.payload = (<IIsAttachmentPayload>payload).toPayload ? (<IIsAttachmentPayload>payload).toPayload() : <IAttachmentPayload>payload;
        }
        return this;
    }

    toAttachment(): IAttachment {
        return this.data;
    }

    static image(url?: string, is_reusable?: boolean): Attachment {
        return new Attachment().type(AttachmentTypes.image).payload({ url, is_reusable })
    }

    static video(url?: string, is_reusable?: boolean): Attachment {
        return new Attachment().type(AttachmentTypes.video).payload({ url, is_reusable })
    }

    static audio(url?: string, is_reusable?: boolean): Attachment {
        return new Attachment().type(AttachmentTypes.audio).payload({ url, is_reusable })
    }

    static file(url?: string, is_reusable?: boolean): Attachment {
        return new Attachment().type(AttachmentTypes.file).payload({ url, is_reusable })
    }
}
