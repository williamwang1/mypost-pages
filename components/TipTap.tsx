
'use client'
import { Editor, EditorContent, BubbleMenu, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import CharacterCount from '@tiptap/extension-character-count'
import Placeholder from '@tiptap/extension-placeholder';
import React, {useEffect} from 'react'
// import './styles.scss'

const limit = 280

const Tiptap = ({content, readOnly, onChange} : {content: string, readOnly: boolean, onChange: any}) => {
const editor = useEditor({
    content,
    editable: !readOnly, // Set the editable prop based on the readOnly prop
    // ...other options
    autofocus: 'end',
    extensions: [
        StarterKit,
        CharacterCount.configure({
            limit,
        }),
        Placeholder.configure({
            placeholder: 'Start typing here...', // Your placeholder text
            // You can add additional placeholder configuration options here
        }),
    ],
    onUpdate: ({ editor }) => {
        const html = editor.getHTML();
        //console.log("Current content:", html);
        // Here you can handle the change, like updating a state or calling an API
        onChange(html)
    },
    editorProps: {
        attributes: {
          class: 'focus:outline-none',
        },
    },
    })
//   const editor = new Editor({
//     content,
//     editable: !readOnly, // Set the editable prop based on the readOnly prop
//     // ...other options
//     extensions: [
//         StarterKit,
//         CharacterCount.configure({
//             limit,
//           }),
//     ],
//     onUpdate: ({ editor }) => {
//         const html = editor.getHTML();
//         console.log("Current content:", html);
//         // Here you can handle the change, like updating a state or calling an API
//         onChange(html)
//     }
//   });
// useEffect(() => {
//     if (editor) {
//       editor.focus();
//     }
//   }, [editor]);

  return (
    <>
     {editor && <BubbleMenu className="bubble-menu" tippyOptions={{ duration: 100 }} editor={editor}>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'is-active' : ''}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'is-active' : ''}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? 'is-active' : ''}
        >
          Strike
        </button>
      </BubbleMenu>}
      <EditorContent content={content} editor={editor} className=''/>
      <div className="character-count">
        {editor?.storage.characterCount.characters()}/{limit} characters
        <br />
        {editor?.storage.characterCount.words()} words
      </div>
    </>
    
  )
}

export default Tiptap