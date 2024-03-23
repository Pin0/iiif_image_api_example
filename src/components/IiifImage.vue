<script setup lang="ts">
import { iiifImageStore } from '../stores/iiifimage'

const iiifImage = iiifImageStore()

</script>

<template>
  <h1>IIIF Image Api Possibilities</h1>
  <div :class="iiifImage.messageType">
    {{ iiifImage.message }} {{ iiifImage.imageLoaded }}
  </div>
  <div class="container">
    <div class="settings">
      <div class="setting">
        <h3>Region</h3>
      </div>
      <div class="setting size">
        <h3>Size ({{ iiifImage.iiifParams.size }}) </h3>
        <div>
          <label>Preferred size</label>
          <select v-model="iiifImage.iiifParams.size">
            <option v-for="size in iiifImage.preferedSizes" :value="size">
              {{ size }}
            </option>
          </select>
        </div>
        <div>
          <label>Aspect ratio</label>
          <input type="checkbox" v-model="iiifImage.iiifParams.maintainAspectRatio" />
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
          <li v-for="(quality, index) in iiifImage.qualities">
            <input type="radio" :id="index" v-model="iiifImage.iiifParams.quality" :value="quality" /> {{ quality}}
          </li>
        </ul>
      </div>
      <div class="setting">
        <h3>Format</h3>
        <ul class="quality">
          <li v-for="(format, index) in iiifImage.formats">
            <input type="radio" :disabled="format == 'tif'" :id="index" v-model="iiifImage.iiifParams.format" :value="format" /> {{ format }}
          </li>
        </ul>
      </div>
    </div>
    <div class="workarea">
      <div class="urlinput">
        <input v-model="iiifImage.infoJsonUrl" @input=" event => iiifImage.loadIiifImageJson(event?.target?.value)" placeholder="iiif image url" />
      </div>
      <div class="preview checkered">
        <img v-if="iiifImage.imageLoaded" :src="iiifImage.iiifImageUrl" />
        <img class="notloadedimage" v-else :src="iiifImage.placeHolderImage" />
      </div>
      <div class="imagurl">
        {{ iiifImage.iiifImageUrl }}
        <button @click="iiifImage.copyImageUrl()">Copy link to this image</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
</style>
