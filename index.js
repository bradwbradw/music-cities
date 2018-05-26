const express = require('express');
const app = express();

const request = require('request-promise');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const when = require('when');
const url = "https://do604.com/events/2018/05/19.json";

app.get('/', (req, res) => {
  res.send('hii')
});

app.use(express.static('music-cities'));
app.use('/modules', express.static('node_modules'));


let loadEvents = () => {

  let numPages;
  let currentPage;
  let options = {
    uri: url,
    headers: {
      'User-Agent': 'Brad-at-Music-Cities-Hackathon'
    },
    json: true // Automatically parses the JSON string in the response
  };

  console.log('about to get request');

  const eventFields = 'title excerpt venue category popularity votes tz_adjusted_begin_date tz_adjusted_end_date'.split(' ');

  let process = result => {

    console.log('processed. first is ' + result.events[0].title);

    return _.map(result.events, event => {
      return _.pick(event, eventFields)
    });
  }

  let injest = newEvents => {
    events = _.concat(events, newEvents);
  }

  let events = [];
  return request(options)
    .then(result => {
      console.log('done first request');

      numPages = _.get(result, 'paging.total_pages');
      currentPage = 1;

      return result;
    })
    .then(process)
    .then(injest)
    .then(() => {

      let p = when.resolve().delay(1);
      currentPage = 2;
      _.each(_.range(currentPage, numPages + 1), n => {
        console.log('get page ' + n);

        p = p.then(() => {
            return request(_.extend(options, {
              qs: {
                page: n
              }
            }))
          }
        ).catch(err => {
          console.error('error page ' + n, error);
        })
          .then(process)
          .then(events => {
            injest(events);
          })
      });


      return p


    })
    .then(() => {
      return _.reverse(_.sortBy(_.filter(events, e => {
        console.log(e);
        return _.isNumber(_.get(e, 'venue.latitude')) && _.isNumber(_.get(e, 'venue.longitude'))
      }), 'popularity'))
    })
    .then(events => {
      _.map(events, e => {
        console.log(_.get(e, 'title'));
      });
      return events;
    })
    .catch(err => {
      console.log('error requesting');
      console.error(err);
    });
}


app.get('/data', (req, res) => {

  let events;

  function doLoad(res) {

    loadEvents()
      .then(events => {
        fs.writeFileSync(path.join(__dirname, 'events.json'), JSON.stringify(events));
        res.json(events);
      })
      .catch(err => {
        res.status(500).send(err);
      })
  }

  try {
    events = fs.readFileSync(path.join(__dirname, 'events.json'));
    events = JSON.parse(events);

    if (_.isArray(events)) {
      res.json(events)
    } else {
      doLoad(res)
    }
  } catch (err) {
    doLoad(res)
  }


});

let port = process.env.PORT || 4000;
app.listen(port);
