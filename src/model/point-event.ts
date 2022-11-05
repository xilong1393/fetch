// this is the transaction event
export default class PointEvent {
    payer: string;
    points: number;
    timestamp: Date;
    constructor(payer: string, points: number, timestamp: Date) {
        this.payer = payer;
        this.points = points;
        this.timestamp = timestamp;
    }
}