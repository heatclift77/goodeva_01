import { Table, Column, Model } from 'sequelize-typescript';

export interface Itodo {
  id?: number;
  title: string;
  desc: string;
  completed: boolean;
}

export type TodoCreationAttributes = Omit<Itodo, 'id'>;

@Table
export class Todo extends Model<Itodo, TodoCreationAttributes> {
  @Column
  title: string;

  @Column
  completed: boolean;

  @Column
  desc: string;
}
