import { Color } from './src/Color';
import { Vector } from './src/Vector';
import { Ray } from "./src/Ray";
import { HittableList } from "./src/HittableList";
import { Sphere } from "./src/Sphere";
import { HitRecord } from './src/Hittable';
import { INFINITY, PI, randomDouble } from "./src/RtWeekend";
import { Camera } from "./src/Camera";
import { Dielectric, Lambertian, Material, Metal } from './src/Material';

const randomScene = (): HittableList => {
    const world = new HittableList();

    const groundMaterial = new Lambertian(new Color(0.5, 0.5, 0.5));
    world.add(new Sphere(new Vector(0, -1000, 0), 1000, groundMaterial));

    for (let a = -11; a < 11; a++) {
        for (let b = -11; b < 11; b++) {
            const chooseMat = randomDouble();
            const center = new Vector(a + 0.9 * randomDouble(), 0.2, b + 0.9 * randomDouble());

            if (Vector.sumOfVectors(center, (new Vector(4, 0.2, 0)).scalarMultiplication(-1)).length() > 0.9) {
                let sphereMaterial: Material;

                if (chooseMat < 0.8) {
                    // diffuse
                    const albedo = Vector.multiplicationOfVectors(Color.random(), Color.random());
                    sphereMaterial = new Lambertian(albedo);
                    world.add(new Sphere(center, 0.2, sphereMaterial));
                } else if (chooseMat < 0.95) {
                    // metal
                    const albedo = Color.random(0.5, 1);
                    const fuzz = randomDouble(0, 0.5);
                    sphereMaterial = new Metal(albedo, fuzz);
                    world.add(new Sphere(center, 0.2, sphereMaterial));
                } else {
                    // glass
                    sphereMaterial = new Dielectric(1.5);
                    world.add(new Sphere(center, 0.2, sphereMaterial));
                }
            }
        }
    }

    const material1 = new Dielectric(1.5);
    world.add(new Sphere(new Vector(0, 1, 0), 1, material1));

    const material2 = new Lambertian(new Color(0.4, 0.2, 0.1));
    world.add(new Sphere(new Vector(-4, 1, 0), 1, material2));

    const material3 = new Metal(new Color(0.7, 0.6, 0.5), 0);
    world.add(new Sphere(new Vector(4, 1, 0), 1, material3));

    return world;
};

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
const aspectRatio = 3 / 2;
const imageWidth = 1200;
const imageHeight = Math.floor(imageWidth / aspectRatio);
const samplesPerPixel = 500;
const maxDepth = 50;

// World
const world = randomScene();

// Camera
const lookFrom = new Vector(13, 2, 3);
const lookAt = new Vector(0, 0, 0);
const vUp = new Vector(0, 1, 0);
const distToFocus = 10;
const aperture = 0.1;

const cam = new Camera(lookFrom, lookAt, vUp, 20, aspectRatio, aperture, distToFocus);

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
