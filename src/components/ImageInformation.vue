<script setup lang="ts">
import { iiifImageStore } from '../stores/iiifimage'

const iiifImage = iiifImageStore();
</script>

<template>
  <div class="setting">
    <h3>Image Information</h3>
    <div class="scroll">
      <pre>{{ iiifImage.infoJson }}</pre>
    </div>
  </div>
</template>

<style scoped>
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

.scroll {
  overflow: auto;
  max-height: 200px;
  font-size: 0.8rem;
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
}

@media (max-width: 576px) {
  .setting {
    padding: 10px;
  }
}
</style>