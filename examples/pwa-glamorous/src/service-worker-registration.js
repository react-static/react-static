/**
 * Copyright 2015 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-env browser */

// In production, we register a service worker to serve assets from local cache.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on the "N+1" visit to a page, since previously
// cached resources are updated in the background.

// To learn more about the benefits of this model, read https://goo.gl/KwvDNy.
// This link also includes instructions on opting out of this behavior.
export default function register () {
  // Register the service worker
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = 'service-worker.js'
      navigator.serviceWorker
        .register(swUrl)
        .then(reg => {
          // updatefound is fired if service-worker.js changes.
          reg.onupdatefound = () => {
            // The updatefound event implies that reg.installing is set; see
            // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
            const installingWorker = reg.installing

            installingWorker.onstatechange = () => {
              switch (installingWorker.state) {
                case 'installed':
                  if (navigator.serviceWorker.controller) {
                    /* At this point, the old content will have been purged
                    and the fresh content will have been added to the cache.

                    It's the perfect time to display a "New content is
                    available; please refresh." message in the page's
                    interface. */
                    console.log('New or updated content is available.')
                  } else {
                    /* At this point, everything has been precached.

                    It's the perfect time to display a "Content is cached for
                    offline use." message. */
                    console.log('Content is now available offline!')
                  }
                  break
                case 'redundant':
                  console.error('The installing service worker became redundant.')
                  break
                default:
              }
            }
          }
        })
        .catch(error => {
          console.error('Error during service worker registration:', error)
        })
    })
  }
}

export function unregister () {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister()
    })
  }
}
