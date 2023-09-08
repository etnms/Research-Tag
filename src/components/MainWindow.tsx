import React, { useEffect } from "react";
import { useState } from "react";
import DisplayFile from "./DisplayFile";
import {
  BaseDirectory,
  createDir,
  readTextFile,
  writeFile,
} from "@tauri-apps/api/fs";
import { documentDir } from "@tauri-apps/api/path";
import CreateTag from "./CreateTag";
import { open, save } from "@tauri-apps/api/dialog";
import TagInfo from "./TagInfo";
import styles from "./MainWindow.module.scss";
import Menu from "./Menu";
import TabMenu from "./TabMenu";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { updateLinesObject } from "../features/lineObjectSlice";
import { updateTagList } from "../features/tagSlice";
const MainWindow = () => {
  const [filepath, setFilePath] = useState<string>();
  const [fileName, setFileName] = useState<string>();

  const [pageIndex, setPageIndex] = useState<number>(0);

  const linesObject: LinesObject[] = useAppSelector(
    (state) => state.linesObject.value
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Whenever the linesObject state changes, save it to JSON
    saveJSON();
  }, [linesObject]);

  const readFile = async (path: string | null) => {
    if (path !== null) {
      await readTextFile(path!);
    }
  };

  const createDataFolder = async () => {
    await createDir("TaggerAppData/data", {
      dir: BaseDirectory.Document,
      recursive: true,
    });
  };

  const createDataFile = async (lineObject: LinesObject[]) => {
    try {
      const path = await save({
        filters: [
          {
            name: "Tagger data file",
            extensions: ["json"],
          },
        ],
      });
      await writeFile({
        contents: `${JSON.stringify(lineObject, null, 2)}`,
        path: path!,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const updateJSONFile = async (lineObject: LinesObject[]) => {
    try {
      writeJSONFile(lineObject);
    } catch (err) {
      console.log(err);
    }
  };

  const writeJSONFile = async (lineObject: LinesObject[]) => {
    //const dir = await dirname(filepath!);
    const filePath = `TaggerAppData/data/${fileName}.json`;
    await writeFile(
      {
        path: filePath,
        // path: `${dir}/${fileName}.json`,
        contents: `${JSON.stringify(lineObject, null, 2)}`,
      },
      { dir: BaseDirectory.Document }
    );
  };

  const saveJSON = () => {
    updateJSONFile(linesObject);
  };

  const createNewFile = async () => {
    try {
      const newFilepath = (await open({
        filters: [
          {
            name: "File",
            extensions: ["txt"], // need to add .csv
          },
        ],
      })) as string;
      if (newFilepath !== undefined) {
        setFilePath(newFilepath);
        const content: string = await readTextFile(newFilepath);
        const linesArray: string[] = content.split("\n");

        const newLinesObject: LinesObject[] = linesArray.map((line, index) => ({
          line,
          index,
          tags: [],
        }));
        dispatch(updateLinesObject(newLinesObject));
        setFileName(getFileName(newFilepath));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getFileName: (filepath: string) => string | undefined = (
    filepath: string
  ) => {
    const fileNameSplit: string | undefined = filepath.split("\\").pop();
    const fileNameClear: string | undefined = fileNameSplit?.split(".")[0];
    return fileNameClear;
  };

  const openJSONFile = async () => {
    try {
      const documentPath = await documentDir();

      const jsonfilepath = (await open({
        filters: [
          {
            name: "Data file",
            extensions: ["json"],
          },
        ],
        defaultPath: `${documentPath}/TaggerAppData/data`,
      })) as string;
      const content: LinesObject[] = JSON.parse(
        await readTextFile(jsonfilepath!)
      );
      setFilePath(jsonfilepath);
      dispatch(updateLinesObject(content));
      setFileName(getFileName(jsonfilepath));
    } catch (err) {
      console.log(err);
    }
  };

  const openTagList = async () => {
    const documentPath = await documentDir();
    const jsonfilepath = (await open({
      filters: [
        {
          name: "Data file",
          extensions: ["taglist"],
        },
      ],
      defaultPath: `${documentPath}/TaggerAppData/data`,
    })) as string;

    const content: Tag[] = JSON.parse(await readTextFile(jsonfilepath!));
    const tags: Tag[] = content.map((parsedObject: Tag) => ({
      name: parsedObject.name,
      color: parsedObject.color,
      index: parsedObject.index,
    }));
    dispatch(updateTagList(tags));
  };

  const switchTabs = (index: number) => {
    switch (index) {
      case 0:
        return (
          <div>
            <div className={styles["file-container"]}>
              <button onClick={() => createNewFile()} className={styles.button}>
                New file
              </button>
              <button onClick={() => openJSONFile()} className={styles.button}>
                Open JSON file
              </button>
              <button
                onClick={() => createDataFile(linesObject)}
                className={styles.button}
              >
                Create Data File
              </button>
              <button onClick={() => openTagList()} className={styles.button}>
                Open tag list
              </button>
            </div>
            <DisplayFile saveJSON={saveJSON} />
          </div>
        );
      case 1:
        return <TagInfo />;
    }
  };
  return (
    <div className={styles["app-wrapper"]}>
      <Menu projectName={fileName!} />
      <div className={styles["container-wrapper"]}>
        <div className={styles.container}>
          <TabMenu setPageIndex={setPageIndex} />
          {switchTabs(pageIndex)}
        </div>
      </div>
    </div>
  );
};

export default MainWindow;
