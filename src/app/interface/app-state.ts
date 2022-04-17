import { DataState } from '../enum/data-state.enum';

export interface Appstate<T> {
  dataState: DataState;
  appData?: T;
  error?: string;
}
