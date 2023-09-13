import React from "react";
import styles from "./Menu.module.scss";
import TagList from "./TagList";

interface MenuProps {
  projectName: string;
}

const Menu: React.FC<MenuProps> = ({ projectName }) => {
  
  return (
    <div className={styles.menu}>
      <h2 className={styles.title}>Menu</h2>
      {projectName !== "" ? (
        <span className={styles.text}>Current project: {projectName}</span>
      ) : null}
      <TagList />
    </div>
  );
};

export default Menu;
