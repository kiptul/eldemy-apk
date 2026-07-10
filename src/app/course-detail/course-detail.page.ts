import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule, NavController } from "@ionic/angular";
import { ActivatedRoute } from "@angular/router";
import { ApiService } from "../services/api.service";
import { addIcons } from "ionicons";
import { documentTextOutline, videocamOutline, helpCircleOutline, personOutline, timeOutline, chevronBackOutline, clipboardOutline, calendarOutline } from "ionicons/icons";

@Component({
  selector: "app-course-detail",
  templateUrl: "./course-detail.page.html",
  styleUrls: ["./course-detail.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class CourseDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private apiService = inject(ApiService);
  private navCtrl = inject(NavController);

  course: any = null;
  isLoading = true;

  constructor() {
    addIcons({ documentTextOutline, videocamOutline, helpCircleOutline, personOutline, timeOutline, chevronBackOutline, clipboardOutline, calendarOutline });
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
    this.apiService.getMapelDetail(id).subscribe({
      next: (res: any) => { this.course = res.data; this.isLoading = false; },
      error: () => { this.isLoading = false; },
    });
  }

  get materiList() { return (this.course?.materials || []).filter((m: any) => m.type === "module" || m.type === "video"); }
  get tugasList() { return this.course?.tugas || []; }
  get kuisList() { return this.course?.quizzes || []; }

  bukaMateri(mat: any) { this.navCtrl.navigateForward(`/tabs/course-detail/${this.course.id}/material/${mat.id}`); }
  bukaTugas(t: any) { this.navCtrl.navigateForward(`/tabs/tugas-detail/${t.id}`); }
  bukaKuis(k: any) { this.navCtrl.navigateForward(`/tabs/kuis/${k.id}`); }
  back() { this.navCtrl.back(); }
}