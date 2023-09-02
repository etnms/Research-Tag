import React, { useState } from "react";
import styles from "./Line.module.css";

interface LineProps {
  tagList: Tag[];
  line: string;
  tags: string[];
  index: number;
  addTagsTest: Function;
}
const Line: React.FC<LineProps> = ({
  tagList,
  line,
  tags,
  index,
  addTagsTest,
}) => {
  const [selectedTag, setSelectedTag] = useState<string>("");

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
      console.log(matchingTag.color);
      return matchingTag.color;
    }
    // Handle the case when no matching tag is found
    return "";
  };

  return (
    <li key={index} className={styles.line}>
      <p className={styles.text}>{line}</p>
      <div className={styles["tag-section"]}>
        <div className={styles["tag-list"]}>
          {tags.map((tag: string) => (
            <span
              className={styles.tag}
              key={`${tag + line}`}
              style={{ backgroundColor: `${getTagColor(tag)}` }}
            >
              {tag}
            </span>
          ))}
        </div>
        <select
          name={`select-tag-${index}`}
          onChange={() => handleTagSelection()}
        >
          {tagList.map((tag: Tag) => (
            <option value={tag.name} key={`${tag.name}-option`}>
              {tag.name}
            </option>
          ))}
        </select>
        <button onClick={() => addTagsTest(index, selectedTag)}>Add tag</button>
      </div>
    </li>
  );
};

export default Line;
