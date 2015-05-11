var requiredFields = [
    'first_name',
    'email',
    'street_address',
    'postcode',
];

document.querySelector('.email_signup form').addEventListener('submit', function(e) {
    e.preventDefault();
    var tag = 'sunsetthepatriotact';

    var data = new FormData();
    data.append('guard', '');
    data.append('hp_enabled', true);
    data.append('tag', tag);
    data.append('org', org.id);
    data.append('action_comment', document.querySelector('.overlay.letter p').textContent.trim());

    for (var i = 0; i < requiredFields.length; i++) {
        var field = requiredFields[i];

        if (!document.getElementById(field).value) {
            alert('Please enter your ' + field + '.');
            return document.getElementById(field).focus();
        }

        data.append('member[' + field + ']', document.getElementById(field).value);
    }

    var checkbox = document.getElementById('pooling-opt-in');
    if (org.isPooling && !checkbox.checked) {
        data.append('opt_out', 1);
    }

    document.activeElement.blur();
    var thanks = document.getElementById('thanks');
    document.querySelector('form button').setAttribute('disabled', true);
    thanks.style.display = 'block';
    thanks.clientWidth;
    thanks.style.opacity = 1;

    // var url = 'https://queue.fightforthefuture.org/action';
    var url = 'http://localhost/x';

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            console.log('response:', xhr.response);
        }
    };
    xhr.open("post", url, true);
    xhr.send(data);
    modal_show('call_tool');
    document.querySelector('input[type=tel]').focus();
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
bindModalEvents('call_tool');
bindModalEvents('letter');

var fb = document.querySelectorAll('a.facebook');
for (var i = 0; i < fb.length; i++) {
    fb[i].addEventListener('click', function(e) {
        e.preventDefault();
        window.open('https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.sunsetthepatriotact.com%2F');
    }, false);
}

var tws = document.querySelectorAll('a.twitter');
for (var i = 0; i < tws.length; i++) {
    tws[i].addEventListener('click', function(e) {
        e.preventDefault();
        window.open('https://twitter.com/intent/tweet?text='+encodeURIComponent(TWEET_TEXT));
    }, false);
}

var ems = document.querySelectorAll('a.email');
for (var i = 0; i < ems.length; i++) {
    ems[i].addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'mailto:?subject='+encodeURIComponent(EMAIL_SUBJECT)+'&body=https%3A%2F%2Fwww.askthensa.com%2F';
    }, false);
}

document.getElementById('twitter_signup_submit').addEventListener('click', function(e) {
    console.log('Twitter signup!');
}, false);

document.querySelector('.action h4 a.letter').addEventListener('click', function(e) {
    e.preventDefault();

    modal_show('letter');
});

document.querySelector('.call_tool a.share').addEventListener('click', function(e) {
    e.preventDefault();

    modal_hide('call_tool');
    modal_show('share_modal');
});

document.querySelector('.call_tool form').addEventListener('submit', function(e) {
    e.preventDefault();

    var phone = document.querySelector('input[type=tel]').value.replace(/[^\d]/g, '');
    var url = 'https://dp-call-congress.herokuapp.com/create?campaignId=default&userPhone=' + phone;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            console.log(xhr.response);
        }
    };
    xhr.open('get', url, true);
    xhr.send();

    modal_hide('call_tool');
    modal_show('share_modal');
}, false);


// Organizations
var organizations = [
    {
        id: 'dp',
        title: 'Demand Progress',
        isPooling: true,
        disclaimer: '',
    },

    {
        id: 'fftf',
        title: 'Fight for the Future',
        isPooling: false,
        disclaimer: '<a href="http://www.fightforthefuture.org/">Fight for the Future</a> and <a href="http://www.thecenterforrights.org/">Center for Rights</a> will contact you about future campaigns. <a href="http://www.fightforthefuture.org/privacy/">Privacy Policy</a></p>',
    },

    {
        id: 'www',
        title: 'Win Without War',
        isPooling: true,
        disclaimer: '',
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
    org = organizations[1];
}

if (!org.isPooling) {
    document.querySelector('.squaredFour').remove();
    document.querySelector('.disclaimer').innerHTML = org.disclaimer;
}
