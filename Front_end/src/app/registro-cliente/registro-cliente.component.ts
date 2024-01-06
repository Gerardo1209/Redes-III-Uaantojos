import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { BackendService } from '../services/backend.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-registro-cliente',
  templateUrl: './registro-cliente.component.html',
  styleUrls: ['./registro-cliente.component.css']
})
export class RegistroClienteComponent {
  formUser = this.formBuilder.group({
    'nombre': new FormControl('',[Validators.required]),
    'primape': new FormControl('',[Validators.required]),
    'segape': new FormControl('',[Validators.required]),
    'correo': new FormControl('',[Validators.required, Validators.email]),
    'contrasena': new FormControl('',[Validators.required]),
    'confirmar': new FormControl('',[Validators.required]),
  },
  {
    validators: this.password.bind(this)
  }
  );

  constructor(private backService:BackendService, private router:Router, public formBuilder: FormBuilder){}
  registrar(){
    if(this.formUser.valid){
      let body = {
        correo: this.formUser.controls['correo'].value,
        contrasena: this.formUser.controls['contrasena'].value,
        nombre: this.formUser.controls['nombre'].value,
        primape: this.formUser.controls['primape'].value,
        segape: this.formUser.controls['segape'].value,
      }
      this.backService.alta('/cliente', body).then((data:any) => {
        if(data.success){
          Swal.fire('Registro', 'Se ha creado el usuario correctamente, será redirigido al login', 'success').
          then(() => {
            this.router.navigateByUrl('/login');
          })
        }else{
          Swal.fire('Registro', data.message + '.', 'error')
        }
      })
    }
  }
  password(formGroup: FormGroup) {
    const password  = formGroup.controls['contrasena'].value;
    const confirmPassword = formGroup.controls['confirmar'].value;
    return password === confirmPassword ? null : { passwordNotMatch: true };
  }
}

