import { Project } from '../Models/Project.Model.mjs';

export default class ProjectController {
    async addProject(req, res) {
        const { name, description, members, dueDate, priority, tags } = req.body;
        try {
            const users = await User.find({ _id: { $in: members } });
               if (users.length !== members.length) {
                   return res.status(400).json({ error: "One or more member IDs are invalid" });
               }
            
            const project = new Project({
                name,
                description,
                owner: req.user.userId,
                members,
                dueDate,
                priority,
                tags,
            });
            await project.save();
            res.status(201).json({ project });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getProject(req, res) {
        try {
            const project = await Project.findById(req.params.id).populate('owner').populate('members').populate('tasks');
            if (!project) return res.status(404).json({ error: 'Project not found' });
            res.status(200).json({ project });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getProjects(req, res) {
        try {
            const projects = await Project.find({ owner: req.user.userId }).populate('owner').populate('members');
            res.status(200).json({ projects });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateProject(req, res) {
        try {
            const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('owner').populate('members').populate('tasks');
            if (!updatedProject) return res.status(404).json({ error: 'Project not found' });
            res.status(200).json({ project: updatedProject });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteProject(req, res) {
        try {
            const deletedProject = await Project.findByIdAndDelete(req.params.id);
            if (!deletedProject) return res.status(404).json({ error: 'Project not found' });
            res.status(200).json({ message: 'Project deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
