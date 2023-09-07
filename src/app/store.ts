import { configureStore } from "@reduxjs/toolkit";
import tagListReducer from "../features/tagSlice";
import linesObjectReducer from "../features/lineObjectSlice";

export const store = configureStore({
  reducer: {
    tagList: tagListReducer,
    linesObject: linesObjectReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
