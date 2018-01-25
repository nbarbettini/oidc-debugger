function removeTrailingSlash(s) {
    if (!s || !s.length) return s;

    return s.substr(-1) === '/'
        ? s.substr(0, s.length - 1)
        : s;
}

function randomness() {
    return Math.random().toString(36).substring(2);
}

// Courtesy of https://stackoverflow.com/a/21152762/3191599
function querystringAsDictionary(qs) {
    var dict = {};
    if (qs) qs.substr(1).split("&").forEach(function(item) {
        var s = item.split("="),
            k = s[0],
            v = s[1] && decodeURIComponent(s[1]);
        (dict[k] = dict[k] || []).push(v)
    });
    return dict;
}

// Unescapes a limited number of known HTML entity codes
function safeUnescape(s) {
    return s.replace('&#x27;', "'");
}
