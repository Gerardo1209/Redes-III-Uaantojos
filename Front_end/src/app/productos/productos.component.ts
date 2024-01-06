import { Component, OnInit } from '@angular/core';
import { DataServiceService } from '../services/data-service.service';
import { BackendService } from '../services/backend.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  prods:productos[]=[];
  mostrarProductos: productos [] = [];
  busqueda:string = "";
  termino!:HTMLInputElement;
  constructor(private dataService:DataServiceService,private backService:BackendService){}

  async ngOnInit(): Promise<void> {
      await this.getProductos();
  }
  async getProductos(){
    let data = await this.backService.consulta('/productos')
    if(data){
      data.forEach((productos:any)=>{
        this.prods = <productos[]>productos.productos
        this.initBusqueda()
      })
    }
    else{
    }
  }

  async initBusqueda(){
    this.mostrarProductos = this.prods;
    this.termino = <HTMLInputElement> document.getElementById("termino")!;
    this.termino.addEventListener("keyup",() => {
      this.mostrarProductos = [];
      if(this.termino!=undefined && this.termino.value!=""){
        this.busqueda = this.termino.value;
        this.prods.forEach((na:productos)=>{
          if(na.nombre.toString().includes(this.busqueda)){
            this.mostrarProductos.push(na);
          }
        });
      }else{
        this.busqueda = "";
        this.mostrarProductos = this.prods;
      }
    });
  }

  agregarCarrito(idProd:number){
    let aux:prod = {id:idProd,cantidad:1};
    let carrito = <prod[]>this.dataService.getData('carrito');
    if(carrito == null) carrito = [];
    if(carrito.find((prod)=>prod.id === idProd)){
      let add = <prod>carrito.find((prod)=>prod.id === idProd);
      add.cantidad = add.cantidad+1;
    }
    else{
      carrito.push(aux);
    }
    this.dataService.saveData(carrito,'carrito');
    Swal.mixin({
      toast: true,
      position: 'bottom',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    }).fire({
      icon: 'success',
      title: 'Se ha agregado correctamente al carrito'
    })
  }
}

interface prod {
  id:number,
  cantidad:number
}

interface productos {
  id: number,
  nombre: string,
  cantidad: number,
  precio: number,
  descripcion: string,
  idVendedor: number,
  baja: boolean,
  vendedor: string
  imagen: string
}
