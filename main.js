const { openStreamDeck } = require('elgato-stream-deck');
const AudioRecorder = require('node-audiorecorder');

class Button {
    constructor(keyIndex, streamDeck) {
        this.keyIndex = keyIndex;
        this.streamDeck = streamDeck;
    }
    onKeyDown() {
    }

    onKeyUp() {

    }

    getImage() {

    }

    getColor() {
        return [0,0,0];
    }
}

class RecordButton extends Button {
    constructor(keyIndex, streamDeck, audioRecorder) {
        super(keyIndex, streamDeck);
        this.audioRecorder = audioRecorder;
        this.recording = false;
    }
    onKeyUp() {
        if (this.recording) {
            this.recording = false;
            this.streamDeck.fillColor(this.keyIndex, ...this.getColor());
            this.audioRecorder.stop();
        } else {
            this.recording = true;
            this.streamDeck.fillColor(this.keyIndex, 0, 255, 0);
            this.audioRecorder.start();
        }
    }
    getColor() {
        return [255,0,0];
    }
}


function main() {
    const streamDeck = openStreamDeck();
    const options = {
        program: `arecord`,
        device: null,
        channels: 1,        // Channel count.
        format: `S16_LE`,   // Encoding type. (only for `arecord`)
        rate: 16000,        // Sample rate.
        type: `wav`,        // Format type.
    };
    
    const audioRecorder = new AudioRecorder(options, console);

    const buttons = [
        new RecordButton(0, streamDeck, audioRecorder),
        new Button(1, streamDeck),
        new Button(2, streamDeck),
        new Button(3, streamDeck),
        new Button(4, streamDeck),
        new Button(5, streamDeck),
    ];

    streamDeck.on('down', (keyIndex) => {
        const button = buttons.find(b => b.keyIndex === keyIndex);
        button.onKeyDown();
    });

    streamDeck.on('up', (keyIndex) => {
        const button = buttons.find(b => b.keyIndex === keyIndex);
        button.onKeyUp();
    });

    // Fired whenever an error is detected by the `node-hid` library.
    // Always add a listener for this event! If you don't, errors will be silently dropped.
    streamDeck.on('error', (error) => {
        console.error(error)
    });

    buttons.forEach(b => {
        streamDeck.fillColor(b.keyIndex, ...b.getColor())
    });
}

try {
    main();
} catch (error) {
    console.log(error);
}