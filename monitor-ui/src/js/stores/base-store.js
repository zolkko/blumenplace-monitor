import EventEmitter from "events";


export default class BaseStore extends EventEmitter {
    constructor() {
        super();
        this._dispatchToken = null;
    }

    subscribe(actionSubscribe) {
        console.log("subscribe to base store");
        this._dispatchToken = null; //AppDispatcher.register(actionSubscribe());
    }

    get dispatchToken() {
        console.log("dispatch token");
        return this._dispatchToken;
    }

    emitChange() {
        console.log("emit change");
        this.emit("CHANGE");
    }

    addChangeListener(cb) {
        console.log("add change to listener");
        this.on("CHANGE", cb)
    }

    removeChangeListener(cb) {
        console.log("remove listener");
        this.removeListener("CHANGE", cb);
    }
}
