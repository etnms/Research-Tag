import React from "react";
import styles from "./Menu.module.scss";
import TagList from "./TagList";
import MenuIcon from '@mui/icons-material/Menu';

interface MenuProps {
  projectName: string;
  isMenuSmall: boolean;
  toggleMenuSize: Function;
}

const Menu: React.FC<MenuProps> = ({ projectName, isMenuSmall, toggleMenuSize }) => {

  return (
    <div className={`${styles.menu} ${isMenuSmall ? styles["small-menu"] : ""}`}>
      <button className={styles["toggle-button"]} onClick={() => toggleMenuSize()}>
        <MenuIcon/>
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
