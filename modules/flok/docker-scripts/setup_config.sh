#!/usr/bin/env bash
if [[ -z "$API_URL" ]]; then
    echo "API_URL environment variable needs to be present."
    exit 1
fi
if [[ -z "$IMAGES_URL" ]]; then
    echo "IMAGES_URL environment variable needs to be present."
    exit 1
fi
if [[ -z "$GOOGLE_API_KEY" ]]; then
    echo "GOOGLE_API_KEY environment variable not set. Location search will fail."
fi
if [[ -z "$STRIPE_KEY" ]]; then
    echo "STRIPE_KEY environment variable not set. Payment's will fail."
fi
echo "window.appConfig={}" > /usr/share/nginx/html/config.js
echo "window.appConfig.server_base_url=\"$API_URL\"" >> /usr/share/nginx/html/config.js
echo "window.appConfig.images_base_url=\"$IMAGES_URL\"" >> /usr/share/nginx/html/config.js
echo "window.appConfig.google_api_key=\"$GOOGLE_API_KEY\"" >> /usr/share/nginx/html/config.js
echo "window.appConfig.stripe_key=\"$STRIPE_KEY\"" >> /usr/share/nginx/html/config.js
