import { Component, OnInit, ChangeDetectorRef, NgZone, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ViewWillEnter } from '@ionic/angular';
import { ActivatedRoute, RouterModule, Router } from '@angular/router'; 
import { NavController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { HeaderComponent } from '../shared/components/header/header.component';
import { addIcons } from 'ionicons';
import { 
  star, peopleOutline, lockClosedOutline, playCircle, 
  shieldCheckmark, arrowForwardOutline, playCircleOutline, 
  documentText, videocam, helpCircle, bookOutline, timeOutline,
  play, playSkipBack, refresh, settingsOutline, expandOutline, checkmark, searchOutline,
  checkmarkCircle, lockOpenOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.page.html',
  styleUrls: ['./course-detail.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, HeaderComponent, RouterModule],
})
export class CourseDetailPage implements OnInit, ViewWillEnter {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiService = inject(ApiService);
  private navCtrl = inject(NavController);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);

  course: any = null; 
  hasPurchased: boolean = false; 
  user: any = null;
  courseId: number = 0;
  totalDuration: string = '';

  totalProgress: number = 0;
  completedMaterialIds: number[] = [];

  // Custom toast state (replaces broken ToastController in WebView)
  toastMessage = '';
  toastType = '';
  toastVisible = false;
  private toastTimer: any = null;

  constructor() {
    addIcons({ 
      star, peopleOutline, lockClosedOutline, playCircle, 
      shieldCheckmark, arrowForwardOutline, playCircleOutline, 
      documentText, videocam, helpCircle, bookOutline, timeOutline,
      play, playSkipBack, refresh, settingsOutline, expandOutline, checkmark, searchOutline,
      checkmarkCircle, lockOpenOutline
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.courseId = +params['id'] || 0;
      if (this.courseId) {
        this.loadCourse();
        this.loadUser();
      }
    });
  }

  ionViewWillEnter() {
    const paramId = this.route.snapshot.paramMap.get('id');
    const id = paramId ? +paramId : 0;
    if (id) {
      this.courseId = id;
      this.loadCourse();
    }
  }

  loadUser() {
    this.apiService.getUserProfile().subscribe({
      next: (res: any) => { if (res.success) this.user = res.data; },
      error: () => {}
    });
  }

  loadCourse() {
    this.apiService.getCourseDetail(this.courseId).subscribe({
      next: (res: any) => {
        this.zone.run(() => {
          this.course = res.data;
          this.hasPurchased = res.has_purchased;
          this.calculateTotalDuration();
          
          if (this.hasPurchased) {
            this.loadProgress();
          } else {
            this.buildCurriculumLogic();
          }
          this.cdr.detectChanges();
        });
      },
      error: (err) => console.error('Gagal memuat detail', err),
    });
  }

  calculateTotalDuration() {
    if (!this.course?.materials?.length) {
      this.totalDuration = '';
      return;
    }

    let totalMinutes = 0;
    for (const mat of this.course.materials) {
      if (mat.duration) {
        const parts = mat.duration.split(':');
        totalMinutes += parseInt(parts[0], 10) || 0;
        if (parts[1]) {
          totalMinutes += (parseInt(parts[1], 10) || 0) / 60;
        }
      }
    }

    if (totalMinutes === 0) {
      this.totalDuration = '';
      return;
    }

    const hours = Math.floor(totalMinutes / 60);
    const mins = Math.round(totalMinutes % 60);
    if (hours > 0 && mins > 0) {
      this.totalDuration = `${hours}j ${mins}m`;
    } else if (hours > 0) {
      this.totalDuration = `${hours}j`;
    } else {
      this.totalDuration = `${mins}m`;
    }
  }

  doPurchase() {
    this.router.navigate(['/checkout', this.courseId]);
  }

  loadProgress() {
    this.apiService.getCourseProgress(this.courseId).subscribe({
      next: (res: any) => {
        this.zone.run(() => {
          if (res.success) {
            this.totalProgress = res.percentage || 0;
            // Ensure IDs are numbers for proper comparison with includes()
            this.completedMaterialIds = (res.completed_materials || []).map((id: any) => Number(id));
            console.log('[CourseDetail] completedMaterialIds:', this.completedMaterialIds);
            this.buildCurriculumLogic();
            this.cdr.detectChanges();
          }
        });
      },
      error: (err) => console.error('Failed to load progress', err)
    });
  }

  buildCurriculumLogic() {
    if (!this.course || !this.course.materials) return;

    const skillLevel = (this.course.skill_level || 'UMUM').toUpperCase();
    const isSequentialLock = (skillLevel === 'UMUM');
    
    console.log('[CourseDetail] buildCurriculumLogic - skillLevel:', skillLevel, 'isSequential:', isSequentialLock);
    console.log('[CourseDetail] completedMaterialIds:', this.completedMaterialIds);
    
    for (let i = 0; i < this.course.materials.length; i++) {
      const mat = this.course.materials[i];
      const matId = Number(mat.id);
      
      // Check completion status - use Number() to prevent type mismatch
      mat.isCompleted = this.completedMaterialIds.includes(matId);
      
      console.log(`[CourseDetail] Material[${i}] id=${matId}, isCompleted=${mat.isCompleted}`);
      
      if (!this.hasPurchased) {
        // Not purchased: all locked except first one shown as preview
        mat.isLocked = true;
        mat.isCompleted = false;
      } else if (!isSequentialLock) {
        // Non-sequential (SD/SMP/SMA/SMK): all unlocked, but show completion status
        mat.isLocked = false;
      } else {
        // Sequential (UMUM): unlock based on previous completion
        if (i === 0) {
          mat.isLocked = false;
        } else {
          const prevMat = this.course.materials[i - 1];
          mat.isLocked = !prevMat.isCompleted;
        }
      }
    }
    
    this.cdr.detectChanges();
  }

  goToMaterial(mat: any) {
    if (mat.isLocked) {
      console.log('Material locked');
      this.showCustomToast('Materi ini terkunci. Selesaikan materi sebelumnya terlebih dahulu.', 'warning');
      return;
    }
    this.navCtrl.navigateForward(`/tabs/course-detail/${this.course.id}/material/${mat.id}`);
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
