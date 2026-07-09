import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule, NavController } from "@ionic/angular";
import { ActivatedRoute } from "@angular/router";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { ApiService } from "../services/api.service";
import { environment } from "../../environments/environment";
import { addIcons } from "ionicons";
import { chevronBackOutline, documentTextOutline, videocamOutline, expandOutline } from "ionicons/icons";

@Component({
  selector: "app-material-detail",
  templateUrl: "./material-detail.page.html",
  styleUrls: ["./material-detail.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class MaterialDetailPage {
  private route = inject(ActivatedRoute);
  private apiService = inject(ApiService);
  private navCtrl = inject(NavController);
  private sanitizer = inject(DomSanitizer);

  material: any = null;
  isLoading = true;
  safeVideoUrl: SafeResourceUrl | null = null;
  safePdfUrl: SafeResourceUrl | null = null;

  constructor() { addIcons({ chevronBackOutline, documentTextOutline, videocamOutline, expandOutline }); }

  ionViewWillEnter() {
    const courseId = +(this.route.snapshot.paramMap.get("courseId") || 0);
    const materialId = +(this.route.snapshot.paramMap.get("materialId") || 0);
    if (courseId && materialId) this.load(courseId, materialId);
  }

  load(courseId: number, materialId: number) {
    this.isLoading = true; this.safeVideoUrl = null; this.safePdfUrl = null;
    this.apiService.getMapelDetail(courseId).subscribe({
      next: (res: any) => {
        const mats = res.data?.materials || [];
        this.material = mats.find((m: any) => m.id === materialId) || null;
        const content = (this.material?.content || "");
        if (this.material?.type === "video") {
          this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.toEmbed(content));
        } else if (this.material?.type === "module" && content.toLowerCase().endsWith(".pdf")) {
          const b = environment.apiUrl.replace("/api", "");
          const url = content.startsWith("http") ? content : b + "/" + content;
          this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url + "#toolbar=0");
        }
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; },
    });
  }

  toEmbed(url: string): string {
    if (!url) return "";
    if (url.includes("youtube.com/embed/")) return url;
    let id = "";
    const w = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (w) id = w[1];
    if (!id) { const s = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/); if (s) id = s[1]; }
    return id ? `https://www.youtube.com/embed/${id}` : url;
  }

  openFullscreen() {
    const el: any = document.getElementById("pdfFrame");
    if (el && el.requestFullscreen) el.requestFullscreen();
  }

  back() { this.navCtrl.back(); }
}