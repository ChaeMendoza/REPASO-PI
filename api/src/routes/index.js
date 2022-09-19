const { Router } = require("express");
const axios = require('axios');
const Character = require("../db");

const router = Router();

// Configurar los routers
const apiInfo = axios.get("https://rickandmortyapi.com/api/character")

module.exports = router;
