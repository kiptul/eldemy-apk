import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule, NavController, ToastController } from "@ionic/angular";
import { ActivatedRoute } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { addIcons } from "ionicons";
import { chevronBackOutline, calendarOutline, cloudUploadOutline, closeCircle, createOutline, documentTextOutline, linkOutline, timeOutline } from "ionicons/icons";

@Component({
  selector: "app-tugas-detail",
  templateUrl: "./tugas-detail.page.html",
  styleUrls: ["./tugas-detail.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class TugasDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private navCtrl = inject(NavController);
  private toastCtrl = inject(ToastController);
  private apiUrl = environment.apiUrl;

  tugas: any = null;
  pengumpulan: any = null;
  isLoading = true;
  isSubmitting = false;
  isEditing = false;

  kontenTeks = "";
  link = "";
  selectedFile: File | null = null;
  fileName = "";
  previewUrl: string | null = null;
  origSizeKb = 0;
  compSizeKb = 0;
  isDragging = false;

  constructor() { addIcons({ chevronBackOutline, calendarOutline, cloudUploadOutline, closeCircle, createOutline, documentTextOutline, linkOutline, timeOutline }); }

  private headers() {
    const t = localStorage.getItem("token") || "";
    return { headers: new HttpHeaders({ Authorization: `Bearer ${t}`, Accept: "application/json" }) };
  }

  private sudahDimuat = false;

  ngOnInit() { this.masukHalaman(); }

  ionViewWillEnter() { if (this.sudahDimuat) this.masukHalaman(); }

  private masukHalaman() {
    this.sudahDimuat = true;
    const id = +(this.route.snapshot.paramMap.get("id") || 0);
    if (id) this.load(id);
  }

  load(id: number) {
    this.isLoading = true;
    this.http.get(`${this.apiUrl}/tugas/${id}`, this.headers()).subscribe({
      next: (res: any) => {
        this.tugas = res.data;
        this.pengumpulan = res.pengumpulan;
        if (this.pengumpulan) { this.kontenTeks = this.pengumpulan.konten_teks || ""; this.link = this.pengumpulan.link || ""; }
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; },
    });
  }

  get windowStatus(): string {
    const now = Date.now();
    const buka = this.tugas?.buka_pengumpulan ? new Date(this.tugas.buka_pengumpulan).getTime() : null;
    const tutup = this.tugas?.tutup_pengumpulan ? new Date(this.tugas.tutup_pengumpulan).getTime() : null;
    if (buka && now < buka) return "belum";
    if (tutup && now > tutup) return "tutup";
    return "buka";
  }
  get bisaKumpul() { return this.windowStatus === "buka"; }
  get formMode() { return this.bisaKumpul && (!this.pengumpulan || this.isEditing); }
  get canEdit() { return this.bisaKumpul && !!this.pengumpulan && this.pengumpulan.nilai == null; }
  isImageFile(p: string) { return /\.(jpe?g|png|webp|gif)$/i.test(p || ""); }
  fileUrl(p: string) { return this.apiUrl.replace("/api", "") + "/" + p; }
  editJawaban() { this.isEditing = true; }
  batalEdit() { this.isEditing = false; this.clearFile(); }

  triggerFileInput() { document.getElementById("fileInput")?.click(); }
  onFileInput(ev: any) { const f = ev.target.files?.[0]; if (f) this.handleFile(f); }
  onDragOver(ev: DragEvent) { ev.preventDefault(); this.isDragging = true; }
  onDragLeave(ev: DragEvent) { ev.preventDefault(); this.isDragging = false; }
  onDrop(ev: DragEvent) { ev.preventDefault(); this.isDragging = false; const f = ev.dataTransfer?.files?.[0]; if (f) this.handleFile(f); }

  clearFile() {
    if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
    this.previewUrl = null; this.selectedFile = null; this.fileName = ""; this.origSizeKb = 0; this.compSizeKb = 0;
  }

  async handleFile(f: File) {
    this.fileName = f.name;
    this.origSizeKb = Math.round(f.size / 1024);
    if (this.previewUrl) { URL.revokeObjectURL(this.previewUrl); this.previewUrl = null; }
    if (f.type.startsWith("image/")) {
      const processed = await this.compressImage(f);
      this.selectedFile = processed;
      this.compSizeKb = Math.round(processed.size / 1024);
      this.previewUrl = URL.createObjectURL(processed);
    } else {
      this.selectedFile = f; this.compSizeKb = this.origSizeKb;
    }
  }

  compressImage(file: File): Promise<File> {
    return new Promise((resolve) => {
      const TWO_MB = 2 * 1024 * 1024;
      if (file.size <= TWO_MB) { resolve(file); return; }
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const maxW = 1600;
          let w = img.width, h = img.height;
          if (w > maxW) { h = Math.round(h * (maxW / w)); w = maxW; }
          const canvas = document.createElement("canvas");
          canvas.width = w; canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (ctx) ctx.drawImage(img, 0, 0, w, h);
          canvas.toBlob((blob) => {
            if (blob) resolve(new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" }));
            else resolve(file);
          }, "image/jpeg", 0.75);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });
  }

  private async toast(message: string, color: "success" | "danger" | "warning" = "success") {
    const t = await this.toastCtrl.create({ message, duration: 2500, color, position: "top" });
    t.present();
  }

  kumpul() {
    if (!this.kontenTeks && !this.link && !this.selectedFile) { this.toast("Isi teks, link, atau pilih file dulu.", "warning"); return; }
    this.isSubmitting = true;
    const fd = new FormData();
    if (this.kontenTeks) fd.append("konten_teks", this.kontenTeks);
    let lnk = this.link.trim();
    if (lnk && !/^https?:\/\//i.test(lnk)) lnk = "https://" + lnk;
    if (lnk) fd.append("link", lnk);
    if (this.selectedFile) fd.append("file", this.selectedFile);
    this.http.post(`${this.apiUrl}/tugas/${this.tugas.id}/kumpul`, fd, this.headers()).subscribe({
      next: (res: any) => { this.isSubmitting = false; this.pengumpulan = res.data; this.toast("Tugas berhasil dikumpulkan!"); this.navCtrl.back(); },
      error: (err: any) => { this.isSubmitting = false; this.toast(err?.error?.message || "Gagal mengumpulkan tugas.", "danger"); },
    });
  }

  back() { this.navCtrl.back(); }
}