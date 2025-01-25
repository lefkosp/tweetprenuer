import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class XApiService {
  public headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer 1633|fnUH1XnalRoiDi9CxQccHQz2NycdZc4LDNd7v0urd55d514c`,
  });

  constructor(private http: HttpClient) {}

  public getUser(username: string) {
    return this.http.get(`/api/twitter/user/${username}`, {
      headers: this.headers,
    });
  }

  public getUserTweets(userId: string) {
    return this.http.get(`/api/twitter/user/${userId}/tweets`, {
      headers: this.headers,
    });
  }

  public getProfileAndTweets(username: string): Observable<any> {
    return this.getUser(username).pipe(
      switchMap((profile: any) => {
        const userId = profile.id_str;
        return this.getUserTweets(userId).pipe(
          map((posts) => ({ profile, posts }))
        );
      })
    );
  }
}
