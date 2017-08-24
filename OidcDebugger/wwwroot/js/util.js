function removeTrailingSlash(s) {
    if (!s || !s.length) return s;

    return s.substr(-1) === '/'
        ? s.substr(0, s.length - 1)
        : s;
}
