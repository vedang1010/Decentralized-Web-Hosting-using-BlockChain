"use client";
import Layout from "@/components/layout/Layout";
import LoginPage from "@/components/LoginPage";
import HostedWebsites from "@/components/hostedWebsites/page";
import { useRouter } from "next/navigation";
import styled from "styled-components";

export default function Home() {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push("/login");
  };

  const handleRegisterClick = () => {
    router.push("/register");
  };

  return (


    <Layout>
      <Navbar>
        <Button onClick={handleLoginClick}>Login</Button>
        <Button onClick={handleRegisterClick}>Register</Button>
      </Navbar>
      <HostedWebsites />
    </Layout>
  );
}

const Navbar = styled.div`
  width: 100vw;
  background-color: black;
  height: 100px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 20px;
`;

const Button = styled.button`
  background-color: blue;
  color: aliceblue;
  height: 50px;
  width: 100px;
  cursor: pointer;
  font-size: large;
  margin: 10px;
`;
