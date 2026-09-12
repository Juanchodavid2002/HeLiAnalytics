import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Resumen } from '../models/resumen.model';
import {
  Cruces,
  Distribuciones,
  DistribucionVariable,
  Temporal,
  TiempoRespuesta,
} from '../models/distribucion.model';
import { Cluster, Clusters } from '../models/cluster.model';
import { Filtros, Insights, Textual } from '../models/insight.model';

const API_URL = '/api';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  getResumen(): Observable<Resumen> {
    return this.http.get<Resumen>(`${API_URL}/resumen`);
  }

  getDistribuciones(variable?: string): Observable<Distribuciones> {
    const params = variable ? { variable } : undefined;
    return this.http.get<Distribuciones>(`${API_URL}/distribuciones`, { params });
  }

  getDistribucion(variable: string): Observable<DistribucionVariable> {
    return this.http.get<DistribucionVariable>(`${API_URL}/distribuciones/${variable}`);
  }

  getTemporal(): Observable<Temporal> {
    return this.http.get<Temporal>(`${API_URL}/distribuciones/temporal`);
  }

  getTiempoRespuesta(): Observable<TiempoRespuesta> {
    return this.http.get<TiempoRespuesta>(`${API_URL}/distribuciones/tiempo-respuesta`);
  }

  getCruces(variables?: string): Observable<Cruces> {
    const params = variables ? { variables } : undefined;
    return this.http.get<Cruces>(`${API_URL}/cruces`, { params });
  }

  getClusters(): Observable<Clusters> {
    return this.http.get<Clusters>(`${API_URL}/clusters`);
  }

  getCluster(id: number): Observable<Cluster> {
    return this.http.get<Cluster>(`${API_URL}/clusters/${id}`);
  }

  getInsights(): Observable<Insights> {
    return this.http.get<Insights>(`${API_URL}/insights`);
  }

  getTextual(): Observable<Textual> {
    return this.http.get<Textual>(`${API_URL}/textual`);
  }

  getFiltros(): Observable<Filtros> {
    return this.http.get<Filtros>(`${API_URL}/filtros`);
  }
}