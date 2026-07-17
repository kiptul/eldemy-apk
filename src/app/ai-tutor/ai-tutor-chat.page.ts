import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { addIcons } from 'ionicons';
import { alertCircleOutline, arrowBackOutline, chatbubbleEllipsesOutline, refreshOutline, send, sparklesOutline, trashOutline } from 'ionicons/icons';
import { AiTutorCharacterId, AiTutorMessage, ApiService } from '../services/api.service';

interface TutorProfile {
  name: string;
  tagline: string;
}

@Component({
  selector: 'app-ai-tutor-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './ai-tutor-chat.page.html',
  styleUrls: ['./ai-tutor-chat.page.scss'],
})
export class AiTutorChatPage implements OnInit {
  @ViewChild(IonContent) private content?: IonContent;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiService = inject(ApiService);

  characterId: AiTutorCharacterId = 'nara';
  messages: AiTutorMessage[] = [];
  inputMessage = '';
  isSending = false;
  errorMessage = '';
  remainingMessages: number | null = null;
  lastAttempt?: { message: string; history: AiTutorMessage[] };

  readonly tutors: Record<AiTutorCharacterId, TutorProfile> = {
    nara: { name: 'Nara', tagline: 'Sahabat Belajar' },
    raka: { name: 'Raka', tagline: 'Tutor Fokus' },
  };

  constructor() {
    addIcons({
      alertCircleOutline,
      arrowBackOutline,
      chatbubbleEllipsesOutline,
      refreshOutline,
      send,
      sparklesOutline,
      trashOutline,
    });
  }

  ngOnInit() {
    const requestedCharacter = this.route.snapshot.paramMap.get('characterId');
    if (requestedCharacter === 'nara' || requestedCharacter === 'raka') {
      this.characterId = requestedCharacter;
      return;
    }

    this.router.navigate(['/tabs/ai-tutor']);
  }

  get tutor(): TutorProfile {
    return this.tutors[this.characterId];
  }

  sendMessage() {
    const message = this.inputMessage.trim();
    if (!message || this.isSending) return;

    const history = this.messages.slice(-4);
    this.messages = [...this.messages, { role: 'user', content: message }];
    this.inputMessage = '';
    this.lastAttempt = { message, history };
    this.scrollToLatest();
    this.requestReply(message, history);
  }

  retryLastMessage() {
    if (!this.lastAttempt || this.isSending) return;
    this.requestReply(this.lastAttempt.message, this.lastAttempt.history);
  }

  clearChat() {
    if (this.isSending) return;
    this.messages = [];
    this.errorMessage = '';
    this.lastAttempt = undefined;
    this.remainingMessages = null;
    this.scrollToLatest();
  }

  goBack() {
    this.router.navigate(['/tabs/ai-tutor']);
  }

  private requestReply(message: string, history: AiTutorMessage[]) {
    this.errorMessage = '';
    this.isSending = true;

    this.apiService.sendAiTutorMessage(this.characterId, message, history)
      .pipe(finalize(() => {
        this.isSending = false;
      }))
      .subscribe({
      next: (response) => {
        if (!response.success || !response.data?.reply) {
          this.errorMessage = 'AI Tutor belum dapat memberi jawaban. Silakan coba lagi.';
          return;
        }

        this.messages = [...this.messages, { role: 'assistant', content: response.data.reply }];
        this.remainingMessages = response.data.remaining_messages;
        this.lastAttempt = undefined;
        this.scrollToLatest();
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Koneksi ke AI Tutor gagal. Periksa internetmu lalu coba lagi.';
      },
    });
  }

  private scrollToLatest() {
    setTimeout(() => this.content?.scrollToBottom(220));
  }
}
