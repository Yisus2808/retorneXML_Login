import { Component, OnInit } from '@angular/core';
import { UsuarioModule } from 'src/app/models/usuario/usuario.module';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';

import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  usuario: UsuarioModule;
  recordarme = false;

  constructor( private auth: AuthService,
               private router: Router ) { }

  ngOnInit() {
    this.usuario = new UsuarioModule();
   }

   onSubmit( form: NgForm ) {
     if ( form.invalid ) {
       return;
     }

     Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'
    });
     Swal.showLoading();
     console.log('Formulario enviado');
    //  console.log(this.usuario);
     console.log(form);

     this.auth.nuevoUsuario( this.usuario )
    .subscribe( resp => {

      console.log(resp);
      Swal.close();

      if ( this.recordarme ) {
        localStorage.setItem('email', this.usuario.email );
      }

      this.router.navigateByUrl('/home');

    }, (err) => {
      console.log(err.error.error.message);
      Swal.fire({
        icon: 'error',
        title: 'Error al auntenticar',
        text: err.error.error.message
      });
    });

   }


}
