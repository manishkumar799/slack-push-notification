const { WebClient } = require("@slack/web-api");

const options = {};
const web = new WebClient(process.env.SLACK_TOKEN, options);

const sendSlackMessage = async (message, channel = null) => {
  return new Promise(async (resolve, reject) => {
    const channelId = channel || process.env.SLACK_CHANNEL_ID;
    try {
      const resp = await web.chat.postMessage({
        text: message, // Use the actual message instead of "message"
        channel: channelId,
      });
      return resolve(resp.ts); // Resolve with the timestamp of the message
    } catch (error) {
      console.log(error);
      const errorMessage = error?.data?.error;
      if (errorMessage === "not_in_channel") {
        console.log("not in channel");
        await joinSlackChannel(channelId, message);
      }
      return resolve(null); // Resolve with null on error
    }
  });
};

const sendSlackMultiImage = async (images, channel = null, threadTs = null) => {
  return new Promise(async (resolve, reject) => {
    const channelId = channel || process.env.SLACK_CHANNEL_ID;
    try {
        await web.files.uploadV2({
          file: images,
          channel_id: channelId,
          filename: new Date().toISOString() + ".png",
          thread_ts: threadTs, // Use thread_ts to send images in the same thread
        });
      return resolve(true);
    } catch (error) {
      console.log(error);
      return resolve(false); // Resolve with false on error
    }
  });
};

// Example usage
// (async () => {
//   const message = "Here are some images:";
//   const images = ["path/to/image1.png", "path/to/image2.png"]; // Replace with actual image paths
//   const channelId = "C12345678"; // Optional: specify channel ID

//   const threadTs = await sendSlackMessage(message, channelId);
//   if (threadTs) {
//     await sendSlackMultiImage(images, channelId, threadTs);
//   } else {
//     console.log("Failed to send message.");
//   }
// })();


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
