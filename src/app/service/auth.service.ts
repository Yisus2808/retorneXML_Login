import { Injectable } from '@angular/core';
import {HttpClient } from '@angular/common/http';
import { UsuarioModule } from '../models/usuario/usuario.module';

import { map, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty'; // DESTINO DEL LOGIN, PARA AUTENTICARSE
  private apikey = 'AIzaSyBIG_VuunCbodxcarS4OBxIabPCUCxJVtE'; // LA API PARA PODER LOGEARSE

  private db = 'https://retornexml.firebaseio.com/';

  userToken: string;

  constructor( private http: HttpClient ) { 
    
    this.leerToken();

   }

   // ------------------- METODO PARA SALIR ---------------------
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('expira');
  }


// -------------------------------- METODO PARA LOGEARSE ----------------------------------
  login( usuario: UsuarioModule ) {

    const authData = {
      // email: usuario.email,
      // passwod: usuario.password,
      ...usuario,
      returnSecureToken: true
    };

    return this.http.post(
      `${ this.url }/verifyPassword?key=${ this.apikey }`,
      authData
    ).pipe(
      // catchError -> sirve para atrapar el error // capitalizando resp['idToken']
      map( resp => {
        // console.log('Entro en el mapa del RXJS');
        this.guardarToken( resp['idToken'] );
        return resp;
      })
    );

  }

  // ------------------------ CREARSE UN NUEVO USUARIO PARA LOGIN ------------------
  nuevoUsuario( usuario: UsuarioModule ) {

    const authData = {
      // email: usuario.email,
      // passwod: usuario.password,
      ...usuario,
      returnSecureToken: true
    };

    return this.http.post(
      `${ this.url }/signupNewUser?key=${ this.apikey }`,
      authData
    ).pipe(
      // catchError -> sirve para atrapar el error // capitalizando resp['idToken']
      map( resp => {
        // console.log('Entro en el mapa del RXJS');
        this.guardarToken( resp['idToken'] );
        return resp;
      })
    );
    // el map permite obtener la respuesta del metodo post
  }


// ------------------- METODO PARA GUARDAR EL TOKEN ----------------------
  private guardarToken( idToken: string) {
    this.userToken = idToken;
    localStorage.setItem('token', idToken);

    let hoy = new Date();
    hoy.setSeconds( 3600 );

    localStorage.setItem('expira', hoy.getTime().toString() );
  }

// ----------------- METODO PARA LEER EL TOKEN ------------------------
  leerToken() {
    if ( localStorage.getItem('token') ) {
      this.userToken = localStorage.getItem('token');
    } else {
      this.userToken = '';
    }

    return this.userToken;
  }



// ----------------- METODO PARA DETERMINAR CUANDO EXPIRA EL TOKEN --------------------
  estaAutenticado(): boolean {

    if ( this.userToken.length < 2 ) {
      return false;
    }

    const expira = Number(localStorage.getItem('expira') );
    const expiraDate = new Date();
    expiraDate.setTime(expira);

    if ( expiraDate > new Date() ) {
      return true;
    } else {
      return false;
    }

  }

  getUser(){
    return this.http.get('https://randomuser.me/api/?results=15');
  }

}

