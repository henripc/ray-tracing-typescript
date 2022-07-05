import { Vector } from "./Vector";
import { Ray } from "./Ray";
import { degreeToRadians } from "./RtWeekend";

export class Camera {
    private origin: Vector;
    private lowerLeftCorner: Vector;
    private horizontal: Vector;
    private vertical: Vector;
    private u: Vector;
    private v: Vector;
    private w: Vector;
    private lensRadius: number;

    public constructor(
        lookFrom: Vector,
        lookAt: Vector,
        vUp: Vector,
        vFov: number,   // vFov: vertical field-of-view in degrees
        aspectRatio: number,
        aperture: number,
        focusDist: number
    ) {
        const theta = degreeToRadians(vFov);
        const h = Math.tan(theta / 2);
        const viewportHeight = 2 * h;
        const viewportWidth = aspectRatio * viewportHeight;

        this.w = Vector.unitVector(Vector.sumOfVectors(
            lookFrom,
            lookAt.scalarMultiplication(-1)
        ));
        this.u = Vector.unitVector(Vector.cross(vUp, this.w));
        this.v = Vector.cross(this.w, this.u);

        this.origin = lookFrom;
        this.horizontal = this.u.scalarMultiplication(focusDist * viewportWidth);
        this.vertical = this.v.scalarMultiplication(focusDist * viewportHeight);
        this.lowerLeftCorner = Vector.sumOfVectors(
            this.origin,
            this.horizontal.scalarMultiplication(-0.5),
            this.vertical.scalarMultiplication(-0.5),
            this.w.scalarMultiplication(-focusDist)
        );

        this.lensRadius = aperture / 2;
    }

    public getRay(s: number, t: number): Ray {
        const rd = Vector.randomInUnitDisk().scalarMultiplication(this.lensRadius);
        const offset = Vector.sumOfVectors(
            this.u.scalarMultiplication(rd.x()),
            this.v.scalarMultiplication(rd.y())
        );

        return new Ray(
            Vector.sumOfVectors(this.origin, offset),
            Vector.sumOfVectors(
                this.lowerLeftCorner,
                this.horizontal.scalarMultiplication(s),
                this.vertical.scalarMultiplication(t),
                this.origin.scalarMultiplication(-1),
                offset.scalarMultiplication(-1)
            )
        );
    }
}