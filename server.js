require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pokemonController = require("./controller");

const app = express();
const { SERVER_PORT } = process.env;

app.use(cors());
app.use(express.json());

app.get("/api/pokemon", pokemonController.getAllPokemon);
app.post("/api/pokemon", pokemonController.createPokemon);
app.get("/api/pokemon/:id", pokemonController.getPokemonById);
app.put("/api/pokemon/:id", pokemonController.updatePokemon);
app.delete("/api/pokemon/:id", pokemonController.deletePokemon);
app.get("/api/cards", pokemonController.fetchCards);
app.get("/api/seed", pokemonController.seed);

app.listen(SERVER_PORT, () => console.log(`up on ${SERVER_PORT}`));
