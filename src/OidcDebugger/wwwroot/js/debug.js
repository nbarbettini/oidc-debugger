function readValues() {
    window.debugInfo = window.debugInfo || {};

    window.debugInfo.query = parseValues(window.location.search);
    window.debugInfo.fragment = parseValues(window.location.hash);

    window.debugInfo.code = window.debugInfo.code
        || findValueInArray(window.debugInfo.query, 'code')
        || findValueInArray(window.debugInfo.fragment, 'code');

    window.debugInfo.state = window.debugInfo.state
        || findValueInArray(window.debugInfo.query, 'state')
        || findValueInArray(window.debugInfo.fragment, 'state');

    window.debugInfo.error = window.debugInfo.error
        || findValueInArray(window.debugInfo.query, 'error')
        || findValueInArray(window.debugInfo.fragment, 'error');

    window.debugInfo.errorDescription = window.debugInfo.errorDescription
        || findValueInArray(window.debugInfo.query, 'errorDescription')
        || findValueInArray(window.debugInfo.fragment, 'errorDescription');
}

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

function update() {
    var methodSpan = document.getElementById('method');
    methodSpan.textContent = window.debugInfo.method || '';

    if (window.debugInfo.referer) {
        var refererSection = document.getElementById('refererSection');
        removeClass(refererSection, 'hidden');

        var refererSpan = document.getElementById('referer');
        refererSpan.textContent = window.debugInfo.referer;
    }

    if (window.debugInfo.code) {
        var codeSection = document.getElementById('codeSection');
        removeClass(codeSection, 'hidden');

        var codeSpan = document.getElementById('code');
        codeSpan.textContent = window.debugInfo.code;
    }
    
    if (window.debugInfo.state) {
        var stateSection = document.getElementById('stateSection');
        removeClass(stateSection, 'hidden');

        var stateSpan = document.getElementById('state');
        stateSpan.textContent = window.debugInfo.state;
    }

    if (window.debugInfo.error || window.debugInfo.errorDescription) {
        var errorSection = document.getElementById('errorSection');
        removeClass(errorSection, 'hidden');

        var errorSpan = document.getElementById('error');
        errorSpan.textContent = window.debugInfo.error;

        var errorDescriptionSpan = document.getElementById('errorDescription');
        errorDescriptionSpan.textContent = window.debugInfo.errorDescription;
    }

    var hasQueryParameters = window.debugInfo.query && window.debugInfo.query.length > 0;
    if (hasQueryParameters) {
        var rawQuerySection = document.getElementById('rawQuerySection');
        removeClass(rawQuerySection, 'hidden');
        var rawQueryParent = document.getElementById('rawQueryParent');
        removeClass(rawQueryParent, 'hidden');

        rawQueryParent.appendChild(createParamTable(window.debugInfo.query));
    }

    var hasFragmentParameters = window.debugInfo.fragment && window.debugInfo.fragment.length > 0;
    if (hasFragmentParameters) {
        var rawFragmentSection = document.getElementById('rawFragmentSection');
        removeClass(rawFragmentSection, 'hidden');
        var rawFragmentParent = document.getElementById('rawFragmentParent');
        removeClass(rawFragmentParent, 'hidden');

        rawFragmentParent.appendChild(createParamTable(window.debugInfo.fragment));
    }

    var hasFormBodyParameters = window.debugInfo.formBody && window.debugInfo.formBody.length > 0;
    if (hasFormBodyParameters) {
        var rawFormSection = document.getElementById('rawFormSection');
        removeClass(rawFormSection, 'hidden');
        var rawFormParent = document.getElementById('rawFormParent');
        removeClass(rawFormParent, 'hidden');

        rawFormParent.appendChild(createParamTable(window.debugInfo.formBody));
    }
}

function createParamTable(params) {
    var table = document.createElement('table');

    var thead = document.createElement('thead');
    var theadRow = document.createElement('tr');
    theadRow.appendChild(createElementWithText('th', 'Parameter'));
    theadRow.appendChild(createElementWithText('th', 'Value'));
    thead.appendChild(theadRow);
    table.appendChild(thead);

    var tbody = document.createElement('tbody');

    params = params || [];

    for (var i = 0; i < params.length; i++) {
        var row = document.createElement('tr');
        row.appendChild(createElementWithText('td', params[i].name));
        row.appendChild(createElementWithText('td', params[i].value));
        tbody.appendChild(row);
    }

    table.appendChild(tbody);

    return table;
}

ready(function () {
    readValues();
    update();
});