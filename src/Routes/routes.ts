import express,{ Express } from "express";
import { getallusers,getuserid,upadatestatus,delteuser } from "../Controller/admincontrol";
import { createUser, loginUser } from "../Service/userservice";
import { verifytoken } from "../Middleware/tokenverify";
import { createRecord ,getRecords,updateRecord,deleteRecord } from "../Controller/Record";
import { authorize } from "../Middleware/authorise";
import {  UserRole } from "../Schema/user";
import {  monthlysummary, yearlysummary,usersummary,summary} from "../Controller/summary";
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100 
});


const app:Express=express();
app.use(limiter);

//Authentication
app.post('/createUser',createUser);
app.post('/loginUser',loginUser);


//admin  can manage and update user
app.get('/getallusers',verifytoken, authorize(UserRole.ADMIN) ,getallusers);
app.get('/getuserid/:id', verifytoken,authorize(UserRole.ADMIN),getuserid);
app.put('/upadatestatus/:id', verifytoken, authorize(UserRole.ADMIN),upadatestatus);
app.delete('/delteuser/:id',verifytoken,authorize(UserRole.ADMIN) ,delteuser);

// admin can manage and updates records
app.post('/createRecord',verifytoken,authorize(UserRole.ADMIN),createRecord);
app.get('/getRecords',verifytoken,authorize(UserRole.ADMIN),getRecords);
app.put('/updateRecord/:id',verifytoken,authorize(UserRole.ADMIN),updateRecord);
app.delete('/deleteRecord/:id',verifytoken,authorize(UserRole.ADMIN),deleteRecord);


//views
app.get('/monthlysummary',verifytoken,authorize(UserRole.VIEWER ,UserRole.ADMIN,UserRole.ANALYST),monthlysummary);
app.get('/yearlysummary',verifytoken,authorize(UserRole.VIEWER ,UserRole.ADMIN,UserRole.ANALYST),yearlysummary);
app.get('/usersummary/:id',verifytoken,authorize(UserRole.VIEWER ,UserRole.ADMIN,UserRole.ANALYST),usersummary);
app.get('/summary',verifytoken,authorize(UserRole.VIEWER ,UserRole.ADMIN,UserRole.ANALYST),summary);

export default app;