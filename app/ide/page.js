"use client"
import { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import styles from "../style/page.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHtml5, faCss3, faJs } from "@fortawesome/free-brands-svg-icons";
import { faPlay, faCircleXmark ,faSave} from "@fortawesome/free-solid-svg-icons";

const files = {
  "index.html": {
    
    name: "index.html",
    language: "html",
    value: "",
  },
  "style.css": {
    name: "style.css",
    language: "css",
    value: "",
  },
  "script.js": {
    name: "script.js",
    language: "javascript",
    value: "",
  },
};

export default function Ide() {
  const [fileName, setFileName] = useState("index.html");
  const [htmlCode, setHtmlCode] = useState("");
  const [cssCode, setCssCode] = useState("");
  const [jsCode, setJsCode] = useState("");
  const fileInputRef = useRef(null);
  const [newFileName, setNewFileName] = useState("");

  function handleEditorChange(value) {
    files[fileName].value = value;
  }

  useEffect(() => {
    const runBtn = document.getElementById("runCode");
    const clsBtn = document.getElementById("closeWindow");

    runBtn?.addEventListener("click", () => {
      setHtmlCode(files["index.html"].value);
      setCssCode(files["style.css"].value);
      setJsCode(files["script.js"].value);
      document.getElementById("outputWindow").style.display = "block";
      document.getElementById("outputWindow").style.width = "100vw";

    });

    clsBtn?.addEventListener("click", () => {
      document.getElementById("outputWindow").style.display = "none";
    });
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const fileType = file.name.split(".").pop();
      const language = fileType === "html" ? "html" : fileType === "css" ? "css" : "javascript";
      const newFile = { name: file.name, language: language, value: content };
      files[file.name] = newFile;
      setFileName(file.name);
    };
    reader.readAsText(file);
  };
  // Save working

  // const handleSave = () => {
  //   const currentFile = files[fileName];
  //   if (newFileName && newFileName !== currentFile.name) {
  //     files[newFileName] = { ...currentFile, name: newFileName };
  //     delete files[fileName];
  //     setFileName(newFileName);
  //   }
  //   // Implement saving logic here
  //   console.log("File saved:", files[fileName]);
  // };



  const handleSave = () => {
    const currentFile = files[fileName];
    const content = currentFile.value;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = newFileName || currentFile.name;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    URL.revokeObjectURL(url);
  
    if (newFileName && newFileName !== currentFile.name) {
      files[newFileName] = { ...currentFile, name: newFileName };
      delete files[fileName];
      setFileName(newFileName);
    }
  
    console.log("File saved:", currentFile.name,files[fileName]);
  };
  
  return (
    <>
      <div>
        <div className="{styles,container}">
        <div className="styles.editorContainer">
        <div className={styles.topBar}>
          <button
            className={styles.htmlButton}
            disabled={fileName === "index.html"}
            onClick={() => setFileName("index.html")}
          >
            <div>
              <FontAwesomeIcon icon={faHtml5} />
            </div>
            index.html
          </button>
          <button
            className={styles.cssButton}
            disabled={fileName === "style.css"}
            onClick={() => setFileName("style.css")}
          >
            <div>
              <FontAwesomeIcon icon={faCss3} />
            </div>
            style.css
          </button>
          <button
            className={styles.jsButton}
            disabled={fileName === "script.js"}
            onClick={() => setFileName("script.js")}
          >
            <div>
              <FontAwesomeIcon icon={faJs} />
            </div>{" "}
            script.js
          </button>
          <button className={styles.playButton} id="runCode">
            <div>
              <FontAwesomeIcon icon={faPlay} />
            </div>{" "}
            Run
          </button>
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} style={{ display: "none" }} />
          <button className={styles.uploadButton} onClick={() => fileInputRef.current.click()}>
            Upload File
          </button>
          <button className={styles.saveButton} onClick={handleSave}>
            <div>
              <FontAwesomeIcon icon={faSave} />
            </div>{" "}
            Save
          </button>
          <input
            type="text"
            placeholder="Enter new file name (optional)"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
          />
        </div>
        <Editor
          height="100vh"
          theme="vs-dark"
          saveViewState={true}
          path={files[fileName].name}
          defaultLanguage={files[fileName].language}
          defaultValue={files[fileName].value}
          onChange={handleEditorChange}
          value={files[fileName].value} 
        />
      </div>
      <div className={styles.websiteWindow} id="outputWindow">
        <div className={styles.buttonBlock}>
          <button className={styles.closeButton} id="closeWindow">
            <div>
              <FontAwesomeIcon icon={faCircleXmark} />
            </div>
          </button>
        </div>
        <iframe id=""
          title="output"
          srcDoc={`
  <html>
    <body>${htmlCode}</body>
    <style>${cssCode}</style>
    <script>${jsCode}</script>
  </html>`}
          className={styles.outputiframewindow}
        />
      </div>
      </div>
      </div>
    </>
  );
}

