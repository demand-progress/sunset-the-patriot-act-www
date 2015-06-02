// Check for outdated browsers
var isIE = navigator.userAgent.match(/MSIE (\d+)\./);
if (isIE) {
    var version = +isIE[1];
    if (version < 10) {
        alert('Unfortunately your browser, Internet Explorer ' + version + ', is not supported.\nPlease visit the site with a modern browser like Firefox or Chrome.\nThanks!');
    }
}

if (navigator.userAgent.match(/Android 2\.3/)) {
    alert('Unfortunately your browser, Android 2.3, is not supported.\nPlease visit the site with a modern browser like Firefox or Chrome.\nThanks!');
}

function modal_show(id) {
    var overlayNode = document.getElementById(id);
    overlayNode.style.display = 'table';
    setTimeout(function() {
        overlayNode.className = overlayNode.className.replace(/ ?invisible ?/, ' ');
        onResize();
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
    if (!modal)
        return;
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
bindModalEvents('share_modal');
bindModalEvents('call_tool');
bindModalEvents('call_tool_script');
bindModalEvents('letter');
bindModalEvents('drop_in');

var fb = document.querySelectorAll('a.facebook');
for (var i = 0; i < fb.length; i++) {
    fb[i].addEventListener('click', function(e) {
        e.preventDefault();
        window.open('https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.sunsetthepatriotact.com%2Fcall');
    }, false);
}

var tws = document.querySelectorAll('a.twitter');
for (var i = 0; i < tws.length; i++) {
    tws[i].addEventListener('click', function(e) {
        e.preventDefault();
        window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(TWEET_TEXT));
    }, false);
}

var ems = document.querySelectorAll('a.email');
for (var i = 0; i < ems.length; i++) {
    ems[i].addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'mailto:?subject=' + encodeURIComponent(EMAIL_SUBJECT) + '&body=https%3A%2F%2Fwww.sunsetthepatriotact.com%2F';
    }, false);
}

document.querySelector('h2.now').addEventListener('click', function(e) {
    modal_show('call_tool_script');
});

document.querySelector('.call_tool a.share').addEventListener('click', function(e) {
    e.preventDefault();

    modal_hide('call_tool');
    modal_show('share_modal');
});

document.querySelector('.call_tool form').addEventListener('submit', function(e) {
    e.preventDefault();

    var phone = document.querySelector('input[type=tel]').value.replace(/[^\d]/g, '');

    if (phone.length < 10) {
        return alert('Please enter your 10 digit phone number.');
    }

    var url = 'https://dp-call-congress.herokuapp.com/create?campaignId=sunsetthepatriotact&userPhone=' + phone;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            console.log(xhr.response);
        }
    };
    xhr.open('get', url, true);
    xhr.send();

    document.activeElement.blur();
    var thanks = document.getElementById('thanks');
    document.querySelector('form button').setAttribute('disabled', true);
    thanks.style.display = 'block';
    thanks.clientWidth;
    thanks.style.opacity = 1;

    modal_hide('call_tool');
    modal_show('call_tool_script');
}, false);


var resizeTimeout = false;
window.addEventListener('resize', function(e) {
    resizeTimeout = setTimeout(onResize, 300);
}, false);

function onResize() {
    var modals = document.getElementsByClassName('modal');
    for (var i = 0; i < modals.length; i++) {
        modals[i].style.maxHeight = innerHeight + 'px';
    }
}

// Reset form
document.querySelector('.call_tool button[type=submit]').removeAttribute('disabled');
if (!/mobile/i.test(navigator.userAgent)) {
    document.querySelector('.call_tool input[type=tel]').focus();
}
