<script setup lang="ts">
// No specific imports needed for this component
</script>

<template>
  <div class="nav-links">
    <router-link to="/https://images.memorix.nl/pic/iiif/6e9c8601-a376-29c8-bc82-a20177020e92/info.json">Example 1</router-link>
    <router-link to="/https://stacks.stanford.edu/image/iiif/hg676jb4964%2F0380_796-44/info.json">Example 2</router-link>
    <router-link to="/https://stadsarchiefamsterdam.memorix.io/resources/records/media/e667a5ea-e7fc-a197-1380-f35dfaa51466/iiif/3/23989087/info.json">Example 3</router-link>
  </div>
</template>

<style scoped>
/* Navigation links */
.nav-links {
  display: flex;
  gap: 10px;
  margin-bottom: 1.5rem;
  padding: 0 1rem;
  flex-wrap: wrap;
}
</style>