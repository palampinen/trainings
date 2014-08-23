var API_URL = 'http://minnemenna.com/dev/wp-content/plugins/omafressi/dev/api/',
	API_USER = '',
	API_PASS = '',
	API_CENTERURL = 'https://fressi.bypolar.fi/mobile/10/history.html';

	
// TEMP
var logindata = {};
logindata.username = API_USER;
logindata.password = API_PASS;
logindata.center = API_CENTERURL;
	
angular.module('treenit.services', [])

/**
 * A simple example service that returns some data.
 */
 /*
.factory('Friends', function() {
  // Might use a resource here that returns a JSON array

  
  var weekdata = [
    { id: 0, name: 'Scruff McGruff' },
    { id: 1, name: 'G.I. Joe' },
    { id: 2, name: 'Miss Frizzle' },
    { id: 3, name: 'Ash Ketchum' }
  ];
  
  
  
  // Some fake testing data
  var friends = [
    { id: 0, name: 'Scruff McGruff' },
    { id: 1, name: 'G.I. Joe' },
    { id: 2, name: 'Miss Frizzle' },
    { id: 3, name: 'Ash Ketchum' }
  ];

  return {
    all: function() {
      return weekdata;
    },
    get: function(friendId) {
      // Simple index lookup
      return friends[friendId];
    }
  }
})
*/

// TOTAL TRAININGS
.factory('Trainings', ['$http','$q', 'User','$ionicLoading', function ($http, $q, User, $ionicLoading) {

	
	var myUser = User.all();

	return {
		all: function() {

				console.log('user',myUser)
				/*
				$ionicLoading.show({
				  template: '<i class="icon ion-ios7-reloading"></i> Haetaan treenit...'
				});
				*/
				
				var deferred = $q.defer();
				$http({
						method: 'GET',
						url : API_URL, 
						params: {
							'command':'all', 
							'TREENI_USER'	: myUser.username, 
							'TREENI_PASS'	: myUser.password, 
							'TREENI_CENTER'	: myUser.center,
							'TREENI_LAST'	: localStorage.getItem('treenit-data-last')
						},
					})
					.success(function(data, status) {
						//console.log(data);
						// Merge data
						
						
						
						// Combine old data and new data
						var oldData = localStorage.getItem('treenit-data'),
							newData;
						if(oldData)
							newData= data.concat( JSON.parse(oldData) );
						else 
							newData = data
						
						// Make sure that fetched data is an array
						
						
						if( _.isArray(data)){
						
							// unique data based on just date // TODO uniq based on date, time AND hourtype
							newData = _.uniq(newData, false, function(training) {return JSON.stringify(training)})
							
							
							localStorage.setItem('treenit-data', JSON.stringify(newData) );
							//console.log('Data is array');
						}
						
						// Update last update timestamp
						var d = new Date();
						localStorage.setItem('treenit-data-last', d.getDate()+'.'+(d.getMonth()+1) + '.' +d.getFullYear());
						localStorage.setItem('treenit-data-timestamp', d.getTime());
						
						// Hide loader
						//$ionicLoading.hide();
						deferred.resolve(data)
					})
					.error(function(data, status) {
						deferred.reject(data);
						//$ionicLoading.hide();
						//alert("Error");
				});
				return deferred.promise;
			
			
		}
	};

  
  
}])

/*
// MONTH ACTIVITY - DEPRECATED
.factory('MonthActivity', ['$http','$q', function ($http, $q) {

	

	return {
		all: function() {
			console.log('getting data');
			var deferred = $q.defer();
			
			$http({method : 'GET',url : API_URL, params: {command:'month', TREENI_USER: logindata.username, TREENI_PASS:logindata.password, TREENI_CENTER:logindata.center}})
				.success(function(data, status) {
				
					localStorage.setItem("treenit-month",JSON.stringify(data));
					
					deferred.resolve(data)
				})
				.error(function(data, status) {
					deferred.reject(data);
					//alert("Error");
			});
			return deferred.promise;
			
		}
	};
	
	
  
}])
*/

.factory('User', function() {

//tmp

		var treenitNameSpace = 'treenit-user-'
			userdata = {
			name: 		localStorage.getItem(treenitNameSpace+'name'), 
			sex: 		localStorage.getItem(treenitNameSpace+'sex'), 
			email:		localStorage.getItem(treenitNameSpace+'email'),
			username: 	localStorage.getItem(treenitNameSpace+'username'),
			password:	localStorage.getItem(treenitNameSpace+'password'),
			center:		localStorage.getItem(treenitNameSpace+'center'),
			centerID: 	localStorage.getItem(treenitNameSpace+'centerID')
		}
		
		
	
	return {
		isAuthed: function() {
			return (localStorage.getItem(treenitNameSpace+'username') && localStorage.getItem(treenitNameSpace+'password'));
		},
		get: function (key) {
			return userdata;
		},
		some: function() {
			return userdata.name;
		},
		save: function(data) {
			if(data.name) 		localStorage.setItem(treenitNameSpace+'name'	, data.name)
			if(data.center) 	localStorage.setItem(treenitNameSpace+'center'	, data.center)
			if(data.sex) 		localStorage.setItem(treenitNameSpace+'sex'		, data.sex)
			if(data.email) 		localStorage.setItem(treenitNameSpace+'email'	, data.email)
			if(data.username) 	localStorage.setItem(treenitNameSpace+'username', data.username)
			if(data.password) 	localStorage.setItem(treenitNameSpace+'password', data.password)
			if(data.center) 	localStorage.setItem(treenitNameSpace+'center'	, data.center)
		},
		all: function() {
			return userdata;
		},
		clear: function() {
			console.log('clearing local storage values');
			localStorage.setItem(treenitNameSpace+'name'	, '')
			localStorage.setItem(treenitNameSpace+'center'	, '')
			localStorage.setItem(treenitNameSpace+'sex'		, '')
			localStorage.setItem(treenitNameSpace+'email'	, '')
			localStorage.setItem(treenitNameSpace+'username', '')
			localStorage.setItem(treenitNameSpace+'password', '')
			localStorage.setItem('treenit-data', '')
			localStorage.setItem('treenit-data-last', '')
			localStorage.setItem('treenit-data-timestamp', '')
		
		}
		
	};
	
	
	
	return userdata;
	
})

