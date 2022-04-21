export function removeTrailingSlash(s) {
    if (!s || !s.length) return s;

    return s.substr(-1) === '/'
        ? s.substr(0, s.length - 1)
        : s;
}

export function randomness() {
    return Math.random().toString(36).substring(2);
}

export function randomString(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

export function hash(codeChallengeMethod, plainText) {
    if (codeChallengeMethod == 'plain')
        return Promise.resolve(plainText);

    else if (codeChallengeMethod == 'disabled')
        return Promise.resolve('disabled');

    else {
        var encoder = new TextEncoder();
        var algorithm = getAlgorithm(codeChallengeMethod);

        return window.crypto.subtle.digest(algorithm, encoder.encode(plainText))
            .then(digest => {
                var hash = String.fromCharCode.apply(null, new Uint8Array(digest));
                const b64 = btoa(hash);
                return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
            }).catch(err => {
                console.log(err)
            });
    }
}

function getAlgorithm(codeChallengeMethod) {
    switch (codeChallengeMethod) {
        case 'S256':
            return 'SHA-256';
        default:
            return null;
    }
}

// Courtesy of https://stackoverflow.com/a/21152762/3191599
export function querystringAsDictionary(qs) {
    var dict = {};
    if (qs) qs.substr(1).split("&").forEach(function (item) {
        var s = item.split("="),
            k = s[0],
            v = s[1] && decodeURIComponent(s[1]);
        (dict[k] = dict[k] || []).push(v)
    });
    return dict;
}

// Unescapes a limited number of known HTML entity codes
export function safeUnescape(s) {
    return s.replace(new RegExp('&#x27;', 'g'), "'");
}

export default {
    hash,
    removeTrailingSlash,
    randomness,
    randomString,
    querystringAsDictionary,
    safeUnescape
}
