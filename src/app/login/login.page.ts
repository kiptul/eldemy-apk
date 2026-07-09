import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { addIcons } from 'ionicons';
import { personOutline, lockClosedOutline, schoolOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class LoginPage {
  private apiService = inject(ApiService);
  private router = inject(Router);

  nis = '';
  password = '';
  showPassword = false;
  isLoading = false;

  constructor() {
    addIcons({ personOutline, lockClosedOutline, schoolOutline, eyeOutline, eyeOffOutline });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  keUmum() {
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  doLogin() {
    if (!this.nis || !this.password) {
      alert('Mohon isi NIS dan kata sandi!');
      return;
    }

    this.isLoading = true;
    this.apiService.login(this.nis.trim(), this.password).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.success) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.data));
          // TODO: kalau must_change_password true, arahkan ke halaman ganti password wajib
          this.router.navigate(['/tabs/home'], { replaceUrl: true });
        }
      },
      error: (err) => {
        this.isLoading = false;
        alert(err?.error?.message || 'Gagal masuk. Periksa NIS dan kata sandi Anda.');
      },
    });
  }
}
