import { Vector } from './Vector';

export class Ray {
    public orig: Vector;
    public dir: Vector;

    public constructor(origin: Vector, direction: Vector) {
        this.orig = origin;
        this.dir = direction;
    }

    
    public get origin() : Vector {
        return this.orig
    }
        
    public get direction() : Vector {
        return this.dir;
    }
    
    public at(t: number): Vector {
        return Vector.sumOfVectors(this.orig, this.dir.scalarMultiplication(t));
    }
}
