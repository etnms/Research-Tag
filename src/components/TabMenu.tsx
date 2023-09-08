import React from "react";
import styles from "./TabMenu.module.scss";

interface TabMenuProps {
  setPageIndex: Function;
}
const TabMenu: React.FC<TabMenuProps> = ({ setPageIndex }) => {
  const changePageIndex = (
    index: number,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setPageIndex(index);
    // Styling
    const tabElements = document.querySelectorAll(`.${styles.tab}`);

    tabElements.forEach((el) => {
      el.classList.remove(`${styles["active-tab"]}`);
    });

    const selectedButton = event.currentTarget.classList;
    selectedButton.add(`${styles["active-tab"]}`);
  };
  return (
    <nav className={styles.nav}>
      <button
        onClick={(event) => changePageIndex(0, event)}
        className={`${styles.tab} ${styles["active-tab"]} `}
      >
        File
      </button>
      <button
        onClick={(event) => changePageIndex(1, event)}
        className={styles.tab}
      >
        Tag information
      </button>
    </nav>
  );
};

export default TabMenu;
