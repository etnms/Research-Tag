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

  const [fileType, setFiletype] = useState<string>();

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
  const openProjectFiles = async (filetype: string) => {
    setFiletype(filetype);
    // Make sure there is a file directory or else create one
    try {
      await checkDirectory();
      // Get list of files
      const files: FileEntry[] = await readDir("TaggerAppData/data", {
        dir: BaseDirectory.Document,
        recursive: true,
      });

      if (filetype === "project") {
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
      } else if (filetype === "taglist") {
        const taggerFiles: FileEntry[] = files.filter((file: FileEntry) =>
          file.name!.endsWith(".taglist")
        );

        // Create list of files
        const newList: string[] = [];
        taggerFiles.map((element: FileEntry) => {
          newList.push(element.name!);
        });
        setListFiles(newList);
        setListTaggerFiles(taggerFiles);
      } else return;

      // Show modal
      const modal: HTMLDialogElement | null = document.querySelector(
        "#file-management-dialog"
      );
      modal?.classList.add(`${styles.show}`);
      modal?.showModal();
    } catch (err) {
      console.error(err);
    }
  };

  // Open project file
  const openFile = async (file: FileEntry, fileType: string) => {
    const filePath = `${file.path}`;
    try {
      if (fileType === "project") {
        const content: LinesObject[] = JSON.parse(
          await readTextFile(filePath!)
        );
        // Update path and create content
        setFilePath(filePath);
        dispatch(updateLinesObject(content));
        // Update file name
        const newFilename = getFileName(filePath) as string;
        dispatch(updateFileName(newFilename));
      } else if (fileType === "taglist") {
        const content: Tag[] = JSON.parse(await readTextFile(filePath!));
        const tags: Tag[] = content.map((parsedObject: Tag) => ({
          name: parsedObject.name,
          color: parsedObject.color,
          index: parsedObject.index,
        }));
        dispatch(updateTagList(tags));
      } else return;
      closeProjectFilesModal();
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
    modal?.classList.remove(`${styles.show}`);
  };

  const clearFileName = (name: string) => {
    if (name.endsWith(".tdf")) {
      return name.split(".tdf");
    } else if (name.endsWith(".taglist")) {
      return name.split(".taglist");
    }
  };

  return (
    <div>
      <div className={styles["file-management-container"]}>
        <div className={styles["button-container"]}>
          <button onClick={() => createNewFile()} className={styles.button}>
            New file
          </button>
          <button
            onClick={() => openProjectFiles("project")}
            className={styles.button}
          >
            Open project file
          </button>
          <button
            onClick={() => createDataFile(linesObject)}
            className={styles.button}
          >
            Create Data File
          </button>
          <button
            onClick={() => openProjectFiles("taglist")}
            className={styles.button}
          >
            Open tag list
          </button>
          <button className={styles.button}>Restore backup</button>
        </div>
      </div>
      <DisplayFile saveJSON={saveJSON} />
      <dialog id="file-management-dialog" className={styles.modal}>
        <h2 className={styles.title}>
          {fileType === "project" ? "List of projects:" : "List of tag lists:"}
        </h2>
        <ul className={styles.options}>
          {listTaggerFiles?.map((file: FileEntry, index: number) => (
            <li key={`${file}${index}`} className={styles["modal-option"]}>
              <button
                onClick={() => openFile(file, fileType!)}
                className={styles["btn-option"]}
              >
                {clearFileName(file.name!)}
              </button>
            </li>
          ))}
        </ul>
        <button
          onClick={() => closeProjectFilesModal()}
          className={`${styles.button} ${styles["close-btn"]}`}
        >
          close
        </button>
      </dialog>
    </div>
  );
};

export default FileManagement;
