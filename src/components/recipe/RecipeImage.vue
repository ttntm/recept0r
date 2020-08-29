<template>
	<div id="edit-image">
    <div v-if="!recipe.image" class="border border-gray-500 border-dashed rounded-lg p-8 px-12 mb-4">
      <label class="flex flex-col w-full md:w-3/4 items-center btn btn-gray cursor-pointer px-4 py-6 mx-auto">
        <svg class="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
        </svg>
        <span class="mt-2 text-base leading-normal">Select Image</span>
        <input
          @change="addImage"
          class="hidden"
          type="file"
          accept="image/*"
        />
      </label>
    </div>
		<p
			v-if="imageStatus.type !== ''"
			v-html="imageStatus.body"
			class="text-sm ml-4 mb-4"
			:class="{
        'error': imageStatus.type === 'error',
        'text-blue-500': imageStatus.type === 'info',
      }"
		/>
		<div class="flex flex-row align-items-center justify-content-start">
			<button @click="uploadImage" v-blur class="btn btn-green text-sm mr-4">Upload Image</button>
			<button v-if="recipe.image" @click="removeImage" v-blur class="btn btn-red text-sm">Remove Image</button>
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
				imageStatus: {
					type: "",
					body: ""
				},
				uPreset: process.env.VUE_APP_CDNRY_UPRESET
			};
		},
    computed: {
      isUploaded() {
        const checkImgSrc = RegExp(/^https:\/\//);
        return checkImgSrc.test(this.recipe.image);
      },
    },
		methods: {
			addImage(e) {
				const selectedImage = e.target.files[0]; //get the first file
				if (selectedImage) {
					const reader = new FileReader();
					reader.onload = e => {
						this.$emit("image:update", e.target.result);
						this.imageStatus.type = "info";
						this.imageStatus.body = 'Image received, please press "Upload Image" now.';
					};
					reader.readAsDataURL(selectedImage);
				} else {
					//cancel if there's no image or if the image is removed
					return;
				}
			},
			removeImage() {
				if (this.recipe.image) {
					this.$emit("image:update", null);
					this.imageStatus.type = "info";
					this.imageStatus.body = "Image removed.";
				} else {
					this.imageStatus.type = "error";
					this.imageStatus.body = "Please select an image first";
				}
			},
			uploadImage() {
				const vm = this;
				function postImage(data) {
					return fetch("https://api.cloudinary.com/v1_1/ttntm/image/upload", {
						body: data,
						method: "POST"
					})
						.then(response => {
							vm.imageStatus.type = "info";
							vm.imageStatus.body = "Image successfully uploaded";
							return response.json();
						})
						.catch(error => {
							console.log("CDNRY API error", error);
							vm.imageStatus.type = "error";
							vm.imageStatus.body = "Error uploading image";
						});
				}
				if (this.recipe.image && !this.isUploaded) {
					let spinner = require("@/assets/loading.svg");
					this.imageStatus.type = "info";
					this.imageStatus.body = `<img src="${spinner}" class="w-6 inline-block"><span class="inline-block ml-2">Uploading...</span>`;

					let uData = new FormData();
					uData.append("upload_preset", this.uPreset);
					uData.append("tags", this.recipe.id);
					uData.append("file", this.recipe.image);

					postImage(uData).then(response => {
						//check for the response first - otherwise the base64 image would be cleared, making the user have to select it again
						if (response) {
							let temp = Object.assign({}, response);
							this.$emit("image:update", temp.secure_url);
						}
					});
				} else {
          if (this.isUploaded) {
            this.imageStatus.type = "error";
            this.imageStatus.body = "This image was uploaded already. Please remove it first if you want to change it.";
          } else {
            this.imageStatus.type = "error";
            this.imageStatus.body = "Please select an image first";
          }
				}
			}
		}
	};
</script>

<style lang="postcss" scoped>
	.error {
		@apply font-semibold;
		color: salmon;
	}
</style>