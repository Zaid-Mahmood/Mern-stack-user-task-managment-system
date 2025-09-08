import mongoose, { model, Schema } from "mongoose";


const taskSchema = new Schema(
    {
        userTasks: {
            type: String,
            required: true
        },
        taskStatus: {
            type: String,
            required: true
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        }
    },
)

const loggedUserSchema = new Schema(
    
    {
      _id : {
        type : Schema.Types.ObjectId ,
        ref : "User"
      } ,
        tasks: [taskSchema]
    },
    { timestamps: true }
)

export const loggedUser = new model("loggedUser", loggedUserSchema)