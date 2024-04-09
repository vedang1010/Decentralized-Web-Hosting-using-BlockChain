"use client"
import { useState } from 'react';
import Layout from "@/components/layout/Layout"
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Signup = () => {
  const router = useRouter();
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true); // Initially assume passwords match

  const handleSubmit = (e) => {
    e.preventDefault();
    // Check if passwords match
    if (password === confirmPassword) {
      // Perform signup logic
      // If signup successful, show OTP input field
      setShowOTPInput(true);
      setPasswordsMatch(true); // Reset passwordsMatch state
    } else {
      setPasswordsMatch(false); // Set passwordsMatch state to false if passwords don't match
    }
  }

  const handleOTPSubmit = (e) => {
    e.preventDefault();
    // Perform OTP verification logic
    // If OTP verification successful, redirect to dashboard or next page
    router.push('/dashboard'); // Example redirect to dashboard
  }

  return (
    <Layout>
      <SignupContainer>

        <Title>Register</Title>
        <LoginSubDiv onSubmit={handleSubmit}>
          <LoginButton placeholder="Name" type="text" required/>
          <LoginButton placeholder="Email" type="email" required/>
          <LoginButton placeholder="Password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          <LoginButton placeholder="Confirm Password" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          {!passwordsMatch && <ErrorMessage>Passwords do not match</ErrorMessage>}
          {/* <LoginSubmit type="submit" value="Get OTP" /> */}
        </LoginSubDiv>
        {showOTPInput && (
          <LoginSubDiv onSubmit={handleOTPSubmit}>
            <OTPInput placeholder="Enter OTP" type="text" required />
          </LoginSubDiv>
        )}
            <LoginSubmit type="submit" value="Register" />
        <Link href={'/login'} >Already have an account?
          <SignupLink >Login</SignupLink>
        </Link>
      </SignupContainer>
    </Layout>
  )
}

export default Signup;

const Title = styled.div`

  font-size: 60px;
  font-style: bold;
  color: 0F1035;
  font-weight: 800;
  margin-bottom: 20px;
`

const SignupLink = styled.button`
  padding: 7px;
  font-weight: 700;
  color: ${(props) => props.theme.color};
  font-size: large;
  border-radius: 7px;
  background-color: ${(props) => props.theme.bgSubDiv};
  cursor: pointer;
  &:hover {
    transform: scale(1.1); /* Scale the image up by 10% on hover */
    transition: transform 0.2s ease;
}

`

const LoginSubmit = styled.input`
  height: 40px;
  cursor: pointer;
  width: 100px;
  background-color: ${(props) => props.theme.bgColor};
  color:  white;
  font-size: large;
  padding: 10px;
  font-weight: 500;
  border-radius: 8px;
  color: black;
  &:hover {
    transform: scale(1.1); /* Scale the image up by 10% on hover */
    transition: transform 0.2s ease;
}
`

const LoginEmail = styled.input`
  height: 40px;
  width: 300px;
  background-color: white;

`

const LoginButton = styled.input`
  height: 40px;
  width: 300px;
  background-color: white;
  font-size: large;
  padding: 10px;
  font-weight: 500;
  color: ${(props) => props.theme.color};
  &:hover {
    transform: scale(1.1); /* Scale the image up by 10% on hover */
    transition: transform 0.2s ease;
}
margin: 20px;
border-radius: 5px;

`

const LoginPassword = styled.input`
  height: 40px;
  width: 300px;

  background-color: white;

  font-size: large;
  padding: 10px;
  margin-bottom: 15px;
  font-weight: 500;
  color: ${(props) => props.theme.color};

  &:hover {
    transform: scale(1.1); /* Scale the image up by 10% on hover */
    transition: transform 0.2s ease;
}
`

const OTPInput = styled.input`
  height: 40px;
  width: 300px;
  background-color: green;

  font-size: large;
  padding: 10px;
  margin-top: 20px;
  font-weight: 500;
  color: ${(props) => props.theme.color};
`

const LoginSubDiv = styled.form`
  color: ${(props) => props.theme.color};
  margin: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`

const SignupContainer = styled.div`
  height: 70vh;

  width: 50vh;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  background-color: off-white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 5px solid ${(props) => props.theme.color};
  border-radius: 8px;


  background: rgba(255, 255, 255, 0);
    border-radius: 16px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(13px);
    -webkit-backdrop-filter: blur(4px);
    border: 2px solid rgba(255, 255, 255, 0.99);
`

const ErrorMessage = styled.div`
  color: red;
  font-size: 14px;
  margin-top: -10px;
  margin-bottom: 10px;
`
