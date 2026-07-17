import { Component, ChangeDetectorRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  bookOutline, searchOutline, peopleOutline, pricetagOutline,
  compassOutline, alertCircleOutline, closeCircle,
  sparklesOutline, arrowForwardOutline
} from 'ionicons/icons';
import { HeaderComponent } from '../shared/components/header/header.component';

@Component({
  selector: 'app-jelajah',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HeaderComponent],
  templateUrl: './courses.page.html',
  styleUrls: ['./courses.page.scss']
})
export class JelajahPage implements OnInit {
  private apiService = inject(ApiService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  courses: any[] = [];
  isLoading = true;
  hasError = false;

  searchQuery = '';
  skillLevels: string[] = ['Semua', 'SD', 'SMP', 'SMA/SMK', 'UMUM'];
  activeSkillLevel = 'Semua';
  categories: string[] = ['Semua'];
  activeCategory = 'Semua';

  constructor() {
    addIcons({
      bookOutline, searchOutline, peopleOutline, pricetagOutline,
      compassOutline, alertCircleOutline, closeCircle,
      sparklesOutline, arrowForwardOutline
    });
  }

  // ngOnInit sebagai pemuat awal (lifecycle Ionic bisa tidak fire di webview
  // tertentu); ionViewWillEnter menyegarkan data saat kembali ke tab ini.
  ngOnInit() {
    this.loadCourses();
  }

  ionViewWillEnter() {
    if (!this.isLoading) this.loadCourses();
  }

  loadCourses(event?: any) {
    if (!event) this.isLoading = true;
    this.hasError = false;
    this.apiService.getCourses().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.courses = res.data || [];
          this.buildCategories();
        }
        this.isLoading = false;
        event?.target?.complete();
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.hasError = true;
        event?.target?.complete();
        this.cdr.detectChanges();
      }
    });
  }

  buildCategories() {
    const cats = this.courses.map(c => c.category).filter(Boolean);
    this.categories = ['Semua', ...[...new Set(cats)] as string[]];
    if (!this.categories.includes(this.activeCategory)) {
      this.activeCategory = 'Semua';
    }
  }

  setSkillLevel(level: string) {
    this.activeSkillLevel = level;
  }

  setCategory(cat: string) {
    this.activeCategory = cat;
  }

  clearSearch() {
    this.searchQuery = '';
  }

  openAiTutor() {
    this.router.navigate(['/tabs/ai-tutor']);
  }

  get filteredCourses(): any[] {
    let list = this.courses;
    if (this.activeSkillLevel !== 'Semua') {
      list = list.filter(c => (c.skill_level || 'UMUM') === this.activeSkillLevel);
    }
    if (this.activeCategory !== 'Semua') {
      list = list.filter(c => c.category === this.activeCategory);
    }
    const q = this.searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(c =>
        (c.title || '').toLowerCase().includes(q) ||
        (c.category || '').toLowerCase().includes(q) ||
        (c.instructor?.name || '').toLowerCase().includes(q)
      );
    }
    return list;
  }

  formatPrice(price: number): string {
    if (!price || price <= 0) return 'Gratis';
    return 'Rp ' + Number(price).toLocaleString('id-ID');
  }

  goToDetail(courseId: number) {
    this.router.navigate(['/tabs/kursus', courseId]);
  }
}
