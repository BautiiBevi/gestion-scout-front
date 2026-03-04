import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Familia } from '../../models/familia.model';

@Injectable({
  providedIn: 'root',
})
export class FamiliaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/familias';

  // GET con buscador opcional
  getFamilias(query: string = ''): Observable<Familia[]> {
    return this.http.get<Familia[]>(`${this.apiUrl}?q=${query}`);
  }

  getFamiliaById(id: number): Observable<Familia> {
    return this.http.get<Familia>(`${this.apiUrl}/${id}`);
  }

  createFamilia(familia: Familia): Observable<Familia> {
    return this.http.post<Familia>(this.apiUrl, familia);
  }

  updateFamilia(id: number, familia: Partial<Familia>): Observable<Familia> {
    return this.http.put<Familia>(`${this.apiUrl}/${id}`, familia);
  }

  deleteFamilia(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
