import React from 'react';

class TranscribeAudio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {audioTranscriptionString: ""};
        this.getAudioTranscription = this.getAudioTranscription.bind(this);
    }
    async getAudioTranscription() {
        const response = await fetch('http://localhost:8080/audio-transcription');
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
                <button type="button" onClick={this.getAudioTranscription}>Transcribe</button>
                <p>{this.state.audioTranscriptionString}</p>
            </div>
        );
    }
}

export default TranscribeAudio;

