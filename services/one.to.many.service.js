import LoggerApp from "../logger/logger.app.js";
import jwt from "jsonwebtoken"
// **
import Employee from "../entities/employee.js";

// ** it should be store on .env
import path from "path";
import dotenv from 'dotenv'

dotenv.config({path: path.resolve('./env/.env'), debug: true}) // for some reason


const logger = new LoggerApp();

// Work for Employee only
class OneToManyService {
    // create,update,read

    // ***
    adminToken = ""

    // ** not verify with jwt secret ** it means when token change this method still work
    #readsAndVerifyByManual = async (token) => {
        const payload = jwt.decode(token)
        const response = {data: [], status: false}
        // this.#convertUnixTimeToRealTime(payload.iat) ====> iat : 2024-10-20 23:30:52
        /*{
          "username": "peter",
          "roles": "ROLE_ADMIN",
          "iat": 1729443651,
          "exp": 1729444551
        }*/
        if (payload !== null) {
            if (payload.roles === "ROLE_ADMIN" && !this.#isUnixTimestampExpired(payload.exp)) {
                response.data = await Employee.findAll()
                response.status = true
                return response
            }
        }
        return response;
    }

    // ** Good way
    // ** verify with jwt secret *** it means when token change this method will throw error *** Note this way don't check expired token it verifies on this verify() method
    readsAndVerifyTokenByModule = async (token) => {
        const response = {data: [], status: false}
        /*
            *** Why have to use jwt secret key
            Once the server receives a JWT to grant access to a protected route, it needs to verify it in order to determine if the user really is who he claims to be.
            In other words, it will verify if no one changed the header and the payload data of the token. So again, this verification step will check if
            no third party actually altered either the header or the payload of the Json Web Token.
        */
        try { // ** try catch for catching expired token or modified token
            const payload = jwt.verify(token, process.env.JWT_SCRET_KEY);
            if (payload) {
                if (payload.roles === "ROLE_ADMIN") {
                    response.data = await Employee.findAll()
                    response.status = true
                    return response
                }
            }
            // case another role
            return response
        } catch (e) {
            logger.winston.log({message: e.message, level: "error"}) // error [one.to.many.service.js] : jwt expired
            return response
        }
    }


    readAndVerifyTokenByModule = async (token, eid) => {
        const response = {data: [], status: false}
        try { // ** try catch for catching expired token or modified token
            const payload = jwt.verify(token, process.env.JWT_SCRET_KEY);
            if (payload) {
                if (payload.roles === "ROLE_ADMIN") {
                    response.data = await Employee.findByPk(eid)
                    response.status = true
                    return response
                }
            }
            // case another role
            return response
        } catch (e) {
            logger.winston.log({message: e.message, level: "error"}) // error [one.to.many.service.js] : jwt expired
            return response
        }
    }

    createAndVerifyTokenByModule = async (token, employee) => {
        const response = {data: false, status: false}
        try {
            const payload = jwt.verify(token, process.env.JWT_SCRET_KEY);
            if (payload) {
                if (payload.roles === "ROLE_ADMIN") {
                    await Employee.create({
                        eid: employee.eid,
                        firstname: employee.firstname,
                        lastname: employee.lastname,
                        position: employee.position,
                        active: employee.active,
                        salary: employee.salary
                    }).then(() => {
                        response.data = true
                    })
                    response.status = true
                    return response
                }
            }
            // case another role
            return response
        } catch (e) {
            logger.winston.log({message: e.message, level: "error"}) // error [one.to.many.service.js] : jwt expired,validate sql
            return response
        }
    }

    updateAndVerifyTokenByModule = async (token, employee, eid) => {
        const response = {data: false, status: false}
        try {
            const payload = jwt.verify(token, process.env.JWT_SCRET_KEY);
            if (payload) {
                if (payload.roles === "ROLE_ADMIN") {
                    await Employee.update({
                        firstname: employee.firstname,
                        lastname: employee.lastname,
                        position: employee.position,
                        active: employee.active,
                        salary: employee.salary
                    }, {where: {eid: eid}}).then(() => {
                        response.data = true
                    })
                    response.status = true
                    return response
                }
            }
            // case another role
            return response
        } catch (e) {
            logger.winston.log({message: e.message, level: "error"}) // error [one.to.many.service.js] : jwt expired,validate sql
            return response
        }
    }

    deleteAndVerifyTokenByModule = async (token, eid) => {
        const response = {data: false, status: false}
        try {
            const payload = jwt.verify(token, process.env.JWT_SCRET_KEY);
            if (payload) {
                if (payload.roles === "ROLE_ADMIN") {
                    await Employee.destroy({where: {eid: eid}}).then(() => {
                        response.data = true
                    })
                    response.status = true
                    return response
                }
            }
            // case another role
            return response
        } catch (e) {
            logger.winston.log({message: e.message, level: "error"}) // error [one.to.many.service.js] : jwt expired,validate sql
            return response
        }
    }

    #convertUnixTimeToRealTime(unixTimestamp) {
        // Create a new Date object from the Unix timestamp (in milliseconds)
        const date = new Date(unixTimestamp * 1000);
        // Get the year, month, date, hours, minutes, and seconds from the Date object
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // Months are 0-based
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        // Format the date and  
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    #isUnixTimestampExpired(unixTimestamp) {
        // Get the current time in milliseconds
        const currentTime = Date.now();
        // Convert the Unix timestamp to milliseconds
        const timestampMilliseconds = unixTimestamp * 1000;
        // Check if the timestamp is in the past
        return timestampMilliseconds < currentTime;
    }


}


export default OneToManyService

/*
await new OneToManyService().readsAndVerifyByModule('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkYW0iLCJyb2xlcyI6IlJPTEVfTk9STUFMIiwiaWF0IjoxNzI5NDc5NDM0LCJleHAiOjE3Mjk0ODAzMzR9.g_HXkeTpFgcrZ_Zs9Bzc1MD9Z76_OCYoG-vyqMoXdy0').then((response) => {
    logger.winston.log({message: JSON.stringify(response),level:"debug"});
});*/
