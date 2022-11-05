import PointBalance from "../model/point-balance";
import MyMap from "./mymap";
import { TreeSet } from "tstl";

// mymap is a wrapper around Map, since we added a total varialbe
const mymap: MyMap = new MyMap();

/* 
1. The treeset is ordered by a combination of lastupdated and payer, since the pointbalance is identified by lastupdated and payer. This also which makes the deletion log(n)
2. There's at most one pointbalance with the same payer
*/
const treeset: TreeSet<PointBalance> = new TreeSet<PointBalance>((a, b) => a.lastUpdated.getTime() != b.lastUpdated.getTime() ? a.lastUpdated < b.lastUpdated : a.payer < b.payer)

export { mymap, treeset }