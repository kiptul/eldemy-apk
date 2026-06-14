import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { GoogleAuthService } from '../services/google-auth.service';
import { addIcons } from 'ionicons';
import { personOutline, sparklesOutline } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class LoginPage {
  private apiService = inject(ApiService);
  private googleAuthService = inject(GoogleAuthService);
  private router = inject(Router);

  email = '';
  password = '';
  showPassword = false;

  showNicknameModal = false;
  nicknameInput = '';
  isSavingNickname = false;

  constructor() {
    addIcons({ personOutline, sparklesOutline });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  doLogin() {
    if (!this.email || !this.password) {
      alert('Mohon isi email dan kata sandi!');
      return;
    }

    this.apiService.login(this.email, this.password).subscribe({
      next: (res: any) => {
        if (res.success) {
          localStorage.setItem('token', res.token);
          this.checkNickname();
        }
      },
      error: (err) => {
        alert('Gagal masuk: Periksa email dan kata sandi Anda');
      },
    });
  }

  async loginWithGoogle() {
    try {
      const tokens = await this.googleAuthService.signIn();

      if (!tokens.accessToken && !tokens.idToken) { alert('DEBUG: token Google kosong.'); return; }

      this.apiService.googleLogin(tokens).subscribe({
        next: (res: any) => {
          if (res.success) {
            localStorage.setItem('token', res.access_token);
            this.checkNickname();
          }
        },
        error: (err) => {
          alert('DEBUG backend: ' + (err?.error?.message || err?.message || JSON.stringify(err)));
        },
      });
    } catch (error: any) {
      alert('DEBUG native: ' + [error?.message, error?.code, String(error)].filter(Boolean).join(' | '));
    }
  }

  loginWithApple() {
    alert('Fitur masuk dengan Apple akan segera tersedia.');
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  private checkNickname() {
    this.apiService.getUserProfile().subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          if (!res.data.nickname) {
            this.showNicknameModal = true;
          } else {
            this.router.navigate(['/tabs/home'], { replaceUrl: true });
          }
        } else {
          this.router.navigate(['/tabs/home'], { replaceUrl: true });
        }
      },
      error: () => {
        this.router.navigate(['/tabs/home'], { replaceUrl: true });
      }
    });
  }

  saveNickname() {
    const trimmed = this.nicknameInput.trim();
    if (!trimmed) return;

    this.isSavingNickname = true;
    this.apiService.updateNickname(trimmed).subscribe({
      next: (res: any) => {
        this.isSavingNickname = false;
        this.showNicknameModal = false;
        this.router.navigate(['/tabs/home'], { replaceUrl: true });
      },
      error: () => {
        this.isSavingNickname = false;
        alert('Gagal menyimpan nama panggilan. Silakan coba lagi.');
      }
    });
  }

  skipNickname() {
    this.showNicknameModal = false;
    this.router.navigate(['/tabs/home'], { replaceUrl: true });
  }
}

