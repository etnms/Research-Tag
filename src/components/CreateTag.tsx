import React from 'react';

interface CreateTagProps {
    tagList: string[],
    setTaglist: Function,
}
const CreateTag: React.FC<CreateTagProps> = ({tagList, setTaglist}) => {

    const addTag = () => {
        const newTag: string = (document.querySelector('input[name="tag-input"]') as HTMLInputElement).value;
        setTaglist([...tagList, newTag])
    }

    return (
        <div>
            <label htmlFor='tag-input'>Create a new tag:</label>
            <input name='tag-input'></input>
            <button onClick={() => addTag()}>Create tag</button>
        </div>
    );
};

export default CreateTag;