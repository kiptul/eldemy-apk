import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Component({
  selector: "app-history",
  standalone: true,
  imports: [IonicModule, CommonModule],
  template: `
    <ion-header class="ion-no-border"><ion-toolbar><ion-title>Nilai</ion-title></ion-toolbar></ion-header>
    <ion-content class="page ion-padding">
      <div *ngIf="isLoading" class="loading">Memuat...</div>

      <div *ngIf="!isLoading">
        <div class="empty" *ngIf="kosong">Belum ada nilai.<br>Kerjakan tugas &amp; kuis dulu ya!</div>

        <div class="section" *ngIf="kuis.length">
          <h2>Kuis</h2>
          <div class="nilai-card" *ngFor="let k of kuis">
            <div class="info"><h3>{{ k.judul }}</h3><p>{{ k.mapel }}</p></div>
            <div class="skor" [class.bagus]="k.nilai >= 70">{{ k.nilai }}</div>
          </div>
        </div>

        <div class="section" *ngIf="tugas.length">
          <h2>Tugas</h2>
          <div class="nilai-card" *ngFor="let t of tugas">
            <div class="info"><h3>{{ t.judul }}</h3><p>{{ t.mapel }}</p></div>
            <div class="skor" *ngIf="t.nilai != null" [class.bagus]="t.nilai >= 70">{{ t.nilai }}</div>
            <div class="status" *ngIf="t.nilai == null">{{ t.status }}</div>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    ion-toolbar { --background: #fff; --color: #2b2b3a; ion-title { font-family: 'Outfit', sans-serif; font-weight: 800; } }
    .page { --background: #fdf8f0; font-family: 'Inter', sans-serif; }
    .loading, .empty { text-align: center; color: #999; padding: 40px 20px; line-height: 1.6; }
    .section { margin-bottom: 24px; h2 { font-size: 16px; font-weight: 700; color: #2b2b3a; margin: 0 0 12px; font-family: 'Outfit', sans-serif; } }
    .nilai-card { display: flex; align-items: center; gap: 12px; background: #fff; border: 1px solid #fce4ec; border-radius: 14px; padding: 14px; margin-bottom: 10px;
      .info { flex: 1; h3 { margin: 0 0 3px; font-size: 14px; font-weight: 600; color: #2b2b3a; } p { margin: 0; font-size: 12px; color: #999; } }
      .skor { font-size: 22px; font-weight: 800; font-family: 'Outfit', sans-serif; color: #e57373; &.bagus { color: #26a65b; } }
      .status { font-size: 12px; font-weight: 600; color: #b06a00; background: #fff6e5; padding: 4px 12px; border-radius: 20px; }
    }
  `]
})
export class HistoryPage {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  tugas: any[] = [];
  kuis: any[] = [];
  isLoading = true;

  private headers() {
    const t = localStorage.getItem("token") || "";
    return { headers: new HttpHeaders({ Authorization: `Bearer ${t}`, Accept: "application/json" }) };
  }

  ionViewWillEnter() { this.load(); }

  load() {
    this.isLoading = true;
    this.http.get(`${this.apiUrl}/nilai-saya`, this.headers()).subscribe({
      next: (res: any) => { this.tugas = res.tugas || []; this.kuis = res.kuis || []; this.isLoading = false; },
      error: () => { this.isLoading = false; },
    });
  }

  get kosong() { return this.tugas.length === 0 && this.kuis.length === 0; }
}
