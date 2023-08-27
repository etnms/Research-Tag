import { ChangeEvent, useState } from "react";
import "./App.css";
import DisplayFile from "./components/DisplayFile";
import { BaseDirectory, createDir, writeFile } from "@tauri-apps/api/fs";
import { resourceDir } from '@tauri-apps/api/path';
import CreateTag from "./components/CreateTag";
import TagList from "./components/TagList";

interface LinesObject {
    line: string,
    index: number,
    tags: string[]
}

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [lines, setLines] = useState<string[]>([]);
  const [linesObject, setLinesObject] = useState<LinesObject[]>([]);

  const [tagList, setTagList] = useState<string[]>([]);

  function OpenFile(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
      displayText();
    }
  }

  const displayText = async () => {
    if (file) {
      const reader: FileReader = new FileReader();
      reader.onload = (event) => {
        if (event.target!.result) {
          const content = event.target!.result as string;
          const linesArray: string[] = content.split('\n');
          setLines(linesArray);
        } else {
          console.error('Error reading file: Result is null');
        }
      };

      reader.onerror = (event) => {
        console.error('Error reading file:', event.target!.error);
      };

      reader.readAsText(file);
    }
  };

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
      await writeFile(
        {
          contents: `${JSON.stringify(lineObject, null ,2)}`,
          path: `TaggerAppData/data/data.json`,
        },
        {
          dir: BaseDirectory.Document,
        },
      );
    } catch (e) {
      console.log(e);
    }
  };

  const createJSON = () => {
    const newLinesObject: LinesObject[] = lines.map((line, index) => ({
      line,
      index,
      tags: [""]
    }));
    setLinesObject(newLinesObject);
   // setLinesObject([...linesObject, ...newLinesObject]);
  }

  return (
    <div className="container">
      <CreateTag tagList={tagList} setTaglist={setTagList}/>
      <TagList tagList={tagList}/>
      <input type='file' onChange={(event) => OpenFile(event)}></input>
      <button onClick={() => displayText()}>Display text</button>
      <button onClick={() => createDataFolder()}>Write data folder</button>
      <button onClick={() => createJSON()}>Write XML test</button>
      <button onClick={() => createDataFile(linesObject)}>createDataFile</button>
      <DisplayFile lines={lines} tagList={tagList} />
    </div>
  );
}

export default App;
