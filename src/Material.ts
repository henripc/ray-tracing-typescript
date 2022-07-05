import { Ray } from "./Ray";
import { HitRecord } from "./Hittable";
import { Color } from "./Color";
import { Vector } from "./Vector";

export interface Material {
    scatter(rIn: Ray, rec: HitRecord, attenuation: Color, scattered: Ray): boolean;
}

export class Lambertian implements Material {
    public albedo: Color;

    public constructor(albedo: Color) {
        this.albedo = albedo;
    }

    scatter(rIn: Ray, rec: HitRecord, attenuation: Color, scattered: Ray): boolean {
        let scatteredDirection = Vector.sumOfVectors(rec.normal, Vector.randomUnitVector());

        // Catch degenerate scatter direction
        if (scatteredDirection.nearZero()) {
            scatteredDirection = rec.normal;
        }

        scattered.orig = rec.p;
        scattered.dir = scatteredDirection;
        attenuation.e[0] = this.albedo.x();
        attenuation.e[1] = this.albedo.y();
        attenuation.e[2] = this.albedo.z();

        return true;
    }
}

export class Metal implements Material {
    public albedo: Color;
    public fuzz: number;

    public constructor(albedo: Color, fuzz: number) {
        this.albedo = albedo;
        this.fuzz = fuzz < 1 ? fuzz : 1;
    }

    scatter(rIn: Ray, rec: HitRecord, attenuation: Color, scattered: Ray): boolean {
        const reflected = Vector.reflect(Vector.unitVector(rIn.direction), rec.normal);
        scattered.orig = rec.p;
        scattered.dir = Vector.sumOfVectors(
            reflected,
            Vector.randomInUnitSphere().scalarMultiplication(this.fuzz)
        );
        attenuation.e[0] = this.albedo.x();
        attenuation.e[1] = this.albedo.y();
        attenuation.e[2] = this.albedo.z();

        return Vector.dot(scattered.direction, rec.normal) > 0;
    }
}
