import styled from "styled-components"
const HeaderLogo = () => {
  return (
    <Logo>
      Decent Web
    </Logo>
  )
}

const Logo=styled.h1`
    font-weight: bold;
    /* font-size: larger; */
    font-size: 40px;
    margin-left: 10px;
    font-family: 'Poppins','Segoe UI', Tahoma, 'Geneva', Verdana, sans-serif;
`

export default HeaderLogo
