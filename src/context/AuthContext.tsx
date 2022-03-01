import * as React from "react";
interface AuthState {
  AuthStatus: string
  AccessToken: null | string
  User: Record<string, any>
}

const defaultAuthState: AuthState = {
  AuthStatus: 'checkingAuthStatus',
  User: {},
  AccessToken: null
};
const AuthContext = React.createContext<any | undefined>(
  undefined
);

const AuthProvider = (props) => {
  const [state, setState] = React.useState(defaultAuthState);

  return (
    <AuthContext.Provider value={[state, setState]}>
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider }
