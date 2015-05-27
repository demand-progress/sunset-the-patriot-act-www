var TWEET_TO_TEXT = " please stand up for the Constitution. #SunsetThePatriotAct and oppose the USA Freedom Act! sunsetthepatriotact.com";

var states = {
    'AL': 'Alabama',
    'AK': 'Alaska',
    'AZ': 'Arizona',
    'AR': 'Arkansas',
    'CA': 'California',
    'CO': 'Colorado',
    'CT': 'Connecticut',
    'DE': 'Delaware',
    'FL': 'Florida',
    'GA': 'Georgia',
    'HI': 'Hawaii',
    'ID': 'Idaho',
    'IL': 'Illinois',
    'IN': 'Indiana',
    'IA': 'Iowa',
    'KS': 'Kansas',
    'KY': 'Kentucky',
    'LA': 'Louisiana',
    'ME': 'Maine',
    'MD': 'Maryland',
    'MA': 'Massachusetts',
    'MI': 'Michigan',
    'MN': 'Minnesota',
    'MS': 'Mississippi',
    'MO': 'Missouri',
    'MT': 'Montana',
    'NE': 'Nebraska',
    'NV': 'Nevada',
    'NH': 'New Hampshire',
    'NJ': 'New Jersey',
    'NM': 'New Mexico',
    'NY': 'New York',
    'NC': 'North Carolina',
    'ND': 'North Dakota',
    'OH': 'Ohio',
    'OK': 'Oklahoma',
    'OR': 'Oregon',
    'PA': 'Pennsylvania',
    'RI': 'Rhode Island',
    'SC': 'South Carolina',
    'SD': 'South Dakota',
    'TN': 'Tennessee',
    'TX': 'Texas',
    'UT': 'Utah',
    'VT': 'Vermont',
    'VA': 'Virginia',
    'WA': 'Washington',
    'WV': 'West Virginia',
    'WI': 'Wisconsin',
    'WY': 'Wyoming',
};

var politicians = null;
var userState = null;
var mapLoaded = null;
var map = null;
var canvas = null;
var markers = [];
var currentInfoWindow = null;

var url = 'https://spreadsheets.google.com/feeds/list/1yp-QuCN9zEKLMEyzwX46hYdGmI6frIVEVMI9dTbb63c/default/public/values?alt=json';
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4)
    {
        var res = JSON.parse(xhr.response);

        politicians = [];

        for (var i=0; i < res.feed.entry.length; i++) {
            var entry = res.feed.entry[i];
            politicians.push({
                first_name:         entry['gsx$first']['$t'].trim(),
                last_name:          entry['gsx$name']['$t'].trim(),
                image:              entry['gsx$imagepleasedontedit']['$t'].trim(),
                bioguide:           entry['gsx$bioguide']['$t'].trim(),
                email:              entry['gsx$email']['$t'].trim(),
                phone:              entry['gsx$phone']['$t'].trim(),
                organization:       entry['gsx$organization']['$t'].trim(),
                state:              entry['gsx$state']['$t'].trim(),
                state_short:        getShortState(entry['gsx$state']['$t'].trim()),
                twitter:            entry['gsx$twitter']['$t'].trim(),
                party:              entry['gsx$partyaffiliation']['$t'].trim(),
                vote_usaf:          entry['gsx$voteusaf']['$t'].trim(),
                vote_tempreauth:    entry['gsx$votetempreauth']['$t'].trim(),
                office1:            entry['gsx$office1']['$t'].trim(),
                office1phone:       entry['gsx$office1phone']['$t'].trim(),
                office1geo:         entry['gsx$office1geo']['$t'].trim(),
                office2:            entry['gsx$office2']['$t'].trim(),
                office2phone:       entry['gsx$office2phone']['$t'].trim(),
                office2geo:         entry['gsx$office2geo']['$t'].trim(),
                office3:            entry['gsx$office3']['$t'].trim(),
                office3phone:       entry['gsx$office3phone']['$t'].trim(),
                office3geo:         entry['gsx$office3geo']['$t'].trim(),
                office4:            entry['gsx$office4']['$t'].trim(),
                office4phone:       entry['gsx$office4phone']['$t'].trim(),
                office4geo:         entry['gsx$office4geo']['$t'].trim(),
                office5:            entry['gsx$office5']['$t'].trim(),
                office5phone:       entry['gsx$office5phone']['$t'].trim(),
                office5geo:         entry['gsx$office5geo']['$t'].trim(),
                office6:            entry['gsx$office6']['$t'].trim(),
                office6phone:       entry['gsx$office6phone']['$t'].trim(),
                office6geo:         entry['gsx$office6geo']['$t'].trim(),
                office7:            entry['gsx$office7']['$t'].trim(),
                office7phone:       entry['gsx$office7phone']['$t'].trim(),
                office7geo:         entry['gsx$office7geo']['$t'].trim(),
                office8:            entry['gsx$office8']['$t'].trim(),
                office8phone:       entry['gsx$office8phone']['$t'].trim(),
                office8geo:         entry['gsx$office8geo']['$t'].trim(),
            });
        }
        var compare = function(a,b) {
            if (a.state_short < b.state_short)
                return -1;
            else if (a.state_short > b.state_short)
                return 1;
            return 0;
        }
        politicians.sort(compare);
        checkFinishedLoadingData();
    }
}.bind(this);
xhr.open("get", url, true);
xhr.send();

