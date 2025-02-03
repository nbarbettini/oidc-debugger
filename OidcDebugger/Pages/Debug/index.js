import Vue from 'vue';
import CodeCard from '../Shared/CodeCard.vue';
import CopyButton from '../Shared/CopyButton.vue';
import DecodedTokenCard from '../Shared/DecodedTokenCard.vue';
import InfoCard from '../Shared/InfoCard.vue';
import utils from '../Shared/utils.js';

Vue.component('info-card', InfoCard);
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
        method: window.serverInfo.method,
        pkceSuccess: false,
        pkceResponse: {},
        pkceError: {},
    },
    computed: {
        code: function () { return this.findValue('code'); },
        accessToken: function () { return this.findValue('access_token'); },
        idToken: function () { return this.findValue('id_token'); },
        tokenType: function () { return this.findValue('token_type'); },
        expiresIn: function () { return this.findValue('expires_in'); },
        state: function () { return this.findValue('state'); },
        error: function () { return this.findValue('error'); },
        errorDescription: function () { return this.findValue('error_description'); },

        usePkce: function () {
            return (localStorage.getItem('odebugger:usePkce') === 'true') || false;
        },

        clientId: function () {
            return localStorage.getItem('odebugger:clientId') || '';
        },
        codeChallenge: function () {
            return sessionStorage.getItem('odebugger:pkceCodeChallenge') || '';
        },
        codeVerifier: function () {
            return sessionStorage.getItem('odebugger:pkceCodeVerifier') || '';
        },
        expectedState: function () {
            return sessionStorage.getItem('odebugger:expectedState') || '';
        },
        savedClientId: function () {
            return localStorage.getItem('odebugger:clientId') || '';
        },
        savedResponseType: function () {
            return localStorage.getItem('odebugger:responseType') || '';
        },
        savedRedirectUri: function () {
            return sessionStorage.getItem('odebugger:redirectUri') || '';
        },
        tokenEndpoint: function () {
            return localStorage.getItem('odebugger:tokenUri') || '';
        },
        success: function () {
            return !this.error.exists && !this.errorDescription.exists;
        },
        flow: function () {
            if (this.code.exists) return 'code';
            if (this.accessToken.exists || this.idToken.exists) return 'implicit';
        },

        reconstructedForm: function () {
            if (!this.formBody || this.formBody.length === 0) return '';
            return this.formBody.map(function (x) { return x.name + '=' + x.value }).join('&');
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
        decodeUri: function (s) {
            s = s || '';
            return decodeURIComponent(s.replace(/\+/g, '%20'));
        },
        findValue: function (name) {
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
        },
        requestToken: function () {

            var self = this;

            var xhr = new XMLHttpRequest();
            xhr.open("POST", this.tokenEndpoint, true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

            var data = {
                client_id: this.clientId,
                code: this.code.value,
                code_verifier: this.codeVerifier,
                grant_type: 'authorization_code',
                redirect_uri: this.savedRedirectUri
            };

            xhr.onreadystatechange = function () {
                if (this.readyState === XMLHttpRequest.DONE) {
                    if (this.status == 200) {
                        self.pkceResponse = JSON.parse(this.responseText);
                        self.pkceSuccess = true;
                    }
                    else {
                        self.pkceSuccess = false;
                        self.pkceError = JSON.parse(this.responseText);
                    }
                }
            }

            var qs = toQueryString(data).slice(1);

            xhr.send(qs);
        }
    },
    beforeMount() {
        if (this.usePkce) {
            this.requestToken();
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

function toQueryString(obj) {
    var str = [];
    if (obj !== null) {
        for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key) &&
                obj[key] !== undefined &&
                obj[key] !== null) {
                str.push(key + '=' + encodeURIComponent(obj[key]));
            }
        }
    }
    if (str.length) {
        return '?' + str.join('&');
    } else {
        return '';
    }
}
