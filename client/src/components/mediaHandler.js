// активатор стрима
export default class MediaHandler {

    constructor(soundState){
        this.soundState=soundState;
    }

    getPermissions() {
        return new Promise((res) => {
            let soundOn = window.confirm('стрим со звуком?');
            navigator.mediaDevices.getUserMedia({video: true, audio: soundOn})
                .then((stream) => {
                    console.log(res)
                    res(stream);
                })
                // .catch(err => {
                //     throw new Error(`Unable to fetch stream ${err}`);
                // })
        });
    }
}
