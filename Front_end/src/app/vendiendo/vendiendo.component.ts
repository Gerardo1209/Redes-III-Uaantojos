import { Component, OnDestroy, OnInit } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { Router } from '@angular/router';
import { DataServiceService } from '../services/data-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vendiendo',
  templateUrl: './vendiendo.component.html',
  styleUrls: ['./vendiendo.component.css']
})
export class VendiendoComponent implements OnInit, OnDestroy{
  updateUsuario:any;
  updatePedodos:any;
  usuario:any;
  ubicacion!:GeolocationCoordinates;
  ventas:venta[] = []

  constructor(private backendService:BackendService, private dataService:DataServiceService, private router:Router){
    this.usuario = this.dataService.getData('usuario');
    this.ngOnInit();
  }

  ngOnDestroy(): void {
    if (this.updateUsuario) {

      let body = {
        id: this.usuario.id,
        nombreComercial: this.usuario.nombreComercial,
        correo: this.usuario.correo,
        contrasena: this.usuario.contrasena,
        nombre: this.usuario.nombre,
        primape: this.usuario.primape,
        segape: this.usuario.segape,
        ubicacion:JSON.stringify({
          longitud: this.ubicacion.latitude,
          latitud: this.ubicacion.longitude
        }),
        activo: false
      }
      this.backendService.actualizacion('/vendedor', body).then((res:any) => {
        if(res.success){
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
            title: 'Saliendo del modo activo'
          })
        }else{
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
            icon: 'error',
            title: 'Error al salir del modo activo'
          })
        }
      })
      console.log(this.updateUsuario)
    }
  }

  ngOnInit() {
    this.getUsuario()
    this.getVentas()
    this.updatePedodos = setInterval(() => {
      this.getVentas()
    }, 10000);
    this.updateUsuario = setInterval(() => {
      navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
        this.ubicacion = position.coords;
        let body = {
          id: this.usuario.id,
          nombreComercial: this.usuario.nombreComercial,
          correo: this.usuario.correo,
          contrasena: this.usuario.contrasena,
          nombre: this.usuario.nombre,
          primape: this.usuario.primape,
          segape: this.usuario.segape,
          ubicacion:JSON.stringify({
            longitud:  this.ubicacion.latitude,
            latitud: this.ubicacion.longitude
          }),
          activo: true
        }
        this.backendService.actualizacion('/vendedor', body).then((res:any) => {})
      }, (error) => {
        Swal.fire('Ubicación', 'No se ha podido obtener la ubicación', 'error')
      }, {enableHighAccuracy: true, maximumAge: 0});
    }, 10000 /**Cada 10 segudndos actualza */)
  }
  getUsuario(){
    try{
      navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
        this.ubicacion = position.coords;
        let body = {
          id: this.usuario.id,
          nombreComercial: this.usuario.nombreComercial,
          correo: this.usuario.correo,
          contrasena: this.usuario.contrasena,
          nombre: this.usuario.nombre,
          primape: this.usuario.primape,
          segape: this.usuario.segape,
          activo: true,
          ubicacion:JSON.stringify({
            longitud: this.ubicacion.longitude,
            latitud: this.ubicacion.latitude
          })
        }
        console.log(body)
        this.backendService.actualizacion('/vendedor', body).then((res:any) => {
          console.log(res)
          if(res.success){
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
              title: 'Se esta actualizando su ubicación de forma constante'
            })
          }else{
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
              icon: 'error',
              title: 'Ha habido un error al actualizar la ubicación'
            })
          }
        })
      }, (error) => {
        Swal.fire('Ubicación', 'No se ha podido obtener la ubicación', 'error')
      }, {enableHighAccuracy: true, maximumAge: 0});
    }catch(error){
      console.log(error)
    }

  }

  regresar(){
    clearInterval(this.updateUsuario);
    clearTimeout(this.updateUsuario);
    clearInterval(this.updatePedodos);
    clearTimeout(this.updatePedodos);
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
