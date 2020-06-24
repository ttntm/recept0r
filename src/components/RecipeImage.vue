<template>
	<div id="edit-image">
		<input
			@change="addImage"
			class="w-full md:w-4/5 form-control py-2 mb-4"
			type="file"
			accept="image/*"
		/>
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
		methods: {
			addImage(e) {
				const selectedImage = e.target.files[0]; //get the first file
				if (selectedImage) {
					const reader = new FileReader();
					reader.onload = e => {
						this.$emit("image:update", e.target.result);
						this.imageStatus.type = "info";
						this.imageStatus.body =
							'Image received, please press "Upload Image" now.';
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
				if (this.recipe.image) {
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
					this.imageStatus.type = "error";
					this.imageStatus.body = "Please select an image first";
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