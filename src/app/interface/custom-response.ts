import { Server } from './server';

export interface CustomResponse {
  timestamp: Date;
  statusCode: number;
  status: string;
  message: string;
  data: { servers?: Server[]; server?: Server };
  reason: string;
  developerMessage: string;
}
