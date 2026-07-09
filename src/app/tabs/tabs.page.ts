import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonTabs, IonTabBar, IonTabButton, IonIcon } from '@ionic/angular/standalone';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { addIcons } from 'ionicons';
import {
  homeOutline, home,
  bookOutline, book,
  timeOutline, time,
  personOutline, person
} from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, CommonModule]
})
export class TabsPage implements OnInit {
  private router = inject(Router);

  showTabBar = true;

  constructor() {
    addIcons({
      homeOutline, home,
      bookOutline, book,
      timeOutline, time,
      personOutline, person
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects || event.url;
      this.checkTabBarVisibility(url);
    });
  }

  ngOnInit() {
    this.checkTabBarVisibility(this.router.url);
  }

  private checkTabBarVisibility(url: string) {
    // Hide tab bar on subpages/details
    const hideOnPaths = ['course-detail', 'notifications', 'privacy', 'help'];
    this.showTabBar = !hideOnPaths.some(path => url.includes(path));
  }
}
