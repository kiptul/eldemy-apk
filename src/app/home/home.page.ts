import { Component, OnInit, ChangeDetectorRef, NgZone, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  searchOutline,
  optionsOutline,
  star,
  chevronForwardOutline,
  closeOutline,
} from 'ionicons/icons';
import { HeaderComponent } from '../shared/components/header/header.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HeaderComponent],
})
export class HomePage implements OnInit {
  private apiService = inject(ApiService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);

  courses: any[] = [];
  skillLevels: string[] = ['Semua', 'SD', 'SMP', 'SMA/SMK', 'UMUM'];
  activeSkillLevel: string = 'Semua';
  categories: string[] = ['Semua'];
  activeCategory: string = 'Semua';

  isFilterModalOpen = false;
  selectedCategories: string[] = [];
  selectedPriceRange: string = 'all';

  rekomendasiLimit = 3;

  searchQuery: string = '';
  appliedSearchQuery: string = '';
  searchMode: string = 'all';
  enablePayment = environment.enablePayment;

  constructor() {
    addIcons({
      searchOutline,
      optionsOutline,
      star,
      chevronForwardOutline,
      closeOutline,
    });
  }

  goToDetail(id: number) {
    this.router.navigate(['/tabs/course-detail', id]);
  }

  ngOnInit() {
    this.loadCourses();
  }

  applySearch() {
    this.appliedSearchQuery = this.searchQuery.trim().toLowerCase();
  }

  openFilterModal() {
    this.zone.run(() => {
      this.isFilterModalOpen = true;
      this.cdr.detectChanges();
    });
  }

  closeFilterModal() {
    this.zone.run(() => {
      this.isFilterModalOpen = false;
      this.cdr.detectChanges();
    });
  }

  toggleCategory(cat: string) {
    if (cat === 'Semua') {
      this.selectedCategories = [];
      return;
    }
    const index = this.selectedCategories.indexOf(cat);
    if (index > -1) {
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(cat);
    }
  }

  applyAdvancedFilter() {
    this.closeFilterModal();
  }

  resetFilter() {
    this.selectedCategories = [];
    this.selectedPriceRange = 'all';
    this.activeCategory = 'Semua';
    this.closeFilterModal();
  }

  get filteredList() {
    let filtered = this.courses;

    if (this.activeSkillLevel !== 'Semua') {
      filtered = filtered.filter(
        (c) => (c.skill_level || 'UMUM') === this.activeSkillLevel,
      );
    }

    if (this.appliedSearchQuery) {
      filtered = filtered.filter((c) => {
        const matchCourse =
          c.title?.toLowerCase().includes(this.appliedSearchQuery) ||
          c.description?.toLowerCase().includes(this.appliedSearchQuery);
        const matchInstructor = c.instructor?.name
          ?.toLowerCase()
          .includes(this.appliedSearchQuery);

        if (this.searchMode === 'course') return matchCourse;
        if (this.searchMode === 'instructor') return matchInstructor;
        return matchCourse || matchInstructor;
      });
    }

    if (this.activeCategory !== 'Semua') {
      filtered = filtered.filter((c) => c.category === this.activeCategory);
    }

    if (this.selectedCategories.length > 0) {
      filtered = filtered.filter((c) =>
        this.selectedCategories.includes(c.category),
      );
    }

    if (this.selectedPriceRange === 'under_20k') {
      filtered = filtered.filter((c) => c.base_price < 20000);
    } else if (this.selectedPriceRange === '20k_50k') {
      filtered = filtered.filter(
        (c) => c.base_price >= 20000 && c.base_price <= 50000,
      );
    } else if (this.selectedPriceRange === 'over_50k') {
      filtered = filtered.filter((c) => c.base_price > 50000);
    }

    return filtered;
  }

  get bestSellerCourse() {
    const sorted = [...this.filteredList].sort(
      (a, b) => (b.purchases_count || 0) - (a.purchases_count || 0),
    );
    return sorted.length > 0 ? sorted[0] : null;
  }

  get rilisBaru() {
    return this.filteredList.length > 1 ? this.filteredList[1] : null; // Atur manual supaya sinkron
  }

  get sedangTren() {
    return this.filteredList.length > 2 ? this.filteredList[2] : null;
  }

  get rekomendasiList() {
    return [...this.filteredList]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      .slice(0, this.rekomendasiLimit);
  }

  loadMoreRekomendasi() {
    this.rekomendasiLimit += 3;
  }

  setActiveSkillLevel(level: string) {
    this.activeSkillLevel = level;
    this.activeCategory = 'Semua'; 
    this.selectedCategories = []; 
    this.updateCategories();
  }

  setActiveCategory(cat: string) {
    this.activeCategory = cat;
  }

  updateCategories() {
    if (this.activeSkillLevel !== 'Semua' && this.activeSkillLevel !== 'UMUM') {
      this.categories = ['Semua'];
      return;
    }

    let filteredForCat = this.courses;
    if (this.activeSkillLevel === 'UMUM') {
      filteredForCat = this.courses.filter(
        (c) => (c.skill_level || 'UMUM') === 'UMUM',
      );
    }
    const umumCourses = filteredForCat.filter(
      (c) => (c.skill_level || 'UMUM') === 'UMUM',
    );
    const distinctCats = [
      ...new Set(umumCourses.map((c: any) => c.category).filter(Boolean)),
    ] as string[];
    this.categories =
      distinctCats.length > 0 ? ['Semua', ...distinctCats] : ['Semua'];
  }

  loadCourses() {
    this.apiService.getCourses().subscribe({
      next: (response) => {
        this.courses = response.data;
        this.updateCategories();
      },
      error: (err) => {
        console.error('Gagal mengambil data', err);
      },
    });
  }
}
