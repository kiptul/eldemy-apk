import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule, ToastController } from "@ionic/angular";
import { Router } from "@angular/router";
import { ApiService } from "../services/api.service";
import { addIcons } from "ionicons";
import { keyOutline, logOutOutline, schoolOutline, idCardOutline, mailOutline } from "ionicons/icons";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  template: `
    <ion-content class="page">
      <div class="header">
        <div class="avatar">{{ inisial }}</div>
        <h2>{{ user?.name || 'Pengguna' }}</h2>
        <span class="role">{{ roleLabel }}</span>
      </div>

      <div class="info-card" *ngIf="isSiswa">
        <div class="info-row">
          <ion-icon name="id-card-outline"></ion-icon>
          <div><label>NIS</label><p>{{ user?.nis || '-' }}</p></div>
        </div>
        <div class="info-row">
          <ion-icon name="school-outline"></ion-icon>
          <div><label>Kelas</label><p>{{ user?.kelas?.nama || '-' }}<span *ngIf="user?.kelas?.jurusan"> &middot; {{ user?.kelas?.jurusan?.nama }}</span></p></div>
        </div>
      </div>

      <div class="info-card" *ngIf="!isSiswa">
        <div class="info-row">
          <ion-icon name="mail-outline"></ion-icon>
          <div><label>Email</label><p>{{ user?.email || '-' }}</p></div>
        </div>
      </div>

      <div class="menu">
        <div class="menu-item" (click)="showGantiPw = !showGantiPw">
          <div class="ic pink"><ion-icon name="key-outline"></ion-icon></div>
          <span>Ganti Kata Sandi</span>
        </div>

        <div class="pw-form" *ngIf="showGantiPw">
          <input type="password" [(ngModel)]="currentPw" placeholder="Kata sandi lama" />
          <input type="password" [(ngModel)]="newPw" placeholder="Kata sandi baru (min 6 karakter)" />
          <button (click)="gantiPassword()" [disabled]="isSaving">{{ isSaving ? 'Menyimpan...' : 'Simpan' }}</button>
        </div>

        <div class="menu-item danger" (click)="logout()">
          <div class="ic red"><ion-icon name="log-out-outline"></ion-icon></div>
          <span>Keluar</span>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    .page { --background: #fdf8f0; font-family: 'Inter', sans-serif; }
    .header { text-align: center; padding: 44px 20px 26px; background: #fff; border-radius: 0 0 28px 28px;
      .avatar { width: 84px; height: 84px; margin: 0 auto 14px; border-radius: 50%; background: linear-gradient(135deg, #F06292, #c92f6b); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 34px; font-weight: 800; font-family: 'Outfit', sans-serif; box-shadow: 0 6px 18px rgba(240,98,146,.3); }
      h2 { margin: 0 0 6px; font-size: 20px; font-weight: 800; color: #2b2b3a; font-family: 'Outfit', sans-serif; }
      .role { background: #fce4ec; color: #c92f6b; padding: 4px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; }
    }
    .info-card { margin: 20px 16px; background: #fff; border: 1px solid #fce4ec; border-radius: 16px; overflow: hidden;
      .info-row { display: flex; align-items: center; gap: 14px; padding: 15px; border-bottom: 1px solid #fdf0f5;
        &:last-child { border-bottom: 0; }
        ion-icon { font-size: 22px; color: #F06292; }
        label { font-size: 11.5px; color: #999; display: block; }
        p { margin: 2px 0 0; font-size: 15px; font-weight: 600; color: #2b2b3a; }
      }
    }
    .menu { margin: 0 16px 30px; display: flex; flex-direction: column; gap: 12px;
      .menu-item { display: flex; align-items: center; gap: 14px; background: #fff; border: 1px solid #fce4ec; border-radius: 16px; padding: 15px; cursor: pointer;
        .ic { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px;
          &.pink { background: #fce4ec; color: #F06292; } &.red { background: #ffeaea; color: #e53935; } }
        span { flex: 1; font-weight: 600; font-size: 14.5px; color: #2b2b3a; }
        &.danger span { color: #e53935; }
      }
      .pw-form { background: #fff; border: 1px solid #fce4ec; border-radius: 16px; padding: 14px; display: flex; flex-direction: column; gap: 10px;
        input { border: 1px solid #fce4ec; border-radius: 10px; padding: 11px; font-size: 14px; font-family: 'Inter', sans-serif; }
        button { background: linear-gradient(135deg, #F06292, #c92f6b); color: #fff; border: 0; border-radius: 10px; padding: 12px; font-weight: 700; font-family: 'Outfit', sans-serif; &:disabled { opacity: .6; } }
      }
    }
  `]
})
export class ProfilePage {
  private apiService = inject(ApiService);
  private router = inject(Router);
  private toastCtrl = inject(ToastController);

  user: any = null;
  showGantiPw = false;
  currentPw = "";
  newPw = "";
  isSaving = false;

  constructor() {
    addIcons({ keyOutline, logOutOutline, schoolOutline, idCardOutline, mailOutline });
    const u = localStorage.getItem("user");
    if (u) this.user = JSON.parse(u);
  }

  get inisial() { return (this.user?.name || "P").charAt(0).toUpperCase(); }

  get isSiswa() { return this.user?.role === "siswa"; }

  get roleLabel(): string {
    const labels: Record<string, string> = {
      siswa: "Siswa",
      student: "Pengguna",
      instructor: "Instruktur",
      guru: "Guru",
      admin: "Admin",
    };
    return labels[this.user?.role] || "Pengguna";
  }

  async toast(msg: string, color = "success") {
    const t = await this.toastCtrl.create({ message: msg, duration: 2000, color, position: "top" });
    t.present();
  }

  gantiPassword() {
    if (!this.currentPw || !this.newPw) { this.toast("Isi kata sandi lama & baru.", "danger"); return; }
    if (this.newPw.length < 6) { this.toast("Kata sandi baru minimal 6 karakter.", "danger"); return; }
    this.isSaving = true;
    this.apiService.changePassword(this.currentPw, this.newPw).subscribe({
      next: () => { this.isSaving = false; this.showGantiPw = false; this.currentPw = ""; this.newPw = ""; this.toast("Kata sandi berhasil diubah!"); },
      error: (err: any) => { this.isSaving = false; this.toast(err?.error?.message || "Gagal ubah kata sandi.", "danger"); },
    });
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.router.navigate(["/welcome"], { replaceUrl: true });
  }
}
