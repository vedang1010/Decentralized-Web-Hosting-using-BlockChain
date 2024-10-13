"use client"
import Image from "next/image";
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// import app from ""
import { initFirebase } from "@/Config/firebaseApp";
import { useAuthState } from "react-firebase-hooks/auth"

// To apply the default browser preference instead of explicitly setting it.
// auth.useDeviceLanguage();
const LoginPage = () => {
  initFirebase();
  const router = useRouter(); // Initialize useRouter hook

  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
  const [user, loading] = useAuthState(auth);
  // console.log(app);
  if (loading) {
    return <div>Loading....</div>;
  }
  if (user) {
    router.push('/dashboard');

    return <div>Welcome {user.displayName}</div>;
  }
  const signIn = async () => {
    const result = await signInWithPopup(auth, provider);
    console.log(result)
    // .then((result) => {
    //     // This gives you a Google Access Token. You can use it to access the Google API.
    //     const credential = GoogleAuthProvider.credentialFromResult(result);
    //     const token = credential.accessToken;
    //     // The signed-in user info.
    //     const user = result.user;
    //     // IdP data available using getAdditionalUserInfo(result)
    //     // ...
    //   }).catch((error) => {
    //     // Handle Errors here.
    //     const errorCode = error.code;
    //     const errorMessage = error.message;
    //     // The email of the user's account used.
    //     const email = error.customData.email;
    //     // The AuthCredential type that was used.
    //     const credential = GoogleAuthProvider.credentialFromError(error);
    //     // ...
    //   });

  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform login logic
    // After successful login, navigate to the dashboard page
    router.push('/Dashboard');
  }
  return (
    <LoginContainer>
      <Title>Login</Title>
      <LoginSubContainer onClick={signIn}>
        <StyledText>
          Login with Google
        </StyledText>
        <StyledImage src="/google.png" alt="Google Logo" width={100} height={80} />
      </LoginSubContainer>
      <LoginSubDiv onSubmit={handleSubmit}> {/* Add onSubmit event handler to the form */}
        <LoginEmail placeholder="Email" type="email" required />
        <LoginPassword placeholder="Password" type="password" required />
        <LoginSubmit value="Login" type="submit" />
        <ForgetLink onClick={() => router.push('/ResetPassword')}> {/* Use router.push for navigation */}
          Forgot Password?
        </ForgetLink>
      </LoginSubDiv>
      <SignupLink onClick={() => router.push('/register')}> {/* Use router.push for navigation */}
        Dont Have an account?
      </SignupLink>
    </LoginContainer>
  )

}

export default LoginPage

const Title = styled.div`
  font-size: 40px;
  font-style: bold;
  color: ${(props) => props.theme.color};
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
  font-size: large;
  padding: 10px;
  font-weight: 500;
  color: ${(props) => props.theme.color};
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
  margin: 20px;
  font-weight: 500;
  color: ${(props) => props.theme.color};
  &:hover {
    transform: scale(1.1); /* Scale the image up by 10% on hover */
    transition: transform 0.2s ease;
}
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
    width: 50vh;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    /* border: 5px solid ${(props) => props.theme.color}; */
    border-radius: 8px;
    /* left: 80px; */
    display: flex;
    justify-content: center;
    align-items: center;
    /* top: 550px; */
    flex-direction: column;
    /* background-color: offwhite; */


    background: rgba(255, 255, 255, 0);
    border-radius: 16px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(4px);
    border: 2px solid rgba(255, 255, 255, 0.99);
`
const LoginSubContainer = styled.button`
    color: ${(props) => props.theme.color};
    cursor: pointer;
    /* filter: grayscale(15px); */
    background-color: aliceblue;
    font-size: large;
    font-weight: 800;
    /* margin: 20px; */
    /* background-color:${(props) => props.theme.bgSubDiv}; */
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-radius: 10px;
    &:hover {
      transform: scale(1.1); /* Scale the image up by 10% on hover */
      transition: transform 0.2s ease;
      background-color:${(props)=>props.theme.bgColor};

  }
`

const ImageDiv = styled.image`
  display: flex;
  justify-content: center;
  align-items: center;
`

const StyledImage = styled(Image)`
  /* Add your styles here */
  border-radius: 5px;
  height: 70px;
  width: 50px;
  scale: 0.6;
  /* margin-left: 50px; */ 
`
const StyledText = styled.div`
  color:${(props)=>props.theme.bgDiv};
`