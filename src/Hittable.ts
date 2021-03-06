import { Vector } from "./Vector";
import { Ray } from "./Ray";
import { Lambertian, Material } from "./Material";
import { Color } from "./Color";

export class HitRecord {
    public p: Vector;
    public normal: Vector;
    public mat: Material;
    public t: number;
    public frontFace: boolean;

    public constructor() {
        this.p = new Vector();
        this.normal = new Vector();
        this.mat = new Lambertian(new Color());
        this.t = 0;
        this.frontFace = false;
    }

    public setFaceNormal(r: Ray, outwardNormal: Vector): void {
        this.frontFace = Vector.dot(r.direction, outwardNormal) < 0;
        this.normal = this.frontFace ? outwardNormal : outwardNormal.scalarMultiplication(-1);
    }
}

export interface Hittable {
    hit(r: Ray, tMin: number, tMax: number, rec: HitRecord): boolean;
}