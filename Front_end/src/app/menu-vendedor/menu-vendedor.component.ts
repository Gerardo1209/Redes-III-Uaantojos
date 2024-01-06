import { Component } from '@angular/core';
import { DataServiceService } from '../services/data-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-vendedor',
  templateUrl: './menu-vendedor.component.html',
  styleUrls: ['./menu-vendedor.component.css']
})
export class MenuVendedorComponent {
  constructor(private dataService: DataServiceService, private router:Router){}
  salir(){
    this.dataService.clearData('usuario');
    this.router.navigateByUrl('/')
  }
}
