export const TYPE_JOB = 'job';
export const TYPE_PERSONAL = 'personal';

export const STATUS_DONE = 'done';
export const STATUS_PENDING = 'pending';

export class Task {
  constructor(
    public id: string = null,
    public description: string = '',
    public type: string = TYPE_PERSONAL,
    public status: string = STATUS_PENDING,
    public limitDate?: Date
  ) {}
}
