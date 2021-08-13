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

