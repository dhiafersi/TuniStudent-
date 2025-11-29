import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface LoginPromptOptions {
  message?: string;
  returnUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class LoginPromptService {
  private _open$ = new Subject<LoginPromptOptions>();
  open$ = this._open$.asObservable();

  open(options: LoginPromptOptions = {}) {
    this._open$.next(options);
  }
}
