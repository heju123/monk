/**
 * Created by heju on 2017/7/21.
 */
import {Controller,Component} from "~/js/main";

export default class Test1Controller extends Controller{
    constructor(component : Component) {
        super(component);
        // this.component.registerEvent("click", (e)=>{
        //     console.log("test1");
        // });
        // this.component.registerEvent("click", (e)=>{
        //     console.log("click");
        // });
        //
        // this.component.registerEvent("mousedown", function(e){
        //     console.log("mousedown");
        // });
        //
        // this.component.registerEvent("mousemove", function(e){
        //     console.log("mousemove");
        // });
        //
        // this.component.registerEvent("mouseup", function(e){
        //     console.log("mouseup");
        // });
        //
        // this.component.registerEvent("keydown", function(e){
        //     console.log("keydown");
        // });
        // this.component.registerEvent("keyup", function(e){
        //     console.log("keyup");
        // });
    }

    onClick(width, height, num, str, f, e){
        console.log(width,height,num,str,f);
    }

    imgClick(e)
    {
        console.log(e);
    }

    getChild(child1, child2, self){
        console.log(child1, child2, self);
    }

    changeRoute(e){
        let mainRoute = this.viewState.getComponentById("mainRoute");
        mainRoute.changeRoute("main");
    }
}