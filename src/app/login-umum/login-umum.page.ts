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
    <ion-content class="page">
      <div class="wrap">
        <div class="brand">
          <h1>Eldemy</h1>
          <p>Belajar tanpa batas,<br>kapan pun di mana pun</p>
        </div>

        <div class="form-card">
          <div class="input-group">
            <ion-icon name="mail-outline"></ion-icon>
            <input type="email" [(ngModel)]="email" placeholder="Email" autocomplete="email" />
          </div>
          <div class="input-group">
            <ion-icon name="lock-closed-outline"></ion-icon>
            <input [type]="showPassword ? 'text' : 'password'" [(ngModel)]="password" placeholder="Kata sandi" />
            <ion-icon class="eye" [name]="showPassword ? 'eye-off-outline' : 'eye-outline'" (click)="showPassword = !showPassword"></ion-icon>
          </div>

          <button class="btn-primary" (click)="doLogin()" [disabled]="isLoading">
            {{ isLoading ? 'Memproses...' : 'Masuk' }}
          </button>

          <div class="divider"><span>atau</span></div>

          <button class="btn-google" (click)="loginGoogle()" [disabled]="isLoading">
            <ion-icon name="logo-google"></ion-icon> Lanjutkan dengan Google
          </button>

          <p class="daftar">Belum punya akun? <b (click)="keRegister()">Daftar</b></p>
        </div>

        <div class="siswa-card" (click)="keLoginSiswa()">
          <div class="ic"><ion-icon name="school-outline"></ion-icon></div>
          <div class="txt">
            <b>Siswa sekolah?</b>
            <span>Masuk pakai NIS dari sekolahmu</span>
          </div>
          <ion-icon name="chevron-forward-outline" class="arrow"></ion-icon>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    .page { --background: #fdf8f0; font-family: 'Inter', sans-serif; }
    .wrap { min-height: 100%; display: flex; flex-direction: column; justify-content: center; padding: 28px 22px; box-sizing: border-box; }
    .brand { text-align: center; margin-bottom: 26px;
      h1 { font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 38px; color: #F06292; margin: 0; }
      p { color: #999; margin: 8px 0 0; line-height: 1.5; }
    }
    .form-card { background: #fff; border-radius: 20px; padding: 20px; box-shadow: 0 4px 18px rgba(0,0,0,.06); }
    .input-group { display: flex; align-items: center; gap: 10px; border: 1px solid #fce4ec; border-radius: 12px; padding: 0 14px; margin-bottom: 12px;
      ion-icon { color: #F06292; font-size: 18px; flex-shrink: 0; }
      input { flex: 1; border: 0; outline: 0; padding: 14px 0; font-size: 14.5px; font-family: 'Inter', sans-serif; background: transparent; }
      .eye { color: #bbb; cursor: pointer; }
    }
    .btn-primary { width: 100%; background: linear-gradient(135deg, #F06292, #c92f6b); color: #fff; border: 0; border-radius: 12px; padding: 14px; font-weight: 700; font-size: 15px; font-family: 'Outfit', sans-serif; box-shadow: 0 4px 14px rgba(240,98,146,.35); &:disabled { opacity: .6; } }
    .divider { display: flex; align-items: center; gap: 12px; margin: 16px 0; color: #ccc; font-size: 12.5px;
      &::before, &::after { content: ''; flex: 1; height: 1px; background: #f0e8dc; }
    }
    .btn-google { width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px; background: #fff; border: 1.5px solid #eee; border-radius: 12px; padding: 13px; font-weight: 600; font-size: 14.5px; font-family: 'Inter', sans-serif; color: #2b2b3a;
      ion-icon { font-size: 18px; }
      &:disabled { opacity: .6; }
    }
    .daftar { text-align: center; margin: 16px 0 2px; font-size: 13.5px; color: #999;
      b { color: #F06292; cursor: pointer; }
    }
    .siswa-card { display: flex; align-items: center; gap: 14px; margin-top: 18px; background: #fff; border: 1.5px dashed #F06292; border-radius: 16px; padding: 14px 16px; cursor: pointer;
      .ic { width: 42px; height: 42px; border-radius: 12px; background: #fce4ec; display: flex; align-items: center; justify-content: center; ion-icon { color: #F06292; font-size: 21px; } }
      .txt { flex: 1; display: flex; flex-direction: column;
        b { font-size: 14.5px; color: #2b2b3a; font-family: 'Outfit', sans-serif; }
        span { font-size: 12.5px; color: #999; margin-top: 2px; }
      }
      .arrow { color: #F06292; }
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

  constructor() {
    addIcons({ mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline, schoolOutline, logoGoogle, chevronForwardOutline });
  }

  doLogin() {
    if (!this.email || !this.password) { alert('Isi email dan kata sandi!'); return; }
    this.isLoading = true;
    this.api.loginEmail(this.email.trim(), this.password).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.success) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.data));
          this.router.navigate(['/tabs/home'], { replaceUrl: true });
        }
      },
      error: (err) => {
        this.isLoading = false;
        alert(err?.error?.message || 'Gagal masuk. Periksa email dan kata sandi.');
      },
    });
  }

  async loginGoogle() {
    try {
      this.isLoading = true;
      const tokens = await this.googleAuth.signIn();
      if (!tokens.accessToken && !tokens.idToken) { this.isLoading = false; alert('Login Google dibatalkan.'); return; }
      this.api.googleLogin(tokens).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          if (res.success) {
            localStorage.setItem('token', res.access_token || res.token);
            if (res.user || res.data) localStorage.setItem('user', JSON.stringify(res.user || res.data));
            this.router.navigate(['/tabs/home'], { replaceUrl: true });
          }
        },
        error: () => { this.isLoading = false; alert('Login Google gagal di server.'); },
      });
    } catch (e) {
      this.isLoading = false;
      alert('Login Google gagal. Coba lagi.');
    }
  }

  keRegister() { this.router.navigate(['/register']); }
  keLoginSiswa() { this.router.navigate(['/login-siswa']); }
}