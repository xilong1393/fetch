import PointBalance from "./point-balance";

export default class PointBalanceSummary {
    public payer: string;
    public sum: number = 0;
    public cursor: number = 0;
    public pointBalances: PointBalance[]=[]
    constructor(payer: string) {
        this.payer = payer;
    }
}