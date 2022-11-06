# fetch
fetch awards assignment

Two steps to run the app:
1. install nodejs 16.15.0 https://nodejs.org/download/release/v16.15.0/
2. go to the fetch folder and run cmd: npm start

Now the app is started on http://localhost:3000
You can use postman to call it
There are four endpoints. The purposes of them are as their names suggests.

1. http://localhost:3000/v1/balances/all 
   This is a httpget endpoint. You don't need to pass any parameter to use it.
   
2. http://localhost:3000/v1/balances/consume 
   This is a httppost endpoint. To use it, you need to pass a JSON object in the body like this: { "points": 200 }
   
3. http://localhost:3000/v1/balances/addTransaction
   This is a httppost endpoint. To use it, you need to pass a JSON object in the body like this: 
   {
       "payer": "DANNON",
       "points": 1000,
       "timestamp": "2022-11-03T14:00:00Z"
   }
  
4. http://localhost:3000/v1/balances/addTransactions
   This is a httppost endpoint. To use it, you need to pass a JSON object in the body like this: 
   [
       {
           "payer": "DANNON",
           "points": 300,
           "timestamp": "2022-10-31T10:00:00Z"
       },
       {
           "payer": "UNILEVER",
           "points": 200,
           "timestamp": "2022-10-31T11:00:00Z"
       },
       {
           "payer": "DANNON",
           "points": -200,
           "timestamp": "2022-10-31T15:00:00Z"
       },
       {
           "payer": "MILLER COORS",
           "points": 10000,
           "timestamp": "2022-11-01T14:00:00Z"
       },
       {
           "payer": "DANNON",
           "points": 1000,
           "timestamp": "2022-11-02T14:00:00Z"
       }
   ]


More implementation details:
Assumption: It's assumed that the points transaction for each payer happens in an chronological order. 
The cursor: the cursor of each payer's balance summary points to the pointbalance that's currently in the treeset. The pointbalance before the cursor is zero.
Error handling: 
1. The total variable in mymap is used to check if the points to be spent is valid.
2. If there's a list of add transactions, the transactions will be executed one by one. The failure of one transaction will not stop the executing of other transactions. 
For example, if the addTransactions endpoints are called with this input:
[
    {"payer":"DANNON","points":300,"timestamp":"2022-10-31T10:00:00Z"},
    {"payer":"UNILEVER","points":200,"timestamp":"2022-10-31T11:00:00Z"},
    {"payer":"DANNON","points":-2000,"timestamp":"2022-10-31T15:00:00Z"},
    {"payer":"MILLER COORS","points":10000,"timestamp":"2022-11-01T14:00:00Z"},
    {"payer":"DANNON","points":1000,"timestamp":"2022-11-02T14:00:00Z"}
]
The third transaction will fail, other transaction will succeed. A total of 11500 points will be added. The result of each transaction will be logged.
3. Pros and Cons:
Pros: As nodejs is single threaded, this app can handle concurrency, we don't need to worry about data race.
Cons: Nodejs is good to be used for servers and building event-driven architectures, but it's not good to do calculations. To scale the app, we need to distribute the calculation to other servers.

