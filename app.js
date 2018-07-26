$(document).ready(function() {
  var config = {
    apiKey: "AIzaSyBhLPCcBVY3T0geldwGJLHauspwanmGNvU",
    authDomain: "trainapp-c9d00.firebaseapp.com",
    databaseURL: "https://trainapp-c9d00.firebaseio.com",
    projectId: "trainapp-c9d00",
    storageBucket: "",
    messagingSenderId: "197391360785"
  };
  firebase.initializeApp(config);
  database = firebase.database();

  var timenow = moment().unix();

  var today = new Date();

  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

  $("#target").submit(function(event) {
    event.preventDefault();

    var name = $("#name")
      .val()
      .trim();
    var destination = $("#destination")
      .val()
      .trim();
    var time = $("#time")
      .val()
      .trim();
    var frequency = $("#frequency")
      .val()
      .trim();

    var trainData = {
      name: name,
      destination: destination,
      time: time,
      frequency: frequency
    };

    $("#name").val("");
    $("#destination").val("");
    $("#time").val("");
    $("#frequency").val("");

    var trainstart = moment(date + time, "YYYY/MM/DD HH:mm").unix();

    var convertfrequency = frequency * 60;

    var nextarrival = trainstart;

    setInterval(function() {}, 60000);

    while (timenow > trainstart) {
      nextarrival = trainstart += convertfrequency;
    }

    convertarrival = moment.unix(nextarrival).format("HH:mm");

    trainData.arrival = convertarrival;

    var minaway = Math.round((nextarrival - timenow) / 60);

    trainData.min = minaway;

    database.ref().push(trainData);
  });

  database.ref().on("child_added", function(snapshot) {
    name = snapshot.val().name;
    destination = snapshot.val().destination;
    time = snapshot.val().time;
    frequency = snapshot.val().frequency;
    arrival = snapshot.val().arrival;
    min = snapshot.val().min;

    var newRow = $("<tr>").append(
      $("<td>").text(name),
      $("<td>").text(destination),
      $("<td>").text(frequency),
      $("<td>").text(arrival),
      $("<td>").text(min)
    );

    // Append the new row to the table
    $("tbody").append(newRow);
  });
});
