import { Vector } from "./Vector";

export class Color extends Vector {
    public constructor(e0?: number, e1?: number, e2?: number) {
        super(e0, e1, e2);
    }

    public static writeColor(pixelColor: Color): void {
        // Write the translated [0,255] value of each color component.
        console.log(`${ Math.floor(255.999 * pixelColor.x()) } ${ Math.floor(255.999 * pixelColor.y()) } ${ Math.floor(255.999 * pixelColor.z()) }`);
    }
}
