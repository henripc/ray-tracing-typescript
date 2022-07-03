export class Vector {
    public e: number[];

    public constructor(e0 = 0, e1 = 0, e2 = 0) {
        this.e = [e0, e1, e2];
    }

    public x(): number {
        return this.e[0];
    }

    public y(): number {
        return this.e[1];
    }

    public z(): number {
        return this.e[2];
    }

    public toString(): string {
        return `${ this.x() } ${ this.y() } ${ this.z() }`;
    }

    public scalarMultiplication(t: number): Vector {
        return new Vector(this.e[0] * t, this.e[1] * t, this.e[2] * t);
    }

    public scalarDivision(t: number): Vector {
        return this.scalarMultiplication(1 / t);
    }

    public lengthSquared(): number {
        return this.e[0] * this.e[0] + this.e[1] * this.e[1] + this.e[2] * this.e[2];
    }

    public length(): number {
        return Math.sqrt(this.lengthSquared());
    }

    public oppositeVector(): Vector {
        return new Vector(-this.x(), -this.y(), -this.z());
    }

    public static sumOfVectors(...vectors: Vector[]): Vector {
        const resultVector = new Vector();
        for (const vector of vectors) {
            resultVector.e[0] += vector.x();
            resultVector.e[1] += vector.y();
            resultVector.e[2] += vector.z();
        }

        return resultVector;
    }

    public static multiplicationOfVectors(...vectors: Vector[]): Vector {
        const resultVector = new Vector(1, 1, 1);
        for (const vector of vectors) {
            resultVector.e[0] *= vector.x();
            resultVector.e[1] *= vector.y();
            resultVector.e[2] *= vector.z();
        }

        return resultVector;
    }

    public static dot(u: Vector, v: Vector): number {
        return u.e[0] * v.e[0] + u.e[1] * v.e[1] + u.e[2] * v.e[2];
    }

    public static cross(u: Vector, v: Vector): Vector {
        return new Vector(
            u.e[1] * v.e[2] - u.e[2] * v.e[1],
            u.e[2] * v.e[0] - u.e[0] * v.e[2],
            u.e[0] * v.e[1] - u.e[1] * v.e[0]
        );
    }

    public static unitVector(v: Vector): Vector {
        return v.scalarDivision(v.length());
    }
}
