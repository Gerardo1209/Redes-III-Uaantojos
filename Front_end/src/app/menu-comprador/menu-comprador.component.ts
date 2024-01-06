import { Component } from '@angular/core';
import { DataServiceService } from '../services/data-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-comprador',
  templateUrl: './menu-comprador.component.html',
  styleUrls: ['./menu-comprador.component.css']
})
export class MenuCompradorComponent {
  constructor(private dataService: DataServiceService, private router:Router){}
  salir(){
    this.dataService.clearData('usuario');
    this.router.navigateByUrl('/')
  }
}
