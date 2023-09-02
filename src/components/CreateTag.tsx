import React from 'react';
import { readTextFile, writeFile } from '@tauri-apps/api/fs';
import { open, save } from '@tauri-apps/api/dialog';
import { documentDir, dirname } from '@tauri-apps/api/path';

interface CreateTagProps {
    tagList: string[],
    setTaglist: Function,
}
const CreateTag: React.FC<CreateTagProps> = ({ tagList, setTaglist }) => {

    const addTag = () => {
        const newTag: string = (document.querySelector('input[name="tag-input"]') as HTMLInputElement).value;
        setTaglist([...tagList, newTag])
    }

    const openTagList = async () => {
        const documentPath = await documentDir();
        const jsonfilepath = await open({
            filters: [{
                name: 'Data file',
                extensions: ['taglist']
            }],
            defaultPath: `${documentPath}/TaggerAppData/data`,
        }) as string;

        const content: string[] = JSON.parse(await readTextFile(jsonfilepath!));
        setTaglist(content);
    }

    const saveTagList = async (taglist: string[]) => {
        const filePath: string | null = await save({
            filters: [{
                name: 'Tag list',
                extensions: ['taglist']
            }]
        });
        await writeFile(
          {
            contents: `${JSON.stringify(taglist, null, 2)}`,
            path: filePath!,
          },
    
        );
    }

    return (
        <div>
            <button onClick={() => openTagList()}>Open tag list</button>
            <label htmlFor='tag-input'>Create a new tag:</label>
            <input name='tag-input'></input>
            <button onClick={() => addTag()}>Create tag</button>
            <button onClick={() => saveTagList(tagList)}>Save tag list</button>
        </div>
    );
};

export default CreateTag;