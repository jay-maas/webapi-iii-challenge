const express = require('express');

const Users = require('./userDb.js')
const Posts = require('../posts/postDb.js')

const router = express.Router();

router.use(express.json())

router.post('/', validateUser, async (req, res) => {
    try {
        const user = await Users.insert(req.body)
        res.status(201).json(user)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Error adding the user.'
        })
    }
});

router.post('/:id/posts', validateUserId, validatePost, async (req, res) => {
    try {
        const post = await Posts.insert(req.post)
        res.status(201).json(post)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Error adding post to the user.'
        })
    }
});

router.get('/', async (req, res) => {
   try {
       const users = await Users.get()
       res.status(200).json(users)
   } catch (error) {
       console.log(error)
       res.status(500).json({
           message: 'Error retrieving the users.'
       })
   }
});

router.get('/:id', validateUserId, (req, res) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: 'Error retrieving user'
        })
    }
});

router.get('/:id/posts', validateUserId, async (req, res) => {
    try {
        posts = await Posts.get()
        res.status(200).json(posts)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: 'Error retrieving posts.'
        })
    }
});

router.delete('/:id', validateUserId, async (req, res) => {
    try {
        deleted = await Users.remove(req.user.id)
        res.status(200).json(deleted)
    } catch (error) {
    console.log(error)
    res.status(500).json({
        error: 'Error deleting user'
    })
    }
});

router.put('/:id', validateUserId, async (req, res) => {
    try {
        updated = await Users.update(req.user.id, req.body)
        res.status(200).json(updated)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: 'Error updating user.'
        })
    }
});

//custom middleware

async function validateUserId(req, res, next) {
    const user = await Users.getById(req.params.id)
    if (user) {
        req.user = user
        next()
    } else {
        res.status(404).json({
            error: "Could not find a user by that ID"
        })
    }
};

function validateUser(req, res, next) {
    if (!isEmpty(req.body)) {
        if (req.body.name) {
            next()
        } else {
            res.status(400).json({
                errorMessage: "Missing required name field."
            })
        }
    } else {
        res.status(400).json({
            errorMessage: "Missing user data."
        })
    }
};

function validatePost(req, res, next) {
    if (!isEmpty(req.body)) {
        if (req.body.text) {
            req.post = {
                text: req.body.text,
                user_id: req.user.id
            }
            next()
        } else {
            res.status(400).json({
                errorMessage: "Missing required text field."
            })
        }
    } else {
        res.status(400).json({
            errorMessage: "Missing post data."
        })
    }
};

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

module.exports = router;

