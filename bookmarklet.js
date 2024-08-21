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

        return message;
    };

    const message = buildMessage();
    console.log(message);
    alert(message);
})();
