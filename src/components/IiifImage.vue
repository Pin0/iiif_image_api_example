<script setup lang="ts">
import { iiifImageStore } from '../stores/iiifimage'
import placeHolderImage from '../assets/iiif.png'
import { useRoute } from 'vue-router';
import { onMounted, watch } from 'vue';
import NavigationLinks from './NavigationLinks.vue';
import UrlInput from './UrlInput.vue';
import ImagePreview from './ImagePreview.vue';
import ImageControls from './ImageControls.vue';
import ImageInformation from './ImageInformation.vue';

const route = useRoute();
const iiifImage = iiifImageStore();

// Watch for route changes and update the store
watch(
  () => route.params.url,
  (newUrl) => {
    iiifImage.loadIiifImageJson(newUrl as string);
  }
);
</script>

<template>
  <h1><img :src="placeHolderImage" class="iiif-logo-header" alt="IIIF Logo" /> IIIF Image API Explorer</h1>
  <NavigationLinks />

  <div class="container">
    <div class="settings-column">
      <ImageControls />
      <ImageInformation />
    </div>
    <div class="workarea">
      <UrlInput />
      <ImagePreview />
      <div class="imagurl">
        <div class="image-url-text">{{ iiifImage.iiifImageUrl }}</div>
        <button @click="iiifImage.copyImageUrl()">
          <span>Copy link to this image</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
h1 {
  padding: 1rem;
  display: flex;
  align-items: center;
  font-size: 1.8rem;
  color: var(--color-heading);
  margin-bottom: 1rem;
}

.container {
  display: flex;
  flex-direction: row;
  min-height: calc(100vh - 150px);
  gap: 20px;
  padding: 0 1rem 1rem;
}

.settings-column {
  width: 30%;
  max-width: 350px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.workarea {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.imagurl {
  background-color: var(--color-background-soft);
  padding: 15px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.image-url-text {
  flex: 1;
  font-family: monospace;
  font-size: 14px;
  color: var(--vt-c-text-light-1);
  word-break: break-all;
  background-color: rgba(0, 0, 0, 0.03);
  padding: 8px;
  border-radius: 4px;
  max-height: 100px;
  overflow-y: auto;
}

.iiif-logo-header {
  width: 30px;
  height: auto;
  margin-right: 10px;
}

/* Media queries for responsive design */
@media (max-width: 992px) {
  .container {
    flex-direction: column;
  }

  .settings-column, .workarea {
    width: 100%;
    max-width: none;
  }
}

@media (max-width: 576px) {
  h1 {
    font-size: 1.5rem;
  }

  .imagurl {
    flex-direction: column;
    align-items: flex-start;
  }

  .imagurl button {
    width: 100%;
  }
}
</style>
