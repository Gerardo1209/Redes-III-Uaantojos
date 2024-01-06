import { Component, OnInit } from '@angular/core';
import { BackendService, vendedor } from '../services/backend.service';

@Component({
  selector: 'app-vendedores',
  templateUrl: './vendedores.component.html',
  styleUrls: ['./vendedores.component.css']
})

export class VendedoresComponent implements OnInit{
  vendedores:vendedor[] = []
  mostrarVendedores: vendedor [] = [];
  busqueda:string = "";
  termino!:HTMLInputElement;
  constructor(private backendService:BackendService){

  }

  async initBusqueda(){
    this.mostrarVendedores = this.vendedores;
    this.termino = <HTMLInputElement> document.getElementById("termino")!;
    this.termino.addEventListener("keyup",() => {
      this.mostrarVendedores = [];
      if(this.termino!=undefined && this.termino.value!=""){
        this.busqueda = this.termino.value;
        this.vendedores.forEach((na:vendedor)=>{
          if(na.nombreComercial.toString().includes(this.busqueda)){
            this.mostrarVendedores.push(na);
          }
        });
      }else{
        this.busqueda = "";
        this.mostrarVendedores = this.vendedores;
      }
    });
  }

  async ngOnInit(){
    this.getVendedores();
  }

  async getVendedores(){
    let vend = await this.backendService.consulta('/vendedores');
    vend.forEach((v:any) => {
      this.vendedores = <vendedor[]>v.vendedores;
      this.initBusqueda();
    })
  }

}
