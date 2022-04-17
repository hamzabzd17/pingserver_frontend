import { Status } from './../enum/status.enum';
import { CustomResponse } from './../interface/custom-response';
import {
  HttpClient,
  HttpClientModule,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Server } from '../interface/server';
import { query } from '@angular/animations';

@Injectable({
  providedIn: 'root',
})
export class ServerService {
  private readonly apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  servers$ = <Observable<CustomResponse>>(
    this.http
      .get<CustomResponse>(`${this.apiUrl}/server/list`)
      .pipe(tap(console.log), catchError(this.handleError))
  );

  save$ = (server: Server) =>
    <Observable<CustomResponse>>(
      this.http
        .post<CustomResponse>(`${this.apiUrl}/server/save`, server)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  ping$ = (ipAddress: string) =>
    <Observable<CustomResponse>>(
      this.http
        .get<CustomResponse>(`${this.apiUrl}/server/ping/${ipAddress}`)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  filter$ = (status: Status, response: CustomResponse) =>
    <Observable<CustomResponse>>new Observable((observer) => {
      console.log(response);
      observer.next(
        status === Status.ALL
          ? { ...response, message: `Servers filtred by  ${status} status` }
          : {
              ...response,
              message:
                response.data.servers.filter((server) => {
                  server.status === status;
                }).length > 0
                  ? `servers filtred by ${
                      status === Status.SERVER_UP ? 'SERVER UP' : 'SERVER DOWN'
                    } status`
                  : `no servers of ${status} found`,
              data: {
                servers: response.data.servers.filter(
                  (server) => server.status === status
                ),
              },
            }
      );
      observer.complete();
    }).pipe(tap(console.log), catchError(this.handleError));

  delete$ = (serverId: number) =>
    <Observable<CustomResponse>>(
      this.http
        .delete<CustomResponse>(`${this.apiUrl}/server/delete/${serverId}`)
        .pipe(tap(console.log), catchError(this.handleError))
    );
  handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    return throwError(`an error occurred - error code:${error.status}`);
  }
  // getServers(): Observable<CustomResponse> {
  //   return this.http.get<CustomResponse>(`${API_SERVER}/server/list`);
  // }
}
