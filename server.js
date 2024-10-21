import LoggerApp from "./logger/logger.app.js";
import express from "express";
import aRoute from "./routes/admin.route.js";

const application = express()
const logger = new LoggerApp();

application.use('/api/authen',aRoute)
application.listen(3000,(error) => {
    if (error) throw error
    else logger.winston.log({message:'you are on port 3000',level:"info"})
})



