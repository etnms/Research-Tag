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
  },
});

export const { updateLinesObject } = linesObjectSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectLinesObject = (state: RootState) => state.linesObject.value;

export default linesObjectSlice.reducer;
