import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline, chatbubblesOutline, mailOutline,
  logoWhatsapp, documentTextOutline, informationCircleOutline,
  chevronDownOutline, chevronUpOutline, chevronForwardOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [IonicModule, CommonModule],
  template: `
    <ion-content class="page-content">
      <div class="page-wrapper">
        <!-- Header -->
        <div class="top-bar">
          <button class="back-btn" (click)="goBack()">
            <ion-icon name="chevron-back-outline"></ion-icon>
          </button>
          <h1 class="page-title">Bantuan</h1>
          <div class="spacer"></div>
        </div>

        <!-- Contact Support -->
        <div class="section fade-in">
          <div class="section-title">Hubungi Kami</div>
          
          <div class="contact-grid">
            <div class="contact-card" (click)="openWhatsApp()">
              <div class="icon-wrap green"><ion-icon name="logo-whatsapp"></ion-icon></div>
              <div class="contact-label">WhatsApp</div>
              <div class="contact-desc">Respon cepat</div>
            </div>
            <div class="contact-card" (click)="openEmail()">
              <div class="icon-wrap pink"><ion-icon name="mail-outline"></ion-icon></div>
              <div class="contact-label">Email</div>
              <div class="contact-desc">eldemycourses&#64;gmail.com</div>
            </div>
          </div>
        </div>

        <!-- FAQ -->
        <div class="section fade-in" style="animation-delay: 0.1s">
          <div class="section-title">Pertanyaan Umum (FAQ)</div>
          
          <div class="faq-list">
            <div class="faq-item" *ngFor="let faq of faqs; let i = index" (click)="toggleFaq(i)">
              <div class="faq-header">
                <span class="faq-question">{{ faq.question }}</span>
                <ion-icon [name]="faq.open ? 'chevron-up-outline' : 'chevron-down-outline'" class="faq-arrow"></ion-icon>
              </div>
              <div class="faq-answer" *ngIf="faq.open">
                {{ faq.answer }}
              </div>
            </div>
          </div>
        </div>

        <!-- App Info -->
        <div class="section fade-in" style="animation-delay: 0.2s">
          <div class="section-title">Tentang Aplikasi</div>
          
          <div class="info-card">
            <div class="info-row">
              <span class="info-label">Versi Aplikasi</span>
              <span class="info-value">1.0.0</span>
            </div>
            <div class="divider"></div>
            <div class="info-row">
              <span class="info-label">Platform</span>
              <span class="info-value">Ionic / Angular</span>
            </div>
            <div class="divider"></div>
            <div class="info-row clickable" (click)="openTerms()">
              <span class="info-label">Syarat & Ketentuan</span>
              <ion-icon name="chevron-forward-outline" class="arrow"></ion-icon>
            </div>
            <div class="divider"></div>
            <div class="info-row clickable" (click)="openPrivacyPolicy()">
              <span class="info-label">Kebijakan Privasi</span>
              <ion-icon name="chevron-forward-outline" class="arrow"></ion-icon>
            </div>
          </div>
        </div>

        <div class="footer-text">
          Dibuat dengan ❤️ oleh Tim Eldemy<br>
          © 2026 Eldemy. Hak cipta dilindungi.
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
    }

    .contact-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .contact-card {
      background: #fff;
      border-radius: 20px;
      padding: 20px 16px;
      text-align: center;
      box-shadow: 0 4px 15px rgba(0,0,0,0.03);
      cursor: pointer;
      transition: transform 0.2s;

      &:active { transform: scale(0.97); }

      .icon-wrap {
        width: 48px; height: 48px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        margin: 0 auto 12px;

        &.green { background: rgba(76,175,80,0.15); color: #4CAF50; }
        &.pink { background: rgba(240,98,146,0.15); color: var(--primary); }
      }
    }

    .contact-label {
      font-weight: 700;
      font-size: 0.95rem;
      margin-bottom: 4px;
    }

    .contact-desc {
      font-size: 0.75rem;
      color: #94a3b8;
    }

    .faq-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .faq-item {
      background: #fff;
      border-radius: 16px;
      padding: 16px 18px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.02);
      cursor: pointer;
      transition: all 0.3s;
    }

    .faq-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .faq-question {
      font-weight: 700;
      font-size: 0.88rem;
      flex: 1;
      line-height: 1.4;
    }

    .faq-arrow {
      font-size: 1rem;
      color: #94a3b8;
      flex-shrink: 0;
    }

    .faq-answer {
      font-size: 0.84rem;
      color: #64748b;
      line-height: 1.6;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid #f1f5f9;
      animation: fadeIn 0.3s ease;
    }

    .info-card {
      background: #fff;
      border-radius: 20px;
      padding: 8px 18px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.03);
    }

    .info-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 0;

      &.clickable {
        cursor: pointer;
        &:active { opacity: 0.7; }
      }
    }

    .info-label {
      font-weight: 600;
      font-size: 0.9rem;
    }

    .info-value {
      font-size: 0.85rem;
      color: #94a3b8;
      font-weight: 600;
    }

    .arrow {
      color: #cbd5e1;
      font-size: 1.1rem;
    }

    .divider {
      height: 1px;
      background: #f1f5f9;
    }

    .footer-text {
      text-align: center;
      font-size: 0.78rem;
      color: #94a3b8;
      line-height: 1.8;
      padding: 16px 0;
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
export class HelpPage implements OnInit {
  private router = inject(Router);

  faqs: any[] = [];

  constructor() {
    addIcons({
      chevronBackOutline, chatbubblesOutline, mailOutline,
      logoWhatsapp, documentTextOutline, informationCircleOutline,
      chevronDownOutline, chevronUpOutline, chevronForwardOutline
    });
  }

  ngOnInit() {
    this.faqs = [
      {
        question: 'Bagaimana cara membeli kursus?',
        answer: 'Pilih kursus yang Anda inginkan dari halaman Kursus, lalu klik tombol "Beli Kursus". Anda akan diarahkan ke halaman pembayaran untuk menyelesaikan transaksi.',
        open: false
      },
      {
        question: 'Apakah saya bisa mengakses kursus selamanya?',
        answer: 'Ya! Setelah Anda membeli kursus, Anda mendapatkan akses selamanya tanpa batas waktu. Anda bisa mengulang pelajaran kapan saja.',
        open: false
      },
      {
        question: 'Bagaimana cara mendapatkan sertifikat?',
        answer: 'Selesaikan semua materi dalam kursus dan lulus kuis akhir dengan nilai minimal yang ditentukan. Sertifikat akan otomatis tersedia di halaman Riwayat.',
        open: false
      },
      {
        question: 'Saya mengalami masalah saat pembayaran, apa yang harus dilakukan?',
        answer: 'Coba ulangi proses pembayaran. Jika masih gagal, hubungi kami melalui WhatsApp atau email dan sertakan screenshot error-nya.',
        open: false
      },
      {
        question: 'Apakah ada jaminan uang kembali?',
        answer: 'Kami menawarkan jaminan uang kembali dalam 7 hari setelah pembelian jika Anda tidak puas dengan kursus yang dibeli. Hubungi tim support untuk proses refund.',
        open: false
      }
    ];
  }

  toggleFaq(index: number) {
    this.faqs[index].open = !this.faqs[index].open;
  }

  openWhatsApp() {
    window.open('https://wa.me/6285282777446?text=Halo%20Tim%20Eldemy%2C%20saya%20butuh%20bantuan', '_blank');
  }

  openEmail() {
    window.open('mailto:eldemycourses@gmail.com?subject=Bantuan%20Eldemy', '_blank');
  }

  openTerms() {
    window.open('https://eldemy.eltaimayu.my.id/terms', '_blank');
  }

  openPrivacyPolicy() {
    window.open('https://eldemy.eltaimayu.my.id/privacy', '_blank');
  }

  goBack() {
    this.router.navigate(['/tabs/profile']);
  }
}
