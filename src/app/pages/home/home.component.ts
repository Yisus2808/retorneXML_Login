import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  users: any[] = [];

  constructor( private auth: AuthService,
               private router: Router,
             ) { }

  ngOnInit() {
  }

  salir() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

  Obtener(){
    this.auth.getUser().subscribe(
      (data) => {
        console.log(data['results'])
        this.users = data['results'];
      },
      (error) => {
        console.log(error);
      }
    )
  }

}
