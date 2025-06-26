<script setup lang="ts">
import { iiifImageStore } from '../stores/iiifimage'
import placeHolderImage from '../assets/iiif.png'
import { useRoute } from 'vue-router';
import { onMounted, watch } from 'vue';


const route = useRoute();
const iiifImage = iiifImageStore();

// Set the URL when the component is mounted
onMounted(() => {
 //iiifImage.loadIiifImageJson('https://images.memorix.nl/pdp/iiif/8c9832d2-785a-f652-ac68-49f6c9aacbb1/info.json');

  //iiifImage.loadIiifImageJson(route.params.url as string);

});

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
  <div class="nav-links">
    <router-link to="/https://images.memorix.nl/pdp/iiif/8c9832d2-785a-f652-ac68-49f6c9aacbb1/info.json">Example 1</router-link>
    <router-link to="/https://stacks.stanford.edu/image/iiif/hg676jb4964%2F0380_796-44/info.json">Example 2</router-link>
    <router-link to="/https://stadsarchiefamsterdam.memorix.io/resources/records/media/e667a5ea-e7fc-a197-1380-f35dfaa51466/iiif/3/23989087/info.json">Example 3</router-link>
  </div>

  <div class="container">
    <div class="settings">
      <div class="setting">
        <h3>Region</h3>
        <input v-model="iiifImage.iiifParams.region" name="region" autocomplete="region" placeholder="full, square, or x,y,w,h">
      </div>
      <div class="setting size">
        <h3>Size</h3>
        <div>
          <label for="prefered-size">Preferred size</label>
          <select v-model="iiifImage.iiifParams.size" id="prefered-size">
            <option v-for="size in iiifImage.preferedSizes" :key="size">
              {{ size }}
            </option>
          </select>
        </div>
        <div>
          <label for="aspect-ratio">Maintain aspect ratio</label>
          <input type="checkbox" id="aspect-ratio" v-model="iiifImage.iiifParams.maintainAspectRatio" />
        </div>
      </div>
      <div class="setting">
        <h3>Rotation: {{ iiifImage.iiifParams.rotation }}°</h3>
        <div class="rotation-control">
          <span>0°</span>
          <input id="rangeSlider" type="range" class="rotation" v-model="iiifImage.iiifParams.rotation" min="0" max="360" step="1"/>
          <span>360°</span>
        </div>
      </div>
      <div class="setting">
        <h3>Quality</h3>
        <ul class="quality-options">
          <li v-for="(quality, index) in iiifImage.qualities" :key="index">
            <label :for="'quality-' + quality" class="radio-label">
              <input type="radio" :id="'quality-' + quality" v-model="iiifImage.iiifParams.quality" :value="quality" />
              <span>{{ quality }}</span>
            </label>
          </li>
        </ul>
      </div>
      <div class="setting">
        <h3>Format</h3>
        <ul class="format-options">
          <li v-for="(format, index) in iiifImage.formats" :key="index">
            <label :for="'format-' + format" class="radio-label">
              <input type="radio" :disabled="format == 'tif'" :id="'format-' + format" v-model="iiifImage.iiifParams.format" :value="format" />
              <span>{{ format }}</span>
            </label>
          </li>
        </ul>
      </div>
      <div class="setting">
        <h3>Image Information</h3>
        <div class="scroll">
          <pre>{{ iiifImage.infoJson }}</pre>
        </div>
      </div>
    </div>
    <div class="workarea">
      <div class="urlinput">
        <label for="iiif-image-url">IIIF Image URL</label>
        <input 
          id="iiif-image-url" 
          v-model="iiifImage.infoJsonUrl" 
          @input="(event: Event) => iiifImage.loadIiifImageJson((event.target as HTMLInputElement)?.value)" 
          placeholder="Enter IIIF image URL (info.json)" 
        />
      </div>
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

/* Navigation links */
.nav-links {
  display: flex;
  gap: 10px;
  margin-bottom: 1.5rem;
  padding: 0 1rem;
  flex-wrap: wrap;
}

.container {
  display: flex;
  flex-direction: row;
  min-height: calc(100vh - 150px);
  gap: 20px;
  padding: 0 1rem 1rem;
}

.settings {
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

.setting {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 15px;
  background-color: var(--color-background-soft);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.setting h3 {
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 10px;
  color: var(--color-heading);
}

.setting ul {
  padding: 0.5rem 0;
}

.setting li {
  list-style: none;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.size {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.size div {
  display: flex;
  align-items: center;
  gap: 10px;
}

.size label {
  flex: 1;
}

.rotation-control {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0;
}

.rotation-control span {
  font-size: 0.8rem;
  color: var(--vt-c-text-light-2);
}

.rotation {
  flex: 1;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: #e0e0e0;
  border-radius: 3px;
  outline: none;
}

.rotation::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #4a6baf;
  cursor: pointer;
  transition: background 0.3s ease;
}

.rotation::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #4a6baf;
  cursor: pointer;
  transition: background 0.3s ease;
  border: none;
}

.rotation::-webkit-slider-thumb:hover {
  background: #3a5a9f;
}

.rotation::-moz-range-thumb:hover {
  background: #3a5a9f;
}

.urlinput {
  margin-bottom: 20px;
}

.urlinput label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--color-heading);
}

.urlinput input {
  display: block;
  width: 100%;
  margin: 0 auto;
  padding: 12px;
  border-radius: 4px;
  text-overflow: ellipsis;
  font-size: 14px;
  border: 1px solid var(--color-border);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  background-color: var(--color-background);
}

.urlinput input:focus {
  border-color: #4a6baf;
  box-shadow: 0 0 0 2px rgba(74, 107, 175, 0.2);
  outline: none;
}

.preview-container {
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.radio-label input[type="radio"] {
  margin: 0;
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

.v-enter-active,
.v-leave-active {
  transition: opacity 1.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.iiif-logo-header {
  width: 30px;
  height: auto;
  margin-right: 10px;
}

.scroll {
  overflow: auto;
  max-height: 200px;
  font-size: 0.8rem;
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
}

/* Media queries for responsive design */
@media (max-width: 992px) {
  .container {
    flex-direction: column;
  }

  .settings, .workarea {
    width: 100%;
    max-width: none;
  }

  .preview {
    height: 50vh;
  }
}

@media (max-width: 576px) {
  h1 {
    font-size: 1.5rem;
  }

  .setting {
    padding: 10px;
  }

  .preview {
    height: 40vh;
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
