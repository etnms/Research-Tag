import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";

// Define a type for the slice state
interface LinesObjectSlice {
  value: LinesObject[];
}

// Define the initial state using that type
const initialState: LinesObjectSlice = {
  value: [],
};

export const linesObjectSlice = createSlice({
  name: "linesObject",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    updateLinesObject: (state, action: PayloadAction<LinesObject[]>) => {
      state.value = action.payload;
    },
    addTagToArray: (state, action: PayloadAction<{ index: number; tag: string }>) => {
      const { index, tag } = action.payload;
      // Find the LinesObject to update by its index
      const linesObjectToUpdate = state.value.find((item) => item.index === index);

      if (linesObjectToUpdate) {
        // Make a copy of the tags array and push the new tag
        linesObjectToUpdate.tags = [...linesObjectToUpdate.tags, tag];
      }
    },
    removeTagFromArray: (state, action: PayloadAction<{index: number; tagToRemove: string}>) => {
      const {index, tagToRemove} = action.payload;
      const linesObjectToUpdate = state.value.find((item) => item.index === index);
      if (linesObjectToUpdate) {
        // Make a copy of the tags array and push the new tag
        linesObjectToUpdate.tags = linesObjectToUpdate.tags.filter(tag => tag !== tagToRemove);
      }

    }
  },
});

export const { updateLinesObject, addTagToArray, removeTagFromArray } = linesObjectSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectLinesObject = (state: RootState) => state.linesObject.value;

export default linesObjectSlice.reducer;
