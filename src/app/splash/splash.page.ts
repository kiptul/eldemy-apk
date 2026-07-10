import { Component, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class SplashPage implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);


  ngOnInit() {
    this.navigateToNextScreen();
  }

  private navigateToNextScreen() {
    // Tampilkan splash screen selama 2.5 detik
    setTimeout(() => {
      // 1. Cek apakah privacy policy sudah pernah diterima di perangkat ini
      const privacyAccepted = localStorage.getItem('privacy_policy_accepted');
      if (privacyAccepted !== 'true') {
        // Pertama kali buka aplikasi setelah install → tampilkan privacy policy
        this.router.navigate(['/privacy-policy'], {
          queryParams: { onboarding: 'true' },
          replaceUrl: true
        });
        return;
      }

      // 2. Privacy sudah diterima, cek login state
      const isLogout = this.route.snapshot.queryParams['logout'] === 'true';
      const token = localStorage.getItem('token');

      if (isLogout) {
        // Baru saja logout → arahkan ke halaman login
        this.router.navigateByUrl('/login', { replaceUrl: true });
      } else if (token) {
        // Sudah login → siswa ke beranda, pengguna umum ke jelajah
        const u = localStorage.getItem('user');
        const role = u ? JSON.parse(u)?.role : null;
        const target = role === 'siswa' ? '/tabs/home' : '/tabs/jelajah';
        this.router.navigateByUrl(target, { replaceUrl: true });
      } else {
        // Belum login → halaman Welcome (Get Started)
        this.router.navigateByUrl('/welcome', { replaceUrl: true });
      }
    }, 2500);
  }
}

