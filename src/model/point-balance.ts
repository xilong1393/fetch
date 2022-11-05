export default class PointBalance {
    public payer: string;
    public points: number;
    public lastUpdated: Date;
    constructor(payer: string, points: number, lastUpdated: Date) {
        this.payer = payer;
        this.points = points;
        this.lastUpdated = lastUpdated;
    }
}