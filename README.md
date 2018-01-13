# BotBuilder Facebook Connector

Library for connecting to Facebook directly using BotBuilder.

# Usage

Install

```
npm install botbuilder-facebook-connector --save
```

You can create the connector by passing the settings for connecting to Facebook, or by passing a [messenger-bot](https://github.com/remixz/messenger-bot) instance

```javascript
// passing settings
let connector = new FacebookConnector(null, {
    token: process.env.FACEBOOK_TOKEN,
    verify: process.env.FACEBOOK_VERIFY,
});

// passing messenger-bot instance
import { FacebookConnector } from "botbuilder-facebook-connector";
import * as Bot from "messenger-bot";
let messengerBot = new Bot({
    token: process.env.FACEBOOK_TOKEN,
    verify: process.env.FACEBOOK_VERIFY,
});
let connector = new FacebookConnector(messengerBot);
```

# Supported send components

- [ ] Cards
    - [x] Hero card
    - [x] Thumbnail card
    - [ ] Receipt card
    - [ ] Sign-in card
    - [x] Animation card
    - [x] Audio card
    - [ ] Video card (I get no response from facebook on this one, no idea why)
    - [ ] Adaptive card, not supported by facebook, Microsoft just renders to an image, [more info](https://github.com/Microsoft/AdaptiveCards/issues/367)

# Supported receive components

- [x] Quick replies
    - [x] Text [ref](https://developers.facebook.com/docs/messenger-platform/reference/send-api/quick-replies)
    - [x] Location [ref](https://developers.facebook.com/docs/messenger-platform/reference/send-api/quick-replies)
- [ ] Buttons
    - [ ] Buy button [ref](https://developers.facebook.com/docs/messenger-platform/reference/buttons/buy)
    - [ ] Call button [ref](https://developers.facebook.com/docs/messenger-platform/reference/buttons/call)
    - [ ] Game play button [ref](https://developers.facebook.com/docs/messenger-platform/reference/buttons/game-play)
    - [ ] Login button [ref](https://developers.facebook.com/docs/messenger-platform/reference/buttons/login)
    - [ ] Logout button [ref](https://developers.facebook.com/docs/messenger-platform/reference/buttons/logout)
    - [x] Postback button [ref](https://developers.facebook.com/docs/messenger-platform/reference/buttons/postback)
    - [x] Share button [ref](https://developers.facebook.com/docs/messenger-platform/reference/buttons/share)
    - [x] URL button [ref](https://developers.facebook.com/docs/messenger-platform/reference/buttons/url)
- [ ] Templates
    - [ ] Button template [ref](https://developers.facebook.com/docs/messenger-platform/reference/template/button)
    - [x] Generic template [ref](https://developers.facebook.com/docs/messenger-platform/reference/template/generic)
    - [x] List template [ref](https://developers.facebook.com/docs/messenger-platform/reference/template/list)
    - [x] Media template [ref](https://developers.facebook.com/docs/messenger-platform/reference/template/media)
    - [x] Open graph template [ref](https://developers.facebook.com/docs/messenger-platform/reference/template/open-graph)
    - [ ] Receipt template [ref](https://developers.facebook.com/docs/messenger-platform/reference/template/receipt)
    - [ ] Airline boarding pass template [ref](https://developers.facebook.com/docs/messenger-platform/reference/template/airline-boarding-pass)
    - [ ] Airline check-in reminder template [ref](https://developers.facebook.com/docs/messenger-platform/reference/template/airline-checkin)
    - [ ] Airline itinerary template [ref](https://developers.facebook.com/docs/messenger-platform/reference/template/airline-itinerary)
    - [ ] Airline flight update template [ref](https://developers.facebook.com/docs/messenger-platform/reference/template/airline-flight-update)
