const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Boşluk içeren yolları düzeltmek için
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      const url = req.url;
      if (url.includes(' ')) {
        req.url = url.replace(/ /g, '%20');
      }
      return middleware(req, res, next);
    };
  },
};

module.exports = config; 