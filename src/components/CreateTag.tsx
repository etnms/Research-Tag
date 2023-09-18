import React, { useState } from "react";
import styles from "./CreateTag.module.scss";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { updateTagList } from "../features/tagSlice";
import { colorList, colorTextList } from "../utils/colorList";
import { saveTagList } from "../utils/writeProjectFiles";
import { updateTagListFileName } from "../features/fileNamesSlice";
import { showModal } from "../utils/showModal";

const CreateTag: React.FC = () => {
  const dispatch = useAppDispatch();
  const tagList = useAppSelector((state) => state.tagList.value);
  const tagListFileName = useAppSelector(
    (state) => state.fileNames.tagListFileName
  );
  const [errorMsgVisibility, setErrorMsgVisibility] = useState<boolean>(false);

  const addTag = () => {
    const name: string = (
      document.querySelector('input[name="tag-input"]') as HTMLInputElement
    ).value;
    const color: string = colorList[tagList.length];
    const textColor: string = colorTextList[tagList.length];
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

  const createNewTagList = () => {
    // create default values and name
    const newTagList: Tag[] = [];
    const name = (
      document.querySelector("input[name='input-taglist']") as HTMLInputElement
    ).value;
    // Update state
    dispatch(updateTagList(newTagList));
    dispatch(updateTagListFileName(name));
    // Create file
    saveTagList(newTagList, name);
    // Reset input to empty
    (
      document.querySelector("input[name='input-taglist']") as HTMLInputElement
    ).value = "";
    showModal("create-new-tag-list");
  };

  const checkTagListExists = async () => {
    
  }

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
            showModal("create-new-tag-list");
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
        <input name="input-taglist"></input>
        <button onClick={() => showModal("create-new-tag-list")}>Cancel</button>
        <button onClick={() => createNewTagList()}>Create</button>
        <p>Error: this tag list already exists</p>
      </dialog>
    </>
  );
};

export default CreateTag;
