"use client"
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import styled from 'styled-components'
import { useRouter } from "next/navigation"
const dashboard = () => {
  const router = useRouter(); // Initialize useRouter hook
  const handleFileManagerClick = () => {
    router.push('/file'); // Navigate to the files page
  };
  return (
    <Layout>
      <DashboardContainer>
        <DashboardTopLeft>
          <Header>Website Name</Header>
          <Subheader>Created on 20/11/10</Subheader>
        </DashboardTopLeft>
        <DashboardContent>
          <FileManager onClick={handleFileManagerClick}>File Manager</FileManager>
          <VisitorCount>
            <Content>Visitor Count</Content>
            <Logs onClick={() => router.push('/access-logs')}>See Access logs</Logs>
          </VisitorCount>
        </DashboardContent>
      </DashboardContainer>
    </Layout>
  )
}

export default dashboard

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
const DashboardContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding:200px;
  
`

const DashboardTopLeft = styled.div`
  flex: 1;
  /* left: 0; */
  margin-right: 20px;
`

const DashboardContent = styled.div`
  flex: 2;
  margin: 30px;
  display: flex;
  padding: 5px;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  
`

const Header = styled.h1`
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
  padding: 20px;
  border-radius: 5px;
  display: flex;
  cursor: pointer;
  border: 1px solid;
  justify-content: center;
  align-items: center;
  margin: 20px;
  width: 100%;
  font-size: 16px;
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.color};
  `

const VisitorCount = styled.div`
  background-color: #f2f2f2;
  width: 100%;
  padding: 20px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  display: flex; 
  flex-direction: column;
  justify-content: center;
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.color};
`

