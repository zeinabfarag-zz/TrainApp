// Setup Firebase config object
var config = {
    apiKey: "AIzaSyBhLPCcBVY3T0geldwGJLHauspwanmGNvU",
    authDomain: "trainapp-c9d00.firebaseapp.com",
    databaseURL: "https://trainapp-c9d00.firebaseio.com",
    projectId: "trainapp-c9d00",
    storageBucket: "trainapp-c9d00.appspot.com",
    messagingSenderId: "197391360785"
  };

$(document).ready(function() {
  // Initialize Firebase
  firebase.initializeApp(config);
  var db = firebase.database();

  // Add click event to submit
  $('.btn').click(function(event) {
    event.preventDefault();

    // Build trainSchedule object
    var trainSchedule = {
      trainName: $('#formGroupTrainNameInput').val(),
      destination: $('#formGroupDestinationInput').val(),
      firstTrainTime: moment(
        $('#formGroupFirstTrainTimeInput')
          .val()
          .trim(),
        'HH:mm'
      ).format('X'),
      frequency: $('#formGroupFrequencyInput').val()
    };

    // Commit object to database
    db.ref('trainSchedule').push(trainSchedule);
  });

  // Add value change listener
  db.ref('trainSchedule').on('child_added', function(childSnapshot) {
    var trainNames = childSnapshot.val().trainName;
    var trainDest = childSnapshot.val().destination;
    var trainFrequency = childSnapshot.val().frequency;
    var firstTrainTime = childSnapshot.val().firstTrainTime;
    var now = moment();

    // Calcluate time when train arrives
    var timeRemainder =
      now.diff(moment.unix(firstTrainTime), 'minutes') % trainFrequency;

    // Figure out how many minutes until arrival
    var minutesAway = trainFrequency - timeRemainder;

    // Format nextArrival
    var nextArrival = moment()
      .add(minutesAway, 'm')
      .format('HH:mm');

    // Insert schedule row
    var trainScheduleRow = $('<tr>');
    trainScheduleRow.append(
      $('<th>')
        .attr('scope', 'col')
        .text(childSnapshot.val().trainName),
      $('<td>')
        .attr('scope', 'col')
        .text(childSnapshot.val().destination),
      $('<td>')
        .attr('scope', 'col')
        .text(childSnapshot.val().frequency),
      $('<td>')
        .attr('scope', 'col')
        .text(nextArrival),
      $('<td>')
        .attr('scope', 'col')
        .text(minutesAway)
    );
    $('#trainSchedule').append(trainScheduleRow);
  });
});
