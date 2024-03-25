import styled from "styled-components"
import Brightness7Icon from '@mui/icons-material/Brightness7';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useContext } from "react";
import { App } from "../Layout";
import Wallet from "./Wallet";

const HeaderRight = () => {
    const ThemeToggler = useContext(App);
    return (
        <HeaderRightWrapper>
        <Wallet/>
            {/* <ThemeToggle>
                {ThemeToggler.theme == 'light' ? <DarkModeIcon onClick={ThemeToggler.changeTheme} /> : <Brightness7Icon onClick={ThemeToggler.changeTheme} />}
            </ThemeToggle> */}
            <ThemeToggle onClick={ThemeToggler.changeTheme}>
      {ThemeToggler.theme === 'light' ? <DarkModeIcon /> : <Brightness7Icon />}
      </ThemeToggle>
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
export default HeaderRight
