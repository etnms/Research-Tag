import React from "react";
import styles from "./ExportWindow.module.scss";
import { save } from "@tauri-apps/api/dialog";
import { useAppSelector } from "../app/hooks";
import {
  BaseDirectory,
  FileEntry,
  readDir,
  readTextFile,
  writeBinaryFile,
  writeTextFile,
} from "@tauri-apps/api/fs";
import JSZip from "jszip";
import FileSaver from "file-saver";
import { create } from "xmlbuilder2";
import { XMLBuilder } from "xmlbuilder2/lib/interfaces";

const ExportWindow: React.FC = () => {
  const linesObject: LinesObject[] = useAppSelector(
    (state) => state.linesObject.value
  );

  const exportJSON = async () => {
    try {
      const filePath: string | null = await save({
        filters: [
          {
            name: "JSON",
            extensions: ["json"],
          },
        ],
      });
      if (filePath !== null) {
        await writeTextFile({
          contents: `${JSON.stringify(linesObject, null, 2)}`,
          path: filePath!,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };


  const exportXML = async () => {
    try {
      // Get filepath
      const filePath: string | null = await save({
        filters: [
          {
            name: "XML",
            extensions: ["xml"],
          },
        ],
      });

      const root: XMLBuilder = create().ele("lines");

      // Iterate through the array and create XML elements for each item
      linesObject.forEach((item: LinesObject) => {
        const lineElement: XMLBuilder = root.ele("line");
        lineElement.ele("content").txt((item.line));
        lineElement.ele("index").txt(item.index.toString());

        // Create a tags element and add individual tag elements
        const tagsElement: XMLBuilder = lineElement.ele("tags");
        item.tags.forEach((tag: string) => {
          tagsElement.ele("tag").txt(tag);
        });
      });

      // Generate the XML string
      const xmlString: string = root.end({ prettyPrint: true });
      await writeTextFile({ path: filePath!, contents: xmlString });
    } catch (err) {
      console.log(err);
    }
  };

  const exportBackup = async () => {
    const zip: JSZip = new JSZip();

    try {
      // Get path for zip
      const zipPath: string | null = await save({
        filters: [
          {
            name: "zip",
            extensions: ["zip"],
          },
        ],
      });

      if (zipPath !== null) {
        // Read data
        const files: FileEntry[] = await readDir("TaggerAppData/data", {
          dir: BaseDirectory.Document,
        });

        // Use Promise.all to read and add files to the zip
        const promises = files.map(async (file: FileEntry) => {
          const content: string = await readTextFile(file.path);
          zip.file(file.name!, content);
        });

        // Wait for all promises to resolve before generating and saving the zip
        Promise.all(promises)
          .then(async () => {
            // Generate zip
            return zip.generateAsync({ type: "blob" });
          })
          .then(async (content) => {
            const contents = await content.arrayBuffer();
            await writeBinaryFile({ contents: contents, path: zipPath! });
            FileSaver.saveAs(content, "download.zip");
          })
          .catch((error) => {
            console.error(error);
          });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <button
        className={styles.button}
        onClick={() => {
          exportJSON();
        }}
      >
        Export JSON
      </button>
      <button className={styles.button} onClick={() => exportXML()}>Export XML</button>
      <button className={styles.button} onClick={() => exportBackup()}>
        Backup all projects
      </button>
    </div>
  );
};

export default ExportWindow;
