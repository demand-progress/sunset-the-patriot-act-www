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

    // Send to Queue
    var xhr1 = new XMLHttpRequest();
    xhr1.onreadystatechange = function() {
        if (xhr1.readyState === 4) {
            // console.log('response:', xhr1.response);
        }
    };
    xhr1.open('post', 'https://queue.fightforthefuture.org/action', true);
    xhr1.send(data);

    // Send to Slide
    var xhr2 = new XMLHttpRequest();
    xhr2.onreadystatechange = function() {
        if (xhr2.readyState === 4) {
            // console.log(xhr2.response);
        }
    };
    xhr2.open('post', 'https://water-slide.herokuapp.com/purpose/', true);
    xhr2.send(data);

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
bindModalEvents('share_modal');
bindModalEvents('call_tool');
bindModalEvents('call_tool_script');
bindModalEvents('letter');

var fb = document.querySelectorAll('a.facebook');
for (var i = 0; i < fb.length; i++) {
    fb[i].addEventListener('click', function(e) {
        e.preventDefault();
        window.open('https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.sunsetthepatriotact.com%2F%3Fref%3D' + org.id);
    }, false);
}

var tws = document.querySelectorAll('a.twitter');
for (var i = 0; i < tws.length; i++) {
    tws[i].addEventListener('click', function(e) {
        e.preventDefault();
        window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(TWEET_TEXT) + org.id);
    }, false);
}

var ems = document.querySelectorAll('a.email');
for (var i = 0; i < ems.length; i++) {
    ems[i].addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'mailto:?subject=' + encodeURIComponent(EMAIL_SUBJECT) + '&body=https%3A%2F%2Fwww.sunsetthepatriotact.com%2F';
    }, false);
}

document.querySelector('.action h4 a.letter').addEventListener('click', function(e) {
    e.preventDefault();

    modal_show('letter');
});

document.querySelector('a.open-call-tool').addEventListener('click', function(e) {
    e.preventDefault();

    modal_show('call_tool');
});

document.querySelector('.call_tool a.share').addEventListener('click', function(e) {
    e.preventDefault();

    modal_hide('call_tool');
    modal_show('share_modal');
});

document.querySelector('.call_tool form').addEventListener('submit', function(e) {
    e.preventDefault();

    var zip = document.getElementById('postcode').value || '';

    var phone = document.querySelector('input[type=tel]').value.replace(/[^\d]/g, '');
    var url = 'https://dp-call-congress.herokuapp.com/create?campaignId=sunsetthepatriotact&userPhone=' + phone + '&zipcode=' + zip;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            console.log(xhr.response);
        }
    };
    xhr.open('get', url, true);
    xhr.send();

    modal_hide('call_tool');
    modal_show('call_tool_script');
}, false);


// Organizations
var organizations = [
    {
        id: 'fftf', // Default
        title: 'Fight for the Future',
        isPooling: false,
        disclaimer: '<a href="http://www.fightforthefuture.org/" target="_blank">Fight for the Future</a> and <a href="http://www.thecenterforrights.org/">Center for Rights</a> will contact you about future campaigns. <a href="http://www.fightforthefuture.org/privacy/" target="_blank">Privacy Policy</a>.</p>',
    },

    {
        id: 'dp',
        title: 'Demand Progress',
        isPooling: true,
        disclaimer: '',
    },

    {
        id: 'dp-ns',
        title: 'Demand Progress',
        isPooling: false,
        disclaimer: 'I will receive updates from <a href="https://demandprogress.org" target="_blank">Demand Progress</a>.',
    },

    {
        id: 'la',
        title: 'Left Action',
        isPooling: true,
        disclaimer: '',
    },

    {
        id: 'ca',
        title: 'CREDO Action',
        isPooling: true,
        disclaimer: '',
    },

    {
        id: 'ca-ns',
        title: 'CREDO Action',
        isPooling: false,
        disclaimer: 'I will receive updates from <a href="http://credoaction.com" target="_blank">CREDO Action</a>.',
    },

    {
        id: 'ra',
        title: 'RootsAction',
        isPooling: true,
        disclaimer: '',
    },

    {
        id: 'dk',
        title: 'Daily Kos',
        isPooling: true,
        disclaimer: '',
    },

    {
        id: 'rhrc',
        title: 'RH Reality Check',
        isPooling: true,
        disclaimer: '',
    },

    {
        id: 'www',
        title: 'Win Without War',
        isPooling: true,
        disclaimer: '',
    },

    {
        id: 'bordc',
        title: 'Bill of Rights Defense Committee',
        isPooling: true,
        disclaimer: '',
    },

    {
        id: 'o98',
        title: 'The Other 98%',
        isPooling: true,
        disclaimer: '',
    },

    {
        id: 'ddc',
        title: 'Democrats.com',
        isPooling: false,
        disclaimer: 'I will receive updates from <a href="http://www.democrats.com" target="_blank">Democrats.com</a>.',
    },

    {
        id: 'fp',
        title: 'Free Press',
        isPooling: false,
        disclaimer: 'I will receive updates from <a href="http://www.freepress.net" target="_blank">Free Press</a>.',
    },

    {
        id: 'tn',
        title: 'The Nation',
        isPooling: true,
        disclaimer: '',
    },
];
var ref = location.search.match(/ref=([\w-]+)/);
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
    org = organizations[0];
}

if (!org.isPooling) {
    document.querySelector('.squaredFour').remove();
    document.querySelector('.disclaimer').innerHTML = org.disclaimer;
}

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
