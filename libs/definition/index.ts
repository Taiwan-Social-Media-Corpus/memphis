/* eslint-disable @typescript-eslint/no-namespace */
namespace Definition {
  export enum AdminRole {
    Default = 1,
    Super,
  }

  export enum Cookies {
    authToken = 'lope-auth-tk',
    authTokenSig = 'lope-auth-tk.sig',
    csrfToken = 'lcsrl',
  }
}

export default Definition;
