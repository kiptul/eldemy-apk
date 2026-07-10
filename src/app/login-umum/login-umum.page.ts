import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { GoogleAuthService } from '../services/google-auth.service';
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline, schoolOutline, logoGoogle, chevronForwardOutline } from 'ionicons/icons';

@Component({
  selector: 'app-login-umum',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  template: `
    <ion-content [fullscreen]="true" style="--background: transparent;">
      <div class="background-container"></div>
      <div class="page-wrapper">
        <div class="spacer"></div>

        <div class="bottom-overlay">
          <div class="brand-section">
            <h1 class="logo-text">Eldemy</h1>
            <p class="tagline">Masuk untuk mulai belajar</p>
          </div>

          <div class="input-group">
            <ion-icon name="mail-outline"></ion-icon>
            <input type="email" [(ngModel)]="email" placeholder="Email" autocomplete="email" />
          </div>
          <div class="input-group">
            <ion-icon name="lock-closed-outline"></ion-icon>
            <input [type]="showPassword ? 'text' : 'password'" [(ngModel)]="password" placeholder="Kata sandi" (keyup.enter)="doLogin()" />
            <ion-icon class="eye" [name]="showPassword ? 'eye-off-outline' : 'eye-outline'" (click)="showPassword = !showPassword"></ion-icon>
          </div>

          <div class="error-banner" *ngIf="errorMsg">{{ errorMsg }}</div>

          <button class="btn-masuk" (click)="doLogin()" [disabled]="isLoading">
            {{ isLoading ? 'Memproses...' : 'Masuk' }} <span class="arrow" *ngIf="!isLoading">&#8594;</span>
          </button>

          <div class="divider"><span>atau</span></div>

          <button class="btn-google" (click)="loginGoogle()" [disabled]="isLoading">
            <ion-icon name="logo-google"></ion-icon> Lanjutkan dengan Google
          </button>

          <div class="siswa-card" (click)="keLoginSiswa()">
            <div class="ic"><ion-icon name="school-outline"></ion-icon></div>
            <div class="txt">
              <b>Siswa sekolah?</b>
              <span>Masuk pakai NIS dari sekolahmu</span>
            </div>
            <ion-icon name="chevron-forward-outline" class="arrow-ic"></ion-icon>
          </div>

          <p class="daftar-link">Belum punya akun? <b (click)="keRegister()">Daftar</b></p>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    .background-container {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: url("/assets/images/backgrounds/Eldemy-welcome-bg.jpeg") no-repeat center center / cover;
      z-index: -1;
    }
    .page-wrapper { min-height: 100vh; display: flex; flex-direction: column; justify-content: flex-end; }
    .spacer { flex: 1; }
    .bottom-overlay {
      background: linear-gradient(to bottom, rgba(35,35,35,0.72) 0%, rgba(18,18,18,0.9) 100%);
      backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
      border-top-left-radius: 36px; border-top-right-radius: 36px;
      padding: 28px 28px 20px; display: flex; flex-direction: column;
    }
    .brand-section { text-align: center; margin-bottom: 20px; }
    .error-banner {
      background: rgba(229, 57, 53, 0.18); border: 1px solid rgba(229, 57, 53, 0.45);
      color: #ff8a80; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600;
      border-radius: 12px; padding: 11px 14px; margin-bottom: 12px; text-align: center;
    }
    .logo-text { font-family: 'Outfit', 'Inter', sans-serif; font-weight: 800; font-size: 2.6rem; color: #fff; margin: 0; letter-spacing: -1.5px; }
    .tagline { font-family: 'Inter', sans-serif; color: #d0d0d0; font-size: 0.92rem; margin-top: 4px; }
    .input-group {
      display: flex; align-items: center; gap: 10px;
      background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.1);
      border-radius: 16px; padding: 0 16px; margin-bottom: 12px;
      backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
      ion-icon { color: #F06292; font-size: 18px; flex-shrink: 0; }
      input { flex: 1; border: 0; outline: 0; padding: 15px 0; font-size: 14.5px; font-family: 'Inter', sans-serif; background: transparent; color: #fff; }
      input::placeholder { color: #aaa; }
      .eye { color: #999; cursor: pointer; }
    }
    .btn-masuk {
      width: 100%; background: linear-gradient(135deg, #F06292, #c92f6b); color: #fff; border: none;
      box-shadow: 0 6px 18px rgba(240,98,146,0.4);
      padding: 15px; border-radius: 30px; font-size: 1rem; font-weight: 700; font-family: 'Inter', sans-serif;
      display: flex; justify-content: center; align-items: center; gap: 8px; cursor: pointer; margin-top: 4px;
      &:active { transform: scale(0.98); background: linear-gradient(135deg, #d95681, #b02a5f); }
      &:disabled { opacity: .6; }
      .arrow { font-weight: 400; }
    }
    .divider { display: flex; align-items: center; gap: 12px; margin: 14px 0; color: #888; font-size: 12.5px; font-family: 'Inter', sans-serif;
      &::before, &::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.14); }
    }
    .btn-google {
      width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px;
      background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.14);
      border-radius: 30px; padding: 13px; font-weight: 600; font-size: 14.5px; font-family: 'Inter', sans-serif; color: #fff; cursor: pointer;
      backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
      ion-icon { font-size: 18px; }
      &:active { transform: scale(0.98); }
      &:disabled { opacity: .6; }
    }
    .siswa-card {
      display: flex; align-items: center; gap: 14px; margin-top: 16px;
      background: rgba(240,98,146,0.12); border: 1.5px dashed rgba(240,98,146,0.6);
      border-radius: 20px; padding: 13px 16px; cursor: pointer;
      .ic { width: 40px; height: 40px; border-radius: 50%; background: rgba(240,98,146,0.2); display: flex; align-items: center; justify-content: center;
        ion-icon { color: #F06292; font-size: 20px; } }
      .txt { flex: 1; display: flex; flex-direction: column;
        b { font-size: 14px; color: #fff; font-family: 'Inter', sans-serif; }
        span { font-size: 12px; color: #bbb; margin-top: 2px; } }
      .arrow-ic { color: #F06292; }
      &:active { transform: scale(0.98); }
    }
    .daftar-link { text-align: center; font-size: 0.85rem; font-family: 'Inter', sans-serif; color: #aaa; margin: 16px 0 2px;
      b { color: #F06292; font-weight: 800; cursor: pointer; }
    }
  `]
})
export class LoginUmumPage {
  private api = inject(ApiService);
  private googleAuth = inject(GoogleAuthService);
  private router = inject(Router);

