import { Component } from '@angular/core';
import { NavParams } from '@ionic/angular';

import { ModalController } from '@ionic/angular';

import { FormGroup, FormControl, Validators } from '@angular/forms';

import * as moment from 'moment';

import {
  Task,
  STATUS_DONE,
  STATUS_PENDING,
  TYPE_JOB,
  TYPE_PERSONAL,
} from '../../models/task';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'modal-task-page',
  templateUrl: './modal-task.page.html',
  styleUrls: ['./modal-task.page.scss'],
})
export class ModalTaskPage {
  public task: Task;
  public taskForm: FormGroup;
  public action: string;
  public mustReloadPage: boolean;
  public STATUS_DONE = STATUS_DONE;
  public STATUS_PENDING = STATUS_PENDING;
  public TYPE_JOB = TYPE_JOB;
  public TYPE_PERSONAL = TYPE_PERSONAL;
  public minLimitDate: string;
  public maxLimitDate: string;

  constructor(
    public modalController: ModalController,
    public navParams: NavParams,
    public taskService: TaskService
  ) {
    this.task = null;
    this.taskForm = new FormGroup({});
    this.action = 'create';
    this.mustReloadPage = false;
    this.minLimitDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
    this.maxLimitDate = moment().add(365, 'days').format('YYYY-MM-DD');
  }

  ngOnInit() {
    // Recibimos la tarea por navParams
    const task = this.navParams.get('task');

    // Si no viene ninguna tarea es porque vamos a crear una nueva
    if (task == null) {
      this.task = new Task();

      // Si viene una tarea es porque vamos a editarla
    } else {
      this.task = task;
      this.action = 'edit';
    }

    // Creamos el formulario para crear/editar tareas
    this.taskForm = new FormGroup({
      description: new FormControl(this.task.description, [
        Validators.required,
        Validators.minLength(1),
      ]),
      type: new FormControl(this.task.type, []),
      limitDate: new FormControl(this.task.limitDate, []),
    });

    // Observamos los cambios que se produzcan en el formulario
    this.taskForm.valueChanges.subscribe((formValues) => {
      if (this.taskForm.valid) {
        this.task.description = formValues.description;
        this.task.type = formValues.type;
        this.task.limitDate = formValues.limitDate
          ? formValues.limitDate
          : null;

        // Si estamos editando, actualizamos la tarea remotamente
        if (this.action == 'edit') {
          this.update();
        }
      }
    });
  }

  create(): void {
    this.taskService.createTask(this.task).subscribe(
      // Success
      (response) => {
        console.log('Success', response);
        this.mustReloadPage = true;
        this.dismiss();
      },

      // Error
      (error) => {
        console.log('Error', error);
      }
    );
  }

  remove() {
    this.taskService.removeTask(this.task.id).subscribe(
      // Success
      (result) => {
        this.mustReloadPage = true;
        this.dismiss();
      },

      // Error
      (error) => {
        console.log('Error', error);
      }
    );
  }

  update() {
    this.taskService.updateTask(this.task).subscribe(
      // Success
      (response) => {
        this.mustReloadPage = true;
        // console.log('Success', response);
      },

      // Error
      (error) => {
        // console.log('Error', error);
      }
    );
  }

  // Cerramos modal
  dismiss() {
    this.modalController.dismiss({
      mustReloadPage: this.mustReloadPage,
    });
  }
}
