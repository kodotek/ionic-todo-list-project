import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../models/task';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

const TASK_API_END_POINT: string = 'https://curso-1af2a.firebaseio.com/Task/';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private idToken: string;
  constructor(private http: HttpClient, private authService: AuthService) {
    this.getIdToken();
  }

  private async getIdToken() {
    this.idToken = await this.authService.getIdToken();
  }

  // Nueva tarea
  createTask(task: Task): Observable<any> {
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    const body = JSON.stringify(task);
    return this.http.post(
      TASK_API_END_POINT + '.json?auth=' + this.idToken,
      body,
      options
    );
  }

  // Todas las tareas
  taskList(): Observable<any> {
    return this.http.get(TASK_API_END_POINT + '.json').pipe(
      map((response: any) => {
        if (response == undefined) {
          return [];
        }

        const tasks: Array<any> = [];
        for (let key in response) {
          tasks.push(
            new Task(
              key,
              response[key].description,
              response[key].type,
              response[key].status,
              response[key].limitDate
            )
          );
        }

        return tasks;
      })
    );
  }

  // Datos de una tarea
  getTask(id: string): Observable<any> {
    return this.http.get(TASK_API_END_POINT + id + '.json').pipe(
      map((response: any | undefined) => {
        if (response == undefined) {
          return null;
        }

        return response as Task;
      })
    );
  }

  // Actualiza tarea
  updateTask(task: Task): Observable<any> {
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    const body = JSON.stringify(task);

    return this.http.put(
      TASK_API_END_POINT + task.id + '.json?auth=' + this.idToken,
      body,
      options
    );
  }

  // Elimina tarea
  removeTask(id: string): Observable<any> {
    return this.http.delete(
      TASK_API_END_POINT + id + '.json?auth=' + this.idToken
    );
  }
}
