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
        <Title>Sign Up</Title>
        <LoginSubDiv onSubmit={handleSubmit}>
          <LoginEmail placeholder="Email" type="email" required/>
          <LoginPassword placeholder="Password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          <LoginPassword placeholder="Confirm Password" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          {!passwordsMatch && <ErrorMessage>Passwords do not match</ErrorMessage>}
          <LoginSubmit type="submit" value="Get OTP" />
        </LoginSubDiv>
        {showOTPInput && (
          <LoginSubDiv onSubmit={handleOTPSubmit}>
            <OTPInput placeholder="Enter OTP" type="text" required />
            <LoginSubmit type="submit" value="Verify OTP" />
          </LoginSubDiv>
        )}
        <Link href={'/'} >Already have an account?
          <SignupLink >Login</SignupLink>
        </Link>
      </SignupContainer>
    </Layout>
  )
}

export default Signup;

const Title = styled.div`
  font-size: 40px;
  font-style: bold;
  color: bluevoilet;
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
  width: 150px;
  background-color: #7DB954;
  font-size: large;
  padding: 10px;
  font-weight: 500;
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
  font-size: large;
  padding: 10px;
  font-weight: 500;
  color: ${(props) => props.theme.color};
  margin: 15px;
  &:hover {
    transform: scale(1.1); /* Scale the image up by 10% on hover */
    transition: transform 0.2s ease;
}
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
`

const ErrorMessage = styled.div`
  color: red;
  font-size: 14px;
  margin-top: -10px;
  margin-bottom: 10px;
`
