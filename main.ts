import { Color } from './src/Color';
import { Vector } from './src/Vector';
import { Ray } from "./src/Ray";
import { HittableList } from "./src/HittableList";
import { Sphere } from "./src/Sphere";
import { HitRecord } from './src/Hittable';
import { INFINITY, randomDouble } from "./src/RtWeekend";
import { Camera } from "./src/Camera";

const rayColor = (r: Ray, world: HittableList): Color => {
    const rec = new HitRecord();

    if (world.hit(r, 0, INFINITY, rec)) {
        return Vector.sumOfVectors(rec.normal, new Color(1, 1, 1)).scalarMultiplication(0.5);
    }

    const unitDirection = Vector.unitVector(r.direction);
    const t = 0.5 * (unitDirection.y() + 1);

    return Vector.sumOfVectors((new Color(1, 1, 1)).scalarMultiplication(1 - t), (new Color(0.5, 0.7, 1)).scalarMultiplication(t));
};

// Image
const aspectRatio = 16 / 9;
const imageWidth = 400;
const imageHeight = Math.floor(imageWidth / aspectRatio);
const samplesPerPixel = 100;

// World
const world = new HittableList();
world.add(new Sphere(new Vector(0, 0, -1), 0.5));
world.add(new Sphere(new Vector(0, -100.5, -1), 100));

// Camera
const cam = new Camera();

// Render
console.log(`P3\n${ imageWidth } ${ imageHeight }\n255`);

for (let j = imageHeight - 1; j >= 0; j--) {
    console.error(`Scanlines remaining: ${ j }`);
    for (let i = 0; i < imageWidth; i++) {
        let pixelColor = new Color(0, 0, 0);        
        for (let s = 0; s < samplesPerPixel; s++) {
            const u = (i + randomDouble()) / (imageWidth - 1);
            const v = (j + randomDouble()) / (imageHeight - 1);    
            const r = cam.getRay(u, v);
            pixelColor = Vector.sumOfVectors(pixelColor, rayColor(r, world));    
        }

        Color.writeColor(pixelColor, samplesPerPixel);
    }
}

console.error('Done.');
