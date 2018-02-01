import Rect from "../rect";
import Thread from "../../../util/thread";
import MPromise from "../../../util/promise";
import BoxCollisionDetector from "../../../effect/collision/boxCollisionDetector";
import CollisionDetector from "../../../effect/collision/collisionDetector";
import Component from "../component";

export default class Sprite extends Rect {
    xSpeed : number;
    ySpeed : number;
    xAcceleration : number;
    yAcceleration : number;
    private collisionDetector : CollisionDetector;
    private detectCollisionThread : Thread;
    private detectXCollisionThread : Thread;
    private detectYCollisionThread : Thread;
    private detectCollisionLock : boolean;
    private lastTime : number;
    onCollision : Function;

    constructor(parent? : Component) {
        super(parent);

        this.xSpeed = 0;//大约一毫秒移动的x距离
        this.ySpeed = 0;//大约一毫秒移动的y距离
        this.xAcceleration = 0;//x加速度，大约一毫秒增加或减小的速度值
        this.yAcceleration = 0;//y加速度

        this.setStyle("zIndex", 1000);

        this.collisionDetector = new BoxCollisionDetector();
        this.detectCollisionThread = new Thread(this.collisionDetector.thread_detectCollision);
        this.detectXCollisionThread = new Thread(this.collisionDetector.thread_detectCollision);
        this.detectYCollisionThread = new Thread(this.collisionDetector.thread_detectCollision);
    }

    initCfg(cfg : any) : Promise<any>{
        let promise = super.initCfg(cfg);
        return promise;
    }

    draw(ctx : CanvasRenderingContext2D) : boolean {
        let currentTime = (new Date()).getTime();
        if (!this.lastTime)
        {
            this.lastTime = currentTime;
        }
        else
        {
            if (currentTime - this.lastTime >= 1)//大约1毫秒执行一次
            {
                if (this.xAcceleration !== 0)
                {
                    this.xSpeed = this.xSpeed + this.xAcceleration;
                }
                if (this.yAcceleration !== 0)
                {
                    this.ySpeed = this.ySpeed + this.yAcceleration;
                }

                if ((this.xSpeed !== 0 || this.ySpeed !== 0) && !this.detectCollisionLock)
                {
                    //先判断当前是否在障碍中
                    this.detectCollisionLock = true;
                    this.collisionDetector.detectCollision(this, this.getX(), this.getY(), this.detectCollisionThread, true).then(()=>{
                    }, ()=>{
                    }).finally(()=>{
                        this.collisionDetector.detectCollision(this, this.getX() + this.xSpeed, this.getY() + this.ySpeed, this.detectCollisionThread).then(()=>{
                            this.setStyle("x", this.getX() + this.xSpeed);
                            this.setStyle("y", this.getY() + this.ySpeed);
                            this.detectCollisionLock = false;
                        }, ()=>{
                            //x或y方向发生碰撞，则只移动x或y
                            let promise1 = new MPromise();
                            this.collisionDetector.detectCollision(this, this.getX() + this.xSpeed, this.getY(), this.detectXCollisionThread).then(()=>{
                                this.setStyle("x", this.getX() + this.xSpeed);
                            }, ()=>{
                                this.xSpeed = 0;
                            }).finally(()=>{
                                promise1.resolve();
                            });
                            let promise2 = new MPromise();
                            this.collisionDetector.detectCollision(this, this.getX(), this.getY() + this.ySpeed, this.detectYCollisionThread).then(()=>{
                                this.setStyle("y", this.getY() + this.ySpeed);
                            }, ()=>{
                                this.ySpeed = 0;
                            }).finally(()=>{
                                promise2.resolve();
                            });

                            Promise.all([promise1,promise2]).then(()=>{
                                this.detectCollisionLock = false;

                                if (this.onCollision && typeof(this.onCollision) === "function")//碰撞事件回调
                                {
                                    this.onCollision.apply(this, []);
                                }
                            });
                        });
                    });
                }
                this.lastTime = currentTime;
            }
        }
        if (!super.draw(ctx)) {
            return false;
        }
        return true;
    }

    destroy(){
        super.destroy();

        if (this.detectCollisionThread)
        {
            this.detectCollisionThread.terminate();
        }
        if (this.detectXCollisionThread)
        {
            this.detectXCollisionThread.terminate();
        }
        if (this.detectYCollisionThread)
        {
            this.detectYCollisionThread.terminate();
        }
    }
}