import React, { useState } from "react";
import styles from "./TagList.module.scss";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { updateTagList } from "../features/tagSlice";
import CreateTag from "./CreateTag";

const TagList: React.FC = () => {
  const dispatch = useAppDispatch();
  const tagList = useAppSelector((state) => state.tagList.value);
  const [selectedTagName, setSelectedTagName] = useState<string>("");
  const [selectedTagIndex, setSelectedTagIndex] = useState<number>();

  const removeTag = (index: number) => {
    if (index === undefined) return;
    const elToRemove = tagList.find((tag: Tag) => tag.index === index);
    const filteredArray = tagList.filter((tag: Tag) => tag !== elToRemove);
    dispatch(updateTagList(filteredArray));
    closeModal();
  };

  const openModal = (index: number, name: string) => {
    const modal: HTMLDialogElement | null = document.querySelector(
      "#dialog-delete-list"
    );
    modal?.showModal();
    setSelectedTagName(name);
    setSelectedTagIndex(index);
  };

  const closeModal = () => {
    const modal: HTMLDialogElement | null = document.querySelector(
      "#dialog-delete-list"
    );
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
      <CreateTag/>
      <dialog id="dialog-delete-list" className={styles.modal}>
        <div>
          Are you sure you want to remove the following tag from the list:
        </div>
        <p>{selectedTagName}</p>
        <button onClick={() => closeModal()}>Cancel</button>
        <button onClick={() => removeTag(selectedTagIndex!)}>Confirm</button>
      </dialog>
    </>
  );
};

export default TagList;
