import { Task } from '../Models/Task.Model.mjs'


export default class TaskController{
    constructor(){}

    getAllTasks = async function (req,res){
        const tasks = await Task.find()

        return res.status(200).json(tasks);
    }
  
}