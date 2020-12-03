const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();
const Multer = require("multer");
const PORT = process.env.PORT || 8080;
const ENV = process.env.NODE_ENV || "development";
// Imports the Google Cloud client library.
const { Storage } = require('@google-cloud/storage');
const format = require("util").format;

app.use(cors());
app.use(bodyParser.json());
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
});

// Instantiates a client. If you don't specify credentials when constructing
// the client, the client library will look for credentials in the
// environment.
const storage = new Storage();
// Makes an authenticated API request.
async function getBucketIds() {
  try {
    const results = await storage.getBuckets();

    const [buckets] = results;

    console.log("Buckets:");
    const bucketIds = buckets.map((bucket) => {
      return bucket.id;
    });
    console.log(bucketIds);
    return bucketIds;

  } catch (err) {
    console.error("ERROR:", err);
  }
};

const fileStorageBucketIds = getBucketIds();
const fileStorageProdBucket = storage.bucket('kool-292023.appspot.com');
const fileStorageDevBucket = storage.bucket('staging.kool-292023.appspot.com');
console.log(fileStorageDevBucket);

app.post("/api/upload-file", multer.single("audioFile"), (req, res, next) => {
  if (!req.file) {
    res.status(400).send("No file uploaded.");
    return;
  }

  // Create a new blob in the bucket and upload the file data.
  const blob = fileStorageDevBucket.file(`${Date.now()}_${req.file.originalname}`);
  const blobStream = blob.createWriteStream();

  blobStream.on("error", (err) => {
    next(err);
  });

  blobStream.on("finish", () => {
    // The public URL can be used to directly access the file via HTTP.
    const publicUrl = format(
      `https://storage.googleapis.com/upload/storage/v1/b/staging.kool-292023.appspot.com/${blob.name}`
    );
    res.status(200).send(publicUrl);
  });

  blobStream.end(req.file.buffer);
});

async function getLatestFile() {
  try {
    console.log("test get file");

  } catch (err) {
    console.error("ERROR:", err);
  }
};

app.get("/audio-transcription", (req, res) => {
  // Set up gcloud speech API
  async function main() {
    // Imports the Google Cloud client library
    const speech = require("@google-cloud/speech");
    const fs = require("fs");

    // Creates a client
    const client = new speech.SpeechClient();

    // The name of the audio file to transcribe
    const fileName = "./sample-audio/audio-test-1.wav";

    // Reads a local audio file and converts it to base64
    const file = fs.readFileSync(fileName);
    const audioBytes = file.toString("base64");

    // The audio file's encoding, sample rate in hertz, and BCP-47 language code
    const audio = {
      content: audioBytes,
    };
    const config = {
      encoding: "WAV",
      languageCode: "en-US",
    };
    const request = {
      audio: audio,
      config: config,
    };

    // Detects speech in the audio file
    const [response] = await client.recognize(request);
    const transcription = response.results
      .map((result) => result.alternatives[0].transcript)
      .join("\n");
    console.log(`Transcription: ${transcription}`);
    res.json({transcribed: `${transcription}`});
  }
  main().catch(console.error);
});

if (ENV === "production") {
  app.use(express.static(path.join(__dirname, "./build")));

  app.get("/*", (req, res) => {
    res.sendFile(
      path.join(__dirname, "./build/index.html"),
      (err) => {
        if (err) {
          res.status(500).send(err);
        }
      }
    );
  });
};

app.listen(PORT, () => {
  console.log(`App listening at on port ${PORT}`);
});
