import React from "react";
import styles from "./TagList.module.scss";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { updateTagList } from "../features/tagSlice";

const TagList: React.FC = () => {
  const dispatch = useAppDispatch();
  const tagList = useAppSelector((state) => state.tagList.value);

  const removeTag = (index: number) => {
    const elToRemove = tagList.find((tag: Tag) => tag.index === index);
    const filteredArray = tagList.filter((tag: Tag) => tag !== elToRemove);
    dispatch(updateTagList(filteredArray));
  };


  return (
    <ul className={styles.list}>
      {tagList.map((tag: Tag) => (
        <li
          key={tag.name}
          className={styles.tag}
          style={{ backgroundColor: `${tag.color}` }}
        >
          {tag.name}
          <button
            onClick={() => removeTag(tag.index)}
            className={styles.button}
          >
            <DeleteIcon />
          </button>
        </li>
      ))}
    </ul>
  );
};

export default TagList;
