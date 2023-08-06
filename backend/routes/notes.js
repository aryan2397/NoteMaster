const express = require('express');
const router = express.Router();
const Note = require("../models/Note");
var fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');
const { compare } = require('bcrypt');
const { findByIdAndUpdate } = require('../models/User');

//ROUTE 1: Get all the notes using : GET "/api/notes/getuser". Require login
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server error");
    }

})

//ROUTE 2: Add a new note : POST "/api/notes/addnote". Require login
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.send({ errors: result.array() });
        }
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save()
        res.json(savedNote);
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server error");
    }

})

//ROUTE 3: Update an existing note : PUT "/api/notes/updatenote". Require login
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        // Create a newNote object
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };
        // Find note by id and update it
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not found")
        };
        if (note.user.toString() !== req.user.id) {
            //Note does not belong to the user
            return res.status(401).send("Not allowed")
        }
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json(note);
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server error");
    }

})

//ROUTE 4: Delete an existing note : DELETE "/api/notes/deletenote". Require login
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        // Find note by id and delete it
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not found")
        }
        if (note.user.toString() !== req.user.id) {
            //Note does not belong to the user
            return res.status(401).send("Not allowed")
        }
        note = await Note.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Note has been deleted", note: note });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server error");
    }
})

module.exports = router