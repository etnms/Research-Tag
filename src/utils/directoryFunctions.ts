import {
  BaseDirectory,
  createDir,
  exists,
  writeFile,
} from "@tauri-apps/api/fs";

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
