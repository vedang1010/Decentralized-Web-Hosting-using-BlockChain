"use client"
import React, { useState, useEffect } from 'react';
import Editor from "@monaco-editor/react";
import { styled } from 'styled-components';
import Layout from '@/components/layout/Layout';

const EditorWindow = ({ content }) => {
    const [fileContent, setFileContent] = useState('');

    useEffect(() => {
        if (content) {
            // Fetch file content when component mounts
            fetchFileContent(content);
        }
    }, [content]);

    const fetchFileContent = async (fileName) => {
        try {
            // Simulate fetching file content
            const content = await new Promise((resolve, reject) => {
                setTimeout(() => {
                    // Assuming fileName is unique for each file
                    const fileContent = `Content of ${fileName} file`;
                    console.log(fileContent);
                    resolve(fileContent);
                }, 1000); // Simulate delay of 1 second
            });
            setFileContent(content);
        } catch (error) {
            console.error('Error fetching file content:', error);
        }
    };

    return (
        <Layout>
            <FileItem>
                <Editor
                    height="90vh"
                    defaultLanguage="css"
                    defaultValue={fileContent}
                />
            </FileItem>
        </Layout>
    );
};

const FileItem = styled.div`
    height: 100vh;
    width: 100vw;
    background-color: blue;
`;

export default EditorWindow;
