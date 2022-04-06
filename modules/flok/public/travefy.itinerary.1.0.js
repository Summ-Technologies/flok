/* Copied and slightly edited to recall the function from https://travefy.com/embed/itinerary.1.0.js */
window.initTravefy = () => {
  var baseUrl = "https://travefy.com/"

  var sheet = document.createElement("style")
  sheet.innerHTML =
    ".travefy-itinerary { max-width: 688px;width: 100%;margin:0; } .travefy-itinerary iframe {border: 0;width: 1px;min-width:100%;margin: 0;padding:0;overflow: hidden;height: 100%;*width: 100%;}"
  document.body.appendChild(sheet)

  var elements = document.getElementsByClassName("travefy-itinerary")

  Array.prototype.forEach.call(elements, function (element) {
    var id = element.dataset.travefyItineraryId

    var partsOfId = id.split("/")
    var starter = "trips"
    if (partsOfId.length === 1) {
      starter = "trip"
    }

    var iframe = document.createElement("IFRAME")
    iframe.src =
      baseUrl +
      starter +
      "/" +
      id +
      "/embed?ref=" +
      encodeURIComponent(window.location.href)
    iframe.scrolling = "no"
    iframe.width = "100%"
    element.innerHTML = ""
    element.appendChild(iframe)
  })

  var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent"
  var eventer = window[eventMethod]
  var messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message"

  eventer(
    messageEvent,
    function (e) {
      if (e.data.type && e.data.type === "travefy") {
        var matchingContainers = Array.prototype.filter.call(
          elements,
          function (container) {
            return e.data.src === container.childNodes[0].src
          }
        )

        if (e.data.event === "init") {
          Array.prototype.forEach.call(
            matchingContainers,
            function (container) {
              container.childNodes[0].style.height = e.data.height + "px"
            }
          )

          if (window.travefyEmbeddedItineraryIsLoaded) {
            window.travefyEmbeddedItineraryIsLoaded()
          }
        } else if (e.data.event === "modal") {
          Array.prototype.forEach.call(
            matchingContainers,
            function (container) {
              var iframe = container.childNodes[0]
              var iframeY = iframe.offsetTop
              var scrollTop =
                document.body.scrollTop || document.documentElement.scrollTop
              var windowHeight = window.innerHeight
              iframe.contentWindow.postMessage(
                {
                  type: "travefy",
                  event: "modal-response",
                  y: iframeY,
                  scrollTop: scrollTop,
                  windowHeight: windowHeight,
                  src: iframe.src,
                },
                iframe.src
              )
            }
          )
        } else if (e.data.event === "image-viewer") {
          Array.prototype.forEach.call(
            matchingContainers,
            function (container) {
              var iframe = container.childNodes[0]
              var iframeY = iframe.offsetTop
              var scrollTop = container.scrollTop
              var windowHeight = window.innerHeight
              iframe.contentWindow.postMessage(
                {
                  type: "travefy",
                  event: "image-viewer-response",
                  y: iframeY,
                  scrollTop: scrollTop,
                  windowHeight: windowHeight,
                  src: iframe.src,
                },
                iframe.src
              )
            }
          )
        }
      }
    },
    false
  )

  window.replaceTravefyPlaceholders = function (toReplace, replaceWith) {
    var iframe = elements[0].childNodes[0] || elements[0].childNodes[1]

    iframe.contentWindow.postMessage(
      {
        type: "travefy",
        event: "replace-placeholders",
        toReplace: toReplace,
        replaceWith: replaceWith,
      },
      iframe.src
    )
  }
}
