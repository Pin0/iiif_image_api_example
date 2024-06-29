<script setup lang="ts">
import { iiifImageStore } from '../stores/iiifimage'
import placeHolderImage from '../assets/iiif.png'

const iiifImage = iiifImageStore()

</script>

<template>
  <h1><img :src="placeHolderImage" class="iiif-logo-header" /> Image Api Possibilities</h1>
  <div class="container">
    <div class="settings">
      <div class="setting">
        <h3>Region</h3>
        <input v-model="iiifImage.iiifParams.region" name="region" autocomplete="region">
      </div>
      <div class="setting size">
        <h3>Size ({{ iiifImage.iiifParams.size }}) </h3>
        <div>
          <label for="prefered-size">Preferred size</label>
          <select v-model="iiifImage.iiifParams.size" id="prefered-size">
            <option v-for="size in iiifImage.preferedSizes" :key="size">
              {{ size }}
            </option>
          </select>
        </div>
        <div>
          <label for="aspect-ratio">Aspect ratio</label>
          <input type="checkbox" id="aspect-ratio" v-model="iiifImage.iiifParams.maintainAspectRatio" />
        </div>
      </div>
      <div class="setting">
        <h3>Rotation</h3>
        0
        <input id="rangeSlider" type="range" class="rotation" v-model="iiifImage.iiifParams.rotation" min="0" max="360" step="1"/>
        {{ iiifImage.iiifParams.rotation }}
      </div>
      <div class="setting">
        <h3>Quality</h3>
        <ul class="quality">
          <li v-for="(quality, index) in iiifImage.qualities" :key="index">
            <input type="radio" :id="quality" v-model="iiifImage.iiifParams.quality" :value="quality" /> {{ quality}}
          </li>
        </ul>
      </div>
      <div class="setting">
        <h3>Format</h3>
        <ul class="quality">
          <li v-for="(format, index) in iiifImage.formats" :key="index">
            <input type="radio" :disabled="format == 'tif'" :id="format" v-model="iiifImage.iiifParams.format" :value="format" /> {{ format }}
          </li>
        </ul>
      </div>
    </div>
    <div class="workarea">
      <div class="urlinput">
        <input id="iiif-image-url" v-model="iiifImage.infoJsonUrl" @input=" event => iiifImage.loadIiifImageJson(event?.target?.value)" placeholder="iiif image url" />
      </div>
      <div class="preview checkered">
        <Transition appear>
        <div v-if="iiifImage.message" class="message" :class="iiifImage.messageType">
          {{ iiifImage.message }}
        </div>
        </Transition>
        <img v-if="iiifImage.imageLoaded" :src="iiifImage.iiifImageUrl" />
        <img class="notloadedimage" v-else :src="placeHolderImage" />
      </div>
      <div class="imagurl">
        {{ iiifImage.iiifImageUrl }}
        <button @click="iiifImage.copyImageUrl()">Copy link to this image</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
h1{
  padding: 0.3em;
}
.container {
  display: flex;
  flex-direction: row;
  //flex-wrap: wrap;
  height: calc(100vh - 100px);
}
.settings {
  width: 20%;
}
.workarea {
  width: 80%;
}

.setting {
  border: 1px solid lightgrey;
  margin: 0 2px 2px 2px;
  padding: 2px;
  h3 {
    font-weight: bold;
    font-size: smaller;
  }
  ul {
    padding: 1em;
    li {
      list-style: none;
    }
  }
}
.size {
  display: flex;
  flex-direction: column;
  div {
    label {
      display: inline-block;
      width: 50%;
    }
  }
}
.urlinput {
  input {
    display: block;
    width: 90%;
    margin: 0 auto;
    padding: 0.2em;
    text-overflow: ellipsis;
  }
}
.preview {
  height: 80%;
  width: 100%;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  img {
    max-width: 500px;
  }
  .notloadedimage {
    width:10%
  }
  overflow: hidden;
  position: relative;
  .message {
    position: absolute;
    top: 0;
    margin: 1em;
    padding: 1em;
    color: white;
    font-weight: bold;
    border-radius: 1em;
  }
  .info {
    background-color: cornflowerblue;
  }
  .error {
    background-color: darkred;
  }
}
.checkered {
  background-image:
    linear-gradient(45deg, #ccc 25%, transparent 25%),
    linear-gradient(135deg, #ccc 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #ccc 75%),
    linear-gradient(135deg, transparent 75%, #ccc 75%);
  background-size:20px 20px; /* Must be a square */
  background-position:0 0, 10px 0, 10px -10px, 0 10px; /* Must be half of one side of the square */
}
.imagurl {
  text-overflow: ellipsis;
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
  width: 2%;
}
</style>
