// Constants
export const INFINITY = Infinity;
export const PI = Math.PI;

// Utility Functions
export const degreeToRadians = (degrees: number): number => {
    return degrees * PI / 180;
};

export const randomDouble = (min?: number, max?: number): number => {
    // Returns a random real in [min,max) or [0, 1).
    if (min && max) {
        return min + (max - min) * randomDouble();
    }

    return Math.random();
};

export const clamp = (x: number, min: number, max: number): number => {
    if (x < min) return min;
    if (x > max) return max;
            
    return x;
};