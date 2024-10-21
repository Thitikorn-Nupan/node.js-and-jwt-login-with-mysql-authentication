import LoggerApp from "../logger/logger.app.js";
import express from "express"
import bodyParser from "body-parser";
import {getLogin,getEmployees,getEmployee,addEmployee,editEmployee,removeEmployee} from "../controllers/admin.control.js";

const aRoute = express.Router();
// const logger = new LoggerApp();

// set middleware
aRoute.use(bodyParser.json());
aRoute.use(bodyParser.urlencoded({extended: true}))

aRoute.post("/login",getLogin)
aRoute.get("/employees",getEmployees)
aRoute.get("/employee",getEmployee)
aRoute.post("/employee", addEmployee)
aRoute.put("/employee", editEmployee)
aRoute.delete("/employee", removeEmployee)



// ** Got an idea
export default aRoute;