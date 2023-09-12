import React from "react";
import styles from "./Menu.module.scss";
import TagList from "./TagList";
import { useAppSelector } from "../app/hooks";
import Filter from "./Filter/Filter";

interface MenuProps {
  projectName: string;
}

const Menu: React.FC<MenuProps> = ({ projectName }) => {
  const tagList = useAppSelector((state) => state.tagList.value);

  return (
    <div className={styles.menu}>
      <h2 className={styles.title}>Menu</h2>
      {projectName !== "" ? (
        <span className={styles.text}>Current project: {projectName}</span>
      ) : null}

      <h3 className={styles.subtitle}>Tag list</h3>
      <TagList />
    </div>
  );
};

export default Menu;
