import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataServiceService } from '../services/data-service.service';
import { BackendService } from '../services/backend.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit{
  usuario:any;
  ventas:venta[] = []
  constructor(private dataService:DataServiceService, private  backendService:BackendService, private router:Router){
    this.usuario = this.dataService.getData('usuario');
  }



  ngOnInit() {
    this.getVentas();
  }

  regresar(){
    if(this.usuario.nombreComercial){
      this.router.navigateByUrl("/menu_vendedor");
    }else{
      this.router.navigateByUrl("/menu_comprador");
    }
  }

  async getVentas(){
    let data;
    if(this.usuario.nombreComercial){
      data = await this.backendService.consulta('/vendedor/'+this.usuario.id+'/ventas');
    }else{
      data = await this.backendService.consulta('/cliente/'+this.usuario.id+'/ventas');
    }
    data.forEach((ventas:any) => {
      if(ventas.ventas) this.ventas = <venta[]> ventas.ventas;
      this.ventas.forEach((v) => {
        v.fechaFormato = new Date(v.fecha);
      });
      this.ventas.sort((a:venta, b:venta) => {
        return (b.fechaFormato as Date).getTime() - (a.fechaFormato as Date).getTime();
      });
      this.getDetalles()
    })
  }

  eliminarProd(ventaId:number){
    let body = {
      idVenta: ventaId
    }
    this.backendService.eliminar('/venta', body).then((res:any) => {
      if(res.success){
        Swal.fire('Pedidos', 'Se ha eliminado el pedido', 'success')
        this.getVentas();
      }else{
        Swal.fire('Pedidos', res.message, 'error')
      }
    })
  }

  async getDetalles(){
    this.ventas.forEach(async (venta) => {
      let data = await this.backendService.consulta('/venta/'+venta.id);
      data.forEach((detalle:any) => {

        venta.detalles = detalle.detalles;
      })
    })
  }
}

interface venta{
  cliente: string,
  nombreComercial: string,
  fecha: string,
  fechaFormato: Date,
  id: number,
  idCliente: number,
  idVendedor: number
  detalles: detalleventa[]
}

interface detalleventa{
  producto:string,
  precio:number,
  idVenta:number,
  idProducto:number,
  cantidad: number
}
