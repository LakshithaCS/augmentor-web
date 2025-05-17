function generateLaunchUrl(inputUrl) {
    
    // Check if the URL already has a query string
    if (inputUrl.includes('?p=b')) {
        // If it does, add '&redirect=Y' at the end
        inputUrl += 'r';
    } else {
        // Otherwise, add '?redirect=Y'
        inputUrl += '?p=r';
    }

    const encodedUrl = encodeURIComponent(inputUrl);
    console.log(inputUrl)
    console.log(encodedUrl)
    return `https://launchar.app/launch/ar-5?url=${encodedUrl}`;
}

export {generateLaunchUrl};