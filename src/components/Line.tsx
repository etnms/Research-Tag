import React, { useEffect, useState } from "react";
import styles from "./Line.module.scss";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { addTagToArray, removeTagFromArray } from "../features/lineObjectSlice";
import { getTagColor } from "../utils/getTagColor";

interface LineProps {
  line: string;
  tags: Tag[];
  index: number;
}

const Line: React.FC<LineProps> = ({ line, tags, index }) => {
  const [selectedTag, setSelectedTag] = useState<string>("");

  const tagList: Tag[] = useAppSelector((state) => state.tagList.value);
  const sortedTagList: Tag[] = [...tagList].sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
  const dispatch = useAppDispatch();

  
  useEffect(() => {
    if (selectedTag === "") {
      if (sortedTagList.length > 0) {
        setSelectedTag(sortedTagList[0].name);
      }
    }
    if (!checkTagExist(sortedTagList, selectedTag)) {
      if (sortedTagList.length > 0) {
        setSelectedTag(sortedTagList[0].name);
      }
    }
  }, [tagList]);

  const checkTagExist = (sortedTagList: Tag[], value: string) => {
    sortedTagList.forEach((tag: Tag) => {
      if (tag.name === value) return true;
    });
    return false;
  };

  const addTag = (index: number, tag: string) => {
    const tagExists = tags.find((tagItem: Tag) => tagItem.name === tag);
    if (tagExists) return;
    const newTag = tagList.find((tag: Tag) => tag.name === selectedTag)
    if (newTag) {
      // Dispatch the action with the matching Tag object
      dispatch(addTagToArray({ index, tag: newTag }));
    }
  };

  const deleteTag = (index: number, tagToRemove: Tag) => {
    dispatch(removeTagFromArray({ index, tagToRemove }));
  };

  return (
    <li key={"line" + index} className={styles.line}>
      <p className={styles.text}>{line}</p>
      <div className={styles["tag-section"]}>
        {tags.length === 0 ? null : (
          <div className={styles["tag-list"]}>
            <span>Tags: </span>
            {tags.map((tag: Tag) => (
              <span
                className={styles.tag}
                key={`${tag.name}-info-${index}-${line}`}
                style={{
                  backgroundColor: `${getTagColor(tag.id, sortedTagList, false)}`,
                  color: `${getTagColor(tag.id, sortedTagList, true)}`,
                }}
              >
                {tag.name}
                <button
                  onClick={() => deleteTag(index, tag)}
                  className={styles["delete-btn"]}
                >
                  <DeleteIcon />
                </button>
              </span>
            ))}
          </div>
        )}
        {sortedTagList.length === 0 ? null : (
          <select
            name={`select-tag-${index}`}
            className={styles.select}
            onChange={(event) => setSelectedTag(event.target.value)}
            value={selectedTag}
          >
            {sortedTagList.map((tag: Tag) => (
              <option value={tag.name} key={`${tag.name}-option`}>
                {tag.name}
              </option>
            ))}
          </select>
        )}
        {sortedTagList.length === 0 ? null : (
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