var url2 = 'https://fftf-geocoder.herokuapp.com';
var xhr2 = new XMLHttpRequest();
xhr2.onreadystatechange = function() {
    if (xhr2.readyState === 4)
    {
        var res = JSON.parse(xhr2.response);

        if (res.subdivisions && res.subdivisions.length > 0)
            userState = res.subdivisions[0].iso_code;
        else
            userState = 'unknown';

        checkFinishedLoadingData();
    }
};
xhr2.open("get", url2, true);
xhr2.send();

var getShortState = function(state) {
    for (var key in states)
        if (states.hasOwnProperty(key))
            if (states[key] == state)
                return key;
}

var googleMapsLoaded = function() {
    mapLoaded = true;
    checkFinishedLoadingData();
}

var checkFinishedLoadingData = function() {
    if (politicians && userState && mapLoaded)
        render();
}

var render = function() {
    console.log('do render: ', userState, politicians);
    var frag = document.createDocumentFragment();

    var statesDivs = document.createElement('div');
    statesDivs.className = 'states';

    var label = document.createElement('label');
    label.htmlFor = 'choose_state';
    label.className = 'choose_state';
    label.textContent = 'Choose your state:';
    frag.appendChild(label);

    var select = document.createElement('select');
    select.id = 'choose_state'
    for (var key in states) {
        if (states.hasOwnProperty(key)) {

            var option = document.createElement('option');
            option.value = key;
            option.textContent = states[key];
            if (key == userState)
                option.selected = true;
            select.appendChild(option);

            var state = document.createElement('div');
            state.id = 'state_'+key;

            var senators = document.createElement('div');
            senators.className = 'senators';

            for (var i=0; i<politicians.length; i++) {
                var p = politicians[i];

                if (p.state_short != key)
                    continue;

                if (p.organization == 'Senate') {

                    var senator = document.createElement('div');

                    var img = document.createElement('div');
                    img.className = 'img';
                    img.style.backgroundImage = 'url(/map/congress/'+p.image+')';
                    img.style.backgroundSize = '225px 275px';
                    var h4 = document.createElement('h4');
                    h4.textContent = 'Sen. '+p.first_name+' '+p.last_name;
                    img.appendChild(h4);

                    var ul2 = document.createElement('ul');
                    ul2.className = 'contact';
                    if (p.phone) {
                        var lip = document.createElement('li');
                        lip.className = 'phone';
                        var ap = document.createElement('a');
                        ap.href = 'tel://'+p.phone;
                        var api = document.createElement('i');
                        api.className = 'fa fa-phone';
                        ap.appendChild(api);
                        var aps = document.createElement('span');
                        aps.textContent = p.phone;
                        ap.appendChild(aps);
                        lip.appendChild(ap);
                        ul2.appendChild(lip);
                    }
                    if (p.email) {
                        var lie = document.createElement('li');
                        lie.className = 'email';
                        var ae = document.createElement('a');
                        ae.href = p.email;
                        ae.target = '_blank';
                        var aei = document.createElement('i');
                        aei.className = 'fa fa-envelope';
                        ae.appendChild(aei);
                        var aes = document.createElement('span');
                        aes.textContent = 'Email';
                        ae.appendChild(aes);
                        lie.appendChild(ae);
                        ul2.appendChild(lie);
                    }
                    if (p.twitter) {
                        var lit = document.createElement('li');
                        var at = document.createElement('a');
                        at.href = 'https://twitter.com/' + p.twitter;
                        at.target = '_blank';
                        var ati = document.createElement('i');
                        ati.className = 'fa fa-twitter';
                        at.appendChild(ati);
                        var ats = document.createElement('span');
                        ats.textContent = '@' + p.twitter;
                        at.appendChild(ats);
                        lit.appendChild(at);
                        ul2.appendChild(lit);

                        at.addEventListener('click', function(e) {
                            e.preventDefault();
                            var username = at.href.substr(20);
                            window.open('https://twitter.com/intent/tweet?text='+encodeURIComponent(".@"+username+TWEET_TO_TEXT));
                        }, false);
                    }
                    img.appendChild(ul2);

                    senator.appendChild(img);

                    var ul = document.createElement('ul');
                    ul.className = 'votes';

                    var li1 = document.createElement('li');
                    var span1 = document.createElement('span');
                    span1.textContent= 'Voted ';
                    li1.appendChild(span1);
                    var strong1 = document.createElement('strong');
                    if (p.vote_tempreauth == 'NAY') {
                        li1.className = 'good';
                        strong1.textContent = 'NO';
                    } else {
                        li1.className = 'bad';
                        strong1.textContent = 'YES';
                    }
                    li1.appendChild(strong1);
                    var span2 = document.createElement('span');
                    span2.textContent = ' on ';
                    li1.appendChild(span2);
                    var a1 = document.createElement('a');
                    a1.href = '#patriot';
                    a1.textContent = 'PATRIOT Act extension';
                    li1.appendChild(a1);
                    ul.appendChild(li1);

                    var li2 = document.createElement('li');
                    var span3 = document.createElement('span');
                    span3.textContent = 'Voted ';
                    li2.appendChild(span3);
                    var strong2 = document.createElement('strong');
                    if (p.vote_usaf == 'NAY') {
                        li2.className = 'good';
                        strong2.textContent = 'NO';
                    } else {
                        li2.className = 'bad';
                        strong2.textContent = 'YES';
                    }
                    li2.appendChild(strong2);
                    var span4 = document.createElement('span');
                    span4.textContent = ' on ';
                    li2.appendChild(span4);
                    var a2 = document.createElement('a');
                    a2.href = '#usaf';
                    a2.textContent = 'USA Freedom Act';
                    li2.appendChild(a2);
                    ul.appendChild(li2);

                    senator.appendChild(ul);

                    var explanation = document.createElement('div');
                    if (p.vote_tempreauth == 'YEA') {
                        explanation.className = 'explanation bad';
                        senator.className = 'bad';
                        var span5 = document.createElement('span');
                        span5.textContent = 'Sen. '+p.last_name+' voted to allow the NSA to continue engaging in warantless mass surveillance of virtually all domestic communications records. Take action to let '+p.last_name+' know you disagree!';
                        explanation.appendChild(span5);
                    } else if (p.vote_tempreauth == 'NAY' && p.vote_usaf == 'NAY') {
                        explanation.className = 'explanation good';
                        senator.className = 'good';
                        var span5 = document.createElement('span');
                        span5.textContent = 'Sen. '+p.last_name+' voted to sunset the PATRIOT Act and block any extension of the NSA\'s warantless mass surveillance programs. Show your support!';
                        explanation.appendChild(span5);
                    } else if (p.vote_tempreauth == 'NAY' && p.vote_usaf == 'YEA') {
                        explanation.className = 'explanation bad';
                        senator.className = 'bad';
                        var span5 = document.createElement('span');
                        span5.textContent = 'Sen. '+p.last_name+' voted for the USA Freedom Act, a fake reform bill that won\'t stop mass surveillance and ';
                        explanation.appendChild(span5);
                        var a3 = document.createElement('a');
                        a3.textContent = 'opens up new avenues for more invasive spying';
                        a3.href = 'http://thehill.com/blogs/congress-blog/homeland-security/242736-no-congress-did-not-just-vote-to-end-nsa-spying';
                        a3.target = '_blank';
                        explanation.appendChild(a3);
                        var span6 = document.createElement('span');
                        span6.textContent = '.';
                        explanation.appendChild(span6);
                    }
                    senator.appendChild(explanation);

                    senators.appendChild(senator);

                } else {

                }
            }
            state.appendChild(senators);
            statesDivs.appendChild(state);
        }
    }
    frag.appendChild(select);
    frag.appendChild(statesDivs);

    document.getElementById('map').appendChild(frag);

    canvas = document.getElementById('map-canvas');
    var mapOptions = {
        center: new google.maps.LatLng(37, -96),
        zoom: 4
    };
    map = new google.maps.Map(canvas, mapOptions);

    var pickState = function() {

        var bindInfoWindow = function(marker, div) {
            var infoWindow = new google.maps.InfoWindow({
                content: div,
                maxWidth: 250
            });

            google.maps.event.addListener(marker, 'click', function() {
                if (currentInfoWindow === infoWindow) 
                    return;

                closeCurrentInfoWindow();
                infoWindow.open(map, marker);
                currentInfoWindow = infoWindow;
            });
        }
        var closeCurrentInfoWindow = function() {
            if (currentInfoWindow) {
                currentInfoWindow.close();
                currentInfoWindow = null;
            }
        }

        var states = document.querySelectorAll('.states > div');
        for (var i=0; i < states.length; i++) {
            states[i].className = '';
        }
        var cur = select.options[select.selectedIndex].value;
        document.getElementById('state_'+cur).className = 'visible';

        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
        markers = [];
        for (var i = 0; i < politicians.length; i++) {
            var p = politicians[i];

            // JL HACK ~ all house data is fvcked
            if (p.organization == 'House')
                continue;

            if (p.state_short == cur) {
                console.log(p);

                for (var j = 1; j <= 8; j++) {
                    console.log('office'+j+'geo', p['office'+j+'geo']);
                    if (p['office'+j+'geo']) {
                        var latLng = p['office'+j+'geo'].split(',');
                        console.log(latLng);
                        var position = new google.maps.LatLng(latLng[0], latLng[1]);

                        // Create Marker
                        var marker = new google.maps.Marker({
                            position: position,
                            map: map,
                            title: 'test'
                        });

                        var div = document.createElement('div');
                        div.className = 'infowindow';
                        var h4 = document.createElement('h4');
                        h4.textContent = (p.organization == 'Senate' ? 'Sen. ' : 'Rep. ') + p.first_name + ' ' + p.last_name;
                        div.appendChild(h4);

                        var address = p['office'+j].split('\n');
                        for (var k = 0; k < address.length; k++) {
                            var pa = document.createElement('p');
                            pa.textContent = address[k];
                            div.appendChild(pa);
                        }

                        bindInfoWindow(marker, div);
                        markers.push(marker);
                    }
                }
            }
        }


        // Close InfoWindows, if Map is clicked, and not dragged
        google.maps.event.addListener(map, "click", closeCurrentInfoWindow);
        var bounds = new google.maps.LatLngBounds();
        for(i=0;i<markers.length;i++) {
            bounds.extend(markers[i].getPosition());
        }
        map.fitBounds(bounds);

    };
    select.addEventListener('change', function(e) {
        pickState();
    }, false);
    pickState();

};

var script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'https://maps.googleapis.com/maps/api/js?sensor=false&callback=googleMapsLoaded&key=AIzaSyD6ZNWwPw8Whw6o3y7zpPk0mlvlQ_22spE';
document.head.appendChild(script);

var link = document.createElement('link');
link.type = 'text/css';
link.rel = 'stylesheet';
link.href = '/map/font-awesome.css';
document.head.appendChild(link);