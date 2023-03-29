import logo from "./logo.svg";
import "./App.css";
import AudioEngine from "spectrogram-drawer";
import { Component } from "react";

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      audioEngine: null
    };

    this.mode = 'HEART';
  }

  componentDidMount() {
    this.heartData();
  }

  heartData = async () => {
    let a = await AudioEngine.initAudioEngine(
      "canvas",
      "va1vuCRG3fGDGB2ddGwjqQ=="
    );
    this.setState({ audioEngine:  a});
  };

  lungData = async () => {
    let a = await AudioEngine.initAudioEngine(
      "canvas",
      "va1vuCRG3fGDGB2ddGwjqQ==",
      { mode: "LUNG" }
    );
    this.setState({ audioEngine:  a});
  };

  start = () => {
    console.log('aaa');
    console.log(this.state.audioEngine, this.state);
    this.state.audioEngine.startIt(false).then((res) => {
      this.state.audioEngine.loadOpusDecoder();
    });
  };

  loadAudioFile = () => {
    this.mode == "HEART"
      ? this.createHeartInputFiles()
      : this.createLungInputFiles();
  };

  // load audio from local file
  createLungInputFiles = () => {
    const audioContext = new AudioContext();
    fetch("assets/lung.wav")
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
      .then((audioBuffer) => {
        this.state.audioEngine.testAudioInput(audioBuffer.getChannelData(0));
      });
  };

  createHeartInputFiles = () => {
    const audioContext = new AudioContext();
    fetch("assets/heart.wav")
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
      .then((audioBuffer) => {
        this.state.audioEngine.testAudioInput(audioBuffer.getChannelData(0));
      });
  };

  // audio load from microphone
  startMicRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      let self = this;
      const context = new AudioContext({ sampleRate: 16000 });
      const source = context.createMediaStreamSource(stream);
      const processor = context.createScriptProcessor(1024, 1, 1);

      source.connect(processor);
      processor.connect(context.destination);

      processor.onaudioprocess = function (e) {
        self.playAudioInput(e.inputBuffer);
      };
    });
  };

  playAudioInput = (audioBuffer) => {
    this.state.audioEngine.testAudioInput(audioBuffer.getChannelData(0));
  };

  render() {
    return (
      <div className="App">
        <div className="frame">
          <canvas id="canvas"></canvas>
        </div>

        <div className="actions">
          <div>
            <button onClick={() => this.start()}>Start</button>
            <button onClick={() => this.loadAudioFile()}>Load audio</button>
            <button onClick={() => this.startMicRecording()}>Microphone</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
