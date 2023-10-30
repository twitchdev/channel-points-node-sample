const TwitchTools = require("../src/Class/TwitchTools");

// customRewardBody
const customRewardBody = {
    title: "Sample: Follow me!",
    prompt: "Follows the requesting user!",
    cost: 10 * 1000 * 1000,
    is_enabled: true,
    is_global_cooldown_enabled: true,
    global_cooldown_seconds: 10 * 60,
}


const ToolsTwitch = new TwitchTools('10z462rarqn42whrqd0cbpuhfyifdk','faxsoydixvpqrncuis1a76u6czvxhr')

// test validadeToken
// ToolsTwitch.GetUserIdTwitch().then((res) => console.log(res))

// test getCustomRewards
// ToolsTwitch.getCustomRewards().then(res => console.log(res))

// test addCustomReward
ToolsTwitch.addCustomReward(customRewardBody).then(res => console.log(res))