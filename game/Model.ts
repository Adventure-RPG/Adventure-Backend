export interface Identifiable {
    _id?: number;
}
export abstract class Model implements Identifiable {
    constructor(public _id?) {}

    public get id(){
        return this._id;
    }

    public set id(id: number){
        this._id = id;
    }
    public equal(id: number): boolean {
        return (this.id === id);
    }
}
