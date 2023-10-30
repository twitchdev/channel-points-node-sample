const axios = require("axios")

class TwitchTools {
    constructor(TwitchAccessToken, TwitchClientId, customRewardBody = {}) {
        this.headers = {
            "Authorization": `Bearer ${TwitchAccessToken}`,
            "Client-ID": TwitchClientId,
            "Content-Type": "application/json"
        }

        this.customRewardBody = customRewardBody

        this.followUser = async (fromUser, toUser) => {
            try {
                await axios.post(`https://api.twitch.tv/helix/users/follows?from_id=${fromUser}&to_id=${toUser}`, {
                    headers: this.headers
                })
                return true
            } catch (error) {
                console.log(`Unable to follow user ${toUser}`)
                return false
            }
        }

    }

    async validateToken() {
        try {
            await axios.get(`https://id.twitch.tv/oauth2/validate`, {
                headers: this.headers
            })

            return true
        } catch (err) {
            console.log('Invalid token. Please get a new token using twitch token -u -s "channel:manage:redemptions user:edit:follows"');
            return null
        }
    }

    async GetUserIdTwitch() {
        try {
            const responseTwitch_id = await axios.get(`https://id.twitch.tv/oauth2/validate`, {
                headers: this.headers
            })

            return responseTwitch_id.data.user_id
        } catch (err) {
            return null
        }
    }

    async getCustomRewards() {
        try {
            // user_id
            const userId = await this.GetUserIdTwitch()

            if (userId !== null) {
                const responseTwitch_CustomRewards = await axios.get(`https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=${userId}`, {
                    headers: this.headers
                })

                return responseTwitch_CustomRewards.data
            }

            return `UserId null`
        } catch (error) {
            console.log(error.response.data.message);
            return null
        }
    }

    async addCustomReward() {
        try {
            const userId = await this.GetUserIdTwitch()

            const reponseTwtich_AddCustomReward = await axios.post(`https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=${userId}`, this.customRewardBody, {
                headers: this.headers
            })

            return {
                rewardId: reponseTwtich_AddCustomReward.data[0].id,
                success: true
            }
        } catch (error) {
            console.log(error.response.data.message);
            return false
        }
    }

    async pollForRedemptions() {
        try {
            const userId = await this.GetUserIdTwitch()
            const data = await this.addCustomReward()

            const responseTwitch_PollForRedemptions = await axios.post(`https://api.twitch.tv/helix/channel_points/custom_rewards/redemptions?broadcaster_id=${userId}&reward_id=${data.rewardId}&status=UNFULFILLED`, {
                headers: this.headers
            })

            let redemptions = responseTwitch_PollForRedemptions.data
            let successfulRedemptions = []
            let failedRedemptions = []

            for (let redemption of redemptions) {
                // can't follow yourself :) 
                if (redemption.broadcaster_id == redemption.user_id) {
                    failedRedemptions.push(redemption.id)
                    continue
                }
                // if failed, add to the failed redemptions
                if (await this.followUser(redemption.broadcaster_id, redemption.user_id) == false) {
                    failedRedemptions.push(redemption.id)
                    continue
                }
                // otherwise, add to the successful redemption list
                successfulRedemptions.push(redemption.id)
            }

            // do this in parallel
            await Promise.all([
                this.fulfillRewards(successfulRedemptions, "FULFILLED"),
                this.fulfillRewards(failedRedemptions, "CANCELED")
            ])

            console.log(`Processed ${successfulRedemptions.length + failedRedemptions.length} redemptions.`)

            // instead of an interval, we wait 15 seconds between completion and the next call
            setTimeout(this.pollForRedemptions, 15 * 1000)
        } catch (error) {
            console.log("Unable to fetch redemptions.")
        }
    }

    async fulfillRewards(ids, status) {
        // if empty, just cancel
        if (ids.length == 0) {
            return
        }

        // transforms the list of ids to ids=id for the API call
        ids = ids.map(v => `id=${v}`)

        const userId = await this.GetUserIdTwitch()
        const data = await this.addCustomReward()

        try {
            await axios.patch(`https://api.twitch.tv/helix/channel_points/custom_rewards/redemptions?broadcaster_id=${userId}&reward_id=${data.rewardId}&${ids.join("&")}`, {
                headers: this.headers,
                json: {
                    status: status
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

}

module.exports = TwitchTools