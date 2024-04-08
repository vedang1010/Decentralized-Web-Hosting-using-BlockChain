"use client";
import styled from "styled-components"
import HeaderLogo from "./components/HeaderLogo";
// import HeaderNav from "./components/HeaderNav";
import HeaderRight from "./components/HeaderRight";

const Header = () => {
  return (
    <HeaderWrapper>
      <HeaderLogo />
      {/* <HeaderNav /> */}
      <HeaderRight />
      {/* Header */}
    </HeaderWrapper>
  )
}

const HeaderWrapper = styled.div`
  width:100%;
  position: fixed;
  top: 0;

   height:70px;
   display:flex;
   justify-content:space-around;
   align-items: center;
   position: relative;

   &::after {
    content: ''; /* Add content for pseudo-element */
    position: absolute; /* Position the line absolutely */
    bottom: 0; /* Position the line at the bottom of the container */
    left: 0; /* Align the line to the left edge */
    width: 100%; /* Make the line span the entire width */
    height: 2px; /* Set the height of the line */
    background-color: white; /* Set the color of the line */
  }
`
export default Header
