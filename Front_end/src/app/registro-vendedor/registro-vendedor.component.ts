import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { BackendService } from '../services/backend.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators, FormsModule } from '@angular/forms';
@Component({
  selector: 'app-registro-vendedor',
  templateUrl: './registro-vendedor.component.html',
  styleUrls: ['./registro-vendedor.component.css']
})
export class RegistroVendedorComponent {

  constructor(private backService:BackendService, private router:Router, public formBuilder: FormBuilder){}
  formUser = this.formBuilder.group({
    'nombreComercial': new FormControl('',[Validators.required]),
    'nombre': new FormControl('',[Validators.required]),
    'primape': new FormControl('',[Validators.required]),
    'segape': new FormControl('',[Validators.required]),
    'correo': new FormControl('',[Validators.required, Validators.email]),
    'edificio': new FormControl('',[Validators.required]),
    'campus': new FormControl('',[Validators.required]),
    'salon': new FormControl('',[Validators.required]),
    'contrasena': new FormControl('',[Validators.required]),
    'confirmar': new FormControl('',[Validators.required]),
  }, {
    validators: this.password.bind(this)
  });

  registrar(){
    if(this.formUser.valid){
      let body = {
        correo: this.formUser.controls['correo'].value,
        contrasena: this.formUser.controls['contrasena'].value,
        nombre: this.formUser.controls['nombre'].value,
        primape: this.formUser.controls['primape'].value,
        segape: this.formUser.controls['segape'].value,
        nombreComercial: this.formUser.controls['nombreComercial'].value,
        edificio: this.formUser.controls['edificio'].value,
        campus: this.formUser.controls['campus'].value,
        salon: this.formUser.controls['salon'].value,
      }
      this.backService.alta("/vendedor", body).then((data:any) =>{
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

