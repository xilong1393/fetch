import PointBalance from "./point-balance";

export default class PointBalanceSummary {
    payer: string;
    sum: number = 0;
    cursor: number = 0;
    pointBalances: PointBalance[] = []
    constructor(payer: string) {
        this.payer = payer;
    }
}