import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getAuth } from "firebase/auth";
import { initFirebase } from "@/Config/firebaseApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import "@/style/card.css"
const HostedWebsites = () => {
  const app = initFirebase();
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);
  const database = getDatabase(app);
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

  return (
    <Container>
      <Heading>Hosted Websites</Heading>
      <List>
        {websites.map((website, index) => (

          <ListItem key={index}>

            {/* <div class="container"> */}
              <div class="card">
                <div class="title">
                  <h1>{website.domain}</h1>
                </div>
                <div class="content">
                  <div class="social">
                    <i class="fab fa-globe-europe"></i>
                    <a href={website.cid} target="_blank">
                      Visit Page</a>
                  </div>



                </div>
                <div class="circle"></div>
              </div>
            {/* </div> */}


            {/* <DomainName>{website.domain}</DomainName> */}
            {/* <Link target='blank' href={website.cid}>Visit Website</Link> */}
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

const Heading = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
`;

const ListItem = styled.li`
  background-color: #f9f9f9;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
`;

const DomainName = styled.span`
  font-weight: bold;
`;

const Link = styled.a`
  color: blue;
  text-decoration: none;
  margin-left: 10px;

  &:hover {
    text-decoration: underline;
  }
`;

export default HostedWebsites;
