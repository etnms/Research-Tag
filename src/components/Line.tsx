import React, { useEffect, useState } from "react";
import styles from "./Line.module.scss";

interface LineProps {
  tagList: Tag[];
  line: string;
  tags: string[];
  index: number;
  addTag: Function;
}
const Line: React.FC<LineProps> = ({ tagList, line, tags, index, addTag }) => {
  const [selectedTag, setSelectedTag] = useState<string>("");

  useEffect(() => {
    if (tagList.length > 1) {
      if (selectedTag === "") setSelectedTag(tagList[0].name);
    }
  }, []);

  const handleTagSelection = () => {
    const tagValue = (
      document.querySelector(
        `select[name='select-tag-${index}'`
      ) as HTMLSelectElement
    ).value;
    setSelectedTag(tagValue);
  };

  const getTagColor = (input: string) => {
    const matchingTag = tagList.find((tag: Tag) => tag.name === input);
    if (matchingTag) {
      return matchingTag.color;
    }
    // Handle the case when no matching tag is found
    return "";
  };

  const generateRandomId = () => {
    return Math.random();
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
