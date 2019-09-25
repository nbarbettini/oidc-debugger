import Vue from 'vue';
import CodeCard from '../Shared/CodeCard.vue';
import CopyButton from '../Shared/CopyButton.vue';
import DecodedTokenCard from '../Shared/DecodedTokenCard.vue';
import utils from '../Shared/utils.js';

Vue.component('code-card', CodeCard);
Vue.component('copy-button', CopyButton);
Vue.component('decoded-token-card', DecodedTokenCard);

new Vue({
  el: "#debug-view",
  data: {
      query: parseValues(window.location.search),
      rawQuery: window.location.search.substring(1),
      fragment: parseValues(window.location.hash),
      rawFragment: window.location.hash.substring(1),
      formBody: window.serverInfo.formBody,
      method: window.serverInfo.method
  },
  computed: {
      code: function() { return this.findValue('code'); },
      accessToken: function() { return this.findValue('access_token'); },
      idToken: function() { return this.findValue('id_token'); },
      tokenType: function() { return this.findValue('token_type'); },
      expiresIn: function() { return this.findValue('expires_in'); },
      state: function() { return this.findValue('state'); },
      error: function() { return this.findValue('error'); },
      errorDescription: function() { return this.findValue('error_description'); },

      expectedState: function() {
          return sessionStorage.getItem('odebugger:expectedState') || '';
      },
      savedClientId: function() {
          return localStorage.getItem('odebugger:clientId') || '';
      },
      savedResponseType: function() {
          return localStorage.getItem('odebugger:responseType') || '';
      },
      savedRedirectUri: function() {
          return sessionStorage.getItem('odebugger:redirectUri') || '';
      },
      tokenEndpoint: function() {
          return ''; // todo
      },
      success: function() {
          return !this.error.exists && !this.errorDescription.exists;
      },
      flow: function() {
          if (this.code.exists) return 'code';
          if (this.accessToken.exists || this.idToken.exists) return 'implicit';
      },

      reconstructedForm: function() {
          if (!this.formBody || this.formBody.length === 0) return '';
          return this.formBody.map(function(x) { return x.name + '=' + x.value }).join('&');
      }
  },
  filters: {
      upper: function (value) {
          if (!value) return '';
          return value.toString().toUpperCase();
      }
  },
  methods: {
      safeUnescape: utils.safeUnescape,
      decodeUri: function(s) {
          s = s || '';
          return decodeURIComponent(s.replace(/\+/g, '%20'));
      },
      findValue: function(name) {
          var result = {
              exists: false,
              value: '',
              source: ''
          };
      
          var foundInQuery = findValueInArray(this.query, name);
          if (foundInQuery && foundInQuery.length) {
              result.exists = true;
              result.value = this.decodeUri(foundInQuery);
              result.source = 'query';
          }
      
          var foundInFragment = findValueInArray(this.fragment, name);
          if (foundInFragment && foundInFragment.length) {
              result.exists = true;
              result.value = this.decodeUri(foundInFragment);
              result.source = 'fragment';
          }
      
          var foundInFormBody = findValueInArray(this.formBody, name);
          if (foundInFormBody && foundInFormBody.length) {
              result.exists = true;
              result.value = this.decodeUri(foundInFormBody);
              result.source = 'form';
          }
      
          return result;
      }
  }
});

function parseValues(source) {
  var result = [];

  var vars = source.substring(1).split('&');
  for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      if (pair[0] && pair[0].length) {
          result.push({ name: pair[0], value: pair[1] });
      }
  }

  return result;
}

function findValueInArray(arr, name) {
  if (!arr) return null;

  for (var i = 0; i < arr.length; i++) {
      if (arr[i].name === name) return arr[i].value;
  }

  return null;
}
