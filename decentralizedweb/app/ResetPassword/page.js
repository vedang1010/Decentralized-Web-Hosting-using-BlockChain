"use client"
import { useState } from 'react';
import Layout from "@/components/layout/Layout"
import styled from 'styled-components';
import { useRouter } from 'next/navigation';

const ResetPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true); // Initially assume passwords match

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // Send OTP to the provided email address
    // This is a placeholder, you would implement the actual logic here
    // For now, just show the OTP input field
    setShowOTPInput(true);
  }

  const handleOTPSubmit = (e) => {
    e.preventDefault();
    // Verify OTP and proceed if valid
    // Again, this is a placeholder for actual OTP verification logic
    // If OTP is valid, proceed to reset password
    // For now, just show the password input fields
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Check if passwords match
    if (password === confirmPassword) {
      // Perform password reset logic
      // Redirect user to login page or any other desired page after successful password reset
      router.push('/login');
      setPasswordsMatch(true); // Reset passwordsMatch state
    } else {
      setPasswordsMatch(false); // Set passwordsMatch state to false if passwords don't match
    }
  }

  return (
    <Layout>
      <ResetPasswordContainer>
        <Title>Reset Password</Title>
        {!showOTPInput && (
          <ResetForm onSubmit={handleEmailSubmit}>
            <InputField
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <SubmitButton type="submit" value="Send OTP" />
          </ResetForm>
        )}
        {showOTPInput && (
          <ResetForm onSubmit={handleOTPSubmit}>
            <InputField
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <SubmitButton type="submit" value="Verify OTP" />
          </ResetForm>
        )}
        {showOTPInput && (
          <ResetForm onSubmit={handleSubmit}>
            <InputField
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <InputField
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {!passwordsMatch && <ErrorMessage>Passwords do not match</ErrorMessage>}
            <SubmitButton type="submit" value="Reset Password" />
          </ResetForm>
        )}
      </ResetPasswordContainer>
    </Layout>
  )
}

export default ResetPassword;


const ResetPasswordContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`

const InputField = styled.input`
  height: 40px;
  width: 300px;
  padding: 10px;
  margin-bottom: 15px;
  font-size: 16px;
`

const SubmitButton = styled.input`
  height: 40px;
  width: 150px;
  background-color: #20b725;
  color: white;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`

const ErrorMessage = styled.div`
  color: red;
  font-size: 14px;
  margin-top: -10px;
  margin-bottom: 10px;
`
const ResetForm=styled.form`
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
`
