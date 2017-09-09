var debugViewComponent = new Vue({
    el: "#debug-view-component",
    data: {
        query: parseValues(window.location.search),
        fragment: parseValues(window.location.hash),
        formBody: window.serverInfo.formBody,
        method: window.serverInfo.method
    },
    computed: {
        code: function() { return this.findValue('code').value; },
        state: function() { return this.findValue('state').value; },
        error: function() { return this.findValue('error').value; },
        errorDescription: function() { return this.findValue('error_description').value; },
        success: function() {
            return true; // todo
        },
        flow: function() {
            return 'code'; // todo
        },
        tokenEndpoint: function() {
            return '/token';
        }, // todo
        clientId: function() {
            return "todo"; // todo
        },
        implicitResponseType: function() {
            return "todo"; // todo
        },
    },
    methods: {
        findValue: function(name) {
            var result = {
                exists: false,
                value: '',
                source: ''
            };
        
            var foundInQuery = findValueInArray(this.query, name);
            if (foundInQuery && foundInQuery.length) {
                result.exists = true;
                result.value = foundInQuery;
                result.source = 'query';
            }
        
            var foundInFragment = findValueInArray(this.fragment, name);
            if (foundInFragment && foundInFragment.length) {
                result.exists = true;
                result.value = foundInFragment;
                result.source = 'fragment';
            }
        
            var foundInFormBody = findValueInArray(this.formBody, name);
            if (foundInFormBody && foundInFormBody.length) {
                result.exists = true;
                result.value = foundInFormBody;
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
