var formComponent = new Vue({
    el: '#form-component',
    data: {
        authorizeUri: fromLocalStorage('odebugger:authorizeUri') || '',
        redirectUri: defaultRedirectUri(),
        clientId: fromLocalStorage('odebugger:clientId') || '',
        scopes: defaultScopes(),
        responseTypesArray: loadResponseTypes() || ['code'],
        responseMode: fromLocalStorage('odebugger:responseMode') || 'form_post',
        state: '',
        nonce: randomness(),
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

            result.params.push({ name: 'client_id', value: this.clientId.trim() });
            result.params.push({ name: 'redirect_uri', value: this.redirectUri.trim() });
            result.params.push({ name: 'scope', value: this.scopes.trim() });
            result.params.push({ name: 'response_type', value: this.responseType.trim() });
            result.params.push({ name: 'response_mode', value: this.responseMode.trim() });

            if (this.state.length) result.params.push({ name: 'state', value: this.state });
            if (this.nonce.length) result.params.push({ name: 'nonce', value: this.nonce });

            // Quick 'n dirty form validation
            result.valid = this.clientId.trim().length
                        && this.redirectUri.trim().length
                        && this.scopes.trim().length
                        && this.responseType.trim().length
                        && this.responseMode.trim().length;

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
        saveParameters: function() {
            window.localStorage.setItem('odebugger:authorizeUri', this.authorizeUri);
            window.sessionStorage.setItem('odebugger:expectedState', this.state);
            window.localStorage.setItem('odebugger:clientId', this.clientId);
            window.localStorage.setItem('odebugger:responseType', this.responseType);
            window.localStorage.setItem('odebugger:responseMode', this.responseMode);
            window.sessionStorage.setItem('odebugger:redirectUri', this.redirectUri);
        }
    },
    created: function() {
        this.saveParameters();
    }
});

function fromLocalStorage(key) {
    return window.localStorage.getItem(key);
}

function loadResponseTypes() {
    var savedResponseTypes = fromLocalStorage('odebugger:responseType');
    if (!savedResponseTypes) return;

    return savedResponseTypes.split(' ');
}

function defaultRedirectUri() {
    return removeTrailingSlash(window.location.toString()) + '/debug';
}

function defaultScopes() {
    if (window.tenant === 'oidc') return 'openid ';
    return '';
}
