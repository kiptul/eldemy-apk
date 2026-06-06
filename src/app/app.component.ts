import { Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
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
  showExitPopup = false;

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private platform: Platform,
    private zone: NgZone
  ) {
    this.initializeApp();
  }

  initializeApp() {
    GoogleAuth.initialize({
      clientId:
        '928122069790-jh6uvrfqqn6hq6mlj40isk3j5os0e993.apps.googleusercontent.com',
      scopes: ['profile', 'email'],
      grantOfflineAccess: true,
    });

    // Global hardware back button handler for Android
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.zone.run(() => {
        // If exit popup is already showing, dismiss it
        if (this.showExitPopup) {
          this.showExitPopup = false;
          return;
        }

        const url = this.router.url;

        // Main tab pages: show exit confirmation popup
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

        // Exit pages: exit the app directly
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
          // Sub-pages: navigate back properly
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
