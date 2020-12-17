# Channel Points Sample Code for NodeJS

This is a basic sample that aims to show how to use the new [Channel Points APIs](https://blog.twitch.tv/en/2020/11/13/twitch-developer-day-2020-introducing-the-channel-points-api-eventsub-and-more/), including creating rewards, getting rewards, getting redemptions, and updating the fulfillment status of each reward. 

To do so, this sample will: 

* Create a new custom reward (if it doesn't exist)
* Poll for new redemptions
* Follow the user as the action
* Mark the redemption as fulfilled (or cancelled if an error happens)

This sample is in Node to show the ease of the new APIs. 

**Note**

This example polls for redemptions, but for larger-scale production tools, you should look into using [EventSub's Channel Points Webhook](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types#channelchannel_points_custom_reward_redemptionadd) as it will scale more quickly than this example. 

## How to Use

To use this sample, you will need to do three things:

* Get a user token with appropriate scopes
* Set the token in a `.env` file
* Install required packages

### Getting a Token

The first is to install the Twitch CLI [here](https://github.com/twitchdev/twitch-cli) which will enable you to generate a token quickly using the following command: 

```sh
twitch token -u -s "channel:manage:redemptions user:edit:follows"
```

Alternatively, you can generate a token using the normal OAuth 2.0 flow as described in the [Authentication Docs](https://dev.twitch.tv/docs/authentication). The token requires two scopes: 

* channel:manage:redemptions
* user:edit:follows

### Setting the Token in an Environment File (.env)

Once you have the token, you will want to copy `.env-sample` into a new file `.env`. Once you've done so, set the `TWITCH_ACCESS_TOKEN` to the token generated above. 

An example .env file would look like: 

``` 
TWITCH_ACCESS_TOKEN=abcdef12345
```

The sample will call the validate endpoint to get the broadcaster and Client ID used here. 

### Install Required Packages

To install the required packages, you just need to run the following in the root of the project: 

```sh
npm install
```

### Running the Sample

Once you've done the above, you can run the sample. 

To do so, simply run: 

```sh
npm start
```

This will start the file. 

## Adjusting the File

All of the code is in the [`index.js`](index.js) file. Please feel free to update the `customRewardBody` variable to meet your needs. 