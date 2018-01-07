import { IAttachment, IButton, IIsButton } from "../interfaces";

export var ButtonTypes = {
    web_url: "web_url",
    postback: "postback",
    element_share: "element_share",
}

export var WebviewHeightRatioTypes = {
    compact: "compact",
    tall: "tall",
    full: "full",
}

export class Button implements IIsButton {
    protected data = <IButton>{};

    public type(type: string): this {
        if (type) {
            this.data.type = type;
        }
        return this;
    }

    public url(url: string): this {
        if (url) {
            this.data.url = url;
        }
        return this;
    }

    public title(title: string): this {
        if (title) {
            this.data.title = title;
        }
        return this;
    }

    public payload(payload: string): this {
        if (payload) {
            this.data.payload = payload;
        }
        return this;
    }

    public shareContents(content: IAttachment): this {
        if (content) {
            this.data.share_contents = content;
        }
        return this;
    }

    public messengerExtensions(enabled: boolean): this {
        this.data.messenger_extensions = enabled;
        return this;
    }

    public webviewHeightRatio(text: string): this {
        if (text) {
            this.data.webview_height_ratio = text;
        }
        return this;
    }

    public fallbackURL(text: string): this {
        if (text) {
            this.data.fallback_url = text;
        }
        return this;
    }

    public toButton(): IButton {
        return this.data;
    }

    static webURL(title: string, url: string): Button {
        return new Button().type(ButtonTypes.web_url).title(title).url(url)
    }

    static postback(title: string, payload: string): Button {
        return new Button().type(ButtonTypes.postback).title(title).payload(payload)
    }

    static share(contents?: IAttachment): Button {
        return new Button().type(ButtonTypes.element_share).shareContents(contents)
    }
}
