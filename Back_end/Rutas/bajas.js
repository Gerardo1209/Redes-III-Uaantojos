const express = require('express');
const {body, validationResult} = require('express-validator');
const router = express.Router();
const fileManager = require("./fileManager");
const fs = require("fs").promises;

router.delete(
    "/producto",
    [
      body("idProducto").notEmpty().isInt(),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
              res.status(400).json({ success: false, err: errors });
              return;
            }
            let body = req.body;
            let file = fileManager.ruta + "\\data2\\producto.json";
            //Comprobar que el archivo existe, si no lo crea vacio
            if (await fileManager.checkFileExist(file)) {
              let data = await fs.readFile(file);
              data = fileManager.decrypt(data).toString();
              let productos = JSON.parse(data);
              if (productos.length > 0) {
                let producto = productos.find((prodcutoBuscar) => prodcutoBuscar.id == body.idProducto);
                if(await fileManager.updateProducto(
                  producto.id, producto.nombre, 0, producto.precio, producto.descripcion, true
                )){
                  res.status(200).send({ success: true });
                }else{
                  res.status(500).send({
                      success: false,
                      message: "Hubo un error al eliminar el producto",
                    });
                    return;
                }
              }else{
                  res.status(500).send({
                      success: false,
                      message: "No hay productos",
                    });
                    return;
              }
            } else {
              res.status(500).send({
                success: false,
                message: "Ha ocurrido un error al buscar el archivo",
              });
            }
          } catch (error) {
            res.status(500).send({
              success: false,
              message: error.message,
            });
          }
        }
  );

  router.delete(
    "/venta",
    [
      body("idVenta").notEmpty().isInt(),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
              res.status(400).json({ success: false, err: errors });
              return;
            }
            let body = req.body;
            let file = fileManager.ruta + "\\data1\\venta.json";
            //Comprobar que el archivo existe, si no lo crea vacio
            if (await fileManager.checkFileExist(file)) {
              let data = await fs.readFile(file);
              data = fileManager.decrypt(data).toString();
              let productos = JSON.parse(data);
              if (productos.length > 0) {
                if(await fileManager.bajaVenta(
                  body.idVenta
                )){
                  res.status(200).send({ success: true });
                }else{
                  res.status(500).send({
                      success: false,
                      message: "Hubo un error al eliminar la venta",
                    });
                    return;
                }
              }else{
                  res.status(500).send({
                      success: false,
                      message: "No hay ventas",
                    });
                    return;
              }
            } else {
              res.status(500).send({
                success: false,
                message: "Ha ocurrido un error al buscar el archivo",
              });
            }
          } catch (error) {
            res.status(500).send({
              success: false,
              message: error.message,
            });
          }
        }
  );

module.exports = router