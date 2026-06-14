import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { GoogleAuthService } from '../services/google-auth.service';
import { addIcons } from 'ionicons';
import {
  personOutline, notificationsOutline, shieldCheckmarkOutline,
  helpCircleOutline, logOutOutline, chevronForwardOutline,
  createOutline, camera, documentTextOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  template: `
    <ion-content class="page-content">
      <div class="profile-wrapper">
        <div class="profile-header">
          <div class="header-bg-shape"></div>
          
          <div class="avatar-container" [class.editing]="isEditing" (click)="isEditing && fileInput.click()">
            <img [src]="avatarPreview || avatarUrl" (error)="onAvatarError($event)" />
            <div class="edit-overlay" *ngIf="isEditing">
              <ion-icon name="camera"></ion-icon>
            </div>
            <input type="file" #fileInput hidden accept="image/*" (change)="onFileSelected($event)">
          </div>

          <!-- VIEW MODE -->
          <ng-container *ngIf="!isEditing">
            <h2 class="user-name">{{ user?.name || 'Memuat...' }}</h2>
            <p class="user-email">{{ user?.email || '' }}</p>
            <div class="badges-row">
              <span class="role-badge">{{ user?.role === 'instructor' ? 'Instruktur' : 'Siswa' }}</span>
              <span class="nickname-badge" *ngIf="user?.nickname">"{{ user?.nickname }}"</span>
            </div>
            
            <button class="btn-primary edit-btn" (click)="toggleEdit()">
              <ion-icon name="create-outline"></ion-icon> Edit Profil
            </button>
          </ng-container>

          <!-- EDIT MODE -->
          <ng-container *ngIf="isEditing">
            <div class="edit-form fade-in">
              <div class="input-group">
                <label>Nama Lengkap</label>
                <input type="text" [(ngModel)]="editName" placeholder="Masukkan nama lengkap">
              </div>
              <div class="input-group">
                <label>Nama Panggilan</label>
                <input type="text" [(ngModel)]="editNickname" placeholder="Masukkan nama panggilan">
              </div>
              
              <div class="action-buttons">
                <button class="btn-secondary" (click)="toggleEdit()" [disabled]="isSaving">Batal</button>
                <button class="btn-primary" (click)="saveProfile()" [disabled]="isSaving">
                  {{ isSaving ? 'Menyimpan...' : 'Simpan' }}
                </button>
              </div>
            </div>
          </ng-container>
        </div>

        <div class="menu-section fade-in" *ngIf="!isEditing">
          <div class="menu-label">Pengaturan Akun</div>
          
          <div class="menu-list">
            <div class="menu-item" (click)="openPage('notifications')">
              <div class="icon-wrap teal"><ion-icon name="notifications-outline"></ion-icon></div>
              <span>Notifikasi</span>
              <ion-icon name="chevron-forward-outline" class="arrow"></ion-icon>
            </div>
            <div class="menu-item" (click)="openPage('privacy')">
              <div class="icon-wrap orange"><ion-icon name="shield-checkmark-outline"></ion-icon></div>
              <span>Privasi & Keamanan</span>
              <ion-icon name="chevron-forward-outline" class="arrow"></ion-icon>
            </div>
            <div class="menu-item" (click)="openPage('help')">
              <div class="icon-wrap pink"><ion-icon name="help-circle-outline"></ion-icon></div>
              <span>Bantuan</span>
              <ion-icon name="chevron-forward-outline" class="arrow"></ion-icon>
            </div>
            <div class="menu-item" (click)="openPage('privacy-policy')">
              <div class="icon-wrap purple"><ion-icon name="document-text-outline"></ion-icon></div>
              <span>Kebijakan Privasi</span>
              <ion-icon name="chevron-forward-outline" class="arrow"></ion-icon>
            </div>
            <div class="menu-item danger" (click)="logout()">
              <div class="icon-wrap red"><ion-icon name="log-out-outline"></ion-icon></div>
              <span>Keluar</span>
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

    .profile-wrapper {
      padding-bottom: 40px;
    }

    .profile-header {
      position: relative;
      background: #ffffff;
      padding: 60px 24px 30px;
      text-align: center;
      border-radius: 0 0 40px 40px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.03);
      margin-bottom: 24px;
      overflow: hidden;

      .header-bg-shape {
        position: absolute;
        top: -100px;
        right: -50px;
        width: 250px;
        height: 250px;
        background: radial-gradient(circle, rgba(240,98,146,0.15) 0%, rgba(255,255,255,0) 70%);
        border-radius: 50%;
        z-index: 0;
      }
    }

    .avatar-container {
      position: relative;
      width: 100px;
      height: 100px;
      margin: 0 auto 20px;
      border-radius: 50%;
      padding: 4px;
      background: linear-gradient(135deg, var(--primary), var(--tertiary));
      z-index: 2;
      transition: transform 0.3s ease;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
        border: 3px solid #fff;
      }

      &.editing {
        cursor: pointer;
        transform: scale(1.05);
        .edit-overlay {
          position: absolute;
          top: 4px; left: 4px; right: 4px; bottom: 4px;
          background: rgba(0,0,0,0.5);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.8rem;
          border: 3px solid transparent;
        }
      }
    }

    .user-name {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--dark);
      margin: 0 0 6px;
      position: relative;
      z-index: 2;
    }

    .user-email {
      font-size: 0.9rem;
      color: #718096;
      margin: 0 0 16px;
      position: relative;
      z-index: 2;
    }

    .badges-row {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin-bottom: 24px;
      position: relative;
      z-index: 2;

      .role-badge {
        background: rgba(77, 182, 172, 0.15);
        color: var(--secondary);
        padding: 6px 16px;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 700;
      }

      .nickname-badge {
        background: rgba(255, 183, 77, 0.15);
        color: #e69500;
        padding: 6px 16px;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 700;
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
      position: relative;
      z-index: 2;
      width: 100%;
      justify-content: center;

      &:active { transform: scale(0.97); }
      &:disabled { opacity: 0.7; }
    }

    .btn-secondary {
      background: #f1f5f9;
      color: #64748b;
      border: none;
      padding: 14px 24px;
      border-radius: 14px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 700;
      font-size: 0.95rem;
      transition: all 0.2s;
      width: 100%;
      &:active { transform: scale(0.97); }
    }

    .edit-btn {
      max-width: 200px;
    }

    .edit-form {
      text-align: left;
      position: relative;
      z-index: 2;

      .input-group {
        margin-bottom: 16px;
        label {
          display: block;
          font-size: 0.85rem;
          font-weight: 700;
          color: #4a5568;
          margin-bottom: 8px;
        }
        input {
          width: 100%;
          background: #f8fafc;
          border: 2px solid transparent;
          padding: 14px 16px;
          border-radius: 14px;
          font-family: 'Manrope', sans-serif;
          font-size: 0.95rem;
          color: var(--dark);
          transition: border-color 0.3s;
          outline: none;

          &:focus {
            border-color: var(--primary);
            background: #fff;
          }
        }
      }

      .action-buttons {
        display: flex;
        gap: 12px;
        margin-top: 24px;
      }
    }

    .menu-section {
      padding: 0 24px;
    }

    .menu-label {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 1.1rem;
      font-weight: 800;
      color: var(--dark);
      margin-bottom: 16px;
    }

    .menu-list {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .menu-item {
        display: flex;
        align-items: center;
        gap: 16px;
        background: #ffffff;
        padding: 16px;
        border-radius: 18px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.02);
        transition: transform 0.2s;
        cursor: pointer;

        &:active { transform: scale(0.98); }

        .icon-wrap {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;

          &.teal { background: rgba(77, 182, 172, 0.15); color: var(--secondary); }
          &.orange { background: rgba(255, 183, 77, 0.15); color: var(--tertiary); }
          &.pink { background: rgba(240, 98, 146, 0.15); color: var(--primary); }
          &.purple { background: rgba(139, 92, 246, 0.15); color: #8b5cf6; }
          &.red { background: rgba(229, 57, 53, 0.1); color: #e53935; }
        }

        span {
          flex: 1;
          font-weight: 600;
          font-size: 0.95rem;
        }

        .arrow {
          color: #cbd5e1;
          font-size: 1.1rem;
        }

        &.danger {
          span { color: #e53935; }
        }
      }
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
export class ProfilePage implements OnInit {
  private apiService = inject(ApiService);
  private router = inject(Router);
  private googleAuthService = inject(GoogleAuthService);
  private toastCtrl = inject(ToastController);

  user: any = null;
  avatarFailed = false;
  avatarTimestamp = Date.now(); // Untuk cache-busting yang agresif
  
  isEditing = false;
  isSaving = false;
  editName = '';
  editNickname = '';
  selectedFile: File | null = null;
  avatarPreview: string | null = null;

  constructor() {
    addIcons({
      personOutline, notificationsOutline, shieldCheckmarkOutline,
      helpCircleOutline, logOutOutline, chevronForwardOutline,
      createOutline, camera, documentTextOutline
    });
  }

  ngOnInit() {
    this.apiService.user$.subscribe(user => {
      if (user) {
        this.user = { ...user }; 
        this.avatarFailed = false;
        this.avatarTimestamp = Date.now();
      }
    });

    if (!this.user) {
      this.apiService.getUserProfile().subscribe();
    }
  }
  
  get avatarUrl(): string {
    if (this.user?.avatar_url && !this.avatarFailed) {
      const url = this.user.avatar_url;
      const sep = url.includes('?') ? '&' : '?';
      return url + sep + '_t=' + this.avatarTimestamp;
    }
    const name = this.user?.nickname || this.user?.name || 'U';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=F06292&color=fff&size=128&bold=true&length=1`;
  }

  onAvatarError(event: Event) {
    this.avatarFailed = true;
    const name = this.user?.nickname || this.user?.name || 'U';
    (event.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=F06292&color=fff&size=128&bold=true&length=1`;
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.editName = this.user?.name || '';
      this.editNickname = this.user?.nickname || '';
      this.avatarPreview = null;
      this.selectedFile = null;
    } else {
      this.avatarPreview = null;
      this.selectedFile = null;
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = e => this.avatarPreview = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  async showToast(msg: string, color: string = 'success') {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      color: color,
      position: 'top'
    });
    toast.present();
  }

  saveProfile() {
    this.isSaving = true;
    const formData = new FormData();
    formData.append('name', this.editName);
    formData.append('nickname', this.editNickname);
    if (this.selectedFile) {
      formData.append('avatar', this.selectedFile);
    }

    this.apiService.updateProfile(formData).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.avatarFailed = false;
          this.avatarTimestamp = Date.now();
          this.avatarPreview = null;
          this.selectedFile = null;
          this.isEditing = false;

          this.user = { ...res.data };

          this.showToast('Profil berhasil diperbarui!');
          
          console.log('Avatar URL dari server:', res.data?.avatar_url);
        } else {
          this.showToast('Gagal memperbarui profil.', 'danger');
        }
        this.isSaving = false;
      },
      error: err => {
        console.error('Error updating profile', err);
        let msg = 'Gagal menyimpan perubahan.';
        if (err.error && err.error.message) {
          msg = err.error.message;
        }
        this.showToast(msg, 'danger');
        this.isSaving = false;
      }
    });
  }

  openPage(page: string) {
    this.router.navigate(['/tabs/profile/' + page]);
  }

  async logout() {
    localStorage.removeItem('token');
    try {
      await this.googleAuthService.signOut();
    } catch (e) {
      console.log('Google signOut error', e);
    }
    this.router.navigate(['/splash'], { queryParams: { logout: 'true' }, replaceUrl: true });
  }
}
