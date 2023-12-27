import React, { useEffect, useState } from "react";
import styles from "./TagList.module.scss";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { updateTagList } from "../features/tagSlice";
import CreateTag from "./CreateTag";
import { getFileName } from "../utils/getFileName";
import { showModal } from "../utils/showModal";
import { saveTagList } from "../utils/directoryFunctions";
import { updateLinesObject } from "../features/lineObjectSlice";

const TagList: React.FC = () => {
  const dispatch = useAppDispatch();
  const tagList: Tag[] = useAppSelector((state) => state.tagList.value);
  const sortedTagList: Tag[]= [...tagList].sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
  const tagListFileName = useAppSelector(
    (state) => state.fileNames.tagListFileName
  );
  const [selectedTagName, setSelectedTagName] = useState<string>("");
  const [selectedTagId, setSelectedTagId] = useState<string>("");
  const [newName, setNewName] = useState<string>("");

  // Line object for sole purpose of updating tag values when tag name is changed
  const linesObject: LinesObject[] = useAppSelector(
    (state) => state.linesObject.value
  );

  useEffect(() => {
    const modalDelete: HTMLDialogElement | null = document.querySelector("#dialog-delete-list");
    const modalEdit: HTMLDialogElement | null = document.querySelector("#dialog-edit-tag");
  
    // Remove default escape behavior
    const cancelEventHandler = (event: Event) => {
      event.preventDefault();
  
      // Extract modal name from the event
      const modalName = (event as CustomEvent)?.detail?.modalName;
  
      // Check which modal triggered the event
      if (modalName === "dialog-delete-list") {
        showModal("dialog-delete-list", `${styles.show}`);
      } else if (modalName === "dialog-edit-tag") {
        showModal("dialog-edit-tag", `${styles.show}`);
      }
    };
  
    // Create CustomEvent with modal name
    const cancelEvent = new CustomEvent("cancel", {
      detail: {
        modalName: "dialog-delete-list",
      },
    });

    modalDelete?.addEventListener("cancel", cancelEventHandler);
    modalDelete?.dispatchEvent(cancelEvent);
    modalEdit?.addEventListener("cancel", cancelEventHandler);
    modalEdit?.dispatchEvent(cancelEvent);
  
    return () => {
      modalDelete?.removeEventListener("cancel", cancelEventHandler);
      modalEdit?.removeEventListener("cancel", cancelEventHandler)
    };
  }, []);

  const removeTag = (tagId: string) => {
    if (tagId === undefined) return;
    const elToRemove: Tag | undefined = tagList.find((tag: Tag) => tag.id === tagId);
    const filteredArray: Tag[] = tagList.filter((tag: Tag) => tag !== elToRemove);
    dispatch(updateTagList(filteredArray));
    saveTagList(filteredArray, tagListFileName);
    showModal("dialog-delete-list", `${styles.show}`);
  };

  const editTagName = (name: string, id: string) => {
    if (id === undefined) return;
    const indexToUpdate: number = tagList.findIndex((tag: Tag) => tag.id === id);

    if (indexToUpdate !== -1) {
      // Create a new array with the updated tag
      const updatedTagList: Tag[] = [...tagList];
      updatedTagList[indexToUpdate] = {
        ...updatedTagList[indexToUpdate],
        name: name,
      };
  
      // Dispatch the action to update the Redux store
      dispatch(updateTagList(updatedTagList));
  
      // Save the updated tag list
      saveTagList(updatedTagList, tagListFileName);
      // Update all tags in file to match
      updateCurrentProjectTagNames()
    }
    showModal("dialog-edit-tag", `${styles.show}`);
  }

  // Function that goes through each line and updates the tag that has been modified in tag list if it was already 
  // mentioned under a different name
  const updateCurrentProjectTagNames = () => {
    const updatedLinesObject: LinesObject[] = linesObject.map((obj) => {
      const updatedTags: Tag[] = obj.tags.map((tag) => {
        // Update the tag name based on some condition
        if (tag.name === selectedTagName) {
          return { ...tag, name: newName };
        } else {
          return tag;
        }
      });
  
      // Return the updated object with the modified tags array
      return { ...obj, tags: updatedTags };
    });
  
    // Dispatch the action to update the Redux store
    dispatch(updateLinesObject(updatedLinesObject));
  }

  const handleChange = (event: any) => {
    setNewName(event.target.value);
  }


  const openModal = (id: string, name: string, modalName: string) => {
    showModal(modalName, `${styles.show}`);
    setSelectedTagName(name);
    setSelectedTagId(id);
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
          {sortedTagList.map((tag: Tag) => (
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
                onClick={() => openModal(tag.id, tag.name, "dialog-delete-list")}
                className={styles.button}
              >
                <DeleteIcon />
              </button>
              <button
                onClick={() => openModal(tag.id, tag.name, "dialog-edit-tag")}
                className={styles.button}
              >
                <EditIcon />
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
            onClick={() => removeTag(selectedTagId!)}
            className={styles["btn-confirm"]}
          >
            Confirm
          </button>
        </div>
      </dialog>
      <dialog id="dialog-edit-tag" className={styles.modal}>
      <p className={styles["selected-tag"]}>Old tag name: {selectedTagName}</p>
      <p className={styles["selected-tag"]}>New tag name:</p>
        <input type="text" className={styles["edit-input"]} onChange={(e) => handleChange(e)}/>
        <div className={styles["container-btns"]}>
          <button
            onClick={() => showModal("dialog-edit-tag", `${styles.show}`)}
            className={styles["btn-cancel"]}
          >
            Cancel
          </button>
          <button
            onClick={() => editTagName(newName, selectedTagId)}
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
