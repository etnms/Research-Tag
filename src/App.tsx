import { ChangeEvent, useEffect, useState } from "react";
import "./App.css";
import DisplayFile from "./components/DisplayFile";
import { BaseDirectory, createDir, exists, readTextFile, writeFile } from "@tauri-apps/api/fs";
import { resourceDir } from '@tauri-apps/api/path';
import CreateTag from "./components/CreateTag";
import TagList from "./components/TagList";
import { LinesObject } from "./types/LinesObject";
import { open, save, confirm } from "@tauri-apps/api/dialog"

function App() {

  const [filepath, setFilePath] = useState<string>();
  const [fileName, setFileName] = useState<string>();
  const [linesObject, setLinesObject] = useState<LinesObject[]>([]);

  const [tagList, setTagList] = useState<string[]>([]);
  const [firstAppOpen, setFirstAppOpen] = useState<Boolean>(true);

  const [lastFile, setLastFile] = useState<string>("");
  const [lastDataFile, setLastDataFile] = useState<string>("");

  useEffect(() => {
    if (firstAppOpen) {
      setLastDataFile(localStorage.getItem("lastDataFile")!);
      // setLastFile(localStorage.getItem("lastFile")!);
      const file = localStorage.getItem("lastFile");
      setFirstAppOpen(false);

      readFile(file!);
      //setFile(lastFile)
    }
    //localStorage.setItem("lastDataFile", lastDataFile);
    //localStorage.setItem("lastFile", lastFile!);

  }, [])

  const readFile = async (path: string | null) => {
    if (path !== null) {
      const contents = await readTextFile(path!);
      console.log(contents);
    }
  }

  const openPreviousFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      //setFile(event.target.files[0]);
      setLastFile(event.target.files[0].name);
    }
  }

  const createDataFolder = async () => {
    await createDir("TaggerAppData/data", {
      dir: BaseDirectory.Document,
      recursive: true,
    });
  };

  // check if path exists
  // await exists('avatar.png', { dir: BaseDirectory.AppData });

  const createDataFile = async (lineObject: LinesObject[]) => {
    try {
      const fileExist: boolean = await exists(filepath!);
      console.log(fileExist);
      if (!fileExist) {
        await writeFile(
          {
            contents: `${JSON.stringify(lineObject, null, 2)}`,
            path: `TaggerAppData/data/${fileName}.json`,
          },
          {
            dir: BaseDirectory.Document,
          },
        );
      }
      else {
        const confirmed = await confirm('Are you sure?', 'Tauri');
        const confirmed2 = await confirm('This action cannot be reverted. Are you sure?', { title: 'Tauri', type: 'warning' });
      }
    } catch (e) {
      console.log(e);
    }

  };

  const saveJSON = () => {
    createDataFile(linesObject);
  }

  const createNewFile = async () => {
    try {
      const newFilepath = await open({
        filters: [{
          name: 'File',
          extensions: ['txt', 'csv']
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
        const fileNameSplit: string | undefined = newFilepath.split("\\").pop();
        const fileNameClear: string | undefined = fileNameSplit?.split('.')[0];
        setFileName(fileNameClear)
      }
    }
    catch (err) {
      console.log(err);
    };

  }

  return (
    <div className="container">
      <button onClick={() => createNewFile()}>Open file</button>
      <p>{fileName}</p>
      <button onClick={() => readFile(lastFile)}>Check last path</button>
      <CreateTag tagList={tagList} setTaglist={setTagList} />
      <TagList tagList={tagList} />
      <button onClick={() => createDataFolder()}>Write data folder</button>
      <button onClick={() => createDataFile(linesObject)}>createDataFile</button>
      <DisplayFile tagList={tagList} linesObject={linesObject} setLinesObject={setLinesObject} saveJSON={saveJSON} />
    </div>
  );
}

export default App;
