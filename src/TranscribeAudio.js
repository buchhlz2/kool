import React from 'react';
import Spinner from './Spinner';

class TranscribeAudio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            audioTranscriptionString: "",
            selectedFile: null
    };
        this.getAudioTranscription = this.getAudioTranscription.bind(this);
    }
    async getAudioTranscription() {
        document.querySelector('#loader').style.display = 'block';
        const response = await fetch('http://localhost:8080/audio-transcription');
        document.querySelector('#loader').style.display = 'none';
        if (!response.ok) {
            const errMessage = `An error has occured: ${response.status}`;
            console.log(errMessage)
            throw new Error(errMessage);
        }

        const audioData = await response.json();
        console.log(audioData);
        this.setState(state => ({
            audioTranscriptionString: audioData.transcribed
        }));
    }

    render() {
        return (
          <div>
            <h2>Click the "Transcribe" button</h2>
            <button type="button" onClick={this.getAudioTranscription}>
              Transcribe
            </button>
            <div className="wip">
              <p>
                * FILE SELECT/UPLOAD TO INTERACT WITH ML SPEECH API -- IS A WIP & NOT LIVE;
                SHOWN FOR DEMO PURPOSES *
              </p>
              <form
                action="api/upload-file"
                method="post"
                encType="multipart/form-data"
              >
                <input type="file" name="audioFile" />
                <input type="submit" value="Upload File" name="submit" />
              </form>
            </div>
            <div id="loader" style={{ display: "none" }}>
              <Spinner />
            </div>
            <h2>Transcription:</h2>
            <p>{this.state.audioTranscriptionString}</p>
          </div>
        );
    }
}

export default TranscribeAudio;

