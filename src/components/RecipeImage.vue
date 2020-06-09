<template>
  <div id="edit-image">
    <input @change="addImage" class="w-full md:w-4/5 form-control py-2 mb-4" type="file" accept="image/*" />
    <p v-if="imageStatus !== null" class="text-sm text-cool-gray-500 ml-4 mb-4">{{ imageStatus }}</p>
    <div class="flex flex-row align-items-center justify-content-start">
      <button @click="uploadImage" class="btn btn-green text-sm mr-4">Upload Image</button>
      <button @click="removeImage" class="btn btn-gray text-sm">Remove Image</button>
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
      if(this.recipe.image) {
        this.$emit("image:update", null);
        this.imageStatus = "Image removed.";
      } else {
        this.imageStatus = "Please select an image first";
      }
    },
    uploadImage () {
      const vm = this;
      function postImage(data) {
        return fetch('https://api.cloudinary.com/v1_1/ttntm/image/upload', {
          body: data,
          method: 'POST'
        }).then(response => {
          vm.imageStatus = "Image successfully uploaded";
          return response.json();
        }).catch((error) => {
          console.log("CDNRY API error", error);
          vm.imageStatus = "Error uploading image";
        })
      }
      if(this.recipe.image) {
        let uData = new FormData();
        uData.append('upload_preset', this.uPreset);
        uData.append('tags', this.recipe.id);
        uData.append('file', this.recipe.image);

        postImage(uData).then((response) => {
          let temp = Object.assign({}, response);
          this.$emit("image:update", temp.secure_url);
        })
      } else {
        this.imageStatus = "Please select an image first";
      }
    }
  }
};
</script>

<style>
</style>