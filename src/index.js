const TwitchTools = require("./Class/TwitchTools");
require("dotenv").config()

const customRewardBody = {
    title: "Sample: Follow me!",
    prompt: "Follows the requesting user!",
    cost: 10 * 1000 * 1000,
    is_enabled: true,
    is_global_cooldown_enabled: true,
    global_cooldown_seconds: 10 * 60,
}

const ToolsTwitch = new TwitchTools(process.env.TwitchAccessToken, process.env.TwitchClientId, customRewardBody)

// main function - sets up the reward and sets the interval for polling
const main = async () => {
    if (await ToolsTwitch.validateToken() === null) return
    let rewardId = ""

    let rewards = await ToolsTwitch.getCustomRewards()
    if (rewards !== null) {
        rewards.forEach(v => {
            // since the title is enforced as unique, it will be a good identifier to use to get the right ID on cold-boot
            if (v.title == customRewardBody.title) {
                rewardId = v.id
            }
        })
    } else {
        console.log("The streamer does not have access to Channel Points. They need to be a Twitch Affiliate or Partner.");
    }
    // if the reward isn't set up, add it 
    if (rewardId == "" && await ToolsTwitch.addCustomReward() === false) {
        return
    }

    ToolsTwitch.pollForRedemptions()
}

// start the script
main()