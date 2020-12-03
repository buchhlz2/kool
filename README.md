# Google Speech-to-Text API
Basic web app that (currently) has static audio file (in `/sample-audio`) converted from speech to text & displayed in the web UI. Future-state to allow file upload and storge within GCloud; currently only pulls the hard-coded file from GCloud.

## Available Scripts

In the project directory, you can run:

### `npm run start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view frontend in the browser.
Open [http://localhost:8080/audio-transcription](http://localhost:8080) to view the backend data.

Be sure to create the project & set up all relevant credentials on GCloud -- including:
- Cloud-to-Speech-Text API
- GCloud Storage

Once this is set up, you must create a [Service Account Key](https://cloud.google.com/docs/authentication/getting-started#setting_the_environment_variable) -- download the `.json` file and place it in a local directory titled `private`. Additionally, you must create a `.env` file in the root directory that specifies the following:
- `PORT=8080`
- `GOOGLE_APPLICATION_CREDENTIALS="./private/<YOUR_KEY_FILE>.json"`