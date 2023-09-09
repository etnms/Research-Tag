import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";

// Define a type for the slice state
interface FileNames {
  fileName: string;
}

// Define the initial state using that type
const initialState: FileNames = {
    fileName: "",
};

export const fileNamesSlice = createSlice({
  name: "fileNamesSlice",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    updateFileName: (state, action: PayloadAction<string>) => {
      state.fileName = action.payload;
    },
  },
});

export const { updateFileName } = fileNamesSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectTagList = (state: RootState) => state.fileNames.fileName;

export default fileNamesSlice.reducer;
