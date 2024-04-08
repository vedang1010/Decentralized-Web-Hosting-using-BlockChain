"use client"
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { TailSpin } from 'react-loader-spinner';
import Editor from "@monaco-editor/react";
import styled from 'styled-components';
import { FleekSdk, ApplicationAccessTokenService } from '@fleekxyz/sdk';
import { getAuth } from "firebase/auth"
import { initFirebase } from "@/Config/firebaseApp"
import { useAuthState } from "react-firebase-hooks/auth"
import { getDatabase, ref, set,onValue } from "firebase/database";

// const applicationService = new ApplicationAccessTokenService({ clientId: 'client_x5nxBa5Iv6wXy6wK75UB' });
const applicationService = new ApplicationAccessTokenService({ clientId: 'client_fJWEyEhzVTOq9yMX3O78' });
const fleekSdk = new FleekSdk({ accessTokenService: applicationService });


const Files = () => {
    const app = initFirebase();
    const auth = getAuth();
    const [user, loading] = useAuthState(auth);
    const database = getDatabase(app);

    const [files, setFiles] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploaded, setUploaded] = useState(false);
    const [selectedFileContent, setSelectedFileContent] = useState('');
    const [loadingFileContent, setLoadingFileContent] = useState(false);
    const [fileMapping, setFileMapping] = useState({});
    const [editorOpen, setEditorOpen] = useState(false); // State to manage editor visibility
    const [editorContent, setEditorContent] = useState(''); // State to manage editor content
    const [editedContent, setEditedContent] = useState(""); // State to store edited content
    const [selectedFileName, setSelectedFileName] = useState(""); // Assuming selectedFileName is part of state
    const [changesMade, setChangesMade] = useState(false);

    const [domainName, setDomainName] = useState('');

    const handleDomainNameChange = (event) => {
        setDomainName(event.target.value);
    };

    const createFolder = () => {
        const folderName = prompt("Enter the name for the new folder:");

        if (folderName) {
            // Create an empty folder object with the provided name
            const newFolder = {
                name: folderName,
                type: "folder",
                content: [], // You can add additional properties for folders if needed
            };

            // Update the state with the new folder
            setFiles([...files, newFolder]);
        }
    };



    // Function to handle saving the edited content
    // Function to handle saving the edited content


    const fetchFileContent = async (fileName) => {
        // Find the file with the matching name in the files array
        const file = files.find(file => file.name === fileName);
        console.log(file);

        if (!file) {
            // If the file is not found, return an error
            throw new Error(`File ${fileName} not found`);
        }

        // Read the content of the file
        const fileReader = new FileReader();

        return new Promise((resolve, reject) => {
            fileReader.onload = () => {
                const content = fileReader.result; // Content of the file as a value
                // console.log(content);
                resolve(content);
            };

            fileReader.onerror = () => {
                reject(fileReader.error);
            };

            fileReader.readAsText(file); // Read the file as text
        });
    };

    const handleFileSelect = (event) => {
        setSelectedFiles([...selectedFiles, ...event.target.files]);
    };
    const handlePrintData = () => {
        console.log("Files Data:", files);
    };

    const createFolderAndUpload = async () => {
        console.log(files.length);
        if (files.length > 0) {
            const ipfsFiles = [];
            for (const file of files) {
                ipfsFiles.push({
                    path: file.name,
                    content: file
                });
            }
            console.log(ipfsFiles);

            try {
                setUploadLoading(true);
                const added = await fleekSdk.ipfs().addAll(ipfsFiles);

                // Store added.cid in Firebase Realtime Database
                // const userRef = firebase.database().ref(`users/${user.uid}/uploads`);
                // for (const file of added) {
                //     userRef.push({ cid: file.cid });
                // }
                console.log(added[added.length - 1].cid._baseCache.get('z'))

                const reference = ref(database, "users/" + user.uid + "/uploads");
                let indexHtmlCID = null;
                var count = 0;
                for (const file of added) {
                    if (file.path === "index.html") {
                        indexHtmlCID = count;
                        break;
                    }
                    count++;
                }
                // console.log(added[added.length-1].)
                set(reference, {
                    // username: name,
                    // email: email,
                    // profile_picture : imageUrl
                    domain: domainName,
                    cid: added[indexHtmlCID].cid._baseCache.get('z')
                });
                console.log("error")
                const filesReference = ref(database, "users/" + user.uid + "/uploads/files");

                for (let i = 0; i < added.length; i++) {
                    const file = added[i];
                    const fileName = file.path;
                    const cid = file.cid._baseCache.get('z');
                    const filesReference2 = ref(database, "users/" + user.uid + "/uploads/files/file" + i)
                    // Use `set` instead of `push` to directly set the data under a specific path
                    // Here, we concatenate the `filesReference` path with the `fileName`
                    set(filesReference2, {
                        name: fileName,
                        cid: cid
                    });
                }
                console.log("error")



                setSelectedFiles([]);
                setUploadLoading(false);
                console.log(added);
                console.log(added.length);
                // console.log(fleekSdk.ipfs().)

                // Create a reference to the root node of your database
                const rootRef = ref(database,"users");

                // Iterate over each user's node
                onValue(rootRef, (Snapshot) => {
                    console.log(added.length);

                    const users = Snapshot.val();
                    for (var userId in users) {
                        console.log(userId);
                        const userRef = ref(database, `users/${userId}/uploads/files`);
                        onValue(userRef, (userSnapshot) => {
                            const files = userSnapshot.val();
                
                            // Iterate over each file
                            for (const fileName in files) {
                                const cid = files[fileName].cid;
                
                                console.log(`User: ${userId}, File Name: ${fileName}, CID: ${cid}`);
                            }
                        });
                    
                    }
                    // const userRef = ref(database, userId+"/uploads/files");

                    // Iterate over each file of the user
                    // forEachChild(userRef, (fileSnapshot) => {
                    //     const fileName = fileSnapshot.key;
                    //     const cid = fileSnapshot.val().cid;

                    //     console.log(`User: ${userId}, File Name: ${fileName}, CID: ${cid}`);
                    // });
                });

            } catch (error) {
                console.error('Error creating folder and uploading:', error);
                setUploadLoading(false);
            }
        }
    };



    const getLanguageFromExtension = (fileName) => {
        const extension = fileName.split('.').pop(); // Get file extension
        switch (extension) {
            case 'js':
                return 'javascript';
            case 'html':
                return 'html';
            case 'css':
                return 'css';
            // Add more cases for other file types as needed
            default:
                return 'plaintext'; // Default to plaintext if extension not recognized
        }
    };

    const uploadFiles = async (e) => {
        if (selectedFiles.length > 0) {
            e.preventDefault();
            setUploadLoading(true);

            try {
                // Create a copy of the selected files array
                const uploadedFiles = [...selectedFiles];

                // Update the state with the uploaded files
                setFiles([...files, ...uploadedFiles]);

                // Reset selected files array
                setSelectedFiles([]);

                // Update loading state
                setUploadLoading(false);
                // setUploaded(true);
            } catch (error) {
                console.error('Error uploading files:', error);

                // Reset loading state
                setUploadLoading(false);
                setUploaded(false);
            }
        }
    };


    const handleFileDelete = (fileName) => {
        const updatedFiles = files.filter((file) => file.name !== fileName);
        setFiles(updatedFiles);
    };

    // Inside your Files component

    const handleFileClick = async (fileName) => {
        setSelectedFileName(fileName);

        setLoadingFileContent(true);
        try {
            const content = await fetchFileContent(fileName);
            setSelectedFileContent(content);

            // Open the editor and set the content
            setEditorContent(content);
            setEditorOpen(true);
        } catch (error) {
            console.error('Error fetching file content:', error);
        }
        setLoadingFileContent(false);
    };

    const handleCloseEditor = () => {
        // Close the editor
        setEditorOpen(false);
    };
    const pages = {
        selectedFileName: {
            name: selectedFileName,
            language: getLanguageFromExtension(selectedFileName),
            value: "",
        }
    }
    const handleSave = () => {

        // Create a new File object with the edited content
        console.log(pages.selectedFileName)
        console.log(pages.selectedFileName.value)
        const updatedFile = new File([pages.selectedFileName.value], selectedFileName, { type: 'text/plain' });

        // Find the index of the selected file in the files array
        const fileIndex = files.findIndex(file => file.name === selectedFileName);

        if (fileIndex !== -1) {
            // Create a copy of the files array
            const updatedFiles = [...files];

            // Replace the selected file object with the updated file
            updatedFiles[fileIndex] = updatedFile;

            // Update the files state with the updated array
            setFiles(updatedFiles);
        }

        // Close the editor
        setEditorOpen(false);
    };

    function handleEditorChange(value) {
        pages.selectedFileName.value = value;
        // console.log("value")
        setChangesMade(true);

        // console.log(value)
    }

    const handleSaveOrClose = () => {
        if (changesMade) {
            // If changes have been made, save the content
            handleSave();
        } else {
            // If no changes have been made, close the editor
            handleCloseEditor();
        }
    };
    return (
        <Layout>
            <FileContainer>
                {/* Your existing code for file list and buttons */}
                {/* File list */}
                <Header>List of Files</Header>
                <FilesList>
                    {files.map((file, index) => (
                        <FileItem key={index} onClick={() => handleFileClick(file.name)}>
                            <FileName>{file.name}</FileName>
                            <CID>{file.cid}</CID> {/* Display the CID */}
                            <DeleteButton onClick={() => handleFileDelete(file.name)}>Delete</DeleteButton>
                        </FileItem>
                    ))}
                </FilesList>
                {/* Input field for domain name */}
                <DomainInputContainer>
                    <DomainInputField
                        type="text"
                        placeholder="Enter domain name"
                        value={domainName}
                        onChange={handleDomainNameChange}
                    />

                </DomainInputContainer>
                {/* Buttons */}
                <ButtonsContainer>
                    <input type="file" onChange={handleFileSelect} multiple />
                    {/* <input type="file" onChange={handleFileSelect} multiple /> */}
                    <Button onClick={uploadFiles}>Upload Files</Button>
                    {/* <Button onClick={handlePrintData}>Print Files Data</Button>  */}
                    {/* <Button onClick={createFolder}>Create Folder</Button> Button to create a folder */}

                    {/* Button to print files data */}
                    <Button onClick={createFolderAndUpload}>Create Folder & Upload</Button> {/* Button to create folder and upload */}
                    {uploadLoading ? (
                        <TailSpin color='#fff' height={20} />
                    ) : uploaded ? (
                        <Button>Files uploaded successfully</Button>
                    ) : null}
                </ButtonsContainer>

                {/* Loading message */}
                {loadingFileContent ? (
                    <LoadingMessage>Loading file content...</LoadingMessage>
                ) : null}

                {/* Editor */}
                {editorOpen && (
                    <EditorContainer>
                        <Editor
                            height="80vh"
                            width="80vw"
                            language={getLanguageFromExtension(selectedFileName)}
                            defaultValue={editorContent}
                            onChange={handleEditorChange} value={pages.selectedFileName.value}
                        />
                        <SaveButton onClick={handleSaveOrClose}>Save</SaveButton> {/* Save button */}

                        <CloseEditorButton onClick={handleCloseEditor}>Close Editor</CloseEditorButton>
                    </EditorContainer>
                )}
            </FileContainer>
        </Layout>
    );
};


const DomainInputContainer = styled.div`
    margin-bottom: 20px;
`;

const DomainInputLabel = styled.label`
    display: block;
    margin-bottom: 5px;
`;

const DomainInputField = styled.input`
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

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

const CID = styled.span`
  font-size: 14px;
  color: #888; /* You can adjust the color according to your preference */
`;
const EditorContainer = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 999; /* Ensure the editor is above other elements */
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StyledEditor = styled(Editor)`
    width: 100vw;
`;

const CloseEditorButton = styled.button`
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 5px 10px;
    background-color: #ccc;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
`;

// Use these styled components in your component.
const SaveButton = styled.button`
    position: absolute;
    bottom: 10px;
    right: 10px;
    padding: 8px 16px;
    background-color: #00b712;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #009f0e;
    }
`;
export default Files;
