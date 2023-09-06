import React from "react";
import styles from "./Menu.module.scss";
import TagList from "./TagList";

interface MenuProps {
  tagList: Tag[];
  projectName: string;
  setTagList: Function;
}

const Menu: React.FC<MenuProps> = ({ tagList, projectName, setTagList }) => {
  return (
    <div className={styles.menu}>
      <h2 className={styles.title}>Menu</h2>
      <span className={styles.text}>Current project: {projectName}</span>
      <h3 className={styles.subtitle}>Tag list</h3>
      <TagList tagList={tagList} setTagList={setTagList} />
    </div>
  );
};

export default Menu;
