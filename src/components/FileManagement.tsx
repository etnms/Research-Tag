import React, { useEffect, useState } from "react";
import styles from "./FileManagement.module.scss";
import DisplayFile from "./DisplayFile";
import { useAppDispatch } from "../app/hooks";
import { open } from "@tauri-apps/api/dialog";
import {
  BaseDirectory,
  readTextFile,
  readDir,
  FileEntry,
} from "@tauri-apps/api/fs";
import { updateLinesObject } from "../features/lineObjectSlice";
import { updateTagList } from "../features/tagSlice";
import {
  updateFileName,
  updateTagListFileName,
} from "../features/fileNamesSlice";
import { getFileName } from "../utils/getFileName";
import CloseIcon from "@mui/icons-material/Close";
import {
  checkDirectory,
  clearFileName,
  openExternalFile,
  restoreBackup,
} from "../utils/directoryFunctions";
import Loader from "./Loader";

const FileManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const [listTaggerFiles, setListTaggerFiles] = useState<FileEntry[]>([]);

  const [fileType, setFiletype] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const lastProjectFileStorage: string | null =
      localStorage.getItem("last-project-file");
    if (lastProjectFileStorage !== "" && lastProjectFileStorage !== null) {
      openFile(lastProjectFileStorage!, "project");
    }

    const lastTagFileStorage: string | null =
      localStorage.getItem("last-taglist-file");
    if (lastTagFileStorage !== "" && lastTagFileStorage !== null) {
      openFile(lastTagFileStorage!, "taglist");
    }
  }, []);

  // useEffect for changing default behavior on modal
  useEffect(() => {
    const modal: HTMLDialogElement | null = document.querySelector(
      "#file-management-dialog"
    );
    // Remove default escape behavior
    const cancelEventHandler = (event: any) => {
      event.preventDefault();
      // add close modal behavior to it
      closeProjectFilesModal();
    };

    modal?.addEventListener("cancel", cancelEventHandler);

    return () => {
      modal?.removeEventListener("cancel", cancelEventHandler);
    };
  }, []);

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

      let taggerFiles: FileEntry[];
      if (filetype === "project") {
        // Get project files
        taggerFiles = files.filter((file: FileEntry) =>
          file.name!.endsWith(".tdf")
        );
      } else if (filetype === "taglist") {
        taggerFiles = files.filter((file: FileEntry) =>
          file.name!.endsWith(".taglist")
        );
      } else return;
      // Create list of files
      const newList: string[] = [];
      taggerFiles.map((element: FileEntry) => {
        newList.push(element.name!);
      });
      setListTaggerFiles(taggerFiles);

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
  const openFile = async (filePath: string, fileType: string) => {
    try {
      if (fileType === "project") {
        // Parse file
        const content: LinesObject[] = JSON.parse(
          await readTextFile(filePath!)
        );

        // Update path and create content
        dispatch(updateLinesObject(content));

        // Update file name
        const newFilename = getFileName(filePath) as string;
        dispatch(updateFileName(newFilename));
        // Store path in local storage
      } else if (fileType === "taglist") {
        // Parse file
        const content: Tag[] = JSON.parse(await readTextFile(filePath!));
        const tags: Tag[] = content.map((parsedObject: Tag) => ({
          name: parsedObject.name,
          color: parsedObject.color,
          textColor: parsedObject.textColor,
          index: parsedObject.index,
        }));

        // Gather data and update tag list with data
        const newTagListFileName = getFileName(filePath) as string;
        dispatch(updateTagListFileName(newTagListFileName));
        dispatch(updateTagList(tags));
      } else return;
      // Set local storage path
      localStorage.setItem(`last-${fileType}-file`, filePath);
      closeProjectFilesModal();
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

  const handleRestoreClick = async () => {
    try {
      setLoading(true);
      await restoreBackup();
      // Handle completion or any other logic here
    } catch (error) {
      console.error("Error during backup restoration:", error);
    } finally {
      setLoading(false);
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
            onClick={() => openProjectFiles("taglist")}
            className={styles.button}
          >
            Open tag list
          </button>
          <button className={styles.button} onClick={() => openExternalFile()}>
            Open external file
          </button>
          <button
            className={styles.button}
            onClick={() => handleRestoreClick()}
          >
            Restore backup
          </button>
        </div>
      </div>
      {loading ? <Loader title={"Loading backup. Please wait"} /> : null}
      <DisplayFile />
      <dialog id="file-management-dialog" className={styles.modal}>
        <h2 className={styles.title}>
          {fileType === "project" ? "List of projects:" : "List of tag lists:"}
        </h2>
        <ul className={styles.options}>
          {listTaggerFiles?.map((file: FileEntry, index: number) => (
            <li key={`${file}${index}`} className={styles["modal-option"]}>
              <button
                onClick={() => openFile(file.path, fileType!)}
                className={styles["btn-option"]}
              >
                {clearFileName(file.name!)}
              </button>
            </li>
          ))}
        </ul>
        <button
          onClick={() => closeProjectFilesModal()}
          className={styles["close-btn"]}
        >
          <CloseIcon />
        </button>
      </dialog>
    </div>
  );
};

export default FileManagement;
