var formComponent = new Vue({
    el: '#form-component',
    data: {
        authorizeUri: '',
        redirectUri: removeTrailingSlash(window.location.toString()) + '/debug',
        clientId: '',
        scopes: 'openid ',
        responseType: 'code',
        responseMode: 'form_post',
        state: '',
        nonce: '',
    },
    computed: {
        generatedUri: function() {
            var authorizeUri = removeTrailingSlash(this.authorizeUri) || '';
            
            if (!authorizeUri.length) {
                return '';
            }
        
            uri = authorizeUri + '?';
            uri += 'client_id=' + encodeURIComponent(this.clientId);
            uri += '&redirect_uri=' + encodeURIComponent(this.redirectUri);
            uri += '&scope=' + encodeURIComponent(this.scopes);
            uri += '&response_type=' + encodeURIComponent(this.responseType);
            uri += '&response_mode=' + encodeURIComponent(this.responseMode);
        
            if (this.state.length) uri += '&state=' + encodeURIComponent(this.state);
            if (this.nonce.length) uri += '&nonce=' + encodeURIComponent(this.nonce);

            return uri;
        }
    }
});
