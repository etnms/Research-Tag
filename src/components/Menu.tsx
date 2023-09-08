import React from "react";
import styles from "./Menu.module.scss";
import TagList from "./TagList";
import { useAppSelector } from "../app/hooks";

interface MenuProps {
  projectName: string;
}

const Menu: React.FC<MenuProps> = ({ projectName }) => {
  const tagList = useAppSelector((state) => state.tagList.value);
  return (
    <div className={styles.menu}>
      <h2 className={styles.title}>Menu</h2>
      {projectName === ""? <span className={styles.text}>Current project: {projectName}</span> : null}
      {tagList.length > 0 ? (
        <>
          <h3 className={styles.subtitle}>Tag list</h3>
          <TagList />
        </>
      ) : (
        <p className={styles.text}>No tag list open</p>
      )}
    </div>
  );
};

export default Menu;
