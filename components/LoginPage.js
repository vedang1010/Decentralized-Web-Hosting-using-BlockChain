"use client"
import Image from "next/image";
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const LoginPage = () => {
  const router = useRouter(); // Initialize useRouter hook
  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform login logic
    // After successful login, navigate to the dashboard page
    router.push('/dashboard');
  }
  return (
    <LoginContainer>
      <Title>Login</Title>
      <LoginSubContainer>
        <StyledText>
          Login with Google
        </StyledText>
        <StyledImage src="/google.png" alt="Google Logo" width={100} height={40} />
      </LoginSubContainer>
      <LoginSubDiv onSubmit={handleSubmit}> {/* Add onSubmit event handler to the form */}
        <LoginEmail placeholder="Email" type="email" />
        <LoginPassword placeholder="Password" type="password" />
        <LoginSubmit value="Login" type="submit" />
        <ForgetLink >
          <Link href={'/ResetPassword'}>
            Forgot Password?
          </Link>
        </ForgetLink>
      </LoginSubDiv>
      <Link href={'/signup'} >Don't Have an account?
        <SignupLink >Sign Up</SignupLink>
      </Link>
    </LoginContainer>
  )
}

export default LoginPage

const Title = styled.div`
  font-size: 40px;
  font-style: bold;
  color: blueviolet;
  font-weight:800;
  margin-bottom: 20px;
 `

const Signup = styled.span`
  margin-top: 5px;
  color: ${(props) => props.theme.color};
  font-size: large;
  cursor: pointer;
  font-weight: 600;
`
const ForgetLink = styled.div`
  margin-top: 20px;
  color: ${(props) => props.theme.color};
  font-size: large;
  cursor: pointer;
`
const SignupLink = styled.button`
  /* margin-top: 20px; */
  padding: 7px;
  font-weight: 700;
  color: ${(props) => props.theme.color};
  font-size: large;
  border-radius: 7px;
  background-color: ${(props) => props.theme.bgSubDiv};
  cursor: pointer;
`
const LoginSubmit = styled.input`
  height: 40px;
  cursor: pointer;
  width: 100px;
  background-color: grey;
  font-size: large;
  padding: 10px;
  font-weight: 500;
  color: black;
`
const LoginEmail = styled.input`
  height: 40px;
  width: 300px;
  background-color: #20b725;
  font-size: large;
  padding: 10px;
  font-weight: 500;
  color: ${(props) => props.theme.color};
`
const LoginPassword = styled.input`
  height: 40px;
  width: 300px;
  background-color: #20b725;
  font-size: large;
  padding: 10px;
  margin: 20px;
  font-weight: 500;
  color: ${(props) => props.theme.color};
`

const LoginSubDiv = styled.form`
    color: gray;
    margin: 20px;
    display: flex;
    flex-direction: column;
    /* height: 100%; */
    align-items: center;
    justify-content: space-between;
`
const LoginContainer = styled.div`
    /* width: 100%; */
    height: 70vh;
    /* left: 80px; */
    display: flex;
    justify-content: center;
    align-items: center;
    /* top: 550px; */
    flex-direction: column;
`
const LoginSubContainer = styled.button`
    color: ${(props) => props.theme.color};
    cursor: pointer;
    font-size: large;
    font-weight: 800;
    /* margin: 20px; */
    background-color:${(props) => props.theme.bgSubDiv};
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-radius: 10px;
`

const ImageDiv = styled.image`
  display: flex;
  justify-content: center;
  align-items: center;
`

const StyledImage = styled(Image)`
  /* Add your styles here */
  border-radius: 5px;
  height: 50px;
  scale: 0.8;
  /* margin-left: 50px; */ 
`
const StyledText = styled.div`

`