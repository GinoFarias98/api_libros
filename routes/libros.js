const express = require("express");
const router = express.Router();
const libros = require("../dataBase");
const joi = require("joi");

const libroSchema = joi.object({
  titulo: joi.string().required().label("Titulo"),
  autor: joi.string().required().label("Autor"),
});

router.get("/", (req, res, next) => {
  try {
    res.json(libros);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", (req, res, next) => {
  try {
    const id = req.params.id;
    const libro = libros.find((l) => l.id === id);

    if (!libro) {
      const error = new Error("Libro no encontrado");
      error.status = 400;
      throw error;
    }

    res.json(libro);
  } catch (err) {
    next(err);
  }
});

router.post("/", (req, res, next) => {
  try {
    const { error, value } = libroSchema.validate(req.body);

    if (error) {
      const validarError = new Error("Error de validación");
      validarError.status = 400;
      validarError.details = error.details.map((detail) => detail.message);
      throw validarError;
    }

    const { titulo, autor } = value;

    const nuevoLibro = {
      id: libros.length + 1,
      titulo,
      autor,
    };
    libros.push(nuevoLibro);
    res.status(201).json(nuevoLibro);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", (req, res, next) => {
  try {
    const id = req.params.id;
    const { error, value } = libroSchema.validate(req.body);

    if (error) {
      const validarError = new Error("Error de validación");
      validarError.status = 400;
      validarError.details = error.details.map((detail) => detail.message);
      throw validarError;
    }
    const { titulo, autor } = value;
    const libro = libros.find((l) => l.id === id);

    if (!libro) {
      const error = new Error("Libro no encontrado");
      error.status = 400;
      throw error;
    }
    libro.titulo = titulo || libro.titulo;
    libro.autor = autor || libro.autor;
    res.json(libro);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", (req, res, next) => {
  try {
    const id = req.params.id;
    const index = libros.findIndex((l) => l.id === id);

    if (index === -1) {
      const error = new Error("Libro inexistente");
      error.status = 404;
      throw error;
    }

    //splice para retirar el elemento con id=index y solo 1 elemento
    // como indica el segundo param
    const libroEliminado = libros.splice(index, 1);
    //devolver el elemento 0 del array
    //(en este caso solo existe un solo elemento)
    res.json(libroEliminado[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;