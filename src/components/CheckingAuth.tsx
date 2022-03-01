import { Auth } from "aws-amplify";
import { useEffect } from "react";
import useAuthState from "../hooks/useAuthState";
// import useUIState from "../hooks/useUIState";

export default function CheckingAuth() {
  const { setAuthStatus } = useAuthState();
  // const { setToastMessage, setToastType, setShowToastMessage } = useUIState();

  useEffect(() => {
    setTimeout(() => {

      if (!localStorage.getItem('SSCauthstatus')) {
        setAuthStatus('anonymous');
      } else {
        const _authStatus = localStorage.getItem('SSCauthstatus');
        if (_authStatus === 'loggedIn') {
          signIn();
        }
      }

    }, 100);
    // eslint-disable-next-line
  }, [setAuthStatus]);

  async function signIn() {
    try {
      const user = await Auth.signIn('vasilis.litsas@architechts.gr', 'qwe123QWE!@#');
      console.log(user);
      if (user.challengeName === "NEW_PASSWORD_REQUIRED") {
        const newPW = await Auth.completeNewPassword(user, 'qwe123QWE!@#', [])
        console.log(newPW);
      } else {
        setAuthStatus('loggedIn');
      }
    } catch (error) {
      console.log(error)
    }
  }

  return <div>Checking Authorization...</div>;

}