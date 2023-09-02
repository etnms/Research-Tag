import { ChangeEvent, useEffect, useState } from "react";
import "./App.css";
import DisplayFile from "./components/DisplayFile";
import { BaseDirectory, createDir, exists, readTextFile, writeFile } from "@tauri-apps/api/fs";
import { dirname, documentDir } from '@tauri-apps/api/path';
import CreateTag from "./components/CreateTag";
import TagList from "./components/TagList";
import { LinesObject } from "./types/LinesObject";
import { open, save, confirm } from "@tauri-apps/api/dialog"

function App() {

  const [filepath, setFilePath] = useState<string>();
  const [fileName, setFileName] = useState<string>();
  const [linesObject, setLinesObject] = useState<LinesObject[]>([]);

  const [tagList, setTagList] = useState<string[]>([]);

  const readFile = async (path: string | null) => {
    if (path !== null) {
      await readTextFile(path!);
    }
  }

  const createDataFolder = async () => {
    await createDir("TaggerAppData/data", {
      dir: BaseDirectory.Document,
      recursive: true,
    });
  };

  const createDataFile = async (lineObject: LinesObject[]) => {
    try {
      const fileExist: boolean = await exists(filepath!);
      if (!fileExist) {
        writeJSONFile(lineObject);
      }
      else {
        const confirmed = await confirm('This file already exists, do you want to replace it?', { title: 'File already exists', type: 'warning' });
        if (confirmed) writeJSONFile(lineObject);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const updateJSONFile = async (lineObject: LinesObject[]) => {
    try {
      writeJSONFile(lineObject);
    }
    catch (err) {
      console.log(err);
    }
  }

  const writeJSONFile = async (lineObject: LinesObject[]) => {
    const dir = await dirname(filepath!);
    await writeFile(
      {
        contents: `${JSON.stringify(lineObject, null, 2)}`,
        path: `${dir}/${fileName}.json`,
      },

    );
  }

  const saveJSON = () => {
    updateJSONFile(linesObject);
  }

  const createNewFile = async () => {
    try {
      const newFilepath = await open({
        filters: [{
          name: 'File',
          extensions: ['txt'] // need to add .csv
        }]
      }) as string;
      if (newFilepath !== undefined) {
        setFilePath(newFilepath);
        const content: string = await readTextFile(newFilepath);
        const linesArray: string[] = content.split('\n');

        const newLinesObject: LinesObject[] = linesArray.map((line, index) => ({
          line,
          index,
          tags: []
        }));
        setLinesObject(newLinesObject);
        setFileName(getFileName(newFilepath))
      }
    }
    catch (err) {
      console.log(err);
    };

  }

  const getFileName: (filepath: string) => string | undefined = (filepath: string) => {
    const fileNameSplit: string | undefined = filepath.split("\\").pop();
    const fileNameClear: string | undefined = fileNameSplit?.split('.')[0];
    return fileNameClear;
  }

  const openJSONFile = async () => {
    try {
      const documentPath = await documentDir();

      const jsonfilepath = await open({
        filters: [{
          name: 'Data file',
          extensions: ['json']
        }],
        defaultPath: `${documentPath}/TaggerAppData/data`,
      }) as string;
      const content: LinesObject[] = JSON.parse(await readTextFile(jsonfilepath!));
      setFilePath(jsonfilepath);
      setLinesObject(content);
      setFileName(getFileName(jsonfilepath))
    }
    catch (err) {
      console.log(err);
    }
  }


  return (
    <div className="container">
      <button onClick={() => createNewFile()}>New file</button>
      <button onClick={() => openJSONFile()}>Open JSON file</button>
      <p>{fileName}</p>
      <CreateTag tagList={tagList} setTaglist={setTagList} />
      <TagList tagList={tagList} />
      <button onClick={() => createDataFile(linesObject)}>createDataFile</button>
      <DisplayFile tagList={tagList} linesObject={linesObject} setLinesObject={setLinesObject} saveJSON={saveJSON} />
    </div>
  );
}

export default App;
