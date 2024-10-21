import {DataTypes} from "sequelize";
import ConnectDb from "../configs/connect.db.js";
const sequelizeConnectDb = new ConnectDb().sequelizeConfig("register")
const User = sequelizeConnectDb.define("users", {
        uid : {
            type : DataTypes.INTEGER ,
            primaryKey : true,
            autoIncrement: true
        } ,
        username : {
            type : DataTypes.STRING
        } ,
        password : {
            type : DataTypes.STRING
        } ,
        roles : {
            type : DataTypes.STRING
        }
    } ,
    {
        // freeze name table not using *s on name
        freezeTableName: true ,
        // don't use createdAt/update
        timestamps: false
    }
)

export default User