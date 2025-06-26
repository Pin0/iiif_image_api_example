<script setup lang="ts">
import { iiifImageStore } from '../stores/iiifimage'

const iiifImage = iiifImageStore();
</script>

<template>
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
      <div class="slider-control">
        <label for="width-slider">Width: {{ iiifImage.iiifParams.width }}</label>
        <input 
          id="width-slider" 
          type="range" 
          class="size-slider" 
          v-model.number="iiifImage.iiifParams.width" 
          :min="10" 
          :max="iiifImage.maxWidth" 
          step="1"
        />
      </div>
      <div class="slider-control">
        <label for="height-slider">Height: {{ iiifImage.iiifParams.height }}</label>
        <input 
          id="height-slider" 
          type="range" 
          class="size-slider" 
          v-model.number="iiifImage.iiifParams.height" 
          :min="10" 
          :max="iiifImage.maxHeight" 
          step="1"
        />
      </div>
    </div>
    <div class="setting">
      <h3>Rotation: {{ iiifImage.iiifParams.rotation }}°</h3>
      <div class="rotation-control">
        <span>0°</span>
        <input id="rangeSlider" type="range" class="rotation" v-model="iiifImage.iiifParams.rotation" min="0" max="360" :step="iiifImage.supportsRotationBy90sOnly ? 90 : 1"/>
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
  </div>
</template>

<style scoped>
.settings {
  width: 100%;
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

.rotation-control, .slider-control {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0;
}

.rotation-control span, .slider-control span {
  font-size: 0.8rem;
  color: var(--vt-c-text-light-2);
}

.slider-control {
  flex-direction: column;
  align-items: flex-start;
}

.slider-control label {
  margin-bottom: 5px;
  font-size: 0.9rem;
  text-align: left;
  align-self: flex-start;
  width: 100%;
}

.rotation, .size-slider {
  flex: 1;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: #e0e0e0;
  border-radius: 3px;
  outline: none;
  width: 100%;
}

.rotation::-webkit-slider-thumb, .size-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #4a6baf;
  cursor: pointer;
  transition: background 0.3s ease;
}

.rotation::-moz-range-thumb, .size-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #4a6baf;
  cursor: pointer;
  transition: background 0.3s ease;
  border: none;
}

.rotation::-webkit-slider-thumb:hover, .size-slider::-webkit-slider-thumb:hover {
  background: #3a5a9f;
}

.rotation::-moz-range-thumb:hover, .size-slider::-moz-range-thumb:hover {
  background: #3a5a9f;
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

@media (max-width: 992px) {
  .settings {
    width: 100%;
    max-width: none;
  }
}

@media (max-width: 576px) {
  .setting {
    padding: 10px;
  }
}
</style>
