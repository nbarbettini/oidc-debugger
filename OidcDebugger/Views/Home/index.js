import Vue from 'vue';
import InfoCard from '../Shared/InfoCard.vue';
import CopyButton from '../Shared/CopyButton.vue';
import RequestUriCodeCard from './RequestUriCodeCard.vue';
import CustomParameter from './CustomParameter.vue';

Vue.component('info-card', InfoCard);
Vue.component('copy-button', CopyButton);
Vue.component('request-uri-code', RequestUriCodeCard);
Vue.component('custom-parameter', CustomParameter);


new Vue({
  el: '#home-view',
  data: {
    authorizeUri: getHint('authorize_uri_hint')[0] || fromLocalStorage('odebugger:authorizeUri') || '',
    redirectUri: getHint('redirect_uri_hint')[0] || defaultRedirectUri(),
    clientId: getHint('client_id_hint')[0] || fromLocalStorage('odebugger:clientId') || '',
    scopes: getHint('scope_hint')[0] || fromLocalStorage('odebugger:scopes') || defaultScopes(),
    responseTypesArray: loadResponseTypes() || ['code'],
    responseMode: getHint('response_mode_hint')[0] || fromLocalStorage('odebugger:responseMode') || 'form_post',
    state: getHint('state_hint')[0] || '',
    nonce: randomness(),
    customParameters: [],
    selected: ''
  },
  computed: {
    flow: function() {
        var hasCode = this.responseTypesArray.indexOf('code') > -1;
        var hasToken = this.responseTypesArray.indexOf('token') > -1;
        var hasIdToken = this.responseTypesArray.indexOf('id_token') > -1;

        if (hasCode && !hasToken && !hasIdToken) return 'code';
        if (!hasCode && (hasToken || hasIdToken)) return 'implicit';
        if (hasCode && (hasToken || hasIdToken)) return 'hybrid';
    },
    generatedUriObject: function() {
        var authorizeUri = removeTrailingSlash(this.authorizeUri) || '';

        if (!authorizeUri.length) {
            return {};
        }

        var result = {
            authorizeUri,
            encodedUri: '',
            params: [],
            valid: false
        };

        result.params.push({ name: 'client_id', hintName: 'client_id_hint', value: this.clientId.trim() });
        result.params.push({ name: 'redirect_uri', hintName: 'redirect_uri_hint', value: this.redirectUri.trim() });
        result.params.push({ name: 'scope', hintName: 'scope_hint', value: this.scopes.trim() });
        result.params.push({ name: 'response_type', hintName: 'response_type_hint', value: this.responseType.trim() });
        result.params.push({ name: 'response_mode', hintName: 'response_mode_hint', value: this.responseMode.trim() });

        if (this.state.length) result.params.push({ name: 'state', value: this.state });
        if (this.nonce.length) result.params.push({ name: 'nonce', value: this.nonce });

        // Quick 'n dirty form validation
        result.valid = this.clientId.trim().length > 0
                    && this.redirectUri.trim().length > 0
                    && this.scopes.trim().length > 0
                    && this.responseType.trim().length > 0
                    && this.responseMode.trim().length > 0;

        if (result.valid) {
            var encoded = result.authorizeUri + '?';
            for (var i = 0; i < result.params.length; i++) {
                encoded += result.params[i].name + '=' + encodeURIComponent(result.params[i].value);
                if (i < result.params.length - 1) encoded += '&';
            }
            result.encodedUri = encoded;
        }

        return result;
    },
    responseType: function() {
        return this.responseTypesArray.join(' ');
    },
  },
  methods: {
    showInfo: function(event) {
        this.selected = event.target.id;
    },
    addCustomParam: function() {
        this.customParameters.push({
            id: this.customParameters.length,
            key: this.customKey,
            value: this.customValue
        });
    },
    saveParameters: function() {
        window.localStorage.setItem('odebugger:authorizeUri', this.authorizeUri);
        window.sessionStorage.setItem('odebugger:expectedState', this.state);
        window.localStorage.setItem('odebugger:clientId', this.clientId);
        window.localStorage.setItem('odebugger:scopes', this.scopes);
        window.localStorage.setItem('odebugger:responseType', this.responseType);
        window.localStorage.setItem('odebugger:responseMode', this.responseMode);
        window.sessionStorage.setItem('odebugger:redirectUri', this.redirectUri);
    }
  },
  created: function() {
    this.saveParameters();
  }
});

function getHint(key) {
  if (!key) return;
  return querystringAsDictionary(window.location.search)[key] || [];
}

function fromLocalStorage(key) {
  return window.localStorage.getItem(key);
}

function loadResponseTypes() {
  var responseTypeHint = getHint('response_type_hint');
  if (responseTypeHint && responseTypeHint.length > 0) {
      return responseTypeHint;
  }

  var savedResponseTypes = fromLocalStorage('odebugger:responseType');
  if (!savedResponseTypes) return;

  return savedResponseTypes.split(' ');
}

function defaultRedirectUri() {
  return window.location.origin + '/debug';
}

function defaultScopes() {
  if (window.tenant === 'oidc') return 'openid ';
  return '';
}
