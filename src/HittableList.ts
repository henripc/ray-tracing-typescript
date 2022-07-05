import { HitRecord, Hittable } from "./Hittable";
import { Ray } from "./Ray";

export class HittableList implements Hittable {
    public objects: Hittable[] = [];

    public constructor(object?: Hittable) {
        if (object) {
            this.add(object);
        }
    }

    public clear() {
        this.objects.length = 0;
    }

    public add(object: Hittable): void {
        this.objects.push(object);
    }

    hit(r: Ray, tMin: number, tMax: number, rec: HitRecord): boolean {
        const tempRec = new HitRecord();
        let hitAnything = false;
        let closestSoFar = tMax;

        for (const object of this.objects) {
            if (object.hit(r, tMin, closestSoFar, tempRec)) {
                hitAnything = true;
                closestSoFar = tempRec.t;
                
                rec.p = tempRec.p;
                rec.normal = tempRec.normal;
                rec.t = tempRec.t;
                rec.frontFace = tempRec.frontFace;
                rec.mat = tempRec.mat;
            }
        }

        return hitAnything;
    }
}
