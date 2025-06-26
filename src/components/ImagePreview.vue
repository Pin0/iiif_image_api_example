<script setup lang="ts">
import { iiifImageStore } from '../stores/iiifimage'
import placeHolderImage from '../assets/iiif.png'

const iiifImage = iiifImageStore();
</script>

<template>
  <div class="preview-container">
    <div class="preview checkered">
      <Transition appear>
        <div v-if="iiifImage.message" class="message" :class="iiifImage.messageType">
          {{ iiifImage.message }}
        </div>
      </Transition>
      <img v-if="iiifImage.imageLoaded" :src="iiifImage.iiifImageUrl" alt="IIIF Image Preview" />
      <img class="notloadedimage" v-else :src="placeHolderImage" alt="IIIF Placeholder" />
    </div>
  </div>
</template>

<style scoped>
.preview-container {
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.preview {
  height: 60vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.preview img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.preview .notloadedimage {
  width: 20%;
  opacity: 0.7;
}

.preview .message {
  position: absolute;
  top: 0;
  margin: 1rem;
  padding: 1rem;
  color: white;
  font-weight: 600;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.preview .info {
  background-color: #4a6baf;
}

.preview .error {
  background-color: #e53935;
}

.checkered {
  background-image:
    linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
    linear-gradient(135deg, #f0f0f0 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
    linear-gradient(135deg, transparent 75%, #f0f0f0 75%);
  background-size: 20px 20px;
  background-position: 0 0, 10px 0, 10px -10px, 0 10px;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 1.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

/* Media queries for responsive design */
@media (max-width: 992px) {
  .preview {
    height: 50vh;
  }
}

@media (max-width: 576px) {
  .preview {
    height: 40vh;
  }
}
</style>