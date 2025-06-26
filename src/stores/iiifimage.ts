import { ref, type Ref, watch, reactive } from 'vue'
import { defineStore } from 'pinia'
import debounce from '@/debounce/debounce'
import { useRouter } from 'vue-router';
import { isEmptyStatement } from 'typescript';

export const iiifImageStore = defineStore('iiifimage', () => {

   //const defaultIiifJsonUrl = 'https://images.memorix.nl/pdp/iiif/8c9832d2-785a-f652-ac68-49f6c9aacbb1/info.json'

  // const router = useRouter()

  // router.push({ name: 'home', params: { url: defaultIiifJsonUrl } })


  const infoJsonUrl = ref('https://images.memorix.nl/pdp/iiif/8c9832d2-785a-f652-ac68-49f6c9aacbb1/info.json')
  // //const infoJsonUrl = ref('https://stadsarchiefamsterdam.memorix.io/resources/records/media/853c6e2f-3124-bd11-f84c-0f9b5f373cad/iiif/3/18920424/info.json')


   //const infoJsonUrl = ref(defaultIiifJsonUrl)


  //this is where the info.json is stored, @todo make types of different versions  
  const infoJson = ref({
    '@context':''
  })

  const iiifImageUrl = ref('')
  const maxWidth = ref(0)
  const maxHeight= ref(0)
  const supportsRotationBy90sOnly = ref(false)

  const iiifParams = reactive({
    region: 'full',
    size: '250,250',
    width: 250,
    height: 250,
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

    try {
      new URL(url);
    } catch (_) {
       setMessage('Failed to load iiif. Is your url valid? ' + '(' + url + ')', 'error')
       return false;  
    }


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
        // Handle qualities
        if(data.extraQualities && data.extraQualities.length > 0) {
          qualities.value = qualities.value.concat(data.extraQualities)
        }

        // Handle sizes
        if(data.sizes && data.sizes.length > 0) {
          data.sizes.forEach(function(value:any) {
            const sizeOption:string = value.width + ',' + value.height
            //sometimes sizes appear more then once for instans in https://stacks.stanford.edu/image/iiif/hg676jb4964%2F0380_796-44/info.json
            preferedSizes.value.indexOf(sizeOption) === -1 ? preferedSizes.value.push(sizeOption) : false
          })
        }

        // Handle formats
        if(data.extraFormats && data.extraFormats.length > 0) {
          formats.value = formats.value.concat(data.extraFormats)
        }

        if(data.width) {
          maxWidth.value = data.width
        }
        if(data.height) {
          maxHeight.value = data.height
        }

        // Check for version-specific features
        const version = getInfoVersion()
        if (version === '3.0') {
          // For IIIF 3.0, check extraFeatures
          if (data.extraFeatures) {
            const hasRotationBy90s = data.extraFeatures.includes('rotationBy90s')
            const hasRotationArbitrary = data.extraFeatures.includes('rotationArbitrary')
            supportsRotationBy90sOnly.value = hasRotationBy90s && !hasRotationArbitrary
          }
        } else if (version === '2.0') {
          // For IIIF 2.0, check profile array
          if (Array.isArray(data.profile) && data.profile.length > 1 && typeof data.profile[1] === 'object') {
            // Check rotation features
            const features = data.profile[1].supports || []
            const hasRotationBy90s = features.includes('rotationBy90s')
            const hasRotationArbitrary = features.includes('rotationArbitrary')
            supportsRotationBy90sOnly.value = hasRotationBy90s && !hasRotationArbitrary

            // Extract qualities from profile
            if (data.profile[1].qualities && Array.isArray(data.profile[1].qualities)) {
              qualities.value = data.profile[1].qualities
            }

            // Extract formats from profile
            if (data.profile[1].formats && Array.isArray(data.profile[1].formats)) {
              formats.value = data.profile[1].formats
            }
          }
        }

        setMessage('iiif image json loaded, detected version:' + version)

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
    formats.value = ['jpg']
    supportsRotationBy90sOnly.value = false

    // Reset all iiifParams to their default values
    iiifParams.region = 'full'
    iiifParams.size = '250,250'
    iiifParams.width = 250
    iiifParams.height = 250
    iiifParams.rotation = '0'
    iiifParams.quality = 'default'
    iiifParams.format = 'jpg'
    iiifParams.maintainAspectRatio = true
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

  // Watch for changes to iiifParams.size and update width and height
  watch(() => iiifParams.size, (newSize) => {
    const sizeParts = newSize.split(',')
    if (sizeParts.length === 2) {
      iiifParams.width = parseInt(sizeParts[0])
      iiifParams.height = parseInt(sizeParts[1])
    }
  })

  // Watch for changes to width and height and update size
  watch([() => iiifParams.width, () => iiifParams.height], ([newWidth, newHeight]) => {
    iiifParams.size = `${newWidth},${newHeight}`
  })

  watch(iiifParams, () => {
    // If the image only supports rotation by 90s, round the rotation value to the nearest 90 degrees
    if (supportsRotationBy90sOnly.value) {
      const rotation = parseInt(iiifParams.rotation)
      const roundedRotation = Math.round(rotation / 90) * 90
      if (rotation !== roundedRotation) {
        iiifParams.rotation = roundedRotation.toString()
      }
    }
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

  return { imageLoaded, maxWidth, maxHeight, iiifParams, infoJson, infoJsonUrl, iiifImageUrl, qualities, loadIiifImageJson, message, messageType, preferedSizes, formats, copyImageUrl, getInfoVersion, supportsRotationBy90sOnly }
})
