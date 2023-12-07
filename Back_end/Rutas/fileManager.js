const fs = require("fs").promises;
const crypto = require("crypto");
const ruta = __dirname + "/../data";
const algorithm = "aes-256-ctr";
let key = process.env.KEY;
key = crypto.createHash("sha256").update(key).digest("base64").substr(0, 32);

const encrypt = (buffer) => {
  // Create an initialization vector
  const iv = crypto.randomBytes(16);
  // Create a new cipher using the algorithm, key, and iv
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  // Create the new (encrypted) buffer
  const result = Buffer.concat([iv, cipher.update(buffer), cipher.final()]);
  return result;
};

const decrypt = (encrypted) => {
  // Get the iv: the first 16 bytes
  const iv = encrypted.slice(0, 16);
  // Get the rest
  encrypted = encrypted.slice(16);
  // Create a decipher
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  // Actually decrypt it
  const result = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return result;
};

async function checkFileExist(file) {
  try {
    await fs.readFile(file);
    return true;
  } catch (error) {
    if (error.code == "ENOENT") {
      await fs.writeFile(file, encrypt(Buffer.from("[]")));
      return true;
    } else {
      return false;
    }
  }
}

//Consultas
async function clientes() {
  const file = ruta + "/data2/cliente.json";
  try {
    let data = await fs.readFile(file);
    data = decrypt(data).toString();
    let clientes = JSON.parse(data);
    return clientes;
  } catch (error) {
    return [];
  }
}
async function cliente(id) {
  const file = ruta + "/data2/cliente.json";
  try {
    let data = await fs.readFile(file);
    data = decrypt(data).toString();
    let clientes = JSON.parse(data);
    if (clientes.length == 0) return undefined;
    let cliente = clientes.find((clienteBuscar) => clienteBuscar.id == id);
    return cliente;
  } catch (error) {
    return undefined;
  }
}
async function loginCliente(correo) {
  const file = ruta + "/data2/cliente.json";
  try {
    let data = await fs.readFile(file);
    data = decrypt(data).toString();
    let clientes = JSON.parse(data);
    if (clientes.length == 0) return undefined;
    let cliente = await clientes.find(
      (clienteBuscar) => clienteBuscar.correo == correo
    );
    return cliente;
  } catch (error) {
    return undefined;
  }
}
async function direccion(idVendedor) {
  const file = ruta + "/data2/direccion.json";
  try {
    let data = await fs.readFile(file);
    data = decrypt(data).toString();
    let direcciones = JSON.parse(data);
    if (direcciones.length == 0) return undefined;
    let direccion = await direcciones.find(
      (dirBuscar) => dirBuscar.idVendedor == idVendedor
    );
    return direccion;
  } catch (error) {
    return undefined;
  }
}
async function vendedores() {
  const file = ruta + "/data1/vendedor.json";
  try {
    let data = await fs.readFile(file);
    data = decrypt(data).toString();
    let vendedores = JSON.parse(data);
    return vendedores;
  } catch (error) {
    return [];
  }
}
async function vendedor(id) {
  const file = ruta + "/data1/vendedor.json";
  try {
    let data = await fs.readFile(file);
    data = decrypt(data).toString();
    let vendedores = JSON.parse(data);
    if (vendedores.length == 0) return undefined;
    let vendedor = vendedores.find((vendedorBuscar) => vendedorBuscar.id == id);
    return vendedor;
  } catch (error) {
    return undefined;
  }
}
async function loginVendedor(correo) {
  const file = ruta + "/data1/vendedor.json";
  try {
    let data = await fs.readFile(file);
    data = decrypt(data).toString();
    let vendedores = JSON.parse(data);
    if (vendedores.length == 0) return undefined;
    let vendedor = await vendedores.find(
      (vendedorBuscar) => vendedorBuscar.correo == correo
    );
    return vendedor;
  } catch (error) {
    return undefined;
  }
}
async function productos() {
  const file = ruta + "/data2/producto.json";
  try {
    let data = await fs.readFile(file);
    data = decrypt(data).toString();
    let productos = JSON.parse(data);
    for (let i = 0; i < productos.length; i++) {
      const element = productos[i];
      let ven = await vendedor(element.idVendedor);
      productos[i].vendedor = ven.nombreComercial;
    }
    return productos;
  } catch (error) {
    return [];
  }
}
async function producto(id) {
  const file = ruta + "/data2/producto.json";
  try {
    let data = await fs.readFile(file);
    data = decrypt(data).toString();
    let productos = JSON.parse(data);
    if (productos.length == 0) return undefined;
    let producto = await productos.find((productoBuscar) => productoBuscar.id == id);
    let ven = await vendedor(producto.idVendedor);
    producto.vendedor = ven.nombreComercial;
    return producto;
  } catch (error) {
    return undefined;
  }
}

