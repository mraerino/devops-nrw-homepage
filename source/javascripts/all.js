(function() {
    var $api_key = "";

    jQuery.noConflict();
    var mup_widget = {
        with_jquery: function(block) {
            block(jQuery, document.body);
        }
    };

    var $parameters = {
        urlname: "devops-duesseldorf",
        width: 450,
        height:250,
        _name: "DevOps Düsseldorf",
        _description: "Shows basic stats on your favorite Meetup group."
    };
    var $queries = {
        groups: function() {
            return "https://api.meetup.com/2/groups?callback=?&offset=0&format=json&group_urlname=devops-duesseldorf&page=500&radius=25.0&fields=&order=id&desc=false&sig_id=199861253&sig=8020562cf5218bb4308642123b20823b8450b9be";
        },
        events: function() {
            return "https://api.meetup.com/2/events?callback=?&offset=0&format=json&limited_events=False&group_urlname=devops-duesseldorf&page=1&fields=&order=time&desc=false&status=upcoming&sig_id=199861253&sig=78b4cc6239f4a4c7f4ff29c00aa8e53cd0a228c9";
        }
    };

    mup_widget.with_jquery(function($, ctx) {
        var	group = '',
            months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
            addLink = function(content, link) {
                return '<a target="_top" href="' + link + '">' + content + '</a>';
            },
            addLeadingZero = function( num ) {
                return (num < 10) ? ('0' + num) : num;
            },
            getFormattedDate = function( millis ) {
                var date = new Date( millis );
                return  months[date.getMonth()] + ' ' + addLeadingZero( date.getDate() ) + ', ' + date.getFullYear().toString();
            },
            getFormattedTime = function( millis ) {
                var	time = new Date( millis ),
                    hours = time.getHours(),
                    min = time.getMinutes(),
                    ampm = (hours > 11) ? 'PM' : 'AM';
                min = (min < 10) ? ('0' + min) : min;
                hours = (hours == 0) ? 1 : hours;
                hours = (hours > 12) ? hours-12 : hours;
                return hours + ':' + min + ' ' + ampm;
            },
            numberFormat = function(nStr){
                nStr += '';
                x = nStr.split('.');
                x1 = x[0];
                x2 = x.length > 1 ? '.' + x[1] : '';
                var rgx = /(\d+)(\d{3})/;
                while (rgx.test(x1))
                    x1 = x1.replace(rgx, '$1' + ',' + '$2');
                return x1 + x2;
            };
        $.getJSON($queries.groups(), function(data) {
            return;
            if (data.results.length > 0) {
                group = data.results[0];
                $('.mug-badge', ctx).append(
                    '<div class="mup-widget">\
                        <div class="mup-bd">\
                            <h3>' + addLink(group.name, group.link) + '</h3>\
            <h4> <div style="padding-top:5px;"><span class="mup-tlabel">EST. '+ getFormattedDate(group.created)+'</span></div></h4>\
						<span class="mup-stats">' + numberFormat(group.members) + '<span class="mup-tlabel"> '+ group.who+'</span></span>\
            <span class="mup-stats"><div class="next-event"></div></span>\
            <h4><span class="mup-button">'+ addLink('JOIN',group.link)+'</span></h4>\
					</div>\
					<div class="mup-ft">\
						<div class="mup-logo"><div style="float:left;">'+addLink('<img src="https://a248.e.akamai.net/secure.meetupstatic.com/img/84869143793177372874/birddog/everywhere_widget.png">','http://www.meetup.com')+'</div><div style="float:right;"><div style="float:right;"></div><br><div style="float:right;"><span class="mup-tlabel">Group Rating</span></div></div></div>\
						<div class="mup-getwdgt">' + addLink('ADD THIS TO YOUR SITE', 'http://www.meetup.com/meetup_api/foundry/#'+$parameters._name.toLowerCase().replace(/ /g,"-")) + '</div>\
					</div>\
				</div>'
                );

                $.getJSON($queries.events(), function(data) {
                    if (data.status && data.status.match(/^200/) == null) {
                        alert(data.status + ": " + data.details);
                    } else {
                        if (data.results.length == 0) {
                            $('.next-event', ctx).append('<span class="mup-tlabel">'+addLink('Suggest new ideas for Meetups!',group.link)+'</span>');
                        } else {
                            var event = data.results[0];
                            console.log(event);
                            var venue = event.venue;
                            console.log(venue);
                            var city;
                            if (!venue || !venue.city) {
                                city = group.city;
                            } else {
                                city = venue.city;
                            }
                            var state_country;
                            if (!venue || !venue.state) {
                                if (group.state == "") {
                                    state_country = group.country.toUpperCase();
                                } else {
                                    state_country = group.state;
                                }
                            } else {
                                state_country = venue.state;
                            }
                            var venue_addr;
                            if (venue) {
                                if (venue.name !== undefined) {
                                    venue_addr = venue.name  + " - ";
                                } else if (venue.address_1 !== undefined) {
                                    venue_addr = venue.address_1 + " - ";
                                } else {
                                    venue_addr = "";
                                }
                            } else {
                                venue_addr = "";
                            }
                            var location = venue_addr + city + ", " + state_country;
                            $('.next-event', ctx).append('<h4><div class="mup-tlabel">'+getFormattedDate(event.time) + '   |   ' + getFormattedTime(event.time) + "</div>" + addLink(event.name, event.event_url)+'<div class="mup-tlabel">' + location + "</div></h4>");
                        }
                    }
                });
            }
        });
    });
})();