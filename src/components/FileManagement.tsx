import React, { useState } from "react";
import styles from "./FileManagement.module.scss";
import DisplayFile from "./DisplayFile";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { documentDir } from "@tauri-apps/api/path";
import { open, save } from "@tauri-apps/api/dialog";
import { readTextFile, writeFile } from "@tauri-apps/api/fs";
import { updateLinesObject } from "../features/lineObjectSlice";
import { updateTagList } from "../features/tagSlice";
import { updateFileName } from "../features/fileNamesSlice";

interface FileManagementProps {
  saveJSON: Function;
}
const FileManagement: React.FC<FileManagementProps> = ({ saveJSON }) => {
  const dispatch = useAppDispatch();
  const linesObject: LinesObject[] = useAppSelector(
    (state) => state.linesObject.value
  );
  const [filepath, setFilePath] = useState<string>();

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
        dispatch(updateFileName(newFilepath));
      }
    } catch (err) {
      console.log(err);
    }
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
      dispatch(updateFileName(jsonfilepath));
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

  const getFileName: (filepath: string) => string | undefined = (
    filepath: string
  ) => {
    const fileNameSplit: string | undefined = filepath.split("\\").pop();
    const fileNameClear: string | undefined = fileNameSplit?.split(".")[0];
    return fileNameClear;
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

  return (
    <div>
      <div className={styles["file-management-container"]}>
        <div className={styles["button-container"]}>
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
      </div>
      <DisplayFile saveJSON={saveJSON} />
    </div>
  );
};

export default FileManagement;
