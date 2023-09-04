import React from "react";
import styles from "./TagList.module.scss";

interface TagListProps {
  tagList: Tag[];
}

const TagList: React.FC<TagListProps> = ({ tagList }) => {
  return (
    <ul className={styles.list}>
      {tagList.map((tag: Tag) => (
        <li
          key={tag.name}
          className={styles.tag}
          style={{ backgroundColor: `${tag.color}` }}
        >
          {tag.name}
        </li>
      ))}
    </ul>
  );
};

export default TagList;
