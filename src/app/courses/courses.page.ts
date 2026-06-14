import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  bookOutline, caretForwardOutline, timeOutline, listOutline,
  searchOutline, checkmarkCircle, trophyOutline, ribbonOutline,
  flameOutline, starOutline, lockClosedOutline, videocamOutline,
  documentTextOutline, helpCircleOutline
} from 'ionicons/icons';
import { HeaderComponent } from '../shared/components/header/header.component';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [IonicModule, CommonModule, HeaderComponent],
  templateUrl: './courses.page.html',
  styleUrls: ['./courses.page.scss']
})
export class CoursesPage {
  private apiService = inject(ApiService);
  private router = inject(Router);

  myCourses: any[] = [];
  isLoading: boolean = true;
  user: any = null;

  skillLevels: string[] = ['Semua', 'SD', 'SMP', 'SMA/SMK', 'UMUM'];
  activeSkillLevel: string = 'Semua';

  categories: string[] = ['Semua Kursus'];
  activeCategory: string = 'Semua Kursus';

  recentActivities: any[] = [];

  badges: any[] = [
    {
      icon: 'flame-outline',
      title: 'Semangat Membara',
      description: 'Selesaikan 3 kursus',
      color: '#ff6b35',
      bgColor: '#fff3ed',
      unlocked: false,
      progress: 0
    },
    {
      icon: 'trophy-outline',
      title: 'Pembelajar Hebat',
      description: 'Capai 100% pada 1 kursus',
      color: '#f5a623',
      bgColor: '#fef9ec',
      unlocked: false,
      progress: 0
    },
    {
      icon: 'ribbon-outline',
      title: 'Konsisten',
      description: 'Belajar 7 hari berturut-turut',
      color: '#673ab7',
      bgColor: '#f3eeff',
      unlocked: false,
      progress: 0
    },
    {
      icon: 'star-outline',
      title: 'Bintang Kuis',
      description: 'Selesaikan 5 kuis',
      color: '#00897b',
      bgColor: '#e8f5f2',
      unlocked: false,
      progress: 0
    }
  ];

  constructor() {
    addIcons({
      bookOutline, caretForwardOutline, timeOutline, listOutline,
      searchOutline, checkmarkCircle, trophyOutline, ribbonOutline,
      flameOutline, starOutline, lockClosedOutline, videocamOutline,
      documentTextOutline, helpCircleOutline
    });
  }

  ionViewWillEnter() {
    this.loadMyCourses();
    this.loadUser();
  }

  loadUser() {
    this.apiService.getUserProfile().subscribe({
      next: (res: any) => {
        if (res.success) this.user = res.data;
      },
      error: () => {}
    });
  }

  get displayName(): string {
    return this.user?.nickname || this.user?.name?.split(' ')[0] || 'Pelajar';
  }

  get motivationText(): string {
    if (this.myCourses.length === 0) {
      return 'Anda belum mengikuti kursus apapun. Yuk temukan kelas menarik dan mulai belajar!';
    }

    const totalCourses = this.myCourses.length;
    const completedCourses = this.myCourses.filter(c => c.progress === 100).length;
    const inProgressCourses = this.myCourses.filter(c => c.progress > 0 && c.progress < 100).length;
    const notStartedCourses = this.myCourses.filter(c => !c.progress || c.progress === 0).length;

    const totalProgress = this.myCourses.reduce((sum, c) => sum + (c.progress || 0), 0);
    const avgProgress = Math.round(totalProgress / totalCourses);

    if (completedCourses === totalCourses) {
      return `Luar biasa! Anda telah menyelesaikan seluruh ${totalCourses} kursus Anda dengan sempurna.`;
    } else if (inProgressCourses > 0) {
      return `Bagus sekali! Anda sedang mempelajari ${inProgressCourses} kursus dengan rata-rata progres ${avgProgress}%. Lanjutkan usahamu!`;
    } else if (notStartedCourses === totalCourses) {
      return `Anda terdaftar di ${totalCourses} kursus. Jangan tunda lagi, ayo mulai perjalanan belajarmu hari ini!`;
    } else {
      return `Anda memiliki total ${totalCourses} kursus. Terus pertahankan semangat belajar Anda untuk mencapai target!`;
    }
  }

  get overallProgress(): number {
    if (this.myCourses.length === 0) return 0;
    const total = this.myCourses.reduce((sum, c) => sum + (c.progress || 0), 0);
    return Math.round(total / this.myCourses.length);
  }

  get completedCoursesCount(): number {
    return this.myCourses.filter(c => c.progress === 100).length;
  }

