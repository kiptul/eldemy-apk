import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { HeaderComponent } from '../shared/components/header/header.component';
import { addIcons } from 'ionicons';
import { shieldCheckmark, arrowForwardOutline, checkmarkCircleOutline } from 'ionicons/icons';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, HeaderComponent]
})
export class CheckoutPage implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiService = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);

  courseId: number = 0;
  course: any = null;
  isLoading: boolean = true;
  currentOrderId: string = '';
  pollingInterval: any = null;

  // Custom overlay states (replaces broken Ionic overlays)
  isProcessing: boolean = false;
  processingMessage: string = '';
  showPaymentDialog: boolean = false;
  paymentUrl: string = '';
  toastMessage: string = '';
  toastType: string = '';
  toastVisible: boolean = false;
  private toastTimer: any = null;

  constructor() {
    addIcons({ shieldCheckmark, arrowForwardOutline, checkmarkCircleOutline });
  }

  ngOnInit() {
    this.courseId = this.route.snapshot.params['id'];
    this.loadCourseSummary();
  }

  ngOnDestroy() {
    this.stopPolling();
  }

  loadCourseSummary() {
    this.apiService.getCourseDetail(this.courseId).subscribe({
      next: (res: any) => {
        this.course = res.data;
        this.isLoading = false;
        this.cdr.detectChanges();
        
        // Cek jika sudah pernah beli
        if (res.has_purchased) {
          this.showCustomToast('Anda sudah memiliki akses ke kursus ini.', 'info');
          this.router.navigate(['/tabs/kursus', this.courseId]);
        }
      },
      error: (err) => {
        console.error('Gagal memuat detail', err);
        this.isLoading = false;
        this.cdr.detectChanges();
        this.showCustomToast('Gagal memuat data kursus. Silakan coba lagi.', 'error');
      }
    });
  }

  payNow() {
    this.zone.run(() => {
      this.isProcessing = true;
      this.processingMessage = 'Menyiapkan pembayaran...';
      this.cdr.detectChanges();
    });

    this.apiService.checkoutProcess({ course_id: this.courseId }).subscribe({
      next: (res: any) => {
        this.zone.run(() => {
          this.isProcessing = false;
          this.cdr.detectChanges();

          if (res.success) {
            if (res.payment_url) {
              this.currentOrderId = res.order_id;
              this.paymentUrl = res.payment_url;
              this.showPaymentDialog = true;
              this.cdr.detectChanges();
              // Auto open payment page
              this.openPaymentPage(res.payment_url);
              this.startPollingPaymentStatus();
            } else {
              this.showCustomToast(res.message || 'Registrasi kursus gratis berhasil! 🎉', 'success');
              this.router.navigate(['/tabs/kursus', this.courseId]);
            }
          } else {
            this.showCustomToast(res.message || 'Gagal menginisialisasi pembayaran.', 'error');
          }
        });
      },
      error: (err) => {
        this.zone.run(() => {
          this.isProcessing = false;
          this.cdr.detectChanges();
          const errMsg = err?.error?.message || 'Terjadi kesalahan saat memproses pembayaran.';
          this.showCustomToast(errMsg, 'error');
        });
      }
    });
  }

  onOpenPayment() {
    this.openPaymentPage(this.paymentUrl);
  }

  onConfirmPayment() {
    this.showPaymentDialog = false;
    this.cdr.detectChanges();
    this.checkPaymentStatus();
  }

  onCancelPayment() {
    this.showPaymentDialog = false;
    this.stopPolling();
    this.cdr.detectChanges();
  }

  async openPaymentPage(paymentUrl: string) {
    try {
      console.log('Membuka payment url via Capacitor Browser:', paymentUrl);
      await Browser.open({ url: paymentUrl });

      // Listener: ketika browser ditutup, cek status pembayaran
      Browser.addListener('browserFinished', async () => {
        this.stopPolling();
        await this.checkPaymentStatus();
      });
    } catch (error) {
      console.error('Gagal membuka via Capacitor Browser, mencoba fallback:', error);
      try {
        window.open(paymentUrl, '_system');
      } catch (err2) {
        console.error('Gagal membuka via _system:', err2);
        window.open(paymentUrl, '_blank');
      }
    }
  }

  startPollingPaymentStatus() {
    this.stopPolling();

    // Polling status pembayaran setiap 3 detik
    this.pollingInterval = setInterval(() => {
      if (!this.currentOrderId) {
        this.stopPolling();
        return;
      }

      this.apiService.checkTransactionStatus(this.currentOrderId).subscribe({
        next: async (res: any) => {
          if (res.success && res.status === 'settlement') {
            this.stopPolling();
            try {
              await Browser.close();
            } catch (e) {
              console.warn('Gagal menutup browser native:', e);
            }
            this.zone.run(() => {
              this.showPaymentDialog = false;
              this.cdr.detectChanges();
              this.showCustomToast('Pembayaran berhasil! 🎉', 'success');
              this.router.navigate(['/tabs/kursus', this.courseId]);
            });
          } else if (res.success && res.status === 'expire') {
            this.stopPolling();
            try {
              await Browser.close();
            } catch (e) {}
            this.zone.run(() => {
              this.showPaymentDialog = false;
              this.cdr.detectChanges();
              this.showCustomToast('Pembayaran kedaluwarsa atau gagal.', 'error');
            });
          }
        },
        error: (err) => {
          console.error('Error saat polling status:', err);
        }
      });
    }, 3000);
  }

  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  checkPaymentStatus() {
    if (!this.currentOrderId) return;

    this.zone.run(() => {
      this.isProcessing = true;
      this.processingMessage = 'Memeriksa status pembayaran...';
      this.cdr.detectChanges();
    });

    this.apiService.checkTransactionStatus(this.currentOrderId).subscribe({
      next: (res: any) => {
        this.zone.run(() => {
          this.isProcessing = false;
          this.cdr.detectChanges();
          if (res.success && res.status === 'settlement') {
            this.showCustomToast('Pembayaran berhasil! 🎉', 'success');
            this.router.navigate(['/tabs/kursus', this.courseId]);
          } else if (res.status === 'pending') {
            this.showCustomToast('Pembayaran Anda sedang diproses...', 'info');
            this.router.navigate(['/tabs/kursus', this.courseId]);
          } else {
            this.showCustomToast('Pembayaran belum selesai. Silakan coba lagi.', 'warning');
          }
        });
      },
      error: (err) => {
        this.zone.run(() => {
          this.isProcessing = false;
          this.cdr.detectChanges();
          this.showCustomToast('Gagal memeriksa status pembayaran.', 'error');
        });
      }
    });
  }

  showCustomToast(msg: string, type: string = 'info') {
    this.zone.run(() => {
      this.toastMessage = msg;
      this.toastType = type;
      this.toastVisible = true;
      this.cdr.detectChanges();
      if (this.toastTimer) clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => {
        this.toastVisible = false;
        this.cdr.detectChanges();
      }, 3000);
    });
  }
}
