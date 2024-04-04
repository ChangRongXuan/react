import React, { useState, useEffect, useRef } from 'react' // eslint-disable-line

const FILE_EXTENSION_WEBP = 'webP'

/**
 * Check an String contain integer, for example, 'w1200' is valid, 'original' or 'randomName' is not valid
 */
const REGEX = /(\d+)/

const errorMessage = {
  noImageProvided: 'None of Image Provided',
  unableGetResolution: 'Unable to get resolution',
  unableLoadImages: 'Unable to load any image',
  unableLoadDefaultImage: 'Unable to load default image',
}

/**
 * @param {import('../types/index').ImageProps} props
 * @returns {JSX.Element}
 */
export default function CustomImage({
  images = { original: '' },
  imagesWebP = null,
  loadingImage = '',
  defaultImage = '',
  alt = '',
  objectFit = 'cover',
  width = '100%',
  height = '100%',
  priority = false,
  debugMode = false,
  rwd = {
    mobile: '100vw',
    tablet: '100vw',
    laptop: '100vw',
    desktop: '100vw',
    default: '100vw',
  },
  breakpoint = {
    mobile: '767px',
    tablet: '1199px',
    laptop: '1439px',
    desktop: '2439px',
  },
  intersectionObserverOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.25,
  },
  className = '',
}) {
  const imageRef = useRef(null)
  const [imageSrc, setImageSrc] = useState(
    loadingImage ? loadingImage : defaultImage
  )
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  const getImageStyle = () => {
    return {
      objectFit,
      width,
      height,
      filter: getFilter(),
    }

    function getFilter() {
      if (loadingImage || isImageLoaded) {
        return 'unset'
      } else {
        return 'blur(8px)'
      }
    }
  }
  /**
   * custom image style
   *
   */
  const imageStyle = getImageStyle()
  /**
   * Print log when `props.debugMode` is true
   * @param {String} message
   * @returns {void}
   */
  const printLogInDevMode = (message) => {
    if (debugMode) {
      console.log(message)
    }
  }

  /**
   * Transform params `images` into an array, which included three step:
   * 1. use `Object.entries` to transform object to an array, each item is an another array which item is the key and value of certain property.
   *    For example, { original: 'original.png' ,w480: 'w480.png' } will transform into [["original", "original.png"], ["w480","w480.png"] ], this array is composed of two item, each item contain two child-item.
   * 2. Check each item of array and remove it under certain conditions:
   *    a. the first child-item (which is the key of certain property in params `images`) does not start with letter "w".
   *    b. the first child-item does not contain integers.
   *    c. the second child-item (which is the key of certain property in params `images`) is falsy values, e.g. empty string, undefined, null.
   *    As long as one of the conditions is met, will remove item.
   *    If the first child-item is "original", will not remove no matter what.
   * 3. Sort array by the difference of first child-item. It will check the integer in first child-item, the smaller will be placed forward. If there is no integer in first child-item, it will be placed backward.
   * In the end, if the params `images` is { 1600: '1600.png', original: 'original.png' ,w480: 'w480.png', w800: '', w1200: 'w1200.png' },
   * it will return [ ['w480': 'w480.png'], ['w1200': 'w1200.png'], 'original': 'original.png']
   * @param {Object} images
   * @returns {[string, string][]}
   */
  const transformImagesContent = (images) => {
    /** @type {[string,string][]} */
    const imagesWithoutEmptyProperty = Object.entries(images)
      .filter(
        (pair) => (/^w\d+$/.test(pair[0]) && pair[1]) || pair[0] === 'original'
      )
      .map(([key, value]) => [key, encodeURI(value)])
    const sortedImagesList = imagesWithoutEmptyProperty.sort((pairA, pairB) => {
      // pair: [w800, image-w800.jpg], [original, image.jpg]
      const keyA = pairA[0]
      const keyB = pairB[0]
      const matchedA = keyA.match(REGEX)
      const matchedB = keyB.match(REGEX)
      if (matchedA && matchedB) {
        // match: [800]
        const sizeA = Number(matchedA[0])
        const sizeB = Number(matchedB[0])
        return sizeA - sizeB
      } else if (matchedA) {
        return -1
      } else {
        return 1
      }
    })
    return sortedImagesList
  }

  /**
   * Transform list of images into string for attribute 'srcset' of <img>.
   * @param {[string, string][]} imagesList - list of images
   */
  const transformImagesSrcSet = (imagesList) => {
    const str = imagesList
      .filter(
        (pair) =>
          pair[0] !== 'original' &&
          pair[0] !== `original-${FILE_EXTENSION_WEBP}`
      )
      .map((pair) => {
        const widthText = pair[0].replace(`-${FILE_EXTENSION_WEBP}`, '')
        const width = widthText.match(REGEX)[0]
        return `${pair[1]} ${width}w`
      })
      .join(',')

    return str
  }

  /**
   * @param {string} sizes
   * @param {string} defaultValue
   * @returns {string}
   */
  const joinSizesWidthDefaultValue = (sizes, defaultValue) => {
    if (/max-width/.test(sizes)) {
      return [sizes, defaultValue].join(', ')
    } else {
      return defaultValue
    }
  }

  /**
   * @param {Object} rwd
   * @param {Object} breakpoint
   * @returns {string}
   */
  const transformImageSizes = (rwd, breakpoint) => {
    const defaultValue = '100vw'
    let sizesStr

    if (rwd && Object.entries(rwd).length) {
      const obj = {}

      Object.keys(rwd).forEach((key) => {
        if (breakpoint[key]) {
          obj[breakpoint[key]] = rwd[key]
        }
      })
      const sizes = Object.entries(obj)
        .map((pair) => `(max-width: ${pair[0]}) ${pair[1]}`)
        .join(', ')

      sizesStr = joinSizesWidthDefaultValue(
        sizes,
        rwd.default ? rwd.default : defaultValue
      )
    } else {
      sizesStr = defaultValue
    }

    printLogInDevMode(`Generated \`sizes\` info is \`${sizesStr}\``)
    return sizesStr
  }

  /**
   * Check which image should be load first, and return the resolution of image.
   * @param {[string, string][]} imagesList - The URL of the images to load
   * @returns {Promise<string>} - the resolution of image should be loaded
   */
  const getResolution = (imagesList) => {
    const imageSrcSet = transformImagesSrcSet(imagesList)
    const sizes = transformImageSizes(rwd, breakpoint)

    const originalWebPSrc = imagesList.find(
      (pair) => pair[0] === `original-${FILE_EXTENSION_WEBP}`
    )?.[1]
    const originalSrc = imagesList.find((pair) => pair[0] === 'original')?.[1]

    return new Promise((resolve, reject) => {
      if (imageSrcSet) {
        const img = new Image()
        /**
         * @param {Event & { target: HTMLImageElement }} event
         */
        const eventHandler = (event) => {
          const eventType = event.type
          const imageSrc = event.target?.currentSrc
          const index = imagesList.findIndex((p) => p[1] === imageSrc)
          if (index === -1) {
            reject()
          } else if (index < imagesList.length - 1) {
            switch (eventType) {
              case 'load':
                resolve(imagesList[index][0])
                break
              case 'error':
                resolve(imagesList[index + 1][0])
            }
          } else {
            resolve(imagesList[imagesList.length - 1][0])
          }

          img.removeEventListener('load', eventHandler)
          img.removeEventListener('error', eventHandler)
        }

        img.addEventListener('load', eventHandler)
        img.addEventListener('error', eventHandler)
        img.sizes = sizes
        img.srcset = imageSrcSet
      } else if (originalWebPSrc) {
        resolve(`original-${FILE_EXTENSION_WEBP}`)
      } else if (originalSrc) {
        resolve('original')
      } else {
        const err = new Error(errorMessage.unableGetResolution)
        reject(err)
      }
    })
  }

  /**
   * Load an image and return the URL of image
   * @param {String} url - The URL of the image to load
   * @returns {Promise<String>} - The URL of the image
   */
  const loadImage = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image()

      const loadHandler = () => {
        resolve(url)
        img.removeEventListener('load', loadHandler)
      }
      const errorHandler = () => {
        reject()
        img.removeEventListener('error', errorHandler)
      }

      img.addEventListener('load', loadHandler)
      img.addEventListener('error', errorHandler)
      img.src = url
    })
  }

  /**
   * Loads a list of images in sequence, it will start loading on certain resolution.
   * If previous promise is resolved, will end the promise chain, and return URL of image which successfully loaded.
   * If previous promise is rejected, will execute next promise
   * @param {string} resolution - The resolution determine which URL of image should loaded first.
   * @param {[string,string][]} imagesList - The resolution determine which URL of image should loaded first.
   * @returns {Promise<string>} - The URL of the image should loaded
   * @throws {Error<string>}
   */
  const loadImages = (resolution, imagesList) => {
    const index = imagesList.findIndex((pair) => pair[0] === resolution)
    const loadList = imagesList.slice(index)
    return loadList.reduce((prevPromise, pair) => {
      return prevPromise.catch(() => {
        const isLastImageUrl = pair[1] === loadList[loadList.length - 1][1]

        if (isLastImageUrl) {
          return loadImage(pair[1]).catch(() => {
            throw new Error(errorMessage.unableLoadImages)
          })
        }
        return loadImage(pair[1])
      })
    }, Promise.reject())
  }
  /**
   *
   * @param {string} url
   */
  const handleImageOnLoaded = (url) => {
    setImageSrc(url)
    setIsImageLoaded(true)
  }

  const getImagesList = (images, imagesWebP) => {
    const hasImages = !!images && !!Object.entries(images).length
    const hasWebPImage = !!imagesWebP && !!Object.entries(imagesWebP).length
    if (!hasImages && !hasWebPImage) {
      throw new Error(errorMessage.noImageProvided)
    }
    const imagesList = transformImagesContent(images)

    if (hasWebPImage) {
      const imagesWebPList = transformImagesContent(imagesWebP).map((pair) => {
        return [`${pair[0]}-${FILE_EXTENSION_WEBP}`, pair[1]]
      })
      const imagesListContainWebP = imagesList.concat(imagesWebPList)

      const sortedList = imagesListContainWebP.sort(sortByResolutionAndIsWebP)

      return sortedList

      /**
       * Function for Sort imagesList containing webP images.
       * Sorting rule is:
       *  1. Sort by resolution of images from small to large.
       *  2. if resolution is same, webP image will be placed forward.
       * So order after sorting will be:
       * `w480-webP` -> `w480` -> `w800-webP` -> `w800` ...... -> `original-webP` -> `original`
       * @param {[string, string]} pairA
       * @param {[string, string]} pairB
       * @returns {[string, string][]}
       */
      function sortByResolutionAndIsWebP(pairA, pairB) {
        const getResolution = (str) => {
          const match = str.match(/\d+/)
          return match ? parseInt(match[0]) : Infinity
        }

        const numA = getResolution(pairA[0])
        const numB = getResolution(pairB[0])

        if (numA !== numB) {
          return numA - numB
        }

        const pairAIsWebP = pairA[0].endsWith(`-${FILE_EXTENSION_WEBP}`)
        const pairBIsWebP = pairB[0].endsWith(`-${FILE_EXTENSION_WEBP}`)

        if (pairAIsWebP !== pairBIsWebP) {
          return pairAIsWebP ? -1 : 1
        }

        return 0
      }
    } else {
      return imagesList
    }
  }
  const loadImageProgress = async () => {
    try {
      const imagesList = getImagesList(images, imagesWebP)
      const resolution = await getResolution(imagesList)
      const url = await loadImages(resolution, imagesList)
      handleImageOnLoaded(url)
      printLogInDevMode(
        `Successfully Load image, current image source is ${url}`
      )
    } catch (e) {
      switch (e.message) {
        case errorMessage.noImageProvided:
          printLogInDevMode(
            `${e.message}, which means either params images and imagesWebp in null, undefined, or empty object. Try to use default image as image src`
          )
          break
        case errorMessage.unableGetResolution:
          printLogInDevMode(
            `${e.message}, which means doesn't provide any url of image, try to use default image as image src`
          )
          break
        case errorMessage.unableLoadImages:
          printLogInDevMode(
            `${e.message}, try to use default image as image src`
          )
          break
        default:
          printLogInDevMode(`Unexpected error, ${e}`)
          break
      }
      if (imageRef?.current?.src) {
        handleImageOnLoaded(defaultImage)
        imageRef?.current.addEventListener('error', () => {
          printLogInDevMode(`${errorMessage.unableLoadDefaultImage}`)
        })
      }
    }
  }

  const callback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        loadImageProgress()
        observer.unobserve(entry.target)
      }
    })
  }

  useEffect(() => {
    if (isImageLoaded) {
      return
    }
    try {
      let observer

      if (!priority) {
        observer = new IntersectionObserver(
          callback,
          intersectionObserverOptions
        )
        observer.observe(imageRef.current)
      } else {
        loadImageProgress()
      }

      return () => {
        if (observer) {
          observer.disconnect()
        }
      }
    } catch (err) {
      imageRef.current.style.visibility = 'hidden'
      console.error(`Unhandled error happened, hide image element', ${err}`)
    }
  }, [
    defaultImage,
    printLogInDevMode,
    intersectionObserverOptions,
    isImageLoaded,
  ])

  return (
    <img
      className={`readr-media-react-image ${className}`}
      style={imageStyle}
      ref={imageRef}
      src={imageSrc}
      alt={alt}
      rel={priority ? 'preload' : ''}
    ></img>
  )
}
