import React, { useState } from "react";
import { writeFile } from "@tauri-apps/api/fs";
import { save } from "@tauri-apps/api/dialog";
import styles from "./CreateTag.module.scss";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { updateTagList } from "../features/tagSlice";
import { colorList } from "../utils/colorList";

const CreateTag: React.FC = () => {

  const dispatch = useAppDispatch();
  const tagList = useAppSelector((state) => state.tagList.value);
  const [errorMsgVisibility, setErrorMsgVisibility] = useState<boolean>(false);

  const addTag = () => {
    const name: string = (
      document.querySelector('input[name="tag-input"]') as HTMLInputElement
    ).value;
    const color: string = colorList[tagList.length];
    const index: number = tagList.length;
    const newTag = { name, color, index };

    // Check to see if tag already exists
    const tagExists: Tag | undefined = tagList.find(
      (tag: Tag) => tag.name === name
    );
    if (tagExists === undefined) {
      (
        document.querySelector('input[name="tag-input"]') as HTMLInputElement
      ).value = "";
      dispatch(updateTagList([...tagList, newTag]));
    } else {
      setErrorMsgVisibility(true);
      return;
    }
  };

  const handleChangeInput = () => {
    setErrorMsgVisibility(false);
  };

  const saveTagList = async (taglist: Tag[]) => {
    const filePath: string | null = await save({
      filters: [
        {
          name: "Tag list",
          extensions: ["taglist"],
        },
      ],
    });
    await writeFile({
      contents: `${JSON.stringify(taglist, null, 2)}`,
      path: filePath!,
    });
  };

  return (
    <div className={styles.container}>
      <label htmlFor="tag-input" className={styles.text}>Create a new tag:</label>
      <input name="tag-input" className={styles["tag-input"]} onChange={() => handleChangeInput()}></input>
      <button onClick={() => addTag()} className={styles.button}>
        Add tag
      </button>
      <button onClick={() => saveTagList(tagList)} className={styles.button}>
        Save tag list
      </button>
      {errorMsgVisibility ? (
        <p className={styles["error-text"]}>
          Error: This tag is already in the list.
        </p>
      ) : null}
    </div>
  );
};

export default CreateTag;
