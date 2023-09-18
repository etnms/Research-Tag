import {
  BaseDirectory,
  createDir,
  exists,
  writeFile,
  readTextFile,
} from "@tauri-apps/api/fs";
import { open } from "@tauri-apps/api/dialog";
import { getFileName } from "./getFileName";
import { saveTagList } from "./writeProjectFiles";

export const checkDirectory = async () => {
  try {
    const directoryExists: boolean = await exists("TaggerAppData/data", {
      dir: BaseDirectory.Document,
    });
    if (!directoryExists) {
      createDataFolder();
    }
  } catch (err) {
    console.error(err);
  }
};

const createDataFolder = async () => {
  try {
    await createDir("TaggerAppData/data", {
      dir: BaseDirectory.Document,
      recursive: true,
    });
  } catch (err) {
    console.error(err);
  }
};

export const clearFileName = (name: string) => {
  if (name.endsWith(".tdf")) {
    return name.split(".tdf");
  } else if (name.endsWith(".taglist")) {
    return name.split(".taglist");
  }
};

export const saveJSON = async (linesObject: LinesObject[], fileName: string) => {
  try {
    const filePath = `TaggerAppData/data/${fileName}.tdf`;
    await writeFile(
      {
        path: filePath,
        contents: `${JSON.stringify(linesObject, null, 2)}`,
      },
      { dir: BaseDirectory.Document }
    );
  } catch (err) {
    console.log(err);
  }
};

export const openExternalFile = async () => {
  try {
    const paths = await open({
      multiple: true,
      filters: [{ name: "Tagger app files", extensions: ["taglist", "tdf"] }],
    }) as string[];

    if (!paths || paths.length === 0) {
      return;
    }

    await Promise.all(paths.map(async (filePath: string) => {
      const fileName: string | undefined = getFileName(filePath);
      if (filePath.endsWith(".taglist")) {
        const content: Tag[] = JSON.parse(await readTextFile(filePath!));
        await saveTagList(content, fileName!);
      }
      if (filePath.endsWith(".tdf")) {
        const content: LinesObject[] = JSON.parse(await readTextFile(filePath!));
        await saveJSON(content, fileName!);
      }
    }));
  } catch (err) {
    console.error(err);
  }
};

export const restoreBackup = () => {
  
}