// copy from https://github.com/jfromaniello/url-join
// add support esm

/**
const fullUrl = joinUrl('http://www.google.com', 'a', '/b/cd', '?foo=123', '&bar=456', '#heading-1');
console.log(fullUrl); // 'http://www.google.com/a/b/cd?foo=123&bar=456#heading-1'


const fullUrl = new URL('http://www.google.com');
fullUrl.pathname = '/a/b/cd';
fullUrl.searchParams.append('foo', '123');
fullUrl.searchParams.append('bar', '456');
fullUrl.hash = 'heading-1';
console.log(fullUrl.toString()); // 'http://www.google.com/a/b/cd?foo=123&bar=456#heading-1'
 */
export function joinUrl(...args: (string | undefined | (string | undefined)[])[]): string {
  const parts = [] as string[];

  for (const arg of args) {
    if (!arg) continue;
    // flat
    if (Array.isArray(arg)) {
      arg.forEach((it) => {
        if (it && it.length > 0 && it !== '.') {
          parts.push(it);
        }
      });
    } else {
      if (arg.length > 0 && arg !== '.') {
        parts.push(arg);
      }
    }
  }

  if (args.length === 0) return '';
  return normalize(parts);
}

function normalize(strArray: string[]): string {
  if (strArray.length === 0) {
    return '';
  }

  // Filter out any empty string values.
  strArray = strArray.filter((part) => part !== '');

  if (typeof strArray[0] !== 'string') {
    throw new TypeError('Url must be a string. Received ' + strArray[0]);
  }

  // Separate URL parts, path parts, query parts, and hash parts
  const urlParts = [] as string[];
  const pathParts = [] as string[];
  const queryParts = [] as string[];
  const hashParts = [] as string[];

  for (let i = 0; i < strArray.length; i++) {
    const part = strArray[i];
    
    if (i === 0 && (part.includes('://') || part.match(/^[^/:]+:\/*$/))) {
      // Handle the first URL part (protocol + host + existing path/query)
      const [beforeQuery, afterQuery] = part.split(/[?#]/);
      const [baseUrl, ...existingQueryParts] = part.split('?');
      
      if (part.includes('?') || part.includes('#')) {
        // URL has existing query or hash
        urlParts.push(baseUrl);
        if (existingQueryParts.length > 0) {
          const queryAndHash = existingQueryParts.join('?');
          const [queryPart, hashPart] = queryAndHash.split('#');
          if (queryPart) queryParts.push(queryPart);
          if (hashPart) hashParts.push(hashPart);
        }
      } else {
        urlParts.push(part);
      }
    } else if (part.startsWith('?')) {
      // Query parameter
      queryParts.push(part.substring(1));
    } else if (part.startsWith('&')) {
      // Additional query parameter
      queryParts.push(part.substring(1));
    } else if (part.startsWith('#')) {
      // Hash
      hashParts.push(part.substring(1));
    } else {
      // Path part
      pathParts.push(part);
    }
  }

  // Reconstruct URL
  let result = '';

  // Add base URL
  if (urlParts.length > 0) {
    let baseUrl = urlParts[0];
    
    // Handle protocol normalization
    if (baseUrl.match(/^[^/:]+:\/*$/) && pathParts.length > 0) {
      baseUrl = baseUrl + pathParts.shift();
    }

    // Protocol normalization
    if (baseUrl.match(/^file:\/\/\//)) {
      baseUrl = baseUrl.replace(/^([^/:]+):\/*/, '$1:///');
    } else if (!baseUrl.match(/^\[.*:.*\]/)) {
      baseUrl = baseUrl.replace(/^([^/:]+):\/*/, '$1://');
    }

    // Clean up trailing slashes in base URL
    baseUrl = baseUrl.replace(/\/+$/, '');

    result = baseUrl;
  }

  // Add path parts
  for (let i = 0; i < pathParts.length; i++) {
    const pathPart = pathParts[i];
    let cleanPath = pathPart;
    
    if (i === 0 && result === '' && pathPart.startsWith('/')) {
      // First part and it's an absolute path
      if (pathPart === '/') {
        // Special case: just root slash
        cleanPath = '/';
      } else {
        cleanPath = pathPart.replace(/^\/+/, '/').replace(/\/+$/, '');
      }
    } else {
      // Remove leading slashes for non-first parts
      cleanPath = pathPart.replace(/^\/+/, '');
      // For non-last parts, remove trailing slashes
      if (i < pathParts.length - 1) {
        cleanPath = cleanPath.replace(/\/+$/, '');
      } else {
        // For last part, preserve trailing slash if it existed
        if (pathPart.endsWith('/') && !pathPart.match(/^\/+$/)) {
          cleanPath = cleanPath.replace(/\/+$/, '/');
        } else {
          cleanPath = cleanPath.replace(/\/+$/, '');
        }
      }
    }
    
    if (cleanPath && cleanPath !== '.') {
      if (result && !result.endsWith('/') && !cleanPath.startsWith('/')) {
        result += '/';
      }
      result += cleanPath;
    }
  }

  // Add query parts
  if (queryParts.length > 0) {
    const cleanQueryParts = queryParts
      .join('&')
      .split(/[&?]+/)
      .filter(part => part.length > 0);
    
    if (cleanQueryParts.length > 0) {
      result += '?' + cleanQueryParts.join('&');
    }
  }

  // Add hash parts
  if (hashParts.length > 0) {
    result += '#' + hashParts.join('');
  }

  // Clean up trailing slash
  result = result.replace(/\/(\?|&|#[^!])/g, '$1');

  return result;
}
