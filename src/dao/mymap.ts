import PointBalanceSummary from "../model/point-balance-summary";

export default class MyMap {

    // this provides a pointblance summary for each payer
    public map: Map<string, PointBalanceSummary> = new Map<string, PointBalanceSummary>();

    // this is used to validate input data, to make sure the points to be spent is less than the total points left
    public total: number = 0;
    
    serialize() {
        return {
            total: this.total,
            pointBalanceSummaries: [...this.map.entries()]
        }
    }
}