export default class PointCosumed {
    public payer: string;
    public points: number;
    constructor(payer: string, points: number) {
        this.payer = payer;
        this.points = points;
    }
}