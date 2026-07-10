import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { IonicModule, NavController } from "@ionic/angular";
import { addIcons } from "ionicons";
import { book, documentText, helpCircle } from "ionicons/icons";
import { ApiService } from "../services/api.service";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class HomePage implements OnInit {
  user: any = null;
  data: any = null;
  loading = true;
  error = false;
  isUmum = false;
  private sudahDimuat = false;

  constructor(private api: ApiService, private navCtrl: NavController, private router: Router) {
    addIcons({ book, documentText, helpCircle });
  }

  ngOnInit() {
    this.masuk();
  }

  ionViewWillEnter() {
    if (this.sudahDimuat) this.masuk();
  }

  private masuk() {
    this.sudahDimuat = true;
    const u = localStorage.getItem("user");
    if (u) this.user = JSON.parse(u);
    // Akun umum (marketplace) tidak punya tab Beranda — arahkan ke Jelajah
    this.isUmum = !!this.user && this.user.role !== "siswa";
    if (this.isUmum) {
      this.loading = false;
      this.router.navigate(["/tabs/jelajah"], { replaceUrl: true });
      return;
    }
    this.loadBeranda();
  }

  loadBeranda(refresher?: any) {
    if (!refresher) this.loading = true;
    this.error = false;
    this.api.getBeranda().subscribe({
      next: (res) => {
        if (res?.success) this.data = res.data;
        else this.error = true;
        this.loading = false;
        refresher?.target.complete();
      },
      error: () => {
        this.error = true;
        this.loading = false;
        refresher?.target.complete();
      },
    });
  }

  get greeting(): string {
    const h = new Date().getHours();
    if (h < 11) return "Selamat pagi";
    if (h < 15) return "Selamat siang";
    if (h < 18) return "Selamat sore";
    return "Selamat malam";
  }

  get nama(): string { return this.user?.name || "Siswa"; }

  get semuaBeres(): boolean {
    return !!this.data && this.data.tugas_belum === 0 && this.data.kuis_belum === 0;
  }

  /** Label tenggat: "Hari ini", "Besok", "3 hari lagi", "Lewat tenggat", dst. */
  deadlineLabel(t: any): string {
    if (t.belum_dibuka) {
      return "Buka " + this.tanggalPendek(t.buka_pengumpulan);
    }
    if (!t.deadline) return "Tanpa tenggat";
    const now = new Date();
    const dl = new Date(t.deadline);
    const awalHariIni = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const awalHariDl = new Date(dl.getFullYear(), dl.getMonth(), dl.getDate());
    const selisihHari = Math.round((awalHariDl.getTime() - awalHariIni.getTime()) / 86400000);
    if (dl.getTime() < now.getTime()) return "Lewat tenggat";
    if (selisihHari === 0) return "Hari ini";
    if (selisihHari === 1) return "Besok";
    if (selisihHari <= 7) return `${selisihHari} hari lagi`;
    return this.tanggalPendek(t.deadline);
  }

  /** Kelas urgensi untuk pewarnaan chip tenggat. */
  deadlineClass(t: any): string {
    if (t.belum_dibuka) return "chip-muted";
    if (!t.deadline) return "chip-muted";
    const now = new Date();
    const dl = new Date(t.deadline);
    const jam = (dl.getTime() - now.getTime()) / 3600000;
    if (jam < 24) return "chip-danger";
    if (jam < 72) return "chip-warn";
    return "chip-ok";
  }

  private tanggalPendek(iso: string): string {
    return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  }

  bukaTugas(t: any) { this.navCtrl.navigateForward(`/tabs/tugas-detail/${t.id}`); }
  bukaKuis(k: any) { this.navCtrl.navigateForward(`/tabs/kuis/${k.id}`); }
  keMapelku() { this.navCtrl.navigateForward("/tabs/courses"); }
}
