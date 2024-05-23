/* user module */
export interface UserState {
  isLogin: boolean;
  user: Nullable<UserInfo>;
  token: Nullable<string>;
}

interface UserInfo {
  platform?: {
    symbol: string;
  };
}
