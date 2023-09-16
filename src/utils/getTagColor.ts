export const getTagColor = (
  input: string,
  tagList: Tag[],
  isTextColor: boolean
) => {
  const matchingTag: Tag | undefined = tagList.find(
    (tag: Tag) => tag.name === input
  );
  if (matchingTag) {
    if (isTextColor) return matchingTag.textColor;
    else if (!isTextColor) return matchingTag.color;
  }
  // Handle the case when no matching tag is found
  return "";
};