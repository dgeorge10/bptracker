window.onload= function(){
	getData();
}
var config = {
	apiKey: "AIzaSyB6FGuMtHqxuG-VfQecIFlXoH0KGKXWhN4",
	authDomain: "bpstracker.firebaseapp.com",
	databaseURL: "https://bpstracker.firebaseio.com",
	projectId: "bpstracker",
	storageBucket: "bpstracker.appspot.com",
	messagingSenderId: "149370382540"
};
firebase.initializeApp(config);
let user;
let values = []
let sugar = []
let bp = []
let dates;
function getData(){
	values = [];
	sugar = [];
	bp = [];
	var database = firebase.database().ref("User");
	database.once('value', hasData, noData);
	function hasData(data){
		user = data.val();
		dates = Object.keys(user);
		for(let i=0; i<dates.length; i++){
			values.push(user[dates[i]]);
		}
		for(let i=0; i<values.length; i++){
			sugar.push(values[i].sugar);
			bp.push(values[i].bp);
		}
		drawData()
	}
	function noData (err) {
		console.log(err);
	}
}

function drawData(){
	var ctx = document.getElementById('myChart').getContext('2d');
	var myChart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: dates,
			datasets: [{
				label: 'Blood pressure',
				data: bp,
				borderColor: 'rgba(255,0,0,1)',
				fill: false
			},
				{
					label: 'Blood Sugar',
					data: sugar,
					borderColor: 'rgba(0,255,0,1)',
					fill: false
				}
			]},
		options: {
			responsive: true,
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true
					}
				}]
			}
		}
	});
}
function sendData(){
	let bp = document.getElementById("bp").value;
	let sugar = document.getElementById("sugar").value;
	let today = new Date();
	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	if(bp && sugar){
		firebase.database().ref('/User/' + date).set({
			bp: parseInt(bp),
			sugar: parseInt(sugar)
		}, function(err){
			if(err){console.log(err);}
			else{getData();}
		});

	}

}
