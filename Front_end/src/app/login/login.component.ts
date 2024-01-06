import { Component,EventEmitter } from '@angular/core';
import Swal from 'sweetalert2';
import { BackendService } from '../services/backend.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  usuario!:string;
  contrasena!:string;
  loginEvent = new EventEmitter();
  constructor(private backService:BackendService, private router:Router){}
  formUser = new FormGroup({
    'correo': new FormControl('', [Validators.required, Validators.email]),
    'contrasena': new FormControl('',[Validators.required]),
  })

  login(){
    if(this.formUser.valid){
      let body = {
        correo: this.formUser.controls.correo.value,
        contrasena: this.formUser.controls.contrasena.value
      }
      this.backService.alta('/login',body).then((data:any) => {
        if(data.success){
          Swal.fire('Login', 'Se ha iniciado sesión correctametne', 'success').then(()=>{
            sessionStorage.setItem('usuario', JSON.stringify(data.user))
            if(data.user.nombreComercial){
              this.router.navigateByUrl('/menu_vendedor');
            }else{
              this.router.navigateByUrl('/menu_comprador');
            }
          })
        }else{
          Swal.fire('Login', data.message + '.', 'error')
        }
      })
    }
  }
}
