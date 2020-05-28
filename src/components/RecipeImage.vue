<template>
  <div id="edit-image">
    <input @change="addImage" class="form-control-file mb-3" type="file" accept="image/*" />
    <p v-if="imageStatus !== null" class="text-muted small ml-3 mb-3">{{ imageStatus }}</p>
    <div v-if="recipe.image !== null" class="d-flex flex-row align-items-center justify-content-start">
      <button @click="uploadImage" class="btn btn-outline-dark btn-sm mr-3">Upload Image</button>
      <button @click="removeImage" class="btn btn-outline-secondary btn-sm mr-3">Remove Image</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "recipe-image",
  props: {
    recipe: Object
  },
  data() {
    return {
      imageStatus: null,
      uPreset: process.env.VUE_APP_CDNRY_UPRESET
    };
  },
  methods: {
    addImage(e) {
      const selectedImage = e.target.files[0]; //get the first file
      if (selectedImage) {
        const reader = new FileReader();
        reader.onload = e => {
          this.$emit("image:update", e.target.result);
          this.imageStatus = 'Image received, please press "Upload Image" now.';
        };
        reader.readAsDataURL(selectedImage);
      } else {
        return; //cancel if there's no image or if the image is removed
      }
    },
    removeImage() {
      this.$emit("image:update", null);
      this.imageStatus = "Image removed.";
    },
    uploadImage () {
      let uData = new FormData();
      uData.append('upload_preset', this.uPreset);
      uData.append('tags', this.recipe.id);
      uData.append('file', this.recipe.image);

      function postImage(data) {
        return fetch('https://api.cloudinary.com/v1_1/ttntm/image/upload', {
          body: data,
          method: 'POST'
        }).then(response => {
          return response.json();
        }).catch((error) => {
          console.log("CDNRY API error", error);
        })
      }

      postImage(uData).then((response) => {
        let temp = Object.assign({}, response);
        this.$emit("image:update", temp.secure_url);
        this.imageStatus = "Image successfully uploaded";
      })
    }
  }
};
</script>

<style>
</style>