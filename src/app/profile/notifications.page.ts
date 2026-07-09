import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline, notificationsOutline, megaphoneOutline,
  cartOutline, ribbonOutline, bookOutline, checkmarkDoneOutline,
  alertCircleOutline, personOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-notifications',
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
          <h1 class="page-title">Notifikasi</h1>
          <button class="mark-all-btn" *ngIf="unreadCount > 0" (click)="markAllAsRead()">
            <ion-icon name="checkmark-done-outline"></ion-icon>
          </button>
          <div class="spacer" *ngIf="unreadCount === 0"></div>
        </div>

        <!-- Loading -->
        <div class="loading-state" *ngIf="isLoading">
          <ion-spinner name="crescent" color="primary"></ion-spinner>
          <p>Memuat notifikasi...</p>
        </div>

        <!-- Notifications List -->
        <div class="section fade-in" *ngIf="!isLoading">
          <!-- Unread badge -->
          <div class="unread-badge" *ngIf="unreadCount > 0">
            <span>{{ unreadCount }} notifikasi belum dibaca</span>
          </div>
          
          <div class="empty-state" *ngIf="notifications.length === 0">
            <div class="empty-icon-wrap">
              <ion-icon name="notifications-outline"></ion-icon>
            </div>
            <p>Belum ada notifikasi</p>
            <span>Notifikasi baru akan muncul di sini ketika ada aktivitas di akun Anda</span>
          </div>

          <div class="notif-list" *ngIf="notifications.length > 0">
            <div class="notif-card" 
                 *ngFor="let notif of notifications; let i = index" 
                 [class.unread]="!notif.is_read"
                 [style.animation-delay]="(i * 0.05) + 's'"
                 (click)="onNotifClick(notif)">
              <div class="notif-dot" *ngIf="!notif.is_read"></div>
              <div class="notif-icon" [ngClass]="notif.type">
                <ion-icon [name]="getNotifIcon(notif.type)"></ion-icon>
              </div>
              <div class="notif-body">
                <div class="notif-title">{{ notif.title }}</div>
                <div class="notif-message">{{ notif.message }}</div>
                <div class="notif-time">{{ getRelativeTime(notif.created_at) }}</div>
              </div>
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

    .mark-all-btn {
      width: 40px; height: 40px;
      border-radius: 12px;
      background: rgba(77,182,172,0.15);
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      color: var(--secondary);
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

    .unread-badge {
      background: linear-gradient(135deg, rgba(240,98,146,0.12), rgba(255,183,77,0.12));
      padding: 10px 16px;
      border-radius: 14px;
      margin-bottom: 16px;
      text-align: center;
      
      span {
        font-size: 0.82rem;
        font-weight: 700;
        color: var(--primary);
      }
    }

    .loading-state {
      text-align: center;
      padding: 60px 24px;
      
      ion-spinner {
        width: 36px;
        height: 36px;
        margin-bottom: 16px;
      }
      p {
        font-size: 0.9rem;
        color: #94a3b8;
      }
    }

    .empty-state {
      text-align: center;
      padding: 48px 24px;
      background: #fff;
      border-radius: 20px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.03);
      
      .empty-icon-wrap {
        width: 72px;
        height: 72px;
        border-radius: 50%;
        background: linear-gradient(135deg, rgba(240,98,146,0.1), rgba(255,183,77,0.1));
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 16px;
        
        ion-icon {
          font-size: 2rem;
          color: var(--primary);
        }
      }
      p {
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-weight: 700;
        font-size: 1.05rem;
        margin: 0 0 6px;
        color: var(--dark);
      }
      span {
        font-size: 0.82rem;
        color: #94a3b8;
        line-height: 1.5;
      }
    }

    .notif-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .notif-card {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      background: #fff;
      padding: 16px;
      border-radius: 16px;
      position: relative;
      box-shadow: 0 2px 10px rgba(0,0,0,0.02);
      transition: all 0.2s;
      cursor: pointer;
      animation: slideIn 0.4s ease forwards;
      opacity: 0;

      &:active { transform: scale(0.98); }

      &.unread { 
        background: linear-gradient(135deg, #fffcf5, #fff9f0);
        border-left: 3px solid var(--tertiary);
      }
    }

    @keyframes slideIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .notif-dot {
      position: absolute;
      top: 18px; left: 10px;
      width: 8px; height: 8px;
      border-radius: 50%;
      background: var(--primary);
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.3); opacity: 0.7; }
    }

    .notif-icon {
      width: 42px; height: 42px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      flex-shrink: 0;

      &.purchase { background: rgba(77,182,172,0.15); color: var(--secondary); }
      &.course_complete { background: rgba(240,98,146,0.15); color: var(--primary); }
      &.certificate { background: rgba(255,183,77,0.15); color: var(--tertiary); }
      &.promo { background: rgba(156,39,176,0.12); color: #9C27B0; }
      &.system { background: rgba(33,150,243,0.12); color: #2196F3; }
    }

    .notif-body { flex: 1; min-width: 0; }

    .notif-title {
      font-weight: 700;
      font-size: 0.88rem;
      margin-bottom: 4px;
      line-height: 1.3;
    }

    .notif-message {
      font-size: 0.8rem;
      color: #64748b;
      line-height: 1.5;
      margin-bottom: 6px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .notif-time {
      font-size: 0.72rem;
      color: #94a3b8;
      font-weight: 600;
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
export class NotificationsPage implements OnInit {
  private router = inject(Router);
  private apiService = inject(ApiService);
  private toastCtrl = inject(ToastController);

  notifications: any[] = [];
  unreadCount = 0;
  isLoading = true;

  constructor() {
    addIcons({
      chevronBackOutline, notificationsOutline, megaphoneOutline,
      cartOutline, ribbonOutline, bookOutline, checkmarkDoneOutline,
      alertCircleOutline, personOutline
    });
  }

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    this.isLoading = true;
    this.apiService.getNotifications().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.notifications = res.data || [];
          this.unreadCount = res.unread_count || 0;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading notifications', err);
        this.isLoading = false;
      }
    });
  }

  getNotifIcon(type: string): string {
    switch (type) {
      case 'purchase': return 'cart-outline';
      case 'course_complete': return 'book-outline';
      case 'certificate': return 'ribbon-outline';
      case 'promo': return 'megaphone-outline';
      case 'system': return 'person-outline';
      default: return 'notifications-outline';
    }
  }

  getRelativeTime(dateStr: string): string {
    if (!dateStr) return '';
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMs / 3600000);
    const diffDay = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return 'Baru saja';
    if (diffMin < 60) return diffMin + ' menit lalu';
    if (diffHour < 24) return diffHour + ' jam lalu';
    if (diffDay < 7) return diffDay + ' hari lalu';
    if (diffDay < 30) return Math.floor(diffDay / 7) + ' minggu lalu';
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  onNotifClick(notif: any) {
    if (!notif.is_read) {
      this.apiService.markNotificationAsRead(notif.id).subscribe({
        next: () => {
          notif.is_read = true;
          this.unreadCount = Math.max(0, this.unreadCount - 1);
        }
      });
    }

    // Navigate based on notification type
    if (notif.data?.course_id) {
      this.router.navigate(['/tabs/course-detail', notif.data.course_id]);
    }
  }

  async markAllAsRead() {
    this.apiService.markAllNotificationsAsRead().subscribe({
      next: () => {
        this.notifications.forEach(n => n.is_read = true);
        this.unreadCount = 0;
        this.showToast('Semua notifikasi ditandai sudah dibaca');
      }
    });
  }

  async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg, duration: 2000, color: 'success', position: 'top'
    });
    toast.present();
  }

  goBack() {
    this.router.navigate(['/tabs/profile']);
  }
}
