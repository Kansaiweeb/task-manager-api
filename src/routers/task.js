const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/tasks', auth, async (req,res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

// GET /tasks?status=true 
// GET /tasks?limit=10&skip=10
// GET /tasks?sortBy=cretedAt:desc
router.get('/tasks', auth, async (req, res) => {
    const isCompleted = req.query.status
    const searchFor = {}
    const limit = req.query.limit ? parseInt(req.query.limit) : 10
    const skip = req.query.skip ? parseInt(req.query.skip) : 0
    const sort = {}
    if (isCompleted) {
      searchFor.isCompleted = isCompleted
    }
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]]= parts[1] === 'desc' ? -1: 1
        console.log(sort, parts, sort[parts[0]], parts[1])
    }
    searchFor.createdBy = req.user._id
    try {
      const tasks = await Task.find(searchFor).limit(limit).skip(skip).sort(sort)
      res.status(200).send(tasks)
    } catch (error) {
      res.status(404).send(error)
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOne({ _id, owner: req.user._id })
        if(!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/tasks/:id',auth,  async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'status']
    const isValidUpdates = updates.every((update) => allowedUpdates.includes(update))
    if(!isValidUpdates) {
        return res.status(400).send({error: 'Invalid updates'})
    }

    try {
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators:true})
        const task = await Task.findOne({_id: req.params.id, owner:req.user._id})

        if(!task) {
            res.status(404).send()
        }

        updates.forEach((updates) => task[updates] = req.body[updates])

        await task.save()

        res.send(task)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, owner:req.user._id})
        
        if(!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router