import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TaskService } from '../services/task.service';

import * as moment from 'moment';

import {
  Task,
  STATUS_DONE,
  STATUS_PENDING,
  TYPE_JOB,
  TYPE_PERSONAL,
} from '../models/task';
import { ModalController } from '@ionic/angular';
import { ModalTaskPage } from './modal-task/modal-task.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  public tasks: Array<any>;
  public allTask: Array<any>;
  public searchForm: FormGroup;
  public STATUS_DONE = STATUS_DONE;
  public STATUS_PENDING = STATUS_PENDING;
  public TYPE_JOB = TYPE_JOB;
  public TYPE_PERSONAL = TYPE_PERSONAL;
  public activeStatusFilter: string;

  constructor(
    public taskService: TaskService,
    private modalController: ModalController
  ) {
    this.tasks = [];
    this.allTask = [];
    this.searchForm = new FormGroup({});
    this.activeStatusFilter = STATUS_PENDING;
  }

  ngOnInit() {
    this.searchForm = new FormGroup({
      searcher: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
      ]),
    });

    this.searchForm.controls['searcher'].valueChanges.subscribe((value) => {
      // Aplica el filtro cada vez que se introduce un caracter en el buscador
      this.applyFilter();
    });

    // Carga tareas
    this.loadTasks();
  }

  // Carga todas las tareas
  loadTasks() {
    this.taskService.taskList().subscribe(
      // Success
      (result) => {
        result.reverse();
        this.tasks = result;
        this.allTask = result;

        // Aplica filtro por estado de la tarea
        this.applyFilter();
      },
      // Error
      (error) => {
        console.log('Error', error);
      }
    );
  }

  // Filtros que se aplican al listado de tareas
  applyFilter(event?: any) {
    if (event) {
      this.activeStatusFilter = event.detail.value;
    }

    // Filtra por el texto a buscar && por el estado (pestaña) que esté seleccionado
    this.tasks = this.allTask.filter((task) => {
      const searcherValue = this.searchForm.controls.searcher.value.toLowerCase();
      return (
        (searcherValue == '' ||
          (searcherValue != '' &&
            task.description.toLowerCase().indexOf(searcherValue) !== -1)) &&
        task.status == this.activeStatusFilter
      );
    });
  }

  // Abre modal para nueva tarea
  async newTask() {
    const modal = await this.modalController.create({
      component: ModalTaskPage,
      componentProps: {
        task: null,
      },
    });

    // Cuando el modal se cierre actualizamos el listado de tareas
    modal.onDidDismiss().then((payload: any) => {
      if (payload.data.mustReloadPage) {
        this.loadTasks();
      }
    });

    return await modal.present();
  }

  // Abre modal para editar tarea
  async editTask(task: Task) {
    const modal = await this.modalController.create({
      component: ModalTaskPage,
      componentProps: {
        task: task,
      },
    });

    // Cuando el modal se cierre actualizamos el listado de tareas
    modal.onDidDismiss().then((payload: any) => {
      if (payload.data.mustReloadPage) {
        this.loadTasks();
      }
    });

    return await modal.present();
  }

  // Cambia el estado de una tarea
  switchStatus(task: Task) {
    if (task.status == STATUS_PENDING) {
      task.status = STATUS_DONE;
    } else {
      task.status = STATUS_PENDING;
    }

    // Actualiza el estado remotamente
    this.updateStatus(task);

    // Filtra los resultados
    this.applyFilter();
  }

  // Actualiza remotamente el estado de una tarea
  updateStatus(task: Task) {
    this.taskService.updateTask(task).subscribe(
      // Success
      (response) => {
        // console.log('Success', response);
      },

      // Error
      (error) => {
        // console.log('Error', error);
      }
    );
  }

  // Comprueba si una tarea está fuera de plazo
  isLateDate(task: Task): boolean {
    if (
      task.limitDate &&
      moment(task.limitDate) <= moment() &&
      task.status == STATUS_PENDING
    ) {
      return true;
    }

    return false;
  }
}
