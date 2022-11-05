
export default class PointEvent {
    public payer: string;
    public points: number;
    public timestamp: Date;
    constructor(payer: string, points: number, timestamp: Date) {
        this.payer = payer;
        this.points = points;
        this.timestamp = timestamp;
    }
}