const { Router } = require("express");
const axios = require('axios');
const {Character, Episode} = require("../db");

const router = Router();

// Configurar los routers
const getAllCharactersApi = async ()=> {
    const apiInfo = axios.get("https://rickandmortyapi.com/api/character");
    const character = apiInfo.data.results.map(e => {
        return {
            id: e.id,
            name: e.name,
            species: e.species,
            origin: e.origin,
            image: e.image
        }
    })
    return character
}

const getDbInfo = async () => {
    const dbInfo = await Character.findAll({
        include: [
            {
                model: Episode,
                attributes: ["name"],
                through: {
                    attributes: []
                }
            }
        ]
    });
    return dbInfo;
}

const getAllCharacters = async () => {
    const apiInfo = await getAllCharactersApi();
    const dbInfo = await getDbInfo();
    return apiInfo.concat(dbInfo)
}

router.get("/character", async (req, res) => {
    try {
        const name = req.query.name
        let charactersTotal = await getAllCharacters();
        if (name) {
            let characterName = await charactersTotal.filter(e => e.name.toLowerCase().includes(name.toLowerCase()))
            characterName ? res.status(200).send(characterName) : res.status(404).send("El personaje no fue encontrado, lo siento.")
        } else {
            res.status(200).send(charactersTotal)
        }
    } catch (error) {
        console.log(error)
        res.status(404).send(error)
    }
})

module.exports = router;
