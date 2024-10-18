const { WebClient } = require("@slack/web-api");

const options = {};
const web = new WebClient(process.env.SLACK_TOKEN, options);

const sendSlackMessage = async (message, channel = null) => {
  return new Promise(async (resolve, reject) => {
    const channelId = channel || process.env.SLACK_CHANNEL_ID;
    try {
      //   const resp = await web.chat.postMessage({
      //     text: "message",
      //     channel: channelId,
      //   });

      await web.files.uploadV2({
        file: message,
        channel_id: channelId,
        filename: new Date().toISOString()+".png",
      });
      return resolve(true);
    } catch (error) {
      console.log(error);
      const errorMessage = error?.data?.error;
      if (errorMessage == "not_in_channel") {
        console.log("not in channel");
        await joinSlackChannel(channelId, message);
      }
      return resolve(true);
    }
  });
};
const sendSlackMultiImage = async (Images, channel = null) => {
  return new Promise(async (resolve, reject) => {
    const channelId = channel || process.env.SLACK_CHANNEL_ID;
    try {
      await web.files.uploadV2({
        file: Images,
        channel_id: channelId,
        filename: new Date().toISOString()+".png",
      });
      return resolve(true);
    } catch (error) {
      console.log(error);
      return resolve(true);
    }
  });
};

const joinSlackChannel = (channel, message = null) => {
  return new Promise(async (resolve, reject) => {
    try {
      const resp = await web.conversations.join({
        channel: channel,
      });
      console.log(resp);
      if (message) {
        await sendSlackMessage(message, channel);
      }
      return resolve(true);
    } catch (error) {
      console.log(JSON.stringify(error));
      return resolve(true);
    }
  });
};

module.exports = {
  sendSlackMessage,
  joinSlackChannel,
  sendSlackMultiImage
};
