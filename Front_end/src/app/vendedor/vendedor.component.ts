import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BackendService, vendedor, producto } from '../services/backend.service';
import Swal from 'sweetalert2';
import { DataServiceService } from '../services/data-service.service';
@Component({
  selector: 'app-vendedor',
  templateUrl: './vendedor.component.html',
  styleUrls: ['./vendedor.component.css']
})
export class VendedorComponent implements OnInit{
  id!:String | null;
  vendedor: vendedor = {
    id: 0,
    nombreComercial: '',
    correo: '',
    nombre: '',
    ubicacion: {
      longitud: 0,
      latitud: 0
    },
    activo: false,
    direccion: {
      edificio: '',
      campus: '',
      salon: ''
    }
  };
  productos: producto[] = [];
  constructor(private activatedroute:ActivatedRoute, private backEndService:BackendService,private dataService:DataServiceService){
    this.ngOnInit()
  }
  async ngOnInit(){
    this.activatedroute.paramMap.subscribe(paramMap => {
      this.id = paramMap.get('id');
    })
    await this.getVendedor()
  }

  async getVendedor(){
    let data = await this.backEndService.consulta('/vendedor/'+this.id);
    data.forEach((vendedor:any) => {
      this.vendedor = <vendedor>vendedor.vendedor;
    })
    await this.getProductos()
  }

  async getProductos(){
    let data = await this.backEndService.consulta('/vendedor/'+this.id+'/productos');
    data.forEach((productos:any) => {
      this.productos = <producto[]>productos.productos;
      console.log(this.productos)
    })
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
}
