// Setup Firebase config object
var config = {
  apiKey: 'AIzaSyCU8kFnyMRvuqQoUyqg9J4vIU_dtG5eMDU',
  authDomain: 'taylor54321-1e05d.firebaseapp.com',
  databaseURL: 'https://taylor54321-1e05d.firebaseio.com',
  projectId: 'taylor54321-1e05d',
  storageBucket: 'taylor54321-1e05d.appspot.com',
  messagingSenderId: '846098862236'
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
