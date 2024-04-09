import styled from "styled-components"
import Brightness7Icon from '@mui/icons-material/Brightness7';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useContext } from "react";
import { App } from "../Layout";
import Wallet from "./Wallet";
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";
import { initFirebase } from "@/Config/firebaseApp";
import { useAuthState } from "react-firebase-hooks/auth";

const HeaderRight = () => {
    const app = initFirebase();
    const auth = getAuth();
    const [user, loading] = useAuthState(auth);
    const router = useRouter();

    const handleLoginClick = () => {
        router.push("/login");
    };

    const handleRegisterClick = () => {
        router.push("/register");
    };
    const GoToDashboard = () => {
        router.push("/dashboard");
    };
    const ThemeToggler = useContext(App);
    return (
        <HeaderRightWrapper>
            <Wallet />
            {/* <ThemeToggle>
                {ThemeToggler.theme == 'light' ? <DarkModeIcon onClick={ThemeToggler.changeTheme} /> : <Brightness7Icon onClick={ThemeToggler.changeTheme} />}
            </ThemeToggle> */}
            <ThemeToggle onClick={ThemeToggler.changeTheme}>
                {ThemeToggler.theme === 'light' ? <DarkModeIcon /> : <Brightness7Icon />}
            </ThemeToggle>
            <>
      {!user ? (
        <>
          <Button onClick={handleLoginClick}>Login</Button>
          <Button onClick={handleRegisterClick}>Register</Button>
        </>
      ) : (
        <Button onClick={GoToDashboard}>  Dashboard</Button>
      )}
    </>
        </HeaderRightWrapper>
    )
}

const HeaderRightWrapper = styled.div`
display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 15px;
    height: 50%;

`

const ThemeToggle = styled.div`
    background-color:${(props) => props.theme.bgDiv};
    height: 100%;
    padding: 5px;
    width: 45px;
    border-radius: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    
`
const Button = styled.button`
   cursor: pointer;
  color: #fff;
  font-size: 16px;
  margin: 8px;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: 10px 20px;
  border-radius: 5px;
  /* background-color: #006c87; */
  background-color: ${(props)=>props.theme.bgDiv};

`;

export default HeaderRight
