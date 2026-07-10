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
  errorMsg = '';

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
      this.errorMsg = 'Mohon isi NIS dan kata sandi dulu, ya.';
      return;
    }

    this.errorMsg = '';
    this.isLoading = true;
    this.apiService.login(this.nis.trim(), this.password).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.success) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.data));
          if (res.must_change_password) {
            // Masih pakai sandi bawaan (tanggal lahir) — wajib ganti dulu
            this.router.navigate(['/tabs/profile'], { replaceUrl: true, queryParams: { wajibGanti: 1 } });
          } else {
            this.router.navigate(['/tabs/home'], { replaceUrl: true });
          }
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMsg = err?.error?.message || 'Gagal masuk. Periksa NIS dan kata sandi Anda.';
      },
    });
  }
}
