import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline, shieldCheckmarkOutline, personOutline,
  lockClosedOutline, cardOutline, analyticsOutline,
  globeOutline, trashOutline, mailOutline, refreshOutline,
  checkmarkCircle, checkmarkCircleOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  template: `
    <ion-content [fullscreen]="true" class="policy-content" style="--background: transparent;">
      <div class="background-container"></div>
      <div class="page-wrapper">

        <!-- Floating Back Button (only in read mode, NOT onboarding) -->
        <button class="floating-back" (click)="goBack()" *ngIf="!isOnboarding">
          <ion-icon name="chevron-back-outline"></ion-icon>
        </button>

        <!-- Top Spacer to show background image -->
        <div class="top-spacer"></div>

        <!-- Main Content Overlay -->
        <div class="content-overlay" [class.has-bottom-bar]="isOnboarding">

          <!-- Header -->
          <div class="policy-header">
            <div class="shield-icon">
              <ion-icon name="shield-checkmark-outline"></ion-icon>
            </div>
            <h1 class="policy-title">Kebijakan Privasi</h1>
            <p class="policy-subtitle">Eldemy — Platform Kursus Online</p>
            <div class="update-badge">
              <ion-icon name="refresh-outline"></ion-icon>
              <span>Terakhir diperbarui: 16 Juni 2026</span>
            </div>
          </div>

          <!-- Intro -->
          <div class="section fade-in">
            <p class="intro-text">
              Selamat datang di Eldemy. Kami menghargai kepercayaan Anda dan berkomitmen
              untuk melindungi privasi serta data pribadi Anda. Kebijakan Privasi ini
              menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi
              Anda saat menggunakan aplikasi dan layanan kami.
            </p>
          </div>

          <!-- Section 1 -->
          <div class="section fade-in" style="animation-delay: 0.05s">
            <div class="section-header">
              <div class="section-icon">
                <ion-icon name="person-outline"></ion-icon>
              </div>
              <h2 class="section-title">1. Data yang Kami Kumpulkan</h2>
            </div>
            <div class="section-body">
              <p>Saat Anda menggunakan Eldemy, kami dapat mengumpulkan informasi berikut:</p>
              <div class="info-item">
                <span class="bullet"></span>
                <p><strong>Data Akun:</strong> Nama lengkap, nama panggilan, alamat email, dan foto profil yang Anda berikan saat registrasi atau melalui login Google.</p>
              </div>
              <div class="info-item">
                <span class="bullet"></span>
                <p><strong>Data Pembelajaran:</strong> Riwayat kursus yang dibeli, progres penyelesaian materi, hasil kuis, dan sertifikat yang diterbitkan.</p>
              </div>
              <div class="info-item">
                <span class="bullet"></span>
                <p><strong>Data Transaksi:</strong> Informasi pembelian kursus termasuk ID pesanan, jumlah pembayaran, metode pembayaran, dan status transaksi.</p>
              </div>
              <div class="info-item">
                <span class="bullet"></span>
                <p><strong>Data Teknis:</strong> Jenis perangkat, sistem operasi, versi aplikasi, dan log aktivitas untuk keperluan debugging dan peningkatan layanan.</p>
              </div>
            </div>
          </div>

          <!-- Section 2 -->
          <div class="section fade-in" style="animation-delay: 0.1s">
            <div class="section-header">
              <div class="section-icon blue">
                <ion-icon name="analytics-outline"></ion-icon>
              </div>
              <h2 class="section-title">2. Penggunaan Data</h2>
            </div>
            <div class="section-body">
              <p>Kami menggunakan data Anda untuk:</p>
              <div class="info-item">
                <span class="bullet blue"></span>
                <p>Menyediakan dan mengelola akun Anda di platform Eldemy.</p>
              </div>
              <div class="info-item">
                <span class="bullet blue"></span>
                <p>Memproses pembelian kursus dan memverifikasi pembayaran melalui payment gateway yang terintegrasi.</p>
              </div>
              <div class="info-item">
                <span class="bullet blue"></span>
                <p>Melacak progres belajar Anda, menyimpan hasil kuis, dan menerbitkan sertifikat kelulusan.</p>
              </div>
              <div class="info-item">
                <span class="bullet blue"></span>
                <p>Mengirimkan notifikasi penting terkait status pembayaran, pembaruan kursus, dan pencapaian Anda.</p>
              </div>
              <div class="info-item">
                <span class="bullet blue"></span>
                <p>Meningkatkan kualitas layanan, performa aplikasi, dan pengalaman pengguna.</p>
              </div>
            </div>
          </div>

          <!-- Section 3 -->
          <div class="section fade-in" style="animation-delay: 0.15s">
            <div class="section-header">
              <div class="section-icon green">
                <ion-icon name="card-outline"></ion-icon>
              </div>
              <h2 class="section-title">3. Pembayaran & Keamanan Finansial</h2>
            </div>
            <div class="section-body">
              <p>
                Eldemy menggunakan layanan payment gateway pihak ketiga (iPaymu) untuk
                memproses pembayaran. Kami <strong>tidak menyimpan</strong> informasi
                kartu kredit, debit, atau detail perbankan Anda secara langsung di server kami.
              </p>
              <p style="margin-top: 10px;">
                Seluruh transaksi pembayaran diproses melalui koneksi terenkripsi dan sesuai
                dengan standar keamanan industri. Kami hanya menyimpan referensi transaksi
                (ID pesanan dan status pembayaran) untuk keperluan verifikasi dan riwayat pembelian.
              </p>
            </div>
          </div>

          <!-- Section 4 -->
          <div class="section fade-in" style="animation-delay: 0.2s">
            <div class="section-header">
              <div class="section-icon orange">
                <ion-icon name="lock-closed-outline"></ion-icon>
              </div>
              <h2 class="section-title">4. Keamanan Data</h2>
            </div>
            <div class="section-body">
              <p>Kami menerapkan langkah-langkah keamanan berikut:</p>
              <div class="info-item">
                <span class="bullet orange"></span>
                <p>Kata sandi disimpan dalam bentuk hash terenkripsi (bcrypt) dan tidak pernah disimpan dalam teks biasa.</p>
              </div>
              <div class="info-item">
                <span class="bullet orange"></span>
                <p>Autentikasi API menggunakan token berbasis Sanctum dengan transmisi data terenkripsi.</p>
              </div>
              <div class="info-item">
                <span class="bullet orange"></span>
                <p>Login melalui Google OAuth 2.0 diverifikasi langsung ke server Google untuk memastikan keaslian identitas.</p>
              </div>
              <div class="info-item">
                <span class="bullet orange"></span>
                <p>Akses ke data hanya diberikan kepada pengguna yang terautentikasi melalui mekanisme token keamanan.</p>
              </div>
            </div>
          </div>

          <!-- Section 5 -->
          <div class="section fade-in" style="animation-delay: 0.25s">
            <div class="section-header">
              <div class="section-icon purple">
                <ion-icon name="globe-outline"></ion-icon>
              </div>
              <h2 class="section-title">5. Layanan Pihak Ketiga</h2>
            </div>
            <div class="section-body">
              <p>Eldemy mengintegrasikan layanan pihak ketiga berikut yang mungkin mengumpulkan data sesuai kebijakan privasi mereka masing-masing:</p>
              <div class="third-party-card">
                <strong>Google Sign-In</strong>
                <span>Untuk autentikasi akun dan login cepat</span>
              </div>
              <div class="third-party-card">
                <strong>iPaymu Payment Gateway</strong>
                <span>Untuk pemrosesan pembayaran kursus</span>
              </div>
              <div class="third-party-card">
                <strong>Google Fonts</strong>
                <span>Untuk tampilan tipografi di aplikasi</span>
              </div>
              <p style="margin-top: 12px; font-size: 0.82rem; color: #aaa;">
                Kami menyarankan Anda untuk membaca kebijakan privasi dari masing-masing
                layanan pihak ketiga tersebut.
              </p>
            </div>
          </div>

          <!-- Section 6 -->
          <div class="section fade-in" style="animation-delay: 0.3s">
            <div class="section-header">
              <div class="section-icon teal">
                <ion-icon name="trash-outline"></ion-icon>
              </div>
              <h2 class="section-title">6. Hak Pengguna</h2>
            </div>
            <div class="section-body">
              <p>Sebagai pengguna Eldemy, Anda memiliki hak untuk:</p>
              <div class="rights-grid">
                <div class="right-card">
                  <div class="right-emoji">📋</div>
                  <div class="right-label">Mengakses data pribadi yang kami simpan tentang Anda</div>
                </div>
                <div class="right-card">
                  <div class="right-emoji">✏️</div>
                  <div class="right-label">Memperbarui atau mengoreksi informasi profil Anda</div>
                </div>
                <div class="right-card">
                  <div class="right-emoji">🗑️</div>
                  <div class="right-label">Meminta penghapusan akun dan data pribadi Anda</div>
                </div>
                <div class="right-card">
                  <div class="right-emoji">🚫</div>
                  <div class="right-label">Menolak pengiriman notifikasi non-esensial</div>
                </div>
              </div>
              <div class="delete-note">
                <p><strong>Cara menghapus akun:</strong></p>
                <p>• Melalui aplikasi: <strong>Profil → Privasi &amp; Keamanan → Hapus Akun</strong>, lalu konfirmasi.</p>
                <p>• Melalui email: kirim permintaan ke <strong>eldemycourses&#64;gmail.com</strong>.</p>
                <p style="margin-top: 8px;">Penghapusan bersifat permanen dan mencakup seluruh data Anda: akun, profil, progres belajar, riwayat pembelian, hasil kuis, dan sertifikat.</p>
              </div>
            </div>
          </div>

          <!-- Section 7: Privasi Anak -->
          <div class="section fade-in" style="animation-delay: 0.32s">
            <div class="section-header">
              <div class="section-icon green">
                <ion-icon name="shield-checkmark-outline"></ion-icon>
              </div>
              <h2 class="section-title">7. Privasi Anak</h2>
            </div>
            <div class="section-body">
              <p>
                Eldemy menyediakan materi pembelajaran untuk jenjang SD, SMP, dan SMA/SMK.
                Untuk pengguna yang berusia di bawah 13 tahun, penggunaan aplikasi harus dilakukan
                dengan persetujuan dan pengawasan orang tua atau wali. Kami tidak dengan sengaja
                mengumpulkan data pribadi anak tanpa persetujuan orang tua.
              </p>
            </div>
          </div>

          <!-- Section 8 -->
          <div class="section fade-in" style="animation-delay: 0.35s">
            <div class="section-header">
              <div class="section-icon pink">
                <ion-icon name="mail-outline"></ion-icon>
              </div>
              <h2 class="section-title">8. Hubungi Kami</h2>
            </div>
            <div class="section-body">
              <p>
                Jika Anda memiliki pertanyaan, kekhawatiran, atau permintaan terkait
                kebijakan privasi ini, silakan hubungi kami melalui:
              </p>
              <div class="contact-card">
                <div class="contact-row">
                  <span class="contact-label">📧 Email</span>
                  <span class="contact-value">eldemycourses&#64;gmail.com</span>
                </div>
                <div class="contact-divider"></div>
                <div class="contact-row">
                  <span class="contact-label">🌐 Website</span>
                  <span class="contact-value">eldemy.eltaimayu.my.id</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer (read mode only) -->
          <div class="policy-footer fade-in" style="animation-delay: 0.4s" *ngIf="!isOnboarding">
            <div class="footer-divider"></div>
            <p class="footer-text">
              Dengan menggunakan aplikasi Eldemy, Anda menyetujui pengumpulan dan penggunaan
              informasi sesuai dengan Kebijakan Privasi ini. Kami dapat memperbarui kebijakan
              ini dari waktu ke waktu dan akan memberitahu Anda melalui notifikasi di aplikasi.
            </p>
            <p class="copyright">© 2026 Eldemy. Hak cipta dilindungi.</p>
          </div>

          <!-- Extra bottom padding for onboarding mode (so content doesn't hide behind sticky bar) -->
          <div *ngIf="isOnboarding" style="height: 140px;"></div>

        </div>
      </div>

      <!-- ========== STICKY BOTTOM BAR (Onboarding mode only) ========== -->
      <div class="accept-bar" *ngIf="isOnboarding">
        <div class="accept-bar-inner">
          <!-- Checkbox row -->
          <div class="checkbox-row" (click)="isAgreed = !isAgreed">
            <div class="custom-checkbox" [class.checked]="isAgreed">
              <ion-icon [name]="isAgreed ? 'checkmark-circle' : 'checkmark-circle-outline'"></ion-icon>
            </div>
            <span class="checkbox-label">
              Saya menyetujui <strong>Kebijakan Privasi</strong>
            </span>
          </div>

          <!-- CTA Button -->
          <button
            class="btn-accept"
            [class.active]="isAgreed"
            [disabled]="!isAgreed"
            (click)="acceptAndContinue()"
          >
            MULAI MENGGUNAKAN
          </button>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    ion-content.policy-content {
      --background: transparent;
    }

    .background-container {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url("/assets/images/backgrounds/Eldemy-welcome-bg.jpeg") no-repeat center center / cover;
      z-index: -1;
    }

    .page-wrapper {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* ---- Floating back button ---- */
    .floating-back {
      position: fixed;
      top: 16px;
      left: 16px;
      z-index: 100;
      width: 40px;
      height: 40px;
      border-radius: 14px;
      background: rgba(0, 0, 0, 0.45);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-size: 1.2rem;
      cursor: pointer;
      transition: transform 0.15s ease, background 0.2s ease;

      &:active {
        transform: scale(0.92);
        background: rgba(0, 0, 0, 0.6);
      }
    }

    /* ---- Top spacer to show bg image ---- */
    .top-spacer {
      height: 180px;
      flex-shrink: 0;
    }

    /* ---- Main content overlay ---- */
    .content-overlay {
      background: linear-gradient(
        to bottom,
        rgba(25, 25, 25, 0.75) 0%,
        rgba(15, 15, 15, 0.92) 6%,
        rgba(12, 12, 12, 0.97) 15%,
        rgba(10, 10, 10, 0.99) 100%
      );
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-top-left-radius: 36px;
      border-top-right-radius: 36px;
      padding: 32px 24px 40px;
      animation: slideUpOverlay 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes slideUpOverlay {
      0% {
        opacity: 0;
        transform: translateY(60px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* ---- Policy Header ---- */
    .policy-header {
      text-align: center;
      margin-bottom: 28px;
    }

    .shield-icon {
      width: 56px;
      height: 56px;
      border-radius: 18px;
      background: linear-gradient(135deg, rgba(231, 76, 60, 0.25), rgba(231, 76, 60, 0.08));
      border: 1px solid rgba(231, 76, 60, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;

      ion-icon {
        font-size: 1.6rem;
        color: #e74c3c;
      }
    }

    .policy-title {
      font-family: "Inter", sans-serif;
      font-weight: 800;
      font-size: 1.8rem;
      color: #ffffff;
      margin: 0;
      letter-spacing: -0.8px;
    }

    .policy-subtitle {
      font-family: "Inter", sans-serif;
      color: #888;
      font-size: 0.85rem;
      margin-top: 4px;
      font-weight: 500;
    }

    .update-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-top: 14px;
      background: rgba(255, 255, 255, 0.07);
      border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 6px 14px;
      border-radius: 100px;
      font-family: "Inter", sans-serif;
      font-size: 0.72rem;
      font-weight: 600;
      color: #aaa;

      ion-icon {
        font-size: 0.85rem;
        color: #888;
      }
    }

    /* ---- Intro ---- */
    .intro-text {
      font-family: "Inter", sans-serif;
      font-size: 0.88rem;
      color: #c0c0c0;
      line-height: 1.7;
      margin: 0;
    }

    /* ---- Sections ---- */
    .section {
      margin-bottom: 24px;
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 14px;
    }

    .section-icon {
      width: 36px;
      height: 36px;
      border-radius: 11px;
      background: rgba(231, 76, 60, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      ion-icon {
        font-size: 1.1rem;
        color: #e74c3c;
      }

      &.blue {
        background: rgba(59, 130, 246, 0.15);
        ion-icon { color: #60a5fa; }
      }
      &.green {
        background: rgba(16, 185, 129, 0.15);
        ion-icon { color: #34d399; }
      }
      &.orange {
        background: rgba(245, 158, 11, 0.15);
        ion-icon { color: #fbbf24; }
      }
      &.purple {
        background: rgba(139, 92, 246, 0.15);
        ion-icon { color: #a78bfa; }
      }
      &.teal {
        background: rgba(20, 184, 166, 0.15);
        ion-icon { color: #2dd4bf; }
      }
      &.pink {
        background: rgba(236, 72, 153, 0.15);
        ion-icon { color: #f472b6; }
      }
    }

    .section-title {
      font-family: "Inter", sans-serif;
      font-weight: 800;
      font-size: 1.05rem;
      color: #ffffff;
      margin: 0;
      letter-spacing: -0.3px;
    }

    .section-body {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 18px;
      padding: 18px 16px;

      p {
        font-family: "Inter", sans-serif;
        font-size: 0.84rem;
        color: #b0b0b0;
        line-height: 1.65;
        margin: 0;
      }
    }

    /* ---- Info Items (bullet list) ---- */
    .info-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-top: 12px;

      p {
        margin: 0;
        font-family: "Inter", sans-serif;
        font-size: 0.83rem;
        color: #b0b0b0;
        line-height: 1.6;

        strong {
          color: #d4d4d4;
          font-weight: 700;
        }
      }
    }

    .bullet {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #e74c3c;
      flex-shrink: 0;
      margin-top: 7px;

      &.blue { background: #60a5fa; }
      &.orange { background: #fbbf24; }
    }

    /* ---- Third Party Cards ---- */
    .third-party-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 12px;
      padding: 12px 14px;
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      gap: 2px;

      strong {
        font-family: "Inter", sans-serif;
        font-size: 0.85rem;
        font-weight: 700;
        color: #d4d4d4;
      }

      span {
        font-family: "Inter", sans-serif;
        font-size: 0.78rem;
        color: #888;
      }
    }

    /* ---- Rights Grid ---- */
    .rights-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-top: 14px;
    }

    .right-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 14px;
      padding: 14px 12px;
      text-align: center;
    }

    .right-emoji {
      font-size: 1.5rem;
      margin-bottom: 8px;
    }

    .right-label {
      font-family: "Inter", sans-serif;
      font-size: 0.76rem;
      color: #b0b0b0;
      line-height: 1.45;
      font-weight: 500;
    }

    /* ---- Delete account note ---- */
    .delete-note {
      margin-top: 14px;
      background: rgba(231, 76, 60, 0.08);
      border: 1px solid rgba(231, 76, 60, 0.18);
      border-radius: 14px;
      padding: 14px 16px;
    }

    .delete-note p {
      font-family: "Inter", sans-serif;
      font-size: 0.8rem;
      color: #c0c0c0;
      line-height: 1.55;
      margin: 0 0 4px;
    }

    .delete-note strong {
      color: #f0f0f0;
      font-weight: 700;
    }

    /* ---- Contact Card ---- */
    .contact-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 16px;
      padding: 16px;
      margin-top: 14px;
    }

    .contact-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 4px 0;
    }

    .contact-label {
      font-family: "Inter", sans-serif;
      font-size: 0.82rem;
      color: #888;
      font-weight: 600;
    }

    .contact-value {
      font-family: "Inter", sans-serif;
      font-size: 0.82rem;
      color: #d4d4d4;
      font-weight: 700;
    }

    .contact-divider {
      height: 1px;
      background: rgba(255, 255, 255, 0.06);
      margin: 10px 0;
    }

    /* ---- Footer ---- */
    .policy-footer {
      margin-top: 8px;
      text-align: center;
    }

    .footer-divider {
      height: 1px;
      background: rgba(255, 255, 255, 0.08);
      margin-bottom: 20px;
    }

    .footer-text {
      font-family: "Inter", sans-serif;
      font-size: 0.8rem;
      color: #777;
      line-height: 1.6;
      margin: 0 0 16px;
    }

    .copyright {
      font-family: "Inter", sans-serif;
      font-size: 0.72rem;
      color: #555;
      font-weight: 600;
      margin: 0;
      letter-spacing: 0.3px;
    }

    /* ============================================
       STICKY BOTTOM ACCEPTANCE BAR
       ============================================ */
    .accept-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 200;
      animation: slideBarUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.6s both;
    }

    @keyframes slideBarUp {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .accept-bar-inner {
      background: rgba(18, 18, 18, 0.95);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding: 18px 24px;
      padding-bottom: calc(18px + env(safe-area-inset-bottom, 0px));
    }

    .checkbox-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 14px;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
    }

    .custom-checkbox {
      width: 26px;
      height: 26px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.25s ease;

      ion-icon {
        font-size: 1.5rem;
        color: rgba(255, 255, 255, 0.25);
        transition: color 0.25s ease, transform 0.25s ease;
      }

      &.checked ion-icon {
        color: #e74c3c;
        transform: scale(1.15);
      }
    }

    .checkbox-label {
      font-family: "Inter", sans-serif;
      font-size: 0.88rem;
      color: #c0c0c0;
      font-weight: 500;
      line-height: 1.3;
      user-select: none;

      strong {
        color: #ffffff;
        font-weight: 700;
      }
    }

    .btn-accept {
      width: 100%;
      padding: 15px;
      border-radius: 28px;
      border: none;
      font-family: "Inter", sans-serif;
      font-size: 0.92rem;
      font-weight: 800;
      letter-spacing: 1px;
      cursor: pointer;
      transition: all 0.3s ease;
      touch-action: manipulation;

      /* Disabled state */
      background: rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.2);

      &.active {
        background: #000000;
        color: #ffffff;
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);

        &:active {
          transform: scale(0.97);
          background: #1a1a1a;
        }
      }

      &:disabled {
        cursor: not-allowed;
      }
    }

    /* ---- Animations ---- */
    .fade-in {
      opacity: 0;
      animation: fadeInUp 0.5s ease forwards;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(12px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class PrivacyPolicyPage implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isOnboarding = false;
  isAgreed = false;

  constructor() {
    addIcons({
      chevronBackOutline, shieldCheckmarkOutline, personOutline,
      lockClosedOutline, cardOutline, analyticsOutline,
      globeOutline, trashOutline, mailOutline, refreshOutline,
      checkmarkCircle, checkmarkCircleOutline
    });
  }

  ngOnInit() {
    // Check if this is onboarding mode (first-time login flow)
    this.isOnboarding = this.route.snapshot.queryParams['onboarding'] === 'true';
  }

  /**
   * Mark privacy as accepted on this device and go to welcome page
   */
  acceptAndContinue() {
    if (!this.isAgreed) return;

    // Store acceptance globally for this device (not per-user)
    localStorage.setItem('privacy_policy_accepted', 'true');

    // Navigate to welcome/get-started page (user hasn't logged in yet)
    this.router.navigate(['/welcome'], { replaceUrl: true });
  }

  goBack() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.router.navigate(['/tabs/profile']);
    }
  }

  /**
   * Static helper: check if privacy policy has been accepted on this device.
   */
  static hasAcceptedPrivacy(): boolean {
    return localStorage.getItem('privacy_policy_accepted') === 'true';
  }
}

