import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Task} from "../models/task.models.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const getAllTaskByParticularUser = asyncHandler(async(req,res) => {
    /*
    -> get user id by jwtverify middleware
    -> find all task by that particular user using db
    -> send res
    */

    const owner = req.user._id

    const tasks = await Task.find({owner})

    return res.status(200).json(new ApiResponse(
        200,tasks,"Read all tasks by a particular user"
    ))
})

const createTask = asyncHandler(async(req,res) => {
    /*
    -> get task details from user 
    -> check if task already exist
    -> validate all the required field from user
    -> create that task in db
    -> send res
    */

    const {title,description,deadline} = req.body
    const owner = req.user._id

    if(!title){
        throw new ApiError(400,"title is required")
    }
    if(title.trim() == ""){
        throw new ApiError(400,"title is required")
    }
    

    // const task = await Task.findOne({
    //     $and: [{title},{owner},{deadline}]
    // })

    // if(task) {
    //     throw new ApiError(407,"Task already exist")
    // }

    

    const task = await Task.create({
        title,
        description,
        deadline,
        owner 
})

    if(!task){
        throw new ApiError(500,"Something went wrong while creating task")
    }

    return res.status(201).json(
        new ApiResponse(201, task, "Task created successfully")
    )

})

const updateTask = asyncHandler(async(req,res) => {
    /*
    -> store all the info from req.body
    -> get user._id from jwtverify middleware
    -> validate important field
    -> check if that task exist aur not 
    -> update the fields that were sent by user
    -> send res
    */

    const {title,description,deadline,isCompleted} = req.body
    const _id = req.params.id
    const owner = req.user._id

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        throw new ApiError(400, "Invalid task ID");
    }
    
    if (
        title === undefined &&
        description === undefined &&
        deadline === undefined &&
        isCompleted === undefined
    ) {
        throw new ApiError(400, "At least one field is required to update");
    }

    const updateFields = {};
    if (title !== undefined) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (deadline !== undefined) updateFields.deadline = deadline;
    if (isCompleted !== undefined) updateFields.isCompleted = isCompleted;

    const task = await Task.findOneAndUpdate(
        { _id: _id, owner },
        { $set: updateFields },
        { new: true, runValidators: true }
    );

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    return res.status(200).json(
        new ApiResponse(200, task, "Task updated successfully")
    );
})

const deleteTask = asyncHandler(async(req,res) => {
    /*
    -> get user through jwtverify middleware
    -> get taskId through params 
    -> check if taskId exists aur not
    -> if taskId exist delete it 
    -> return res
    */

    const owner = req.user._id
    const taskId = req.params.id
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
        throw new ApiError(400, "Invalid task ID");
    }
    const deletedTask = await Task.findOneAndDelete({
        _id: taskId,
        owner: owner
    });

    if (!deletedTask) {
        throw new ApiError(404, "Task not found or you do not have permission to delete it");
    }

    return res.status(200).json(new ApiResponse(
        200,deletedTask,"User deleted successfully"
    ))
})

export {getAllTaskByParticularUser,createTask,updateTask,deleteTask}