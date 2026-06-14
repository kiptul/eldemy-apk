import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline, lockClosedOutline, eyeOutline, eyeOffOutline,
  keyOutline, fingerPrintOutline, trashOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  template: `
    <ion-content class="page-content">
      <div class="page-wrapper">
        <!-- Header -->
        <div class="top-bar">
          <button class="back-btn" (click)="goBack()">
            <ion-icon name="chevron-back-outline"></ion-icon>
          </button>
          <h1 class="page-title">Privasi & Keamanan</h1>
          <div class="spacer"></div>
        </div>

        <!-- Change Password -->
        <div class="section fade-in">
          <div class="section-title">Ubah Kata Sandi</div>
          
          <div class="form-card">
            <div class="input-group">
              <label>Kata Sandi Saat Ini</label>
              <div class="password-field">
                <input [type]="showCurrentPassword ? 'text' : 'password'" 
                       [(ngModel)]="currentPassword" 
                       placeholder="Masukkan kata sandi saat ini">
                <button class="eye-btn" (click)="showCurrentPassword = !showCurrentPassword">
                  <ion-icon [name]="showCurrentPassword ? 'eye-off-outline' : 'eye-outline'"></ion-icon>
                </button>
              </div>
            </div>

            <div class="input-group">
              <label>Kata Sandi Baru</label>
              <div class="password-field">
                <input [type]="showNewPassword ? 'text' : 'password'" 
                       [(ngModel)]="newPassword" 
                       placeholder="Minimal 6 karakter">
                <button class="eye-btn" (click)="showNewPassword = !showNewPassword">
                  <ion-icon [name]="showNewPassword ? 'eye-off-outline' : 'eye-outline'"></ion-icon>
                </button>
              </div>
            </div>

            <div class="input-group">
              <label>Konfirmasi Kata Sandi Baru</label>
              <div class="password-field">
                <input [type]="showConfirmPassword ? 'text' : 'password'" 
                       [(ngModel)]="confirmPassword" 
                       placeholder="Ulangi kata sandi baru">
                <button class="eye-btn" (click)="showConfirmPassword = !showConfirmPassword">
                  <ion-icon [name]="showConfirmPassword ? 'eye-off-outline' : 'eye-outline'"></ion-icon>
                </button>
              </div>
            </div>

            <button class="btn-primary" (click)="changePassword()" [disabled]="isChangingPassword">
              <ion-icon name="key-outline"></ion-icon>
              {{ isChangingPassword ? 'Menyimpan...' : 'Perbarui Kata Sandi' }}
            </button>
          </div>
        </div>

        <!-- Security Settings (Removed Biometric) -->

        <!-- Danger Zone -->
        <div class="section fade-in" style="animation-delay: 0.2s">
          <div class="section-title danger-title">Zona Berbahaya</div>
          
          <div class="danger-card" (click)="confirmDeleteAccount()">
            <div class="icon-wrap red"><ion-icon name="trash-outline"></ion-icon></div>
            <div>
              <div class="setting-label danger-text">Hapus Akun</div>
              <div class="setting-desc">Tindakan ini tidak dapat dibatalkan</div>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    :host {
      --primary: #F06292;
      --secondary: #4DB6AC;
      --tertiary: #FFB74D;
      --neutral: #F5F5DC;
      --dark: #2D3748;
    }

    .page-content {
      --background: var(--neutral);
      font-family: 'Manrope', sans-serif;
      color: var(--dark);
    }

    .page-wrapper { padding: 16px 20px 40px; }

    .top-bar {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 0 24px;
    }

    .back-btn {
      width: 40px; height: 40px;
      border-radius: 12px;
      background: #fff;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      color: var(--dark);
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      cursor: pointer;
      &:active { transform: scale(0.95); }
    }

    .page-title {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 1.3rem;
      font-weight: 800;
      flex: 1;
    }

    .spacer { width: 40px; }

    .section { margin-bottom: 28px; }

    .section-title {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 1rem;
      font-weight: 800;
      margin-bottom: 14px;
      color: var(--dark);

      &.danger-title { color: #e53935; }
    }

    .form-card, .setting-card {
      background: #fff;
      border-radius: 20px;
      padding: 20px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.03);
    }

    .input-group {
      margin-bottom: 16px;
      label {
        display: block;
        font-size: 0.85rem;
        font-weight: 700;
        color: #4a5568;
        margin-bottom: 8px;
      }
    }

    .password-field {
      display: flex;
      align-items: center;
      background: #f8fafc;
      border: 2px solid transparent;
      border-radius: 14px;
      transition: border-color 0.3s;

      &:focus-within {
        border-color: var(--primary);
        background: #fff;
      }

      input {
        flex: 1;
        border: none;
        background: transparent;
        padding: 14px 16px;
        font-family: 'Manrope', sans-serif;
        font-size: 0.95rem;
        color: var(--dark);
        outline: none;
      }

      .eye-btn {
        background: none;
        border: none;
        padding: 14px;
        font-size: 1.2rem;
        color: #94a3b8;
        cursor: pointer;
      }
    }

    .btn-primary {
      background: var(--primary);
      color: white;
      border: none;
      padding: 14px 24px;
      border-radius: 14px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 700;
      font-size: 0.95rem;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 8px 20px rgba(240, 98, 146, 0.3);
      transition: all 0.2s;
      width: 100%;
      justify-content: center;
      margin-top: 8px;

      &:active { transform: scale(0.97); }
      &:disabled { opacity: 0.7; }
    }

    .setting-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 0;
    }

    .setting-info {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .icon-wrap {
      width: 40px; height: 40px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      &.teal { background: rgba(77,182,172,0.15); color: var(--secondary); }
      &.red { background: rgba(229,57,53,0.1); color: #e53935; }
    }

    .setting-label {
      font-weight: 700;
      font-size: 0.9rem;
      margin-bottom: 2px;
      &.danger-text { color: #e53935; }
    }

    .setting-desc {
      font-size: 0.78rem;
      color: #94a3b8;
    }

    .danger-card {
      background: #fff;
      border: 2px solid rgba(229,57,53,0.15);
      border-radius: 20px;
      padding: 18px 20px;
      display: flex;
      align-items: center;
      gap: 14px;
      cursor: pointer;
      transition: transform 0.2s;
      &:active { transform: scale(0.98); }
    }

    .fade-in {
      animation: fadeIn 0.4s ease forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class PrivacyPage {
  private router = inject(Router);
  private toastCtrl = inject(ToastController);
  private alertCtrl = inject(AlertController);
  private apiService = inject(ApiService);

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  isChangingPassword = false;

  constructor() {
    addIcons({
      chevronBackOutline, lockClosedOutline, eyeOutline, eyeOffOutline,
      keyOutline, fingerPrintOutline, trashOutline
    });
  }

  async showToast(msg: string, color: string = 'success') {
    const toast = await this.toastCtrl.create({
      message: msg, duration: 2000, color, position: 'top'
    });
    toast.present();
  }

  changePassword() {
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.showToast('Semua field harus diisi.', 'warning');
      return;
    }
    if (this.newPassword.length < 6) {
      this.showToast('Kata sandi baru minimal 6 karakter.', 'warning');
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.showToast('Konfirmasi kata sandi tidak cocok.', 'danger');
      return;
    }

    this.isChangingPassword = true;
    
    setTimeout(() => {
      this.showToast('Kata sandi berhasil diperbarui!');
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';
      this.isChangingPassword = false;
    }, 1500);
  }

  async confirmDeleteAccount() {
    const alert = await this.alertCtrl.create({
      header: 'Hapus Akun',
      message: 'Apakah Anda yakin ingin menghapus akun? Semua data Anda akan dihapus secara permanen dan tidak dapat dipulihkan.',
      cssClass: 'custom-alert',
      buttons: [
        { text: 'Batal', role: 'cancel' },
        {
          text: 'Ya, Hapus',
          cssClass: 'danger-button',
          handler: () => {
            this.showToast('Fitur ini belum tersedia.', 'warning');
          }
        }
      ]
    });
    await alert.present();
  }

  goBack() {
    this.router.navigate(['/tabs/profile']);
  }
}
