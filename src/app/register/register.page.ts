import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';
import { GoogleAuthService } from '../services/google-auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
})
export class RegisterPage {
  private apiService = inject(ApiService);
  private googleAuthService = inject(GoogleAuthService);
  private router = inject(Router);

  username = '';
  email = '';
  password = '';
  repeatPassword = '';
  showPassword = false;
  showRepeatPassword = false;
  errorMsg = '';
  isLoading = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleRepeatPassword() {
    this.showRepeatPassword = !this.showRepeatPassword;
  }

  doRegister() {
    if (!this.username || !this.email || !this.password) {
      this.errorMsg = 'Mohon isi semua data dulu, ya.';
      return;
    }

    if (this.password !== this.repeatPassword) {
      this.errorMsg = 'Ulangi kata sandi tidak sama.';
      return;
    }

    if (this.password.length < 6) {
      this.errorMsg = 'Kata sandi minimal 6 karakter.';
      return;
    }

    this.errorMsg = '';
    this.isLoading = true;
    this.apiService
      .register(this.username, this.email, this.password)
      .subscribe({
        next: (res: any) => {
          this.isLoading = false;
          if (res.success) {
            // API sudah mengembalikan token — langsung masuk, tak perlu login ulang
            localStorage.setItem('token', res.token);
            localStorage.setItem('user', JSON.stringify(res.data));
            this.router.navigate(['/tabs/jelajah'], { replaceUrl: true });
          }
        },
        error: (err) => {
          this.isLoading = false;
          const validasi = err?.error?.errors;
          const pesanValidasi = validasi ? (Object.values(validasi)[0] as string[])?.[0] : null;
          this.errorMsg = pesanValidasi || err?.error?.message || 'Gagal mendaftar. Email mungkin sudah digunakan.';
        },
      });
  }

  async registerWithGoogle() {
    try {
      this.errorMsg = '';
      const tokens = await this.googleAuthService.signIn();

      if (!tokens.accessToken && !tokens.idToken) { this.errorMsg = 'Pendaftaran Google dibatalkan.'; return; }

      this.apiService.googleLogin(tokens).subscribe({
        next: (res: any) => {
          if (res.success) {
            localStorage.setItem('token', res.access_token);
            localStorage.setItem('user', JSON.stringify(res.user));
            this.router.navigate(['/tabs/jelajah'], { replaceUrl: true });
          }
        },
        error: (err) => {
          this.errorMsg = err?.error?.message || 'Pendaftaran Google gagal di server.';
        },
      });
    } catch (error: any) {
      this.errorMsg = 'Pendaftaran Google gagal. Coba lagi.';
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}

