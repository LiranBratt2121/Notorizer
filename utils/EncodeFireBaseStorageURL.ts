function encodePath(url: string) {
    const queryIndex = url.indexOf('?alt=media');
  
    const path = url.substring(0, queryIndex);
    
    const encodedPath = path.replace(/\/images\//g, '/images%2F');
    
    const resultUrl = encodedPath + url.substring(queryIndex);
    
    return resultUrl;
}

export default encodePath;