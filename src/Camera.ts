import { Vector } from "./Vector";
import { Ray } from "./Ray";

export class Camera {
    private origin: Vector;
    private lowerLeftCorner: Vector;
    private horizontal: Vector;
    private vertical: Vector;

    public constructor() {
        const aspectRatio = 16 / 9;
        const viewportHeight = 2;
        const viewportWidth = aspectRatio * viewportHeight;
        const focalLength = 1;

        this.origin = new Vector();
        this.horizontal = new Vector(viewportWidth, 0, 0);
        this.vertical = new Vector(0, viewportHeight, 0);
        this.lowerLeftCorner = Vector.sumOfVectors(
            this.origin,
            this.horizontal.scalarMultiplication(-0.5),
            this.vertical.scalarMultiplication(-0.5),
            (new Vector(0, 0, focalLength).scalarMultiplication(-1))
        );
    }

    public getRay(u: number, v: number): Ray {
        return new Ray(
            this.origin,
            Vector.sumOfVectors(
                this.lowerLeftCorner,
                this.horizontal.scalarMultiplication(u),
                this.vertical.scalarMultiplication(v),
                this.origin.scalarMultiplication(-1)
            )
        );
    }
}