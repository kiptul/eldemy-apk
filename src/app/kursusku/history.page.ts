import { Component, ChangeDetectorRef, NgZone, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { HeaderComponent } from '../shared/components/header/header.component';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-kursusku',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HeaderComponent],
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class KursuskuPage {
  private apiService = inject(ApiService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);

  activeTab: 'selesai' | 'progress' = 'selesai';
  isLoading = true;

  completedCourses: any[] = [];
  inProgressCourses: any[] = [];

  isCertificateModalOpen = false;
  certificateData: any = null;
  certificateCourse: any = null;
  user: any = null;
  certificateDate: string = '';
  isDownloading = false;
  isCertZoomed = false;

  // Download success dialog
  showDownloadSuccess = false;
  downloadedFileName = '';

  // Loading overlay
  showLoadingOverlay = false;
  loadingMessage = '';

  // Custom toast state
  toastMessage = '';
  toastType = '';
  toastVisible = false;
  private toastTimer: any = null;

  ngOnInit() {
    this.loadHistory();
    this.loadUser();
  }

  ionViewWillEnter() {
    if (!this.isLoading) this.loadHistory();
  }

  loadUser() {
    this.apiService.getUserProfile().subscribe({
      next: (res: any) => {
        if (res.success) this.user = res.data;
      },
      error: () => {}
    });
  }

  loadHistory() {
    this.isLoading = true;
    this.apiService.getMyCourses().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.completedCourses = res.data.filter((c: any) => c.progress === 100);
          this.inProgressCourses = res.data.filter((c: any) => c.progress < 100);
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  segmentChanged(event: any) {
    this.activeTab = event.detail.value;
  }

  goToCourseDetail(courseId: number) {
    console.log('goToCourseDetail called with courseId:', courseId);
    if (!courseId) {
      console.warn('goToCourseDetail: courseId is null or undefined!');
      this.showToast('ID kursus tidak valid.');
      return;
    }
    this.router.navigate(['/tabs/kursus', courseId]).then(
      success => console.log('Navigation success:', success),
      err => console.error('Navigation error:', err)
    );
  }

  openCertificate(event: Event, item: any) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    console.log('openCertificate called with item:', item);
    if (!item?.course?.id) {
      console.warn('openCertificate: item.course.id is null or undefined!');
      this.showToast('ID kursus sertifikat tidak valid.');
      return;
    }
    this.certificateCourse = item.course;
    this.isCertZoomed = false;

    this.apiService.getCertificate(item.course.id).subscribe({
      next: async (res: any) => {
        console.log('getCertificate response:', res);
        this.zone.run(() => {
          if (res.success && res.data) {
            this.certificateData = res.data;
            try {
              const dateStr = res.data.created_at || new Date().toISOString();
              const d = new Date(dateStr);
              this.certificateDate = d.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
            } catch (e) {
              console.error('Error formatting date:', e);
              this.certificateDate = '';
            }
            this.isCertificateModalOpen = true;
          } else {
            this.showErrorAlert(res.message || 'Sertifikat tidak dapat dimuat.');
          }
          this.cdr.detectChanges();
        });
      },
      error: async (err) => {
        console.error('Gagal memuat sertifikat', err);
        this.zone.run(() => {
          const errMsg = err.error?.message || 'Gagal memuat sertifikat. Pastikan semua materi telah diselesaikan.';
          this.showErrorAlert(errMsg);
          this.cdr.detectChanges();
        });
      }
    });
  }

  showErrorAlert(message: string) {
    this.showCustomToast(message, 'error');
  }

  closeCertificateModal() {
    this.zone.run(() => {
      this.isCertificateModalOpen = false;
      this.isCertZoomed = false;
      this.cdr.detectChanges();
    });
  }

  toggleCertZoom() {
    this.zone.run(() => {
      this.isCertZoomed = !this.isCertZoomed;
      this.cdr.detectChanges();
    });
  }

  async downloadPdf() {
    if (!this.certificateCourse || this.isDownloading) return;
    this.isDownloading = true;
    this.showLoadingOverlay = true;
    this.loadingMessage = 'Mengunduh sertifikat...';
    this.cdr.detectChanges();

    const fileName = `Sertifikat_${(this.certificateCourse.title || 'kursus').replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_')}.pdf`;

    try {
      const blob = await firstValueFrom(
        this.apiService.downloadCertificatePdf(this.certificateCourse.id)
      );
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);

      this.zone.run(() => {
        this.isDownloading = false;
        this.showLoadingOverlay = false;
        this.downloadedFileName = fileName;
        this.showDownloadSuccess = true;
        this.cdr.detectChanges();
      });
    } catch (error) {
      this.zone.run(() => {
        this.isDownloading = false;
        this.showLoadingOverlay = false;
        this.cdr.detectChanges();
        this.showCustomToast('Gagal mengunduh sertifikat. Coba lagi.', 'error');
      });
    }
  }

  closeDownloadSuccess() {
    this.zone.run(() => {
      this.showDownloadSuccess = false;
      this.cdr.detectChanges();
    });
  }

  showToast(msg: string) {
    this.showCustomToast(msg, 'info');
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
