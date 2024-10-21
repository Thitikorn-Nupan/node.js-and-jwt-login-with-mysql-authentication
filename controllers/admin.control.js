import LoggerApp from "../logger/logger.app.js";
import RegisterService from "../services/register.service.js";
import OneToManyService from "../services/one.to.many.service.js";
// call two databases
const registerService = new RegisterService();
const oneToManyService = new OneToManyService();

// const logger = new LoggerApp();

export const getLogin = async (req, res) => {
    const {username, password} = req.body
    const responseLogin = {status: "", token: ""}
    await registerService.login(username, password).then(response => {
        if (response.result) {
            responseLogin.status = "accepted"
        } else {
            responseLogin.status = "ok"
        }
        responseLogin.token = response.token
        // ***
        oneToManyService.adminToken = responseLogin.token
        return res.status(200).json(responseLogin)
    });
}

export const getEmployees = async (req, res) => {
    const authorization = req.headers["authorization"]; // get authorization form header
    const token = authorization.replace("Bearer ", "")
    // logger.winston.log({message:token,level:"debug"})
    const responseData = {status: "", data: []}
    await oneToManyService.readsAndVerifyTokenByModule(token).then(response => {
        if (response.status) {
            responseData.status = "accepted"
        } else {
            responseData.status = "not found page"
        }
        responseData.data = response.data
        return res.status(200).json(responseData)
    })
}

export const getEmployee =  async (req, res) => {
    const authorization = req.headers["authorization"]; // get authorization form header
    const token = authorization.replace("Bearer ", "")
    // logger.winston.log({message:token,level:"debug"})
    const eid = req.query['eid']
    const responseData = {status: "", data: []}
    await oneToManyService.readAndVerifyTokenByModule(token, eid).then(response => {
        if (response.status) {
            responseData.status = "accepted"
        } else {
            responseData.status = "not found page"
        }
        responseData.data = response.data
        return res.status(200).json(responseData)
    })
}

export const addEmployee = async (req, res) => {
    const authorization = req.headers["authorization"]; // get authorization form header
    const token = authorization.replace("Bearer ", "")
    const {
        eid,
        firstname,
        lastname,
        position,
        active,
        salary
    } = req.body

    const employee = {
        eid: eid,
        firstname: firstname,
        lastname: lastname,
        position: position,
        active: active,
        salary: salary
    }

    const responseData = {status: "", data: []}
    await oneToManyService.createAndVerifyTokenByModule(token, employee).then(response => {
        if (response.status) {
            responseData.status = "accepted"
        } else {
            responseData.status = "not found page"
        }
        responseData.data = response.data
        return res.status(200).json(responseData)
    })
}

export const editEmployee = async (req, res) => {
    const authorization = req.headers["authorization"]; // get authorization form header
    const token = authorization.replace("Bearer ", "")
    const eid = req.query['eid']
    const {
        firstname,
        lastname,
        position,
        active,
        salary
    } = req.body

    const employee = {
        firstname: firstname,
        lastname: lastname,
        position: position,
        active: active,
        salary: salary
    }

    const responseData = {status: "", data: []}
    await oneToManyService.updateAndVerifyTokenByModule(token, employee,eid).then(response => {
        if (response.status) {
            responseData.status = "accepted"
        } else {
            responseData.status = "not found page"
        }
        responseData.data = response.data
        return res.status(200).json(responseData)
    })
}

export const removeEmployee = async (req, res) => {
    const authorization = req.headers["authorization"]; // get authorization form header
    const token = authorization.replace("Bearer ", "")
    const eid = req.query['eid']
    const responseData = {status: "", data: []}
    await oneToManyService.deleteAndVerifyTokenByModule(token, eid).then(response => {
        if (response.status) {
            responseData.status = "accepted"
        } else {
            responseData.status = "may eid has been in relation table"
        }
        responseData.data = response.data
        return res.status(200).json(responseData)
    })
}

// for case no pass token from header
// aRoute.get("/has-token/employees", async (req, res) => {
//     const responseData = {status: "", data: []}
//     await oneToManyService.readsAndVerifyTokenByModule(oneToManyService.adminToken).then(response => {
//         if (response.status) {
//             responseData.status = "accepted"
//         } else {
//             responseData.status = "not found page"
//         }
//         responseData.data = response.data
//         return res.status(200).json(responseData)
//     })
// })