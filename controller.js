require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");
const seedData = require("./seedData.json");

const { CONNECTION_STRING } = process.env;

const sequelize = new Sequelize(CONNECTION_STRING, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

const Pokemon = sequelize.define(
  "Pokemon",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "pokemon",
  }
);

async function getAllPokemon(req, res) {
  const pokemons = await Pokemon.findAll();
  res.json(pokemons);
}

async function createPokemon(req, res) {
  const { name, category, value, image } = req.body;

  const newPokemon = await Pokemon.create({
    name,
    category,
    value,
    image,
  });

  res.status(201).json(newPokemon);
}

async function getPokemonById(req, res) {
  const pokemonId = parseInt(req.params.id);

  const pokemon = await Pokemon.findByPk(pokemonId);

  if (!pokemon) {
    return res.status(404).json({ error: "Pokemon not found" });
  }

  res.json(pokemon);
}

async function updatePokemon(req, res) {
  const pokemonId = parseInt(req.params.id);
  const { name, category, value, image } = req.body;

  console.log("Updating Pokemon with ID:", pokemonId);
  console.log("Request body:", req.body);

  const pokemon = await Pokemon.findByPk(pokemonId);

  if (!pokemon) {
    return res.status(404).json({ error: "Pokemon not found" });
  }

  pokemon.name = name;
  pokemon.category = category;
  pokemon.value = value;
  pokemon.image = image;
  await pokemon.save();

  res.json(pokemon);
}

async function deletePokemon(req, res) {
  const pokemonId = parseInt(req.params.id);

  const pokemon = await Pokemon.findByPk(pokemonId);

  if (!pokemon) {
    return res.status(404).json({ error: "Pokemon not found" });
  }

  await pokemon.destroy();
  res.status(200).end();
}

async function fetchCards(req, res) {
  try {
    const fireCards = await Pokemon.findAll({
      where: { category: "fire" },
      limit: 13,
      order: Sequelize.literal("random()"),
    });
    const waterCards = await Pokemon.findAll({
      where: { category: "water" },
      limit: 13,
      order: Sequelize.literal("random()"),
    });
    const grassCards = await Pokemon.findAll({
      where: { category: "grass" },
      limit: 13,
      order: Sequelize.literal("random()"),
    });
    const electricCards = await Pokemon.findAll({
      where: { category: "electric" },
      limit: 13,
      order: Sequelize.literal("random()"),
    });

    const cards = [].concat(fireCards, waterCards, grassCards, electricCards);
    res.json(cards);
  } catch (error) {
    console.error(error);
    res
      .status(404)
      .send("An error occurred while fetching cards from the database");
  }
}

async function seed(req, res) {
  try {
    const flattenedData = [].concat(
      seedData[0].fireCards,
      seedData[0].waterCards,
      seedData[0].grassCards,
      seedData[0].electricCards
    );

    const formattedData = flattenedData.map((card) => {
      return {
        category: card.category,
        value: card.value,
        name: card.name,
        image: card.image,
      };
    });

    await Pokemon.bulkCreate(formattedData);
    res.status(200).send("Seed data inserted successfully");
  } catch (error) {
    console.error(error);
    res.status(404).send("An error occurred while seeding the database");
  }
}

module.exports = {
  getAllPokemon,
  createPokemon,
  getPokemonById,
  updatePokemon,
  deletePokemon,
  fetchCards,
  seed,
};
