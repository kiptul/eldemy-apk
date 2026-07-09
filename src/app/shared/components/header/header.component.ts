import { Component, OnInit, Input, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { addIcons } from 'ionicons';
import { chevronBackOutline, notificationsOutline } from 'ionicons/icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class HeaderComponent implements OnInit {
  private apiService = inject(ApiService);
  private location = inject(Location);
  private router = inject(Router);

  @Input() showBackButton: boolean = false;
  @Input() title: string = '';
  @Input() transparent: boolean = false;
  user: any = null;
  unreadNotifCount = 0;
  avatarFailed = false;
  avatarTimestamp = Date.now();

  constructor() {
    addIcons({ chevronBackOutline, notificationsOutline });
  }

  ngOnInit() {
    this.apiService.user$.subscribe(user => {
      if (user) {
        this.user = { ...user }; // Clone agar change detection bekerja
        this.avatarFailed = false;
        this.avatarTimestamp = Date.now();
      }
    });

    const token = localStorage.getItem('token');
    if (token && !this.user) {
      this.apiService.getUserProfile().subscribe();
    }

    // Fetch notification count
    if (localStorage.getItem('token')) {
      this.apiService.getNotifications().subscribe({
        next: (res: any) => {
          if (res.success) {
            this.unreadNotifCount = res.unread_count || 0;
          }
        },
        error: () => {} // Silently fail
      });
    }
  }

  get avatarUrl(): string {
    if (this.user?.avatar_url && !this.avatarFailed) {
      const url = this.user.avatar_url;
      const sep = url.includes('?') ? '&' : '?';
      return url + sep + '_t=' + this.avatarTimestamp;
    }
    const name = this.user?.nickname || this.user?.name || 'U';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=c92f6b&color=fff&size=64&bold=true&length=1`;
  }

  onAvatarError(event: Event) {
    this.avatarFailed = true;
    const name = this.user?.nickname || this.user?.name || 'U';
    (event.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=c92f6b&color=fff&size=64&bold=true&length=1`;
  }

  openNotifications() {
    this.router.navigate(['/tabs/profile/notifications']);
  }

  goBack() {
    this.location.back();
  }
}
