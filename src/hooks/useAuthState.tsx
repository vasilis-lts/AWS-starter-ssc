import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const useAuthState = () => {
  const [state, setState] = useContext(AuthContext);

  function setAuthStatus(Status: string) {
    setState(state => ({ ...state, AuthStatus: Status }));
  }

  function setAccessToken(token: string) {
    setState(state => ({ ...state, AccessToken: token }));
  }

  function setUser(User: Record<string, any>) {
    setState(state => ({ ...state, User }));
  }

  return {
    AuthStatus: state.AuthStatus,
    setAuthStatus,
    AccessToken: state.AccessToken,
    setAccessToken,
    User: state.User,
    setUser
  }

}

export default useAuthState;