  get totalMaterialsCompleted(): number {
    return this.myCourses.reduce((sum, item) => {
      const totalMats = item.course?.materials?.length || 0;
      const pct = item.progress || 0;
      return sum + Math.round((pct / 100) * totalMats);
    }, 0);
  }

  loadMyCourses() {
    this.isLoading = true;
    this.apiService.getMyCourses().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.myCourses = res.data;
          this.buildCategories();
          this.buildRecentActivities();
          this.updateBadgeProgress();
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load my courses', err);
        this.isLoading = false;
      }
    });
  }

  buildCategories() {
    if (this.activeSkillLevel !== 'Semua' && this.activeSkillLevel !== 'UMUM') {
      this.categories = ['Semua Kursus'];
      return;
    }

    let filteredForCat = this.myCourses;
    if (this.activeSkillLevel === 'UMUM') {
      filteredForCat = this.myCourses.filter(item => (item.course?.skill_level || 'UMUM') === 'UMUM');
    }
    const umumItems = filteredForCat.filter(item => (item.course?.skill_level || 'UMUM') === 'UMUM');
    const cats = umumItems
      .map((item: any) => item.course?.category)
      .filter(Boolean);
    const distinct = [...new Set(cats)] as string[];
    this.categories = distinct.length > 0 ? ['Semua Kursus', ...distinct] : ['Semua Kursus'];
  }

  buildRecentActivities() {
    this.recentActivities = [];

    for (const item of this.myCourses) {
      const course = item.course;
      if (!course || !course.materials) continue;

      const progress = item.progress || 0;
      const totalMaterials = course.materials.length;
      const completedCount = Math.round((progress / 100) * totalMaterials);

      if (progress === 100) {
        this.recentActivities.push({
          icon: 'checkmark-circle',
          iconClass: 'icon-green',
          title: `Kursus "${course.title}" selesai!`,
          subtitle: `${totalMaterials} materi • 100% selesai`,
          type: 'completed'
        });
      } else if (progress > 0) {
        const lastCompletedIdx = completedCount - 1;
        if (lastCompletedIdx >= 0 && course.materials[lastCompletedIdx]) {
          const mat = course.materials[lastCompletedIdx];
          const typeLabel = mat.type === 'video' ? 'Video' : mat.type === 'quiz' ? 'Kuis' : 'Modul';
          this.recentActivities.push({
            icon: mat.type === 'video' ? 'videocam-outline' : mat.type === 'quiz' ? 'help-circle-outline' : 'document-text-outline',
            iconClass: mat.type === 'video' ? 'icon-blue' : mat.type === 'quiz' ? 'icon-purple' : 'icon-pink',
            title: `${typeLabel}: ${mat.title}`,
            subtitle: `${course.title} • ${progress}% selesai`,
            type: 'progress'
          });
        }
      } else {
        this.recentActivities.push({
          icon: 'book-outline',
          iconClass: 'icon-orange',
          title: `Mulai belajar "${course.title}"`,
          subtitle: `${totalMaterials} materi tersedia`,
          type: 'new'
        });
      }
    }
  }

  updateBadgeProgress() {
    const completedCourses = this.myCourses.filter(c => c.progress === 100).length;
    const totalCourses = this.myCourses.length;

    this.badges[0].progress = Math.min(Math.round((completedCourses / 3) * 100), 100);
    this.badges[0].unlocked = completedCourses >= 3;

    this.badges[1].progress = completedCourses >= 1 ? 100 : (this.overallProgress || 0);
    this.badges[1].unlocked = completedCourses >= 1;

    this.badges[2].progress = Math.min(totalCourses * 15, 100);
    this.badges[2].unlocked = false;

    this.badges[3].progress = 0;
    this.badges[3].unlocked = false;
  }

  setActiveSkillLevel(level: string) {
    this.activeSkillLevel = level;
    this.activeCategory = 'Semua Kursus';
    this.buildCategories();
  }

  setActiveCategory(cat: string) {
    this.activeCategory = cat;
  }

  get filteredCourses(): any[] {
    let filtered = this.myCourses;

    if (this.activeSkillLevel !== 'Semua') {
      filtered = filtered.filter(item => (item.course?.skill_level || 'UMUM') === this.activeSkillLevel);
    }

    if (this.activeCategory !== 'Semua Kursus') {
      filtered = filtered.filter(item => item.course?.category === this.activeCategory);
    }
    
    return filtered;
  }

  goToCourseDetail(courseId: number) {
    this.router.navigate(['/tabs/course-detail', courseId]);
  }
}
