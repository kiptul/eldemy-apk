import { Component, OnInit, AfterViewInit, ElementRef, OnDestroy, ChangeDetectorRef, NgZone, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ApiService } from '../services/api.service';
import { environment } from '../../environments/environment';
import { addIcons } from 'ionicons';
import {
  chevronBack, checkmarkCircle, timeOutline, videocamOutline,
  documentTextOutline, playCircleOutline, checkmarkDoneOutline,
  downloadOutline, helpCircleOutline, arrowForwardOutline,
  ribbonOutline, bookOutline, closeOutline, arrowBackOutline,
  trophyOutline, refreshOutline, timerOutline, reloadOutline,
  closeCircle, shieldCheckmarkOutline, starOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-material-detail',
  templateUrl: './material-detail.page.html',
  styleUrls: ['./material-detail.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class MaterialDetailPage implements OnInit, AfterViewInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private apiService = inject(ApiService);
  private navCtrl = inject(NavController);
  private sanitizer = inject(DomSanitizer);
  private el = inject(ElementRef);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);

  courseId: number = 0;
  materialId: number = 0;
  material: any = null;
  course: any = null;
  safeVideoUrl: SafeResourceUrl | null = null;
  isVideoMp4: boolean = false;
  isLoading: boolean = true;
  isCompleting: boolean = false;

  // Parsed content from JSON
  parsedContent: any = null;
  videos: any[] = [];
  modules: any[] = [];
  selectedVideoIndex: number = 0;

  // For navigation context
  currentIndex: number = 0;
  totalMaterials: number = 0;

  // Quiz data (for inline section at bottom)
  quizInfo: any = null;
  quizLoading: boolean = false;

  // Quiz Active State (fullscreen modal)
  isQuizActive: boolean = false;
  quizQuestions: any[] = [];
  quizTitle: string = '';
  quizId: number = 0;
  quizDuration: number = 0;
  quizMinScore: number = 0;
  currentQuestionIndex: number = 0;
  selectedAnswers: { [key: number]: number } = {}; // Now stores option INDEX (0-3)
  answerStatus: { [key: number]: 'correct' | 'wrong' | null } = {};
  isSubmittingQuiz: boolean = false;
  isAutoAdvancing: boolean = false;

  // Timer
  timerSeconds: number = 0;
  timerDisplay: string = '00:00';
  private timerInterval: any = null;

  // Quiz Result
  showQuizResult: boolean = false;
  quizResultScore: number = 0;
  quizResultBestScore: number | null = null;
  quizResultCorrect: number = 0;
  quizResultTotal: number = 0;
  quizResultPassed: boolean = false;
  quizResultMessage: string = '';

  // Custom toast state
  toastMessage = '';
  toastType = '';
  toastVisible = false;
  private toastTimer: any = null;

  private readonly LETTER_MAP = ['A', 'B', 'C', 'D'];

  constructor() {
    addIcons({
      chevronBack, checkmarkCircle, timeOutline, videocamOutline,
      documentTextOutline, playCircleOutline, checkmarkDoneOutline,
      downloadOutline, helpCircleOutline, arrowForwardOutline,
      ribbonOutline, bookOutline, closeOutline, arrowBackOutline,
      trophyOutline, refreshOutline, timerOutline, reloadOutline,
      closeCircle, shieldCheckmarkOutline, starOutline
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.courseId = Number(params['courseId']) || 0;
      this.materialId = Number(params['materialId']) || 0;
      if (this.courseId && this.materialId) {
        this.loadMaterialData();
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const ionContent = this.el.nativeElement.querySelector('ion-content');
      if (ionContent && ionContent.shadowRoot) {
        const scrollEl = ionContent.shadowRoot.querySelector('.inner-scroll');
        if (scrollEl) (scrollEl as HTMLElement).style.contain = 'none';
        const mainEl = ionContent.shadowRoot.querySelector('.scroll-y');
        if (mainEl) (mainEl as HTMLElement).style.contain = 'none';
      }
      if (ionContent) ionContent.style.contain = 'none';
    }, 300);
  }

  ngOnDestroy() {
    this.clearTimer();
  }

  loadMaterialData() {
    this.apiService.getCourseDetail(this.courseId).subscribe({
      next: (res: any) => {
        this.course = res.data;
        if (this.course && this.course.materials) {
          this.totalMaterials = this.course.materials.length;
          const idx = this.course.materials.findIndex((m: any) => m.id === this.materialId);
          if (idx !== -1) {
            this.currentIndex = idx;
            this.material = this.course.materials[idx];
            this.parseContent();
            this.setupContent();
          }
        }
        this.isLoading = false;
        // Load quiz info for this material
        this.loadQuizInfo();
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  /** Parse the JSON content field into structured data */
  parseContent() {
    if (!this.material || !this.material.content) return;

    try {
      this.parsedContent = JSON.parse(this.material.content);
      
      // Handle videos
      if (this.parsedContent.videos) {
        this.videos = this.parsedContent.videos;
      } else if (this.parsedContent.video_url) {
        this.videos = [{ title: 'Video Utama', url: this.parsedContent.video_url }];
      }

      // Handle modules
      if (this.parsedContent.modules) {
        this.modules = this.parsedContent.modules;
      } else {
        const pdfPaths = this.parsedContent.pdf_paths || [];
        if (pdfPaths.length > 0) {
          this.modules = pdfPaths.map((path: string, i: number) => ({ title: 'Modul ' + (i+1), path: path }));
        } else if (this.parsedContent.pdf_path) {
          this.modules = [{ title: 'Modul Utama', path: this.parsedContent.pdf_path }];
        }
      }
    } catch (e) {
      // If it's not JSON, treat it as plain text/html
      this.parsedContent = {
        description: this.material.content,
      };
    }
  }

  selectVideo(index: number) {
    this.selectedVideoIndex = index;
    this.setupContent();
  }

  /** Get the proper video URL from parsed content */
  getVideoUrl(): string {
    if (this.videos.length > 0) return this.videos[this.selectedVideoIndex].url;
    return '';
  }

  /** Check if this material has PDF files */
  hasModules(): boolean {
    return this.modules.length > 0;
  }

  /** Get the description text */
  getDescription(): string {
    return this.parsedContent?.description || '';
  }

  /** Open specific PDF */
  downloadSpecificPdf(path: string) {
    if (!path) return;
    const baseUrl = environment.apiUrl.replace('/api', '');
    const url = `${baseUrl}/storage/${path}`;
    window.open(url, '_blank');
  }

  /** Backward compatibility */
  downloadPdf() {
    if (this.modules.length > 0) {
      this.downloadSpecificPdf(this.modules[0].path);
    }
  }

  loadQuizInfo() {
    this.quizLoading = true;
    this.apiService.getQuizByMaterial(this.materialId).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.quizInfo = res.data;
        }
        this.quizLoading = false;
      },
      error: () => {
        this.quizInfo = null;
        this.quizLoading = false;
      }
    });
  }

  private convertToEmbedUrl(url: string): string {
    if (!url) return '';
    if (url.includes('youtube.com/embed/')) return url;
    let videoId = '';
    const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (watchMatch) videoId = watchMatch[1];
    if (!videoId) {
      const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
      if (shortMatch) videoId = shortMatch[1];
    }
    if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    return url;
  }

  setupContent() {
    if (this.material.type === 'video') {
      const videoUrl = this.getVideoUrl();
      if (videoUrl.toLowerCase().endsWith('.mp4') || videoUrl.toLowerCase().endsWith('.webm')) {
        this.isVideoMp4 = true;
      } else {
        this.isVideoMp4 = false;
        const embedUrl = this.convertToEmbedUrl(videoUrl);
        this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
      }
    }
  }

  goBack() {
    this.navCtrl.back();
  }


  startQuiz() {
    if (!this.quizInfo) return;

    this.quizQuestions = this.quizInfo.questions || [];
    this.quizTitle = this.quizInfo.title;
    this.quizId = this.quizInfo.id;
    this.quizDuration = this.quizInfo.duration || 0;
    this.quizMinScore = this.quizInfo.min_score || 0;
    this.currentQuestionIndex = 0;
    this.selectedAnswers = {};
    this.answerStatus = {};
    this.showQuizResult = false;
    this.isQuizActive = true;
    this.isAutoAdvancing = false;

    if (this.quizDuration > 0) {
      this.timerSeconds = this.quizDuration * 60;
    } else {
      this.timerSeconds = 0; 
    }
    this.updateTimerDisplay();
    this.startTimer();
  }

  startTimer() {
    this.clearTimer();
    this.timerInterval = setInterval(() => {
      if (this.quizDuration > 0) {
        this.timerSeconds--;
        if (this.timerSeconds <= 0) {
          this.timerSeconds = 0;
          this.clearTimer();
          this.submitQuiz(); 
        }
      } else {
        this.timerSeconds++;
      }
      this.updateTimerDisplay();
    }, 1000);
  }

  clearTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  updateTimerDisplay() {
    const mins = Math.floor(this.timerSeconds / 60);
    const secs = this.timerSeconds % 60;
    this.timerDisplay = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  get isTimerWarning(): boolean {
    return this.quizDuration > 0 && this.timerSeconds <= 60;
  }

  selectAnswer(questionIndex: number, optionIndex: number) {
    if (this.answerStatus[questionIndex]) return; 
    if (this.isAutoAdvancing) return;

    this.selectedAnswers[questionIndex] = optionIndex;
    const currentQ = this.quizQuestions[questionIndex];

    const correctValue = currentQ.correct_answer;
    const selectedLetter = this.LETTER_MAP[optionIndex];
    const selectedText = currentQ.options[optionIndex];

    if (selectedLetter === correctValue || selectedText === correctValue) {
      this.answerStatus[questionIndex] = 'correct';
    } else {
      this.answerStatus[questionIndex] = 'wrong';
    }

    // Auto advance after short delay
    this.isAutoAdvancing = true;
    setTimeout(() => {
      this.isAutoAdvancing = false;
      if (questionIndex < this.quizQuestions.length - 1) {
        this.goToQuestion(questionIndex + 1);
      } else {
        this.submitQuiz();
      }
    }, 1800);
  }

  isSelected(questionIndex: number, optionIndex: number): boolean {
    return this.selectedAnswers[questionIndex] === optionIndex;
  }

  /** Check if this option is the correct answer */
  isCorrectOption(questionIndex: number, optionIndex: number): boolean {
    if (this.answerStatus[questionIndex] === undefined || this.answerStatus[questionIndex] === null) return false;
    const q = this.quizQuestions[questionIndex];
    const correctValue = q.correct_answer;
    const currentLetter = this.LETTER_MAP[optionIndex];
    const currentText = q.options[optionIndex];
    return currentLetter === correctValue || currentText === correctValue;
  }

  getCorrectAnswerText(questionIndex: number): string {
    const q = this.quizQuestions[questionIndex];
    if (!q) return '';
    const correctValue = q.correct_answer;
    if (this.LETTER_MAP.includes(correctValue)) {
      const idx = this.LETTER_MAP.indexOf(correctValue);
      return q.options[idx] || correctValue;
    }
    return correctValue;
  }

  /** Check if this specific option was selected and is wrong */
  isWrongSelected(questionIndex: number, optionIndex: number): boolean {
    return this.isSelected(questionIndex, optionIndex) && this.answerStatus[questionIndex] === 'wrong';
  }

  goToQuestion(index: number) {
    if (index >= 0 && index < this.quizQuestions.length) {
      this.currentQuestionIndex = index;
    }
  }

  get answeredCount(): number {
    return Object.keys(this.selectedAnswers).length;
  }

  get progressPercent(): number {
    if (this.quizQuestions.length === 0) return 0;
    return (this.answeredCount / this.quizQuestions.length) * 100;
  }

  closeQuiz() {
    this.clearTimer();
    this.isQuizActive = false;
    this.showQuizResult = false;
  }

  submitQuiz() {
    if (this.isSubmittingQuiz) return;
    this.isSubmittingQuiz = true;
    this.clearTimer();

    const answersArray: string[] = [];
    for (let i = 0; i < this.quizQuestions.length; i++) {
      if (this.selectedAnswers[i] !== undefined) {
        answersArray.push(this.LETTER_MAP[this.selectedAnswers[i]]);
      } else {
        answersArray.push('');
      }
    }

    this.apiService.submitQuiz(this.quizId, answersArray).subscribe({
      next: (res: any) => {
        this.isSubmittingQuiz = false;
        if (res.success) {
          this.quizResultScore = res.score;
          this.quizResultBestScore = res.best_score;
          this.quizResultCorrect = res.correct_count;
          this.quizResultTotal = res.total_questions;
          this.quizResultPassed = res.passed;
          this.quizResultMessage = res.message;
          this.showQuizResult = true;

          if (this.quizInfo) {
            this.quizInfo.best_score = res.best_score;
            this.loadQuizInfo();
          }
        }
      },
      error: (err) => {
        this.isSubmittingQuiz = false;
        this.showCustomToast('Gagal mengirim kuis. Coba lagi.', 'error');
      }
    });
  }

  retryQuiz() {
    this.showQuizResult = false;
    this.currentQuestionIndex = 0;
    this.selectedAnswers = {};
    this.answerStatus = {};
    this.isAutoAdvancing = false;
    if (this.quizDuration > 0) {
      this.timerSeconds = this.quizDuration * 60;
    } else {
      this.timerSeconds = 0;
    }
    this.updateTimerDisplay();
    this.startTimer();
  }

  async markComplete() {
    if (this.quizInfo && this.quizInfo.min_score > 0) {
      const bestScore = this.quizInfo.best_score || 0;
      if (bestScore < this.quizInfo.min_score) {
        // Use custom toast instead of broken AlertController
        this.showCustomToast(`Nilai kuis Anda (${bestScore}%) belum memenuhi batas minimum (${this.quizInfo.min_score}%). Kerjakan kuis terlebih dahulu.`, 'warning');
        return;
      }
    }

    if (this.isCompleting) return;
    this.isCompleting = true;
    this.cdr.detectChanges();

    this.apiService.markMaterialAsCompleted(this.materialId).subscribe({
      next: (res: any) => {
        this.zone.run(() => {
          this.isCompleting = false;
          this.cdr.detectChanges();
          if (res.success) {
            this.showCustomToast('🎉 Materi selesai! Kembali ke kurikulum...', 'success');
            this.navCtrl.navigateBack(`/tabs/course-detail/${this.courseId}`);
          }
        });
      },
      error: (err) => {
        this.zone.run(() => {
          this.isCompleting = false;
          this.cdr.detectChanges();
          this.showCustomToast('Gagal menandai selesai. Coba lagi.', 'error');
        });
      }
    });
  }

  showCustomToast(msg: string, type: string = 'info') {
    this.zone.run(() => {
      this.toastMessage = msg;
      this.toastType = type;
      this.toastVisible = true;
      this.cdr.detectChanges();
      if (this.toastTimer) clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => {
        this.toastVisible = false;
        this.cdr.detectChanges();
      }, 3500);
    });
  }
}
