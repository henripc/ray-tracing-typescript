import { clamp } from "./RtWeekend";
import { Vector } from "./Vector";

export class Color extends Vector {
    public constructor(e0?: number, e1?: number, e2?: number) {
        super(e0, e1, e2);
    }

    public static writeColor(pixelColor: Color, samplesPerPixel: number): void {
        let r = pixelColor.x();
        let g = pixelColor.y();
        let b = pixelColor.z();

        // Divide the color by the number of samples.
        const scale = 1 / samplesPerPixel;
        r *= scale;
        g *= scale;
        b *= scale;

        // Write the translated [0,255] value of each color component.
        console.log(`${ Math.floor(256 * clamp(r, 0, 0.999)) } ${ Math.floor(256 * clamp(g, 0, 0.999)) } ${ Math.floor(256 * clamp(b, 0, 0.999)) }`);
    }
}
