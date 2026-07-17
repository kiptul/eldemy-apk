import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { Subject, throwError } from 'rxjs';
import { AiTutorResponse, ApiService } from '../services/api.service';
import { AiTutorChatPage } from './ai-tutor-chat.page';

describe('AiTutorChatPage', () => {
  let fixture: ComponentFixture<AiTutorChatPage>;
  let component: AiTutorChatPage;
  let apiService: jasmine.SpyObj<ApiService>;

  beforeEach(async () => {
    apiService = jasmine.createSpyObj<ApiService>('ApiService', ['sendAiTutorMessage']);

    await TestBed.configureTestingModule({
      imports: [AiTutorChatPage],
      providers: [
        { provide: ApiService, useValue: apiService },
        { provide: Router, useValue: jasmine.createSpyObj<Router>('Router', ['navigate']) },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ characterId: 'raka' }) } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AiTutorChatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn<any>(component, 'scrollToLatest').and.stub();
  });

  it('melepas loading dan mengaktifkan retry ketika API gagal', () => {
    apiService.sendAiTutorMessage.and.returnValue(throwError(() => ({
      error: { message: 'Layanan AI sedang tidak tersedia.' },
    })));
    component.inputMessage = 'Jelaskan fotosintesis.';

    component.sendMessage();

    expect(component.isSending).toBeFalse();
    expect(component.errorMessage).toBe('Layanan AI sedang tidak tersedia.');
    expect(component.lastAttempt).toBeDefined();
  });

  it('menampilkan loading lalu respons dan sisa quota', () => {
    const response$ = new Subject<AiTutorResponse>();
    apiService.sendAiTutorMessage.and.returnValue(response$);
    component.inputMessage = 'Jelaskan gravitasi.';

    component.sendMessage();
    expect(component.isSending).toBeTrue();

    response$.next({
      success: true,
      data: { reply: 'Ringkasan: Gravitasi adalah gaya tarik.', remaining_messages: 19 },
    });
    response$.complete();

    expect(component.isSending).toBeFalse();
    expect(component.remainingMessages).toBe(19);
    expect(component.messages[component.messages.length - 1]?.role).toBe('assistant');
  });

  it('menghapus percakapan lokal tanpa memanggil API', () => {
    component.messages = [
      { role: 'user', content: 'Pertanyaan' },
      { role: 'assistant', content: 'Jawaban' },
    ];
    component.errorMessage = 'Error lama';
    component.remainingMessages = 18;

    component.clearChat();

    expect(component.messages).toEqual([]);
    expect(component.errorMessage).toBe('');
    expect(component.remainingMessages).toBeNull();
    expect(apiService.sendAiTutorMessage).not.toHaveBeenCalled();
  });
});
