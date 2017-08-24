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
        infoCard: ''
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
        generatedUri: function() {
            var authorizeUri = removeTrailingSlash(this.authorizeUri) || '';
            
            if (!authorizeUri.length) {
                return '';
            }
        
            uri = '<span>' + authorizeUri + '?</span>';
            uri += '<span>client_id=<span>' + encodeURIComponent(this.clientId.trim()) + '</span><br/></span>';
            uri += '<span>&redirect_uri=<span>' + encodeURIComponent(this.redirectUri.trim()) + '</span><br/></span>';
            uri += '<span>&scope=<span>' + encodeURIComponent(this.scopes.trim()) + '</span><br/></span>';
            uri += '<span>&response_type=<span>' + encodeURIComponent(this.responseType) + '</span><br/></span>';
            uri += '<span>&response_mode=<span>' + encodeURIComponent(this.responseMode) + '</span><br/></span>';
        
            if (this.state.length) uri += '&state=<span>' + encodeURIComponent(this.state) + '</span><br/></span>';
            if (this.nonce.length) uri += '&nonce=<span>' + encodeURIComponent(this.nonce) + '</span><br/></span>';

            return uri;
        },
        responseType: function() {
            return this.responseTypesArray.join(' ');
        },
    },
    methods: {
        showInfo: function(event) {
            this.infoCard = event.target.id;
        }
    }
});
