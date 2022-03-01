import './App.scss';
// import { useNavigate } from 'react-router-dom';
import useAuthState from './hooks/useAuthState';
import CheckingAuth from './components/CheckingAuth';
import Login from './screens/Login';
import { Navigate, Route, Routes } from 'react-router-dom';
import Campaigns from './screens/Campaigns';
import Header from './components/Header';
import NewCampaign from './screens/NewCampaign';
import CampaignDetails from './screens/CampaignDetails';

function App() {

  // let navigate = useNavigate();
  const { AuthStatus } = useAuthState();

  if (AuthStatus === 'checkingAuthStatus') {
    return <CheckingAuth />
  }

  if (AuthStatus === 'anonymous') {
    return <Login />
  }

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/" element={<Navigate to="campaigns" />} />
        <Route path="campaigns" element={<Campaigns />} />
        <Route path="add-new-campaign" element={<NewCampaign />} />
        <Route path="company/:companyId/campaign/:campaignId/details" element={<CampaignDetails />} />
      </Routes>
    </div>
  );
}

export default App;
