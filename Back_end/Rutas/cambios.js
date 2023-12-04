const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const fileManager = require("./fileManager");
const fs = require("fs").promises;

router.put(
  "/cliente",
  [
    body("id").notEmpty().isInt(),
    body("correo").notEmpty().isEmail(),
    body("contrasena").notEmpty().isString(),
    body("nombre").notEmpty().isString(),
    body("primape").notEmpty().isString(),
    body("segape").notEmpty().isString(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ success: false, err: errors });
        return;
      }
      let body = req.body;
      let file = fileManager.ruta + "\\data2\\cliente.json";
      let fileVend = fileManager.ruta + "\\data1\\vendedor.json";
      //Comprobar que el archivo existe, si no lo crea vacio
      if (await fileManager.checkFileExist(file) && await fileManager.checkFileExist(fileVend)) {
        //Compureba que no haya vendedores con el correo
        let dataVend = await fs.readFile(fileVend);
        dataVend = fileManager.decrypt(dataVend).toString();
        let vendedores = JSON.parse(dataVend);
        if (vendedores.length > 0) {
          //Revisa que el correo no este repetido
          if (vendedores.find((vendedor) => vendedor.correo == body.correo)) {
            res.status(500).send({
              success: false,
              message: "El correo ya esta en uso",
            });
            return;
          }
        }
        //Primero hay que leer el archivo para buscar cual es el siguiente ID
        let data = await fs.readFile(file);
        data = fileManager.decrypt(data).toString();
        let clientes = JSON.parse(data);
        if (clientes.length > 0) {
          //Revisa que el correo no este repetido
          let cmpCliente = await clientes.find((cliente) => cliente.correo == body.correo)
          if (cmpCliente != undefined && cmpCliente.correo == body.correo && cmpCliente.id != body.id) {
            res.status(500).send({
              success: false,
              message: "El correo ya esta en uso",
            });
            return;
          }
          if(await fileManager.updateCliente(
            parseInt(body.id), body.correo, body.contrasena, body.nombre, body.primape, body.segape
          )){
            res.status(200).send({ success: true });
          }else{
            res.status(500).send({
                success: false,
                message: "Hubo un error al actualizar el cliente",
              });
              return;
          }
        }else{
            res.status(500).send({
                success: false,
                message: "No hay clientes",
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

router.put(
  "/vendedor",
  [
    body("id").notEmpty().isInt(),
    body("nombreComercial").notEmpty().isString(),
    body("correo").notEmpty().isEmail(),
    body("contrasena").notEmpty().isString(),
    body("nombre").notEmpty().isString(),
    body("primape").notEmpty().isString(),
    body("segape").notEmpty().isString(),
    body("ubicacion").isJSON(),
    body("activo").notEmpty().isBoolean()
    /**
     * La ubicación debe estar en formato JSON con la estructura:
     * {
     *  longitud
     *  latitud
     * }
     */
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ success: false, err: errors });
        return;
      }
      let body = req.body;
      let fileCte = fileManager.ruta + "\\data2\\cliente.json";
      let file = fileManager.ruta + "\\data1\\vendedor.json";
      //Comprobar que el archivo existe, si no lo crea vacio
      if (await fileManager.checkFileExist(file) && await fileManager.checkFileExist(fileCte)) {
        let dataCte = await fs.readFile(fileCte);
        dataCte = fileManager.decrypt(dataCte).toString();
        let clientes = JSON.parse(dataCte);
        if (clientes.length > 0) {
          //Revisa que el correo no este repetido
          if (clientes.find((cliente) => cliente.correo == body.correo)) {
            res.status(500).send({
              success: false,
              message: "El correo ya esta en uso",
            });
            return;
          }
        }
        let data = await fs.readFile(file);
        data = fileManager.decrypt(data).toString();
        let vendedores = JSON.parse(data);
        if (vendedores.length > 0) {
          //Revisa que el correo no este repetido
          let cmpVendedor = await vendedores.find((vendedor) => vendedor.correo == body.correo)
          if (cmpVendedor != undefined && cmpVendedor.correo == body.correo && cmpVendedor.id != body.id) {
            res.status(500).send({
              success: false,
              message: "El correo ya esta en uso",
            });
            return;
          }
          let ubicacion = JSON.parse(body.ubicacion)
          if(await fileManager.updateVendedor(
            parseInt(body.id), body.nombreComercial, body.correo, body.contrasena, body.nombre, body.primape, body.segape, ubicacion, (body.activo=="true" ? true : false)
          )){
            res.status(200).send({ success: true });
          }else{
            res.status(500).send({
                success: false,
                message: "Hubo un error al actualizar el vendedor",
              });
              return;
          }
        }else{
            res.status(500).send({
                success: false,
                message: "No hay usuarios",
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

router.put(
  "/producto",
  [
    body("id").notEmpty().isInt(),
    body("nombre").notEmpty().isString(),
    body("cantidad").notEmpty().isInt(),
    body("precio").notEmpty().isFloat(),
    body("descripcion").notEmpty().isString(),
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
        let vendedores = JSON.parse(data);
        if (vendedores.length > 0) {
          //Revisa que el correo no este repetido
          if(body.cantidad < 0){
            res.status(500).send({
              success: false,
              message: "La cantidad no puede ser menor a cero",
            });
            return;
          }
          if(await fileManager.updateProducto(
            parseInt(body.id), body.nombre,  parseInt(body.cantidad), parseFloat(body.precio), body.descripcion
          )){
            res.status(200).send({ success: true });
          }else{
            res.status(500).send({
                success: false,
                message: "Hubo un error al actualizar el producto",
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

module.exports = router;
