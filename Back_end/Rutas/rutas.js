const express = require("express");
const router = express.Router();
const altas = require("./altas");
const bajas = require("./bajas");
const cambios = require("./cambios");
const consultas = require("./consultas");

/**
 * Cliente: data2
 * Venta: data1
 * Vendedor: data1
 * Producto: data2
 * Detalle: data1
 */

router.get("/test", (req, res) => {
  res.status(200).send({
    id: rute,
    message: "Esto es una prueba",
  });
});

router.use("/alta", altas);
router.use("/baja", bajas);
router.use("/cambio", cambios);
router.use("/consulta", consultas);

module.exports = router;
