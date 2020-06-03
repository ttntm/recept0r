<template>
  <div class="editor">
    <editor-menu-bar v-if="editing" :editor="editor" v-slot="{ commands, isActive }">
      <div class="btn-group mb-4">
        <button
          class="btn btn-gray text-sm rounded-none"
          :class="{ 'is-active': isActive.bold() }"
          @click="commands.bold"
        ><strong>B</strong></button>
        <button
          class="btn btn-gray text-sm rounded-none"
          :class="{ 'is-active': isActive.italic() }"
          @click="commands.italic"
        ><em>i</em></button>
        <button
          class="btn btn-gray text-sm rounded-none"
          :class="{ 'is-active': isActive.underline() }"
          @click="commands.underline"
        ><u>U</u></button>
        <button
          class="btn btn-gray text-sm rounded-none"
          :class="{ 'is-active': isActive.paragraph() }"
          @click="commands.paragraph"
        >P</button>
        <button
          class="btn btn-gray text-sm rounded-none"
          :class="{ 'is-active': isActive.heading({ level: 1 }) }"
          @click="commands.heading({ level: 1 })"
        >H1</button>
        <button
          class="btn btn-gray text-sm rounded-none"
          :class="{ 'is-active': isActive.heading({ level: 2 }) }"
          @click="commands.heading({ level: 2 })"
        >H2</button>
        <button
          class="btn btn-gray text-sm rounded-none"
          :class="{ 'is-active': isActive.heading({ level: 3 }) }"
          @click="commands.heading({ level: 3 })"
        >H3</button>
        <button
          class="btn btn-gray text-sm rounded-none"
          :class="{ 'is-active': isActive.bullet_list() }"
          @click="commands.bullet_list"
        >&bull; UL</button>
        <button
          class="btn btn-gray text-sm rounded-none"
          :class="{ 'is-active': isActive.ordered_list() }"
          @click="commands.ordered_list"
        >1. OL</button>
        <button class="btn btn-gray text-sm rounded-none" @click="commands.undo">&lt;</button>
        <button class="btn btn-gray text-sm rounded-none" @click="commands.redo">&gt;</button>
      </div>
    </editor-menu-bar>
    <editor-content class="editor__content" :editor="editor" :class="{ 'editor-active': editing }"/>
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from "tiptap";
import {
  Heading,
  OrderedList,
  BulletList,
  ListItem,
  Bold,
  Italic,
  Underline,
  History
} from "tiptap-extensions";

export default {
  name: "recipe-editor",
  components: {
    EditorMenuBar,
    EditorContent
  },
  props: {
      editing: Boolean,
      editorContent: Object
  },
  data() {
    return {
      editor: null
    };
  },
  watch: {
    editing: {
      handler() {
        if(this.editing) {
          this.editor.options.editable = true;
        } else {
          this.editor.options.editable = false;
          this.editor.setContent(this.editorContent);  //reset when cached old data come back after "cancel" of edit mode
        }
      }
    }
  },
  mounted() {
    this.editor = new Editor({
      editable: this.editing,
      content: this.editorContent,
      extensions: [
        new BulletList(),
        new Heading({ levels: [1, 2, 3] }),
        new ListItem(),
        new OrderedList(),
        new Bold(),
        new Italic(),
        new Underline(),
        new History()
      ],
      onUpdate: () => {
        let editorJSON = this.editor.getJSON();
        this.$emit("editor:update", editorJSON); //send updated editor content back to parent component
      }
    });
  },
  beforeDestroy() {
    this.editor.destroy();
  }
};
</script>

<style>
  .is-active {
    background-color: #ccc;
  }
  .ProseMirror:focus {
    outline: none;
  }
  .editor-active > .ProseMirror {
    padding: 0.5rem;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
  }
  .editor-active > .ProseMirror:focus {
    border-color: #80bdff;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
  }
</style>