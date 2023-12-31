const API_URL = 'http://localhost:8080';

let data;

// Get activities data and set global data variable
function fetchActivitiesData() {
  return fetch(`${API_URL}/api/activities`)
    .then(res => res.json())
    .then(resultData => {
      data = resultData;
      showRandom(data);
    })
    .catch(error => {
      console.log(`Error Fetching data : ${error}`);
      document.getElementById('suggestion').innerHTML = 'Error Loading Data';
    });
}

// Get a random activity
function getRandomObject(data) {
  var randomIndex = Math.floor(Math.random() * data.length);
  return data[randomIndex];
}

// Display random activity
function showRandom(data) {
  const suggestionContainer = document.getElementById('suggestion');
  suggestionContainer.innerHTML = ''; // Clear any previous content

  let div = document.createElement('div');
  let title = document.createElement('h3');

  var randomObject = getRandomObject(data);
  console.log(randomObject);

  title.innerHTML = `<a href="details.html?activityid=${randomObject.id}">${randomObject.description}</a>`;

  div.appendChild(title);
  suggestionContainer.appendChild(div);
}

// For drop down of free or not
function displayObjectsByCost(cost) {
  if (!data) {
    console.error('Error Loading Data');
    return;
  }

  var matchingObjectsContainer = document.getElementById('matchingObjects');
  matchingObjectsContainer.innerHTML = ''; // Clear any previous content

  data.forEach(function (activity) {
    if (cost.toLowerCase() === 'cost' && activity.cost.toLowerCase() !== 'free') {
      displayActivity(activity);
    } else if (cost.toLowerCase() === 'free' && activity.cost.toLowerCase() === 'free') {
      displayActivity(activity);
    }
  });
}

// For drop down of inside or outside location
function displayObjectsByLocation(location) {
  if (!data) {
    console.error('Error Loading Data');
    return;
  }

  var matchingObjectsContainer = document.getElementById('matchingObjects');
  matchingObjectsContainer.innerHTML = ''; // Clear any previous content

  data.forEach(function (activity) {
    if (activity.inOrOut.toLowerCase() === location.toLowerCase()) {
      displayActivity(activity);
    }
  });
}

// For drop down of home or away i.e. "setting"
function displayObjectsBySetting(setting) {
  if (!data) {
    console.error('Error Loading Data');
    return;
  }

  var matchingObjectsContainer = document.getElementById('matchingObjects');
  matchingObjectsContainer.innerHTML = ''; // Clear any previous content

  data.forEach(function (activity) {
    if (activity.homeOrAway.toLowerCase() === setting.toLowerCase()) {
      displayActivity(activity);
    }
  });
}

function displayActivity(activity) {
  var matchingObjectsContainer = document.getElementById('matchingObjects');

  // Check all three conditions before displaying the activity
  var selectedCost = document.getElementById('cost').value.toLowerCase();
  var selectedLocation = document.getElementById('location').value.toLowerCase();
  var selectedSetting = document.getElementById('setting').value.toLowerCase();

  if (
    (selectedCost === 'cost' || (selectedCost === 'free' && activity.cost.toLowerCase() === 'free')) &&
    (selectedLocation === 'all' || activity.inOrOut.toLowerCase() === selectedLocation) &&
    (selectedSetting === 'all' || activity.homeOrAway.toLowerCase() === selectedSetting)
  ) {
    var activityDiv = document.createElement('div');
    activityDiv.classList.add('activity');

    var description = document.createElement('h2');
    description.textContent = activity.description;

    var details = document.createElement('p');
    details.textContent = `Cost: ${activity.cost}, Participants: ${activity.minParticipants}-${activity.maxParticipants}, Approximate time: ${activity.time} hours`;

    activityDiv.appendChild(description);
    activityDiv.appendChild(details);

    matchingObjectsContainer.appendChild(activityDiv);
  }
}

// event listeners
document.getElementById('cost').addEventListener('change', function () {
  var selectedCost = this.value;
  displayObjectsByCost(selectedCost);
});

document.getElementById('location').addEventListener('change', function () {
  var selectedLocation = this.value;
  displayObjectsByLocation(selectedLocation);
});

document.getElementById('setting').addEventListener('change', function () {
  var selectedSetting = this.value;
  displayObjectsBySetting(selectedSetting);
});

function handlePage() {
  console.log('load all activities');
  fetchActivitiesData();
}

handlePage();
