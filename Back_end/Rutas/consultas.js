const express = require('express');
const router = express.Router();
const fileManager = require("./fileManager");

router.get('/vendedores', async (req, res) => {
    let vendedores = await fileManager.vendedores()
    if(vendedores.length != 0){
        let sendVend = []
        for (let i = 0; i < vendedores.length; i++) {
            const vendedor = vendedores[i];
            sendVend.push({
                id: vendedor.id,
                nombreComercial: vendedor.nombreComercial,
                correo: vendedor.correo,
                nombre: vendedor.nombre,
                ubicacion: vendedor.ubicacion,
                activo: vendedor.activo
            })
        }
        res.status(200).send({
            success: true,
            vendedores: sendVend
        })
    }else{
        res.status(500).send({
            success: false,
            message: "No hay vendedores"
        })
    }
})

router.get('/vendedor/:idVendedor', async (req, res) => {
    let vendedor = await fileManager.vendedor(req.params.idVendedor)
    if(vendedor != undefined){
        let envVend = {
            nombreComercial: vendedor.nombreComercial,
            correo: vendedor.correo,
            nombre: vendedor.nombre,
            ubicacion: vendedor.ubicacion,
            activo: vendedor.activo
        }
        res.status(200).send({
            success: true,
            vendedor: envVend
        })
    }else{
        res.status(500).send({
            success: false,
            message: "No existe el vendedor"
        })
    }
})

router.get('/productos', async (req, res) => {
    let productos = await fileManager.productos()
    if(productos.length != 0){
        res.status(200).send({
            success: true,
            productos: productos
        })
    }else{
        res.status(500).send({
            success: false,
            message: "No hay productos"
        })
    }
})

router.get('/producto/:idProducto', async (req, res) => {
    let producto = await fileManager.producto(req.params.idProducto)
    if(producto != undefined){
        res.status(200).send({
            success: true,
            producto: producto
        })
    }else{
        res.status(500).send({
            success: false,
            message: "No existe el producto"
        })
    }
})


router.get('/vendedor/:idVendedor/productos', async (req, res) => {
    let productos = await fileManager.productoVendedor(req.params.idVendedor)
    if(productos.length != 0){
        res.status(200).send({
            success: true,
            productos: productos
        })
    }else{
        res.status(500).send({
            success: false,
            message: "No hay productos"
        })
    }
})

router.get('/cliente/:idCliente/ventas', async (req, res) => {
    let ventas = await fileManager.ventaCliente(req.params.idCliente)
    if(ventas.length != 0){
        res.status(200).send({
            success: true,
            ventas: ventas
        })
    }else{
        res.status(500).send({
            success: false,
            message: "No hay ventas"
        })
    }
})

router.get('/vendedor/:idVendedor/ventas', async (req, res) => {
    let ventas = await fileManager.ventaVendedor(req.params.idVendedor)
    if(ventas.length != 0){
        res.status(200).send({
            success: true,
            ventas: ventas
        })
    }else{
        res.status(500).send({
            success: false,
            message: "No hay ventas"
        })
    }
})

router.get('/venta/:idVenta', async (req, res) => {
    let detalles = await fileManager.detalleVenta(req.params.idVenta)
    let venta = await fileManager.venta(req.params.idVenta)
    if(detalles.length != 0 && venta != undefined){
        res.status(200).send({
            success: true,
            detalles: detalles,
            venta: venta
        })
    }else{
        res.status(500).send({
            success: false,
            message: "No hay detalles de la venta"
        })
    }
})

module.exports = router