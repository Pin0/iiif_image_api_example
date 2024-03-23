import { ref, computed, type Ref, watch, reactive } from 'vue'
import { defineStore } from 'pinia'
import placeHolderImage from '../assets/iiif.png'


function debounce<F extends Function>(
  callback: F,
  wait: number,
  immediate = false,
): (...args: any) => void {
  let timeout: any;
  const callable = (...args: any) => {
    const later = () => {
      timeout = null;
      if (!immediate) callback.apply(callable, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) callback.apply(callable, args);
  };
  return callable;
}

export default debounce;

export const iiifImageStore = defineStore('iiifimage', () => {
  const infoJsonUrl = ref('https://stadsarchiefamsterdam.memorix.io/resources/records/media/853c6e2f-3124-bd11-f84c-0f9b5f373cad/iiif/3/18920424/info.json')
  const infoJson = ref({})
  const iiifImageUrl = ref('')
  const maxWidth = ref(0)
  const maxHeight= ref(0)

  const iiifParams = reactive({
    region: 'full',
    size: '250,250',
    rotation: '0',
    quality: 'default',
    format: 'jpg',
    maintainAspectRatio: true
  })

  //default values, will be replaced with options from image manifest when loaded
  const qualities = ref(['default'])
  const preferedSizes:Ref<string[]> = ref(['250,250'])
  const formats = ref(['jpg'])


  const message = ref('')
  const messageType = ref('info')
  const imageLoaded = ref(false)

  function setMessage(msg:string, type='info') {
    message.value = msg
    messageType.value = type
  }

  const loadIiifImageJson = debounce((url:string) => {

    infoJsonUrl.value = url

    fetch(infoJsonUrl.value)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`Got response.status: ${response.status}`);
        }
      }).then(data => {
        reset()
        infoJson.value = data
        if(data.extraQualities && data.extraQualities.length > 0) {
          qualities.value = qualities.value.concat(data.extraQualities)
        }
        if(data.sizes && data.sizes.length > 0) {
          data.sizes.forEach(function(value:any) {
            const sizeOption:string = value.width + ',' + value.height
            preferedSizes.value.push(sizeOption)
          })
        }
        if(data.extraFormats && data.extraFormats.length > 0) {
          formats.value = formats.value.concat(data.extraFormats)
        }
        if(data.width) {
          maxWidth.value = data.width
        }
        if(data.height) {
          maxHeight.value = data.height
        }

        getImageUrl()
    }).catch(error => {
      reset()
      setMessage('Failed to load iiif. Is your url valid? ' + '(' + error.message + ')', 'error')
    })
  }, 300)

  function reset() {
    setMessage('')
    infoJson.value = {}
    qualities.value = ['default']
  }

  watch(iiifParams, (currentValue, oldValue) => {
    getImageUrl()
  })

  function getImageUrl() {
      imageLoaded.value = false
      let currentSize = iiifParams.size
      if(iiifParams.maintainAspectRatio === true) {
        currentSize = '!'+ currentSize
      }

      if(iiifParams.format === 'tif') {
        setMessage('tif can not be shown in a browser', 'error')
      }

      const imgSrc = infoJsonUrl.value.replace('/info.json', '') + '/' +
        iiifParams.region + '/' +
        currentSize + '/' +
        iiifParams.rotation + '/' +
        iiifParams.quality + '.' +
        iiifParams.format

      const image = new Image()
      image.onerror = function () {
        imageLoaded.value = false
        setMessage('failed to load image', 'error')
      }

      image.onload = function () {
        setMessage('image loaded', 'info')
        imageLoaded.value = true
      }
      image.src = imgSrc
      iiifImageUrl.value = image.src
  }

  loadIiifImageJson(infoJsonUrl.value)

  function copyImageUrl() {
    navigator.clipboard.writeText(iiifImageUrl.value).then(function() {
      console.log('Copied!');
    }, function() {
      console.log('Copy error')
    });
  }

  return { placeHolderImage,imageLoaded, maxWidth, maxHeight, iiifParams, infoJsonUrl, iiifImageUrl, qualities, loadIiifImageJson, message, messageType, preferedSizes, formats, copyImageUrl}
})
