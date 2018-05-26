const MC = angular.module('mc', []);

//const maxNum = 25;
const maxNum = 10000;

MC.controller('main', ($scope, $http) => {

  const url = '/data';

  let events;
  $http.get(url, {
    json: true
  })
    .then(function (res) {

      events = _.slice(_.reverse(_.sortBy(res.data, 'popularity')), 0, maxNum);

      let bestEvent = _.first(events);
      console.log(events);

      let maxPopularity = _.get(_.maxBy(events, 'popularity'), 'popularity');
      console.log('max popularity is ', maxPopularity);
      let maxVotes = _.get(_.maxBy(events, 'votes'), 'votes');
      console.log('max votes is ', maxVotes);

      // Create the map.
      var map = new google.maps.Map(document.getElementById('map'), {

        zoom: 13,
        center: {lat: bestEvent.venue.latitude, lng: bestEvent.venue.longitude},
        mapTypeId: 'terrain'
      });


      var infowindow;

      function infoWindowParams(event) {

          var timeFormat = "ddd, hA";
          var niceStart = moment(event.tz_adjusted_begin_date).format(timeFormat);
          var niceEnd = moment(event.tz_adjusted_end_date).format(timeFormat);

        return {
          content: `
<h2>${event.title}</h2>
<h3>${event.venue.title}</h3>
<p><a href="https://www.google.ca/maps/dir//${event.venue.address} vancouver bc">${event.venue.address}</a></p>
<p>${niceStart} until ${niceEnd}</p>
${event.excerpt}`,
          maxWidth:250
        }
      }

      _.each(_.reverse(events), event => {

//        console.log('add event to map', event);

        let maxRGB = [176, 0, 176];
        let minRGB = [255, 196, 255];

//        let votes = event.popularity / maxPopularity;
        let popularityProportion = event.popularity / maxPopularity;

        function computeColour(i) {
          let max = maxRGB[i];
          let min = minRGB[i];
          let diff = max - min;

          let proportionedAmt = popularityProportion * diff;
          let computed = _.floor(min + proportionedAmt);
          return _.padStart(computed.toString(16), 2, '0');
        }

        let rHex = computeColour(0);
        let gHex = computeColour(1);
        let bHex = computeColour(2);
        event.color = '#' + rHex + gHex + bHex;

        console.log(event.venue.title);
        console.log('popularity', event.popularity);
        /*
                console.log('r', r);
                console.log('g', g);
                console.log('rh', rHex);
                console.log('gh', gHex);*/
        console.log(event.color);


        let venue = _.get(event, 'venue');

        if (_.isNumber(_.get(venue, 'latitude')) && _.isNumber(_.get(venue, 'longitude'))) {



          let randomAmt = 0.001;

          let marker = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            position: {
              lat: venue.latitude + _.random(-randomAmt, randomAmt),
              lng: venue.longitude + _.random(-randomAmt, randomAmt)
            },
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              strokeWeight: 0,
              strokeColor: 'black',
              fillColor: event.color,
              fillOpacity: 1
            },
            title: event.venue.title,
            label: {

              color: event.color,
              text: '•'
            }
          });

          marker.addListener('click', function () {
            if (infowindow) {
              infowindow.close()
            }
            infowindow = new google.maps.InfoWindow(infoWindowParams(event));
            infowindow.open(map, marker);
          });

        } else {
        }
      })


          google.maps.event.addListener(map, 'click', function () {
            if (infowindow) {
              infowindow.close();
            }
//            infowindow = new google.maps.InfoWindow(infoWindowParams(event));
//            infowindow.open(map, marker);
          });
    });


// This example creates circles on the map, representing populations in North
// America.

// First, create an object containing LatLng and population for each city.


});

var circles = {
  chicago: {
    center: {lat: 41.878, lng: -87.629},
    population: 2714856
  },
  newyork: {
    center: {lat: 40.714, lng: -74.005},
    population: 8405837
  },
  losangeles: {
    center: {lat: 34.052, lng: -118.243},
    population: 3857799
  },
  vancouver: {
    center: {lat: 49.25, lng: -123.1},
    population: 603502
  }
};

function initMap() {

}



