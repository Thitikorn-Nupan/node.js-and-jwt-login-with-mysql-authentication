import LoggerApp from "../logger/logger.app.js";
import path from "path";
import dotenv from 'dotenv'
import sequelize from 'sequelize'
const logger = new LoggerApp()
// ** config the environment file
dotenv.config({ path : path.resolve('./env/.env') ,debug : true}) // for some reason

class ConnectDb {
    constructor() {
        logger.winston.log({message:"ConnectDb class is initial",level:"warn"});
    }
    sequelizeConfig(database) {
        return new sequelize(
            database,
            process.env.MYSQLL_USERNAME,
            process.env.MYSQLL_PASSWORD,
            {
                /* set different port */
                dialect : 'mysql' ,
                host: process.env.MYSQLL_HOST,
                port: process.env.MYSQLL_PORT,
                pool : {
                    max: 5,
                    min: 0,
                    acquire: 30000,
                    idle: 10000
                }
            }
        ) // ended new sequelize()
    }
}

export default ConnectDb
/*
check to config. it was gonna good or bad
new ConnectDb().sequelizeConfig('one_to_many').authenticate().then(() => {
    logger.winston.info('connected successfully!!')
}).catch((error) => {
    logger.winston.debug('failed connect!!',{error : error})
    throw error
})
*/


