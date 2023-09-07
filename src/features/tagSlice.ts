import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";

// Define a type for the slice state
interface TagList {
  value: Tag[];
}

// Define the initial state using that type
const initialState: TagList = {
  value: [],
};

export const tagSlice = createSlice({
  name: "tagList",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    updateTagList: (state, action: PayloadAction<Tag[]>) => {
      state.value = action.payload;
    },
  },
});

export const { updateTagList } = tagSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectTagList = (state: RootState) => state.tagList.value;

export default tagSlice.reducer;
