var trackOptimizely = function(ev) {
    window['optimizely'] = window['optimizely'] || [];
    window.optimizely.push(["trackEvent", ev]);
}

var requiredFields = [
    'name',
    'email',
    'address',
    'zip',
];

document.querySelector('.email_signup form').addEventListener('submit', function(e) {
    e.preventDefault();
    var tag = 'breakcongressinternet';


    var data = new FormData();
    data.append('guard', '');
    data.append('hp_enabled', true);
    data.append('tag', tag);

    for (var i = 0; i < requiredFields.length; i++) {
        var field = requiredFields[i];

        if (!document.getElementById(field).value) {
            alert('Please enter your ' + field + '.');
            return document.getElementById(field).focus();
        }

        data.append('member[' + field + ']', document.getElementById(field).value);
    }


    // DEBUG
    document.activeElement.blur();
    var thanks = document.getElementById('thanks');
    thanks.style.display = 'block';
    return setTimeout(function() {
        thanks.style.opacity = 1;
        document.querySelector('form button').setAttribute('disabled', true);
    }, 50);
    // END DEBUG

    var url = 'https://queue.fightforthefuture.org/action';

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            console.log('response:', xhr.response);
        }
    }.bind(this);
    xhr.open("post", url, true);
    xhr.send(data);
    document.getElementById('thanks').style.display = 'block';
    modal_show('share_modal');
    trackOptimizely('email_signup');
    setTimeout(function() {
        document.getElementById('thanks').style.opacity = 1;
    }, 50);
}, false);

function modal_show(id) {
    var overlayNode = document.getElementById(id);
    overlayNode.style.display = 'table';
    setTimeout(function() {
        overlayNode.className = overlayNode.className.replace(/ ?invisible ?/, ' ');
    }, 50);
};
function modal_hide(id) {
    var overlayNode = document.getElementById(id);
    overlayNode.className += 'invisible';
    setTimeout(function() {
        overlayNode.style.display = 'none';
    }, 400);
}

var bindModalEvents = function(modal) {
    modal = document.getElementById(modal);
    modal.querySelector('.gutter').addEventListener('click', function(e) {
        if (e.target === e.currentTarget) {
            e.preventDefault();
            modal_hide(modal.id);
        }
    }.bind(this), false);

    modal.querySelector('.modal .close').addEventListener('click', function(e) {
        e.preventDefault();
        modal_hide(modal.id);
    }.bind(this), false);
}
bindModalEvents('twitter_modal');
bindModalEvents('share_modal');

var fb = document.querySelectorAll('a.facebook');
for (var i = 0; i < fb.length; i++) {
    fb[i].addEventListener('click', function(e) {
        e.preventDefault();
        trackOptimizely('share');
        window.open('https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.breakcongressinternet.com%2F');
    }, false);
}

var tws = document.querySelectorAll('a.twitter');
for (var i = 0; i < tws.length; i++) {
    tws[i].addEventListener('click', function(e) {
        e.preventDefault();
        trackOptimizely('share');
        window.open('https://twitter.com/intent/tweet?text='+encodeURIComponent(TWEET_TEXT));
    }, false);
}

var ems = document.querySelectorAll('a.email');
for (var i = 0; i < ems.length; i++) {
    ems[i].addEventListener('click', function(e) {
        e.preventDefault();
        trackOptimizely('share');
        window.location.href = 'mailto:?subject='+encodeURIComponent(EMAIL_SUBJECT)+'&body=https%3A%2F%2Fwww.askthensa.com%2F';
    }, false);
}

document.getElementById('twitter_signup_submit').addEventListener('click', function(e) {
    console.log('Twitter signup!');
    trackOptimizely('join_twitter');
}, false);

var organizations = [
    {
        id: 'dp',
        title: 'Demand Progress',
        policyURL: 'https://demandprogress.org/privacy-policy/',
        pool: true,
    },

    {
        id: 'fftf',
        title: 'Fight for the Future',
        policyURL: 'https://www.fightforthefuture.org/privacy/',
        pool: true,
    },

    {
        id: 'www',
        title: 'Win Without War',
        policyURL: 'http://winwithoutwar.org/privacy-policy/',
        pool: false,
    },
];
var ref = location.search.match(/ref=(\w+)/);
var org;
if (ref) {
    for (var i = 0; i < organizations.length; i++) {
        if (ref[1] === organizations[i].id) {
            org = organizations[i];
            break;
        }
    }
}

if (!org) {
    org = organizations[Math.floor(Math.random() * organizations.length)];
}

console.log(org);
