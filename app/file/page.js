"use client"
import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { TailSpin } from 'react-loader-spinner';
import Editor from "@monaco-editor/react";
import styled from 'styled-components';
import { FleekSdk, ApplicationAccessTokenService } from '@fleekxyz/sdk';
import { getAuth } from "firebase/auth"
import { initFirebase } from "@/Config/firebaseApp"
import { useAuthState } from "react-firebase-hooks/auth"
import { getDatabase, ref, set, onValue } from "firebase/database";
import { toast } from "react-toastify"
import { useRouter } from 'next/navigation';

// const applicationService = new ApplicationAccessTokenService({ clientId: 'client_x5nxBa5Iv6wXy6wK75UB' });
const applicationService = new ApplicationAccessTokenService({ clientId: 'client_fJWEyEhzVTOq9yMX3O78' });
const fleekSdk = new FleekSdk({ accessTokenService: applicationService });


const Files = () => {
    const app = initFirebase();
    const auth = getAuth();
    const [user, loading] = useAuthState(auth);
    const database = getDatabase(app);
    const router = useRouter();
    const [files, setFiles] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploaded, setUploaded] = useState(false);
    const [selectedFileContent, setSelectedFileContent] = useState('');
    const [loadingFileContent, setLoadingFileContent] = useState(false);
    const [fileMapping, setFileMapping] = useState({});
    const [editorOpen, setEditorOpen] = useState(false);
    const [editorContent, setEditorContent] = useState('');
    const [editedContent, setEditedContent] = useState("");
    const [selectedFileName, setSelectedFileName] = useState("");
    const [changesMade, setChangesMade] = useState(false);

    const [domainName, setDomainName] = useState('');

    useEffect(() => {
        const fetchFileCIDs = async () => {
            try {
                // Reference to the "uploads/files" node in the database
                const filesRef = ref(database, `users/${user.uid}/uploads/files`);

                // Listen for changes to the files node and fetch the data
                onValue(filesRef, async (snapshot) => {
                    const data = snapshot.val();

                    // Extract CIDs from the data
                    if (data) {
                        const files = Object.values(data).map(file => ({
                            name: file.name,
                            cid: file.cid
                        }));
                        // setFiles(files);

                        // Array to hold the actual file objects
                        const fileObjects = [];

                        for (const file of files) {
                            console.log("https://ipfs.io/ipfs/" + file.cid);
                            try {
                                const response = await fetch("https://ipfs.io/ipfs/" + file.cid);
                                if (response.ok) {
                                    const content = await response.text(); // Await the text() method

                                    // Create a new File object
                                    const blob = new Blob([content], { type: 'text/plain' });
                                    const fileObject = new File([blob], file.name);

                                    // Push the file object to the array
                                    fileObjects.push(fileObject);
                                } else {
                                    console.error('Failed to fetch CID content:', response.statusText);
                                }
                            }
                            catch (error) {
                                console.error('Error fetching CID content:', error);
                            }
                        }

                        // Set the state with the file objects
                        setFiles(fileObjects);
                    }
                });
            } catch (error) {
                console.error('Error fetching file CIDs:', error);
            }
        };

        if (user) {
            fetchFileCIDs();
        }
    }, [user,database]);

    const handleDomainNameChange = (event) => {
        setDomainName(event.target.value);
    };

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
                    cid: "https://ipfs.io/ipfs/" + added[indexHtmlCID].cid._baseCache.get('z')
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
                const rootRef = ref(database, "users");

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
                });
                toast.success("Files Uploaded Successfully")
            } catch (error) {
                console.error('Error creating folder and uploading:', error);
                setUploadLoading(false);
                toast.warn("Files Not Uploaded")
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
                toast.success("Files Uploaded Successfully")

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
    const handleSave = (selectedFileName) => {
        console.log()
        // Create a new File object with the edited content
        console.log(selectedFileName)
        console.log(selectedFileName.value)
        const blob = new Blob([selectedFileName.value], { type: 'text/plain' });
        // const fileObject = new File([blob], file.name);
        const updatedFile = new File([blob], selectedFileName);

        // Find the index of the selected file in the files array
        const fileIndex = files.findIndex(file => file.name === selectedFileName);

        if (fileIndex !== -1) {
            console.log("Reached")
            // Create a copy of the files array
            const updatedFiles = [...files];

            // Replace the selected file object with the updated file
            updatedFiles[fileIndex] = updatedFile;

            // Update the files state with the updated array
            setFiles(updatedFiles);
        }
        setChangesMade(false);

        // Close the editor
        setEditorOpen(false);
    };

    function handleEditorChange(value) {
        pages.selectedFileName.value = value;
        console.log(pages.selectedFileName.value)
        setChangesMade(true);

        // console.log(value)
    }

    const handleSaveOrClose = (selectedFileName) => {
        if (changesMade) {
            // If changes have been made, save the content
            handleSave(selectedFileName);
        } else {
            // If no changes have been made, close the editor
            handleCloseEditor();
        }
    };

    return (
        <Layout>
            <DomainInputContainer>
                <DomainInputField placeholder='Enter Domain / Title' onChange={handleDomainNameChange}></DomainInputField>
            </DomainInputContainer>
            <Input>
                <div>
                    <input type="file" onChange={handleFileSelect} multiple />
                </div>
            </Input>
            <ImageContainer>
                <div>
                    <StyledImage src="/ws5.png" alt="ws5" width={1000} height={1000} />
                    <StyledImage src="/ws2.png" alt="ws2" width={1000} height={1000} />
                    <StyledImage src="/ws3.jpg" alt="ws3" width={1000} height={1000} />
                    <StyledImage src="/ws1.png" alt="ws1" width={1000} height={1000} />
                    <StyledImage src="/ws4.jpg" alt="ws4" width={1000} height={1000} />
                </div>
            </ImageContainer>
            <ButtonsContainer>
                <Button onClick={uploadFiles}>Upload Files</Button>
                <Button onClick={createFolderAndUpload}>Create Folder & Upload</Button>
                {uploadLoading ? (
                    <TailSpin color='#fff' height={20} />
                ) : uploaded ? (
                    <Button>Files uploaded successfully</Button>
                ) : null}
            </ButtonsContainer>
            <FileContainer>
                {loadingFileContent ? (
                    <LoadingMessage>Loading file content...</LoadingMessage>
                ) : null}
                {editorOpen && (
                    <EditorContainer>
                        <Editor
                            height="80vh"
                            width="80vw"
                            language={getLanguageFromExtension(selectedFileName)}
                            defaultValue={editorContent}
                            onChange={handleEditorChange} 
                            value={pages.selectedFileName.value}/>
                        <SaveButton onClick={() => handleSaveOrClose(pages.selectedFileName)}>Save</SaveButton>
                        <CloseEditorButton onClick={handleCloseEditor}>Close Editor</CloseEditorButton>
                    </EditorContainer>
                )}
                <Header>List of Files</Header>
                <FilesList>
                    {files.map((file, index) => (
                        <FileItem key={index} onClick={() => handleFileClick(file.name)}>
                            <FileName>{file.name}</FileName>
                            <CID>{file.cid}</CID>
                            <DeleteButton onClick={() => handleFileDelete(file.name)}>Delete</DeleteButton>
                        </FileItem>
                    ))}
                </FilesList>
            </FileContainer>
        </Layout>
    );
};