async function productoVendedor(idVendedor) {
  const file = ruta + "/data2/producto.json";
  try {
    let data = await fs.readFile(file);
    data = decrypt(data).toString();
    let productos = JSON.parse(data);
    if (productos.length == 0) return [];
    let producto = await productos.filter(
      (productoBuscar) => productoBuscar.idVendedor == idVendedor
    );
    return producto;
  } catch (error) {
    return [];
  }
}

async function ventas() {
  const file = ruta + "/data1/venta.json";
  try {
    let data = await fs.readFile(file);
    data = decrypt(data).toString();
    let ventas = JSON.parse(data);
    return ventas;
  } catch (error) {
    return [];
  }
}
async function venta(id) {
  const file = ruta + "/data1/venta.json";
  try {
    let data = await fs.readFile(file);
    data = decrypt(data).toString();
    let ventas = JSON.parse(data);
    if (ventas.length == 0) return undefined;
    let venta = ventas.find((ventaBuscar) => ventaBuscar.id == id);
    let ven = await vendedor(venta.idVendedor);
    venta.nombreComercial = ven.nombreComercial;
    let comp = await cliente(venta.idCliente);
    venta.cliente = comp.nombre + " " + comp.primape + " " + comp.segape;
    return venta;
  } catch (error) {
    return undefined;
  }
}
async function ventaCliente(idCliente) {
  const file = ruta + "/data1/venta.json";
  try {
    let data = await fs.readFile(file);
    data = decrypt(data).toString();
    let ventas = JSON.parse(data);
    if (ventas.length == 0) return [];
    let venta = await ventas.filter(
      (ventaBuscar) => ventaBuscar.idCliente == idCliente
    );
    for (let i = 0; i < venta.length; i++) {
      const element = venta[i];
      let ven = await vendedor(element.idVendedor);
      venta[i].nombreComercial = ven.nombreComercial;
    }
    return venta;
  } catch (error) {
    return [];
  }
}
async function ventaVendedor(idVendedor) {
  const file = ruta + "/data1/venta.json";
  try {
    let data = await fs.readFile(file);
    data = decrypt(data).toString();
    let ventas = JSON.parse(data);
    if (ventas.length == 0) return [];
    let venta = await ventas.filter(
      (ventaBuscar) => ventaBuscar.idVendedor == idVendedor
    );
    for (let i = 0; i < venta.length; i++) {
      const element = venta[i];
      let ven = await cliente(element.idCliente);
      venta[i].cliente = ven.nombre + " " + ven.primape + " " + ven.segape;
    }
    return venta;
  } catch (error) {
    return [];
  }
}
async function detalleVenta(id) {
  const file = ruta + "/data1/detalle.json";
  try {
    let data = await fs.readFile(file);
    data = decrypt(data).toString();
    let detalles = JSON.parse(data);
    if (detalles.length == 0) return [];
    let detalle = detalles.filter(
      (detalleBuscar) => detalleBuscar.idVenta == id
    );
    for (let i = 0; i < detalles.length; i++) {
      const element = detalles[i];
      let prod = await producto(element.idProducto);
      detalles[i].producto = prod.nombre;
    }
    return detalle;
  } catch (error) {
    return [];
  }
}

