export default class PointCosumed {
    payer: string;
    points: number;
    constructor(payer: string, points: number) {
        this.payer = payer;
        this.points = points;
    }
}