javascript:(function() {
    let triplePixelDetected = typeof window.TriplePixel !== 'undefined' && window.TriplePixel.__cc === true;
    let triplePixelData = typeof window.TriplePixelData !== 'undefined' && window.TriplePixelData;
    let triplePixelShopUrl = typeof window.TriplePixelData !== 'undefined' && window.TriplePixelData.TripleName;
    let triplePixelVersion = typeof window.TriplePixelData !== 'undefined' && window.TriplePixelData.ver;
    let shopifyDetected = typeof window.Shopify !== 'undefined';
    let shopifyShop = typeof window.Shopify !== 'undefined' && window.Shopify.shop;
    let ShopifyTheme = typeof window.Shopify !== 'undefined' && window.Shopify.theme.name;
    let requestDetected = false;
    let requestSuccess = false;

    if (triplePixelVersion === "2.0") {
        var pixel2state = TriplePixel('state');
    }
    let tripleHeadlessDetected = typeof window.TripleHeadless !== 'undefined';
    let triplePixelEndpoint= "https://open.pixel.api.whale3.io/trek/add";
    var message = '';

    if (window.performance && window.performance.getEntriesByType) {
        var requests = window.performance.getEntriesByType("resource");
        if (requests.length > 0) {
            for (var i = 0; i < requests.length; i++) {
                if (requests[i].name.includes(triplePixelEndpoint)) {
                    requestDetected = true;
                    if (requests[i].responseStatus && requests[i].responseStatus === 200) {
                        requestSuccess = true;
                    }
                }
            }
        }
    }

    if (triplePixelDetected && shopifyDetected) {
        if (triplePixelData) {
            message = "=== SHOP INFO ===";
            message+="\nShopify Installation: Page is hosted by Shopify.";
            message+="\nShopify Theme: " + ShopifyTheme;
            message+="\nShopify URL: " + shopifyShop;
            message+="\n\n=== PIXEL INSTALLATION ===";
            message+="\nPixel Snippet Installation: Triple Pixel is detected.";
            message+="\nPixel Version: " + triplePixelVersion;
            message+="\nPixel Shop URL: " + triplePixelShopUrl; 
            message+="\n\n[ Pixel Snippet Installation GOOD ]";
        } else {
            message = "=== SHOP INFO ===";
            message+="\nShopify Installation: Page is hosted by Shopify.";
            message+="\nShopify Theme: " + ShopifyTheme;
            message+="\nShopify URL: " + shopifyShop;
            message+="\n\n=== PIXEL INSTALLATION ===";
            message+="\nPixel Snippet Installation: Triple Pixel is detected.";
            message+="\nPixel Version: Pre-v.1.8";
            message+="\n\n[ Pixel Snippet Installation GOOD ]";
        }
    } else if (triplePixelDetected && tripleHeadlessDetected) {
        if (triplePixelData) {
            message = "=== SHOP INFO ===";
            message+="\nShopify Installation: Headless, Third-Party, or Non-Shopify Page.";
            message+="\n\n=== PIXEL INSTALLATION ===";
            message+="\nPixel Snippet Installation: Triple Pixel is detected.";
            message+="\nPixel Version: " + triplePixelVersion;
            message+="\nHeadless Snippet: Detected.";
            message+="\nPixel Shop URL: " + window.TripleHeadless;
            message+="\n\n[ Pixel Snippet Installation GOOD ]";
        } else {
            message = "=== SHOP INFO ===";
            message+="\nShopify Installation: Headless, Third-Party, or Non-Shopify Page.";
            message+="\n\n=== PIXEL INSTALLATION ===";
            message+="\nPixel Snippet Installation: Triple Pixel is detected.";
            message+="\nPixel Version: Pre-v.1.8";
            message+="\nHeadless Snippet: Detected.";
            message+="\n\n[ Pixel Snippet Installation GOOD ]";
        }
    } else if (triplePixelDetected) {
        if (triplePixelData) {
            message = "=== SHOP INFO ===";
            message+="\nShopify Installation: Headless, Third-Party, or Non-Shopify Page.";
            message+="\n\n=== PIXEL INSTALLATION ===";
            message+="\nPixel Snippet Installation: Triple Pixel is detected.";
            message+="\nPixel Version: " + triplePixelVersion;
            message+="\nHeadless Snippet: NOT FOUND!!";
            message+="\n\n[!! Pixel Snippet Installation BAD. Install Headless Snippet. !!]";
        } else {
            message = "=== SHOP INFO ===";
            message+="\nShopify Installation: Headless, Third-Party, or Non-Shopify Page.";
            message+="\n\n=== PIXEL INSTALLATION ===";
            message+="\nPixel Snippet Installation: Triple Pixel is detected.";
            message+="\nPixel Version: Pre-v.1.8";
            message+="\nHeadless Snippet: NOT FOUND!!";
            message+="\n\n[!! Pixel Snippet Installation BAD. Install Headless Snippet. !!]";
        }
    } else if (shopifyDetected && !triplePixelDetected) {
        message = "=== SHOP INFO ===";
        message+="\nShopify Installation: Page is hosted by Shopify.";
        message+="\nShopify Theme: " + ShopifyTheme;
        message+="\nShopify URL: " + shopifyShop;
        message+="\n\n=== PIXEL INSTALLATION ===";
        message+="\nPixel Snippet Installation: Triple Pixel is NOT detected!!";
        message+="\n\n[!! Pixel Snippet Installation BAD. Install Pixel Snippet. !!]";
    } else if (!shopifyDetected && !triplePixelDetected) {
        message = "=== SHOP INFO ===";
        message+="\nShopify Installation: Headless, Third-Party, or Non-Shopify Page.";
        message+="\n\n=== PIXEL INSTALLATION ===";
        message+="\nPixel Snippet Installation: Triple Pixel is NOT detected!!";
        message+="\n\n[!! Pixel Snippet Installation BAD. Install Pixel Snippet. !!]";
    }

    if (requestDetected && requestSuccess && triplePixelVersion !== "2.0") {
        message += "\n\n=== PIXEL TRACKING STATUS ===\n\nPixel Request: Detected\nPixel Request Status: 200\n\n[ Pixel is SUCCESSFULLY sending data ]";
    } else if (requestDetected && !requestSuccess && requests.length > 0 && !requestSuccess && !triplePixelVersion || triplePixelVersion !== "2.0") {
        message += "\n\n=== PIXEL TRACKING STATUS ===\n[[ NOTE: Be Sure to wait for the entire page to finish loading before checking tracking status. ]]\n\nPixel Request: Detected\nPixel Request Status: Failed\n\n[!! Pixel is NOT successfully sending data. Check server status. !!]";
    } else if (!requestDetected && !triplePixelVersion || triplePixelVersion !== "2.0") {
        message += "\n\n=== PIXEL TRACKING STATUS ===\n[[ NOTE: Be Sure to wait for the entire page to finish loading before checking tracking status. ]]\n\nPixel Request: NOT DETECTED\n[!! Pixel is NOT successfully sending data. Request is being blocked. !!]";
    } else if (triplePixelVersion === "2.0" && pixel2state === "Ready") {
        message += "\n\n=== PIXEL TRACKING STATUS ===\nPixel Status: Ready\n[ Pixel is SUCCESSFULLY sending data ]";
    } else if (triplePixelVersion === "2.0" && pixel2state === "Installed") {
        message += "\n\n=== PIXEL TRACKING STATUS ===\nPixel Status: Installed, but not 'ready'\n[!! Pixel is installed, but is not sending data. Review your installation. !!]";
    }
    console.log(message);
    alert(message);
  })();