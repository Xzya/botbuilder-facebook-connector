import { ICardAction } from "botbuilder";

type ButtonType = IButton | IIsButton;
type TemplateElementType = ITemplateElement | IIsTemplateElement;

export interface IIsAttachmentPayload {
    toPayload(): IAttachmentPayload;
}

export interface IAttachmentPayload {
}

export interface IIsAttachment {
    toAttachment(): IAttachment;
}

export interface IAttachment {
    type: string;
    payload: IAttachmentPayload;
}

export interface IMediaPayload extends IAttachmentPayload {
    url?: string;
    is_reusable?: boolean;
}

export interface IIsQuickReply {
    toQuickReply(): IQuickReply;
}

export interface IQuickReply {
    content_type: string;
    title?: string;
    payload?: string | number;
    image_url?: string;
}

export interface IIsFBMessage {
    toMessage(): IFBMessage;
}

export interface IFBMessage {
    text?: string;
    attachment?: IAttachment;
    quick_replies?: IQuickReply[];
}

export interface IIsButton {
    toButton(): IButton;
}

export interface IButton {
    type: string;
    title: string;
    url?: string;
    payload?: string;
    share_contents?: IAttachment;
    messenger_extensions?: boolean;
    webview_height_ratio?: string;
    fallback_url?: string;
}

export interface ITemplatePayload extends IAttachmentPayload {
    template_type: string;
    elements?: ITemplateElement[];
    sharable?: boolean;
    image_aspect_ratio?: string;
    top_element_style?: string;
    buttons?: ButtonType[];
}

export interface IIsTemplateElement {
    toElement(): ITemplateElement;
}

export interface ITemplateElement {
    title: string;
    subtitle?: string;
    image_url?: string;
    default_action?: IButton;
    buttons?: IButton[];
    media_type?: string;
    attachment_id?: string;
    url?: string;
}

interface IKeyboard {
    buttons: ICardAction[];
}
