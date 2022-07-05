import { Color } from './src/Color';
import { Vector } from './src/Vector';
import { Ray } from "./src/Ray";
import { HittableList } from "./src/HittableList";
import { Sphere } from "./src/Sphere";
import { HitRecord } from './src/Hittable';
import { INFINITY, randomDouble } from "./src/RtWeekend";
import { Camera } from "./src/Camera";
import { Lambertian, Metal } from './src/Material';

const rayColor = (r: Ray, world: HittableList, depth: number): Color => {
    const rec = new HitRecord();

    // If we've exceeded the ray bounce limit, no more light is gathered.
    if (depth <= 0) return new Color(0, 0, 0);

    if (world.hit(r, 0.001, INFINITY, rec)) {
        const scattered = new Ray(new Vector(), new Vector());
        const attenuation = new Color();

        if (rec.mat.scatter(r, rec, attenuation, scattered)) {
            return Vector.multiplicationOfVectors(attenuation, rayColor(scattered, world, depth - 1));
        }

        return new Color();
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
const maxDepth = 50;

// World
const world = new HittableList();

const materialGround = new Lambertian(new Color(0.8, 0.8, 0));
const materialCenter = new Lambertian(new Color(0.7, 0.3, 0.3));
const materialLeft = new Metal(new Color(0.8, 0.8, 0.8), 0.3);
const materialRight = new Metal(new Color(0.8, 0.6, 0.2), 1);

world.add(new Sphere(new Vector(0, -100.5, -1), 100, materialGround));
world.add(new Sphere(new Vector(0, 0, -1), 0.5, materialCenter));
world.add(new Sphere(new Vector(-1, 0, -1), 0.5, materialLeft));
world.add(new Sphere(new Vector(1, 0, -1), 0.5, materialRight));

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
            pixelColor = Vector.sumOfVectors(pixelColor, rayColor(r, world, maxDepth));
        }

        Color.writeColor(pixelColor, samplesPerPixel);
    }
}

console.error('Done.');
