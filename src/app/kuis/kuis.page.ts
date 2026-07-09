import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule, NavController } from "@ionic/angular";
import { ActivatedRoute } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { addIcons } from "ionicons";
import { chevronBackOutline, trophyOutline, closeCircle, refreshOutline } from "ionicons/icons";

@Component({
  selector: "app-kuis",
  templateUrl: "./kuis.page.html",
  styleUrls: ["./kuis.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class KuisPage {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private navCtrl = inject(NavController);
  private apiUrl = environment.apiUrl;
  private letters = ["A", "B", "C", "D"];

  quiz: any = null;
  isLoading = true;
  answers: { [k: number]: number } = {};
  showResult = false;
  result: any = null;
  isSubmitting = false;

  constructor() { addIcons({ chevronBackOutline, trophyOutline, closeCircle, refreshOutline }); }

  private headers() {
    const t = localStorage.getItem("token") || "";
    return { headers: new HttpHeaders({ Authorization: `Bearer ${t}`, Accept: "application/json", "Content-Type": "application/json" }) };
  }

  ionViewWillEnter() {
    const id = +(this.route.snapshot.paramMap.get("id") || 0);
    if (id) this.load(id);
  }

  load(id: number) {
    this.isLoading = true; this.showResult = false; this.answers = {};
    this.http.get(`${this.apiUrl}/kuis/${id}`, this.headers()).subscribe({
      next: (res: any) => { this.quiz = res.data; this.isLoading = false; },
      error: () => { this.isLoading = false; },
    });
  }

  pilih(qi: number, oi: number) { this.answers[qi] = oi; }
  isPilih(qi: number, oi: number) { return this.answers[qi] === oi; }
  get terjawab() { return Object.keys(this.answers).length; }

  submit() {
    if (this.terjawab < this.quiz.questions.length && !confirm("Masih ada soal yang belum dijawab. Kumpulkan sekarang?")) return;
    this.isSubmitting = true;
    const arr = this.quiz.questions.map((_: any, i: number) => this.answers[i] != null ? this.letters[this.answers[i]] : "");
    this.http.post(`${this.apiUrl}/quizzes/${this.quiz.id}/submit`, { answers: arr }, this.headers()).subscribe({
      next: (res: any) => { this.isSubmitting = false; this.result = res; this.showResult = true; },
      error: () => { this.isSubmitting = false; alert("Gagal mengirim kuis."); },
    });
  }

  ulangi() { this.load(this.quiz.id); }
  back() { this.navCtrl.back(); }
}
