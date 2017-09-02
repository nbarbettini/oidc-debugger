var formComponent = new Vue({
    el: '#form-component',
    data: {
        authorizeUri: '',
        redirectUri: removeTrailingSlash(window.location.toString()) + '/debug',
        clientId: '',
        scopes: 'openid ',
        responseTypesArray: ['code'],
        responseMode: 'form_post',
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
                params: []
            };

            result.params.push({ name: 'client_id', value: this.clientId.trim() });
            result.params.push({ name: 'redirect_uri', value: this.redirectUri.trim() });
            result.params.push({ name: 'scope', value: this.scopes.trim() });
            result.params.push({ name: 'response_type', value: this.responseType.trim() });
            result.params.push({ name: 'response_mode', value: this.responseMode.trim() });

            if (this.state.length) result.params.push({ name: 'state', value: this.state });
            if (this.nonce.length) result.params.push({ name: 'nonce', value: this.nonce });

            return result;
        },
        responseType: function() {
            return this.responseTypesArray.join(' ');
        },
    },
    methods: {
        showInfo: function(event) {
            this.selected = event.target.id;
        }
    }
});
