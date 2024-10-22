require("dotenv").config();
const {
  sendSlackMessage,
  joinSlackChannel,
  sendSlackMultiImage,
} = require("./utils/slack.util");

// console.log("🚀 Slack Notifier 🚀");
// // joinSlackChannel(process.env.SLACK_CHANNEL_ID);
const sendMessage = async (message) => {
  const threadTs = await sendSlackMessage(message, null);
  if (threadTs) {
    for (let url of imageUrls) sendOneFile(url, threadTs);
  } else {
    console.log("Failed to send message.");
  }
};

sendMessage("RETURN TO SUPERVISOR ITEM RECEIVED:\n Order number:\n Frame size & Style:\n Return notes:\n Related photos");

const https = require("https");

// URL of the file you want to log
const url = "https://tpc.googlesyndication.com/simgad/9175322197911545976";
const imageUrls = [
  "https://tpc.googlesyndication.com/simgad/9175322197911545976",
  "https://t3.ftcdn.net/jpg/06/15/49/68/360_F_615496890_W34yB8VDE6n5pehb5QCt1ek5oEvRo9qA.jpg",
  "https://sandbox.returnranger.ikshudigital.com/ReturnRanger.png",
  "https://img.freepik.com/premium-photo/full-shot-girl-learning-math-school_23-2150470852.jpg?t=st=1729589841~exp=1729590441~hmac=ede022faa34e1244b8a4e1fea082babb66be8fb659185110c250557ef7bce1ac&w=826",
];
// sendOneFile()

function sendOneFile(url, threadTs) {
  https
    .get(url, (res) => {
      if (res.statusCode !== 200) {
        console.error(`Failed to get '${url}' (${res.statusCode})`);
        return;
      }

      let data = []; // Array to accumulate chunks of data

      // A chunk of data has been received
      res.on("data", (chunk) => {
        data.push(chunk); // Push each chunk to the array
      });

      // The whole response has been received
      res.on("end", async () => {
        const buffer = Buffer.concat(data); // Combine all chunks into a single Buffer
        try {
          const response = await sendSlackMultiImage(buffer, null, threadTs); // Send the full file data
          console.log("File uploaded successfully:", response);
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      });
    })
    .on("error", (err) => {
      console.error("Error fetching the file:", err);
    });
}

const downloadImage = (url) => {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`Failed to get '${url}' (${res.statusCode})`));
          return;
        }

        const data = [];
        res.on("data", (chunk) => data.push(chunk));
        res.on("end", () => {
          const buffer = Buffer.concat(data);
          resolve(buffer);
        });
      })
      .on("error", (err) => {
        reject(new Error("Error fetching the file: " + err.message));
      });
  });
};

// Function to download all images and send them
// const sendAllImages = async (threadTs) => {
//   try {
//     const buffers = await Promise.all(
//       imageUrls.map((url) => downloadImage(url))
//     );
//     for (const buffer of buffers) {
//       const response = await sendSlackMessage(buffer,null,threadTs);
//       console.log("File uploaded successfully:", response);
//     }
//   } catch (error) {
//     console.error("Error during image processing:", error);
//   }
// };

// sendAllImages();
