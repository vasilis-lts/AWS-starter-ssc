import styled from '@emotion/styled';
import { Button, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import useAuthState from '../hooks/useAuthState';

const LoginForm = styled('div')(({ theme }) => ({
  color: '#3f51b5',
  height: '100%',
  // backgroundColor: "#777",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  '& .MuiTextField-root': {
    margin: "10px",
    width: 375,

    '& input': {
      paddingTop: "3.5px",
      paddingBottom: "3.5px",
    }
  },
  '& label': {
    marginLeft: "10px",
    marginBottom: '0',
    fontSize: '0.8rem',
    textTransform: "uppercase"
  },
  '& .MuiButtonBase-root ': {
    margin: "10px",
    width: "auto",
    padding: "9px 14px",
    marginTop: "12px",
  },
  '& .MuiInputBase-root ': {
    padding: "9px",
  }
}));

function Login() {
  const { setAuthStatus } = useAuthState();
  const [ErrorMsg, setErrorMsg] = useState<String>('');
  const [inputs, setInputs] = useState({
    username: '',
    password: '',
  });

  const {
    username,
    password,
  } = inputs;

  function handleChange(e) {
    setErrorMsg('')
    const { name, value } = e.target;
    setInputs(inputs => ({ ...inputs, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const json = { username, password }
    console.log(json);
    // const [res, token] = await loginRequest('auth/login', json);

    // if (res && token) {
    //   localStorage.setItem("AdminAccessToken", token);

    //   let now = new Date();
    //   let nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    //   localStorage.setItem('Adminexp', nextWeek.getTime().toString());

    //   setAccessToken(token);
    //   const _User: IUser = res;
    //   _User.email = res.username;

    //   setUser(_User);
    //   localStorage.setItem("AdminQUser", JSON.stringify(_User));
    //   setAppActive("SYSADMIN")
    //   setAuthStatus('loggedIn');
    // } else {
    //   setErrorMsg('Wrong e-mail and/or password');
    // }

    localStorage.setItem("SSCauthstatus", 'loggedIn');
    setAuthStatus('loggedIn');
  }

  useEffect(() => {
    //
  }, []);

  return (
    <LoginForm>
      <div className="flex-col" style={{ alignItems: "center" }}>
        {/* <img src={Logo} width="150" alt="Applegg logo" className="logo" /> */}
        <h1 className="text-center" style={{ color: '#3f51b5' }}>Login</h1>
        <h4 style={{ marginTop: 0, color: '#3f51b5' }}>Enter your e-mail and password</h4>
        <form
          style={{ display: 'flex', flexDirection: "column", marginTop: "10px" }}
          onSubmit={handleSubmit}
        >
          <label htmlFor="username">E-mail</label>
          <TextField
            autoFocus
            id="username"
            name="username"
            type="email"
            required
            onChange={handleChange}
            variant="outlined"
            size="small"
          />
          <label htmlFor="password">Password</label>
          <TextField
            id="password"
            name="password"
            type="password"
            required
            onChange={handleChange}
            variant="outlined"
            size="small"
          />
          <Button type="submit" variant="contained" color="primary">LOGIN</Button>
          {ErrorMsg && <p className="text-center error">{ErrorMsg}</p>}
        </form>
      </div>
    </LoginForm>
  );
}

export default Login;