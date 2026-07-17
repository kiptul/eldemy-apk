import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowBackOutline, arrowForwardOutline, bulbOutline, schoolOutline, shieldCheckmarkOutline, sparklesOutline } from 'ionicons/icons';
import { AiTutorCharacterId } from '../services/api.service';

interface TutorCharacter {
  id: AiTutorCharacterId;
  name: string;
  tagline: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-ai-tutor',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './ai-tutor.page.html',
  styleUrls: ['./ai-tutor.page.scss'],
})
export class AiTutorPage {
  private router = inject(Router);

  characters: TutorCharacter[] = [
    {
      id: 'nara',
      name: 'Nara',
      tagline: 'Sahabat Belajar',
      description: 'Menjelaskan dengan hangat, memakai analogi sederhana, dan menemani kamu memahami konsep dari awal.',
      icon: 'bulb-outline',
    },
    {
      id: 'raka',
      name: 'Raka',
      tagline: 'Tutor Fokus',
      description: 'Membantu dengan langkah yang rapi, ringkas, dan pertanyaan kecil untuk menguji pemahamanmu.',
      icon: 'school-outline',
    },
  ];

  constructor() {
    addIcons({
      arrowBackOutline,
      arrowForwardOutline,
      bulbOutline,
      schoolOutline,
      shieldCheckmarkOutline,
      sparklesOutline,
    });
  }

  chooseTutor(characterId: AiTutorCharacterId) {
    this.router.navigate(['/tabs/ai-tutor/chat', characterId]);
  }

  goBack() {
    this.router.navigate(['/tabs/jelajah']);
  }
}
