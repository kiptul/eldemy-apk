import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);

  private apiUrl = environment.apiUrl;
  private userSubject = new BehaviorSubject<any>(null);
  public user$ = this.userSubject.asObservable();

  private getHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token') || '';
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }),
    };
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }, {
      headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
    });
  }

  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { name, email, password }, {
      headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
    });
  }

  googleLogin(tokens: { accessToken?: string; idToken?: string }): Observable<any> {
    const payload: any = {};
    if (tokens.accessToken) payload.access_token = tokens.accessToken;
    if (tokens.idToken) payload.id_token = tokens.idToken;

    return this.http.post(`${this.apiUrl}/auth/google`, payload, {
      headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
    });
  }

  getUserProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user`, this.getHeaders()).pipe(
      tap((res: any) => {
        if (res && res.success) {
          this.userSubject.next(res.data);
        }
      })
    );
  }

  updateNickname(nickname: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/user/nickname`, { nickname }, this.getHeaders());
  }

  deleteAccount(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/user`, this.getHeaders());
  }

  getCourses(): Observable<any> {
    return this.http.get(`${this.apiUrl}/courses`, this.getHeaders());
  }

  getCourseDetail(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/courses/${id}`, this.getHeaders());
  }

  buyCourse(id: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/courses/${id}/buy`,
      {},
      this.getHeaders(),
    );
  }

  checkoutProcess(payload: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/checkout`,
      payload,
      this.getHeaders(),
    );
  }
  getMyCourses(): Observable<any> {
    return this.http.get(`${this.apiUrl}/my-courses`, this.getHeaders());
  }

  getCourseProgress(id: number): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/courses/${id}/progress`,
      this.getHeaders(),
    );
  }

  markMaterialAsCompleted(materialId: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/materials/${materialId}/complete`,
      {},
      this.getHeaders(),
    );
  }
  getQuiz(courseId: number): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/courses/${courseId}/quiz`,
      this.getHeaders(),
    );
  }

  submitQuiz(quizId: number, answers: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/quizzes/${quizId}/submit`,
      { answers },
      this.getHeaders(),
    );
  }

  getCertificate(courseId: number): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/courses/${courseId}/certificate`,
      this.getHeaders(),
    );
  }

  downloadCertificatePdf(courseId: number): Observable<Blob> {
    const token = localStorage.getItem('token') || '';
    return this.http.get(
      `${this.apiUrl}/courses/${courseId}/certificate/download`,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
          Accept: 'application/pdf',
        }),
        responseType: 'blob',
      }
    );
  }

  getQuizByMaterial(materialId: number): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/materials/${materialId}/quiz`,
      this.getHeaders(),
    );
  }

  checkTransactionStatus(orderId: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/checkout/status`,
      { order_id: orderId },
      this.getHeaders(),
    );
  }

  updateProfile(formData: FormData): Observable<any> {
    const token = localStorage.getItem('token') || '';
    return this.http.post(
      `${this.apiUrl}/user/profile`,
      formData,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        })
      }
    ).pipe(
      tap((res: any) => {
        if (res && res.success) {
          this.userSubject.next(res.data);
        }
      })
    );
  }

  // Notifications
  getNotifications(): Observable<any> {
    return this.http.get(`${this.apiUrl}/notifications`, this.getHeaders());
  }

  markNotificationAsRead(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/notifications/${id}/read`, {}, this.getHeaders());
  }

  markAllNotificationsAsRead(): Observable<any> {
    return this.http.put(`${this.apiUrl}/notifications/read-all`, {}, this.getHeaders());
  }
}
