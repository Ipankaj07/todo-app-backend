const express = require('express');
const router = express.Router();
const Todo = require('../models/todo.model');

router.get('/', async (req, res) => {
    try {
        const tags = req.query.tags ? req.query.tags.split(',') : [];
        const isCompleted = req.query.isCompleted ? req.query.isCompleted : '';
        const search = req.query.search ? req.query.search : '';
        const sort = req.query.sort ? req.query.sort : 'createdAt';
        const order = req.query.order ? req.query.order : 'desc';
        const page = req.query.page ? req.query.page : 1;
        const limit = req.query.limit ? req.query.limit : 10;
        const skip = (page - 1) * limit;

        const query = {};

        if (tags.length) {
            query.tags = { $in: tags };
        }

        if (isCompleted) {
            query.isCompleted = isCompleted === 'true';
        }

        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        const todos = await Todo.find(query)
            .sort({ [sort]: order })
            .skip(skip)
            .limit(limit);

        const total = await Todo.countDocuments(query);

        return res.status(200).json({
            todos,
            total
        });

    } catch (err) {
        return res.status(500).json({
            error: err
        });
    }
})

router.get('/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        return res.status(200).json(todo);
    } catch (err) {
        return res.status(500).json({
            error: err
        });
    }
});

router.post('/', async (req, res) => {
    try {
        const todo = await Todo.create(req.body);
        return res.status(201).json(todo);
    } catch (err) {
        return res.status(500).json({
            error: err
        });
    }
});

router.patch('/:id/subtasks/:subTaskID', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        const subTask = todo.subTasks.id(req.params.subTaskID);
        subTask.isCompleted = !subTask.isCompleted;
        await todo.save();
        return res.status(200).json(todo);
    } catch (err) {
        return res.status(500).json({
            error: err
        });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);
        return res.status(200).json(todo);
    } catch (err) {
        return res.status(500).json({
            error: err
        });
    }
});

router.patch('/:id', async (req, res) => {
    try {

        /* TAGS */

        if (req.body.tags) {
            const todo = await Todo.findById(req.params.id);
            const tags = todo.tags.concat(req.body.tags);
            req.body.tags = tags;
        }

        if (req.body.tagsToDelete) {
            const todo = await Todo.findById(req.params.id);
            const tags = todo.tags.filter(tag => !req.body.tagsToDelete.includes(tag));
            req.body.tags = tags;
        }

        /* SUBTASKS */

        if (req.body.subTasks) {
            const todo = await Todo.findById(req.params.id);
            const subTasks = todo.subTasks.concat(req.body.subTasks);
            req.body.subTasks = subTasks;
        }

        if (req.body.subTasksToDelete) {
            const todo = await Todo.findById(req.params.id);
            const subTasks = todo.subTasks.filter(subTask => !req.body.subTasksToDelete.includes(subTask));
            req.body.subTasks = subTasks;
        }

        req.body.updatedAt = Date.now();

        const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.status(200).json(todo);
    } catch (err) {
        return res.status(500).json({
            error: err
        });
    }
});

module.exports = router;