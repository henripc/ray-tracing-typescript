import { Ray } from "./Ray";
import { HitRecord } from "./Hittable";
import { Color } from "./Color";
import { Vector } from "./Vector";
import { randomDouble } from "./RtWeekend";

export interface Material {
    scatter(rIn: Ray, rec: HitRecord, attenuation: Color, scattered: Ray): boolean;
}

export class Lambertian implements Material {
    public albedo: Color;

    public constructor(albedo: Color) {
        this.albedo = albedo;
    }

    public scatter(rIn: Ray, rec: HitRecord, attenuation: Color, scattered: Ray): boolean {
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

    public scatter(rIn: Ray, rec: HitRecord, attenuation: Color, scattered: Ray): boolean {
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

export class Dielectric implements Material {
    public ir: number;  // Index of Refraction

    public constructor(indexOfRefraction: number) {
        this.ir = indexOfRefraction;
    }

    private static reflectance(cosine: number, refIdx: number): number {
        // Use Schlick's approximation for reflectance.
        let r0 = (1 - refIdx) / (1 + refIdx);
        r0 = r0 * r0;

        return r0 + (1 - r0) * Math.pow(1 - cosine, 5);
    }

    public scatter(rIn: Ray, rec: HitRecord, attenuation: Color, scattered: Ray): boolean {
        attenuation.e[0] = 1;
        attenuation.e[1] = 1;
        attenuation.e[2] = 1;

        const refractionRatio = rec.frontFace ? (1 / this.ir) : this.ir;

        const unitDirection = Vector.unitVector(rIn.direction);
        const cosTheta = Math.min(Vector.dot(unitDirection.scalarMultiplication(-1), rec.normal), 1); 
        const sinTheta = Math.sqrt(1 - cosTheta * cosTheta);

        const cannotRefract = refractionRatio * sinTheta > 1;
        let direction: Vector;

        if (cannotRefract || Dielectric.reflectance(cosTheta, refractionRatio) > randomDouble()) {
            direction = Vector.reflect(unitDirection, rec.normal);
        } else {
            direction = Vector.refract(unitDirection, rec.normal, refractionRatio);
        }

        scattered.orig = rec.p;
        scattered.dir = direction;

        return true;
    }

}
