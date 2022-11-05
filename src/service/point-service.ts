import { mymap, treeset } from "../dao/datafile"
import { InvalidInputError, NotEnoughBalanceError } from "../helper/custom-error"
import PointBalanceSummary from "../model/point-balance-summary"
import PointBalance from "../model/point-balance"
import PointCosumed from "../model/point-consumed"
import PointEvent from "../model/point-event"
import * as _ from "lodash";

export default class PointService {

    getAll = async () => {
        return mymap
    }

    consume = async (number: number) => {
        if (number > mymap.total) {
            throw new NotEnoughBalanceError("not enough balance")
        }
        if (number <= 0)
            throw new InvalidInputError("invalid input")

        mymap.total -= number;
        const list: PointCosumed[] = []
        while (number > 0 && !treeset.empty()) {
            const pointBalance: PointBalance = treeset.begin().value;
            treeset.erase(treeset.begin().value)
            if (pointBalance) {
                if (pointBalance.points > number) {
                    list.push(new PointCosumed(pointBalance.payer, -number))
                    pointBalance.points -= number;
                    mymap.map.get(pointBalance.payer)!.sum -= number
                    treeset.insert(pointBalance)
                    number = 0
                }
                else if (pointBalance.points == number) {
                    list.push(new PointCosumed(pointBalance.payer, -number))
                    mymap.map.get(pointBalance.payer)!.sum -= number
                    pointBalance.points = 0;
                    number = 0
                    const pointBalanceSummary: PointBalanceSummary | undefined = mymap.map.get(pointBalance.payer)
                    if (pointBalanceSummary) {
                        pointBalanceSummary.cursor++
                        if (pointBalanceSummary.cursor < pointBalanceSummary.pointBalances.length) {
                            treeset.insert(pointBalanceSummary.pointBalances[pointBalanceSummary.cursor])
                        }
                    }
                } else {
                    list.push(new PointCosumed(pointBalance.payer, -pointBalance.points))
                    mymap.map.get(pointBalance.payer)!.sum -= pointBalance.points
                    number -= pointBalance.points;
                    pointBalance.points = 0;
                    const pointBalanceSummary: PointBalanceSummary | undefined = mymap.map.get(pointBalance.payer)
                    if (pointBalanceSummary) {
                        pointBalanceSummary.cursor++
                        if (pointBalanceSummary.cursor < pointBalanceSummary.pointBalances.length) {
                            treeset.insert(pointBalanceSummary.pointBalances[pointBalanceSummary.cursor])
                        }
                    }
                }
            }
        }
        const response = _.chain(list).groupBy('payer').map((objs: any, key: any) => { return { "payer": key, 'points': _.sumBy(objs, 'points') } })
        return response;
    }

    addPointsTransaction = async (pointEvent: PointEvent) => {
        if (pointEvent.points >= 0) {
            const pointBalance: PointBalance = new PointBalance(pointEvent.payer, pointEvent.points, new Date(pointEvent.timestamp))
            if (!mymap.map.has(pointEvent.payer)) {
                mymap.map.set(pointEvent.payer, new PointBalanceSummary(pointEvent.payer))
            }
            const pointBalanceSummary: PointBalanceSummary = mymap.map.get(pointEvent.payer)!;
            pointBalanceSummary.pointBalances.push(pointBalance);
            pointBalanceSummary.sum += pointEvent.points;
            mymap.total += pointEvent.points;

            // the cursor points to the next position where the points of the pointbalance is not zero, indicating that it needs to be added to treeset
            if (pointBalanceSummary.cursor == pointBalanceSummary.pointBalances.length - 1) {
                treeset.insert(pointBalance)
            }
        } else {
            if (!mymap.map.has(pointEvent.payer) || mymap.map.get(pointEvent.payer)!.sum + pointEvent.points < 0) {
                throw new InvalidInputError("not enough balance")
            }
            const pointBalanceSummary: PointBalanceSummary = mymap.map.get(pointEvent.payer)!;
            for (let pointBalance of pointBalanceSummary.pointBalances) {
                if (pointBalance.points + pointEvent.points > 0) {
                    treeset.erase(pointBalance)
                    pointBalance.points += pointEvent.points;
                    treeset.insert(pointBalance)
                    break;
                } else {
                    treeset.erase(pointBalance)
                    pointEvent.points -= pointBalance.points;
                    pointBalanceSummary.cursor++;
                    pointBalance.points = 0;
                    if (pointBalanceSummary.cursor < pointBalanceSummary.pointBalances.length) {
                        treeset.insert(pointBalanceSummary.pointBalances[pointBalanceSummary.cursor])
                    }
                }
            }
            pointBalanceSummary.sum += pointEvent.points;
            mymap.total += pointEvent.points;
        }
        return "success"
    }


    handlePointsTransactions = async (pointEvents: PointEvent[]) => {
        for (let pointEvent of pointEvents) {
            let result = await this.addPointsTransaction(pointEvent)
        }
        return "success"
    }

}