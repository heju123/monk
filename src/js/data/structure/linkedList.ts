class LinkedItem<T>{
    value : T;
    next : LinkedItem<T>;
    prev : LinkedItem<T>;

    constructor(value) {
        this.value = value;
    }
}

export default class LinkedList<T>{
    head : LinkedItem<T>;
    rear : LinkedItem<T>;

    constructor() {
    }

    add(obj : T){
        if (obj)
        {
            let data : LinkedItem<T> = new LinkedItem(obj);
            if (!this.head)
            {
                this.head = data;
                this.rear = data;
            }
            else
            {
                this.rear.next = data;
                data.prev = this.rear;
                this.rear = data;
            }
        }
    }

    remove(obj : LinkedItem<T>){
        if (obj)
        {
            if (obj.prev)
            {
                obj.prev.next = obj.next;
                if (obj.next)
                {
                    obj.next.prev = obj.prev;
                }
            }
            else
            {
                this.head = obj.next;
                if (obj.next)
                {
                    obj.next.prev = undefined;
                }
            }
            if (!obj.next)
            {
                if (obj.prev)
                {
                    this.rear = obj.prev;
                }
                else
                {
                    this.rear = undefined;
                }
            }
        }
    }

    clear(){
        this.head = undefined;
        this.rear = undefined;
    }
}