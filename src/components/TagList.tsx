import React, { useEffect, useState } from "react";
import styles from "./TagList.module.scss";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { updateTagList } from "../features/tagSlice";
import CreateTag from "./CreateTag";
import { getFileName } from "../utils/getFileName";
import { showModal } from "../utils/showModal";
import { saveTagList } from "../utils/directoryFunctions";

const TagList: React.FC = () => {
  const dispatch = useAppDispatch();
  const tagList = useAppSelector((state) => state.tagList.value);
  const tagListFileName = useAppSelector(
    (state) => state.fileNames.tagListFileName
  );
  const [selectedTagName, setSelectedTagName] = useState<string>("");
  const [selectedTagIndex, setSelectedTagIndex] = useState<number>();

  useEffect(() => {
    const modal: HTMLDialogElement | null = document.querySelector(
      "#dialog-delete-list"
    );
    // Remove default escape behavior
    const cancelEventHandler = (event: any) => {
      event.preventDefault();
      // add close modal behavior to it
      showModal("dialog-delete-list", `${styles.show}`);
    };

    modal?.addEventListener("cancel", cancelEventHandler);

    return () => {
      modal?.removeEventListener("cancel", cancelEventHandler);
    };
  }, []);

  const removeTag = (index: number) => {
    if (index === undefined) return;
    const elToRemove = tagList.find((tag: Tag) => tag.index === index);
    const filteredArray = tagList.filter((tag: Tag) => tag !== elToRemove);
    dispatch(updateTagList(filteredArray));
    saveTagList(filteredArray, tagListFileName);
    showModal("dialog-delete-list", `${styles.show}`);
  };

  const openModal = (index: number, name: string) => {
    showModal("dialog-delete-list", `${styles.show}`);
    setSelectedTagName(name);
    setSelectedTagIndex(index);
  };

  return (
    <>
      <h3 className={styles.subtitle}>
        Tag list ({getFileName(tagListFileName)})
      </h3>
      {tagList.length === 0 ? (
        <p className={styles.text}>Taglist is empty</p>
      ) : (
        <ul className={styles.list}>
          {tagList.map((tag: Tag) => (
            <li
              key={tag.name}
              className={styles.tag}
              style={{
                backgroundColor: `${tag.color}`,
                color: `${tag.textColor}`,
              }}
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
      )}
      <CreateTag />
      <dialog id="dialog-delete-list" className={styles.modal}>
        <div>
          Are you sure you want to remove the following tag from the list:
        </div>
        <p className={styles["selected-tag"]}>{selectedTagName}</p>
        <div className={styles["container-btns"]}>
          <button
            onClick={() => showModal("dialog-delete-list", `${styles.show}`)}
            className={styles["btn-cancel"]}
          >
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
