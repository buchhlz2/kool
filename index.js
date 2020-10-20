const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT;
// Imports the Google Cloud client library.
const {Storage} = require('@google-cloud/storage');

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  next();
})

// Instantiates a client. If you don't specify credentials when constructing
// the client, the client library will look for credentials in the
// environment.
const storage = new Storage();
// Makes an authenticated API request.
async function listBuckets() {
  try {
    const results = await storage.getBuckets();

    const [buckets] = results;

    console.log('Buckets:');
    buckets.forEach((bucket) => {
      console.log(bucket.name);
    });
  } catch (err) {
    console.error('ERROR:', err);
  }
}
listBuckets();

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

app.listen(PORT, () => {
  console.log(`App listening at on port ${PORT}`);
});
