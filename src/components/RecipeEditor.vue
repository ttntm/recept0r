<template>
  <div class="editor">
    <editor-menu-bar v-if="editing" :editor="editor" v-slot="{ commands, isActive }">
      <div class="btn-group mb-4">
        <button
          class="btn btn-gray text-sm rounded-none"
          :class="{ 'is-active': isActive.bold() }"
          @click="commands.bold"
          title="Bold"
        ><strong>B</strong></button>
        <button
          class="btn btn-gray text-sm rounded-none"
          :class="{ 'is-active': isActive.italic() }"
          @click="commands.italic"
          title="Italic"
        ><em>i</em></button>
        <button
          class="btn btn-gray text-sm rounded-none"
          :class="{ 'is-active': isActive.underline() }"
          @click="commands.underline"
          title="Underline"
        ><u>U</u></button>
        <button
          class="btn btn-gray text-sm rounded-none"
          :class="{ 'is-active': isActive.paragraph() }"
          @click="commands.paragraph"
          title="Paragraph"
        >P</button>
        <button
          class="btn btn-gray text-sm rounded-none"
          :class="{ 'is-active': isActive.heading({ level: 1 }) }"
          @click="commands.heading({ level: 1 })"
          title="Heading 1"
        >H1</button>
        <button
          class="btn btn-gray text-sm rounded-none"
          :class="{ 'is-active': isActive.heading({ level: 2 }) }"
          @click="commands.heading({ level: 2 })"
          title="Heading 2"
        >H2</button>
        <button
          class="btn btn-gray text-sm rounded-none"
          :class="{ 'is-active': isActive.heading({ level: 3 }) }"
          @click="commands.heading({ level: 3 })"
          title="Heading 3"
        >H3</button>
        <button
          class="btn btn-gray text-sm rounded-none"
          :class="{ 'is-active': isActive.bullet_list() }"
          @click="commands.bullet_list"
          title="Unordered list"
        >&bull; UL</button>
        <button
          class="btn btn-gray text-sm rounded-none"
          :class="{ 'is-active': isActive.ordered_list() }"
          @click="commands.ordered_list"
          title="Ordered list"
        >1. OL</button>
        <button
          class="btn btn-gray text-sm rounded-none"
          @click="commands.horizontal_rule"
          title="Horizontal rule"
        >HR
        </button>
        <button class="btn btn-gray text-sm rounded-none"
          @click="commands.undo"
          title="Undo"
        >&lt;</button>
        <button class="btn btn-gray text-sm rounded-none"
          @click="commands.redo"
          title="Redo"
        >&gt;</button>
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
  HorizontalRule,
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
        new HorizontalRule(),
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

<style lang="postcss">
  .is-active {
    @apply bg-cool-gray;
  }
  .ProseMirror:focus {
    outline: none;
  }
  .editor-active > .ProseMirror {
    @apply border border-gray-500 rounded-lg px-3 py-1;
  }
  .editor-active > .ProseMirror:focus {
    @apply shadow-outline;
  }
  .editor-active > .ProseMirror hr {
    @apply my-8;
  }
  .btn-group {
    @apply text-sm;
  }
  .btn-group button {
    @apply rounded-none py-1 px-2;
  }
  .btn-group button:focus {
    @apply shadow-none bg-gray-600;
  }
  .btn-group button:not(:nth-child(1)) {
    border-left-width: 0!important;
  }
  .btn-group button:first-child {
    @apply rounded-tl rounded-bl;
  }
  .btn-group button:last-child {
    @apply rounded-tr rounded-br;
  }
</style>