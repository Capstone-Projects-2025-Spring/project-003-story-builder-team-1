const Persona = require("../models/persona");
const asyncHandler = require("express-async-handler");

// Return a list of author personas
exports.persona_list = asyncHandler(async (req, res, next) => {
    // Gets every persona in db
    const personas = await Persona.find().exec();

    //returns every persona from db
    res.status(200).json(personas);
});

// Creates a new persona that all the agents can mimic
exports.create_persona = asyncHandler(async (req, res, next) => {
    // stores the data sent
    const { name , persona_info } = req.body
    
    //checks if all required data is sent
    if (!name || !persona_info) {
        return res.status(400).json({ error: "Name, and persona_info are needed" });
    }

    // check if a persona with this name already exists
    const existing_persona = await Persona.findOne({ name });
    if (existing_persona) {
        return res.status(409).json({ error: "Persona name already exists." });
    }


    //create the person that will be added
    const new_persona = new Persona({name, persona_info});

    //save person to db
    const saved_persona = await new_persona.save();

    res.status(201).json(saved_persona);
});

// Delete a persona given the name
exports.delete_persona = asyncHandler(async (req, res, next) => {
    // store the name of the persona to be deleted
    const { name } = req.body

    // checks if a name was sent
    if (!name) {
        return res.status(400).json({ error: "Name is required to delete a persona." });
    }

    // tries to delete the persona based on the name
    const deleted_persona = await Persona.findOneAndDelete({ name });

    // if the delete failed returns an error
    if (!deleted_persona) {
        return res.status(404).json({ error: `Persona with name "${name}" not found.` });
    }

    // returns successfull deletetion message
    res.status(200).json({ message: `Persona "${name}" deleted successfully.` });
});