  email = '';
  password = '';
  showPassword = false;
  isLoading = false;
  errorMsg = '';

  constructor() {
    addIcons({ mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline, schoolOutline, logoGoogle, chevronForwardOutline });
  }

  doLogin() {
    if (!this.email || !this.password) { this.errorMsg = 'Isi email dan kata sandi dulu, ya.'; return; }
    this.errorMsg = '';
    this.isLoading = true;
    this.api.loginEmail(this.email.trim(), this.password).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.success) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.data));
          this.router.navigate(['/tabs/jelajah'], { replaceUrl: true });
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMsg = err?.error?.message || 'Gagal masuk. Periksa email dan kata sandi.';
      },
    });
  }

  async loginGoogle() {
    try {
      this.errorMsg = '';
      this.isLoading = true;
      const tokens = await this.googleAuth.signIn();
      if (!tokens.accessToken && !tokens.idToken) { this.isLoading = false; this.errorMsg = 'Login Google dibatalkan.'; return; }
      this.api.googleLogin(tokens).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          if (res.success) {
            localStorage.setItem('token', res.access_token || res.token);
            if (res.user || res.data) localStorage.setItem('user', JSON.stringify(res.user || res.data));
            this.router.navigate(['/tabs/jelajah'], { replaceUrl: true });
          }
        },
        error: () => { this.isLoading = false; this.errorMsg = 'Login Google gagal di server.'; },
      });
    } catch (e) {
      this.isLoading = false;
      this.errorMsg = 'Login Google gagal. Coba lagi.';
    }
  }

  keRegister() { this.router.navigate(['/register']); }
  keLoginSiswa() { this.router.navigate(['/login-siswa']); }
}
