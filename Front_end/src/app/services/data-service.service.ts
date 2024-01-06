import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
  constructor() { }

  public saveData(data: any, key:string): void {
    const jsonData = JSON.stringify(data);
    sessionStorage.setItem(key, jsonData);
  }
  public getData(obtener:string): any {
    const jsonData = sessionStorage.getItem(obtener);
    return jsonData ? JSON.parse(jsonData) : null;
  }
  public clearData(remove: string): void {
    sessionStorage.removeItem(remove);
  }
}
