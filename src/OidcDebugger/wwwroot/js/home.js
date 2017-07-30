var generatedUrl = '';

var authorizeUriInput,
    redirectUriInput,
    clientIdInput,
    scopesInput,
    responseTypeInput,
    stateInput,
    renderedUriSpan;

var timer;

function wireUpForm() {
    authorizeUriInput = document.getElementById('authorizeUri');
    redirectUriInput = document.getElementById('redirectUri');
    clientIdInput = document.getElementById('clientId');
    scopesInput = document.getElementById('scopes');
    responseTypeInput = document.getElementById('responseType');
    stateInput = document.getElementById('state');
    renderedUriSpan = document.getElementById('renderedUri');

    authorizeUriInput.addEventListener('keyup', debounce(update));
    authorizeUriInput.addEventListener('input', debounce(update));

    redirectUriInput.addEventListener('keyup', debounce(update));
    redirectUriInput.addEventListener('input', debounce(update));

    clientIdInput.addEventListener('keyup', debounce(update));
    clientIdInput.addEventListener('input', debounce(update));

    scopesInput.addEventListener('keyup', debounce(update));
    scopesInput.addEventListener('input', debounce(update));

    responseTypeInput.addEventListener('keyup', debounce(update));
    responseTypeInput.addEventListener('input', debounce(update));

    stateInput.addEventListener('keyup', debounce(update));
    stateInput.addEventListener('input', debounce(update));

    var form = document.getElementById('oidcForm');
    form.addEventListener('submit', sendRequest);

    var initialRedirectUri = window.location.origin + '/debug';
    redirectUriInput.value = initialRedirectUri;

    update();
};

function update() {
    var authorizeUri = removeTrailingSlash(authorizeUriInput.value) || '';

    if (!authorizeUri.length) {
        generatedUrl = '';
        renderedUriSpan.textContent = generatedUrl;
        return;
    }

    generatedUrl = authorizeUri + '?';
    generatedUrl += 'client_id=' + encodeURIComponent(clientIdInput.value);
    generatedUrl += '&redirect_uri=' + encodeURIComponent(redirectUriInput.value);
    generatedUrl += '&scope=' + encodeURIComponent(scopesInput.value);
    generatedUrl += '&response_type=' + encodeURIComponent(responseTypeInput.value);

    var state = stateInput.value;
    if (state && state.length) {
        generatedUrl += '&state=' + encodeURIComponent(state);
    }

    renderedUriSpan.textContent = generatedUrl;
}

function sendRequest(event) {
    event.preventDefault();

    var urlReady = generatedUrl && generatedUrl.length;
    if (!urlReady) alert('Enter some values!');

    window.location = generatedUrl;
}

function removeTrailingSlash(url) {
    if (!url || !url.length) return url;

    return url.substr(-1) === '/'
        ? url.substr(0, url.length - 1)
        : url;
}

function debounce(fn) {
    return function () {
        if (timer) {
            window.clearTimeout(timer);
        }

        timer = window.setTimeout(function () {
            fn();
            window.clearTimeout(timer);
        }, 5);
    }
}

ready(wireUpForm);
