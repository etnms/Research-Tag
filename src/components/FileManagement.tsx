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
  deleteFile,
  openExternalFile,
  restoreBackup,
} from "../utils/directoryFunctions";
import Loader from "./Loader";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { showModal } from "../utils/showModal";

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
    const modalDeleteFile: HTMLDialogElement | null =
      document.querySelector("#modal-delete-file");
    // Remove default escape behavior
    const cancelEventHandler = (event: Event, modalName: string) => {
      event.preventDefault();
      // add close modal behavior to it
      showModal(`${modalName}`, styles.show);
    };

    modal?.addEventListener("cancel", (e) =>
      cancelEventHandler(e, "file-management-dialog")
    );
    modalDeleteFile?.addEventListener("cancel", (e) =>
      cancelEventHandler(e, "modal-delete-file")
    );

    return () => {
      modal?.removeEventListener("cancel", (e) =>
        cancelEventHandler(e, "file-management-dialog")
      );
      modalDeleteFile?.removeEventListener("cancel", (e) =>
        cancelEventHandler(e, "modal-delete-file")
      );
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
      showModal("file-management-dialog", styles.show);
    } catch (err) {
      console.error(err);
    }
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

  const [toDelFile, setToDelFile] = useState<string>();

  const openDeleteModal = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const fileName = getFileName(
      event.currentTarget.getAttribute("data-btn-name")!
    );
    setToDelFile(fileName);
    showModal("modal-delete-file", styles.show);
  };

  const deleteFileFromProjectList = async () => {
    try {
      setLoading(true);
      await deleteFile(toDelFile!, fileType!);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      showModal("modal-delete-file", styles.show);
      showModal("file-management-dialog", styles.show);
      openProjectFiles(fileType!);
    }
  };

  return (
    <div className={styles.container}>
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
            <li
              key={`${file}${index}-list-project`}
              className={styles["modal-option"]}
            >
              <button
                onClick={() => openFile(file.path, fileType!)}
                className={styles["btn-option"]}
              >
                {clearFileName(file.name!)}
              </button>
              <button
                className={styles["remove-file-btn"]}
                onClick={(e) => openDeleteModal(e)}
                data-btn-name={`${file.name!}`}
              >
                <DeleteForeverIcon />
              </button>
            </li>
          ))}
        </ul>
        <button
          onClick={() => showModal("file-management-dialog", styles.show)}
          className={styles["close-btn"]}
        >
          <CloseIcon />
        </button>
      </dialog>
      <dialog id="modal-delete-file" className={styles.modal}>
        <div className={styles["delete-modal"]}>
          <p>Are you sure you want to delete this file</p>
          <p className={styles["delete-text"]}>{toDelFile}</p>
          <div className={styles["container-btn"]}>
            <button
              onClick={() => showModal("modal-delete-file", styles.show)}
              className={styles["btn-cancel"]}
            >
              Cancel
            </button>
            <button
              className={styles["btn-confirm"]}
              onClick={() => deleteFileFromProjectList()}
            >
              Confirm
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default FileManagement;
