javascript:(function() {
    let triplePixelDetected = typeof window.TriplePixel !== 'undefined' && window.TriplePixel.__cc === true;
    let triplePixelData = typeof window.TriplePixelData !== 'undefined' && window.TriplePixelData;
    let triplePixelShopUrl = typeof window.TriplePixelData !== 'undefined' && window.TriplePixelData.TripleName;
    let triplePixelVersion = typeof window.TriplePixelData !== 'undefined' && window.TriplePixelData.ver;
    let shopifyDetected = typeof window.Shopify !== 'undefined';
    let triplePixelState = typeof window.TriplePixel !== 'undefined' && window.TriplePixel('state');
    let shopifyShop = typeof window.Shopify !== 'undefined' && window.Shopify.shop;
    let ShopifyTheme = typeof window.Shopify !== 'undefined' && window.Shopify.theme && window.Shopify.theme.name;
    let p1requestDetected = false;
    let p1requestSuccess = false;
    let v1ThankYouSnippetDetected = false;
    

    let tripleHeadlessDetected = (typeof window.TripleHeadless !== 'undefined' || (typeof window.TriplePixelData !== 'undefined' && window.TriplePixelData.isHeadless == true));    
    let triplePixelEndpoint= "https://open.pixel.api.whale3.io/trek/add";
    let triplePixelV2eventEndpoint = "https://api.config-security.com/event";
    let triplePixelV2monkeyIdEndpoint = "https://api.config-security.com/model";
    var message = '';

    let scripts = document.getElementsByTagName('script');
    for (var i = 0; i < scripts.length; i++) {
        if (scripts[i].src.includes('triplewhale-pixel.web.app/dot1.9.js')) {
            v1ThankYouSnippetDetected = true;
        }
    }

    if (window.performance && window.performance.getEntriesByType) {
        var requests = window.performance.getEntriesByType("resource");
        if (requests.length > 0) {
            for (var i = 0; i < requests.length; i++) {
                if (requests[i].name.includes(triplePixelEndpoint)) {
                    p1requestDetected = true;
                    if (requests[i].responseStatus && requests[i].responseStatus === 200) {
                        p1requestSuccess = true;
                    }
                } else if (requests[i].name.includes(triplePixelV2eventEndpoint)) {
                    p2EventrequestDetected = true;
                    if (requests[i].responseStatus && requests[i].responseStatus === 200) {
                        p2EventrequestSuccess = true;
                    }
                } else if (requests[i].name.includes(triplePixelV2monkeyIdEndpoint)) {
                    p2MonkeyIdrequestDetected = true;
                    if (requests[i].responseStatus && requests[i].responseStatus === 200) {
                        p2MonkeyIdrequestSuccess = true;
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
            message+="\nSnippet Version: " +(window.TriplePixelData.isHeadless == false || typeof window.TriplePixelData.isHeadless == 'undefined' ? "Standard Snippet" : "Headless Snippet");
            message+="\nPixel Shop URL: " + triplePixelShopUrl; 
            message+="\n\n[ Pixel Snippet Installation " + (tripleHeadlessDetected == true ? "WARNING - Headless snippet used on non-headless page ]" : "GOOD ]");
        } else if (!triplePixelData && triplePixelState) {
            message = "=== SHOP INFO ===";
            message+="\nShopify Installation: Page is hosted by Shopify.";
            message+="\n\n=== PIXEL INSTALLATION ===";
            message+="\nPixel Snippet Installation: Triple Pixel is detected.";
            message+="\nPixel Version: v2 Thank You Snippet";
            message+="\n\n[ Pixel Snippet Installation GOOD ]";
        } else if (v1ThankYouSnippetDetected==true) {
            message = "=== SHOP INFO ===";
            message+="\nShopify Installation: Page is Hosted by Shopify.";
            message+="\n\n=== PIXEL INSTALLATION ===";
            message+="\nPixel Snippet Installation: Triple Pixel is detected.";
            message+="\nPixel Version: v1 Thank You Snippet";
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
    } else if (triplePixelDetected && !shopifyDetected && tripleHeadlessDetected) {
        if (triplePixelData) {
            message = "=== SHOP INFO ===";
            message+="\nShopify Installation: Headless, Third-Party, or Non-Shopify Page.";
            message+="\n\n=== PIXEL INSTALLATION ===";
            message+="\nPixel Snippet Installation: Triple Pixel is detected.";
            message+="\nPixel Version: " + triplePixelVersion;
            message+="\nSnippet Version: Headless Snippet";
            message+="\nPixel Shop URL: " + window.TriplePixelData.TripleName;
            message+="\n\n[ Pixel Snippet Installation GOOD ]";
        } else if (!triplePixelData && triplePixelState) {
                message = "=== SHOP INFO ===";
                message+="\nShopify Installation: Headless, Third-Party, or Non-Shopify Page.";
                message+="\n\n=== PIXEL INSTALLATION ===";
                message+="\nPixel Snippet Installation: Triple Pixel is detected.";
                message+="\nPixel Version: v2 Thank You Snippet";
                message+="\nHeadless Snippet: Detected.";
                message+="\nPixel Shop URL: " + triplePixelShopUrl;
                message+="\n\n[ Pixel Snippet Installation GOOD ]";
        } else {
            message = "=== SHOP INFO ===";
            message+="\nShopify Installation: Headless, Third-Party, or Non-Shopify Page.";
            message+="\n\n=== PIXEL INSTALLATION ===";
            message+="\nPixel Snippet Installation: Triple Pixel is detected.";
            message+="\nPixel Version: Pre-v.1.8";
            message+="\nHeadless Snippet: Detected.";
            message+="\nPixel Shop URL (TripleHeadless): " + window.TripleHeadless;
            message+="\n\n[ Pixel Snippet Installation GOOD ]";
        }
    } else if (triplePixelDetected && !shopifyDetected && !tripleHeadlessDetected) {
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
    if (triplePixelState) {
        message += "\n\n=== PIXEL TRACKING STATUS ===\nPixel Status: " + triplePixelState;
        if (triplePixelV2monkeyIdEndpoint) {
            message+="\nPixel ID Request:\n("+triplePixelV2monkeyIdEndpoint+")\nDetected";
        } else {
            message+="\nPixel ID Request:\n("+triplePixelV2monkeyIdEndpoint+")\nNOT DETECTED";
        }
        if (triplePixelV2eventEndpoint) {
            message+="\n\nPixel Event Request:\n("+triplePixelV2eventEndpoint+")\nDetected";
        } else {
            message+="\n\nPixel Event Request:\n("+triplePixelV2eventEndpoint+")\nNOT DETECTED";
        }
        if (triplePixelV2eventEndpoint && triplePixelV2monkeyIdEndpoint) {
            message += "\n\n[ Pixel is SUCCESSFULLY sending data ]";
        } else {
            message += "\n\n[!! Pixel is installed but is NOT successfully sending data. Make sure the page has finished loading. If so, review your installation !!]";
        }
    } else if (p1requestDetected && p1requestSuccess) {
        message += "\n\n=== PIXEL TRACKING STATUS ===\n\nPixel Request:\n("+triplePixelEndpoint+")\nDetected\n\nPixel Request Status: 200\n\n[ Pixel is SUCCESSFULLY sending data ]";
    } else if (p1requestDetected && !p1requestSuccess && requests.length > 0) {
        message += "\n\n=== PIXEL TRACKING STATUS ===\n[[ NOTE: Be Sure to wait for the entire page to finish loading before checking tracking status. ]]\n\nPixel Request ("+triplePixelEndpoint+"): Detected\nPixel Request Status: Failed\n\n[!! Pixel is NOT successfully sending data. Check server status. !!]";
    } else if (!p1requestDetected) {
        message += "\n\n=== PIXEL TRACKING STATUS ===\n[[ NOTE: Be Sure to wait for the entire page to finish loading before checking tracking status. ]]\n\nPixel Request ("+triplePixelEndpoint+"): NOT DETECTED\n[!! Pixel is NOT successfully sending data. Request is being blocked. !!]";
    }
    console.log(message);
    alert(message);
  })();
