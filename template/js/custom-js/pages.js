// Add your custom JavaScript for storefront pages here.
import Vue from 'vue'
import AffiliateLink from './components/AffiliateLink.vue'

const affiliateLinkDiv = document.getElementById('affiliate-link')
if (affiliateLinkDiv) {
  import('./components/AffiliateLink.vue').then(({ default: AffiliateLink }) => {
    new Vue(AffiliateLink).$mount(affiliateLinkDiv)
  })
}

if($('#page-products').length > 0){
  window.mainProductGallery = [];
  window.mainProductGallery_ = []; 
}
