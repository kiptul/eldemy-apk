import { bootstrapApplication } from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';
import { importProvidersFrom, provideZoneChangeDetection, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeId from '@angular/common/locales/id';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

registerLocaleData(localeId);

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

import { provideHttpClient } from '@angular/common/http';
import { environment } from './environments/environment';

// Dev-only: di tab background, browser tidak pernah menjalankan requestAnimationFrame,
// sehingga task queue Stencil & transisi Ionic macet (halaman stuck ion-page-invisible,
// ionViewWillEnter tidak fire). Fallback ke setTimeout bila rAF tidak jalan.
if (!environment.production) {
  const nativeRaf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = (cb: FrameRequestCallback): number => {
    let done = false;
    const id = nativeRaf((t) => {
      if (!done) { done = true; cb(t); }
    });
    setTimeout(() => {
      if (!done) { done = true; cb(performance.now()); }
    }, 32);
    return id;
  };

  // Transisi Ionic bisa macet di tab background dan meninggalkan halaman
  // ber-kelas ion-page-invisible (opacity 0). Bersihkan supaya preview terlihat.
  const unstick = () => {
    document.querySelectorAll('.ion-page-invisible').forEach((el) => {
      const host = el as HTMLElement;
      if (host.closest('ion-router-outlet') && !host.hasAttribute('aria-hidden')) {
        host.classList.remove('ion-page-invisible');
      }
    });
  };
  setInterval(unstick, 500);
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    { provide: LOCALE_ID, useValue: 'id' },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // animated:false di dev — transisi rAF macet di tab background (preview),
    // bikin ionViewWillEnter tidak pernah fire
    importProvidersFrom(IonicModule.forRoot({ animated: environment.production })),
    provideRouter(routes, withPreloading(PreloadAllModules)),

    provideHttpClient(),
  ],
});
