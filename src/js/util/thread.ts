import MPromise from "./promise";

export default class Thread {
    worker : Worker;
    callbackPromise : MPromise;

    constructor(fun : Function) {
        if(typeof(Worker)!=="undefined")
        {
            let scriptDom : HTMLScriptElement = <HTMLScriptElement>document.createElement("SCRIPT");
            scriptDom.setAttribute("type", "javascript/worker");
            let textDom = document.createTextNode("self.onmessage=" + fun.toString());
            scriptDom.appendChild(textDom);
            let blob = new Blob([scriptDom.text], { type: "text/plain" });
            this.worker = new Worker(window.URL.createObjectURL(blob));

            this.worker.onmessage = (e)=> {
                if (this.callbackPromise)
                {
                    this.callbackPromise.resolve(e.data);
                }
            };
        }
    }

    /**
     * 开始线程
     *
     * @param data 发送的数据
     * @param replacer function对象，作为JSON.stringify的过滤器
     */
    run(data : any, replacer : Function){
        let sendData;
        if (typeof(data) == "object")
        {
            sendData = JSON.stringify(data, <any>replacer);
        }
        else
        {
            sendData = data;
        }
        this.callbackPromise = new MPromise();
        this.worker.postMessage(sendData);
        return this.callbackPromise;
    }

    terminate(){
        this.worker.terminate();
    }
}