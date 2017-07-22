/*
// Coded by Zeeshan Rasool for Skyrocket
// 22.07.17
*/


console.log("NOTE TAKER by ZR");

// DOM Elements

var addNote = document.getElementById('add_note');
var updNote = document.getElementById('edit_note');
var usrName = document.getElementById('user_name');

var feedNote = document.getElementById('feed');

var hmeBtn = document.getElementById('logo');
var nteBtn = document.getElementById('new_btn');
var usrBtn = document.getElementById('usr_btn');
var empBtn = document.getElementById('add_empty');
var ntiBtn = document.getElementById('noti');

var node = 0; // selected node for edit + update and delete

// Initialize

$(document).ready(function () {
	console.log("Let's go.");

	// Check for Loacalstroage DB
	if (typeof (Storage) !== "undefined") {
		console.log('Local storage available.');
	} else {
		console.log('Local storage not available.');
	}

	var storedNotes = JSON.parse(localStorage.getItem("notesX"));
	updateTagline(); // Update tagline.

	if (storedNotes) {
		if (storedNotes.length > 0) {
			getNote(storedNotes); // Populate notes list.
			$("#feed").fadeIn();
		} else {
			$("#empty").fadeIn(); // Empty state view	
		}
	} else {
		$("#empty").fadeIn();
	}
});


/*
 *	BUTTONS /////////////////////////////////////////////////
 *	
 */


empBtn.onclick = function () {
	$("section").hide();
	$("#new").fadeIn();
};
nteBtn.onclick = function () {
	$("section").hide();
	$("#new").fadeIn();
};
usrBtn.onclick = function () {
	$("section").hide();
	$("#user").fadeIn();
};
hmeBtn.onclick = function () {
	homeView();
};
ntiBtn.onclick = function () {
	$(this).hide();
};


// UPDATE USER

$("#add-user").on('submit', function (e) {
	e.preventDefault();

	// content check
	if (usrName.value.length < 1) {
		alert("That's too short of a name. Maybe add atleast one character?");
		return
	}

	// clear
	var name = usrName.value;
	localStorage.setItem("userX", name);

	// Update notes list
	var storedUser = localStorage.getItem("userX");
	console.log('user name updated');
	showNoti('Your username has been updated.');
	updateTagline();
	homeView();

});

// CLEAR STORAGE

$(document).on('tap click', "#clr_strg", function () {

	if (confirm('Are you sure you want to delete all of your notes? You crazy yo!')) {
		// Remove note.
		clearFeed();
		homeView();

	} else {
		// Do nothing.
	}

});

// ADD NOTE

$(document).on('tap click', "#add_note_btn", function () {

	// content check
	if (addNote.value.length < 1) {
		alert('All we see is nothing. Maybe write something before adding?');
		return
	}

	// NOTE CONTENT

	var currentUser = 'Guest'; //document.getElementById('add_note');
	var storedUser = localStorage.getItem("userX");
	if (storedUser) {
		currentUser = storedUser;
	}

	var currentTime = $.now(); // Timestamp
	var rndID = generateId(); // Id

	var newNote = {
		user: currentUser,
		time: currentTime,
		note: addNote.value,
		id: rndID
	};

	// Add to storage
	var spot = setStorage(newNote);
});

// EDIT NOTE
// Update and Delete

$(document).on('tap click', "#upd_note_btn", function () {

	// content check
	if (updNote.value.length < 1) {
		alert("With nothing to write, maybe just delete this note.");
		return
	}

	var currentUser = 'Guest'; //document.getElementById('add_note');
	var storedUser = localStorage.getItem("userX");
	if (storedUser) {
		currentUser = storedUser;
	}

	var currentTime = $.now(); // Timestamp
	var rndID = generateId();

	var upNote = {
		user: currentUser,
		time: currentTime,
		note: updNote.value,
		id: rndID
	};

	var storedNotes = JSON.parse(localStorage.getItem("notesX"));

	var notes = storedNotes;
	notes[node] = upNote;
	localStorage.setItem("notesX", JSON.stringify(notes));
	var updNotes = JSON.parse(localStorage.getItem("notesX"));
	getNote(updNotes);
	updNote.value = '';
	console.log('note update success');
	showNoti('Your note has been updated.');
	homeView();

});

// Delete note

$(document).on('tap click', "#del_note_btn", function () {

	if (confirm('Are you sure you want to delete this note?')) {
		deleteNote();
		homeView();
	} else {
		// Do nothing.
	}

});

// EDIT STORAGE

$(document).on('tap click', ".edit_note", function () {

	$("section").hide();
	$("#edit").fadeIn();

	node = parseFloat($(this).parent().find(".node-id").text());
	var storedNotes = JSON.parse(localStorage.getItem("notesX"));

	$("#edit_note").val(storedNotes[node].note);
	$("#edit_stmp").text(storedNotes[node].user);
	$(".node-id-edt").text(node);	
});


/*
 *	FUNCTIONS ///////////////////////////////////////////
 */


// Populate content
// Call notes in DB

