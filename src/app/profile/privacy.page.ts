import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
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

        <!-- Change Password (khusus user email/password) -->
        <div class="section fade-in" *ngIf="!isGoogleUser">
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

        <!-- Info untuk user login Google -->
        <div class="section fade-in" *ngIf="isGoogleUser">
          <div class="section-title">Keamanan Akun</div>
          <div class="form-card">
            <p style="font-size: 0.9rem; color: #64748b; line-height: 1.6; margin: 0;">
              Anda masuk menggunakan akun Google. Kata sandi dikelola langsung oleh Google, jadi tidak perlu diubah dari aplikasi ini.
            </p>
          </div>
        </div>

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

    <div class="confirm-backdrop" [class.closing]="isClosing" *ngIf="showDeleteConfirm" (click)="cancelDeleteAccount()"></div>
    <div class="confirm-modal" [class.closing]="isClosing" *ngIf="showDeleteConfirm">
      <div class="confirm-icon"><ion-icon name="trash-outline"></ion-icon></div>
      <h2 class="confirm-title">Hapus Akun</h2>
      <p class="confirm-text">Apakah Anda yakin ingin menghapus akun? Semua data Anda akan dihapus permanen dan tidak dapat dipulihkan.</p>
      <div class="confirm-actions">
        <button class="btn-cancel" (click)="cancelDeleteAccount()" [disabled]="isDeleting">Batal</button>
        <button class="btn-delete" (click)="doDeleteAccount()" [disabled]="isDeleting">{{ isDeleting ? 'Menghapus...' : 'Ya, Hapus' }}</button>
      </div>
    </div>

    <div class="custom-toast" [ngClass]="toastType" *ngIf="toastVisible">{{ toastMessage }}</div>
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
    .confirm-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 1000; animation: cbFadeIn 0.2s ease; }
    .confirm-backdrop.closing { animation: cbFadeOut 0.2s ease forwards; }
    @keyframes cbFadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes cbFadeOut { from { opacity: 1; } to { opacity: 0; } }
    .confirm-modal { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: calc(100% - 60px); max-width: 340px; background: #fff; border-radius: 24px; padding: 28px 24px; z-index: 1001; text-align: center; box-shadow: 0 20px 50px rgba(0,0,0,0.25); animation: cmIn 0.28s cubic-bezier(0.16,1,0.3,1); }
    .confirm-modal.closing { animation: cmOut 0.2s ease forwards; }
    @keyframes cmIn { from { opacity: 0; transform: translate(-50%, -44%) scale(0.9); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }
    @keyframes cmOut { from { opacity: 1; transform: translate(-50%, -50%) scale(1); } to { opacity: 0; transform: translate(-50%, -50%) scale(0.92); } }
    .confirm-icon { width: 64px; height: 64px; border-radius: 50%; background: rgba(229,57,53,0.1); color: #e53935; font-size: 2rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
    .confirm-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.2rem; font-weight: 800; color: var(--dark); margin: 0 0 8px; }
    .confirm-text { font-size: 0.9rem; color: #64748b; line-height: 1.5; margin: 0 0 24px; }
    .confirm-actions { display: flex; gap: 12px; }
    .confirm-actions button { flex: 1; padding: 14px; border-radius: 14px; border: none; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 0.95rem; cursor: pointer; }
    .btn-cancel { background: #f1f5f9; color: #475569; }
    .btn-delete { background: #e53935; color: #fff; }
    .confirm-actions button:disabled { opacity: 0.6; }
    .custom-toast { position: fixed; top: 24px; left: 50%; transform: translateX(-50%); background: #2D3748; color: #fff; padding: 14px 22px; border-radius: 14px; font-size: 0.9rem; font-weight: 600; z-index: 1100; max-width: calc(100% - 40px); box-shadow: 0 8px 24px rgba(0,0,0,0.2); animation: fadeIn 0.25s ease; }
    .custom-toast.success { background: #16a34a; }
    .custom-toast.danger { background: #e53935; }
    .custom-toast.warning { background: #f59e0b; }
  `]
})
export class PrivacyPage implements OnInit {
  private router = inject(Router);
  private apiService = inject(ApiService);

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  isChangingPassword = false;
  isGoogleUser = false;

  showDeleteConfirm = false;
  isDeleting = false;
  isClosing = false;
  toastMessage = '';
  toastType = '';
  toastVisible = false;
  private toastTimer: any = null;

  constructor() {
    addIcons({
      chevronBackOutline, lockClosedOutline, eyeOutline, eyeOffOutline,
      keyOutline, fingerPrintOutline, trashOutline
    });
  }

  ngOnInit() {
    this.apiService.getUserProfile().subscribe({
      next: (res: any) => {
        if (res?.success && res.data) {
          this.isGoogleUser = !!res.data.google_id;
        }
      },
      error: () => {}
    });
  }

  showToast(msg: string, color: string = 'success') {
    this.toastMessage = msg;
    this.toastType = color;
    this.toastVisible = true;
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => { this.toastVisible = false; }, 2500);
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
    
    this.apiService.changePassword(this.currentPassword, this.newPassword).subscribe({
      next: () => {
        this.showToast('Kata sandi berhasil diperbarui!');
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
        this.isChangingPassword = false;
      },
      error: (err) => {
        this.showToast(err?.error?.message || 'Gagal mengubah kata sandi.', 'danger');
        this.isChangingPassword = false;
      }
    });
  }

  confirmDeleteAccount() {
    this.showDeleteConfirm = true;
  }

  cancelDeleteAccount() {
    this.closeDeleteModal();
  }

  closeDeleteModal() {
    this.isClosing = true;
    setTimeout(() => {
      this.showDeleteConfirm = false;
      this.isClosing = false;
    }, 200);
  }

  doDeleteAccount() {
    if (this.isDeleting) return;
    this.isDeleting = true;
    this.apiService.deleteAccount().subscribe({
      next: () => {
        localStorage.removeItem('token');
        this.isDeleting = false;
        this.showDeleteConfirm = false;
        this.showToast('Akun berhasil dihapus.');
        this.router.navigate(['/login'], { replaceUrl: true });
      },
      error: (err) => {
        this.isDeleting = false;
        this.closeDeleteModal();
        this.showToast(err?.error?.message || 'Gagal menghapus akun.', 'danger');
      }
    });
  }

  goBack() {
    this.router.navigate(['/tabs/profile']);
  }
}
