window.onload = async () => {
    clock = document.getElementById('clock');

    x = setInterval(updateTime, 1000)

    document.getElementById('temp-up').addEventListener('click', () => {
        updateVal(0, 1, true, 60, 80)
    })
    
    document.getElementById('temp-down').addEventListener('click', () => {
        updateVal(0, 1, false, 60, 80)
    })
    
    document.getElementById('pres-up').addEventListener('click', () => {
        updateVal(1, .5, true, 0, 10)
    })
    
    document.getElementById('pres-down').addEventListener('click', () => {
        updateVal(1, .5, false, 0, 10)
    })

    document.getElementById('watch-temp-up').addEventListener('click', () => {
        updateVal(0, 1, true, 60, 80)
    })
    
    document.getElementById('watch-temp-down').addEventListener('click', () => {
        updateVal(0, 1, false, 60, 80)
    })
    
    document.getElementById('watch-pres-up').addEventListener('click', () => {
        updateVal(1, .5, true, 0, 10)
    })
    
    document.getElementById('watch-pres-down').addEventListener('click', () => {
        updateVal(1, .5, false, 0, 10)
    })

    document.getElementById('mist').addEventListener('click', () => {
        updateNozzle('mist')
    })

    document.getElementById('drizzle').addEventListener('click', () => {
        updateNozzle('drizzle')
    })

    document.getElementById('cone').addEventListener('click', () => {
        updateNozzle('cone')
    })

    document.getElementById('profiles-button').addEventListener('click', () => {
        updateView('home', 'profiles-view')
    })

    document.getElementById('powerbutton').addEventListener('click', () => {
        updatePower();
    })
    
    userButtons = document.getElementsByClassName('name')

    for (let element of userButtons){
        element.addEventListener('click', () => {
            updateUser(element.parentElement.id)
        });
    }

    chartButtons = document.getElementsByClassName('chart')

    for (let element of chartButtons){
        element.addEventListener('click', () => {
            updateView('profiles-view', 'charts');
            buildGraphs(element.parentElement.id);
        })
    }

    y = setInterval(updateUserData, 1000);

    setInterval(updateGraphData, 60000)

    document.getElementById("return-button").addEventListener('click', () => {
        updateView('charts', 'profiles-view')
    })


    
}

var volumeChart = 0;
var usesChart = 0;

users = {
    'user1': [0, 0],
    'user2': [0, 0],
    'user3': [0, 0],
    'user4': [0, 0],
}

graphData = {
    'user1': { "volume": [0], "uses": [0]},
    'user2': { "volume": [0], "uses": [0]},
    'user3': { "volume": [0], "uses": [0]},
    'user4': { "volume": [0], "uses": [0]},

}

currValues = [77, 5]

currUser = 'user1';

currNozzle = "drizzle"

currentPower = 'OFF'

function updateTime() {
    time = new Date();

    hour = (time.getHours() % 12).toString()
    if (hour.length == 1){
        hour = "0" + hour
    }

    minute = (time.getMinutes()).toString()
    if (minute.length == 1){
        minute = "0" + minute
    }

    clock.innerHTML = hour + ":" + minute
}

function updateVal(objectId, inc, positive, min, max) {
    // obj = document.getElementsByClassName(objectId)[0];
    // positive ? obj.innerHTML = parseFloat(obj.innerHTML) + inc: obj.innerHTML = parseFloat(obj.innerHTML) - inc;

    positive ? currValues[objectId] = parseFloat(currValues[objectId]) + inc: currValues[objectId] = parseFloat(currValues[objectId]) - inc;
    if (currValues[objectId] < min){ currValues[objectId] = min}
    else if (currValues[objectId] > max){ currValues[objectId] = max }

    document.getElementsByClassName('temp')[0].innerHTML = currValues[0]
    document.getElementsByClassName('pres')[0].innerHTML = currValues[1]

    document.getElementById('watch-temp').innerHTML = currValues[0]
    document.getElementById('watch-pres').innerHTML = currValues[1]

}

function updateNozzle(objectId){
    document.getElementById(currNozzle).classList.remove("selected-nozzle");
    currNozzle = objectId;
    document.getElementById(objectId).classList.add("selected-nozzle");
}

function updateView(currentView, newView){
    document.getElementById(currentView).classList.add('inactive');
    document.getElementById(newView).classList.remove('inactive');
    document.getElementById(newView).classList.add('active-' + newView);
}

function updatePower(){
    if (currentPower == 'OFF'){
        currentPower = 'ON';
        document.getElementById('screen').style.backgroundColor='lightblue';
        users[currUser][0] += 1
    } else {
        currentPower = 'OFF';
        document.getElementById('screen').style.backgroundColor='lightgray';
    }
    document.getElementById('powerbutton').innerHTML = currentPower
    userElement.getElementsByClassName('uses')[0].innerHTML = users[currUser][0] + ' uses'

}

function updateUser(newUser){
    currUser = newUser
    updateView('profiles-view', 'home') 
    document.getElementById('profiles-button').innerHTML=currUser
}

nozzleData = {
    "mist": 50,
    "drizzle": 100,
    "cone": 150
}

function updateUserData(){
    if (currentPower == 'ON'){
        users[currUser][1] += nozzleData[currNozzle]
    }
    userElement = document.getElementById(currUser);
    userElement.getElementsByClassName('volume')[0].innerHTML = users[currUser][1] + 'mL'

}

function dragCrown() {
    console.log('dragging crown');
}

function updateGraphData(){
    Object.keys(users).forEach(e => {
        graphData[e]['volume'].push(users[e][0])
        graphData[e]['uses'].push(users[e][1])
    })
}



function buildGraphs(user){

    if (volumeChart != 0){ volumeChart.destroy() }
    if (usesChart != 0){ usesChart.destroy() }

    labels = Array.from(Array(graphData[user]['volume'].length).keys())

    const volumeData = {
        labels: labels,
        datasets: [{
          label: 'Uses',
          backgroundColor: 'rgb(80, 99, 255)',
          borderColor: 'rgb(80, 99, 255)',
          data: graphData[user]['volume'],
        }]
      };

    const volumeConfig = {
        type: 'line',
        data: volumeData,
        options: {}
    }

    const usesData = {
        labels: labels,
        datasets: [{
          label: 'Volume',
          backgroundColor: 'rgb(80, 99, 255)',
          borderColor: 'rgb(80, 99, 255)',
          data: graphData[user]['uses'],
        }]
      };

    const usesConfig = {
        type: 'line',
        data: usesData,
        options: {}
    }

    volumeChart = new Chart(document.getElementById('volume-graph-canvas'), volumeConfig)
    usesChart = new Chart(document.getElementById('uses-graph-canvas'), usesConfig)
}