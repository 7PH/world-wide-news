/**
 * @TODO document
 *
 * @param latitude
 * @param longitude
 * @return {{x: number, y: number, z: number}}
 */
export function lat2xyz(latitude, longitude) {
    /**
     *      x = -((radius) * Math.sin(phi)*Math.cos(theta)),
            z = ((radius) * Math.sin(phi)*Math.sin(theta)),
            y = ((radius) * Math.cos(phi));
     */
    const phi = (90 - latitude) * (Math.PI / 180);
    const theta = (longitude + 180) * (Math.PI / 180);
    return {
        x: - Math.sin(phi) * Math.cos(theta),
        y: Math.cos(phi),
        z: Math.sin(phi) * Math.sin(theta)
    };
}
