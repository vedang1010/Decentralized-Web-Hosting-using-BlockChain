"use client"
import React, { useState, useEffect } from 'react';
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import styled from 'styled-components'
import { useRouter } from "next/navigation"
import { getAuth } from "firebase/auth";
import { initFirebase } from "@/Config/firebaseApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import {Toast} from "react-toastify"
const dashboard = () => {
  const app = initFirebase();
  const database = getDatabase(app);
  const router = useRouter(); // Initialize useRouter hook
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);
  const [websites, setWebsites] = useState([]);


  // console.log(user.uid)
  useEffect(() => {
    const rootRef = ref(database, "users");
    onValue(rootRef, (snapshot) => {
      const users = snapshot.val();
      const updatedWebsites = [];
      for (const userId in users) {
        // if(userId===user.uid){
        const userData = users[userId];
        const { domain, cid } = userData?.uploads || {}; // Access domain and cid from user's uploads data
        if (domain && cid) {
          updatedWebsites.push({ userId, domain, cid });
          // }
        }
      }

      setWebsites(updatedWebsites);
    });

  }, [database]);
  var loggedInUserWebsite=""
  var loggedInUserDomain=""
  
var loggedInUserCID=""
  if (user) {
     loggedInUserWebsite = websites.find(website => website.userId === user.uid);
     loggedInUserDomain = loggedInUserWebsite ? loggedInUserWebsite.domain : ''; // Domain of the logged-in user
     loggedInUserCID = loggedInUserWebsite ? loggedInUserWebsite.cid : ''; // CID of the logged-in user
  }
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
  const handleSignOut = () => {
    // Add your additional action here
    console.log("Additional action before sign out");
    // Call auth.signOut()
    router.push("/login")
    auth.signOut();
  };
  if (loading) {
    return <div>Loading....</div>;
  }
  if (!user) {
    router.push('/login');

    return <div>Please sign in to continue</div>;
  }
  const handleFileManagerClick = () => {
    router.push('/file'); // Navigate to the files page
  };
  console.log(websites);
  return (
    <Layout>
      <DashboardTopLeft>
        <Header>{loggedInUserDomain}</Header> {/* Display the domain of the logged-in user */}
        <CID target='blank' href={loggedInUserCID}>Visit Website</CID> {/* Display the CID of the logged-in user */}
        <Subheader>Created on 08/04/2024</Subheader>
        <SignOutContainer onClick={handleSignOut}>
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
          <Content onClick={() => router.push('/ide')}>Code Editor</Content>
          <Logs ></Logs>
        </VisitorCount>
      </DashboardContent>

    </Layout>
  )
}

export default dashboard

const CID = styled.a`
color: blue;
text-decoration: none;
margin-left: 10px;

&:hover {
  text-decoration: underline;
}
`;

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
  cursor: pointer;
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
const SignOutContainer = styled.button`

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

`