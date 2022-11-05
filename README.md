# fetch
fetch awards assignment

Three steps to run the app:
1. install nodejs 16.15.0 https://nodejs.org/en/download/releases/
2. go to the fetch folder and run cmd: npm run build
3. run cmd: npm start

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
