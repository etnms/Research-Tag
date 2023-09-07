import React from "react";
import { readTextFile, writeFile } from "@tauri-apps/api/fs";
import { open, save } from "@tauri-apps/api/dialog";
import { documentDir } from "@tauri-apps/api/path";
import styles from "./CreateTag.module.scss";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { updateTagList } from "../features/tagSlice";

const CreateTag: React.FC = () => {
  const colorList = [
    "#800000",
    "#87CEEB",
    "#32CD32",
    "#FFD700",
    "#FF4500",
    "#4B0082",
    "#FA8072",
    "#D2691E",
    "#708090",
    "#000033",
    "#FFF5E1",
    "#40E0D0",
    "#00008B",
    "#E5E4E2",
    "#CD7F32",
  ];
  const dispatch = useAppDispatch();
  const tagList = useAppSelector((state) => state.tagList.value);

  const addTag = () => {
    const name: string = (
      document.querySelector('input[name="tag-input"]') as HTMLInputElement
    ).value;
    const color: string = colorList[tagList.length];
    const index: number = tagList.length;
    const newTag = { name, color, index };
    dispatch(updateTagList([...tagList, newTag]));
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
      <button onClick={() => openTagList()} className={styles.button}>
        Open tag list
      </button>
      <label htmlFor="tag-input">Create a new tag:</label>
      <input name="tag-input" className={styles["tag-input"]}></input>
      <button onClick={() => addTag()} className={styles.button}>
        Create tag
      </button>
      <button onClick={() => saveTagList(tagList)} className={styles.button}>
        Save tag list
      </button>
    </div>
  );
};

export default CreateTag;
