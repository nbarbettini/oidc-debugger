function removeTrailingSlash(s) {
    if (!s || !s.length) return s;

    return s.substr(-1) === '/'
        ? s.substr(0, s.length - 1)
        : s;
}

function randomness() {
    return Math.random().toString(36).substring(2);
}
