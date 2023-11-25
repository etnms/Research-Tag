import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../app/hooks";
import styles from "./Filter.module.scss";
import { getTagColor } from "../../utils/getTagColor";

interface FilterProps {
  filteredResults: LinesObject[];
  setFilteredResults: Function;
}
const Filter: React.FC<FilterProps> = ({ setFilteredResults }) => {
  const tagList: Tag[] = useAppSelector((state) => state.tagList.value);
  const sortedTagList: Tag[]= [...tagList].sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
  const linesObject: LinesObject[] = useAppSelector(
    (state) => state.linesObject.value
  );

  const [currentFilters, setCurrentFilters] = useState<string[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("");

  // Update selected filter to default value
  useEffect(() => {
    console.log('test')
    if (selectedFilter === "" && sortedTagList.length !== 0) {
      setSelectedFilter(sortedTagList[0].name);
    }
  }, []);

  // change results if there is a filter
  useEffect(() => {
    changeFilteredResults(currentFilters);
  }, [currentFilters]);

  const addFilter = (value: string) => {
    if (currentFilters.find((filterValue: string) => filterValue === value))
      return;
    setCurrentFilters([...currentFilters, value]);
  };

  const removeFilter = (value: string) => {
    const newFilters: string[] = currentFilters.filter(
      (item: string) => item !== value
    );
    setCurrentFilters(newFilters);
  };

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFilter(event.currentTarget.value);
  };

  const changeFilteredResults = (tags: string[]) => {
    if (tags.length === 0) setFilteredResults(linesObject);
    else {
      let currentArray: LinesObject[] = linesObject;
      tags.forEach((tag: string) => {
        currentArray = currentArray.filter((linesObject: LinesObject) =>
          linesObject.tags.includes(tag)
        );
      });
      setFilteredResults(currentArray);
    }
  };
  return sortedTagList.length !== 0 ? (
    <div className={styles.container}>
      <h3 className={styles.title}>Filter by tag</h3>
      <select
        onChange={(event) => handleChange(event)}
        className={styles.select}
      >
        {sortedTagList.map((tag: Tag) => (
          <option key={`${tag.name}-option-filter`}>{tag.name}</option>
        ))}
      </select>
      <button
        onClick={() => addFilter(selectedFilter)}
        className={styles.button}
      >
        Add filter
      </button>
      {currentFilters.length === 0 ? null : (
        <div className={styles["filter-container"]}>
          <h4 className={styles.subtitle}>Current filters:</h4>
          <ul className={styles.list}>
            {currentFilters.map((filter: string) => (
              <li className={styles["list-el"]} key={`current-filter-${filter}`}>
                <span
                  className={styles.tag}
                  style={{
                    backgroundColor: `${getTagColor(filter, sortedTagList, false)}`,
                    color: `${getTagColor(filter, sortedTagList, true)}`,
                  }}
                >
                  {filter}
                </span>
                <button
                  onClick={() => removeFilter(filter)}
                  className={styles.button}
                >
                  Remove filter
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  ) : (
    <p className={styles["no-file-text"]}>No tag file currently opened.</p>
  );
};

export default Filter;
