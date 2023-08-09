import { Injectable } from '@angular/core';
import { AppBaseService } from '../services/base.service';
import { IShell } from './shell.model';

@Injectable()
export class IrsShellService extends AppBaseService<IShell> {

  constructor() {
    super({
      appName: 'Test',
      isLoggedIn: false,
      loginAction: () => { },
      logoutAction: () => { },
      profileImg: null
    });
  }

  public updateIShell(shell: IShell): void {
    if (shell) {
      this.set(shell);
    }
  }

  public update(isLoggedIn: boolean, profileImg: string): void {
    const shell = this.source.value;
    if (shell) {
      shell.isLoggedIn = isLoggedIn;
      shell.profileImg = profileImg;
    }
    this.set(shell);
  }

}
