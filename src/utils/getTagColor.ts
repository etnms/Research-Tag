export const getTagColor = (input: string, tagList: Tag[]) => {
    const matchingTag: Tag | undefined = tagList.find(
      (tag: Tag) => tag.name === input
    );
    if (matchingTag) {
      return matchingTag.color;
    }
    // Handle the case when no matching tag is found
    return "";
  };
