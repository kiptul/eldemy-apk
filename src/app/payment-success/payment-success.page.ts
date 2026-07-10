import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { addIcons } from 'ionicons';
import { checkmarkOutline, arrowForwardOutline, documentTextOutline, helpCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.page.html',
  styleUrls: ['./payment-success.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class PaymentSuccessPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiService = inject(ApiService);

  courseId: number = 0;
  course: any = null;
  user: any = null;
  currentDate: Date = new Date();
  orderId: string = '';

  constructor() {
    this.orderId = 'EC-' + Math.floor(10000000 + Math.random() * 90000000);
    addIcons({ checkmarkOutline, arrowForwardOutline, documentTextOutline, helpCircleOutline });
  }

  ngOnInit() {
    // Load User Profile
    this.apiService.getUserProfile().subscribe({
      next: (res: any) => { if (res.success) this.user = res.data; },
      error: () => {}
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.courseId = parseInt(idParam, 10);
      this.loadCourse();
    }
  }

  loadCourse() {
    this.apiService.getCourseDetail(this.courseId).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.course = res.data;
        }
      },
      error: (err) => {
        console.error('Failed to load course details', err);
      }
    });
  }

  goToMyCourses() {
    this.router.navigate(['/tabs/kursusku']);
  }
}
