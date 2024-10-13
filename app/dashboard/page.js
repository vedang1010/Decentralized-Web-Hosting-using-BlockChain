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
import { Toast } from "react-toastify";

function Dashboard  () {  // Renamed dashboard to Dashboard
  const app = initFirebase();
  const database = getDatabase(app);
  const router = useRouter(); // Initialize useRouter hook
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);
  const [websites, setWebsites] = useState([]);

  useEffect(() => {
    const rootRef = ref(database, "users");
    onValue(rootRef, (snapshot) => {
      const users = snapshot.val();
      const updatedWebsites = [];
      for (const userId in users) {
        const userData = users[userId];
        const { domain, cid } = userData?.uploads || {}; // Access domain and cid from user's uploads data
        if (domain && cid) {
          updatedWebsites.push({ userId, domain, cid });
        }
      }
      setWebsites(updatedWebsites);
    });
  }, [database]);

  let loggedInUserWebsite = "";
  let loggedInUserDomain = "";
  let loggedInUserCID = "";
  
  if (user) {
    loggedInUserWebsite = websites.find(website => website.userId === user.uid);
    loggedInUserDomain = loggedInUserWebsite ? loggedInUserWebsite.domain : ''; 
    loggedInUserCID = loggedInUserWebsite ? loggedInUserWebsite.cid : ''; 
  }

  const handleSignOut = () => {
    console.log("Additional action before sign out");
    router.push("/login");
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

  return (
    <Layout>
      <DashboardTopLeft>
        <Header>{loggedInUserDomain}</Header>
        <CID target='blank' href={loggedInUserCID}>Visit Website</CID>
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
          <Logs></Logs>
        </VisitorCount>
      </DashboardContent>
    </Layout>
  )
}

export default Dashboard; // Don't forget to export the renamed component

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
  border-radius: 5px;
  height: 200px;
  width: auto;
  margin: 0;
  &:first-child {
    margin-right: 0px; 
  }
  &:hover {
    transform: scale(1.2); 
    transition: transform 0.2s ease;
  }
`;

const Logs = styled.div`
  font-size: 12px;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
    color: blue;
  }
`;

const Content = styled.div`
    font-size: 16px;
`;

const DashboardTopLeft = styled.div`
  flex: 1;
  margin-right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DashboardContent = styled.div`
  flex: 2;
  margin: 50px;
  display: flex;
  padding: 70px;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  flex-direction: row;
`;

const Header = styled.h1`
  padding: 20px;
  font-size: 24px;
  font-weight: bold;
  align-items: center;
`;

const Subheader = styled.p`
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #666;
`;

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
    transform: scale(1.1);
    transition: transform 0.2s ease;
  }
`;

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
  flex-direction: column;
  justify-content: center;
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.color};
  &:hover {
    transform: scale(1.1);
    transition: transform 0.2s ease;
  }
`;

const SignOutContainer = styled.button`
  cursor: pointer;
  color: #fff;
  font-size: 16px;
  margin: 8px;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: 10px 20px;
  border-radius: 5px;
  background-color: ${(props)=>props.theme.bgDiv};
`;
