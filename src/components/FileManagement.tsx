import React, { useState } from "react";
import styles from "./FileManagement.module.scss";
import DisplayFile from "./DisplayFile";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { documentDir } from "@tauri-apps/api/path";
import { open, save } from "@tauri-apps/api/dialog";
import {
  BaseDirectory,
  createDir,
  readTextFile,
  writeFile,
  readDir,
  FileEntry,
  exists,
} from "@tauri-apps/api/fs";
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

  const [listTaggerFiles, setListTaggerFiles] = useState<FileEntry[]>([]);
  const [listFiles, setListFiles] = useState<string[]>();

  const createNewFile = async () => {
    try {
      await checkDirectory();
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
        const fileName = getFileName(newFilepath) as string;
        dispatch(updateFileName(fileName));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const checkDirectory = async () => {
    try {
      const directoryExists: boolean = await exists("TaggerAppData/data", {
        dir: BaseDirectory.Document,
      });
      if (!directoryExists) {
        createDataFolder();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const createDataFolder = async () => {
    try {
      await createDir("TaggerAppData/data", {
        dir: BaseDirectory.Document,
        recursive: true,
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Open list of all project files
  const openProjectFiles = async () => {
    // Make sure there is a file directory or else create one
    try {
      await checkDirectory();
      // Get list of files
      const files: FileEntry[] = await readDir("TaggerAppData/data", {
        dir: BaseDirectory.Document,
        recursive: true,
      });

      // Get project files
      const taggerFiles: FileEntry[] = files.filter((file: FileEntry) =>
        file.name!.endsWith(".tdf")
      );

      // Create list of files
      const newList: string[] = [];
      taggerFiles.map((element: FileEntry) => {
        newList.push(element.name!);
      });
      setListFiles(newList);
      setListTaggerFiles(taggerFiles);

      // Show modal
      const modal: HTMLDialogElement | null = document.querySelector(
        "#file-management-dialog"
      );
      modal?.show();
    } catch (err) {
      console.error(err);
    }
  };

  // Open project file
  const openFile = async (file: FileEntry) => {
    const filePath = `${file.path}`;
    try {
      const content: LinesObject[] = JSON.parse(await readTextFile(filePath!));
      // Update path and create content
      setFilePath(filePath);
      dispatch(updateLinesObject(content));
      // Update file name
      const newFilename = getFileName(filePath) as string;
      dispatch(updateFileName(newFilename));
      closeProjectFilesModal();
    } catch (err) {
      console.error(err);
    }
  };

  // Open tag list files
  const openTagListFiles = async () => {};

  const openTagList = async () => {
    try {
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
    } catch (err) {
      console.error(err);
    }
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
            extensions: ["tdf"],
          },
        ],
      });
      await writeFile({
        contents: `${JSON.stringify(lineObject, null, 2)}`,
        path: path!,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const closeProjectFilesModal = () => {
    const modal: HTMLDialogElement | null = document.querySelector(
      "#file-management-dialog"
    );
    modal?.close();
  };

  return (
    <div>
      <div className={styles["file-management-container"]}>
        <div className={styles["button-container"]}>
          <button onClick={() => createNewFile()} className={styles.button}>
            New file
          </button>
          <button onClick={() => openProjectFiles()} className={styles.button}>
            Open project file
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
      <dialog id="file-management-dialog" className={styles.modal}>
        {listTaggerFiles?.map((file: FileEntry, index: number) => (
          <li key={`${file}${index}`}>
            <button onClick={() => openFile(file)}>{file.name}</button>
          </li>
        ))}
        <button onClick={() => closeProjectFilesModal()}>close</button>
        <button onClick={() => checkDirectory()}>Testing</button>
      </dialog>
    </div>
  );
};

export default FileManagement;
