import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { TailSpin } from 'react-loader-spinner';
import styled from 'styled-components';
import { FleekSdk, ApplicationAccessTokenService } from '@fleekxyz/sdk';

const applicationService = new ApplicationAccessTokenService({ clientId: 'client_fJWEyEhzVTOq9yMX3O78' });
const fleekSdk = new FleekSdk({ accessTokenService: applicationService });

const Files = () => {
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [selectedFileContent, setSelectedFileContent] = useState('');
  const [loadingFileContent, setLoadingFileContent] = useState(false);

  const fetchFilesData = () => {
    setFiles([{ name: 'index.html' }]);
  };

  const handleFileSelect = (event) => {
    setSelectedFiles([...selectedFiles, ...event.target.files]);
  };

  const uploadFiles = async (e) => {
    if (selectedFiles.length > 0) {
      e.preventDefault();
      setUploadLoading(true);

      try {
        const uploadedFiles = await Promise.all(selectedFiles.map(async (file) => {
          const added = await fleekSdk.ipfs().add({
            path: file.name,
            content: file,
          });
          return { name: file.name, hash: added.path };
        }));

        setFiles([...files, ...uploadedFiles]);
        setSelectedFiles([]);
        setUploadLoading(false);
      } catch (error) {
        console.error('Error uploading files:', error);
        setUploadLoading(false);
        setUploaded(false);
      }
    }
  };

  const handleFileDelete = (fileName) => {
    const updatedFiles = files.filter((file) => file.name !== fileName);
    setFiles(updatedFiles);
  };

  const handleFileClick = async (fileName) => {
    setLoadingFileContent(true);
    try {
      const fileContent = await fleekSdk.ipfs().get(files.find(file => file.name === fileName).hash);
      setSelectedFileContent(fileContent);
    } catch (error) {
      console.error('Error fetching file content:', error);
    }
    setLoadingFileContent(false);
  };

  return (
    <Layout>
      <FileContainer>
        <Header>List of Files</Header>
        <FilesList>
          {files.map((file, index) => (
            <FileItem key={index} onClick={() => handleFileClick(file.name)}>
              <FileName>{file.name}</FileName>
              <DeleteButton onClick={() => handleFileDelete(file.name)}>Delete</DeleteButton>
            </FileItem>
          ))}
        </FilesList>
        <ButtonsContainer>
          <input type="file" onChange={handleFileSelect} multiple />
          {uploadLoading ? (
            <TailSpin color='#fff' height={20} />
          ) : uploaded ? (
            <Button>Files uploaded successfully</Button>
          ) : (
            <Button onClick={uploadFiles}>Upload Files to IPFS</Button>
          )}
        </ButtonsContainer>
        {loadingFileContent ? (
          <LoadingMessage>Loading file content...</LoadingMessage>
        ) : selectedFileContent ? (
          <IDEContent>
            <IDEHeader>File Content</IDEHeader>
            <IDEBody>{selectedFileContent}</IDEBody>
          </IDEContent>
        ) : null}
      </FileContainer>
    </Layout>
  );
};

const FileContainer = styled.div`
  width: 100%;
  height: 90vh;
`;

const Header = styled.h1`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  padding-top: 20px;
`;

const FilesList = styled.ul`
  list-style: none;
  padding: 0;
`;

const FileItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  cursor: pointer;
`;

const FileName = styled.span`
  margin-right: 10px;
`;

const DeleteButton = styled.button`
  background-color: red;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 250px;
  padding: 15px;
  color: white;
  background-color: #00b712;
  background-image: linear-gradient(180deg, #00b712 0%, #5aff15 80%);
  border: none;
  margin-top: 30px;
  cursor: pointer;
  font-weight: bold;
  font-size: large;
`;

const LoadingMessage = styled.p`
  text-align: center;
  margin-top: 20px;
`;

const IDEContent = styled.div`
  margin-top: 20px;
  border: 1px solid #ccc;
  padding: 20px;
`;

const IDEHeader = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const IDEBody = styled.pre`
  white-space: pre-wrap;
  font-family: monospace;
`;

export default Files;
