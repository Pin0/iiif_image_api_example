<script setup lang="ts">
import { iiifImageStore } from '../stores/iiifimage'

const iiifImage = iiifImageStore();
</script>

<template>
  <div class="urlinput">
    <label for="iiif-image-url">IIIF Image URL</label>
    <input 
      id="iiif-image-url" 
      v-model="iiifImage.infoJsonUrl" 
      @input="(event: Event) => iiifImage.loadIiifImageJson((event.target as HTMLInputElement)?.value)" 
      placeholder="Enter IIIF image URL (info.json)" 
    />
  </div>
</template>

<style scoped>
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
</style>