import { mymap, treeset } from "../dao/datafile"
import { InvalidInputError, NotEnoughBalanceError } from "../helper/custom-error"
import PointBalanceSummary from "../model/point-balance-summary"
import PointBalance from "../model/point-balance"
import PointCosumed from "../model/point-consumed"
import PointEvent from "../model/point-event"
import * as _ from "lodash";
import { logger } from '../helper/winston-logger'

export default class PointService {

    getAll = async () => {
        return mymap
    }

    test = async () => {
        try {
            throw new Error("test")
        } catch (error) {
            throw error
        }
       
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

        // aggregate consumptions for each payer
        const response = _.chain(list).groupBy('payer').map((objs: any, key: any) => { return { "payer": key, 'points': _.sumBy(objs, 'points') } })
        return response;
    }

    addPointsTransaction = async (pointEvent: PointEvent) => {
        if (pointEvent.points == 0)
            throw new InvalidInputError(`in valid input for ${pointEvent.payer} with timestamp ${pointEvent.timestamp}, this transaction not executed`)

        // record the previous total
        const prev_total = mymap.total;

        if (pointEvent.points > 0) {
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
                throw new InvalidInputError(`not enough balance for ${pointEvent.payer} with timestamp ${pointEvent.timestamp}, this transaction not executed`)
            }
            const pointBalanceSummary: PointBalanceSummary = mymap.map.get(pointEvent.payer)!;

            pointBalanceSummary.sum += pointEvent.points;
            mymap.total += pointEvent.points;

            // since the pointBalance before cursor is zero, so we check from the position of cursor
            for (let pointBalance of pointBalanceSummary.pointBalances.slice(pointBalanceSummary.cursor)) {
                if (pointBalance.points + pointEvent.points > 0) {
                    treeset.erase(pointBalance)
                    pointBalance.points += pointEvent.points;
                    treeset.insert(pointBalance)
                    break;
                } else {
                    treeset.erase(pointBalance)
                    pointEvent.points += pointBalance.points;
                    pointBalance.points = 0;
                    pointBalanceSummary.cursor++;
                    if (pointBalanceSummary.cursor < pointBalanceSummary.pointBalances.length) {
                        treeset.insert(pointBalanceSummary.pointBalances[pointBalanceSummary.cursor])
                    }
                }
            }
        }
        const addedPoints = mymap.total - prev_total;
        logger.info(`added ${addedPoints} for this transaction`)
        return addedPoints
    }


    handlePointsTransactions = async (pointEvents: PointEvent[]) => {

        // ideally this is used, but to make sure the transaction is added chronologically, we are not using it this way for now
        // const promises: Promise<number>[] = pointEvents.map(i => this.addPointsTransaction(i))
        // const res = await Promise.all(promises)

        const res = []
        for (let i of pointEvents) {
            const response = await this.addPointsTransaction(i)
            res.push(response)
        }
        return res
    }

}