function getNote(notesList) {

	$("#notes_feed").html('');
	$('#clr_strg').fadeIn();

	for (var i = 0; i <= notesList.length; i++) {

		var fetchPosts = function (sectionElement) {

			if (!notesList[i]) {
				return;
			}

			var containerElement = sectionElement.getElementsByClassName('posts-container')[0];
			containerElement.insertBefore(
				createNote(notesList[i].user, notesList[i].note, notesList[i].time, notesList[i].id, i),
				containerElement.firstChild);

		};

		fetchPosts(feedNote, notesList);

	}

}

// HTML for feed notes
function createNote(user, note, time, id, node) {

	var ntxt = note.replace(/\n/g, "<br />");
	var tme = getTime(time);

	var html = '<div class="content-wrp">' +

		'<div class="note-wrp" id="' + id + '">' +
		'<div class="txt-wrp wd">' +
		'<p class="note-txt">' + ntxt + '</p>' +
		'<div class="note-stmp">' + user + ' ~ ' + tme +
		'</div>' +

		'<div class="btn-wrp wd">' +
		'<div class="min-btn blu edit_note">EDIT</div>' +
		'<div class="node-id">' + node + '</div>' +
		'</div>' +

		'</div>' +

		'</div>';

	var div = document.createElement('div');
	div.innerHTML = html;
	var postElement = div.firstChild;

	return postElement;
}

// Set Storage Spot

function setStorage(note) {

	var storedNotes = JSON.parse(localStorage.getItem("notesX"));
	addNote.value = '';

	if (!storedNotes) {
		// first store
		var notes = [];
		notes[0] = note;
		localStorage.setItem("notesX", JSON.stringify(notes));

		storedNotes = JSON.parse(localStorage.getItem("notesX"));
		console.log('note add success'); showNoti('Your note has been added.');
		getNote(storedNotes);
		homeView();

	} else {
		// rest store
		var notes = storedNotes;
		notes[storedNotes.length] = note;
		localStorage.setItem("notesX", JSON.stringify(notes));

		storedNotes = JSON.parse(localStorage.getItem("notesX"));
		console.log('note add success'); showNoti('Your note has been added.');
		getNote(storedNotes);
		homeView();
	}
}

// Generate ID

function generateId() {
	var txt = "";
	var range = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < 10; i++)
		txt += range.charAt(Math.floor(Math.random() * range.length));

	return txt;
}

// Time converter

function getTime(time) {

	var date = new Date(time);
	var hours = date.getHours();
	var minutes = "0" + date.getMinutes();
	var seconds = "0" + date.getSeconds();
	var day = date.getDate();
	var month = date.getMonth();
	var year = date.getFullYear();

	var ap = 'am';
	if (hours <= 12) {
		ap = 'am';
	} else if (hours > 12) {
		ap = 'pm';
	}

	var added_month = month;
	var mon1 = '';
	if (added_month === 0) { mon1 = 'Jan'; } else if (added_month === 1) { mon1 = 'Feb'; } else if (added_month === 2) { mon1 = 'Mar'; } else if (added_month === 3) { mon1 = 'Apr'; } else if (added_month === 4) { mon1 = 'May'; } else if (added_month === 5) { mon1 = 'Jun';
	} else if (added_month === 6) { mon1 = 'Jul';	} else if (added_month === 7) { mon1 = 'Aug';	} else if (added_month === 8) { mon1 = 'Sep'; } else if (added_month === 9) { mon1 = 'Oct'; } else if (added_month === 10) { mon1 = 'Nov'; } else if (added_month === 11) { mon1 = 'Dec'; }

	var formattedTime = hours + ':' + minutes.substr(-2) + ' ' + ap + ' ~ ' + day + ' ' + mon1 + ' ' + year;
	return formattedTime;

}

// Delete note

function deleteNote() {

	var storedNotes = JSON.parse(localStorage.getItem("notesX"));
	var notes = storedNotes;
	notes.splice(node, 1);
	localStorage.setItem("notesX", JSON.stringify(notes));
	var updNotes = JSON.parse(localStorage.getItem("notesX"));
	getNote(updNotes); updNote.value = '';
	console.log('note delete success'); showNoti('Your note has been deleted.');
}

// Clear feed

function clearFeed() {

	var notes = [];
	localStorage.setItem("notesX", JSON.stringify(notes));
	var storedNotes = JSON.parse(localStorage.getItem("notesX"));
	console.log('all clear success'); showNoti('Your notes feed has been cleared.');
	getNote(storedNotes);
}

// Tagline update

function updateTagline() {

	// Get current user.	
	var storedUser = localStorage.getItem("userX");
	if (storedUser) {
		$(".tglne").text("Taking notes for " + storedUser + ".");
		$("#user_name").val(storedUser);
	}

}

// Go to home

function homeView() {
	updateTagline();
	var anyNotes = JSON.parse(localStorage.getItem("notesX")); // existing notes
	if (anyNotes) {
		if (anyNotes.length > 0) {
			$("section").hide();
			$("#feed").fadeIn();
		} else {
			$("section").hide();
			$("#empty").fadeIn();
			$('#clr_strg').hide();
		}

	} else {
		$("section").hide();
		$("#empty").fadeIn();
		$('#clr_strg').hide();
	}

}

// notifications

function showNoti(text) {
	$(".noti").text(text);
	$(".noti").css('display', 'inline-block');
	setTimeout(function () {
		$(".noti").hide();
	}, 3000);
}
