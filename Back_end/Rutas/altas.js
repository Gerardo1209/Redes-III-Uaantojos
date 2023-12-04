const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const fileManager = require("./fileManager");
const fs = require("fs").promises;

router.post(
  "/cliente",
  [
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
        let maxId = 0;
        if (clientes.length > 0) {
          //Revisa que el correo no este repetido
          if (clientes.find((cliente) => cliente.correo == body.correo)) {
            res.status(500).send({
              success: false,
              message: "El correo ya esta en uso",
            });
            return;
          }
          //Busca el cliente con el ID más grande
          maxId = clientes.reduce((prev, current) => {
            return prev && prev.id > current.id ? prev : current;
          });
          //Max ID se queda solo con la propiedad del id
          maxId = maxId.id;
        }
        //Se crea el nuevo cliente
        clientes.push({
          id: maxId + 1,
          correo: body.correo,
          contrasena: body.contrasena,
          nombre: body.nombre,
          primape: body.primape,
          segape: body.segape,
        });
        //Se escribe y se alamacena
        await fs.writeFile(file, fileManager.encrypt(Buffer.from(JSON.stringify(clientes))));
        res.status(201).send({ success: true });
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

router.post(
  "/vendedor",
  [
    body("nombreComercial").notEmpty().isString(),
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
      let fileCte = fileManager.ruta + "\\data2\\cliente.json";
      let file = fileManager.ruta + "\\data1\\vendedor.json";
      //Comprobar que el archivo existe, si no lo crea vacio
      if (await fileManager.checkFileExist(file) && await fileManager.checkFileExist(fileCte)) {
        //Comprueba que no haya clientes con el mismo correo
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
        //Primero hay que leer el archivo para buscar cual es el siguiente ID
        let data = await fs.readFile(file);
        data = fileManager.decrypt(data).toString();
        let vendedores = JSON.parse(data);
        let maxId = 0;
        if (vendedores.length > 0) {
          //Revisa que el correo no este repetido
          if (vendedores.find((vendedor) => vendedor.correo == body.correo)) {
            res.status(500).send({
              success: false,
              message: "El correo ya esta en uso",
            });
            return;
          }
          //Busca el cliente con el ID más grande
          maxId = vendedores.reduce((prev, current) => {
            return prev && prev.id > current.id ? prev : current;
          });
          //Max ID se queda solo con la propiedad del id
          maxId = maxId.id;
        }
        //Se crea el nuevo cliente
        vendedores.push({
          id: maxId + 1,
          nombreComercial: body.nombreComercial,
          correo: body.correo,
          contrasena: body.contrasena,
          nombre: body.nombre,
          primape: body.primape,
          segape: body.segape,
          ubicacion: "",
          activo: false
        });
        //Se escribe y se alamacena
        await fs.writeFile(file, fileManager.encrypt(Buffer.from(JSON.stringify(vendedores))));
        res.status(201).send({ success: true });
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

router.post(
  "/producto",
  [
    body("idVendedor").notEmpty().isInt(),
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
        //Revisa que el vendedor exista
        if ((await fileManager.vendedor(body.idVendedor)) == undefined) {
          res.status(500).send({
            success: false,
            message:
              "El vendedor al que se quiere asociar el producto no existe",
          });
          return;
        }
        if(body.cantidad < 0){
            res.status(500).send({
                success: false,
                message:
                  "La cantidad del producto no puede ser menor a cero",
              });
              return;
        }
        //Primero hay que leer el archivo para buscar cual es el siguiente ID
        let data = await fs.readFile(file);
        data = fileManager.decrypt(data).toString();
        let productos = JSON.parse(data);
        let maxId = 0;
        if (productos.length > 0) {
          //Busca el producto con el ID más grande
          maxId = productos.reduce((prev, current) => {
            return prev && prev.id > current.id ? prev : current;
          });
          //Max ID se queda solo con la propiedad del id
          maxId = maxId.id;
        }
        //Se crea el nuevo producto
        productos.push({
          id: maxId + 1,
          nombre: body.nombre,
          cantidad: parseInt(body.cantidad),
          precio: parseFloat(body.precio),
          descripcion: body.descripcion,
          idVendedor: parseInt(body.idVendedor),
          baja: false
        });
        //Se escribe y se alamacena
        await fs.writeFile(file, fileManager.encrypt(Buffer.from(JSON.stringify(productos))));
        res.status(201).send({ success: true });
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
router.post(
  "/venta",
  [
    body("idVendedor").notEmpty().isInt(),
    body("idCliente").notEmpty().isInt(),
    body("productos").notEmpty().isJSON(),
    /**
     * Los productos enviados tienen que ser un array de JSON
     * con el siguiente formato:
     * {
     *    id:1
     *    cantidad:4
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
      let file = fileManager.ruta + "\\data1\\venta.json";
      let fileDetalle = fileManager.ruta + "\\data1\\detalle.json";
      //Comprobar que el archivo existe, si no lo crea vacio
      if (
        (await fileManager.checkFileExist(file)) &&
        (await fileManager.checkFileExist(fileDetalle))
      ) {
        //Revisa que el vendedor exista
        if ((await fileManager.vendedor(body.idVendedor)) == undefined) {
          res.status().send({
            success: false,
            message: "El vendedor al que se quiere asociar la venta no existe",
          });
          return;
        }
        //Revisa que el cliente exista
        if ((await fileManager.cliente(body.idCliente)) == undefined) {
          res.status(500).send({
            success: false,
            message: "El cliente al que se quiere asociar la venta no existe",
          });
          return;
        }
        let productosAgregar = JSON.parse(body.productos);
        //Revisa que los productos existan y sean del vendedor que realiza la venta
        let check = true;
        for (let i = 0; i < productosAgregar.length; i++) {
          const producto = productosAgregar[i];
          let cmpProducto = await fileManager.producto(producto.id);
          //Si no existe el producto
          if (cmpProducto == undefined) {
            check = false;
            res.status(500).send({
              success: false,
              message: "Uno o varios productos no existen",
            });
            break;
          }
          //Si el producto no esta relacionado con el vendedor
          if (cmpProducto.idVendedor != body.idVendedor) {
            check = false;
            res.status(500).send({
              success: false,
              message:
                "Uno o varios productos no estan relacionados con el mismo vendedor",
            });
            break;
          }
          if (cmpProducto.cantidad < producto.cantidad) {
            check = false;
            res.status(500).send({
              success: false,
              message:
                "Uno o varios productos tienen menos existencias que las que se desean comprar",
            });
            break;
          }
        }
        if (!check) return;
        //Primero hay que leer el archivo para buscar cual es el siguiente ID
        let data = await fs.readFile(file);
        data = fileManager.decrypt(data).toString();
        let ventas = JSON.parse(data);
        let maxId = 0;
        if (ventas.length > 0) {
          //Busca el producto con el ID más grande
          maxId = ventas.reduce((prev, current) => {
            return prev && prev.id > current.id ? prev : current;
          });
          //Max ID se queda solo con la propiedad del id
          maxId = maxId.id;
        }
        //Se crea el nuevo producto
        let d = new Date();
        d.setTime(d.getTime() - /* UTC-6 */ 6 * 60 * 60 * 1000);
        let fecha = d.toISOString();
        ventas.push({
          id: maxId + 1,
          fecha: fecha,
          idVendedor: parseInt(body.idVendedor),
          idCliente: parseInt(body.idCliente),
        });
        //Se escribe y se alamacena
        await fs.writeFile(file, fileManager.encrypt(Buffer.from(JSON.stringify(ventas))));
        //Ahora se escriben los detalles de venta
        let newDetalles = [];
        for (let i = 0; i < productosAgregar.length; i++) {
          const producto = productosAgregar[i];
          let cmpProducto = await fileManager.producto(producto.id);
          !(await fileManager.updateProducto(
            cmpProducto.id,
            cmpProducto.nombre,
            cmpProducto.cantidad - producto.cantidad,
            cmpProducto.precio,
            cmpProducto.descripcion
          ));
          newDetalles.push({
            idVenta: maxId + 1,
            idProducto: producto.id,
            precio: cmpProducto.precio,
            cantidad: producto.cantidad,
          });
        }
        let dataDetalles = await fs.readFile(fileDetalle);
        dataDetalles = fileManager.decrypt(dataDetalles).toString();
        let detalles = JSON.parse(dataDetalles);
        detalles = detalles.concat(newDetalles);
        await fs.writeFile(fileDetalle, fileManager.encrypt(Buffer.from(JSON.stringify(detalles))));
        res.status(201).send({ success: true });
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

router.post('/login', [
  body('correo').notEmpty().isEmail(),
  body('contrasena').notEmpty().isString()
],
async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, err: errors });
      return;
    }
    let body = req.body;
    let cliente = await fileManager.loginCliente(body.correo)
    let vendedor = await fileManager.loginVendedor(body.correo)
    if(cliente == undefined && vendedor == undefined){
      res.status(401).send({
        success: false,
        message: "No hay ningún usuario con el correo"
      })
      return;
    }
    if(cliente == undefined){
      if(body.contrasena == vendedor.contrasena){
        res.status(200).send({
          success: true,
          user: vendedor
        })
        return;
      }
    }
    if(vendedor == undefined){
      if(body.contrasena == cliente.contrasena){
        res.status(200).send({
          success: true,
          user: cliente
        })
        return;
      }
    }
    res.status(401).send({
      success: false,
      message: "La contraseña es incorrecta"
    })
  }catch(error){
    res.status(500).send({
      success: false,
      message: error
    })
  }
})

module.exports = router;
