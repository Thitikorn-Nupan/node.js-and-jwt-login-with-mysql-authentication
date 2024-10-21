import User from "../entities/user.js";
import LoggerApp from "../logger/logger.app.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import dotenv from 'dotenv'
import path from "path";

dotenv.config({path: path.resolve('./env/.env'), debug: true}) // for some reason

// To create this token, you need to set a secret string
// const jwtSecret = crypto.randomBytes(35).toString("hex") // ex. hex length 35 : 69b890b05ec6dbf89c3058845e164d35a34f256...665

const logger = new LoggerApp();
class RegisterService {

    #hour = 60 * 60
    #timeTokenExpired = (this.#hour / 2) / 2 // 15 minus

    login = async (username, password) => {
        const user = await User.findOne({where: {username: username}})
        const response = {token: "", result: false}
        if (user !== null) {
            const result = await bcrypt.compare(password, user.dataValues.password) // hash password bcrypt uses compare(pain text,bcrypt)
            if (result) {
                const token = jwt.sign(
                    {
                        username: user.username,
                        roles: user.roles
                    },
                    process.env.JWT_SCRET_KEY, // for validation jwt
                    {
                        expiresIn: this.#timeTokenExpired // 3 hrs in sec
                    }
                )
                response.result = true
                response.token = token
            }
            return response;
        }
        return response;
    }
}

export default RegisterService

/*
await new RegisterService().login("peter", "12345").then((response) => {
    // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBldGVyIiwicm9sZXMiOiJST0xFX0FETUlOIiwiaWF0IjoxNzI5NDc5NDM0LCJleHAiOjE3Mjk0ODAzMzR9.F9ezRL6iWNg9akOlZ1vKH3pjl8N2CCPK55NkRAqRImw
    logger.winston.log({message: JSON.stringify(response), level: "debug"});
});

await new RegisterService().login("adam", "12345").then((response) => {
    // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkYW0iLCJyb2xlcyI6IlJPTEVfTk9STUFMIiwiaWF0IjoxNzI5NDc5NDM0LCJleHAiOjE3Mjk0ODAzMzR9.g_HXkeTpFgcrZ_Zs9Bzc1MD9Z76_OCYoG-vyqMoXdy0
    logger.winston.log({message: JSON.stringify(response), level: "debug"});
});*/
