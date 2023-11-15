import React, { useEffect, useState } from "react";
import styles from "./CreateTag.module.scss";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { updateTagList } from "../features/tagSlice";
import { colorList, colorTextList } from "../utils/colorList";
import { updateTagListFileName } from "../features/fileNamesSlice";
import { showModal } from "../utils/showModal";
import { checkDirectory, saveTagList } from "../utils/directoryFunctions";
import { BaseDirectory, FileEntry, readDir } from "@tauri-apps/api/fs";

const CreateTag: React.FC = () => {
  const dispatch = useAppDispatch();
  const tagList = useAppSelector((state) => state.tagList.value);
  const tagListFileName = useAppSelector(
    (state) => state.fileNames.tagListFileName
  );
  const [errorMsgVisibility, setErrorMsgVisibility] = useState<boolean>(false);
  const [newTagListNameError, setNewTagListNameError] =
    useState<boolean>(false);

  useEffect(() => {
    const modal: HTMLDialogElement | null = document.querySelector(
      "#create-new-tag-list"
    );
    // Remove default escape behavior
    const cancelEventHandler = (event: any) => {
      event.preventDefault();
      // add close modal behavior to it
      showModal("create-new-tag-list", `${styles.show}`);
    };

    modal?.addEventListener("cancel", cancelEventHandler);

    return () => {
      modal?.removeEventListener("cancel", cancelEventHandler);
    };
  }, []);

  const addTag = () => {
    const name: string = (
      document.querySelector('input[name="tag-input"]') as HTMLInputElement
    ).value;
    let color: string;
    let textColor: string;

    colorList.length > tagList.length
      ? (color = colorList[tagList.length])
      : (color = colorList[tagList.length % colorList.length]);
    colorTextList.length > tagList.length
      ? (textColor = colorTextList[tagList.length])
      : (textColor = colorTextList[tagList.length % colorTextList.length]);

    const index: number = tagList.length;
    const newTag = { name, color, textColor, index };

    // Check to see if tag already exists
    const tagExists: Tag | undefined = tagList.find(
      (tag: Tag) => tag.name === name
    );
    if (tagExists === undefined) {
      (
        document.querySelector('input[name="tag-input"]') as HTMLInputElement
      ).value = "";
      dispatch(updateTagList([...tagList, newTag]));
      saveTagList([...tagList, newTag], tagListFileName);
    } else {
      setErrorMsgVisibility(true);
      return;
    }
  };

  const createNewTagList = async () => {
    // create default values and name
    const newTagList: Tag[] = [];
    const name = (
      document.querySelector("input[name='input-taglist']") as HTMLInputElement
    ).value;
    // Check if taglist with same name already exists
    const tagListExists: boolean | undefined = await checkTagListExists(name);
    if (tagListExists) {
      return;
    } else {
      // Update state
      dispatch(updateTagList(newTagList));
      dispatch(updateTagListFileName(name));
      // Create file
      saveTagList(newTagList, name);
      // Reset input to empty
      (
        document.querySelector(
          "input[name='input-taglist']"
        ) as HTMLInputElement
      ).value = "";
      showModal("create-new-tag-list", `${styles.show}`);
    }
  };

  const checkTagListExists = async (name: string) => {
    await checkDirectory();
    // Get list of files
    const files: FileEntry[] = await readDir("ResearchTagData/data", {
      dir: BaseDirectory.Document,
      recursive: true,
    });
    const fileAlreadyExists: FileEntry | undefined = files.find(
      (file: FileEntry) => file.name === `${name}.taglist`
    );

    if (fileAlreadyExists) {
      setNewTagListNameError(true);
      return true;
    }
    return false;
  };

  return (
    <>
      <div className={styles.container}>
        <label htmlFor="tag-input" className={styles.text}>
          Create a new tag:
        </label>
        <input
          name="tag-input"
          className={styles["tag-input"]}
          onChange={() => setErrorMsgVisibility(false)}
        ></input>
        <button onClick={() => addTag()} className={styles.button}>
          Add tag
        </button>
        <button
          onClick={() => {
            showModal("create-new-tag-list", `${styles.show}`);
          }}
          className={styles.button}
        >
          New tag list
        </button>
        {errorMsgVisibility ? (
          <p className={styles["error-text"]}>
            Error: This tag is already in the list.
          </p>
        ) : null}
      </div>
      <dialog id="create-new-tag-list" className={styles.dialog}>
        <h2>Create a new tag list:</h2>
        <input
          name="input-taglist"
          onChange={() => setNewTagListNameError(false)}
        ></input>
        <div className={styles["btn-container"]}>
          <button
            onClick={() => showModal("create-new-tag-list", `${styles.show}`)}
            className={styles["btn-cancel"]}
          >
            Cancel
          </button>
          <button
            onClick={() => createNewTagList()}
            className={styles["btn-confirm"]}
          >
            Create
          </button>
        </div>
        {newTagListNameError ? (
          <p className={styles["error-text"]}>
            Error: this tag list already exists.
          </p>
        ) : null}
      </dialog>
    </>
  );
};

export default CreateTag;
