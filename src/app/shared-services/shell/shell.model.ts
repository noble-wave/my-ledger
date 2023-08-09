export interface IShell {
  appName: string;
  isLoggedIn: boolean;
  loginAction: () => any;
  logoutAction: () => any;
  profileImg: any;
}
