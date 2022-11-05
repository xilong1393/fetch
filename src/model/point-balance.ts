export default class PointBalance {
    payer: string;
    points: number;
    lastUpdated: Date;
    constructor(payer: string, points: number, lastUpdated: Date) {
        this.payer = payer;
        this.points = points;
        this.lastUpdated = lastUpdated;
    }
}