import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { Router } from "@angular/router";
import { ApiService } from "../services/api.service";
import { addIcons } from "ionicons";
import { bookOutline, personOutline, chevronForwardOutline } from "ionicons/icons";

@Component({
  selector: "app-courses",
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: "./courses.page.html",
  styleUrls: ["./courses.page.scss"],
})
export class CoursesPage {
  kelas = "";
  mapelList: any[] = [];
  isLoading = true;
  constructor(private apiService: ApiService, private router: Router) {
    addIcons({ bookOutline, personOutline, chevronForwardOutline });
  }
  ionViewWillEnter() { this.loadMapel(); }
  loadMapel() {
    this.isLoading = true;
    this.apiService.getMapelSaya().subscribe({
      next: (res: any) => { this.mapelList = res.data || []; this.kelas = res.kelas || ""; this.isLoading = false; },
      error: () => { this.isLoading = false; },
    });
  }
  buka(mapel: any) { this.router.navigate(["/tabs/course-detail", mapel.id]); }
}