import { Component, NgZone, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { App as CapApp } from '@capacitor/app';
import { Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [CommonModule, IonApp, IonRouterOutlet],
})
export class AppComponent {
  private router = inject(Router);
  private navCtrl = inject(NavController);
  private platform = inject(Platform);
  private zone = inject(NgZone);

  showExitPopup = false;

  constructor() {
    this.initializeApp();
  }

  initializeApp() {
    // Global hardware back button handler for Android
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.zone.run(() => {
        if (this.showExitPopup) {
          this.showExitPopup = false;
          return;
        }

        const url = this.router.url;

        const tabPages = [
          '/tabs/home',
          '/tabs/courses',
          '/tabs/history',
          '/tabs/profile'
        ];

        const isTabPage = tabPages.some(page => url === page || url === page + '/');

        if (isTabPage) {
          this.showExitPopup = true;
          return;
        }

        const exitPages = [
          '/login',
          '/register',
          '/welcome',
          '/splash',
          '/privacy-policy'
        ];

        const shouldExit = exitPages.some(page => {
          if (page === '/privacy-policy') {
            return url === '/privacy-policy' || url.startsWith('/privacy-policy?');
          }
          return url === page || url === page + '/';
        });

        if (shouldExit) {
          CapApp.exitApp();
        } else {
          this.navCtrl.back();
        }
      });
    });
  }

  confirmExit() {
    this.showExitPopup = false;
    CapApp.exitApp();
  }

  cancelExit() {
    this.showExitPopup = false;
  }
}