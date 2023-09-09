import React, { useEffect, useState } from "react";
import { useAppSelector } from "../app/hooks";

interface FilterProps {
  filteredResults: LinesObject[];
  setFilteredResults: Function;
}
const Filter: React.FC<FilterProps> = ({
  filteredResults,
  setFilteredResults,
}) => {
  const tagList = useAppSelector((state) => state.tagList.value);

  const linesObject: LinesObject[] = useAppSelector(
    (state) => state.linesObject.value
  );

  const [currentFilters, setCurrentFilters] = useState<string[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("");

  useEffect(() => {
    console.log('selectedfilter debug')
    if (selectedFilter === "" && tagList.length !== 0) {
      setSelectedFilter(tagList[0].name);
    }
  }, []);

  useEffect(() => {
    console.log('currentfilter debug')
    if (currentFilters.length > 0) changeFilteredResults(currentFilters);
  }, []);

  useEffect(() => {
    changeFilteredResults(currentFilters)
  }, [currentFilters]);

  const addFilter = (value: string) => {
    if (currentFilters.find((filterValue: string) => filterValue === value))
      return;
    setCurrentFilters([...currentFilters, value]);

  };

  const removeFilter = (value: string) => {
    const newFilters: string[] = currentFilters.filter((item: string) => item !== value);
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
      console.log(currentArray);
    }
  };

  return tagList.length !== 0 ? (
    <div>
      <h3>Filter by tag</h3>
      <select onChange={(event) => handleChange(event)}>
        {tagList.map((tag: Tag) => (
          <option>{tag.name}</option>
        ))}
      </select>
      <button onClick={() => addFilter(selectedFilter)}>Add filter</button>
      {currentFilters.length === 0 ? null : (
        <div>
          <h4>Current filters:</h4>
          <ul>
            {currentFilters.map((filter: string) => (
              <li>
                {filter}{" "}
                <button onClick={() => removeFilter(filter)}>
                  Remove filter
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  ) : null;
};

export default Filter;