//Cambios
async function updateProducto(
  id,
  nombre,
  cantidad,
  precio,
  descripcion,
  baja = false
) {
  const file = ruta + "/data2/producto.json";
  try {
    let data = await fs.readFile(file);
    data = decrypt(data).toString();
    let productos = JSON.parse(data);
    if (productos.length == 0) return undefined;
    let producto = productos.find((productoBuscar) => productoBuscar.id == id);
    let index = productos.indexOf(producto);
    productos[index] = {
      id: id,
      nombre: nombre,
      cantidad: cantidad,
      precio: precio,
      descripcion: descripcion,
      idVendedor: producto.idVendedor,
      baja: baja,
    };
    await fs.writeFile(file, encrypt(Buffer.from(JSON.stringify(productos))));
    return true;
  } catch (error) {
    return false;
  }
}
async function updateCliente(id, correo, contrasena, nombre, primape, segape) {
  const file = ruta + "/data2/cliente.json";
  try {
    let data = await fs.readFile(file);
    data = decrypt(data).toString();
    let clientes = JSON.parse(data);
    if (clientes.length == 0) return false;
    let cliente = clientes.find((clienteBuscar) => clienteBuscar.id == id);
    let index = clientes.indexOf(cliente);
    clientes[index] = {
      id: id,
      correo: correo,
      contrasena: contrasena,
      nombre: nombre,
      primape: primape,
      segape: segape,
    };
    await fs.writeFile(file, encrypt(Buffer.from(JSON.stringify(clientes))));
    return true;
  } catch (error) {
    return false;
  }
}
async function updateVendedor(
  id,
  nombreComercial,
  correo,
  contrasena,
  nombre,
  primape,
  segape,
  ubicacion,
  activo = false
) {
  const file = ruta + "/data1/vendedor.json";
  try {
    let data = await fs.readFile(file);
    data = decrypt(data).toString();
    let vendedores = JSON.parse(data);
    if (vendedores.length == 0) return false;
    let vendedor = vendedores.find((vendedorBuscar) => vendedorBuscar.id == id);
    let index = vendedores.indexOf(vendedor);

    vendedores[index] = {
      id: id,
      nombreComercial: nombreComercial,
      correo: correo,
      contrasena: contrasena,
      nombre: nombre,
      pirmape: primape,
      segape: segape,
      ubicacion: ubicacion,
      activo: activo
    };
    await fs.writeFile(file, encrypt(Buffer.from(JSON.stringify(vendedores))));
    return true;
  } catch (error) {
    return false;
  }
}
//bajas
async function bajaVenta(id) {
  const file = ruta + "/data1/venta.json";
  const detalleFile = ruta + "/data1/detalle.json";
  try {
    //Eliminar detalles
    let detalledata = await fs.readFile(detalleFile, "utf-8");
    detalledata = decrypt(detalledata).toString();
    let detalles = JSON.parse(detalledata);
    if (detalles.length == 0) return false;
    let detalle = await detalles.filter((detBuscar) => detBuscar.idVenta == id);
    if (detalle.length == 0) return false;
    detalles = await detalles.filter((detBuscar) => detBuscar.idVenta != id);
    await fs.writeFile(
      detalleFile,
      encrypt(Buffer.from(JSON.stringify(detalles)))
    );
    //Elimina la venta
    let data = await fs.readFile(file);
    data = decrypt(data).toString();
    let ventas = JSON.parse(data);
    if (ventas.length == 0) return false;
    let venta = await ventas.find((ventaBuscar) => ventaBuscar.id == id);
    if (venta == undefined) return false;
    ventas = await ventas.filter((elemento) => elemento.id != id);
    await fs.writeFile(file, encrypt(Buffer.from(JSON.stringify(ventas))));
    return true;
  } catch (error) {
    return undefined;
  }
}

module.exports = {
  ruta,
  checkFileExist,
  clientes,
  cliente,
  vendedores,
  vendedor,
  ventas,
  venta,
  detalleVenta,
  productos,
  producto,
  updateProducto,
  updateCliente,
  updateVendedor,
  bajaVenta,
  productoVendedor,
  ventaCliente,
  ventaVendedor,
  loginVendedor,
  loginCliente,
  encrypt,
  decrypt,
  direccion
};
