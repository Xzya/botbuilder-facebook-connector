import { IAttachment, ITemplateElement, IIsTemplateElement, IIsFBMessage, IFBMessage, TemplateElementType, ButtonType, IIsButton, IButton, ITemplatePayload } from "../interfaces";
import { FBMessage } from "./Message";

export var TemplateTypes = {
    generic: "generic",
    list: "list",
    media: "media",
    open_graph: "open_graph",
}

export var ImageAspectRatioTypes = {
    horizontal: "horizontal",
    square: "square",
}

export var TopElementStyles = {
    compact: "compact",
    large: "large",
}

export class Template implements IIsFBMessage {
    protected data = <IAttachment>{};

    constructor() {
        this.data.type = "template";
        this.data.payload = <ITemplatePayload>{};
    }

    public templateType(text: string): this {
        if (text) {
            (<ITemplatePayload>this.data.payload).template_type = text;
        }
        return this;
    }

    public elements(list: TemplateElementType[]): this {
        if (list) {
            (<ITemplatePayload>this.data.payload).elements = [];
            for (let i = 0; i < list.length; i++) {
                let item = list[i];
                (<ITemplatePayload>this.data.payload).elements.push((<IIsTemplateElement>item).toElement ? (<IIsTemplateElement>item).toElement() : <ITemplateElement>item);
            }
        } else {
            delete (<ITemplatePayload>this.data.payload).elements;
        }
        return this;
    }

    public sharable(enabled: boolean): this {
        if (enabled != null) {
            (<ITemplatePayload>this.data.payload).sharable = enabled;
        }
        return this;
    }

    public imageAspectRatio(text: string): this {
        if (text) {
            (<ITemplatePayload>this.data.payload).image_aspect_ratio = text;
        }
        return this;
    }

    public topElementStyle(text: string): this {
        if (text) {
            (<ITemplatePayload>this.data.payload).top_element_style = text;
        }
        return this;
    }

    public buttons(list: ButtonType[]): this {
        if (list) {
            (<ITemplatePayload>this.data.payload).buttons = [];
            for (let i = 0; i < list.length; i++) {
                let item = list[i];
                (<ITemplatePayload>this.data.payload).buttons.push((<IIsButton>item).toButton ? (<IIsButton>item).toButton() : <IButton>item);
            }
        } else {
            delete (<ITemplatePayload>this.data.payload).buttons;
        }
        return this;
    }

    toMessage(): IFBMessage {
        return new FBMessage().attachment(this.data).toMessage();
    }

    static generic(elements: TemplateElementType[], sharable?: boolean, imageAspectRatio?: string): Template {
        return new Template()
            .templateType(TemplateTypes.generic)
            .elements(elements)
            .imageAspectRatio(imageAspectRatio)
            .sharable(sharable)
    }

    static list(elements: TemplateElementType[], topElementStyle?: string, buttons?: ButtonType[]): Template {
        return new Template()
            .templateType(TemplateTypes.list)
            .elements(elements)
            .topElementStyle(topElementStyle)
            .buttons(buttons)
    }

    static media(elements: TemplateElementType[]): Template {
        return new Template()
            .templateType(TemplateTypes.media)
            .elements(elements)
    }

    static openGraph(elements: TemplateElementType[]): Template {
        return new Template()
            .templateType(TemplateTypes.open_graph)
            .elements(elements)
    }
}
