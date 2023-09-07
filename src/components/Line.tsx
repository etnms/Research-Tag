import React, { useEffect, useState } from "react";
import styles from "./Line.module.scss";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { updateLinesObject } from "../features/lineObjectSlice";

interface LineProps {
  line: string;
  tags: string[];
  index: number;
  addTag: Function;
  saveJSON: Function;
}

const Line: React.FC<LineProps> = ({ line, tags, index, addTag, saveJSON }) => {
  const [selectedTag, setSelectedTag] = useState<string>("");

  const tagList: Tag[] = useAppSelector((state) => state.tagList.value);
  const linesObject: LinesObject[] = useAppSelector((state) => state.linesObject.value);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (tagList.length > 1) {
      if (selectedTag === "") setSelectedTag(tagList[0].name);
    }
  }, []);

  const handleTagSelection = () => {
    const tagValue: string = (
      document.querySelector(
        `select[name='select-tag-${index}'`
      ) as HTMLSelectElement
    ).value;
    setSelectedTag(tagValue);
  };

  const getTagColor = (input: string) => {
    const matchingTag: Tag | undefined = tagList.find(
      (tag: Tag) => tag.name === input
    );
    if (matchingTag) {
      return matchingTag.color;
    }
    // Handle the case when no matching tag is found
    return "";
  };

  const generateRandomId = () => {
    return Math.random();
  };

  const deleteTag = (index: number, tag: string) => {
    const itemToUpdateIndex: number = linesObject.findIndex(
      (linesObject) => linesObject.index === index
    );

    if (itemToUpdateIndex !== -1) {
      const updatedItem: LinesObject = { ...linesObject[itemToUpdateIndex] }; // Create a copy of the object
      const tagIndexToRemove: number = updatedItem.tags.indexOf(tag);

      if (tagIndexToRemove !== -1) {
        updatedItem.tags.splice(tagIndexToRemove, 1); // Remove the tag from the array

        // Update the linesObject array with the updated object
        const updatedLinesObject: LinesObject[] = [...linesObject];
        updatedLinesObject[itemToUpdateIndex] = updatedItem;

        dispatch(updateLinesObject(updatedLinesObject));
        //setLinesObject(updatedLinesObject);
        saveJSON();
      }
    }
  };

  return (
    <li key={index} className={styles.line}>
      <p className={styles.text}>{line}</p>
      <div className={styles["tag-section"]}>
        {tags.length === 0 ? null : (
          <div className={styles["tag-list"]}>
            <span>Tags: </span>
            {tags.map((tag: string) => (
              <span
                className={styles.tag}
                key={`${tag}-info-${index}-${generateRandomId()}`}
                style={{ backgroundColor: `${getTagColor(tag)}` }}
              >
                {tag}
                <button onClick={() => deleteTag(index, tag)}>
                  <DeleteIcon />
                </button>
              </span>
            ))}
          </div>
        )}
        {tagList.length === 0 ? null : (
          <select
            name={`select-tag-${index}`}
            className={styles.select}
            onChange={() => handleTagSelection()}
          >
            {tagList.length === 0 && ( // Check if tagList is empty
              <option value="" disabled>
                Select a tag
              </option>
            )}

            {tagList.map((tag: Tag) => (
              <option value={tag.name} key={`${tag.name}-option`}>
                {tag.name}
              </option>
            ))}
          </select>
        )}
        {tagList.length === 0 ? null : (
          <button
            onClick={() => addTag(index, selectedTag)}
            className={styles.button}
          >
            Add tag
          </button>
        )}
      </div>
    </li>
  );
};

export default Line;
