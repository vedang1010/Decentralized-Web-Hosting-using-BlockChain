"use client"
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import styled from 'styled-components'
import { useRouter } from "next/navigation"
import { getAuth } from "firebase/auth"
import { initFirebase } from "@/Config/firebaseApp"
import {useAuthState} from "react-firebase-hooks/auth"

const dashboard = () => {
  initFirebase();
  const router = useRouter(); // Initialize useRouter hook
  const auth=getAuth();
  const [user,loading]=useAuthState(auth);
  // console.log(app);
  // const callApi=async()=>{
  //   const token = await user.getIdToken();

  //   const echoEndpoint = "https://jwtecho.pixegami.io";
  //   const certStr=""
  //   const audience =""
  //   const verifigation='${echoEndpoint}/verify?audience=${audience}&cert_str=${certStr}'
  //   const requestInfo={
  //     headers:{
  //       Authorization:"Bearer "+token,
  //     },
  //   }
  //   const response=await fetch(echoEndpoint,requestInfo)
  //   const responseBody=await response.json()
  //   console.log(token)
  //   console.log(responseBody)
  // }
  if(loading){
    return <div>Loading....</div>;
  }
  if(!user){
    router.push('/login');

    return <div>Please sign in to continue</div>;
  }
  const handleFileManagerClick = () => {
    router.push('/file'); // Navigate to the files page
  };

  return (
    <Layout>
      <DashboardTopLeft>
          <Header>Website Name</Header>
          <Subheader>Created on 20/11/10</Subheader>
          <SignOutContainer onClick={()=>auth.signOut()}>
Sign out
    </SignOutContainer>
        </DashboardTopLeft>

        <ImageContainer>
                <div>
                    <StyledImage src="/ws5.png" alt="ws5" width={1000} height={1000} />
                    <StyledImage src="/ws2.png" alt="ws2" width={1000} height={1000} />
                    <StyledImage src="/ws3.jpg" alt="ws3" width={1000} height={1000} />
                    <StyledImage src="/ws1.png" alt="ws1" width={1000} height={1000} />
                    <StyledImage src="/ws4.jpg" alt="ws4" width={1000} height={1000} />

                </div>
          </ImageContainer>

          <DashboardContent>
          <FileManager onClick={handleFileManagerClick}>File Manager</FileManager>
          <VisitorCount>
            <Content>Visitor Count</Content>
            <Logs onClick={() => router.push('/access-logs')}>See Access logs</Logs>
          </VisitorCount>
        </DashboardContent>
      
    </Layout>
  )
}

export default dashboard


const ImageContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding: 50px;
    width: 100%;
    height: 250px;
    align-items: flex-start;

`;

const StyledImage = styled.img`
  /* Add your styles here */
  border-radius: 5px;
  height: 200px;
  width: auto;
  margin: 0;
  &:first-child {
    margin-right: 0px; /* Add some space between the images */
  }
  /* margin-left: 50px; */ 
  &:hover {
    transform: scale(1.2); /* Scale the image up by 10% on hover */
    transition: transform 0.2s ease;
}

`;

const Logs = styled.div`
  font-size: 12px;
  cursor: pointer; /* Ensure the cursor changes on hover */
  
  &:hover {
    text-decoration: underline;
    color: blue;
  }
`;

const Content = styled.div`
    font-size: 16px;
`


const DashboardTopLeft = styled.div`
  flex: 1;
  /* left: 0; */
  margin-right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const DashboardContent = styled.div`
  flex: 2;
  margin: 50px;
  display: flex;
  padding: 70px;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  flex-direction: row;
  
`

const Header = styled.h1`
  padding: 20px;
  font-size: 24px;
  font-weight: bold;
  align-items: center;
  `

const Subheader = styled.p`
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #666;
`

const FileManager = styled.button`
  background-color: #f2f2f2;
  padding: 10px;
  border-radius: 5px;
  display: flex;
  cursor: pointer;
  
  justify-content: center;
  align-items: center;
  margin: 20px;
  width: 200px;
  height: 60px;
  font-size: 16px;
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.color};
  &:hover {
    transform: scale(1.1); /* Scale the image up by 10% on hover */
    transition: transform 0.2s ease;
}
  `

const VisitorCount = styled.div`
  background-color: #f2f2f2;
  width: 200px;
  padding: 10px;
  height: 60px;
  border-radius: 5px;
  border: 1px solid;
  display: flex;
  align-items: center;
  display: flex; 
  flex-direction: column;
  justify-content: center;
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.color};
  &:hover {
    transform: scale(1.1); /* Scale the image up by 10% on hover */
    transition: transform 0.2s ease;
}
`
