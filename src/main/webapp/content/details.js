const API_URL = `http://localhost:8080`;

function fetchActivity(activityid) {
  fetch(`${API_URL}/api/activities/${activityid}`)
    .then(res => {
      //console.log("res is ", Object.prototype.toString.call(res));
      return res.json();
    })
    .then(data => {
      showActivityDetail(data);
    })
    .catch(error => {
      console.log(`Error Fetching data : ${error}`);
      document.getElementById('activity').innerHTML = 'Error Loading Single Activity Data';
    });
}

function parseActivityId() {
  try {
    var url_string = window.location.href.toLowerCase();
    var url = new URL(url_string);
    var activityid = url.searchParams.get('activityid');
    return activityid;
  } catch (err) {
    console.log("Issues with Parsing URL Parameter's - " + err);
    return '0';
  }
}
// takes a UNIX integer date, and produces a prettier human string
function dateOf(date) {
  const milliseconds = date * 1000; // 1575909015000
  const dateObject = new Date(milliseconds);
  const humanDateFormat = dateObject.toLocaleString(); //2019-12-9 10:30:15
  return humanDateFormat;
}

var safetext = function (text) {
  var table = {
    '<': 'lt',
    '>': 'gt',
    '"': 'quot',
    "'": 'apos',
    '&': 'amp',
    '\r': '#10',
    '\n': '#13',
  };

  return text.toString().replace(/[<>"'\r\n&]/g, function (chr) {
    return '&' + table[chr] + ';';
  });
};

function showActivityDetail(activity) {
  // the data parameter will be a JS array of JS objects
  // this uses a combination of "HTML building" DOM methods (the document createElements) and
  // simple string interpolation (see the 'a' tag on title)
  // both are valid ways of building the html.
  const ul = document.getElementById('activity');
  const detail = document.createDocumentFragment();

  console.log('Activity:', activity);
  let li = document.createElement('div');
  let title = document.createElement('h2');
  let body = document.createElement('p');
  let by = document.createElement('p');
  title.innerHTML = `${activity.description}`;

  body.innerHTML = `Approximate cost: ${safetext(activity.cost)}<br>
                        Minimum amount of participants: ${safetext(activity.minParticipants)}<br>
                        Maximum amount of participants: ${safetext(activity.maxParticipants)}<br>
                        Approximate time (in hours): ${safetext(activity.time)}<br>
                        Home or away: ${safetext(activity.homeOrAway)}<br>
                        Indoors or outdoors: ${safetext(activity.inOrOut)}<br>`;
  li.appendChild(title);
  li.appendChild(body);
  li.appendChild(by);
  detail.appendChild(li);

  ul.appendChild(detail);
}

function handlePage() {
  let activityid = parseActivityId();
  console.log('activityid: ', activityid);

  if (activityid != null) {
    console.log('found an activityid');
    fetchActivity(activityid);
  }
}

handlePage();
