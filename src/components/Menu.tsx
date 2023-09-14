import React, { useState } from "react";
import styles from "./Menu.module.scss";
import TagList from "./TagList";

interface MenuProps {
  projectName: string;
}

const Menu: React.FC<MenuProps> = ({ projectName }) => {
  const [isMenuSmall, setMenuSmall] = useState<boolean>(false);

  const toggleMenuSize = () => {
    console.log(isMenuSmall);
    setMenuSmall(!isMenuSmall);
  };

  return (
    <div className={`${styles.menu} ${isMenuSmall ? styles["small-menu"] : ""}`}>
      <button className={styles.toggleButton} onClick={toggleMenuSize}>
        Toggle Menu Size
      </button>
      <h2 className={styles.title}>Menu</h2>
      {projectName !== "" ? (
        <span className={styles.text}>Current project: {projectName}</span>
      ) : null}
      <TagList />
    </div>
  );
};

export default Menu;
