import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { BackendService } from '../services/backend.service';
import { DataServiceService } from '../services/data-service.service';
@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  productos:prod[]=[];
  detProd:producto[]=[];
  totalGeneral:number = 0;
  constructor(private dataService:DataServiceService, private backService:BackendService){}

  eliminarProd(prodId:Number){
    Swal.fire('Eliminar','Se ha eliminado el producto exitosamente','success').then(()=>{
      this.productos = this.productos.filter((prod)=>prod.id !== prodId);
      this.dataService.saveData(this.productos,'carrito');
      this.cargarCarrito()
      this.calcTotal()
    })
  }

  calcTotal(){
    let sub = 0;
    this.detProd.forEach(prod => {
      sub += prod.subtotal;
    });
    this.totalGeneral = sub;
  }

  async add(prodId:number){
    let prod = await this.detProd.find((prod) => prod.id == prodId);
    let prod2 = this.productos.find((prod)=>prod.id == prodId);
    if(prod && prod2 && prod.cantidadAgregada < prod.cantidad){
      prod.cantidadAgregada++;
      prod.subtotal = prod.cantidadAgregada * prod.precio;
      prod2.cantidad = prod.cantidadAgregada;
      this.dataService.saveData(this.productos,'carrito');
    }
    this.calcTotal()
  }

  async remove(prodId:number){
    let prod = await this.detProd.find((prod) => prod.id == prodId);
    let prod2 = this.productos.find((prod)=>prod.id == prodId);
    if(prod && prod2 && prod.cantidadAgregada > 1){
      prod.cantidadAgregada--;
      prod.subtotal = prod.cantidadAgregada * prod.precio;
      prod2.cantidad = prod.cantidadAgregada;
      this.dataService.saveData(this.productos,'carrito');
    }
    this.calcTotal()
  }

  async ngOnInit(): Promise<void> {
      await this.cargarCarrito();
  }

  async cargarCarrito(){
    const data = this.dataService.getData('carrito');
    if (data && Array.isArray(data)) {
      this.productos = data;
    }
    this.cargarProductos();
  }

  async cargarProductos(){
    this.detProd = []
    this.productos.forEach(async (prod)=>{
      let consulta = await this.backService.consulta('/producto/'+prod.id);
      consulta.forEach((data:any) => {
        let detprod = <producto>data.producto;
        detprod.cantidadAgregada = prod.cantidad;
        detprod.subtotal = detprod.cantidadAgregada * detprod.precio;
        this.detProd.push(detprod);
        this.calcTotal()
      })
    })
  }

  apartar(){
    if(this.detProd.length!=0){
      let usuario = this.dataService.getData('usuario')
      let body = {
        idCliente: usuario.id,
        idVendedor: this.detProd[0].idVendedor,
        productos: JSON.stringify(this.productos)
      }
      this.backService.alta('/venta', body).then((res:any) => {
        if(res.success){
          Swal.fire('Apartado','Se ha apartado correctamente los productos, puede ir a recogerlos','success').then(() => {
            this.productos = []
            this.dataService.saveData(this.productos, 'carrito')
            this.cargarCarrito();
          })
        }else{
          Swal.fire('Apartado', res.message, 'error');
        }
      })
    }
  }
}


interface prod {
  id:number,
  cantidad:number
}

interface producto {
  id: number,
  nombre: string,
  cantidad: number,
  precio: number,
  descripcion: string,
  idVendedor: number,
  baja: boolean,
  vendedor: string,
  cantidadAgregada: number,
  subtotal: number,
  imagen: string
}
