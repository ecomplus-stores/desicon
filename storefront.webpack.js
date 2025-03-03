const path = require('path')
const dirSearchAlias = path.resolve(__dirname, 'template/js/lib/search-engine')
const pathDslAlias = path.resolve(dirSearchAlias, 'dsl')

module.exports = () => ({
  resolve: {
    alias: {
      './lib/dsl': pathDslAlias,
      './../lib/dsl': pathDslAlias,
      '../lib/dsl': pathDslAlias,
      './methods/set-search-term': path.resolve(dirSearchAlias, 'set-search-term'),
      './js/ShippingCalculator.js': path.resolve(__dirname, 'template/js/custom-js/js/ShippingCalculator.js'),
      './html/ShippingCalculator.html': path.resolve(__dirname, 'template/js/custom-js/html/ShippingCalculator.html'),
      './html/ProductVariations.html': path.resolve(__dirname, 'template/js/custom-js/html/ProductVariations.html'),   
      './js/ProductVariations.js': path.resolve(__dirname, 'template/js/custom-js/js/ProductVariations.js'),   
      './html/TheProduct.html': path.resolve(__dirname, 'template/js/custom-js/html/TheProduct.html'),
      './js/TheProduct.js': path.resolve(__dirname, 'template/js/custom-js/js/TheProduct.js'),
      './html/ProductCard.html': path.resolve(__dirname, 'template/js/custom-js/html/ProductCard.html'),   
      './js/ProductCard.js': path.resolve(__dirname, 'template/js/custom-js/js/ProductCard.js'),   
      //'./html/TheAccount.html': path.resolve(__dirname, 'template/js/custom-js/html/TheAccount.html'),
      //'./js/TheAccount.js': path.resolve(__dirname, 'template/js/custom-js/js/TheAccount.js')
    }
  }
})
