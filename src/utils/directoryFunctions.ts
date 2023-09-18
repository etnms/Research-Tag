import {
  BaseDirectory,
  createDir,
  exists,
  writeFile,
  readTextFile,
  readBinaryFile,
} from "@tauri-apps/api/fs";
import { open } from "@tauri-apps/api/dialog";
import { getFileName } from "./getFileName";
import JSZip from "jszip";

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

export const saveJSON = async (
  linesObject: LinesObject[],
  fileName: string
) => {
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
    const paths = (await open({
      multiple: true,
      filters: [{ name: "Tagger app files", extensions: ["taglist", "tdf"] }],
    })) as string[];

    if (!paths || paths.length === 0) {
      return;
    }

    await Promise.all(
      paths.map(async (filePath: string) => {
        const fileName: string | undefined = getFileName(filePath);
        if (filePath.endsWith(".taglist")) {
          const content: Tag[] = JSON.parse(await readTextFile(filePath!));
          await saveTagList(content, fileName!);
        }
        if (filePath.endsWith(".tdf")) {
          const content: LinesObject[] = JSON.parse(
            await readTextFile(filePath!)
          );
          await saveJSON(content, fileName!);
        }
      })
    );
  } catch (err) {
    console.error(err);
  }
};

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

export const restoreBackup = async () => {
  try {
    const backupPath = (await open({
      multiple: false,
      filters: [
        {
          name: "Zip",
          extensions: ["zip"],
        },
      ],
    })) as string;
    if (backupPath === null || backupPath === undefined) return;
    else {
      // check for directory or create one if needed
      await checkDirectory();

      const file = await readBinaryFile(backupPath);

      JSZip.loadAsync(file).then(async function (zip) {
        const promises: Promise<void>[] = [];

        zip.forEach(async function (relativePath, zipEntry) {
          const content: Uint8Array = await zipEntry.async("uint8array");
          const text = new TextDecoder("utf-8").decode(content); // Assuming the content is in UTF-8 encoding

          // Parse the content as JSON, assuming it's in JSON format
          let jsonData;
          try {
            jsonData = JSON.parse(text);
          } catch (error) {
            console.error(
              `Error parsing JSON for file ${relativePath}: ${error}`
            );
            return; // Skip this file if it's not valid JSON
          }

          // Write data (JSON)
          await writeFile(
            {
              contents: JSON.stringify(jsonData, null, 2), // Convert it back to formatted JSON
              path: `TaggerAppData/data/${relativePath}`, // Specify the desired file extension as .json
            },
            { dir: BaseDirectory.Document }
          );
        });

        await Promise.all(promises);
      });
    }
  } catch (err) {
    console.log(err);
  }
};
