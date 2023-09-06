import React, { useEffect, useState } from "react";
import styles from "./Line.module.scss";
import DeleteIcon from "@mui/icons-material/Delete";

interface LineProps {
  tagList: Tag[];
  line: string;
  tags: string[];
  index: number;
  addTag: Function;
  linesObject: LinesObject[];
  setLinesObject: Function;
  saveJSON: Function;
}
const Line: React.FC<LineProps> = ({
  tagList,
  line,
  tags,
  index,
  addTag,
  linesObject,
  setLinesObject,
  saveJSON
}) => {
  const [selectedTag, setSelectedTag] = useState<string>("");

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
    const matchingTag: Tag | undefined = tagList.find((tag: Tag) => tag.name === input);
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
    
        setLinesObject(updatedLinesObject);
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