.factory('AppAuth', ['$http','$q','$ionicLoading', function ($http, $q, $ionicLoading) {
	

	return {
		validateAuth: function(credentials) {
			if (! (credentials.username && credentials.password && credentials.center))
				return false;
			
			return true;
			
			if( localStorage.getItem('treenit-user-username') &&
				localStorage.getItem('treenit-user-username') &&
				localStorage.getItem('treenit-user-center') )
				return true;
		},
		auth: function(credentials) {

			var deferred = $q.defer();
			
			$ionicLoading.show({
			  template: '<i class="icon ion-ios7-reloading"></i> Tarkistetaan...'
			});
			
			$http({
				method: 'GET',
				url : API_URL, 
				params: {'command':'auth', 'TREENI_USER':credentials.username, 'TREENI_PASS':credentials.password, 'TREENI_CENTER':credentials.center},
			})
			.success(function(data, status) {
				
				$ionicLoading.hide();
				deferred.resolve(data)

			})
			.error(function(data, status) {
				$ionicLoading.hide();
				deferred.reject(data);
				//alert("Error");
			});
			return deferred.promise;
		},
		localAuth: function() { // This should be useless
			
			return (
				localStorage.getItem('treenit-user-username') &&
				localStorage.getItem('treenit-user-username') &&
				localStorage.getItem('treenit-user-center') 
				);
			
		}
	}


}])

.factory('Treenidata', ['User', function(User) {
	var treenidata = localStorage.getItem('treenit-data'),
		treenitJSON;
	
	if(treenidata)
		treenitJSON = JSON.parse( localStorage.getItem('treenit-data'));
	else 
		treenitJSON = {};
		
	var treeni = new Treenit(User.all().name, treenitJSON);
	return {
		all: function() {
			return treeni.all()
		},
		allGrouped: function(groupByTerm) {
			return treeni.allGrouped(groupByTerm)
		},
		count: function() {
			return treeni.count()
		},
		thisweek: function() { 
			return treeni.getThisWeekActivity()
		},
		lastvisit: function() {
			return treeni.getTimeFromLastVisit()
		},
		trainingsOfDay: function(date) {
			return treeni.getTrainingsOfDay(date)
		},
		weeklyAverage: function() {
			return treeni.getWeeklyAverage()
		},
		favdays: function() {
			return treeni.getFavDays()
		},
		thisYearCount: function() {
			return treeni.getThisYearCount()
		},
		yearCount: function(year) {
			return treeni.getYearCount(year)
		},
		yearCountToDate: function(year,date) {
			return treeni.getYearCountToDate(year,date)
		},
		monthCount: function(year,month) {
			return treeni.getMonthCount(year,month)
		},
		monthCalendar: function(year,month) {
			return treeni.getMonthCalendar(year,month)
		},
		monthCalendarFromBeginning: function(){
			return treeni.getMonthCalendarFromBeginning()
		},
		yearActivity: function() {
			return treeni.getYearActivity()
		},
		yearActivityChart: function() {
			return treeni.getYearActivityChart()
		},
		yearActivityChartDT: function(limit) {
			return treeni.getYearActivityChartDT(limit)
		},
		yearActivityChartCJS: function(limit,type) {
			return treeni.getYearActivityChartCJS(limit,type)
		},
		longestStreak: function() {
			return treeni.getLongestStreak()
		},
		latestCountByDays: function(days) {
			return treeni.getLatestCountByDays(days);
		},
		lastDaysActivity: function(days) {
			return treeni.getLastDaysActivity(days);
		},
		trainTypes: function() {
			return treeni.getTrainTypes();
		},
		setData: function(id,field,val){


			treenitJSON[id][field]=val; 
			var newData = JSON.stringify(treenitJSON);
			localStorage.setItem('treenit-data', newData)
		},
		setTrainTypeData: function(id,tid,val){

			if(treenitJSON[id]['traintype'] == undefined)
				treenitJSON[id]['traintype'] = {};

			treenitJSON[id]['traintype'][tid]=val; 
			var newData = JSON.stringify(treenitJSON);
			localStorage.setItem('treenit-data', newData)
		},
		removeData: function(id,field){

			var newData = JSON.stringify(treenitJSON[id][field] = '');
			localStorage.setItem('treenit-data', newData)
		},
		addTraining: function(date,name){
			//disable adding future trainings
			if(date2Date(date) > new Date())
				return false;

			treenitJSON.push({
				date:date,
				hourtype:name,
				time: '00:00-00:00',
				manual: 1
			})

			var newData = JSON.stringify(treenitJSON);
			localStorage.setItem('treenit-data', newData);
		},
		removeTraining: function(id){
			treenitJSON.splice(id,1)
			var newData = JSON.stringify(treenitJSON);
			localStorage.setItem('treenit-data', newData);
		}
		

	
	}
}])