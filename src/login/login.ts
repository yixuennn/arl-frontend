import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  username: string = '';
  password: string = '';
  loginMessage: string = '';

  constructor(private router: Router) {}

  login(): void {
    if (!this.username.trim() || !this.password.trim()) {
      this.loginMessage = 'Please enter username and password.';
      return;
    }

    const cleanUsername = this.username.trim();

    localStorage.setItem('username', cleanUsername);
    localStorage.setItem('password', this.password.trim());

    if (cleanUsername === 'admin') {
      localStorage.setItem('role', 'ADMIN');
    } else {
      localStorage.setItem('role', 'USER');
    }

    this.router.navigate(['/dashboard']);
  }
}
