import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UnplashService {
private URL:string = "https://api.unsplash.com/search/photos?client_id=zEYBjirMmzpmgzAH-W2EK5qevYcjRpznO0HfzbZw4to&query="
  constructor(private httpClient:HttpClient) {

  }
  async getPhoto(url:string){
    let ruta:string = this.URL + url;
    return this.httpClient.get(ruta);
  }
}
