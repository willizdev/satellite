export function randomInt(rand_min: number, rand_max: number) {
    const min = Math.ceil(rand_min);
    const max = Math.floor(rand_max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}
