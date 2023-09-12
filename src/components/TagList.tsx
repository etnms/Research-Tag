import React, { useState } from "react";
import styles from "./TagList.module.scss";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { updateTagList } from "../features/tagSlice";
import CreateTag from "./CreateTag";
import { saveTagList } from "../utils/writeProjectFiles";

const TagList: React.FC = () => {
  const dispatch = useAppDispatch();
  const tagList = useAppSelector((state) => state.tagList.value);
  const tagListFileName = useAppSelector(
    (state) => state.fileNames.tagListFileName
  );
  const [selectedTagName, setSelectedTagName] = useState<string>("");
  const [selectedTagIndex, setSelectedTagIndex] = useState<number>();

  const removeTag = (index: number) => {
    if (index === undefined) return;
    const elToRemove = tagList.find((tag: Tag) => tag.index === index);
    const filteredArray = tagList.filter((tag: Tag) => tag !== elToRemove);
    dispatch(updateTagList(filteredArray));
    saveTagList(filteredArray, tagListFileName);
    closeModal();
  };

  const openModal = (index: number, name: string) => {
    const modal: HTMLDialogElement | null = document.querySelector(
      "#dialog-delete-list"
    );
    modal?.classList.add(`${styles.show}`);
    modal?.showModal();
    setSelectedTagName(name);
    setSelectedTagIndex(index);
  };

  const closeModal = () => {
    const modal: HTMLDialogElement | null = document.querySelector(
      "#dialog-delete-list"
    );
    modal?.classList.remove(`${styles.show}`);
    modal?.close();
  };

  return (
    <>
      <ul className={styles.list}>
        {tagList.map((tag: Tag) => (
          <li
            key={tag.name}
            className={styles.tag}
            style={{ backgroundColor: `${tag.color}` }}
          >
            {tag.name}
            <button
              onClick={() => openModal(tag.index, tag.name)}
              className={styles.button}
            >
              <DeleteIcon />
            </button>
          </li>
        ))}
      </ul>
      <CreateTag />
      <dialog id="dialog-delete-list" className={styles.modal}>
        <div>
          Are you sure you want to remove the following tag from the list:
        </div>
        <p className={styles["selected-tag"]}>{selectedTagName}</p>
        <div className={styles["container-btns"]}>
          <button onClick={() => closeModal()} className={styles["btn-cancel"]}>
            Cancel
          </button>
          <button
            onClick={() => removeTag(selectedTagIndex!)}
            className={styles["btn-confirm"]}
          >
            Confirm
          </button>
        </div>
      </dialog>
    </>
  );
};

export default TagList;
