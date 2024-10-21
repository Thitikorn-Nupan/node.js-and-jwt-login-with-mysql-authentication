import {DataTypes} from "sequelize";
import ConnectDb from "../configs/connect.db.js";
const sequelizeConnectDb = new ConnectDb().sequelizeConfig("one_to_many")
const Employee = sequelizeConnectDb.define("employees", {
        eid : {
            type : DataTypes.STRING ,
            primaryKey : true,
            autoIncrement: true
        } ,
        firstname : {
            type : DataTypes.STRING
        } ,
        lastname : {
            type : DataTypes.STRING
        } ,
        position : {
            type : DataTypes.STRING
        },
        active : {
            type : DataTypes.BOOLEAN
        },
        salary : {
            type : DataTypes.FLOAT
        }
    } ,
    {
        // freeze name table not using *s on name
        freezeTableName: true ,
        // don't use createdAt/update
        timestamps: false
    }
)

export default Employee


