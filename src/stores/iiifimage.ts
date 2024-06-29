import { ref, computed, type Ref, watch, reactive } from 'vue'
import { defineStore } from 'pinia'
import debounce from '@/debounce/debounce'

export const iiifImageStore = defineStore('iiifimage', () => {
  const infoJsonUrl = ref('https://images.memorix.nl/pdp/iiif/8c9832d2-785a-f652-ac68-49f6c9aacbb1/info.json')
  //const infoJsonUrl = ref('https://stadsarchiefamsterdam.memorix.io/resources/records/media/853c6e2f-3124-bd11-f84c-0f9b5f373cad/iiif/3/18920424/info.json')
  
  //this is where the info.json is stored, @todo make types of different versions  
  const infoJson = ref({
    '@context':''
  })

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
    setTimeout(() => message.value = '', 2000);
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
            //sometimes sizes appear more then once for instans in https://stacks.stanford.edu/image/iiif/hg676jb4964%2F0380_796-44/info.json
            preferedSizes.value.indexOf(sizeOption) === -1 ? preferedSizes.value.push(sizeOption) : false
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

        setMessage('iiif image json loaded, detected version:' + getInfoVersion())

        getImageUrl()
    }).catch(error => {
      reset()
      setMessage('Failed to load iiif. Is your url valid? ' + '(' + error.message + ')', 'error')
    })
  }, 300)

  function reset() {
    setMessage('')
    infoJson.value = {
      '@context':''
    }
    qualities.value = ['default']
    preferedSizes.value = ['250,250']
  }

  function getInfoVersion() {

    // "http://library.stanford.edu/iiif/image-api/1.0/context.json" → Version 1.0
    // "http://iiif.io/api/image/2/context.json" → Version 2.0
    // "http://iiif.io/api/image/3/context.json" → Version 3.0

    let version = 'unknown version'
    switch(infoJson.value['@context']) {
      case 'http://library.stanford.edu/iiif/image-api/1.0/context.json': { 
        version = '1.0'
        break; 
      }
      case 'http://iiif.io/api/image/2/context.json': { 
        version = '2.0'
        break; 
      }
      case 'http://iiif.io/api/image/3/context.json': { 
        version = '3.0'
        break; 
      }
     } 

    return version
  }

  watch(iiifParams, () => {
    getImageUrl()
  })

const getImageUrl = debounce(() => {
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
        imageLoaded.value = true
      }
      image.src = imgSrc
      iiifImageUrl.value = image.src
  }, 700)

  loadIiifImageJson(infoJsonUrl.value)

  function copyImageUrl() {
    navigator.clipboard.writeText(iiifImageUrl.value).then(function() {
      setMessage('url copied to clipboard')
    }, function() {
      setMessage('url copied to clipboard failed', 'error')
    });
  }

  return { imageLoaded, maxWidth, maxHeight, iiifParams, infoJsonUrl, iiifImageUrl, qualities, loadIiifImageJson, message, messageType, preferedSizes, formats, copyImageUrl, getInfoVersion}
})
