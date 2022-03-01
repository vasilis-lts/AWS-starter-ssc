import styled from "@emotion/styled";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const HeaderWrapper = styled('div')(({ theme }) => ({

  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 20px",
  color: "white"

}));

export default function Header() {
  const navigate = useNavigate();

  return (
    <HeaderWrapper id="Header">
      <div className="header-left"><h3 onClick={() => navigate("/campaigns")} style={{ fontWeight: 400, cursor: "pointer" }}>Co2Monitor.Web</h3></div>
      <div className="header-right"><Button>Sign out</Button></div>
    </HeaderWrapper>
  )
}