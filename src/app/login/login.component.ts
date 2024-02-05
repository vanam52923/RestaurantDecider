import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username!: string;
  sessionId: string;

  constructor(private router: Router) {
    this.sessionId = Math.random().toString().substring(7);
  }

  ngOnInit(): void {
    
  }

  handleLogin() {
    if (!this.username) {
      alert("Please enter the name");
    } else {
        this.router.navigate([`/restaurant/${this.sessionId}`], {
        queryParams : { searchCriteria: 'loggedIn', userName: this.username }
      });
    }
  }

}
