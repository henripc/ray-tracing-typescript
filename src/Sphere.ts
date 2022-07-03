import { HitRecord, Hittable } from "./Hittable";
import { Ray } from "./Ray";
import { Vector } from "./Vector";

export class Sphere implements Hittable {
    public center: Vector;
    public radius: number;

    public constructor(center: Vector, radius: number) {
        this.center = center;
        this.radius = radius;
    }

    public hit(r: Ray, tMin: number, tMax: number, rec: HitRecord): boolean {
        const oc = Vector.sumOfVectors(r.origin, this.center.scalarMultiplication(-1));

        const a = r.direction.lengthSquared();
        const halfB = Vector.dot(oc, r.direction);
        const c = oc.lengthSquared() - this.radius * this.radius;

        const discriminant = halfB * halfB - a * c;
        if (discriminant < 0) return false;
        const sqrtD = Math.sqrt(discriminant);

        // Find the nearest root that lies in the acceptable range.
        let root = (-halfB - sqrtD) / a;
        if (root < tMin || tMax < root) {
            root = (-halfB + sqrtD) / a;
            if (root < tMin || tMax < root) {
                return false;
            }
        }

        rec.t = root;
        rec.p = r.at(rec.t);
        const outwardNormal = Vector.sumOfVectors(rec.p, this.center.scalarMultiplication(-1)).scalarDivision(this.radius);
        rec.setFaceNormal(r, outwardNormal);

        return true;
    }

}