import { Injectable } from '@angular/core';
import { APP_NAME } from '../config/app.constants';

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  appName = APP_NAME;
  constructor() {}
}
