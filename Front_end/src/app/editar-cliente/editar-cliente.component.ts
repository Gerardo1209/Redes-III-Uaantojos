import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { BackendService } from '../services/backend.service';
import { DataServiceService } from '../services/data-service.service'
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-editar-cliente',
  templateUrl: './editar-cliente.component.html',
  styleUrls: ['./editar-cliente.component.css']
})
export class EditarClienteComponent implements OnInit{
  cteActual!:cliente;
  constructor(private formBuilder:FormBuilder,private backService:BackendService, private dataService:DataServiceService, private router:Router){}

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

  async ngOnInit(): Promise<void> {
      await this.getCliente();
      console.log('hola')
  }


  async getCliente(){
    let idCte = this.dataService.getData('usuario')
    if(idCte != null){
      console.log(idCte)
      this.cteActual = idCte
        this.cargarForm();
        console.log(this.cteActual)
    }
    else{
      console.log("mama")
    }

  }
  cargarForm(){
      this.formUser.controls['nombre'].setValue(this.cteActual.nombre)
      this.formUser.controls['primape'].setValue(this.cteActual.primape)
      this.formUser.controls['segape'].setValue(this.cteActual.segape)
      this.formUser.controls['correo'].setValue(this.cteActual.correo)
      this.formUser.controls['contrasena'].setValue(this.cteActual.contrasena)
      console.log(this.formUser.controls)
  }
  actualizarCte(){
    let body = {
      'id':this.cteActual.id,
      'nombre': this.formUser.controls['nombre'].value,
      'primape':this.formUser.controls['primape'].value,
      'segape':this.formUser.controls['segape'].value,
      'correo':this.formUser.controls['correo'].value,
      'contrasena':this.formUser.controls['contrasena'].value,
    }
    let actualizar:any = this.backService.actualizacion('/cliente',body);
    if(actualizar.success){
      Swal.fire('Actualizacion','Se ha actualizado el cliente','success').then(()=>{
        this.router.navigateByUrl('/menu_usuario')
      })
    }
    else{
      Swal.fire('Actualizar','Error al actualizar el usuario'+ actualizar.message,'error');
    }
  }
  password(formGroup: FormGroup) {
    const password  = formGroup.controls['contrasena'].value;
    const confirmPassword = formGroup.controls['confirmar'].value;
    return password === confirmPassword ? null : { passwordNotMatch: true };
  }
}

interface cliente{
  id:number,
  nombre:string,
  primape:string,
  segape:string,
  correo:string,
  contrasena:string,
}
