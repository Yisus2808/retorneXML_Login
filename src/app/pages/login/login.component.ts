import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { HttpClient } from '@angular/common/http';

import { AuthService } from 'src/app/service/auth.service';

import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { UsuarioModule } from 'src/app/models/usuario/usuario.module';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: UsuarioModule = new UsuarioModule();
  passType = 'password';
  passShow = false;

  mostrarContrasena() {

    if ( this.passShow ) {
        this.passType = 'password';
        this.passShow = false;
    } else {
        this.passType = 'text';
        this.passShow = true;
    }

  }

  constructor( private auth: AuthService,
               private router: Router ) { }

  ngOnInit() {
    if ( localStorage.getItem('email') ) {
      this.usuario.email = localStorage.getItem('email');
    }
    
  }

  login( form: NgForm ) {

    if ( form.invalid ) {
      console.log('Form invalid');
      // Swal.fire({
      //   icon: 'error',
      //   title: 'NOT COMPLETED',
      //   text: 'Complete todos los campos'
      // });

      return;
    }

    // console.log('Formulario enviado');
    // console.log(this.usuario);
    // console.log(form);


    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();

    // console.log('Formulario enviado');
    // console.log(this.usuario);
    console.log(form);
    this.auth.login( this.usuario )
    .subscribe( resp => {

      // console.log(resp);
      Swal.close();

      this.router.navigateByUrl('/home');
      console.log( resp );

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
