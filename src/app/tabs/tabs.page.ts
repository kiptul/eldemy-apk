import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { addIcons } from 'ionicons';
import {
  homeOutline, home,
  bookOutline, book,
  timeOutline, time,
  personOutline, person,
  compassOutline, compass,
  libraryOutline, library
} from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class TabsPage implements OnInit {
  private router = inject(Router);

  showTabBar = true;
  isSiswa = true; // default aman; dihitung ulang dari user tersimpan

  constructor() {
    addIcons({
      homeOutline, home,
      bookOutline, book,
      timeOutline, time,
      personOutline, person,
      compassOutline, compass,
      libraryOutline, library
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects || event.url;
      this.checkTabBarVisibility(url);
    });
  }

  ngOnInit() {
    const u = localStorage.getItem('user');
    const user = u ? JSON.parse(u) : null;
    this.isSiswa = user?.role === 'siswa';
    this.checkTabBarVisibility(this.router.url);
  }

  private checkTabBarVisibility(url: string) {
    // Hide tab bar on subpages/details
    const hideOnPaths = ['course-detail', 'kursus/', 'notifications', 'privacy', 'help'];
    this.showTabBar = !hideOnPaths.some(path => url.includes(path));
  }
}