const DomainInputContainer = styled.div`
    margin-bottom: 20px;
    width:100vw;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Dashboardbtn = styled.div`
    position: fixed;
    bottom: 20px; /* Adjust as needed */
    right: 20px; /* Adjust as needed */
    color: #fff;
    padding: 10px 20px; 
    border: none;
    border-radius: 5px;
    cursor: pointer;
`;

const DomainInputField = styled.input`
    width: 50%;
    margin: 10px 10px;
    background-color: aliceblue;
    border: 2px solid blue;
    color: black;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

const Input = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    width: 100%;
`;

const ImageContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding: 0px;
    width: 100%;
    height: 250px;
    align-items: center;
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

const FileContainer = styled.div`
  width: 100%;
  height: 90vh;
  overflow-y: auto;
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
  align-items: flex-start;
  margin-top: 20px;
  flex-direction: row;
`;

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 250px;
  padding: 15px;
  border-radius: 25px;
  border: 5px solid ${(props) => props.theme.color};
  color: ${(props) => props.theme.color};
  background-color: ${(props) => props.theme.bgDiv};
  border: none;
  margin-top: 30px;
  cursor: pointer;
  font-weight: bold;
  font-size: large;
  margin-right: 10px;
  &:hover {
    transform: scale(1.1); /* Scale the image up by 10% on hover */
    transition: transform 0.2s ease;
}
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