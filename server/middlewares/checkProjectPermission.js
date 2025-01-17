import { User } from "../Models/User.Model.mjs"
import { Project } from "../Models/Project.Model.mjs"

const checkProjectPermission = (projectId, permission) => {
    return async (req, res, next) => {
        const user = req.user;
        const project = await Project.findById(projectId)

        if(!project){
            return res.status(404).json({message: 'Project does not exist.'})
        }

        const userProject = user.projects.find(p => p.projectId,toString() === projectId.toString())

        if(!userProject){
            return res.status(403).json({message: 'User is not a member of this project.'})
        }

        if(!userProject.role.permissions.includes(permission)){
            return res.status(403).json({message: "User does not have appropriate privilages for this action."})
        }

        return next();
    }
}

module.exports = checkProjectPermission;