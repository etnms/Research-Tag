import { BaseDirectory, writeFile } from "@tauri-apps/api/fs";

export const saveTagList = async (taglist: Tag[], name: string) => {
    try {
      await writeFile(
        {
          contents: `${JSON.stringify(taglist, null, 2)}`,
          path: `TaggerAppData/data/${name}.taglist`,
        },
        { dir: BaseDirectory.Document }
      );
    } catch (err) {
      console.log(err);
    }
  };