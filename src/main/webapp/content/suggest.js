const API_URL = 'http://localhost:8080'; // Replace with your actual API URL

let data;

function fetchActivitiesData() {
  return fetch(`${API_URL}/api/activities`)
    .then(res => res.json())
    .then(resultData => {
      data = resultData; // Set the global data variable
      showRandom(data);
    })
    .catch(error => {
      console.log(`Error Fetching data : ${error}`);
      document.getElementById('suggestion').innerHTML = 'Error Loading Data';
    });
}

function getRandomObject(data) {
  var randomIndex = Math.floor(Math.random() * data.length);
  return data[randomIndex];
}

function showRandom(data) {
  const suggestionContainer = document.getElementById('suggestion');
  suggestionContainer.innerHTML = ''; // Clear previous content

  let div = document.createElement('div');
  let title = document.createElement('h3');

  var randomObject = getRandomObject(data);
  console.log(randomObject);

  title.innerHTML = `<a href="details.html?activityid=${randomObject.id}">${randomObject.description}</a>`;

  div.appendChild(title);
  suggestionContainer.appendChild(div);
}

function displayObjectsByLocation(location) {
  // Ensure data is defined before attempting to use it
  if (!data) {
    console.error('Data is not defined.');
    return;
  }

  var matchingObjectsContainer = document.getElementById('matchingObjects');
  matchingObjectsContainer.innerHTML = ''; // Clear previous content

  data.forEach(function (activity) {
    if (location === 'all' || activity.inOrOut.toLowerCase() === location.toLowerCase()) {
      displayActivity(activity);
    }
  });
}

function displayActivity(activity) {
  var matchingObjectsContainer = document.getElementById('matchingObjects');

  var activityDiv = document.createElement('div');
  activityDiv.classList.add('activity');

  var description = document.createElement('h2');
  description.textContent = activity.description;

  var details = document.createElement('p');
  details.textContent = `Cost: ${activity.cost}, Participants: ${activity.minParticipants}-${activity.maxParticipants}, Time: ${activity.time} hours`;

  activityDiv.appendChild(description);
  activityDiv.appendChild(details);

  matchingObjectsContainer.appendChild(activityDiv);
}

document.getElementById('location').addEventListener('change', function () {
  var selectedLocation = this.value;
  displayObjectsByLocation(selectedLocation);
});

function handlePage() {
  console.log('load all activities');
  fetchActivitiesData();
}

handlePage();
