(window.webpackJsonp=window.webpackJsonp||[]).push([[35],{380:function(t,e,o){"use strict";o.r(e);var n=o(25),a=o(32);const r=n.$ecomConfig.get("currency")||"BRL",c=t=>{const e={currency:r,content_id:t.sku,content_name:t.name,value:Object(a.a)(t),content_type:"product"};return t.categories&&t.categories.length&&(e.content_category=t.category_tree||t.categories[0].name),e};o(100),o(4);var s=o(6);e.default=()=>{if("object"==typeof window.ttq){const e=window.ttq;(t=>{const e=window.storefront&&window.storefront.context;e&&"products"===e.resource&&t.track("ViewContent",c(e.body))})(e),t=e,setTimeout((()=>{if(document.querySelectorAll("[data-sku]").length&&"/search"===window.location.pathname){const e=new URLSearchParams(document.location.search);t.track("Search",e.get("term"))}}),300),((t,e)=>{const o=window.storefrontApp&&window.storefrontApp.router;if(o){let e,n,a;const c=t=>{const{amount:e}=t||window.storefrontApp,o={value:e&&e.total||s.a.data&&s.a.data.subtotal||0,currency:r,contents:[]};return s.a.data&&Array.isArray(s.a.data.items)&&s.a.data.items.forEach((t=>{let{sku:e,quantity:n,name:a,price:r}=t;o.contents.push({content_id:e,content_name:a,price:r,content_type:"product",quantity:n})})),o},i=o=>{const a=c();!e||o<=1?(t.track("InitiateCheckout",a),e=!0):o<=2?t.track("CompleteRegistration"):n||(t.track("AddPaymentInfo"),n=!0)},d=(e,o)=>{if(!a){if(window.localStorage.getItem("ttq.orderIdSent")!==e){let n;if(o)try{n=JSON.parse(o)}catch(t){n=null}t.track("CompletePayment",{...c(n)}),window.localStorage.setItem("ttq.orderIdSent",e)}a=!0}};let u;const m=t=>{let{name:e,params:o}=t;switch(e){case"cart":i(1);break;case"checkout":o.id||i(2),i(3);break;case"confirmation":clearTimeout(u),o.json?d(o.id,decodeURIComponent(o.json)):u=setTimeout((()=>{o.json?d(o.id,decodeURIComponent(o.json)):d(o.id)}),o.json?1:1500)}};o.currentRoute&&m(o.currentRoute),o.afterEach(m)}})(e),(t=>{s.a.on("addItem",(e=>{let{item:o}=e;t.track("AddToCart",c(o))}))})(e)}var t}}}]);