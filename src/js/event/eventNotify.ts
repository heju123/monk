/**
 * Created by heju on 2017/7/26.
 */
import EventListener from "./eventListener";

//事件通知类
export default class EventNotify {
    batchNo : number;
    type : number;
    px : number;
    py : number;
    sourceEvent : any;
    listener : EventListener;

    constructor() {
    }

    /**
     * 设置通知，下次循环draw的时候用这些值判断是否触发事件
     */
    set(obj : any){
        this.batchNo = obj.batchNo;//批次号，表明是哪一批次的事件
        this.type = obj.type;//1：鼠标相关事件；2：键盘事件
        this.px = obj.px;
        this.py = obj.py;
        this.sourceEvent = obj.sourceEvent;
        this.listener = obj.listener;
    }
}