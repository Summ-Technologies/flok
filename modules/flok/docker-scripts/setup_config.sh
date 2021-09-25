#!/usr/bin/env bash
if [[ -z "$API_URL" ]]; then
    echo "API_URL environment variable needs to be present."
    exit 1
fi
if [[ -z "$IMAGES_URL" ]]; then
    echo "IMAGES_URL environment variable needs to be present."
    exit 1
fi

echo "window.appConfig={}" > /usr/share/nginx/html/config.js
echo "window.appConfig.server_base_url=\"$API_URL\"" >> /usr/share/nginx/html/config.js
echo "window.appConfig.images_base_url=\"$IMAGES_URL\"" >> /usr/share/nginx/html/config.js

if [[ -z "$MIXPANEL_TOKEN" ]]; then
    echo "MIXPANEL_TOKEN environment variable not set. Analytics not recording."
else
    echo "window.appConfig.mixpanel_token=\"$MIXPANEL_TOKEN\"" >> /usr/share/nginx/html/config.js
fi

####### Google & google maps config #######
if [[ -z "$GOOGLE_API_KEY" ]]; then
else
    echo "window.appConfig.google_api_key=\"$GOOGLE_API_KEY\"" >> /usr/share/nginx/html/config.js
fi

if [[ -z "$GOOGLE_MAPS_ID_HOTEL_PAGE" ]]; then
else
    echo "window.appConfig.google_maps_id_hotel_page=\"$GOOGLE_MAPS_ID_HOTEL_PAGE\"" >> /usr/share/nginx/html/config.js
fi

####### Algolia config #######
if [[ -z "$ALGOLIA_API_KEY" ]]; then
else
    echo "window.appConfig.algolia_api_key=\"$ALGOLIA_API_KEY\"" >> /usr/share/nginx/html/config.js
fi
if [[ -z "$ALGOLIA_APP_ID" ]]; then
else
    echo "window.appConfig.algolia_app_id=\"$ALGOLIA_APP_ID\"" >> /usr/share/nginx/html/config.js
fi
if [[ -z "$ALGOLIA_DESTINATIONS_INDEX" ]]; then
else
    echo "window.appConfig.algolia_destinations_index=\"$ALGOLIA_DESTINATIONS_INDEX\"" >> /usr/share/nginx/html/config.js
fi
if [[ -z "$ALGOLIA_HOTELS_INDEX" ]]; then
else
    echo "window.appConfig.algolia_hotels_index=\"$ALGOLIA_HOTELS_INDEX\"" >> /usr/share/nginx/html/config.js
fi

echo "Final config.js file"
cat /usr/share/nginx/html/config.js