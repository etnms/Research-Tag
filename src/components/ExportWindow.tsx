import React, { useState } from "react";
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
import Loader from "./Loader";

const ExportWindow: React.FC = () => {
  const tagList: Tag[] = useAppSelector((state) => state.tagList.value);
  const linesObject: LinesObject[] = useAppSelector(
    (state) => state.linesObject.value
  );

  const [loading, setLoading] = useState<boolean>(false);

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
        setLoading(true);
        await writeTextFile({
          contents: `${JSON.stringify(linesObject, null, 2)}`,
          path: filePath!,
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
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
        lineElement.ele("content").txt(item.line);
        lineElement.ele("index").txt(item.index.toString());

        // Create a tags element and add individual tag elements
        const tagsElement: XMLBuilder = lineElement.ele("tags");
        item.tags.forEach((tag: Tag) => {
          tagsElement.ele("tag").txt(tag.name);
        });
      });

      // Generate the XML string
      const xmlString: string = root.end({ prettyPrint: true });
      setLoading(true);
      await writeTextFile({ path: filePath!, contents: xmlString });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
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
        setLoading(true);
        // Read data
        const files: FileEntry[] = await readDir("ResearchTagData/data", {
          dir: BaseDirectory.Document,
        });

        // Use Promise.all to read and add files to the zip
        const promises: Promise<void>[] = files.map(async (file: FileEntry) => {
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
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = async () => {
    setLoading(true);
    const tags: Tag[] = [];

    tagList.map((tag: Tag) => tags.push(tag));

    let csvContent = "line," + tags.join(",") + "\n"; // Initialize CSV content with headers

    for (const obj of linesObject) {
      const values = tags.map((tag: Tag) => (obj.tags.includes(tag) ? "x" : "")); // Map 'x' or empty string based on tag presence
      const objLine: string = obj.line.replace(/"/g, '""'); // Replace " with ""
      const csvLine: string = `"${objLine}",${values.join(",")}\n`;
      csvContent += `${csvLine}`;
    }

    try {
      const filePath: string | null = await save({
        filters: [
          {
            name: "CSV",
            extensions: ["csv"],
          },
        ],
      });

      if (filePath !== null) {
        await writeTextFile({
          contents: csvContent,
          path: filePath!,
        });
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <button
        className={styles.button}
        onClick={() => {
          exportJSON();
        }}
      >
        Export JSON
      </button>
      <button className={styles.button} onClick={() => exportXML()}>
        Export XML
      </button>
      <button className={styles.button} onClick={() => exportCSV()}>
        Export CSV
      </button>
      <button className={styles.button} onClick={() => exportBackup()}>
        Backup all projects
      </button>
      {loading ? (
        <Loader title={"Project is being exported. Please wait."} />
      ) : null}
    </>
  );
};

export default ExportWindow;
