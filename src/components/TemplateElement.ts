import { IIsTemplateElement, ITemplateElement, IButton, IIsButton, ButtonType } from "../interfaces";
import { Button } from "./Button";

export var MediaTypes = {
    image: "image",
    video: "video",
}

export class TemplateElement implements IIsTemplateElement {
    protected data = <ITemplateElement>{};

    public title(text: string): this {
        if (text) {
            this.data.title = text;
        }
        return this;
    }

    public subtitle(text: string): this {
        if (text) {
            this.data.subtitle = text;
        }
        return this;
    }

    public imageURL(text: string): this {
        if (text) {
            this.data.image_url = text;
        }
        return this;
    }

    public defaultAction(action: ButtonType): this {
        if (action) {
            this.data.default_action = (<IIsButton>action).toButton ? (<IIsButton>action).toButton() : <IButton>action;
        }
        return this;
    }

    public buttons(list: ButtonType[]): this {
        if (list) {
            this.data.buttons = [];
            for (let i = 0; i < list.length; i++) {
                let item = list[i];
                this.data.buttons.push((<IIsButton>item).toButton ? (<IIsButton>item).toButton() : <IButton>item);
            }
        } else {
            delete this.data.buttons;
        }
        return this;
    }

    public mediaType(text: string): this {
        if (text) {
            this.data.media_type = text;
        }
        return this;
    }

    public attachmentID(text: string): this {
        if (text) {
            this.data.attachment_id = text;
        }
        return this;
    }

    public url(text: string): this {
        if (text) {
            this.data.url = text;
        }
        return this;
    }

    public toElement(): ITemplateElement {
        return this.data;
    }

    static generic(title: string, subtitle?: string, imageURL?: string, defaultAction?: IButton, buttons?: ButtonType[]): TemplateElement {
        return new TemplateElement().title(title).subtitle(subtitle).imageURL(imageURL).defaultAction(defaultAction).buttons(buttons)
    }

    static list(title: string, subtitle?: string, imageURL?: string, defaultAction?: IButton, buttons?: ButtonType[]): TemplateElement {
        return new TemplateElement().title(title).subtitle(subtitle).imageURL(imageURL).defaultAction(defaultAction).buttons(buttons)
    }

    static imageID(attachmentID: string, buttons?: ButtonType[]): TemplateElement {
        return new TemplateElement().mediaType(MediaTypes.image).attachmentID(attachmentID).buttons(buttons)
    }

    static imageURL(url: string, buttons?: ButtonType[]): TemplateElement {
        return new TemplateElement().mediaType(MediaTypes.image).url(url).buttons(buttons)
    }

    static videoID(attachmentID: string, buttons?: ButtonType[]): TemplateElement {
        return new TemplateElement().mediaType(MediaTypes.video).attachmentID(attachmentID).buttons(buttons)
    }

    static videoURL(url: string, buttons?: ButtonType[]): TemplateElement {
        return new TemplateElement().mediaType(MediaTypes.video).url(url).buttons(buttons)
    }

    static openGraph(url: string, buttons?: ButtonType[]): TemplateElement {
        return new TemplateElement().url(url).buttons(buttons)
    }
}
