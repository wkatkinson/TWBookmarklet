javascript:(function() {
    const isDefined = (obj) => typeof obj !== 'undefined';
    const triplePixel = window.TriplePixel || {};
    const triplePixelData = window.TriplePixelData || {};
    const isTriplePixelDetected = isDefined(triplePixel) && triplePixel.__cc === true;
    const triplePixelVersion = triplePixelData.ver;
    const triplePixelShop = triplePixelData.TripleName;
    const triplePixelPlatform = triplePixelData.plat;
    const tripleHeadlessDetected = isDefined(window.TripleHeadless) || (isDefined(triplePixelData.isHeadless) && triplePixelData.isHeadless);
    
    const endpoints = {
        legacy: "https://triplewhale-pixel.web.app/triplepx.txt",
        v1: "https://open.pixel.api.whale3.io/trek/add",
        v2Event: "https://api.config-security.com/event"
    };

    const competitors = [
        { name: 'Northbeam', url: 'northbeam' },
        { name: 'Hyros', url: 'hyros' },
        { name: 'Rockerbox', url: 'getrockerbox' },
        { name: 'Cometly', url: 't.cometlytrack' }
    ];

    const scripts = document.getElementsByTagName('script');

    const foundCompetitors = [];

    for (let i = 0; i < scripts.length; i++) {
        const script = scripts[i];
        for (let j = 0; j < competitors.length; j++) {
            const url = competitors[j].url;
            if (script.src && script.src.indexOf(url) !== -1) {
                if (foundCompetitors.indexOf(competitors[j].name) === -1) {
                    foundCompetitors.push(competitors[j].name);
                }
            }
        }
    }

    const foundPixels = [];

    const adPlatforms = [
        { name: 'Facebook Ads', url: 'connect.facebook.net' },
        { name: 'TikTok Ads', url: 'analytics.tiktok.com' },
        { name: 'Snapchat Ads', url: 'snap.licdn.com' },
        { name: 'Twitter Ads', url: 'static.ads-twitter.com' },
        { name: 'Bing Ads', url: 'bat.bing.com' },
        { name: 'Google Ads', url: 'www.googletagmanager.com' },
        { name: 'Pinterest Ads', url: 'pinterest.com/v3/' },
        { name: 'Reddit Ads', url: 'redditstatic.com/ads/pixel.js' },
        { name: 'Klaviyo', url: 'static.klaviyo.com' },
        { name: 'Hubspot', url: 'js.hs-analytics.net' },
        { name: 'Criteo', url: 'criteo.com' },
        { name: 'Taboola', url: 'sync-t1.taboola.com' },
        { name: 'Applovin', url: 'axon.ai' }
    ];

    for (let i = 0; i < scripts.length; i++) {
        const pixel = scripts[i];
        for (let j = 0; j < adPlatforms.length; j++) {
            const pixelUrl = adPlatforms[j].url;
            if (pixel.src && pixel.src.indexOf(pixelUrl) !== -1) {
                if (foundPixels.indexOf(adPlatforms[j].name) === -1) {
                    foundPixels.push(adPlatforms[j].name);
                }
            }
        }
    }  

    const platform = {
        shopify: isDefined(window.Shopify),
        shopifyShop: isDefined(window.Shopify) ? window.Shopify.shop : null,
        shopifyTheme: isDefined(window.Shopify) && isDefined(window.Shopify.theme) ? window.Shopify.theme.name : null,
        bigCommerce: () => {
            return typeof window.stencilBootstrap !== 'undefined' ||
                   typeof window.BCData !== 'undefined' ||
                   typeof window.consentManagerStoreConfig !== 'undefined' ||
                   typeof window.Storefront !== 'undefined';
        },
        bigCommerceShop: isDefined(window.consentManagerStoreConfig) ? window.consentManagerStoreConfig.storeName : null
    };

    const detectRequest = (url) => {
        const requests = window.performance?.getEntriesByType("resource") || [];
        const matchedRequests = requests.filter(req => req.name.includes(url));
        return {
            detected: matchedRequests.length > 0,
            success: matchedRequests.length > 0 && matchedRequests.every(req => req.responseStatus === 200)
        };
    };

    const detectAppBlock = () => {
        const findComment = (element, commentText) => {
            for (let node of element.childNodes) {
                if (node.nodeType === Node.COMMENT_NODE && node.nodeValue.includes(commentText)) return node;
                const result = findComment(node, commentText);
                if (result) return result;
            }
            return null;
        };
        return findComment(document, 'BEGIN app block: shopify://apps/triplewhale/blocks/triple_pixel_snippet');
    };

    const buildMessage = () => {
        let message = "=== SHOP INFO ===";
        if (platform.shopify) {
            message += `\nPlatform: Shopify\nShopify Theme: ${platform.shopifyTheme}\nShopify URL: ${platform.shopifyShop}`;
        } else if (platform.bigCommerce()) {
            message += `\nPlatform: BigCommerce\nShop Name: ${platform.bigCommerceShop}`;
        } else if (tripleHeadlessDetected) {
            message += `\nPlatform: Headless/Third-Party\n`;
        }

        if (isTriplePixelDetected || detectRequest(endpoints.v2Event).detected) {
            message += "\n\n=== PIXEL INSTALLATION ===";
            const appBlockComment = detectAppBlock();
            const snippetType = tripleHeadlessDetected ? "Headless Snippet" : appBlockComment ? "Theme App Embed" : "Standard Snippet";
            message += `\nPixel Snippet Installation: ${snippetType}\nPixel Version: ${triplePixelVersion}`;
            if (isDefined(triplePixelShop)) {
                message += `\nPixel Shop URL: ${triplePixelShop}`;
            }
            if (isDefined(triplePixelPlatform)) {
                message += `\nPixel Platform: ${triplePixelPlatform}`;
            }

            const legacyRequest = detectRequest(endpoints.legacy);
            const v1Request = detectRequest(endpoints.v1);
            const v2EventRequest = detectRequest(endpoints.v2Event);

            if (v1Request.detected || v2EventRequest.success) {
                message += "\n\n[ Pixel is SUCCESSFULLY sending data ]";
            } else {
                message += "\n\n[!! Pixel is NOT successfully sending data. Check installation !!]";
            }

        } else {
            message += "\n\n=== PIXEL INSTALLATION ===\nPixel Snippet Installation: NOT detected!!";
            message += "\n\n[!! Pixel Snippet Installation BAD. Install Pixel Snippet. !!]";
        }

        if (foundCompetitors.length > 0 || foundPixels.length > 0) {
            message += "\n\n=== COMPETITORS ===";
            if (foundCompetitors.length > 0) {
                message += "\n" + foundCompetitors.join('\n');
            } else {
                message += "\nNone found.";
            }
            message += "\n\n=== AD PIXELS & MARKETING PLATFORMS ===";
            if (foundPixels.length > 0) {
                message += "\n" + foundPixels.join('\n');
            } else {
                message += "\nNone found.";
            }
        } else {
            message += "\n\nNo competitors or ad platform pixels found.";
        }

        return message;
    };

    const message = buildMessage();
    console.log(message);
    alert(message);
})();

