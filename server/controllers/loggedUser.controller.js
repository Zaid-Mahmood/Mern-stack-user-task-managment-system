import { loggedUser } from "../models/loggedUser.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const addUser = asyncHandler(async (req, res) => {
    const { id, userTasks, taskStatus, startDate, endDate } = req.body;
    if ([id, userTasks, taskStatus, startDate, endDate].some((field) => field === undefined))
        throw new ApiError(401, "All Fields are required")
    const userExisted = await loggedUser.findById(id);
    if (userExisted) {
        await userExisted.tasks.push({
            userTasks,
            taskStatus,
            startDate,
            endDate
        })
        await userExisted.save()
        return res.status(200).json(new ApiResponse(200, userExisted, "New task has been added in the list successfully !!"))
    } else {
        await loggedUser.create({
            _id: id,
            tasks: [{ userTasks, taskStatus, startDate, endDate }]
        })
        return res.status(200).json(new ApiResponse(200, loggedUser, "New task list has been created and task has been added in it successfully !!"))
    }
})

const getAllUser = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) throw new ApiError(404, "User doesnot exists")
    const userExisted = await loggedUser.findById(user._id);
    if (!userExisted) throw new ApiError(404, "User doesnot found with the provided id")
    const userTasks = userExisted?.tasks;
    return res.status(200).json(new ApiResponse(200, { userTasks }, "Fetched all user tasks successfully !!"))
})

const updateTask = asyncHandler(async (req, res) => {
    const { _id, userTasks, taskStatus, startDate, endDate } = req.body;
    if ([_id, userTasks, taskStatus, startDate, endDate].some(field => field === "")) throw new ApiError(401, "All fields are required to update task")
    const user = req.user;
    if (!user) throw new ApiError(404, "User doesnot exists")
    const userExisted = await loggedUser.findById(user?._id);
    if (!userExisted) throw new ApiError(404, "User is not logged in")
    const findUser = await userExisted.tasks.find((item) => item?._id.toString() === _id)
    if (!findUser) throw new ApiError(404, "User doesnot found with the provided fields")
    const updateUser = await loggedUser.findOneAndUpdate(
        {
            _id: user._id,
            "tasks._id": _id
        },
        {
            $set: {
                "tasks.$.userTasks": userTasks,
                "tasks.$.taskStatus": taskStatus,
                "tasks.$.startDate": startDate,
                "tasks.$.endDate": endDate
            }
        },
        { new: true }
    )
    return res.status(200).json(new ApiResponse(200, updateUser, "Task has been updated successfully !!"))
})

const deleteTask = asyncHandler(async (req, res) => {
    const { id } = req.body;
    if (!id) throw new ApiError(404, "Invalid delete id");
    const user = req.user;
    if (!user) throw new ApiError(404, "User doesnot exists")
    const userExisted = await loggedUser.findById(user?._id);
    if (!userExisted) throw new ApiError(404, "User is not logged in")
    const findUser = await userExisted.tasks.find((item) => item?._id.toString() === id)
    if (!findUser) throw new ApiError(404, "User doesnot found with the provided id")
    const deleteUser = await loggedUser.findOneAndUpdate(
        {
            _id: user?._id,
        },
        {
            $pull: {
                tasks: { _id: id }
            }
        }
        ,
        { new: true }
    )
    return res.status(200).json(new ApiResponse(200, deleteUser, "Task has been deleted successfully !!"))
})

const searchTask = asyncHandler(async (req, res) => {
    const { value } = req.body;
    if (!value) throw new ApiError(404, "Search Value is not provided !!")
    const user = req.user;
    if (!user) throw new ApiError(404, "User doesnot exists");
    const userExisted = await loggedUser.findById(user?._id);
    if (!userExisted) throw new ApiError(404, "User is not logged in")
    const matchedTask = userExisted.tasks.filter((item) => item.userTasks.toLowerCase().includes(value.toLowerCase()));
    if(!matchedTask) throw new ApiError(401 , "Can't find specific task")
    return res.status(200).json(new ApiResponse(200 , matchedTask , "Success"))
})

export { addUser, getAllUser, updateTask, deleteTask, searchTask };