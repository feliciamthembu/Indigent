// In this file we are goint to include all the Controllers our app it's going to need
(function () {
    'use strict';

    var app = angular.module('app', ['onsen', 'ngMessages']);

    var datePicker;
	 var db = null;

    // Filter to convert HTML content to string by removing all HTML tags
    app.filter('htmlToPlaintext', function () {
        return function (text) {
            return String(text).replace(/<[^>]+>/gm, '');
        }
    });

    // Filter to show Miles instead of KM
    app.filter('showMiles', function () {
        return function (item) {
            return (item * 0.621).toFixed(2);
        };
    });
	
	// Wait for Cordova to load
	document.addEventListener("deviceready", onDeviceReady, false);
    
    // watch id 
    var watchID = null;
    
    
    
	
    app.controller('networkController', function ($scope, $q, $rootScope) {

		
        document.addEventListener('deviceready', function () {
			/*var db;
			db = window.sqlitePlugin.openDatabase({name: "indigentdb.db", location: 'default'});
            navigator.splashscreen.hide();*/

            datePicker = window.plugins.datePicker;

            //document.getElementById("cameraTakePicture").addEventListener("click", cameraTakePicture);

			//console.log(document);
            /*cameraTakePicture = function () {

                var selection = 1;

                navigator.camera.getPicture(onSuccess, onFail, {
                    quality: 50,
                    destinationType: Camera.DestinationType.DATA_URL
                });

                function onSuccess(imageUri) {
                    //var image = document.getElementById('myImage');
                    //image.src = "data:image/jpeg;base64," + imageData;

                    if (selection === 1)
                        $scope.image1 = "data:image/jpeg;base64," + imageUri;
                    else if (selection === 2)
                        $scope.image2 = "data:image/jpeg;base64," + imageUri;
                    else if (selection === 3)
                        $scope.image3 = "data:image/jpeg;base64," + imageUri;
                    else if (selection === 4)
                        $scope.image = "data:image/jpeg;base64," + imageUri;
                    else if (selection === 5)
                        $scope.image5 = "data:image/jpeg;base64," + imageUri;
                    else if (selection === 6)
                        $scope.image6 = "data:image/jpeg;base64," + imageUri;

                    $scope.apply();

                }

                function onFail(message) {
                    alert('Failed because: ' + message);
                }

            }*/

            var notificationOpenedCallback = function (jsonData) {

                ons.notification.alert({
                    message: jsonData.message,
                    modifier: 'material'
                });

                console.log('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));
            };
			
			var promptCallback = function(results) {
				console.log('User entered a value ' + results.input1 + ', and selected option ' + results.buttonIndex);
				
			};

            /*window.plugins.OneSignal.init("a17d1266-3037-4f13-8c29-e2203d0f3458", {
                    googleProjectNumber: "1030098960429"
                },
                notificationOpenedCallback);*/

            window.plugins.OneSignal
                .startInit("a17d1266-3037-4f13-8c29-e2203d0f3458", "1030098960429")
                .handleNotificationOpened(notificationOpenedCallback)
                .endInit();

            /* window.plugins.OneSignal.getIds(function (ids) {
                 window.localStorage.setItem("pushToken", ids.pushToken);
                 window.localStorage.setItem("userId", ids.userId);

                 console.log('pushToken is: ' + window.localStorage.getItem("pushToken"));
             });*/
            // Show an alert box if a notification comes in when the user is in your app.
            //window.plugins.OneSignal.enableInAppAlertNotification(true);

        }, false);

        // Check if is Offline
        document.addEventListener("offline", function () {

			/*var db;
			db = window.sqlitePlugin.openDatabase({name: "indigentdb.db", location: 'default'});
            navigator.splashscreen.hide();*/
			
            offlineMessage.show();

            /* 
             * With this line of code you can hide the modal in 8 seconds but the user will be able to use your app
             * If you want to block the use of the app till the user gets internet again, please delete this line.       
             */

            setTimeout('offlineMessage.hide()', 8000);

        }, false);

        document.addEventListener("online", function () {
			
            // If you remove the "setTimeout('offlineMessage.hide()', 8000);" you must remove the comment for the line above      
            // offlineMessage.hide();
        });


        $rootScope.back = function () {
            window.history.back();
        }

        //Phonegap action
        $rootScope.goExit = function () {
            if (navigator.app) {
                navigator.app.exitApp();
            } else if (navigator.device) {
                navigator.device.exitApp();
            }
        }

        $scope.emailSignIn = function () {
            appNavigator.pushPage('register.html');
        }

        $scope.signIn = function () {

            appNavigator.pushPage('signin.html');

        }

    });

    // This functions will help us save the JSON in the localStorage to read the website content offline

    Storage.prototype.setObject = function (key, value) {
        this.setItem(key, JSON.stringify(value));
    }

    Storage.prototype.getObject = function (key) {
        var value = this.getItem(key);
        return value && JSON.parse(value);
    }

    // This directive will  allow us to cache all the images that have the img-cache attribute in the <img> tag
    app.directive('imgCache', ['$document', function ($document) {
        return {
            link: function (scope, ele, attrs) {
                var target = $(ele);

                scope.$on('ImgCacheReady', function () {

                    ImgCache.isCached(attrs.src, function (path, success) {
                        if (success) {
                            ImgCache.useCachedFile(target);
                        } else {
                            ImgCache.cacheFile(attrs.src, function () {
                                ImgCache.useCachedFile(target);
                            });
                        }
                    });
                }, false);

            }
        };
    }]);

	app.directive('ngConfirmClick', [ function(){
        return {
            link: function (scope, element, attr) {
                var msg = attr.ngConfirmClick || "Are you sure, you want to Reject Assignment?";
                var clickAction = attr.confirmedClick;
                element.bind('click',function (event) {
                    if ( window.confirm(msg) ) {
                        scope.$eval(clickAction)
                    }
                });
            }
        };
}])

    // Map Markers Controller
    var map;


    app.factory('loadingMessageService', function () {
        return {
            showMessage: function () {
                var messageList = ["Ekurhuleni economy contributes 6.2% to national production;", "Has a share of ±7.3% of national employment;", "Ekurhuleni economy produces 26% of the total economic output of Gauteng;", "Ekurhuleni economy produces 26% of the total economic output of Gauteng", "Ekurhuleni economy grew 3% per annum between 1996 and 2009", "Ekurhuleni economy accounted for 17.6% of national imports between 1996 and 2003", "Ekurhuleni economy accounted for 6.7% of national exports between 1995 and 2003", "The City of Ekurhuleni’s long term roadmap, the Growth and Development Strategy 2055, is in place to which the city’s flagship projects are aligned", "The city has an annual operating budget of around R31.4 billion and capital budget of around R4.5 billion. The city received a clean audit for the 2013/14 financial year", "Stretching from OR Tambo International Airport, the Albertina Sisulu Corridor is a prime investment and development location. Straddling the R21 and R24 freeways, which runs through Ekurhuleni, the corridor links Johannesburg, OR Tambo International Airport and Pretoria (Tshwane)", "The Albertina Sisulu Corridor offers a myriad of investment opportunities in a wide range of sectors, including logistics, telecommunications and business outsourcing, import and export, manufacturing and processing, transport-related services, office and retail space, agriculture, eco-tourism and conservation", "The Albertina Sisulu Corridor offers a myriad of investment opportunities in a wide range of sectors, including logistics, telecommunications and business outsourcing, import and export, manufacturing and processing, transport-related services, office and retail space, agriculture, eco-tourism and conservation", "The Gauteng Industrial Development Zone (IDZ) will, through its subsidiary the Gauteng Growth and Development Agency (GGDA) operationalize the industrial development zone at the OR Tambo International Airport. In the first phase a Jewellery Manufacturing Precinct will be established. This is linked to the broader Ekurhuleni Aerotropolis flagship project – the vision is to create a world-class globally competitive manufacturing space opening in 2017", "Business activities in Ekurhuleni townships are diverse and range from retail, industrial activity to construction. The city has devised an urban development structure that creates investment opportunities for business while also contributing to social development and upliftment. Ekurhuleni has a well-developed network of infrastructure as well as strong telecommunications infrastructure and powerful electricity grids", "Not only is more than a quarter of Africa’s railway tracks situated in South Africa, but at the heart of this hub is situated in Germiston, in the City of Ekurhuleni. This is the busiest Southern African Development Community rail interchange in Africa. Sentrarand, the biggest railway shunting yard in the country is also situated in Ekurhuleni", "Ekurhuleni’s water quality and reticulation systems are some of the best in the world, with the city receiving the Blue Drop Platinum Award for the high quality of tap water that it supplies to its citizens for three consecutive years", "Ekurhuleni can be regarded as the transportation hub of the country. It is home to OR Tambo International Airport, the busiest airport in Africa, which services the entire continent and links to major cities throughout the world. Similarly, many of the world’s leading airlines fly into OR Tambo International Airport, which has been identified as the nucleus for the development of the aerotropolis", "The city is home to Tambo-Springs, an initiative that involves creating significantly improved intermodal capabilities for the movement of freight to and from Gauteng, The Tambo-Springs inland port will function as a multimodal logistics gateway, This is to be achieved by the operational twinning of the inland port with other seaport inland, and cross-border locations,. To ensure seamless movement of freight between modes", "Together with national government, the City of Ekurhuleni is undertaking 21 industrial initiatives, all under the banner of the aerotropolis. These are designed to revitalize the manufacturing sector, aviation, transport, and logistics industries linked to the airport. These will dramatically transform the current industrial structure of the economy of Ekurhuleni", " The Gillooly’s motor vehicle exchange is the business in the country, making Ekurhuleni the heart of the movement of goods in the country", "Roads are well maintained and more than capable of handling the city’s increasing commercial traffic. The N3 from Johannesburg to Durban, the N12 from Johannesburg to Witbank and the R21 highway, which joins OR Tambo International Airport to the rest of the province, all meet at Gillooly’s interchange right in the heart of Ekurhuleni", "A modern road network system reaches every part of the Ekurhuleni region and connects all the major towns, offering convenience and a seamless travel experience"];

                return messageList[Math.floor(Math.random() * messageList.length)];
            }
        };
    });
	
	function onDeviceReady(){
			
			var db = window.sqlitePlugin.openDatabase({
				name: 'indigentdb.db',
				location: 'default'
			});
        
         // Throw an error if no update is received every 30 seconds
        var options = { timeout: 30000 };
        watchID = navigator.geolocation.watchPosition(onSuccess, onError, options);
        
        
        
		}
    
   
    
    
    
    
    
  
    
    
    
  
       
 
    
    
    
    
    
    
    
	
    app.controller('indigentController', ['$q', '$http', '$scope', '$rootScope', '$sce', 'appConfig', 'loadingMessageService', function ($q, 	$http, $scope, $rootScope, $sce, appConfig, loadingMessageService) {
		
		$scope.aggregatedList = [];
        $scope.dialogs = [];
        $scope.documentBase64InfoList = [];
        $scope.declineReason = "";
        $scope.isAccepted = false;

        $scope.image1 = {};
        $scope.image2 = {};
        $scope.image3 = {};
        $scope.remarks = '';

        var signaturePad, remarks;

		$scope.declineReasonList = [

            {
                "id": 1,
                "name": "Incomplete information"
			},
            {
                "id": 2,
                "name": "The house is not indigent"
			},
            {
                "id": 3,
                "name": "Other"
                    }
         ];
		
		$scope.rejectReasonList = [
			{
				"id": 1,
				"name": "I am sick"
			},
			{
				"id": 2,
				"name": "I am on leave"
			},
			{
				"id": 3,
				"name": "Other"
			}
		];

        $scope.initIndigent = function () {

            $scope.isFetching = true;
            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();

            d3.json(appConfig.emmIdigentEndPoint, function (data) {

                //UnEmployed
                var unemployedList = {
                    key: "UnEmployed",
                    color: "#4f99b4",
                    values: []
                };

                var i;
                $scope.unEmployedHighValue = 0, $scope.employedHighValue = 0, $scope.childHeadedHighValue = 0;
                $scope.unEmployedHighWard = "", $scope.employedHighWard = "", $scope.childHeadedHighWard = "";

                for (i = 0; i < data.length; i++) {

                    if (parseInt(data[i].unemployed, 10) > $scope.unEmployedHighValue) {
                        $scope.unEmployedHighValue = data[i].unemployed;
                        $scope.unEmployedHighWard = data[i].a_wardNo;
                    }

                    unemployedList.values.push({
                        value: data[i].unemployed,
                        label: data[i].a_wardNo
                    });

                };

                //Employees
                var employedList = {
                    key: "Employed",
                    color: "#4d4cb9",
                    values: []
                };

                var i;

                for (i = 0; i < data.length; i++) {

                    if (parseInt(data[i].employed, 10) > $scope.employedHighValue) {
                        $scope.employedHighValue = data[i].employed;
                        $scope.employedHighWard = data[i].a_wardNo;
                    }

                    employedList.values.push({
                        value: data[i].employed,
                        label: data[i].a_wardNo
                    });

                };

                var childHeadedList = {
                    key: "ChildHeaded",
                    color: "#00FF00",
                    values: []
                };
                var i;


                for (i = 0; i < data.length; i++) {

                    if (parseInt(data[i].childHeaded, 10) > $scope.childHeadedHighValue) {
                        $scope.childHeadedHighValue = data[i].childHeaded;
                        $scope.childHeadedHighWard = data[i].a_wardNo;
                    }

                    childHeadedList.values.push({
                        value: data[i].childHeaded,
                        label: data[i].a_wardNo
                    });

                };

                $scope.aggregatedList = [unemployedList, employedList, childHeadedList];

                $scope.$apply();


                nv.addGraph(function () {

                    var chart = nv.models.multiBarHorizontalChart()
                        .x(function (d) {
                            return "Ward " + d.label
                        })
                        .y(function (d) {
                            return d.value
                        })
                        .margin({
                            top: 55,
                            right: 5,
                            bottom: 5,
                            left: 55
                        })
                        .showValues(true) //Show bar value next to each bar.
                        //.tooltips(true) //Show tooltips on hover.
                        //.transitionDuration(350)
                        .showControls(false); //Allow user to switch between "Grouped" and "Stacked" mode.

                    chart.yAxis
                        .tickFormat(d3.format(',.2f'));
                    chart.groupSpacing(0);
                    chart.height(1600);

                    d3.select('#chart1 svg')
                        .datum($scope.aggregatedList)
                        .call(chart);

                    nv.utils.windowResize(chart.update);

                    return chart;
                });

                $scope.isFetching = false;
                modal.hide();
            });

        }

		$scope.username = "";

		var recommendationList = {};
        $scope.recommendation = {};
        $scope.login = function () {
			$scope.isFetching = true;
            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();
			
            if (typeof $scope.password === 'undefined' && typeof $scope.username === 'undefined') {

                ons.notification.alert({
                    message: 'Username or password not provided!',
                    modifier: 'material'
                });


            } else {
				
				/*$scope.username = window.localStorage.getItem("username");
            	$scope.password = window.localStorage.getItem("password");
				
				console.log($scope.password);
				console.log($scope.username);
				
				if ($scope.username == 'null' && $scope.password == 'null') {
					console.log('No User Stored')
				} else {console.log('User Available')}
				*/
				
				$scope.API = appConfig.emmloginapiEndPoint;
				
				$scope.API = $scope.API + 'userId=' + $scope.username + '&pwd=' + $scope.password;

				console.log($scope.API);
                
                window.localStorage.setItem("username", $scope.username);
				window.localStorage.setItem("password", $scope.password);
                
                
				$http.get($scope.API).success(function (response) {

					console.log(response)
					
					if (response.IsCorrect == "Yes") {
							$scope.API = appConfig.emmdropdownmenu;
							$http.post($scope.API).success(function (response){
								$scope.recommendation = JSON.parse(response.json);
								console.log($scope.recommendation);
								
								//recommendationList = recommendation.recommendationList;
								
								window.localStorage.setItem("recommandation1", JSON.stringify($scope.recommendation));
								window.localStorage.setItem("username", $scope.username);
								window.localStorage.setItem("password", $scope.password);
								//window.localStorage.setItem("recommandation", recommendation);

							var db = window.sqlitePlugin.openDatabase({
								name: 'indigentdb.db',
								location: 'default'
							});

				console.log($scope.recommendation);
				
							db.transaction(function (transaction) {
								//select from table assignment
								var query = "SELECT * FROM assignment WHERE status ='" + 'Accepted' + "' AND fieldWorkerID =?";

								transaction.executeSql(query, [$scope.username], function (tx, results) {

										//console.log($scope.acceptedList); 
										for (var i = 0; i < results.rows.length; i++) {
											$scope.acceptedList.push(JSON.parse(results.rows.item(i).objectString));
										}

									}, function(error){
										console.log(eror);
									});
								});
							db.transaction(function (transaction) {
								//select from table assignment

									var query = "SELECT * FROM assignment WHERE status ='" + 'Closed' + "' AND fieldWorkerID =?";

									transaction.executeSql(query, [$scope.username], function (tx, results) {

										for (var i = 0; i < results.rows.length; i++) {
											$scope.closedList.push(JSON.parse(results.rows.item(i).objectString));
										}

										console.log($scope.closedList);

									}, null);
								});
							db.transaction(function (transaction) {
								//select from table assignment
								var query = "SELECT * FROM assignment WHERE status ='" + 'Rejected' + "' AND fieldWorkerID =?";

								transaction.executeSql(query, [$scope.username], function (tx, results) {

									for (var i = 0; i < results.rows.length; i++) {
										$scope.rejectedList.push(JSON.parse(results.rows.item(i).objectString));
									}

									console.log($scope.closedList);

								}, null);
							});
							db.transaction(function (transaction) {
								//select from table assignment
								var query = "SELECT * FROM assignment WHERE status ='" + 'Declined' + "' AND fieldWorkerID =?";

								transaction.executeSql(query, [$scope.username], function (tx, results) {

									for (var i = 0; i < results.rows.length; i++) {
										$scope.declinedList.push(JSON.parse(results.rows.item(i).objectString));
									}

									console.log($scope.declinedList);

								}, null);
							});
							
							appNavigator.resetToPage('indigent-mainmenu.html', {
								acceptedList: $scope.acceptedList,
								rejectedList: $scope.rejectedList,
								closedList: $scope.closedList,
								declinedList: $scope.declinedList,
								active: 'assignment'
							});
							}, function (error){
								console.log("No internet Connection")
							})
							
						/*
							db.close(function () {
								console.log("DB closed!");
							});*/
							$scope.isFetching = false;
							modal.hide();
						
						/*
						db.transaction(function (transaction) {
						//select Closed from table assignment
						var query = "SELECT * FROM assignment WHERE status ='" + 'Closed' + "' AND fieldWorkerID =?";

						transaction.executeSql(query, [$scope.username], function (tx, results) {

							for (var i = 0; i < results.rows.length; i++) {
								$scope.closedList.push(JSON.parse(results.rows.item(i).objectString));
							}

							console.log($scope.closedList);

						}, null);
					});
						db.transaction(function (transaction) {
						//select Rejected from table assignment
						var query = "SELECT * FROM assignment WHERE status ='" + 'Rejected' + "' AND fieldWorkerID =?";

						transaction.executeSql(query, [$scope.username], function (tx, results) {

							for (var i = 0; i < results.rows.length; i++) {
								$scope.rejectedList.push(JSON.parse(results.rows.item(i).objectString));
							}

							console.log($scope.rejectedList);

						}, null);
					});

                        appNavigator.pushPage('indigent-mainmenu.html', {
							acceptedList: $scope.acceptedList,
							rejectedList: $scope.rejectedList,
							closedList: $scope.closedList
						});
						
						$scope.isFetching = false;
						modal.hide();*/
                    } else if (response.IsCorrect == "No") {
                        ons.notification.alert({
                            message: 'Incorrect username and password. Please contact Service Desk : ' + $scope.username,
                            modifier: 'material'
                        });
						
						$scope.isFetching = false;
						modal.hide();
                    } else {
						console.log(response)
						ons.notification.alert({
							title: 'Login',
                            message: 'Server is offline. Please contact Service Desk!!',
                            modifier: 'material'
                            
                        });
						$scope.isFetching = false;
						modal.hide();
					}
            
                }).error(function (error) {
					console.log(error);
                    ons.notification.alert({
                        message: 'Internet connection offline. Please check internet connection!',
                        modifier: 'material'
                    });
					
					$scope.isFetching = false;
					modal.hide();
                });

            }

        }
		
		$scope.logout = function () {
			
                //localStorage.clearAll();
                //window.location = '/signin';
            appNavigator.resetToPage('signin.html',{animation:  "fade"});
            };
		
        $scope.setActiveTab = function (category) {

            if (category === "Assigments")
                return true;
        }
		
//		$scope.userlocation = function () {
//			navigator.geolocation.getCurrentPosition(function (position) {
//				
//				$scope.userLat = position.coords.latitude;
//                $scope.userLng = position.coords.longitude;
//                console.log($scope.userLat);
//                console.log($scope.userLng);
//				
//				var latlng = new google.maps.LatLng($scope.userLat, $scope.userLng);
//				var geocoder = geocoder = new google.maps.Geocoder();
//				geocoder.geocode({ 'latLng': latlng }, function (results, status) {
//					if (status == google.maps.GeocoderStatus.OK) {
//						if (results[1]) {
//							// alert("Location: " + results[1].formatted_address);
//							ons.notification.alert({
//								message: 'Location! ' + results[1].formatted_address,
//								modifier: 'material'
//							});
//						}
//					}
//				});
//				$scope.applicantDetails.userLat = $scope.userLat;
//                $scope.applicantDetails.userLng = $scope.userLng;
//				
//                var appId = window.localStorage.getItem("appId");
//				var db = window.sqlitePlugin.openDatabase({
//					name: 'indigentdb.db',
//					location: 'default'
//				});
//				db.transaction(function (transaction) {
//                console.log(appId);
//               
//                var query = "UPDATE assignment SET objectString = ? WHERE id = ?";
//					
//					transaction.executeSql(query, [JSON.stringify($scope.applicantDetails), appId], function (tx, result) {
//						console.log("insertId: " + result.insertId);
//						console.log("rowsAffected: " + result.rowsAffected);
//						console.log(result);
//                    
//                    },
//                    function (tx, error) {
//                        console.log('UPDATE error: ' + error.message);
//                    });
//				}, function (error) {
//                console.log('transaction error: ' + error.message);
//            });
//            $scope.isFetching = false;
//            modal.hide();
//            }, function (error) {
//
//                console.log("Couldn't get the location of the user.");
//
//                ons.notification.alert({
//                    message: 'Please enable your GPS and try again.! ' + error.message,
//                    modifier: 'material'
//                });
//
//                console.log(error.code);
//
//            }, {
//                maximumAge: Infinity,
//                timeout: 60000,
//                enableHighAccuracy: true
//            });
//
//        }
        
        
   

      
//
//    
//        
//        function onSuccess(position) {
//         alert('Latitude: '          + position.coords.latitude          + '\n' +
//              'Longitude: '         + position.coords.longitude         + '\n' +
//              'Altitude: '          + position.coords.altitude          + '\n' +
//              'Accuracy: '          + position.coords.accuracy          + '\n' +
//              'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
//              'Heading: '           + position.coords.heading           + '\n' +
//              'Speed: '             + position.coords.speed             + '\n' +
//              'Timestamp: '         + position.timestamp                + '\n');
//            
//    }

    // onError Callback receives a PositionError object
    //
//    function onError(error) {
//        alert('code: '    + error.code    + '\n' +
//              'message: ' + error.message + '\n');
//    }

    // Options: throw an error if no update is received every 30 seconds.
    //
//    var watchID = navigator.geolocation.watchPosition(onSuccess, onError, { maximumAge: 100000, timeout: 5000, enableHighAccuracy: true  });
 
       
   
    
    
             
//        $scope.userlocation = function () {
//            
//            $scope.isFetching = true;
//				$rootScope.didYouKnowMessage = loadingMessageService.showMessage();
//				modal.show();
//
//            navigator.geolocation.getCurrentPosition(function (position) {
//
//                $scope.userLat = position.coords.latitude;
//                $scope.userLng = position.coords.longitude;
//                console.log($scope.userLat);
//                console.log($scope.userLng);
//                
//           
////            var latlng = new google.maps.LatLng($scope.userLat, $scope.userLng);
////            var geocoder = geocoder = new google.maps.Geocoder();
////            geocoder.geocode({ 'latLng': latlng }, function (results, status) {
////                if (status == google.maps.GeocoderStatus.OK) {
////                    if (results[1]) {
////                       // alert("Location: " + results[1].formatted_address);
////                        
////                         ons.notification.alert({
////                    message: 'Location! ' + results[1].formatted_address,
////                    modifier: 'material'
////                });
////                        
////                        
////                        
////                    }
////                }
////            });
////        
//                
//                
//                
////                
//                var appId = window.localStorage.getItem("appId");
//			
//                 $scope.applicantDetails.indigentApplicationDetails.userLat = $scope.userLat;
//            $scope.applicantDetails.indigentApplicationDetails.userLng = $scope.userLng;
//
//                
//                
//			
//            var db = window.sqlitePlugin.openDatabase({
//                name: 'indigentdb.db',
//                location: 'default'
//            });
//
//            db.transaction(function (transaction) {
//                console.log(appId);
//               
//                var query = "UPDATE assignment SET objectString = ? WHERE id = ?";
//
//
//                transaction.executeSql(query, [JSON.stringify($scope.applicantDetails), appId], function (tx, result) {
//                        console.log("insertId: " + result.insertId);
//                        console.log("rowsAffected: " + result.rowsAffected);
//                    console.log(result);
//                    
//                    },
//                    function (tx, error) {
//                        console.log('UPDATE error: ' + error.message);
//                    });
//            }, function (error) {
//                console.log('transaction error: ' + error.message);
//            }, function () {
//                console.log(alert('Location Updated successfully'));
//            });
//            $scope.isFetching = false;
//            modal.hide();
//                
//
//            }, function (error) {
//
//                console.log("Couldn't get the location of the user.");
//
//
//                ons.notification.alert({
//                    message: 'Please enable you GPS and try again.! ' + error.message,
//                    modifier: 'material'
//                });
//
//                console.log(error.code);
//
//            }, {
//                maximumAge: Infinity,
//                timeout: 60000,
//                enableHighAccuracy: true
//            });
//
//        }
        
        
        
        
        
        
        // testing geoFire and mongoDB
        // Throw an error if no update is received every 30 seconds
        var options = { timeout: 30000 };
        watchID = navigator.geolocation.watchPosition(onSuccess, onError, options);
        
        
         
     // onSuccess Geolocation
    // getting the current location 
    function onSuccess(position) {
        var element = document.getElementById('geolocation');
//        element.innerHTML = 'Latitude: '  + position.coords.latitude      + '<br />' +
//                            'Longitude: ' + position.coords.longitude     + '<br />' ;
//                            '<hr />'      + element.innerHTML;
        console.log(position);
        
        
   

        
        // saving the coords on mongodb
        
        
        var options = {};
        options.FieldWorkerName = "Felicia";
        options.latitude = position.coords.latitude;
        options.longitude = position.coords.longitude;

        console.log(options);
        var url = 'http://192.168.1.104:3000/api/FieldWorkerLocations';

                                       
        $http.post(url, options).success(function (data) {


            console.log(data);


        }).error(function (data, status, headers, config) {

            $scope.isFetching = false;
            modal.hide();

            ons.notification.alert({
                message: JSON.stringify('Something went wrong, coords are not saved '),
                modifier: 'material'
            });

        });

        
        //geofire
//     Create a Firebase reference where GeoFire will store its information
        var firebaseRef = new Firebase("https://onesignalexample-11e3c.firebaseio.com/");

        // Create a GeoFire index
        var geoFire = new GeoFire(firebaseRef);

        var ref = geoFire.ref();  // ref === firebaseRef
        
        
        // sending coords to Firebase function (tx, results)
        
        geoFire.set("fieldworker", [position.coords.latitude, position.coords.longitude]),function () {
                
            console.log("Provided key has been added to GeoFire");
        }, function (error) {
            console.log("Error: " + error);
        };
        
        
        // getting current fieldworker location on GeoFire
        
        var ref = new Firebase("https://onesignalexample-11e3c.firebaseio.com/");

        ref.child('fieldworker').on("value", function (snapshot) {
            console.log(snapshot.val()); // here's your data object
        });
        
    }

    // onError Callback receives a [PositionError](PositionError/positionError.html) object
    //
    function onError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }
        
        
        // Getting coords from mongodb 
        $scope.Markers = [];

    
            $scope.API = 'http://192.168.1.104:3000/api/FieldWorkerLocations';
            //           
            $scope.API = $scope.API;

            console.log($scope.API);


            $http.get($scope.API).success(function (data, error) {
                
                // check if the server is up

                if (!error) {

                    console.log('get', data);
                    console.log(error);

                    alert('Server is currently down:');

                    throw error;

                } else {
                    console.log("server is ohk");

                    //  return data from mongodb
                    console.log(data);
                    $rootScope.assignmentList = data;
                    $scope.Markers = data;
                    console.log($scope.Markers);
                    
                    
                    
                    //Setting the Map options.
                $scope.MapOptions = {
                    center: new google.maps.LatLng($scope.Markers[0].latitude, $scope.Markers[0].longitude),
                    zoom: 8,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                    
                   
                    //Initializing the InfoWindow, Map and LatLngBounds objects.
                    $scope.InfoWindow = new google.maps.InfoWindow();
                    $scope.Latlngbounds = new google.maps.LatLngBounds();
                    $scope.Map = new google.maps.Map(document.getElementById("dvMap"), $scope.MapOptions); 
                    
                    
                    
                    
                         //Looping through the Array and adding Markers.
                    for (var i = 0; i < $scope.Markers.length; i++) {
                    var data = $scope.Markers[i];
                    var myLatlng = new google.maps.LatLng(data.latitude, data.longitude);

                    console.log($scope.Markers[i]);

                //Initializing the Marker object.
                var marker = new google.maps.Marker({
                    position: myLatlng,
                    map: $scope.Map,
                    title: data.title
                });

                //Adding InfoWindow to the Marker.
                (function (marker, data) {
                    google.maps.event.addListener(marker, "click", function (e) {
                        $scope.InfoWindow.setContent("<div style = 'width:200px;min-height:40px'>" + data.FieldWorkerName + "</div>");
                        $scope.InfoWindow.open($scope.Map, marker);
                    });
                })(marker, data);

                //Plotting the Marker on the Map.
                $scope.Latlngbounds.extend(marker.position);
            }

            //Adjusting the Map for best display.
            $scope.Map.setCenter($scope.Latlngbounds.getCenter());
            $scope.Map.fitBounds($scope.Latlngbounds);
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    

                   
                }

            }).error(function (data, status, headers, config) {
                console.log(data + " header: " + status + " config :" + config)
                $scope.isFetching = false;
                modal.hide();

                ons.notification.alert({
                    message: 'Error Check your internet connection',
                    title: 'Indigent App'
                });

            });

       
        
        //Plotting the map from mongodb coords 
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
         $scope.userlocation = function () {
             
            $scope.isFetching = true;
				$rootScope.didYouKnowMessage = loadingMessageService.showMessage();
				modal.show();
				
				
				
				var appId = window.localStorage.getItem("appId");

            	navigator.geolocation.getCurrentPosition(function (position) {

                $scope.userLat = position.coords.latitude;
                $scope.userLng = position.coords.longitude;
                $scope.location = ($scope.userLat + " ," + $scope.userLng); 
                console.log($scope.userLat);
                console.log($scope.userLng);
                
           
           /* var latlng = new google.maps.LatLng($scope.userLat, $scope.userLng);
            var geocoder = geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[1]) {
                       // alert("Location: " + results[1].formatted_address);
                        $scope.location = results[1].formatted_address;
                        console.log($scope.location);
                         ons.notification.alert({
                    message: 'Location! ' + results[1].formatted_address,
                    modifier: 'material'
                });
				}*/
                        
                        
                        
                    
            
                
                $scope.applicantDetails.indigentApplicationDetails.location = $scope.location;
                console.log($scope.location);
			
                $scope.applicantDetails.indigentApplicationDetails.userLat = $scope.userLat;
                $scope.applicantDetails.indigentApplicationDetails.userLng = $scope.userLng;
			
			
            var db = window.sqlitePlugin.openDatabase({
                name: 'indigentdb.db',
                location: 'default'
            });

            db.transaction(function (transaction) {
                console.log(appId);
               
                var query = "UPDATE assignment SET objectString = ? WHERE id = ?";


                transaction.executeSql(query, [JSON.stringify($scope.applicantDetails), appId], function (tx, result) {
                        console.log("insertId: " + result.insertId);
                        console.log("rowsAffected: " + result.rowsAffected);
                    console.log(result);
                    
                    },
                    function (tx, error) {
                        console.log('UPDATE error: ' + error.message);
                    });
            }, function (error) {
                console.log('transaction error: ' + error.message);
				/*db.close(function () {
					console.log("DB closed!");
				});*/
            }, function () {
                console.log(alert('Location Updated successfully'));
				/*db.close(function () {
					console.log("DB closed!");
				});*/
            });
            $scope.isFetching = false;
            modal.hide();
             /*      }
            });
         */

            }, function (error) {

                console.log("Couldn't get the location of the user.");


                ons.notification.alert({
                    message: 'Please enable you GPS and try again.! ' + error.message,
                    modifier: 'material'
                });

                console.log(error.code);

            }, {
                maximumAge: Infinity,
                timeout: 60000,
                enableHighAccuracy: true
            });

        }
        
        
         $scope.setApplicationUnailable = function () {
            
            var declinedReason;
		
               
                
				
                if ($scope.declinedReason == null || $scope.declinedReason == "" || $scope.declinedReason == undefined) {
					
					ons.notification.alert({
						message: 'Details required',
						title: 'Indigent App'
					});
						$scope.isFetching = false;
						modal.hide();
				} else {
					
					
					$scope.isFetching = true;
					$rootScope.didYouKnowMessage = loadingMessageService.showMessage();
					modal.show();

					$scope.username = window.localStorage.getItem("username");
					var appId = window.localStorage.getItem("appId");

					var applicationRefNo = window.localStorage.getItem("applicationRefNo");
					
					$scope.API = appConfig.emmupdatefieldworkerapi;
					$scope.API = $scope.API + '{"taskStatus":"Rejected","applicationId":"' + applicationRefNo + '","fieldWorkerRejectionRemarks":"' + $scope.declinedReason  + '"}';
                    
                   
                    
                    
                    
                    
                    
//                    console.log($scope.API);
//
//					$http.get($scope.API).success(function (data) {
//                        console.log(data);
//                        
//                        
////					
//
//								var db = window.sqlitePlugin.openDatabase({
//									name: 'indigentdb.db',
//									location: 'default'
//								});
//                                
//                                  db.transaction(function (transaction) {
//                                console.log(appId);
//
//								var query = "DELETE from assignment WHERE id='" + appId + "'"
//								
//
//                                transaction.executeSql(query, [], function (tx, result) {
//									console.log(result);
//									var db = window.sqlitePlugin.openDatabase({
//										name: 'indigentdb.db',
//										location: 'default'
//									});
//									$scope.username = window.localStorage.getItem("username");
//									//alert('Deleted successfully');
//									db.transaction(function (transaction) {
//									//select from table assignment
//									var query = "SELECT * FROM assignment WHERE status ='" + 'Accepted' + "' AND fieldWorkerID =?";
//
//									transaction.executeSql(query, [$scope.username], function (tx, results) {
//
//										//console.log($scope.acceptedList); 
//										for (var i = 0; i < results.rows.length; i++) {
//											$scope.acceptedList.push(JSON.parse(results.rows.item(i).objectString));
//										}
//
//									}, null);
//								});
//									db.transaction(function (transaction) {
//									//select from table assignment
//									var query = "SELECT * FROM assignment WHERE status ='" + 'Closed' + "' AND fieldWorkerID =?";
//
//									transaction.executeSql(query, [$scope.username], function (tx, results) {
//
//											for (var i = 0; i < results.rows.length; i++) {
//												$scope.closedList.push(JSON.parse(results.rows.item(i).objectString));
//											}
//
//											console.log($scope.closedList);
//
//										}, null);
//									});
//									db.transaction(function (transaction) {
//										//select from table assignment
//										var query = "SELECT * FROM assignment WHERE status ='" + 'Rejected' + "' AND fieldWorkerID =?";
//
//										transaction.executeSql(query, [$scope.username], function (tx, results) {
//
//											for (var i = 0; i < results.rows.length; i++) {
//												$scope.rejectedList.push(JSON.parse(results.rows.item(i).objectString));
//											}
//
//											console.log($scope.closedList);
//
//										}, null);
//									});
//								
//									appNavigator.pushPage('indigent-mainmenu.html', {
//										acceptedList: $scope.acceptedList,
//										rejectedList: $scope.rejectedList,
//										closedList: $scope.closedList
//									});
//
//								
//									$scope.isFetching = false;
//									modal.hide();
//                                    
//								}, function (error) {
//									console.log('transaction error: ' + error.message);
//								}, function () {
//									console.log('Deleted successfully');
//
//									
//									
//								
//									ons.notification.alert({
//									  message: 'Application  Deleted.',
//									  modifier: mod
//									});
//								});
//							
//							})
//
////							
////                                
////                                
//                                
//                                
//
//								$scope.isFetching = false;
//								modal.hide();
//
//
//                        
//                        
//                        
//                        
//					}).error(function (data, status, headers, config) {
//
//						$scope.isFetching = false;
//						modal.hide();
//						ons.notification.alert({
//							message: JSON.stringify('Something went wrong'),
//							modifier: 'material'
//						});
//					});
//                    
                    
                    $http.get($scope.API).success(function (data) {
						if (data.body = 'Success')
						{
							$scope.API = appConfig.emmapplicationdetails;
							$scope.API = $scope.API + applicationRefNo;
							console.log ($scope.API);
							
							$http.delete($scope.API).success(function(response){
								if (response.status == "success") {
									console.log('Removed from server');
									
									console.log('Application Deleted Server')

								var db = window.sqlitePlugin.openDatabase({
									name: 'indigentdb.db',
									location: 'default'
								});
                                    
                                    //delete this
                                    db.transaction(function (transaction) {
									//Update assignment status to Closed
									var executeQuery = "UPDATE assignment SET status = ? WHERE id = ?";
									transaction.executeSql(executeQuery, ["Rejected", appId], function (tx, result) {

										console.log("UpdateId: " + result.insertId + " -- probably 1");
										console.log("rowsAffected: " + result.rowsAffected + " -- should be 1");

										transaction.executeSql("select count(id) as cnt from assignment", [], function (tx, res) {
											console.log("res.rows.length: " + res.rows.length + " -- should be 1");
											console.log("res.rows.item(0).cnt: " + res.rows.item(0).cnt + " -- should be 1");
											//alert('Your application has been successfully submitted')
										});
										transaction.executeSql("SELECT * FROM assignment WHERE status ='" + 'Accepted' + "' AND fieldWorkerID =?", [$scope.username], function (tx, results) {

											//console.log($scope.acceptedList); 
											for (var i = 0; i < results.rows.length; i++) {
												$scope.acceptedList.push(JSON.parse(results.rows.item(i).objectString));
											}

											console.log($scope.acceptedList);
										})

										transaction.executeSql("SELECT * FROM assignment WHERE status ='" + 'Closed' + "' AND fieldWorkerID =?", [$scope.username], function (tx, results) {

											for (var i = 0; i < results.rows.length; i++) {
												$scope.closedList.push(JSON.parse(results.rows.item(i).objectString));
											}

											console.log($scope.closedList);

										});

										transaction.executeSql("SELECT * FROM assignment WHERE status ='" + 'Rejected' + "' AND fieldWorkerID =?", [$scope.username], function (tx, results) {

											for (var i = 0; i < results.rows.length; i++) {
												$scope.rejectedList.push(JSON.parse(results.rows.item(i).objectString));
											}

											console.log($scope.rejectedList);

										});
										
										transaction.executeSql("SELECT * FROM assignment WHERE status ='" + 'Declined' + "' AND fieldWorkerID =?", [$scope.username], function (tx, results) {

											for (var i = 0; i < results.rows.length; i++) {
												$scope.declinedList.push(JSON.parse(results.rows.item(i).objectString));
											}

											console.log($scope.rejectedList);

										});
									});

								},function(error){
                                    
//                                    
                                    
                                    
                                    
                                    
                                    
                                    
								console.log('Error Rejecting Assignment')
							}, function(){

                                        
                                        
                                        
//								console.log('Loading Pages...')
//								db.transaction(function (transaction) {
//									//select from table assignment
//									var query = "SELECT * FROM assignment WHERE status ='" + 'Accepted' + "' AND fieldWorkerID =?";
//
//									transaction.executeSql(query, [$scope.username], function (tx, results) {
//
//											//console.log($scope.acceptedList); 
//											for (var i = 0; i < results.rows.length; i++) {
//												$scope.acceptedList.push(JSON.parse(results.rows.item(i).objectString));
//											}
//
//										}, function(error){
//											console.log(error);
//										});
//									});
//								db.transaction(function (transaction) {
//								//select from table assignment
//
//								var query = "SELECT * FROM assignment WHERE status ='" + 'Closed' + "' AND fieldWorkerID =?";
//
//								transaction.executeSql(query, [$scope.username], function (tx, results) {
//
//									for (var i = 0; i < results.rows.length; i++) {
//										$scope.closedList.push(JSON.parse(results.rows.item(i).objectString));
//									}
//
//									console.log($scope.closedList);
//
//								}, null);
//							});
//								db.transaction(function (transaction) {
//									//select from table assignment
//									var query = "SELECT * FROM assignment WHERE status ='" + 'Rejected' + "' AND fieldWorkerID =?";
//
//									transaction.executeSql(query, [$scope.username], function (tx, results) {
//
//										for (var i = 0; i < results.rows.length; i++) {
//											$scope.rejectedList.push(JSON.parse(results.rows.item(i).objectString));
//										}
//
//										console.log($scope.closedList);
//
//									}, null);
//								});

//                                        
//                                        appNavigator.resetToPage('indegentacceptedlist.html', {
//										acceptedList: $scope.acceptedList,
//										rejectedList: $scope.rejectedList,
//										closedList: $scope.closedList,
////										declinedList: $scope.declinedList,
//										active: "accepted"
//									});
                                        
                                        
								
							});
									ons.notification.alert({
										message: 'Application has been successfully submitted',
										title: 'IndigentApp'
									});
                                    
                                    
                                    
                                    
                                    

									appNavigator.resetToPage('indegentacceptedlist.html', {
										acceptedList: $scope.acceptedList,
										rejectedList: $scope.rejectedList,
										closedList: $scope.closedList,
//										declinedList: $scope.declinedList,
										active: "accepted"
									});
									

									
                                    

									$scope.isFetching = false;
									modal.hide();
								} else {
									console.log('Not Removed');
									ons.notification.alert({
										message: JSON.stringify('Something went wrong'),
										modifier: 'material'
									});
									$scope.isFetching = false;
									modal.hide();
								}
							}).error(function (data, status, headers, config) {
						
									console.log(config); 
									console.log(data);
									//console.log(headers);

									ons.notification.alert({
										message: JSON.stringify('Application not Removed'),
										modifier: 'material'
									});
								$scope.isFetching = false;
								modal.hide();
								});
								

						} else {
							alert('Error Rejecting Assignment!!');
						}
					}).error(function (data, status, headers, config) {

						$scope.isFetching = false;
						modal.hide();
						ons.notification.alert({
							message: JSON.stringify('Something went wrong'),
							modifier: 'material'
						});
					});
                    
                    
                    
				}
             
        }
         
         
         
         
         
         
         
        
        $scope.unavailable = function () {
            
			
			var appId = window.localStorage.getItem("appId");
			
            var db = window.sqlitePlugin.openDatabase({
				name: 'indigentdb.db',
				location: 'default'
			});
				
            db.transaction(function (transaction) {
				console.log(appId);
                var query = "SELECT * from assignment WHERE id='" + appId + "'";

                transaction.executeSql(query, [], function (tx, result) {
                    if (result.rows.length > 0) {

                        $scope.applicantDetails = JSON.parse(result.rows.item(0).objectString);
                        console.log($scope.applicantDetails);

                        $scope.isFetching = false;
                        modal.hide();
                    } else {
                        console.log("No results found");

                        $scope.isFetching = false;
                        modal.hide();
                    }
                }, null);
			}, function (error){
				console.log(error);
			}, function (){
				appNavigator.pushPage('unavailable.html', {
					applicantDetails: JSON.stringify($scope.applicantDetails)
				});
			});
              
            
        }
        
		
		$scope.acceptedList = [];

        $scope.loadAssigments = function () {

            $scope.isFetching = true;
            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();
			
			$scope.username = window.localStorage.getItem("username");

			$scope.API = appConfig.emmupdateherokuapp;
//             $scope.API = $scope.API + '/New/' + $scope.username;
            
            //testing loopback
          $scope.API = $scope.API;

			console.log($scope.API);
            
			
				$http.get($scope.API).success(function (data,error) {

					if (!error) {

							console.log('get', data);
							console.log(error);

							alert('Server is currently down:' );

							throw error;


						} else {
							console.log("server is ohk");


					console.log(data);
					$rootScope.assignmentList = data;

					$scope.isFetching = false;
					modal.hide();
							  }

				}).error(function (data, status, headers, config) {
					console.log(data + " header: "+status+" config :"+config)
					$scope.isFetching = false;
					modal.hide();

					ons.notification.alert({
						message: 'Error Check your internet connection',
						title: 'Indigent App'
					});

				});
			
        }
        
        
        
        

		$scope.message1 = function () {
			console.log('refreshhh');
		}

        $scope.loadAccepted = function () {
			
			$scope.isFetching = true;
            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();
            
            
            
            var page = appNavigator.getCurrentPage();
            $scope.acceptedList = page.options.acceptedList;
			// load from sqllite

			$scope.isFetching = false;
			modal.hide();
		}
		
        $scope.closedList = [];
		
		$scope.loadClosed = function () {

            $scope.isFetching = true;
            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();
            // load from sqllite

            var userdata = {};
			
			
			var page = appNavigator.getCurrentPage();
			$scope.closedList = page.options.closedList;
			
			$scope.isFetching = false;
            modal.hide();
        }
		
        $scope.loadRejectedDetails = function (rejected) {
            //$scope.id = closed._id;
            appNavigator.pushPage('rejectedDetails.html', {
                id: rejected._id,
                applicationRefNo: rejected.indigentApplicationDetails.indigentApplicationHeader.applicationRefNo,
				applicantDetails: rejected
            });

        }
		
        $scope.loadClosedDetails = function (index, closed) {
            $scope.id = closed._id;
            appNavigator.pushPage('acceptedDetails.html', {
                id: closed._id,
                applicationRefNo: closed.indigentApplicationDetails.indigentApplicationHeader.applicationRefNo
            });
        }
		
		$scope.loadDeclinedDetails = function (declined) {
            $scope.id = declined._id;
            appNavigator.pushPage('declinedDetails.html', {
                id: declined._id,
                applicationRefNo: declined.indigentApplicationDetails.indigentApplicationHeader.applicationRefNo
            });
        }
		
        $scope.loadDeclined = function () {
			$scope.isFetching = true;
            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();
            // load from sqllite
            var userdata = {};
			
			var page = appNavigator.getCurrentPage();
			$scope.declinedList = page.options.declinedList;
			
			$scope.isFetching = false;
            modal.hide();

           /* // Cordova is ready
			var db = window.sqlitePlugin.openDatabase({
				name: 'indigentdb.db',
				location: 'default'
			});
			
			db.transaction(function (transaction) {
				$scope.declinedList = [];
				//select from table assignment
				var query = "SELECT * FROM assignment WHERE status ='" + 'Declined' + "' AND fieldWorkerID =?";
				
				transaction.executeSql(query, [$scope.username], function (tx, results) {
					
						for (var i = 0; i < results.rows.length; i++) {
								$scope.declinedList.push(JSON.parse(results.rows.item(i).objectString));
							}
					
					console.log($scope.declinedList);
					
					$scope.isFetching = false;
					modal.hide();
				}, null);
			});*/
		}
		
        $scope.rejectedList = [];
        
		/*		$scope.loadRejected = function () {
			$scope.isFetching = true;
            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();
            
            
            var page = appNavigator.getCurrentPage();
            console.log(page.options.rejectedList);
            $scope.rejectedList = page.options.rejectedList;
            
            
			// load from sqllite

            var userdata = {};

            // Cordova is ready
			var db = window.sqlitePlugin.openDatabase({
				name: 'indigentdb.db',
				location: 'default'
			});
			
			db.transaction(function (transaction) {
				
				//select from table assignment
				var query = "SELECT * FROM assignment WHERE status ='" + 'Rejected' + "'";
				
				transaction.executeSql(query, [], function (tx, results) {
					$scope.isFetching = false;
            		modal.hide();
					if (results.rows.length > 0)
					{
						
					for (var i = 0; i < results.rows.length; i++) {
							$scope.rejectedList.push(JSON.parse(results.rows.item(i).objectString));
						}
						//alert("declined loaded");
					}
					
				}, null);
			});
					$scope.isFetching = false;
					modal.hide();
        }*/
        
        $scope.loadRejected = function () {
            $scope.isFetching = true;
            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();
            
            var page = appNavigator.getCurrentPage();
            $scope.rejectedList = page.options.rejectedList;
            
			$scope.isFetching = false;
			modal.hide();
        }

        $scope.loadAssigmentDetails = function (index, assignment) {
			$scope.isFetching = true;
            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();
			
            $scope.id = assignment._id;
            appNavigator.pushPage('assignmentDetails.html', {
                id: assignment._id,
                applicationRefNo: assignment.indigentApplicationDetails.indigentApplicationHeader.applicationRefNo,
				applicantDetails: assignment
            });
			$scope.isFetching = false;
            modal.hide();

        }
		
		$scope.loadDeleteDetails = function (closed) {
			$scope.isFetching = true;
            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
			
            modal.show();
			console.log(closed);
            $scope.id = closed._id;
            appNavigator.pushPage('deleteDetails.html', {
                id: closed._id,
                applicationRefNo: closed.indigentApplicationDetails.indigentApplicationHeader.applicationRefNo,
				applicantDetails: closed
            });
			
			$scope.isFetching = false;
            modal.hide();

        }
		
		
		$scope.loadEditAssigmentDetails = function (index, assignment) {
            $scope.id = assignment._id;
            appNavigator.pushPage('editAssignmentDetails.html', {
                id: assignment._id,
                applicationRefNo: assignment.indigentApplicationDetails.indigentApplicationHeader.applicationRefNo
            });

        }

        $scope.showAssigmentDetails = function () {

            $scope.isFetching = true;
            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();

            var page = appNavigator.getCurrentPage();
            

			$scope.API = appConfig.emmapplicationdetails;
            $scope.API = $scope.API + page.options.applicantDetails.id;
			
            console.log(page.options.id);
			console.log($scope.API);
            window.localStorage.setItem("appId", page.options.applicantDetails.id);

            window.localStorage.setItem("applicationRefNo", page.options.applicationRefNo);

            $http.get($scope.API).success(function (data) {
				
                $scope.applicantDetails = data;
				console.log($scope.applicantDetails);
				
                $scope.isFetching = false;
                modal.hide();

            }).error(function (data, status, headers, config) {

                

                ons.notification.alert({
                    message: JSON.stringify('Something went wrong '),
                    modifier: 'material'
                });

            });

			$scope.isFetching = false;
            modal.hide();
        }
		
		$scope.showDeleteDetails = function () {

//            $scope.isFetching = true;
//            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
//            modal.show();

            var page = appNavigator.getCurrentPage();
			//console.log(page);
			
            window.localStorage.setItem("appId", page.options.id);
			
			$scope.applicantDetails = page.options.applicantDetails;
			//window.localStorage.setItem("applicantDetails", JSON.stringify($scope.applicantDetails));
			/*
			var db = window.sqlitePlugin.openDatabase({
				name: 'indigentdb.db',
				location: 'default'
			});
				
			db.transaction(function (transaction) {
				
				var query = "SELECT * from assignment WHERE id='" + page.options.id + "'";
				
				transaction.executeSql(query, [], function (tx, result) {
					if (result.rows.length > 0) {

                            $scope.applicantDetails = JSON.parse(result.rows.item(0).objectString);
                            console.log(JSON.stringify($scope.applicantDetails));
                        } else {
                            alert("No results found");
                        }
                    }, null);
                });
			*/
			$scope.isFetching = false;
            modal.hide();
        }
		
		$scope.showAcceptedDetails = function () {

//            $scope.isFetching = true;
//            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
//            modal.show();

            var page = appNavigator.getCurrentPage();
			//console.log(page);
			
            window.localStorage.setItem("appId", page.options.id);
			
			$scope.applicantDetails = JSON.parse(page.options.acceptedDetails);
			window.localStorage.setItem("applicantDetails", JSON.stringify($scope.applicantDetails));
			/*
			var db = window.sqlitePlugin.openDatabase({
				name: 'indigentdb.db',
				location: 'default'
			});
				
			db.transaction(function (transaction) {
				
				var query = "SELECT * from assignment WHERE id='" + page.options.id + "'";
				
				transaction.executeSql(query, [], function (tx, result) {
					if (result.rows.length > 0) {

                            $scope.applicantDetails = JSON.parse(result.rows.item(0).objectString);
                            console.log(JSON.stringify($scope.applicantDetails));
                        } else {
                            alert("No results found");
                        }
                    }, null);
                });
			*/
			$scope.isFetching = false;
            modal.hide();
        }
		
		$scope.loadAcceptedDetails = function (accepted) {

//			console.log(JSON.stringify(accepted));
            $scope.id = accepted._id;
            appNavigator.pushPage('acceptedDetails.html', {
                id: accepted._id,
                applicationRefNo: accepted.indigentApplicationDetails.indigentApplicationHeader.applicationRefNo,
				acceptedDetails: JSON.stringify(accepted)
                
            });

        }
		$scope.loadAcceptedDetailsSign = function () {
			var page = appNavigator.getCurrentPage();
			var appId = window.localStorage.getItem("appId");
			var db = window.sqlitePlugin.openDatabase({
				name: 'indigentdb.db',
				location: 'default'
			});
				
			db.transaction(function (transaction) {
				
				var query = "SELECT * from assignment WHERE id='" + appId + "'";
				
				transaction.executeSql(query, [], function (tx, result) {
					if (result.rows.length > 0) {

                            $scope.applicantDetails = JSON.parse(result.rows.item(0).objectString);
                            console.log(JSON.stringify($scope.applicantDetails));
                        } else {
                            console.log("No results found");
                        }
                    }, null);
                }, function(error){
				//alert('error retrieving application')
				 ons.notification.alert({
                    message: 'Error retrieving application',
                    modifier: 'material'
                });
				/*db.close(function () {
					console.log("DB closed!");
				});*/
			}, function(){
				console.log($scope.applicantDetails);
				//$scope.id = $scope.applicantDetails._id;
				appNavigator.resetToPage('acceptedDetails.html', {
					//id: $scope.applicantDetails._id,
					applicationRefNo: $scope.applicantDetails.indigentApplicationDetails.indigentApplicationHeader.applicationRefNo,
					acceptedDetails: JSON.stringify($scope.applicantDetails)
				});
				
				/*db.close(function () {
					console.log("DB closed!");
				});*/
			});
        }
		
		$scope.showEditAssigmentDetails = function () {

            $scope.isFetching = true;
            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();

            var page = appNavigator.getCurrentPage();

            $scope.API = 'https://munipoiapp.herokuapp.com/api/assigments/' + page.options.id;

            window.localStorage.setItem("appId", page.options.id);

            window.localStorage.setItem("applicationRefNo", page.options.applicationRefNo);

            $http.get($scope.API).success(function (data) {

                $scope.applicantDetails = data;
                window.localStorage.setItem("applicantDetails", JSON.stringify($scope.applicantDetails));

                $scope.isFetching = false;
                modal.hide();

            }).error(function (data, status, headers, config) {

                $scope.isFetching = false;
                modal.hide();

                ons.notification.alert({
                    message: JSON.stringify('Something went wrong'),
                    modifier: 'material'
                });

            });

        }
		
		$scope.showClosedDetails = function () {

            $scope.isFetching = true;
            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();

            var page = appNavigator.getCurrentPage();
			//console.log(page);	
            window.localStorage.setItem("appId", page.options.id);
			
			var db = window.sqlitePlugin.openDatabase({
				name: 'indigentdb.db',
				location: 'default'
			});
				
			db.transaction(function (transaction) {
				
				var query = "SELECT * from assignment WHERE id='" + page.options.id + "'";
				
				transaction.executeSql(query, [], function (tx, result) {
					if (result.rows.length > 0) {

                            $scope.applicantDetails = JSON.parse(result.rows.item(0).objectString);
                            console.log(JSON.stringify($scope.applicantDetails));

                            $scope.isFetching = false;
                            modal.hide();
                        } else {
                            console.log("No results found");

                            $scope.isFetching = false;
                            modal.hide();
                        }
                    }, null);
                }, function(error){
				console.log("Error occurred : " + error);
				/*db.close(function () {
					console.log("DB closed!");
				});*/
			}, function (){
					console.log('Success');
					/*db.close(function () {
						console.log("DB closed!");
					});*/
				})
			
			$scope.isFetching = false;
            modal.hide();
        }
		
		$scope.showDeclinedDetails = function () {
			$scope.isFetching = true;
            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();

            var page = appNavigator.getCurrentPage();
			console.log(page);	
            window.localStorage.setItem("appId", page.options.id);
			
			var db = window.sqlitePlugin.openDatabase({
				name: 'indigentdb.db',
				location: 'default'
			});
				
			db.transaction(function (transaction) {
				
				var query = "SELECT * from assignment WHERE id='" + page.options.id + "'";
				
				transaction.executeSql(query, [], function (tx, result) {
					if (result.rows.length > 0) {

                            $scope.applicantDetails = JSON.parse(result.rows.item(0).objectString);
                            console.log($scope.applicantDetails);

                            $scope.isFetching = false;
                            modal.hide();
                        } else {
                            console.log("No results found");

                            $scope.isFetching = false;
                            modal.hide();
                        }
                    }, null);
                }, function(error) {
				/*db.close(function () {
					console.log("DB closed!");
				});*/
			}, function (){
				console.log('success');
				/*db.close(function () {
					console.log("DB closed!");
				});*/
			});
			$scope.isFetching = false;
            modal.hide();
		}
		
		$scope.prompt = function (){
			function onDeviceReady() {
			console.log('hello');
			navigator.notification.prompt('Please enter text:', promptCallback, 'Prompt dialog box',
                              [rejectReasonList.name], 'default text');
			}
		}
		var imageList = [];
		/*
		$scope.saveLivingConditions = function () {
			$scope.isFetching = true;
			$rootScope.didYouKnowMessage = loadingMessageService.showMessage();
			modal.show();
			
			imagelist[0] = $scope.image1.replace("data:image/jpeg;base64,","");
			imagelist[1] = $scope.image2.replace("data:image/jpeg;base64,","");
			imagelist[2] = $scope.image3.replace("data:image/jpeg;base64,","");
			imagelist[3] = $scope.image4.replace("data:image/jpeg;base64,","");
			imagelist[4] = $scope.image5.replace("data:image/jpeg;base64,","");
			imagelist[5] = $scope.image6.replace("data:image/jpeg;base64,","");
			console.log(imageslist);
			for (var i = 0; i < 6; i++) {
				if (imagelist[i] != undefined || imagelist[i] != null || imagelist[i] != "") {
					if(i == 0) {
						imageList.push(imagelist[i]);
					} else if (i == 1) {
						imageList.push(imagelist[i]);
					} else if(i == 2) {
						imageList.push(imagelist[i]);
					} else if(i == 3) {
						imageList.push(imagelist[i]);
					} else if(i == 4) {
						imageList.push(imagelist[i]);
					} else if(i == 5) {
						imageList.push(imagelist[i]);
					}
					else{
						alert('NO images captured');
					}
				}
			}
				
			//console.log(imagelist);
			
			var page = appNavigator.getCurrentPage();
			
			var db = window.sqlitePlugin.openDatabase({
				name: 'indigentdb.db',
				location: 'default'
			});
			
			setTimeout(function() {
				
			db.transaction(function (transaction) {
				
				var query = "SELECT * from assignment WHERE id='" + page.options.appId + "'";
				
				transaction.executeSql(query, [], function (tx, result) {
					if (result.rows.length > 0) {

                            $scope.applicantDetails = JSON.parse(result.rows.item(0).objectString);
                            console.log(JSON.stringify($scope.applicantDetails));

                        } else {
                            alert("No results found");

                        }
                    }, function (error){
						alert('Error Retrieving original application Details');
						console.log(error);
					}, function (){
						alert("results");
					});
                }, function (error){
				alert('Error Retrieving original application Details');
				console.log(error);
				db.close(function () {
				console.log("DB closed!");
			}, function (error) {
				console.log("Error closing DB:" + error.message);
			});
			}, function (){
				
				console.log($scope.comment);
				if (imageList.length < 3) {
					alert("Can not save less than 3 Images");
				} else if ($scope.comment == "" || $scope.comment == undefined || $scope.comment.length == 0){
					alert('Comments Undefined!!');
				} else {

					var appId = window.localStorage.getItem("appId");

					$scope.applicantDetails.indigentApplicationDetails.imageList = imageList;
					$scope.applicantDetails.indigentApplicationDetails.imageNameList = imagesName;
					$scope.applicantDetails.indigentApplicationDetails.comment = $scope.comment;

					db.transaction(function (transaction) {
							$scope.tasks = [];

							var query = "UPDATE assignment SET objectString = ? WHERE id=?";

							transaction.executeSql(query, [JSON.stringify($scope.applicantDetails), appId], function (tx, results) {

								$scope.livingConditions = 'Valid';
							}, null);
					},function (error) {
						console.error(error);
						db.close(function () {
							console.log("DB closed!");
						});
					}, function (){
						alert('Updated successfully');
						
						db.close(function () {
							console.log("DB closed!");
						});
						
						appNavigator.pushPage('household.html', {
							appId: appId,
							applicantDetails: JSON.stringify($scope.applicantDetails)
						});
					});
				}
			});
				
			$scope.isFetching = false;
			modal.hide();
				
				}, 10000);
		}
		*/
		$scope.saveLivingConditions = function () {
			var page = appNavigator.getCurrentPage();
				
			$scope.applicantDetails = JSON.parse(page.options.applicantDetails);

			var appId = $scope.applicantDetails._id;
			console.log($scope.comment);
			
			if ($scope.applicantDetails.indigentApplicationDetails.imageList == undefined) {
				if (images.length < 3) {
					//alert("Can not save less than 3 Images");
					ons.notification.alert({
						message: 'Can not save less than 3 images',
						title: 'Indigent App'
					});
				} else if ($scope.comment == "" || $scope.comment == undefined || $scope.comment.length == 0) {
					//alert('Comments Undefined!!');
					ons.notification.alert({
						message: 'Comments Undefined!',
						title: 'Indigent App'
					});
				} else {
					$scope.isFetching = true;
					$rootScope.didYouKnowMessage = loadingMessageService.showMessage();
					modal.show();
					/*
					var page = appNavigator.getCurrentPage();

					$scope.applicantDetails = JSON.parse(page.options.applicantDetails);*/

					var appId = window.localStorage.getItem("appId");

					$scope.applicantDetails.indigentApplicationDetails.imageList = images;
					$scope.applicantDetails.indigentApplicationDetails.imageNameList = imagesName;
					$scope.applicantDetails.indigentApplicationDetails.comment = $scope.comment;
                    
                    $scope.applicantDetails.indigentApplicationDetails.fieldWorkerRemarks = $scope.comment;

					//console.log($scope.applicantDetails.indigentApplicationDetails.imageNameList);

					var db = window.sqlitePlugin.openDatabase({
						name: 'indigentdb.db',
						location: 'default'
					});

					db.transaction(function (transaction) {
							$scope.tasks = [];

							var query = "UPDATE assignment SET objectString = ? WHERE id=?";

							transaction.executeSql(query, [JSON.stringify($scope.applicantDetails), appId], function (tx, results) {

								ons.notification.alert({
									message: 'Updated Successfully',
									title: 'Indigent App'
								});
								$scope.isFetching = false;
								modal.hide();

								$scope.livingConditions = 'Valid';

								/*appNavigator.pushPage('household.html', {
									appId: appId,
									applicantDetails: JSON.stringify($scope.applicantDetails)
								});*/
								appNavigator.pushPage('applicationSign.html', {
									appId: appId, 
									acceptedDetails: $scope.applicantDetails
								});

							}, function (error) {
								console.error(error);

								$scope.isFetching = false;
								modal.hide();
							});
						});

				}
				$scope.isFetching = false;
				modal.hide();
			} else {
				$scope.isFetching = true;
				$rootScope.didYouKnowMessage = loadingMessageService.showMessage();
				modal.show();
				if (images.length < 1){
					/*appNavigator.pushPage('household.html', {
										appId: appId,
										applicantDetails: JSON.stringify($scope.applicantDetails)
									});*/
					appNavigator.pushPage('applicationSign.html', {
									appId: appId, 
									acceptedDetails: $scope.applicantDetails
								});
					$scope.isFetching = false;
								modal.hide();
				} else {
					for (var i = 0; i < 5; i++) {
						if (images[i] !== undefined) {
							if(i == 0) {
								$scope.applicantDetails.indigentApplicationDetails.imageList[i] = images[i];
								$scope.applicantDetails.indigentApplicationDetails.imageNameList[i] = "Image 1";
							} else if (i == 1) {
								$scope.applicantDetails.indigentApplicationDetails.imageList[i] = images[i];
								$scope.applicantDetails.indigentApplicationDetails.imageNameList[i] = "Image 2";
							} else if(i == 2) {
								$scope.applicantDetails.indigentApplicationDetails.imageList[i] = images[i];
								$scope.applicantDetails.indigentApplicationDetails.imageNameList[i] = "Image 3";
							} else if(i == 3) {
								$scope.applicantDetails.indigentApplicationDetails.imageList[i] = images[i];
								$scope.applicantDetails.indigentApplicationDetails.imageNameList[i] = "Image 4";
							} else if(i == 4) {
								$scope.applicantDetails.indigentApplicationDetails.imageList[i] = images[i];
								$scope.applicantDetails.indigentApplicationDetails.imageNameList[i] = "Image 5";
							} else if(i == 5) {
								$scope.applicantDetails.indigentApplicationDetails.imageList[i] = images[i];
								$scope.applicantDetails.indigentApplicationDetails.imageNameList[i] = "Image 6";
							}
							else{
								console.log('NO images captured');
							}
						}
					}


						/*
						var page = appNavigator.getCurrentPage();

						$scope.applicantDetails = JSON.parse(page.options.applicantDetails);*/

						var appId = window.localStorage.getItem("appId");

						console.log($scope.applicantDetails.indigentApplicationDetails.imageList);
						console.log($scope.applicantDetails.indigentApplicationDetails.imageNameList);
						$scope.applicantDetails.indigentApplicationDetails.comment = $scope.comment;

						//console.log($scope.applicantDetails.indigentApplicationDetails.imageNameList);

						var db = window.sqlitePlugin.openDatabase({
							name: 'indigentdb.db',
							location: 'default'
						});

						db.transaction(function (transaction) {
								$scope.tasks = [];

								var query = "UPDATE assignment SET objectString = ? WHERE id=?";

								transaction.executeSql(query, [JSON.stringify($scope.applicantDetails), appId], function (tx, results) {

									ons.notification.alert({
											message: 'Updated Successfully',
											title: 'Indigent App'
										});
									$scope.isFetching = false;
									modal.hide();

									$scope.livingConditions = 'Valid';

									appNavigator.pushPage('applicationSign.html', {
										appId: appId, 
										acceptedDetails: $scope.applicantDetails
									});
									
									
									/*appNavigator.pushPage('household.html', {
										appId: appId,
										applicantDetails: JSON.stringify($scope.applicantDetails)
									});*/

								}, function (error) {
									console.error(error);

									$scope.isFetching = false;
									modal.hide();
								});
							});
					$scope.isFetching = false;
								modal.hide();
				}
			}
        }
        /*$scope.showLivingConditionsDetails = function () {

            $scope.isFetching = true;
            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();

            var appId = window.localStorage.getItem("appId");

            $scope.API = 'https://munipoiapp.herokuapp.com/api/assigments/' + appId;

            console.log($scope.API);

            $http.get($scope.API).success(function (data) {

                $scope.livingConditions = data;

                $scope.isFetching = false;
                modal.hide();

            }).error(function (data, status, headers, config) {

                $scope.isFetching = false;
                modal.hide();

                ons.notification.alert({
                    message: JSON.stringify('Something went wrong'),
                    modifier: 'material'
                });

            });

        }*/
		
		/*
		$scope.showLivingConditionsDetails = function (applicantDetails) {

			$scope.isFetching = true;
            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();
			
			var db = window.sqlitePlugin.openDatabase({
				name: 'indigentdb.db',
				location: 'default'
			});
				
			db.transaction(function (transaction) {
				
				var query = "SELECT * from assignment WHERE id='" + page.options.id + "'";
				
				transaction.executeSql(query, [], function (tx, result) {
					if (result.rows.length > 0) {

                            $scope.applicantDetails = JSON.parse(result.rows.item(0).objectString);
                            console.log(JSON.stringify($scope.applicantDetails));

                            $scope.isFetching = false;
                            modal.hide();
                        } else {
                            alert("No results found");

                            $scope.isFetching = false;
                            modal.hide();
                        }
                    }, null);
                });
			
			console.log(applicantDetails);
            $scope.id = applicantDetails._id;
			
			if (applicantDetails.indigentApplicationDetails.imageList == undefined)
				{
					appNavigator.pushPage('livingconditions.html', {
						id: applicantDetails._id,
						applicationRefNo: $scope.applicantDetails.indigentApplicationDetails.indigentApplicationHeader.applicationRefNo,
						applicantDetails: JSON.stringify($scope.applicantDetails)
					});
				} else {
					appNavigator.pushPage('livingconditions.html', {
						id: applicantDetails._id,
						applicationRefNo: $scope.applicantDetails.indigentApplicationDetails.indigentApplicationHeader.applicationRefNo,
						applicantDetails: JSON.stringify($scope.applicantDetails),
						image1: 'data:image/jpeg;base64,' + applicantDetails.indigentApplicationDetails.imageList[0],
						image2: 'data:image/jpeg;base64,' + applicantDetails.indigentApplicationDetails.imageList[1],
						image3: 'data:image/jpeg;base64,' + applicantDetails.indigentApplicationDetails.imageList[2],
						image4: 'data:image/jpeg;base64,' + applicantDetails.indigentApplicationDetails.imageList[3],
						image5: 'data:image/jpeg;base64,' + applicantDetails.indigentApplicationDetails.imageList[4],
						image6: 'data:image/jpeg;base64,' + applicantDetails.indigentApplicationDetails.imageList[5],
						comment: applicantDetails.indigentApplicationDetails.comment
					});
				}
		
			
			
			$scope.applicantDetails = applicantDetails;
			console.log($scope.applicantDetails);
			appNavigator.pushPage('livingconditions.html', {
				applicantDetails: JSON.stringify(applicantDetails)
            });
			$scope.isFetching = false;
            modal.hide();
		}
		*/
		
		$scope.showLivingConditionsDetails = function (applicantDetails) {

			$scope.isFetching = true;
            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();
			
			var page = appNavigator.getCurrentPage();
			
			var db = window.sqlitePlugin.openDatabase({
				name: 'indigentdb.db',
				location: 'default'
			});
				
			db.transaction(function (transaction) {
				
				var query = "SELECT * from assignment WHERE id='" + page.options.id + "'";
				
				transaction.executeSql(query, [], function (tx, result) {
					if (result.rows.length > 0) {

                            $scope.applicantDetails = JSON.parse(result.rows.item(0).objectString);
                            console.log(JSON.stringify($scope.applicantDetails));

                            $scope.isFetching = false;
                            modal.hide();
                        } else {
                            console.log("No results found");

                            $scope.isFetching = false;
                            modal.hide();
                        }
                    }, null);
                });
			
			console.log(applicantDetails);
            $scope.id = $scope.applicantDetails._id;
			
			if (applicantDetails.indigentApplicationDetails.imageList == undefined)
				{
					appNavigator.pushPage('livingconditions.html', {
						id: applicantDetails._id,
						applicationRefNo: applicantDetails.indigentApplicationDetails.indigentApplicationHeader.applicationRefNo,
						applicantDetails: JSON.stringify(applicantDetails)
					});
				} else {
					appNavigator.pushPage('livingconditions.html', {
						id: $scope.applicantDetails._id,
						applicationRefNo: $scope.applicantDetails.indigentApplicationDetails.indigentApplicationHeader.applicationRefNo,
						applicantDetails: JSON.stringify($scope.applicantDetails),
						image1: 'data:image/jpeg;base64,' + applicantDetails.indigentApplicationDetails.imageList[0],
						image2: 'data:image/jpeg;base64,' + applicantDetails.indigentApplicationDetails.imageList[1],
						image3: 'data:image/jpeg;base64,' + applicantDetails.indigentApplicationDetails.imageList[2],
						image4: 'data:image/jpeg;base64,' + applicantDetails.indigentApplicationDetails.imageList[3],
						image5: 'data:image/jpeg;base64,' + applicantDetails.indigentApplicationDetails.imageList[4],
						image6: 'data:image/jpeg;base64,' + applicantDetails.indigentApplicationDetails.imageList[5],
						comment: applicantDetails.indigentApplicationDetails.comment
					});
				}
		
			
			/*
			$scope.applicantDetails = applicantDetails;
			console.log($scope.applicantDetails);
			appNavigator.pushPage('livingconditions.html', {
				applicantDetails: JSON.stringify(applicantDetails)
            });*/
			$scope.isFetching = false;
            modal.hide();
		}
		
		
		
		
        $scope.loadLivingConditions = function () {
			$scope.isFetching = true;
            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();
			
			var page = appNavigator.getCurrentPage();
			//console.log(page);
			//var comment;
			var appId = window.localStorage.getItem("appId");
			$scope.comment = page.options.comment;
			
			if ($scope.comment == '' || $scope.comment == undefined || $scope.comment == null)
			{
				console.log('Living Conditions Not Captured')
				
				$scope.applicantDetails = JSON.parse(page.options.applicantDetails);
				
				$scope.isFetching = false;
				modal.hide();
			}
			else{
				$scope.image1 = page.options.image1;
				$scope.image2 = page.options.image2;
				$scope.image3 = page.options.image3;
				$scope.image4 = page.options.image4;
				$scope.image5 = page.options.image5;
				$scope.image6 = page.options.image6;
				$scope.applicantDetails = JSON.parse(page.options.applicantDetails);
				
				$scope.isFetching = false;
				modal.hide();
			}
			
            
        }
		
		var verify= [];
		
		$scope.VerifyHouseMembers = function () {

            $scope.isFetching = true;
            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();

            var appId = window.localStorage.getItem("appId");
			
			$scope.householdDetail.isVerified = $scope.houseHoldMemberVerified;

            $scope.householdDetail.remarks = $scope.remark;
			
			var db = window.sqlitePlugin.openDatabase({
							name: 'indigentdb.db',
							location: 'default'
						});
				db.transaction(function (transaction) {
                $scope.tasks = $scope.applicantDetails;

                var query = "SELECT count(id) from verified SET objectString=? WHERE id=?";

                tx.executeSql(query, [JSON.stringify($scope.applicantDetails), appId], function (tx, result) {

                    console.log($scope.remark);
                    $scope.isFetching = false;
                    modal.hide();

                }, function (err) {
                    console.error(err);

                    $scope.isFetching = false;
                    modal.hide();
                });
            });
        }
		var capturedPhoto = 0;
		
		var images = [];
		var imagelist = [];
		var imagesName = [];
		
		var images1, images2,images3, images4, images5, images6, imageslist = {};
		
		/*
		function onPhotoFileSuccess(imageData) {
			//console.log("'" + imageData + "'");
			//console.log("'" + imageData + "'");
			imagelist.push("'" + imageData + "'");
			//console.log(imagelist);
			//console.log(imagelist);
			capturedPhoto++;
			
			b64toBlob(imageData, 'image/png', 512);
			
			
			
			if (capturedPhoto == 1)
                   { 
					   $scope.image1 = "data:image/jpeg;base64,"+imageData;
					   //images.push($scope.image1);
					   imagesName.push("Image 1");
					  images1 = '' + imageData + '';
					   images.push('' + imageData + '');
					   //console.log(images1);
				   }
                else if (capturedPhoto == 2)
                   { 
					   //console.log(JSON.stringify(imageData));
					   $scope.image2 = "data:image/jpeg;base64,"+imageData;
					   
					   images2 = '' + imageData + '';
					   images.push('' + imageData + '');
					   imagesName.push("Image 2");
					   
					   //console.log(image2);
					   //console.log(images);
				   }
                else if (capturedPhoto == 3)
					{
						$scope.image3 = "data:image/jpeg;base64,"+imageData;
						//console.log(imageData);
						
						images3 = '' + imageData + '';
						images.push('' + imageData + '');
						imagesName.push("Image 3");
					   
					   //console.log($scope.image3);
					}
                else if (capturedPhoto == 4)
					{
						$scope.image4 = "data:image/jpeg;base64," + imageData;
						images4 = '' + imageData + '';
						images.push('' + imageData + '');
						imagesName.push("Image 4");
					   
					   //console.log($scope.image4);
					}
                else if (capturedPhoto == 5)
                    {
						$scope.image5 = "data:image/jpeg;base64," + imageData;
						images5 = '' + imageData + '';
						images.push('' + imageData + '');
						imagesName.push("Image 5");
					   
					   //console.log($scope.image5);
					}
                else if (capturedPhoto == 6)
                    {
						$scope.image6 = "data:image/jpeg;base64," + imageData;
						//images[0] = imageData;
						images6 = '' + imageData + '';
					   images.push('' + imageData + '');
					   imagesName.push("Image 6");
					   
					   //console.log($scope.image6);
					}
			
			imageslist = {
				"image1": images1, 
				"image2": images2, 
				"image3": images3, 
				"image4": images4, 
				"image5": images5, 
				"image6": images6
			};
			
			$scope.$apply();
			//console.log(images);
		}
		*/
		
		function onPhotoFileSuccess1(imageData) {
			imagelist[0] = "'" + imageData + "'";
			capturedPhoto++;
			
			b64toBlob(imageData, 'image/png', 512);
			
			$scope.image1 = "data:image/jpeg;base64,"+imageData;
			//images.push($scope.image1);
			imagesName[0] = "Image 1";
			images1 = '' + imageData + '';
			images[0] = '' + imageData + '';
			//console.log(images1);
			
			/*imageslist = {
				"image1": images1, 
				"image2": images2, 
				"image3": images3, 
				"image4": images4, 
				"image5": images5, 
				"image6": images6
			};*/
			
			$scope.$apply();
		}
		
		function onPhotoFileSuccess2(imageData) {
			imagelist[1] = "'" + imageData + "'";
			capturedPhoto++;
			
			b64toBlob(imageData, 'image/png', 512);
			
			$scope.image2 = "data:image/jpeg;base64,"+imageData;
			//images.push($scope.image1);
			imagesName[1] = "Image 2";
			images2 = '' + imageData + '';
			images[1] = '' + imageData + '';
			//console.log(images1);
			
			/*imageslist = {
				"image1": images1, 
				"image2": images2, 
				"image3": images3, 
				"image4": images4, 
				"image5": images5, 
				"image6": images6
			};*/
			
			$scope.$apply();
		}
		
		function onPhotoFileSuccess3(imageData) {
			imagelist[2] = "'" + imageData + "'";
			capturedPhoto++;
			
			b64toBlob(imageData, 'image/png', 512);
			
			$scope.image3 = "data:image/jpeg;base64,"+imageData;
			//images.push($scope.image1);
			imagesName[2] = "Image 3";
			images3 = '' + imageData + '';
			images[2] = '' + imageData + '';
			//console.log(images1);
			
			/*imageslist = {
				"image1": images1, 
				"image2": images2, 
				"image3": images3, 
				"image4": images4, 
				"image5": images5, 
				"image6": images6
			};*/
			
			$scope.$apply();
		}
		
		function onPhotoFileSuccess4(imageData) {
			imagelist[3] = "'" + imageData + "'";
			capturedPhoto++;
			
			b64toBlob(imageData, 'image/png', 512);
			
			$scope.image4 = "data:image/jpeg;base64,"+imageData;
			//images.push($scope.image1);
			imagesName[3] = "Image 4";
			images4 = '' + imageData + '';
			images[3] = '' + imageData + '';
			//console.log(images1);
			
			/*imageslist = {
				"image1": images1, 
				"image2": images2, 
				"image3": images3, 
				"image4": images4, 
				"image5": images5, 
				"image6": images6
			};*/
			
			$scope.$apply();
		}
		
		function onPhotoFileSuccess5(imageData) {
			imagelist[4] = "'" + imageData + "'";
			capturedPhoto++;
			
			b64toBlob(imageData, 'image/png', 512);
			
			$scope.image5 = "data:image/jpeg;base64,"+imageData;
			//images.push($scope.image1);
			imagesName[4] = "Image 5";
			images5 = '' + imageData + '';
			images[4] = '' + imageData + '';
			//console.log(images1);
			
			/*imageslist = {
				"image1": images1, 
				"image2": images2, 
				"image3": images3, 
				"image4": images4, 
				"image5": images5, 
				"image6": images6
			};*/
			
			$scope.$apply();
		}
		
		function onPhotoFileSuccess6(imageData) {
			imagelist[5] = "'" + imageData + "'";
			capturedPhoto++;
			
			b64toBlob(imageData, 'image/png', 512);
			
			$scope.image6 = "data:image/jpeg;base64,"+imageData;
			//images.push($scope.image1);
			imagesName[5] = "Image 5";
			images6 = '' + imageData + '';
			images[5] = '' + imageData + '';
			//console.log(images1);
			
			/*imageslist = {
				"image1": images1, 
				"image2": images2, 
				"image3": images3, 
				"image4": images4, 
				"image5": images5, 
				"image6": images6
			};*/
			
			$scope.$apply();
		}
		
		
		function onFail(message) {
			alert('Failed because: ' + message);
		}
		
		
		$scope.cameraTakePicture1 = function (selection) {

            //var selection = 1;
			
			navigator.camera.getPicture(onPhotoFileSuccess1, onFail, {width:640, height:640, quality: 50, destinationType: Camera.DestinationType.DATA_URL});
			
			
		}
		
		$scope.cameraTakePicture2 = function (selection) {

            //var selection = 1;
			
			navigator.camera.getPicture(onPhotoFileSuccess2, onFail, {width:640, height:640, quality: 50, destinationType: Camera.DestinationType.DATA_URL});
			
			
		}
		
		$scope.cameraTakePicture3 = function (selection) {

            //var selection = 1;
			
			navigator.camera.getPicture(onPhotoFileSuccess3, onFail, {width:640, height:640, quality: 50, destinationType: Camera.DestinationType.DATA_URL});
			
			
		}
		
		$scope.cameraTakePicture4 = function (selection) {

            //var selection = 1;
			
			navigator.camera.getPicture(onPhotoFileSuccess4, onFail, {width:640, height:640, quality: 50, destinationType: Camera.DestinationType.DATA_URL});
			
			
		}
		
		$scope.cameraTakePicture5 = function (selection) {

            //var selection = 1;
			
			navigator.camera.getPicture(onPhotoFileSuccess5, onFail, {width:640, height:640, quality: 50, destinationType: Camera.DestinationType.DATA_URL});
			
			
		}
		
		$scope.cameraTakePicture6 = function (selection) {

            //var selection = 1;
			
			navigator.camera.getPicture(onPhotoFileSuccess6, onFail, {width:640, height:640, quality: 50, destinationType: Camera.DestinationType.DATA_URL});
			
			
		}
		

		$scope.loadVerifyHouseMembers = function () {
			/*$scope.applicationDetails = JSON.parse(window.localStorage.getItem("applicationDetails"));*/
			var page = appNavigator.getCurrentPage();
			var noOfHousehold = $scope.applicantDetails.indigentApplicationDetails.householdDetail.length
			
			var appId = window.localStorage.getItem("appId");
			console.log(appId);
			
			var db = window.sqlitePlugin.openDatabase({
							name: 'indigentdb.db',
							location: 'default'
						});
			db.transaction(function (tx) {
					
					var query = "SELECT * FROM verified WHERE id='" + appId + "'";
					
                    tx.executeSql(db, query, []).then(function (res) {
						//var verifiedList = {};
						
						/*$scope.applicantDetails = JSON.parse(window.localStorage.getItem("applicantDetails"));*/
						
						console.log(res);
						if ($scope.applicantDetails.indigentApplicationDetails.householdDetail <= res.rows) {
							for ( var i = 0; i < $scope.applicantDetails.indigentApplicationDetails.householdDetail.length; i++) {
								$scope.applicantDetails.indigentApplicationDetails.householdDetail[i].remarks = res.rows[i].remark;
								$scope.applicantDetails.indigentApplicationDetails.householdDetail[i].isVerified = res.rows[i].houseHoldMemberVerified;
							}
							var query = "UPDATE  assignment SET objectString=? WHERE id=?";

							$cordovaSQLite.execute(db, query, [JSON.stringify($scope.applicantDetails), appId]).then(function (res) {
								
								$scope.isFetching = false;
								modal.hide();
								
								ons.notification.alert({
									message: JSON.stringify('Household Members Verified'),
									modifier: 'material'
								});
							}, function (err) {
								console.error(err);
								ons.notification.alert({
									message: JSON.stringify('Error Updating Record'),
									modifier: 'material'
								});
								$scope.isFetching = false;
								modal.hide();
							});
							
						console.log($scope.applicantDetails);
							
						} else {
							ons.notification.alert({
								message: JSON.stringify('Not all Records where verified'),
								modifier: 'material'
							});
						}
                    }, function (err) {
                        console.error(err);

                        $scope.isFetching = false;
                        modal.hide();
                    });
				});
		}

		$scope.viewHouseholds = function () {
			
			var appId = window.localStorage.getItem("appId");
			
            var db = window.sqlitePlugin.openDatabase({
				name: 'indigentdb.db',
				location: 'default'
			});
				
            db.transaction(function (transaction) {
				console.log(appId);
                var query = "SELECT * from assignment WHERE id='" + appId + "'";

                transaction.executeSql(query, [], function (tx, result) {
                    if (result.rows.length > 0) {

                        $scope.applicantDetails = JSON.parse(result.rows.item(0).objectString);
                        console.log($scope.applicantDetails);

                        $scope.isFetching = false;
                        modal.hide();
                    } else {
                        console.log("No results found");

                        $scope.isFetching = false;
                        modal.hide();
                    }
                }, null);
			}, function (error){
				console.log(error);
			}, function (){
				appNavigator.pushPage('household.html', {
					applicantDetails: JSON.stringify($scope.applicantDetails)
				});
			});
        }
		
		$scope.recommendApplication1 = function () {
			$scope.isFetching = true;
            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();
			
			var page = appNavigator.getCurrentPage();
			$scope.recommendation = window.localStorage.getItem("recommandation1");
			console.log($scope.recommendation);
			var db = window.sqlitePlugin.openDatabase({
				name: 'indigentdb.db',
				location: 'default'
			});
				
			db.transaction(function (transaction) {
				
				var query = "SELECT * from assignment WHERE id='" + page.options.id + "'";
				
				transaction.executeSql(query, [], function (tx, result) {
					if (result.rows.length > 0) {

                            $scope.applicantDetails = JSON.parse(result.rows.item(0).objectString);
                            console.log(JSON.stringify($scope.applicantDetails));

                            $scope.isFetching = false;
                            modal.hide();
                        } else {
                            console.log("No results found");

                            $scope.isFetching = false;
                            modal.hide();
                        }
                    }, null);
                });
			
			
			appNavigator.pushPage('recommendation.html', {
				appId: page.options.id,
				applicantDetails: JSON.stringify($scope.applicantDetails),
				recommendationList: $scope.recommendation
			});
			$scope.isFetching = false;
            modal.hide();
		}
		$scope.recommendationList = [];
        
		$scope.loadRecomendation = function() {
			$scope.isFetching = true;
            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();
			
            var appId = window.localStorage.getItem("appId");
			
			var page = appNavigator.getCurrentPage();
			console.log(page);
			
			$scope.applicantDetails = JSON.parse(page.options.applicantDetails);
			$scope.recommandation = JSON.parse(window.localStorage.getItem("recommandation1"));
			for (var i=0; i<$scope.recommandation.indigentRejectedReason.length; i++){
			$scope.recommendationList.push($scope.recommandation.indigentRejectedReason[i].description);
			//$scope.recommendationList = $scope.recommendationList.recommendationList
			}
			
			console.log($scope.recommendationList);
			
			$scope.isFetching = false;
			modal.hide();
		}
		
		$scope.showHouseHoldMembers = function () {
			$scope.isFetching = true;
            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();
			
			var db = window.sqlitePlugin.openDatabase({
				name: 'indigentdb.db',
				location: 'default'
			});
				
			db.transaction(function (transaction) {
				
				var query = "SELECT * from assignment WHERE id='" + page.options.id + "'";
				
				transaction.executeSql(query, [], function (tx, result) {
					if (result.rows.length > 0) {

                            $scope.applicantDetails = JSON.parse(result.rows.item(0).objectString);
                            console.log(JSON.stringify($scope.applicantDetails));

                            $scope.isFetching = false;
                            modal.hide();
                        } else {
                            console.log("No results found");

                            $scope.isFetching = false;
                            modal.hide();
                        }
                    }, null);
                });
			
			
			appNavigator.pushPage('household.html', {
				appId: appId,
				applicantDetails: JSON.stringify($scope.applicantDetails)
			});
		}
		
		
        $scope.loadHouseholds = function (applicantDetails) {
			
			$scope.isFetching = true;
            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();
			
            var appId = window.localStorage.getItem("appId");
			
			var page = appNavigator.getCurrentPage();
			console.log(page);
			
			$scope.applicantDetails = JSON.parse(page.options.applicantDetails);
			
			console.log($scope.applicantDetails);
			
			$scope.isFetching = false;
			modal.hide();

        }
		
		$scope.fileOpener = function () {
			cordova.plugins.fileOpener2.open(
				'/device storage/Download/starwars.pdf', // You can also use a Cordova-style file uri: cdvfile://localhost/persistent/Download/starwars.pdf
				'application/pdf', 
				{ 
					error : function(e) { 
						console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
					},
					success : function () {
						console.log('file opened successfully'); 				
					}
				}
			);
		}
		
		/**
		 * Convert a base64 string in a Blob according to the data and contentType.
		 * 
		 * @param b64Data {String} Pure base64 string without contentType
		 * @param contentType {String} the content type of the file i.e (application/pdf - text/plain)
		 * @param sliceSize {Int} SliceSize to process the byteCharacters
		 * @see http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
		 * @return Blob
		 */
		function b64toBlob(b64Data, contentType, sliceSize) {
				contentType = contentType || '';
				sliceSize = sliceSize || 512;

				var byteCharacters = atob(b64Data);
				var byteArrays = [];

				for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
					var slice = byteCharacters.slice(offset, offset + sliceSize);

					var byteNumbers = new Array(slice.length);
					for (var i = 0; i < slice.length; i++) {
						byteNumbers[i] = slice.charCodeAt(i);
					}

					var byteArray = new Uint8Array(byteNumbers);

					byteArrays.push(byteArray);
				}

			  var blob = new Blob(byteArrays, {type: contentType});
			  return blob;
		}
		/**
		 * Create a PDF file according to its database64 content only.
		 * 
		 * @param folderpath {String} The folder where the file will be created
		 * @param filename {String} The name of the file that will be created
		 * @param content {Base64 String} Important : The content can't contain the following string (data:application/pdf;base64). Only the base64 string is expected.
		 */
		function savebase64AsPDF(folderpath,filename,content,contentType){
			// Convert the base64 string in a Blob
			var DataBlob = b64toBlob(content,contentType);

			console.log("Starting to write the file :3");

			window.resolveLocalFileSystemURL(folderpath, function(dir) {
				console.log("Access to the directory granted succesfully");
				dir.getFile(filename, {create:true}, function(file) {
					console.log("File created succesfully.");
					file.createWriter(function(fileWriter) {
						console.log("Writing content to file");
						fileWriter.write(DataBlob);
					}, function(){
						alert('Unable to save file in path '+ folderpath);
					});
				});
			});
		}
		
		$scope.pdfviewer = function () {
			// Remember to execute this after the onDeviceReady event

			// If your base64 string contains "data:application/pdf;base64,"" at the beginning, keep reading.
			var myBase64 = "data:application/pdf;base64,JVBERi0xLjUNCiW1tbW1DQoxIDAgb2JqDQo8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFIvTGFuZyhlbi1aQSkgL1N0cnVjdFRyZWVSb290IDE3IDAgUi9NYXJrSW5mbzw8L01hcmtlZCB0cnVlPj4vTWV0YWRhdGEgMTI5OSAwIFIvVmlld2VyUHJlZmVyZW5jZXMgMTMwMCAwIFI+Pg0KZW5kb2JqDQoyIDAgb2JqDQo8PC9UeXBlL1BhZ2VzL0NvdW50IDEvS2lkc1sgNCAwIFJdID4+DQplbmRvYmoNCjMgMCBvYmoNCjw8L0F1dGhvcihBbmR5IFNlbW91c3UpIC9DcmVhdGlvbkRhdGUoRDoyMDE3MTAyMDA5NTA1MiswMicwMCcpIC9Nb2REYXRlKEQ6MjAxNzEwMjAwOTUwNTIrMDInMDAnKSAvUHJvZHVjZXIo/v8ATQBpAGMAcgBvAHMAbwBmAHQArgAgAEUAeABjAGUAbACuACAAMgAwADEANikgL0NyZWF0b3Io/v8ATQBpAGMAcgBvAHMAbwBmAHQArgAgAEUAeABjAGUAbACuACAAMgAwADEANikgPj4NCmVuZG9iag0KNCAwIG9iag0KPDwvVHlwZS9QYWdlL1BhcmVudCAyIDAgUi9SZXNvdXJjZXM8PC9FeHRHU3RhdGU8PC9HUzYgNiAwIFIvR1M5IDkgMCBSPj4vRm9udDw8L0YxIDcgMCBSL0YyIDEwIDAgUi9GMyAxMiAwIFIvRjQgMTQgMCBSPj4vWE9iamVjdDw8L0ltYWdlMTYgMTYgMCBSPj4vUHJvY1NldFsvUERGL1RleHQvSW1hZ2VCL0ltYWdlQy9JbWFnZUldID4+L01lZGlhQm94WyAwIDAgODQxLjggNTk1LjJdIC9Db250ZW50cyA1IDAgUi9Hcm91cDw8L1R5cGUvR3JvdXAvUy9UcmFuc3BhcmVuY3kvQ1MvRGV2aWNlUkdCPj4vVGFicy9TL1N0cnVjdFBhcmVudHMgMD4+DQplbmRvYmoNCjUgMCBvYmoNCjw8L0ZpbHRlci9GbGF0ZURlY29kZS9MZW5ndGggNTE2OD4+DQpzdHJlYW0NCnictV1bb93GtX4XoP/Ax70LmOZcOSyKAo7tpi5iO43VUwTBeVAU2VEbW6pk56D59WfWzBpucs+sWSSzBUMXa769+HFd58Zh8/Tb5k9/evr6+asXTffnPzdfvXje/Of8zIhWOd3YrpX+u+zawTTadc399fnZP//QfDo/e/r1O9t8eDg/61qn++aD/4xHdbrRRramkVq0xjXOtdJLgI+9/8P52d/PzxYJ79peD1OZnWkH3Qih2t42yrTO/W6ZysnW9Y3S/gZMI2T4/EToiFeDaK1KeCFaYY/hupOt7UeRou1cBlFqIkV6kRnCmFaI+nWsbYWZCBEyg7h+CpFthjDd0Eo1RXiVHWP8PahRR3JoTSZmkdKTrnvvDUMDV/YQf2szTcvBS/Zqs6KViXLX6gNGWU/AVABiaidEReXMYNp/1NOg5Yw211oHg46ybOmKyRwRZXQrraYkGq8exd2C0aDjhBKu1Y6Sl5TmbdAPUeDgWc41YlxrRMJEj5qCDi6OCq4JS8ojMJnqEAeqy2Wh4pBYB/EyBenBtWJ2Le9gxauhWmvEk1LxYkGpU9C27AFCRaOH4NhTcdPUkS4dwfmlkxGVDzOV009mIZpnXo+Y4PUzVfqwPbQXVI1mxfbMR1Leotozu49EKnYnyWLyIsmgX1DtKbUd2l3db2qaTcZDYZnxslAETYpa/iIBM0siqpS/0JYREW1ZznCIiDVkjkB70ojMoiOhahKs0EarVkihXWlEsuwB4bhUW9d2si4KXJJqOw23EQUG/LF9ScDMvoiKiprBkn0jAu07R6B9EREVNUegfWlEZt+R0DFyZt8KbbRvhRTal0Yk+x4QYN8yb7RvXdvJvigw2rcsD+0rh6AOKgtTzVPbJgyVhbGdzMKpncrCZPuxTQ9E6CxMk432pMlEa5LtaMtJez0LVzWLdkzC2Cwse9vKYXQL02VpuIKY2RJhyeGnuGTOCBkDdQZBiyIkufwMgkatQDK7jqQy6My0Ne5o3RoxNHAFkmx8gMR4LZJHMzN6T5ZGkSliixKTsbVHYQ6QfTvkQUsCZqZGVFDXHJYsHRHR0kcINDQigrKOEGhnGpGZeSR0jJxZuUIbjVwhhTamEcnEB4Q3McEbLVzXdjIwCgwGnsM2dcWl8neiUld8XsMLnXGElyp+8irpWmvoQkA0zzwKMWQhiO10IcB2shBQ7ZknjUQqhYAki15EkkEfotqTBx3amUJQ02wyHwrjC4EYWlEp50TzzIqIIa0Y22krYjtpRao9s+JIpGJFkixakSSDVqTakxUP7YwVa5pNVkRhvBX9xW1hZJ+sSDTPrIgY0oqxnbYitpNWpNozK45EKlYkyaIVSTJoRao9WfHQzlixptlkRRS2wIo+nYuKFcvNcytGDG3F0F6xYmynrUi051ZMRGpWpMgmK1JkkhWJ9tGKYztnxYpmRytGYawVxeD/Qk9TUc1TKyYMZUVsJ62Y2ikrku3HVjwQoa1Ik41WpMlEK5LtaMVJe92KVc2iFZMw3orWi7HYSfPda5cNkCqImS0RFrufc1wyZ4Rgt/kIghZFSOyAHkHQqBVIZteRVAadmbbGHa1bI4YGrkCSjQ8Q6D0T5NHMjN6TpVFk7D8TEpOxjWx7V3BB1alWC7o9Glro0FOPIK9g0k+T50RkPQUghkwBsV1JNoRHQZUQpoQlCx4I11cYqDtrXr5+3jSTRVSRLaJq1bVmHMv4WHCTwcxXF+dnT/8ivEyvjYv3wL7z/0QDq6jhw7J1vuWjZwRsnn79bojLrs3X52c/7J6/3bvdm3f/2D9Ru28u9k/k7tmb8KN5s1e7Z6/3dvdy/7/Nxd/Oz15ehPFQxlhuYSybvp0TFqDxjC/SfL1/Iuzu88/7J2b3Bb59gm+/3eyf6F0D317sseG3a4auyun6UPC22ahg7z+dzQh/9/abvWZVp7dwUZTqykxe7YXw6vLaAz1d+18++K/7y/SXG6+5W/8fgIyqBNivQefw2y8IufNfH/f4x1Fkw9ykyW+ys1P/EK1cpXGfGXXJRezurScK7qt2f2VI2U2kSNWXKb0F9VwFJYH6ftxHzd0/kZ5n538T/qtnmPZrdlWk4Crprg+bFgyktWOiz/bS7J57xbndq/955X/2u+8ZWu4ktEB9iqT1DZj0eSDnOdndq7c+J71hiA1biIUdIVNicjAwy1Mk1jzx/RE5qObi6oed6hg+YtW2GJKQ6nronxGaEhyJvKxsIgHZqadISI5EXik2kYDtJCQJxZHI8/8mErprfX0nSGiORJ74N5GIWxIIEoYjkSfmTSRsWN8mSFiORJ6IN5HoVdg5VSbBpVixKcfmJJxuB0GRcByJTRk1J+ET12AoEgNH4jTZU3ea9IlZ9hRc9pSnyZ7aj0SoSJkT4jKpPE0m1dK0ijDTnBCXVeVpsqpWvhIv0hCXYeVpMqzWfdsRIT0nxGVbeZpsq01P5pg5IS7zytNkXm0dbAtbQIjLwvI0WVj3bqGGuIwsT5ORtRvIjDwnxGVneZrsbLqOzM5zQlymlqfJ1MYPdIYlYS+5TK1Ok6mNVDCKXUCIy9TqNJnaKN0ucSHJJWp1mkRttPEXpQr8xe3nvd5d+vHlLxydPE2rXsKk1mHyQckFEzd+aKktfFjDhGV55uYah76fb8bJmw8cvzxrL+OXa8x0MDrHPuLazqHakKzzeYKkJKtgnvOYw7f3MD/wL5x4ufo8Tmu93k+Vl6ZrPoVJHIb2hpROTW8QrF96dn2kGMh+BTfx72DvB5jr+AJzHSzPDZlelQaFHq0opmyq2JDdSyS0HwoNm0lsyOglEjAzTdqMI6E3ZPECCQ0PbJjNJDZk7gKJFPdWQ8927Rhdb0jXdNwbDZ3ZYw7/9IkwTq3ex7gJcfTuZ/+HNN/6wNHc0Nsm47zM8iRxrjd0wkuOJVzbKYopNzTRm3I56VieRMG7WRJ5ZobE4fupyMLB01LL667W8KF8SlcNsdBehhl8b7f/7qXy/mR3YdmEdaw8MS+iWeiwuLaHD5vcZLMelOU64TpP00qpVqsqJToolYEV5GPNPZ8siLxPJfdD8vPrtEzyZh9VO1blw3rJE/jo5biEkj5fWHJh7jevCJvuF6NbhecDHyW6TV42FjEl63iZK9dXM3nh2EYjRXjZQ1gaeelQflgjxtAZWmVX+Kk08DgfubD3EJzqEhfq4KtJf4Dmn5LHXi3w6k/Hfnrw6tD+I7Y/cMuspjC82KID9F0Z5u8ex3cLA40lTHPfhYdee4orl9xMXpu20Ui+673G5uMxlkahOnX+hmBJVLbWNaLHp2+X+a4wJWWkNeaH5IXj6vOzO+z4hP/9jEOfS/TjsHzapKo28+73aZn1drrWfX+0On2iu+osFMLju/qS7ugTrrJzIbU8mjaNkohY8uR17hiniaXTDqTKTNn0e5qBVIojIWCmfi0Jm1dEWFP2eXxTX0UOfUkVC/sq86BKwXe3P+zk+Gny+00KTu4W82q76RajW8rBlvqxJ3FLmxfkRUwLK64K4ARXLrfavCZuo4GuSTgFSyMvePDQlBumyVCuSIfS9SV1LE3y+Q6l+/cpxV+NPnyYDwMPuIou8GWUQ2T533lj/dB2+Y1B1H3nvw5eeYeJ/EMII0b9J5lQxKDpHeyFeJyg2TSDWNgfoGGFgWDKzcLY00wPpoBxCp7WXk0ir2oSjsZQ23oP0g4lVYBX3afOzhgKm+PlsKePCo3fdQsdPLmR7XrEiL8cZ7HJUTKj8U0lnIgRG55PeJQY6U8zXZpipMyUc8/+pNOl0oadb6tJFEqsDtlzW3/Hyyio4l3I/Td7Mw5358skP2H35XLa1wmfAXPme1dXT8n0hRK+5TbRNU146OJxXLNQ5ZcwLSyixwegyly5rQV9Xu020hjic1ZlGlyfp8+L2TYapotPcW2kkZezjTRgXE06EEujUNC20Yhzu8VoXbdNts8zPjxp3avq9Ac5Ky51BztVqS7pr/u0sz1USl887+Dbx3EU5P/zmdsBXRjh8YzJVAAbSh+pSrnCQG2Jbklza2/u6mYIzW2BcoVyIQeQuq1cKFHS3gmm8r9aND/jCmVhy+2gL6gwCf44vlAoC0uYUuvMBFduesQVysImGqnXUnYAlkahLIgBMsc2N5SipIxKzz49WvMBOy7jEHnNiNIVqsqWu0Dv8zehH2kixhUKzxKmhR3GDlYTCa5c/XOFYrOJRvK+st05GkOhgogOTq/Z5n1+JFdQRsX70kaDsWP85OHKQw0WQYZ9oapsYY9eBxsRH2kmYygUmyVMqd0HBFeu5g2FIrGJRvK6sr1ZGoUK0HWtqy/s017XyZIyKl4X1yv/C4aF9JctmIwrOXGl5+EqDdmWTEoPhcKy5e7QK/3N6UdadxwKtWcJ08KzBEPIhWWubBIqFI9NNJJXlv2BpZFXBjH4nxv3dgg/Wiwoo+KVlzjFdocTC8E/o79e3actmGxOzAvLpruI3gc30T3SmEB0efFZRLXwoEYHHUGCLPsAWJeXkW080P8Iy/M88iIhnICzvbc5oNMldSwckYT9wF/2K/f8ii6vMJvuAd0PZssfaRgiurwKLaJKul+ZLPtMapfXi208kvuV7c7zyKuB6CU8HH3goVfM0Itet4VdgeUM926a4aarDFdL5kRFl5eQbdzR7zz1Ln+a/kR+V6gzi7hSe5wJtuwzp12hVGwjkjyvaHGWR+H5dDghxtmNec+akjoW5r2HgiP+grMzwV1neZE7eUIUHnvfdG/ol1bDCRGP45eFh+MXUaWm6wmybB4qPB+/jUfyyrI/lHgsWr6ak01FhGQhBxdez2FM6WyU6aR0QRVmIv1wDsMQNhQcBLJibElM3Oc6E+PqYvqSmLjlcI0YVxIT91utETOUxMTdMSvEjI93z8TE1dA1YkRJTG9hsL7CUuOj1DMxLjyHvEaMKomJ06VrbkoXxOC81xoxJS/GiYw1YkpejCPPNWJKXpy6cCvElLxY+4xjzCpLlbxY23gQ8HIxquTFqXuw/KZUyYtTOl8hpuTFuHq6RkzJi3H1c42Ykhfj6uUaMSUvNtKG0+dWWKrkxUb1cObYGjH9rO4UV8r6VkRqWIWPTnVgLuBmF9BZj8SKHlbihDbwmqwgvwuS27rc4ahg5icy+QQDhwQqnU60+mH3LZyodb+HyRLlRw/Kd8cO///JfzU/xuGE2v2xqV5fd0fXP74vbfvgGdPLv5guz13X5ZdCCHtvUkPnOooMvbXPaQr8C3Y3f4OO3E3aVBKPlMO/MpeVS9XaqbZHDt9dwzJjt7u5/r+9tCVd1q+pFqpycsk1mizFbdQkpBKZNFl/dDnt0j+sZPm+8B9hVvewpxOOGxTBDiO129T3jw9I3uBjLWm2+DItWTzUb8HwVhlaKRs/7BpcuqFn4Ox36Ojg5Lf+J1hKrjeRXWai2fXX2KhUTKONoMvuUOLxACXt0rtLQ68Hek9Uvl0v0JhtJNS+o2Vl2MEwhLNAe0t12PU8r1UO+esHOKQ0P01gdsjfN9/v3a65ePV63+9evvvry5cXDRxlaQIOvp59932dur/chLpsZ7uD59SHpdR9zu/zkRfQuf0RaN/At1/G3z6DMzUvvad9+hVO3gQvC623d/C9eQa+eBdHwukzVwC8jLtUTPzT7aeA/tZr5P72X/4zICfgPpdVoIcwYDfOO6WPZ3igRTuVXqdQ0MD4kF+4Ld/ZUvi6Rj++E16IG8Jf0tGmchCwojoF+C7w7B0gUUJnPJEAUHb20ger4K2N03aTfCt8XoSXeyh4tYuNm1LidY4ZkAIiAXhLIfSN4L0iava+SRhEwzFWCk626FrbdV04NVtPMIkFCvES9AhNGDgtV/QJMwqS4YV/I0ho2ETFgOBZQHMAmWFAx52C/G3agZPkeyizy0kFg64jEHgHS9wO8RyiKsh18cCrKggm/jni8LJMrTgQvG2SlSQlzwkOkeYlab2Ak9HxeKQqyJp4ZFHNwLo3CyQ5u0DS0McDiWqSjO+8DJwK4JzjcHBP7XLwXlCOUgoWE8ZP49WG1mWhUoNgoCQIXmoGwTCpScEgGSExSGYQDJGaFAyQGgTDowbB4KhAUmjUIBgYNQiGRQ2CQVGDYEjUIBgQNQiGQ8WMKRhqUjAUalIwECpSUhjUIBgElQthCNT8MgYAvOfI+166ju91u7xaMKAYBCMoXuwYFMOAkRQD4QAKgXAMiqHASIrBwIBiODCgGBB1EIYEA4pBwYBiWDCgGBgMKIYGA4rBwYBieNQNjAHCSIohwkiKQVKXhGHCgGKg1C8XQ6WOwXUOocLh5wLeB6ZnncAE6DoY/tMAO7TTz097eP4ebFwG8R3ZDt4M4dnbQ/cOXpYg4hn/5tD5k1rCrOa8L3kQEjFzQRj5R4Kc8cyzyGdAMfJHUNTdMShGPiMpRv4BFCL/GBQjn5EUI58BxchnQDHy6yCMfAYUI58BxchnQDHyGVCMfAYUI58BxcivGxgjn5EUI5+RFCO/LgkjnwHFyK9fLkY+g4H40vOr6RB13lYjyPpPHws6xsQRnIFVCBnGkThaPALgSLYCiEPQAgBWQYUO6yU9rKXApENkM2QYEVNQAs1HkulKcUhbuBLkIjgn3g+K4YFCB8uDx0ISJnbDCRA80hOOdQzHH8DraJwiQVbActIImt9YAsUuDwPypul67nIqrIkwIHjXCivJJ9xBMCB4d6xWHAhWGzk9SdNDwp2pwGWgWO8YSbBmwakA3nWoBXc54WAlmpEEL7jg7k4MA+z85EDh4HwG5ARsomJAsMDGYWK5JUAYB5gdiDhIr3OKHQwTc9A04hIgdjBoQOhgHJonHYziRozZWVZeZ7ApQsEuDNHCJKMvk246VwnX6GWYidQDZGGjYKOGduFI5quP52dPX328/HAtbPPitklX/H/xrPxiDQplbmRzdHJlYW0NCmVuZG9iag0KNiAwIG9iag0KPDwvVHlwZS9FeHRHU3RhdGUvQk0vTm9ybWFsL2NhIDE+Pg0KZW5kb2JqDQo3IDAgb2JqDQo8PC9UeXBlL0ZvbnQvU3VidHlwZS9UcnVlVHlwZS9OYW1lL0YxL0Jhc2VGb250L0JDREVFRStDYWxpYnJpLUJvbGQvRW5jb2RpbmcvV2luQW5zaUVuY29kaW5nL0ZvbnREZXNjcmlwdG9yIDggMCBSL0ZpcnN0Q2hhciAzMi9MYXN0Q2hhciAxMjEvV2lkdGhzIDEyOTMgMCBSPj4NCmVuZG9iag0KOCAwIG9iag0KPDwvVHlwZS9Gb250RGVzY3JpcHRvci9Gb250TmFtZS9CQ0RFRUUrQ2FsaWJyaS1Cb2xkL0ZsYWdzIDMyL0l0YWxpY0FuZ2xlIDAvQXNjZW50IDc1MC9EZXNjZW50IC0yNTAvQ2FwSGVpZ2h0IDc1MC9BdmdXaWR0aCA1MzYvTWF4V2lkdGggMTc1OS9Gb250V2VpZ2h0IDcwMC9YSGVpZ2h0IDI1MC9TdGVtViA1My9Gb250QkJveFsgLTUxOSAtMjUwIDEyNDAgNzUwXSAvRm9udEZpbGUyIDEyOTQgMCBSPj4NCmVuZG9iag0KOSAwIG9iag0KPDwvVHlwZS9FeHRHU3RhdGUvQk0vTm9ybWFsL0NBIDE+Pg0KZW5kb2JqDQoxMCAwIG9iag0KPDwvVHlwZS9Gb250L1N1YnR5cGUvVHJ1ZVR5cGUvTmFtZS9GMi9CYXNlRm9udC9DYWxpYnJpLUJvbGQvRW5jb2RpbmcvV2luQW5zaUVuY29kaW5nL0ZvbnREZXNjcmlwdG9yIDExIDAgUi9GaXJzdENoYXIgMzIvTGFzdENoYXIgMTIyL1dpZHRocyAxMjk1IDAgUj4+DQplbmRvYmoNCjExIDAgb2JqDQo8PC9UeXBlL0ZvbnREZXNjcmlwdG9yL0ZvbnROYW1lL0NhbGlicmktQm9sZC9GbGFncyAzMi9JdGFsaWNBbmdsZSAwL0FzY2VudCA5MDUvRGVzY2VudCAtMjEwL0NhcEhlaWdodCA3MjgvQXZnV2lkdGggNDc5L01heFdpZHRoIDI2MjgvRm9udFdlaWdodCA3MDAvWEhlaWdodCAyNTAvTGVhZGluZyAzMy9TdGVtViA0Ny9Gb250QkJveFsgLTYyOCAtMjEwIDIwMDAgNzI4XSA+Pg0KZW5kb2JqDQoxMiAwIG9iag0KPDwvVHlwZS9Gb250L1N1YnR5cGUvVHJ1ZVR5cGUvTmFtZS9GMy9CYXNlRm9udC9DYWxpYnJpLUJvbGQvRW5jb2RpbmcvV2luQW5zaUVuY29kaW5nL0ZvbnREZXNjcmlwdG9yIDEzIDAgUi9GaXJzdENoYXIgMzIvTGFzdENoYXIgMTIyL1dpZHRocyAxMjk2IDAgUj4+DQplbmRvYmoNCjEzIDAgb2JqDQo8PC9UeXBlL0ZvbnREZXNjcmlwdG9yL0ZvbnROYW1lL0NhbGlicmktQm9sZC9GbGFncyAzMi9JdGFsaWNBbmdsZSAwL0FzY2VudCA5MDUvRGVzY2VudCAtMjEwL0NhcEhlaWdodCA3MjgvQXZnV2lkdGggNDQxL01heFdpZHRoIDI2NjUvRm9udFdlaWdodCA0MDAvWEhlaWdodCAyNTAvTGVhZGluZyAzMy9TdGVtViA0NC9Gb250QkJveFsgLTY2NSAtMjEwIDIwMDAgNzI4XSA+Pg0KZW5kb2JqDQoxNCAwIG9iag0KPDwvVHlwZS9Gb250L1N1YnR5cGUvVHJ1ZVR5cGUvTmFtZS9GNC9CYXNlRm9udC9CQ0RGRUUrQ2FsaWJyaS9FbmNvZGluZy9XaW5BbnNpRW5jb2RpbmcvRm9udERlc2NyaXB0b3IgMTUgMCBSL0ZpcnN0Q2hhciA0Ni9MYXN0Q2hhciA0Ni9XaWR0aHMgMTI5NyAwIFI+Pg0KZW5kb2JqDQoxNSAwIG9iag0KPDwvVHlwZS9Gb250RGVzY3JpcHRvci9Gb250TmFtZS9CQ0RGRUUrQ2FsaWJyaS9GbGFncyAzMi9JdGFsaWNBbmdsZSAwL0FzY2VudCA3NTAvRGVzY2VudCAtMjUwL0NhcEhlaWdodCA3NTAvQXZnV2lkdGggNTIxL01heFdpZHRoIDE3NDMvRm9udFdlaWdodCA0MDAvWEhlaWdodCAyNTAvU3RlbVYgNTIvRm9udEJCb3hbIC01MDMgLTI1MCAxMjQwIDc1MF0gL0ZvbnRGaWxlMiAxMjk4IDAgUj4+DQplbmRvYmoNCjE2IDAgb2JqDQo8PC9UeXBlL1hPYmplY3QvU3VidHlwZS9JbWFnZS9XaWR0aCAyNjAvSGVpZ2h0IDE2NS9Db2xvclNwYWNlL0RldmljZVJHQi9CaXRzUGVyQ29tcG9uZW50IDgvRmlsdGVyL0RDVERlY29kZS9JbnRlcnBvbGF0ZSB0cnVlL0xlbmd0aCA3MjYwPj4NCnN0cmVhbQ0K/9j/4AAQSkZJRgABAQEAlgCWAAD/4QBaRXhpZgAATU0AKgAAAAgABQMBAAUAAAABAAAASgMDAAEAAAABAAAAAFEQAAEAAAABAQAAAFERAAQAAAABAAAXEVESAAQAAAABAAAXEQAAAAAAAYagAACxj//bAEMACAYGBwYFCAcHBwkJCAoMFA0MCwsMGRITDxQdGh8eHRocHCAkLicgIiwjHBwoNyksMDE0NDQfJzk9ODI8LjM0Mv/bAEMBCQkJDAsMGA0NGDIhHCEyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMv/AABEIAKUBBAMBIgACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/APf6KKKACiiigAooooAKKKKACiiigAooooAKKQ1FPcRW0LTTypHGoyzOcAUm7Ak27ImorgtW+J2n2rNHp0L3jj/loTtT/E1ylz8Rtfunwk0NqhP/ACzjyQPqa46mPoQdr39D1qGSYytHm5bLzPaKK8LufFfie2uGil1WYMPQDBHY9OlWLX4g+I7flrqOdR1EsY/mMVis0ovudP8Aq5inHmi0/me2UV53pfxQgkZY9VtGtyf+WsR3L+XWu6s7+11C3We0nSaJhwyHNdtKvTqq8Hc8nEYOvhnarGxaopBS1scwUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABSGlpkjrGjO7BVUEknsKAM/WtatND057y7fCrwqDq7dgK8b1bxFd+J9SVb6Uw2jNtjiU/LHnoT6n3pPFniGTxDrDzBj9kiOy3Ttj+99TWFXzuOxrqS5I7H3WUZPGjS9rUXvv8AD/gktxby2lxJbzLtkQ4IpsO3zlD/AHGOD+NbssP9taMtxHzd2y7G9XXtn3Fc/XlQlzeqPao1fawcZfEtzodRtTceH7e6IHn2pMEvuoPB/lWPYp507RY+/Gw/HGR/Kum0p1vNGkRjnzF2OP8AaAxn8sVz2lqU1mFG6hyD+RrOlPWUexxYeUo06lN9LjZot2kWtx3EjxH+Y/rU+kazqGgTpd2MxUMfmjP3Hx2IqadNnhaIdzdMR/Kq1xbmOz01MfPKGfH1YAVtSquLvF63LThUp8lRXTbPaPDXiW18R2PnQ/u504mhJ5Q/1HvW4K+f9N1WfQNc+22pJEUhV1zw655Br3iwvIdQsYbu3bdFMgdT7Gvp8Divbws90fF5tl31OopQ+CW3+RZoooruPJCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigArkPiLqbaf4ZeGNsSXbCEY646n9K6+vMPixKftGmQ/wAIV3/kK5cZPkoSaPQyqiq2Mpxltf8AI4CAJMvkMQrk5jY9M+h9jULo0blHUqynBB7Unar0Dw3iLBcvscDCSnt7H2r5Vux+jSbpvmWqGadfyafdCVSSh4dfUVa1e0jyL22wYZOTjsao3VpNaSbZV4PRhyG+hq9pNyrK1nNzG/3c/wAqymrPniZVEk1Xp/Mk0C4KSyw54YbgKVI/L8Sg44LFx+VVvJbTdUjJ/wBWW4b1Fa8sGdTgmH91gTWUmlJyXVHPVaU3JbSRHeWzS2On2a9XlOf5mm3AWbXJHUZgsIhjHqBwPzNaTssS/aGGTEp2j3NRxNFomjtcXKh7mVt+0937D8KxhVdtN/8AM4eeSVlvsvmc7qEJtI4rZyPPP72b2J6L+X869G+F2pNNplzpztk27h0B/ut/9evP7Oxn1E3GpXB/coSzyOcBm9K6H4aTbPFU0aklJLduvfBFe5l1RxrpfeGa041MDOD1cdfmevilpBS19QfCBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAV5l8V4WEmmXIHyjehPvwa9NrlvH2lNqnhify13TW585ABycdR+Wa5sXTdSjKKO/K6yo4uE5bX/AD0PG1gW4H7kgSd4yev0/wAKgZWRirqVYdQRg038auR38m0JOiXEY4xJ1H0PWvlHc/R37SPw6oda6g0SeTOvm25/gbnH0qWXTsqLmwcyIDnHcVJHZ6beDMc5tpO6uwZfz61JHpuoWLebaskyd9jcH8KxlJJ6aM5nUgnePuvs9iwuzVbDa/yzJ1z1DVeg3GCPeMOBg/Wm2uZl3tA0UnRgy4//AF1cSE5rgq1EvdOCc1sEcIk2huQDnFUrvTTdzyXupz+TZxfcQHkj/wCvW3DFUepWdjPGrX0irGnQPLtX8qxo1nGdjl9s4z0/4Jxmpas96qwRKIbOPiOFen1Pqa6X4YQmTxLNNj5Yrc5PuSKxtQu9KgUx2MaM395EwP8Avpsn8q734ZaW9to02oSKQ94/y5/uDp+ZzX02V0+eqmlZI0zPERp5fKKjy82ivuzuhS0gpa+pPhwooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKY4BBBGQeoNPooA8Q8Z+HH0DVmkjjJsLhi0R7Ie6/wCFc+iW7/8ALZo/95cj9K+g9S0211Syks7yISQyDBB7e49DXjniXwVf6DI80Stc2HUSqOU9mH9a8DHYGUJc9NaH2uUZvGtBUK0rSWz7/wDBMVbGN/u39t/wIkf0q1b2UkB3Rataxn/ZlNZSIX+6AfxqzHbQqc3F1Gg/uqN5/TivIaue5Vi7az/C51FnO6Rl7jULWWJerAYNa0cluYRL5gEZ4BbjNcWdTggA+y22916SznOPovQVLZXkjSvquoSNKIOIkY/fk7AD0HWuKphFPU8qphKlud6fm/kdfLqFnaX0dlPJ5cki5DHgD8a5bXZWW8e11OAPIn+ruYuGK9sjoayb++l1C4E8x3PtAJra0XQtX8UrDCFItITj7VIPur3A/vfSujCYFqS5Fdsv6tDCJVqsrd9fy/yKvhvw/N4h1hbaPIt0O6eXH3V/xNe7W0EdtbxwRIEjjUKqjoAKo6JolnoVgtpZphRy7n7zn1NaYr6/B4VUIa7s+UzXMZY2rdfCtv8AMWiiiuw8sKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAprKCuCAQeoNOooA5LV/h/ouqO0qRtaTHkvBwCfdelcnd/CzUoyTaX1vMvYOCh/rXrNJiuWpgqNTVo9LD5tjKCtCennqeMH4b+IgceXbfXzv/AK1X4fhlrFx5a3V5awRoMBUy+PX05r1mjFYrLaCex0Tz/Gz6r7ji9K+G+jWDLLdb72Uc/veE/wC+R/WuwiiSJFSNFRFGAqjAFSUV2U6MKatBWPMr4mtXlzVZNiUtFFaGAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAcTrnjC5Xx1Y+DtJe1hvp4DczXN0pZY0GcKiAjc5wT1GB61btNW8QW3i220TVbezktp7aWaK/twy+YyFRsKEnaQGz1OfbmuU+JXw5j8can9v0PUVtPEWmoiuCSoZTlkyRyrdcEVj/Dzxv4p07xpD4J8bW7PdOrfZbmUAyAgE/eHDqQD83XjmgDqvBfjzVdf8d+IPDmoW1mqaVuCzW6sDIQ+3kEntXXeJb+70vw1qWo2QhNxa27zqsyko20ZIOCDyBXgFr4rj8HfEP4i6jJZS3jMzxLEqEplpcZcjov8+nevULXS9Fs/hHql3o0z3Ud5pU0rXcjlmlJjbsSduDkbR0xigDV+Gvi678a+EI9ZvbeC3med4tkOduF6dSTmuv3DpXypFpqR/s/xa4lxdrfW+qbbdlnZVhBODtUHGT1z16c12/xB8VapL4a8CaUtzNF/biQtfTRsVaQYjBXI6ZLEnFAHum5cZBBFGa8alv38H/HrTtC0oGHSNUtUE1mpPlq+HAdR2PyjOOvOaydD0yPVvjz4n0S5uLwaWsLsbWK5dEbPl8HBzjJJwMflxQB73kYznj1ozXzT4KsDrPw98b29/e30trpIkeyg+0MEjfa53cHn7o4PHXjmtO18Z6zpX7N8N7Ddym+e6axjuCxLxpuJ4PqACAe2aAPoPcPUcdarajcvZ6ZdXMa7nhheRVx1IUkD9K8J8S3D+AtM+H+uaM7xXN1GovvnJ+1hlRm8wE/Mcs3J5Ga9/wAZFAHkvirx9418H+DtP1/UbLRGe7kRDaIku6LcpYZbdyeORit/T/EHi+WPw5qE9vpM2m6qY/P+zxyLJbh03A8sQRnAzXNftGf8iFY/9hFP/Rb16H4L/wCRF0H/ALB8H/osUAbu4cZPJ6UZFfPWi3Gq/EO18Y3i2FzeasbgRafMlysa2AXJQLlgV6ckDnFbHijXtb/tfwD4V8QMbc3pjfVlSTidg+0KWU/dJGSAf4qAPYNXuLi20a8ubMxefFC0kfmqWQkDPOCDj8a5T4W+Nr3x34an1S/tre2kjumgCQZwQFU55J55qvpng278LN4snj1MyaPewySWthg4tjtYnGTgDnGB7V4lomlQyfATWdYae6F1aaiv2cJOypGSYwWCg4JIPU56DGKAPq3NGRXhPjvULu7/AGfPD+rzXMx1D9xm4WQhzkEHJHXOBmsnxFFJ4d134aapY3l6b2/jh+1TS3DOZQTGMYJwBhiMAdKAPozcAMk4xVTVJriDS7qa0aIXEcTOhlUlcgZ5AIOK8o1jUpfEfx/s/C98WfRrG3MptCSEmk8vduYfxYJGAfSovAGtXkXibx14TaaSbTbDz5LMSMWMKhiuwE/w8jA7YoA6z4V+Or7x74fu9Rv7W3tpIbkwqsG7BG1Tk5J55ru9w556da+aPAviG88MfAXxJqOnsUuzqAhikHWMuqLuHuATj3xV3X7ibwf8OfBHivSppI9WmkV7qYyEm6DqXYSZ+8OMc9O1AH0VuUAkkADrmmyMwjYou5gOATjJ9K8d8R3F1qHxn0CDXtyeGJrXzLeKVtsDymNjhuxbPY+gqt8MNMF9rXjK4eKe40eKWW30+eSeQoUJbKIM7SAAvPb1oA9C8Cax4o1fTruXxToyaXcJcMkKL/GnrjJ6HjPeur3Dnnp1r5x8BeKdS0T4N+L9WjuZpbyG6WOCSVy5jLBVyM+mc1veHNK8QTaf4L1zw9pdx564fVLya7T/AE2NyN+75yWwc4yMigD3DcPWgEHpXzr4r1RtB+IOvWnjSxun07VWxYarCzeZaR4IUx4OMDPzKMHjnOefoHTmR9NtWimWaNoUKyr0cYGGH160AWqKKKACiiigDkbnwtqieMLvxHpmsrBJPBHA1nLBvhkVM8tggg5PBHT3zS2fhGefxbF4n125gub+2gMFnDbRFIoFOdx5JLMcnk4A9K62igDzfSfhc1j4j8Qare6lb30OuRyR3Vo1oVUBzkYO89D/AJFM8N/DPVPDnhbVvDsXiRLixv4nRBLZnNuzjDFfn5BHb159a9LooA8p/wCFP3A+HJ8G/wBvR/ZzefaftH2P5/8Adxvx171sat8NY9a8H6NpNzfhdQ0YIbO/jhxgpgDcmeQQBkZ6jNd9RQBxWn+BpJPHP/CYa5dQXOpRwCC2it4ikUIwQW+Ykljk/TNU9K+Hd7pfxD1LxemsQyTX6Oj2xtSFUHGMHfnjaPrzXoNFAHmHh/4U3nh/RPEemxa9FKutpteRrMgxE5BIG/nhj+lW9J+Fdra/Dq68GalffbLSSQyRTxw+W8TE5B6kEg/4V6JRQB5wPhrc6lN4dj8QanDd2OgKBbQwQFDORgK0hJPQKOB1r0alooA4f4i+BLnx9p1vpx1SOxtYZRNxbmR2YAjruAA5Paug8N6XdaJoNnplzdRXJtIlhSWOIx7lUYGRk88VsUUAeYW3wu1LQfF19q3hbxIdMtNQYm5tXtRNgk5+XJx1JxkcZ7ir/jj4XWni7StPii1Ce11HTv8Aj3vXPmM2Tk7+hOSM5GMGvQKKAOS03w5r8ei3cGr+JDqN/NbG3SU2wSKIEY3bAfmb3J/LnPK2XwfuLL4fah4QTX0a3vblZzObP5kxtyMb+5VefrXq9FAHm+q/DG61X4cad4Ok1qJIrN1JuRaEs6rnaMb+Dzyah1z4WXut/wDCMs+uwxvoESJERZkiVlK4LfPxwi8fWvTqKAOM1nwQ114wsPF2l3UVtrNrGYZVljLQ3CEEYIBBBGeCPaovDvgD+wLfXboXqT61rTO9xdvDhE3Z+VUznaMnvzxXcUUAebeGPhNb6J4P1bwvqGoDUNP1BvMJEHlvG2AMg7j02gj3FRn4Wz3+n6FoutapDc6Nosm+GOGApJcY+6JCWIAA44HPtXptFAHjnjo+Kb/4lxWfhVrLUGs9ODTafeovlQbm+/hsAsRgAjkAEd6veFPEHjhvEM/hPxJpmnWsz6e9xbz2qgpEM7RuVWxjJPHHSvQNS8N6PrE8c+oadBPPGu1JiuHUegYYOPbNTado2naSrrYWcNv5nLlF+Z8dMnqfxoA4Twt8JoNC8L6z4dvtSGoWGqfM5EHlPG2MZB3EcYBHHUVL4P8Ah9rfhm3TS7jxVJdaHDL5kNqluI3POdpfJIXPJUdfpkV6LRQB57r3w/1PXdO1LSLjV7WTS768a5AmtS01oC24rE27Hr1HGTXc2FlDp2n21jbqVgt4lijBPIVRgfyqzRQAUUUUAFFFRXNxHa2stxM4SKJDI7HsoGSfyoAlorxn/hceqDwbf3h02Aa4Jt9pa4OPspjEomYZzgJnJyOcV3L/ABB0a3vLKwnlne8nMEcnkW7PHFJMAUV2AwpOeBnOKAOtorkbP4keHLyWdRdTQxwwSzmae3ZI2SJtrlWIw2D6etMi+JWgTW88qjUA0MqReQ1lIJZGZC67Uxk/IC30oA7GiuPh+JnhqaTTkFzOjX6xtGHgYbBI22Mv/dDEcfn0qCT4q+GoxKS9+VjSV9y2UhDLG22RlOMEL1J6YoA7eiuWPxB8OjWBpYvi0+3O4RnZu2eZs3f3tnOP61l3HxY0JNEutStrfUbjyIoZhD9lZGkSUlUYbh90kYz0z9aAO9orB1PxZp+j2NlcXiXay3ozBaJbs9wxC7mHljn5R19Kwj46m1jxbo+j+HVV7W5tft017LbuyGHIAC4IwT8wyehGMZoA7uiuB1XxXrYuvFy6c+nw2+gRxPvuInffmJpHXhhz90D8a1vDuraqPC6654nutPhhktUuv3EbIsCFNzbyzHOM9sdKAOoorjI/ib4elhllBvx5c0MIRrKQO7TAmPauMkEAnpUGq/FHQ7Pw4dRtHuJ7iW3nlgtxbOXXyiVYyKB8ihhgk4oA7qiuC8TeMtT0Twj4evQLZNR1OWCKYtBJKkW6Ms5CIdxxjoKd4b+IkF7oVrc6xsiupo7ub/R0YoYrc/M5B5QkY+VueaAO7orib74laQljqL2TytcWdkl2xlt3ESb1DIrkDgkMOKuRePtFbWP7JlkmS6WZreSQwMIRKkfmMvmEY4XJ/CgDqqK4pfin4Xks5rmO7ndUkjjWNbdi8vmEhCi9w2Dj6VsaT4s03W9WvNNsjctNZ489nt2VFYgHbuIxuAI4/wAKAN2ivJrL4p30nie4glFjNpsN7dQzRQxyefbwQgnz3bJXaduMce1dJ/wtLw15EcxlvlR081t1lIPKiOAJX4+VCTwx68+lAHa0VzL+O9Cjvr23NxM0dijNdXawMbeEqNxUyY27sdh9KpxfE3w5PDA8U108k9z9lS3S1Yy79of7oHTaQc+lAHZUVx7fErw6trcXHn3JjhufsikW7Dz5ecrHn72Npz6flVvTPHWh6xqdrp+nTzXM1zbLdK6QNsRGzjc2MKTg9e4xQB0tFFFABRRRQAUUUUAFZ+t6VDrui3mlXEs0UF3GYpGhbDbT1APuOPxrQooA5a58AaFdT307QOkl5po0t2RgNkABHy8cHGOf9kVXX4c6Umpw3q3eoARzw3P2fzR5TzRR+WrkYznAHfGRXY0UAcX/AMKx0E6alhI15JCmnvp67pRkI8gkZ84+/uA59ulYHir4d6hJZpFpE1xfyT3n2y8lvLhPMeRYvLjHKhSnXI4PpXqdFAHG2PgWD7TYardsLfU0toI7uKyVRbyNGPlADKSoHT5SOKQfDTRV077EJ73y/wCzpdOz5o3eXJJ5jnOPvE9/SuzooA5Bvh5pP2++uop7uFb2NlmhjKbdzR+WXBK7gcdgcZ5xTbn4c6Nc2V1amW8RZ7W1tQ6SgNEtucxleOueTnrXY0UAc7rPhG11qPTzLfX8F5YKyQ3tvKFm2su1wTgg7gOeOvIxVLw/4S/sLxTc3NvHHHpkWm29hZRqxLKqM7Pu+pYc966+igDm5vBenT2HiC0aW5Ca7IZLtg43DKhcLxwMDvmtHUNCsdT8OzaHcoxsprf7OwVsELjAwfWtOigDkLT4e6bbXcd1Lfajd3CXkV6ZbiVSXeOMxoDhR8oBPHrVS5+FeiT6dDZpd6jbhIJLaWWGYBriKSQyMj5BBG4k8AGu6ooA57XfCdtrv9mMb29spNNcvbSWjqrKSu3uD2yPxrFm+FWiyWyxJfarFI0dxHcTpcDzLkTkGTzCVOSSB0xXd0UAcVefDPRr67uLi4ur9vOgithGJVCpFG6uFGF5GUHXOMnGM1cHgLRzcrNIbmXF3dXjI8nyu86FHzx0CkgeldTRQBw//CsNKOgSaL/aGoiykKKQGjB8teiZ2cj3PzZAOa19H8JWeja5e6xFc3k91dxpE3nyBgqL0AwBnHqcnHeuhooA5yDwbp1v4Ru/DcclyLO7EwlkLjzD5rFm5x/tHtVXVfh9pGr3CSSy3kMZt47W4hgm2pcwocqkgx0Bz0xwSK62igDkm+H+lP8A2rAbi+GnamHNxp4lHkh3xudRjIbgHrjPaon+HOnz2VpaT6jqMkVvci5wGjTzGXG3O1BjGOoweTzzXZUUAcQ/ww0iT7RJJeag93NeC9+0u6FlkClOF27SCpIOQc960bTwVY2niG01r7Xey3FpbG2hSR1CKpADHCqM5xnB4ySQBXTUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQB//ZDQplbmRzdHJlYW0NCmVuZG9iag0KMjYgMCBvYmoNCjw8L1R5cGUvT2JqU3RtL04gNTAwL0ZpcnN0IDQ3MjkvRmlsdGVyL0ZsYXRlRGVjb2RlL0xlbmd0aCA0NTk4Pj4NCnN0cmVhbQ0KeJztnU2vNjcNhvdI/IfnH7xj51tCrGDVTdV2h1ggVLEBhFBZ8O+5r8TTBcwH79OqnIqRqmYy57WdxPZtx8mZ4/m1vby/ir18vGyzV9pepl7SC3r+cnpJ79XkV6JXXplefWV67VXoiQm98arq5e1V1cv2avT81eilV6eXX51eeQ169TXoNUmn29XS12gYTtFwGI/+MwZUXC399DKGVLJaRi96BlXqy6qkF/XrUCt+jb74NfWr+HVGJ36dvvgN+uI36GfNe45eLf36cqPf1NLvL3f6Q636TcuX1G8aQqKvBcv0k1r64lfoi1+hL36Mr4kf42vix/ia+DG+jjrU7+LD+DqK0cKVIg1s6ksFLq109V3/qFcph35TS79LS/SHWvXFIhX1B2qj79IbfWm00he/Rl/8Gn3x6/TFr9MXv0Ff/Ib6UpKUm3zaSt7mG5ee55ukh/kmS+XzjSzF5xvZSppvmh7mmy5DmG+GHnhj4sxQu9iU+UKMGYuZ3nS9NhPjISuUSehBa2BWZSKyRDPMUKtghjXLGs2GHrQOshuZjdbUHPsZWJLLgDKmpJXV/PSQZUqyTBmXHrQa5uJcZJ0m0ypF62H4ScVA5SqlakVkgTI0TFTuUrBt1qF0jFQuI31jpeI8lpnK+rQipuHWDUPVKCsrYvKhapikmSxS450ml2UcJheqBd/UcKtk6CHJKiXQNNyKDk2uVJsEmoZbm0zE5E61S6BpuLXLSEwOVYfkWMF4ZSZ4Vdvkr6bhNmzd5FQNgabhNpOpmMyuuQSahttkiHposm0JNHlWSzIXk2u1jP9WzF0Gw0xawYPlXU1z1oM4AwjyTZm+LMbkYK1NLxZ5l8WYXKtv+KN8raNqa9i/PEmeLIeQZkxu1p0JNuyECerHPTFBeVrPTFCu1jMTlK/1wgTlbB3nMy1or0xQ7tYrE9SC9sYE5Wi9McHpRExQBtc7E5S8PpigDK4PJih5Y2OCMriBS5jkDVYUgxvOBCVvOBOUwY3EBAdupxU1GZwwp4I8ephQBQrKJUx2NlrlR3rTjTdi2DUDk+AxZAkueQMNgocSnng1PVMiHZPbUKIjckOoY3QbanSEbujRMbsNRTpiNzQpwMN3M1C38SSJbshAmW7TjyXcDRmo09HShj7dkIFC3ZCBRt2Q0TVjZyIaHmCKjKE5TzPXoAFULH8rQCreDhK44+7TJ3BGQ7o7fp6BXGxBdss7PL0Ak4QAGVoCmHli5kQzQ7+OwxgKnsBkaNhxGUPFPjEFHTs2ZSjZQRVHy45VOWp2cMXRs2NXzrovZEHTjmU5qvaFLcw8T3Bh5hNd0LZjXY66feJLYebYl1dmPhGmauaOhXlj5mCMN3mRz0DYjbCCjE6gcjgPrbtPnLEZdAAa1skn0jiBB0sTCmsEhMWUCD4ERkGhRkBoVMzQCFh1RQ2NAHecccMJkGmubkVGlVN4RUbTijkWK3YEN2T0RHhDRsdOKzIGdtqQQZzVtAA57LSBYBvawtUz+KaQyBPaaoAYK8YM9IS28Iac0NZEyIS2GhCZ0RY+lwvamtjYNFctGFBoM7jyRPgmoOQh2/OFjzP0AmyEN58IuQ1+CmgCtj4xEg/zPmFTK+sTJZOsfwaWkkgQJk5m1pnQUuaaTqQEjRx7lsolAygp048IL6XJchJgUqamCTAybAVkvLv0VmYSJryVzU9AKYOwj8dXcpaEd9eNUI3HV4A94d0VL054fEV7ySYiO0kdIJ20sgnvrlm6TDZhmkQC765F65zw+IrvJ7y7VlkNcxZUiy7h3bU1skZkdCdJQQZBO+HxCj2SgXcrbpK6gMGbLD1hu40gyHj0JCtM+HkDKdLEfCwk4eeKcaSkYHwiEcK7FXokA49X7CEZciIA6RIer+iD9vl3tZIiwU+wrCfkDtlPws/7lvgpGL8xc/y8E5oSft4Bc7I8BYdMGgzOo/mZQ/TECGYMSaRT+HnPstgZJvscFX7e50quOEJalWcgySRqM5Kwuvh5bzPHRkaX5hN+3hXISORm0koWjozBLGc82aT5hJ+PTT6e8PNBhpXw80GETvj5ANfTxFR8POHxAy2nmQbLlUkmCUtoEO8e5KgJjx+gaKozDjGqGaPAdixegDm5IGNUUkniz4btgtYankZAaryRRCXwaSMGI1EYKp0lEuQNH8Ia5WOZd40nUlWQaiM/S/jSlme6Stwr2BDor8hEyooMpUkkscQ42TeWoifsqs9ohy+AVFvXrNOMo0P2nTrSRiUBJtptWAlIJePUO5DAyAUTnmukEoxMcclJjYl22NmMozbtdBD3pp3izTbtdMCZLdHELBlqnlspx9j0hLSuEeQZUbHTDNpo8XmXiZkaQd7A/E0jmHHFyUfzRkQlnckzohLvBKo8dfLzGVETCTqRklHlGVHx+Ew0Udip5PHEVtl8BtEcO83EFcdOsyEDO1Waz9Pc4SEDi8iODOw0g6k+5i4AGdip9gNEY/YBTgzGTjPRKc2dAFiZsNPsRGOifRq8I07kROQlCZ5xasajTHRK5HJsIvQ0eIcM7FTBgSdphfkxXY0gwZloT5ao+J3nVoQnZgkyZ6I9uzd5ObMkOmWifc7EeaI9WtQTsyQiZHAYX2chJSPPOM8siU6ZaK/NDRF/7neQQbRXl9g/dzzIINrnggzwNM9cghiQCzKI9plYk4n2eWYVQxpYucRorCSRfNP/s+xcmQEzLzMWMsvqcxOqUZFVFH6SZy5R4FJntlB5R45QpcdcZ94g78xsfAs7xExkK43dGdGzCPZeMxcrAic9wRmUz/j5jEwZ766b1jjj8YJiycDPK9ubPLfCZMd5bobJmdjx6El+lfHuCpaujARvyvh5ZY3zzEg0dTaI5CFa47wyEnlY7jMj0RrnlZHMugKcW2FLOXMTtqZkBlUQrL0keQjbwrxyk8b+kjyEzDDP3IQ8IM+MBDQHgfTECGZGgpZnvqwopBFgu4pC8CPrqUYlA85VuqBcohxGvlbw89Y0goKfty6vK/h5AwUKft7G3NkiY0gDBT/XTnO8yops0kDBz/vc3c4Mh81Rwc87WXTBzzsZVcG7OzG14PEdpC34ecf/Cn7e0UDBzzv+VvDuzq4TS1GeBIKAjnPzNPNvRSG21+Qw2oqw0eaJWeLxg5168ZkdMQKfGZP6v/rVpy/leq/t9dWnrz99/bc//PXTN//827efvv7u7//443e//fO3f/n05Z9eef78i9f261//8heLpAXJN7/5D4Ivfvf71/dUD8VD8VA8FA/FEcUOvN98dUDBgYB+zIkAjbKv2dhqfDVpNXk1ZTV1NW01i0taXPLikheXvLjkxSUvLnlxyYtLXlzy4pIXl7K4lMWlLC5lcSmTy9F0S/ncBXooHoqH4qH4uVB0C4ovj/Dccv98MRxBnuDpTfgoC8DLAvCyALwsAK8LwOsC8LoAvC4ArysM1BUG6uJSF5e6uNTFpS0ubXFpi0tbXNri0haXtri0xaUtLm1x6YvLWrvDVU1XC/RQPBQPxUPxUPygzUZfeN0XXveF133hdV943Rdej4XXY6H+WKg/FuqPxWUsLmNxGYvLWFzG4kJld7UWrUebos3RlmhrtC3aHm3ws+0sfnCd4zMX6yF5SB6Sh+RnT5L2otTJjmS8IWjemDvB2psow2XChdaB8hYob4HyFihvgfIWKG+B8h5RwyNqePDz4OfBz4OfBz8PflFTsyiqWVTVLMpqFnU1i8KaRWXNorRmUVuLdT1e8vH5WnpIHpKH5CH5vyO5ixdxXmFxYGFxYmFxZGFxZmFxaGFxamFxbGFxbmFxcGFxcmFxdGFxdmFxeGEl+JXgF0U0iyqaRRnNoo5mUUizqKRZlNIsamkWxTRb1bTDRavXIfqYpl4H6HoaoK2OK3H+lrh2vve6Jn1IHpKH5CH58CR3cSrORwJd52/IrDbiQZyKWByLWJyLWByMWJyMWByNWJyNWByOWA9+Pfj14BdlO4u6nUXhzqJyZ1G6s6jdWRTvLKp3FuU7i/qdrQLe4aKNfdEOA0c6prk+27Jxvo1a5cIzcfk9ceNc3Gcf9j0kD8lD8pB8KJK7OBVHMoGu85cYV2vRerQp2hxtibZG26Ld+az44hb8LPhFvc+j3udR7/Oo93nU+zzqfR71Po96n0e9z6Pe51Hv8zXPwxXwfdEOA0c5psmXgcNXGfGY9HL7Vt8Td15fvSZ9SB6Sh+Qh+fgkN1ef4/wm0HX+Lvls47zG47zG47zG47zG47zG47zG47zG4zK0x21oj+vQHvVFj/qiR33Ro77oUV/0qC961Bc96ose9UWP+qJHfdGjvujl/PZe+fwrHA/JQ/KQPCT/hyQ38SLObTzObTzObTzObTzObTzObTzObTzObTzObTzObTzObTxuQXtcg/ao83lchPao93lchfao+3nU/Tzqfh51P4+6n0fdz6Pu51H383ZaofLry+XtmGa7Wuj5aY5TcelK3OFN9ntxp9VF75e7tsNrKvfizndt/frQbXtP3vm2rV+eutnhKd+tvHF67Obj+jcRDo/57uWdW8u4tBY7rA7fyzs3l3FpLnZYHr6Xd24v49pejqsKt/LO7WVc28txWeFGHh+1OZGXtmt7eQtd0nZqL2m7tpe34CVtp/aStmt7eQtf0nZqL2m7tBd/C1/Sdmovabs+1X8LX9L5lepkl/bib+FLsnN7sUt78bfwJdm5vdilvfhb+JLs3F7s2l7ewpdk5/Zi1/byHr74ub34tb28hy9+bi9+bS/v4Yuf28t10dnfw5fzqnO6rjqn9/DlvOyc/NJe0nv4ks7tJV3aS3oPX9K7v0oZufeeFO/Z6p5G7undnnbt6dCepuzpwx7W93C7h8E9PO1hY4fzHWZ3+NthaYeL3Y1399rNfjfH3Ux29e3Lerziew3veMUPETaly43c/NDbqbzP3gM+JA/JQ/KQfCySugedY9w8zBRvcbNe4PSPXTtL+9dj9u/G7B+O2b8cE2clKc5KUpyVpDgrSXn/CE3wibOSFGclKc5KUpyVpDgrSXFWkuKsJMVd7BR3sVPU9FLU9FLU9FLU9FLU9FLU9EIT8yuaZ4tXr4PcYZqd6p2yzoNcvb4zd5hm38s7vTR3Q/pjkbRrkz9M5m9n1c5N/p0hXub/6TD/vx/ief7/0yz8T6Te61z/cC9zu3b9PNf/sAvxYUmuq9f5cPd3r6Hz3d+HXYgPS3Jdn86H++VbDV3Up29CfBxnRTyaH4tebYTOOL5KcWwV8Dk/B73a/ZNyEXrjuCqgYn76ebVBH/vkFNfTU+yXU1xPDwOen3iebVxLT7F/TnEtPcU+OsV3JWJZj1f8+r74YcUgfV/WP1vx0+M4vhJ9Je94v3wjL2/nQfCa9CF5SP7NQK9L5vl4Y3JnoBcl84+6EA/JxyTJfrk5ysebsTsD9dPN0V2MjCvxAezz4/+rTdHmaOP7qHEVPkfNNm87fXxp1fZPrca3VuMqfPjl/LT/aoNP1HRzXIHPUdvNcQU++/7N1uATtd4cn7zIUfPN56cG+bqKnw+3o9n3wHqy4udV/BvSh+QheUgeko9PUq53c4cFr1vcLBc4/dlDvAlugfzz77Wsdv/ydwSRqAHnuDefoxacoxacoxac98+I798R3z8kvn9J/PtPiQe//WPi+9fE98+J798Tj1pwjlpwjlpwjlpwjlpwjlpwaGL+zZWzxSvXQe6w9JfLjbLqeZCrl0fVx1/Yupd3WsO+If2xSOr1b9EdlpjuZ3Vu8j/NrB6Sh+Qh+Wgk1+XsclgsvcWai8vYN7EyzhMD2Off6FptxKC6/4GMiGVRTM1RTM1RTM3xuwA5iqo5iqo5fhcgR3E1t/0vbQS/KK7mKK7m+AZIjiJrjiJrjiJrjiJrjiJrjiJrLOvh4o3L4mU5LJbm7++wn6z4OC1e5lXPPZV3WCy9l3f6O+A3pP9Dkut75OWwKHe/EKem/nEX4iF5SB6S/5qk2OXxVjkslt4BR7Hz3za7iZFxYBfAPv8i42ojBsV3RgLv5t9fpOWvL642/nRUFFlLFFlLFFlLFFlLFFlLFFlLFFlLFFmL7X+JKvhFkbVEkbXE90ZKFFtLFFtLFFvL+RX5cn1lvRwWS4tfX0Eu51fWy/WV9XJYZLiXd3pec0P6w0n+BfVc1f4NCmVuZHN0cmVhbQ0KZW5kb2JqDQo1MjggMCBvYmoNCjw8L1R5cGUvT2JqU3RtL04gNTAwL0ZpcnN0IDQ4MzIvRmlsdGVyL0ZsYXRlRGVjb2RlL0xlbmd0aCA0ODQ1Pj4NCnN0cmVhbQ0KeJztXcuObEmR3CPNP+Qf3BMvf0iI1bCaTQvYjWaFEBuQEILF/D1mcSxLo+FEHHU2VBdNLrrDb1W6ezzc3D0sT2WO6o/jMWo+RnmMVh7lqBiPRxkDY33U0jG2RzX+uz9aMYzj0cwx2qOXwOiPbjDRIFeYa5Ad9vrxsAp7vTzMG8b68Ap7vT3cYa/3R1TY6+MRDnvdHllho/sjHTZ6YD6YzOgJIWARsywF0xoDUywxpr9SYWiMjklz9qNx9vjVsEcxzh//KMYJD38Up8cBy06XA5aDPg12gk4NLpJODXaSTg3bcGDtwzqExEKwGdgY/sQgJHzBeq2Y/7CAkLCMDakNKxh+QMhzS2rHxIfD4DhgGZtSx8CcHZbtgGVsC7Yalh2W/YBlzLI6ljIcluOAZcyyBlYwApbzgOWAwcQKBqbbjgI7MNoO+BnYo9a4nMDhtcCvwh+td/7KIHDyEY/G/RuROFg6zQMCnSYMOp0mDDqdYv0t6BSaLeg0YTnpNGEw6RTr70flTwICFjew/l7qeNhxQMDiDOvvFeFnOLNesTiuvzeEoh0dAhbHqfSOqLQDkdaxSsNUOuPRDljmmgxT6YaItALLhjVZgWVHTBrm1B2LswIXgSgcWH9PTMEYxmXwV4whaBgDGTsOgZGNyVuZIQ2njOlOp5VBTad1xhmccpHcSGNcG53WGQSwXHl4DH0sEkdFLPDMBn/C7cO6jQeTCFibi8S6rXGRCFijv4J1GyIPs4Tl6Q/rtkZ/iNzpr2Hd1uZPYQPQM2w0/oefYl/4r4cNoMBw5MbINQSucQMMODRDnBIk5pidAXmWXA5C2Y9pLCEkfxUPL5w8ItgrneIfABN/Alw3OsVKvNEpgglLh1WsxDudIph80ClW4oSLYfedu25Yic9pIJjcsdmYHQTAxQA9D2y2waiHc76wnJUrgOUEXLCCRxzYdQP0gA9YhvUo2FrDcUYJWk5kGm4AojOAEAgFwuC6kYQ6IoUZKjqMGYzGYKwiTINANERn8BgN1sMYmTNlcX+AuEjEO3+aB/bGEGNZDv6qQsAKDBGTFbFjAGNW50+Q6WaMAYzZMAVGTHY6xXSz0ykwmINOgcEk+g0YTMaOAYM5pwHopTN2AMZ0xiowmMHYwZwyGKs4vEzGDjCYPFxHLJbjQPD4wYx/wLcjGgsyB0+7UYJ3RzyiHiCAmIggwb8jIpGTmcGPmZ0xA+aHcvROe0zUg1HrU+JhF1oOLNYLvQXW5oWWOSkv9JYxgwsp/aAVhEnhDyHBcimMQQRKKRUzd8AS0gw+FoF2sKrMusDwQ7BAATN3eITEAKy0zFmx+kBiwFX6YPh5pQ9GCBFQCq16pQ9GoLdZaOqMcErOEKcPBqE3+mAUOlCK6cGqY1WQECmAAqQCq8xGkLAnDqSWWmHVOytXDfqAt9raxAwlHK8jWFnX8LMyK1wSSLTsnGmntzmrTstBK53eclqhj5xWYLkdtMKC2Q5aYQ1thQAHbiElAYl1tEqIs4wiCcMHq2ZrRDsLaeuIFWcBbZ14Z+HEL+GDtbSx2DpraGNGdRbRRmS60QfP0VlPmxtRTx9RCHv6CMAUCQBS4hzd6INlhK8ts45wzWUWEsdry6wkPJ0yS4njTMqsJcgelIJ5BD6Qs3N2GpAYz52v64xnp2VGHJsASJxV0HJMK/QWtBL0kbQStJy0EuwvDlqJ2XIQFQA2ciNRAXxBIioA7TJQ8B8sQZCATAe4C9oo+Ej2WI0xDngXtELwkbNzYYzDJnsY2Ev6YAHzpI+ZCJM+iCEkQEozFdJHADme9BHMgcQ5KjjTIn0ksyBxjpKLxEico54ifxHncIHUeMyWiZmQiEeZY251SlhhEPGoS9xxvg4Hh/Ra2FvhvINxapxVENPGUwli39jjBRGPJAcrxDkyGH9GKzmtsDE7gI0gzpFaMFPiHOYwU+IcsIcP4tyZyBn7kLBjzCyY8ewlOyXsUxDxAAl8EN2Agc9OszgbR/Z7iJuDNYE+WHeCOHdmqCDOnXEbxLlzNUyokBC3QZzjyAarByVWH+IcWwwfxDk2EesgprE58EHEY4GwR8RjuoUFZ7ad3HG+Dh0afgbLwQYnGKcxZ0VMBzNeEPvh0wp9xLRCy0ErxHkkrRDnkYhMNhrI4m0WM0rBasaeFiiE1CkhMoM4TyQdSEYJkRnEOVIJfBDdAAB8EPGJdgwVkJY7IpPtH9rfPssjpDn72TezunO/kF24z8R5Mj8EcZ6MGkYoJO4zcZ7sIIM4z+Q+s2s+Du4zu+Xj4D6zgT4KY5eN88F8GuycD+bT6Hwd8ynvEvVg189aU4950myaj9kisI8+WCeIcEjUCFrmeXM3IQHj/I/dPuYSs+9n7AYb/4OxG+z8D8Yu/kMDydjFbkJi7OI/JH7GLnYTEmMX/1UkT/hI3quY5QN7yIsEfOBfkIDiSPpg5YykD3a6kfTBRglHC4k1AV0HJZwFG9paiLU86IMnwO4SNxOgDiFACSeA9gR3kwOoSyAekrNlgQ9OEBKvMIhe7BBfxzhFHwNpHNRNSphBwg/yAnCaOEVIzjYHPqpPDVr22frQCpGDJogSu6BCH6z7zEqQ2AcVXpTYjWTlTYndCOsA/CMm0TdRYi8EnNfGboSVFxK7IeCchRM+gG5I7IeAeFy8+ph3SUjsiBotz3tlpTdePrLRB1GWvOc2Yp8IgoSY5LnXRuxztpAQk8xZwAnWlY2WiX00b7jUMZ+ySkBytm/w1tmAAnSUEF2JOaKcIyaTcYprIF83KBk7P3jrvFUkEA9patAye43stMK6A9BBYg7KQR+Mxxy8VnJu6BYpsaUcvFgynwKclNhUwje6ps6u0iidbSUk5tMEXiGxscQZ18F8yhslJLaWiLI6mE+Tl+HBfEqUIiAwtzR64z2OUQaJMcmb8WDvl7waD1b/5N14sBKwEkFiTBLTgxGSRPzg/1n7cRtmTBLnAAB+hnNH0DHC5hW5MyaJbnTi1A1emw/yBk6JMyC6jXc3cgmQkCmS6DZ2bbzYQ+JeEd3GTJtEvBFNjEtIjHYi3nmlZo8KidFOxGNp0CC6nTxEEvHOLJpENyoTu274QDsIDeIczV1hJ06JKye60YJhVkS8s8NPott5reOVgq3e7M/phA1cEvI+y/VBfM+KBJFuCKPCGyTE2XsT9kHaAqJRzCnCVZTJpzA2UVqn6BSnMSIeiXC+ljxDm8aIeZSlKRaK0xixHpN44QbVsGmMaA/204Xpu8Zsug/iPWbHxEKJbDCNEfHBTMYbB8Scxoj5POYdgYkAOWq+Ft6SmaqwJYQ4jTEDJAmgwuYb4rwJ8aUNR/rzn3/7bnJEx+NX33797Tf/+e03//un33379V/+/Nff/uWXf/jdH7/913//z+Pbd79/dL7kF7/4j5+9rNKeKt9daODi/4KfScnh9/+oKb5V3ipvlX+qythngXwpC4xlFkAmlOavLjXr1MTYNA6NptE15jmeSWxS/+covdY1Sr9Jv0kfrcY5yk6XnS7/Xfa67HXZ67LXZa/LXpe9Lnvntl7v+HMLLnfcjmulerPjfe1vbP2V1/zZ2t9W9SevYnW73fWl7bb23u63ylvlx1GJsoV0ewnSUV+tkUM1aagWDdWgoRo0VINMNc1U00w1zVTLTPqmWmayY7JjsuOy47LjsuOah8uey57Lnsuey57LXsherO8K0bc73q+VPvZtseNj7c+2/sZr/nztb6v6Vvl7ldxHhL10QrmJiK+6EW+Vt8rXU+E7fjt8+iv45AMxL9bIUE0K1aJQDQrVoFQNStW0VE1L1bSUfko/VctSdvK0w8eDzrForBqbxq5xaDSNrjE0yl6RvSJ7Zdkl8H3r3Y5f8nd8cma/48t7HZ8z2vm7ZAru/cXa31b1rfL3KnUbEX7JLNyeUN1ExFfdiLfKW+ULqvQt8+eXTNwtPvuS+bupkSogz8Q+nx+dY1UNEhfLt3nPUTWtqqaJmzVxsnxc9BxlR9ysNdkRR2viaE0crYmjNXG0Jo7WxNGaOFoTR2viaE0crbb1ese39zq/JOOsP9PoaseX9zo7aeClv0um4N5frv1tVd8qb5W3yg9UsW3b65dU1C2kbd32nqzb0t8lFXXrz5dvR5lvyU2/JFbu/a2vLb4vgpcXxXt/yyL4SVHi+yi5vozdrmoZJXelXW9Pqh7Nv4E4R5XOodIpKtmGSrEoZRvSF7Vs42lHpVjUsolaNlHLZrInitlEMZsoZoHpGeTP4HsGxfxThnPU631damP7xrVfX0f9Ca7Fjq8paYstwRHXl6tbf+vWZa/6VnmrvFXeKp+r4se2zMX1DfYmCfqxboa+/xTvKqPefFQ6n3/rdo6qPCKMLVSpRBybiGMTcWwijk3EsYk4NhHHlrInAtlEIJsIZBOBzL9tO8eisWpsGrvGodE0usbl5dDLtrOLy8uvl/2jXb4mpL1sO7u4vPze+1t2djeqb5V/IZXat6Fzecm6DZ26fHf3627EW+XfWaVt7/5xefe/hUFf3v0/Z1U3FVll6lk+5t9Vn6MqnehpP98qnH9PPUfR1C6a2kVTu2hq5ZT5l9PnKDuiqV00tYumdtHULpraRVO7aGoXTe2iqV00tYum1uHNv4k+x3Wl7Pt0d8m5eN+/We59ne72NHhcci73/pZ38xvVt8pPW2Vs3wSJSy7sNtrGus/9shvxVvnJqPie/btkG29j2pfs3+es6q4y649eVD7m53ScoyqdWGUXq+xilV2ssotVdrHKLlbZxSorUczP4ThH2RGb7GKTXWyyi012sckuNtntaUfz0gPLLnZZhzc/Y+Mc15Vyz+PnJcvr/iyvq3NeEhzu244vLwmVW3+x7vj2qm+Vt8r/U8lt4strEukuQHOd+L7sRrxVvqRKHNuHHvOadbwJ0DiWDz1+zqruKrP+tEblY37u0zmq0oUqp9htF7vtYrdd7LaL3Xax2y5228VuC/3zU53OUXbEartYbRer7WK1+UlO51g0Vo1NY9c4NLrGZaWMD+Lh+pwvKcI49m89RFm+3xv7B9rzkou597dMfDeqb5W3yg9XqVseKC95p9uYrkse6OtuxFvlE1TalgfKS9bxNtrakgf6nFXdVGaVqWf5mJ8jeI6qdGK1Q6x2iNUOsdohVjvEaodY7RCrHWK1Qw9fC9LzMwLPUXbEaodY7RCrHWK1Q6x2iNUOsdohVluHNz8D8BzXlXL/WHte8n3R938eHevH2qPvO75LLube37Lju1F9q7xVfhQV2zbE5bjkqm5xYBucf9WdeKt8X5X9Q9/luOQdb2Nn/dT35yzrrjbrw5xUQOYn057js9apdorXDvHaIV47xGuHeO0Qrx3itUO8dojXDj0tLaTOz5w9R9kRrx3itUO8dojXDvHaIV47xGvr9Oanyp7julb6tuMvxyV/F75/MD3Wj2WHb5u+clzyMfcO113fXvWt8lb5UVRy2xSX45qvusNBbpD+VXfirfI9VfJkR9exc8093sROHst3PT9nWXfVWX/zowoyP+38HFXtxG2HuO0Qtx3itkPcdojbjnjaUfUUtx3itkPctpA6P8f8HGVH3HaI2w5x2/y85XMsGqvGprFrNI3LYpkf9MPioC8JuTyeJXZx0GX59m/uHwkvxyUnc+9w2ffdqL5V3ipvlf+rUm8ywiWZdgvQts4IX3YnvqxK2z4iVI5L/vH+iJbvfH7Osm6qs0rVs4LMb9A4R1U78dspfjvFb6f47RS/neK3U/x2it9O8dspfjvFb6f47dTT2ymeW0CZ34pxjrIjfjvFb6f47RS/rdOb334xx/XT8flBQFwfdLkk2LI/S+zioNefVpL7x8JLuWRl7h0u+74b1bfKW+Wt8gNVbM8DlEsC7hbTtuQBvu5OfI6K798VKZf84+1++/Jdkc9Z1l111kdhqYLMb2U6R1U7MdwphjvFcKcY7hTDnWK4Uwx3iuFOMdwphjvFcKcY7hTDnXqCO8V0K/rn9yydo+yI4U4x3CmGW6c3v1HpHNfF0vv33cSXVPbNXrmk8W4cza9/Wi5rfwEol9zPrcP1E+G5/3DzUq45iFuHa0ogbjLiNQdx63CdEWP7vEAp13eqW4fLBwYyboLm+oZw63AdNLEPmnrdqd45zHXQ5D5o6nWneutwHTQ3dHq9LqO3DtdBk/ugqdd15NbhOmhyHzT1tUyT66DJm6B5KdPMb39beJzf/LZ1+VKumd8tt3Z5EzgvZZv5xXVrlzeh81K+md+Kt3Z5EzwvZZz5lXtrl/vwaS/lnPl9fkuXN+x1eynrzC8LXLvch097Ke/MbyJcu9yHT3sp88yvOVy73IdPeyn3zO9QXLu8CZ8Xs0/dhE+9CZ8Xs0/dhE+9CZ8Xs09d161PaYvvriP6GL/UW3rqop/N7bPnfLaCzw7t2Tg9+5lnm/Gs/s+i/KyVzxL2UVg+0v1HEv5IjR8J6yONfID7A3IfQPgIz4+g+TjK8xs8JVwh6m9sD0LODQplbmRzdHJlYW0NCmVuZG9iag0KMTAyOSAwIG9iag0KPDwvVHlwZS9PYmpTdG0vTiAyNzMvRmlyc3QgMjc5Ny9GaWx0ZXIvRmxhdGVEZWNvZGUvTGVuZ3RoIDMwOTQ+Pg0Kc3RyZWFtDQp4nO1cXY9cxRF9R+I/3H8wXdXfEkKKAigRwrJsS3lAPCxmYizsXbSsJfj3qTpdZzBhZxevVhFJrh9mamb7VHfXR9e9p+5Yko4tbZJy2qr6u9hLccE+1eZC3jQNF8qmDWPrlgWD25YbBvetCAaPrTQMnqbPBxdT3H1wka2pDy66te6DS966+uBStj4wuG4jY3DbxsDgvs2MwWObA4Pn0iqp+sv04dVWLcXH+yZkOqDmTbQ4otofcgKimoR91r5JwUZ9k6W6UrXv1qJ9m0Mxzv4wevfvbI6ZXV+zP8yJcW6b4uPMDJqm62t1Uym+gtZMmkD0TRXLNeNoTkBMk3xpqadNS3JEF5OqI8xkWsUR3eaoPmXq7gABwuZoDQibowsQNkfvQJjmtfpus63Vm3l1rX7YHGv1Q7e8Vj+ySVi9GT2v1Q/3MlY/zM1r9aNvea3eXJHX6m25ea3elOaOUDGn5I5YmbLlIdUlm2PA7zZRnnD8tDkmPG8uK4i5NC2WEnxvkxeB8+c0yb0v5sai7n1JYpJ73xy3lezet7Azyb3vMVxKAaJupSYgbI6KAEk2R0tAeMBWIGwOrN5Ek3z19m8rw0Nd7KUMj3URm2N6sFvEmdSAqFtNCkQzqQPRtyoKxDAJOx+eFb5zscG1ZkeomDQcYS6rLTtCs0nD5zAFtWcgbI4+gbA5RgHC5hgTCJtjFiBsjul+s5jfGpJELKubm8kkSz5xv4nldVP3m9iUTSsQdWtZgGgmNSD61ooAMUxqQMytVY86yyGTPOrE87t51IkneOuOsAxvXdtKztY7EDbHwM5tuW1g55blbWLnYpondm4Lt9MBiLn1bKrsO9k6stby1CT4zfK8V/jNttUr/GZ53hv8ZkN6g98s43uH32yrvcNvlt19wG8G6wN+szzvE36z7ffpfhPL85HgN1M1PJlMsrPKzWmSHVYygOjb0AzENAmrt4nGWr2ZaazVW56PtXqbcqzVW56PtXoz3Virtzwfa/W2jLFWb+k81urNnGOtvriE1dvSpsD2ZtipsL1lvKWbH5GW52ZmjCsmIXIsz2dB5JjZZ0HkWJ7PisixLcyGyLHYnQ2RY0E4OyLHsnt2RI4l4hyIHMtzcyCOYZtjInIsz+dE5OBoTgid6edSQuzgmBEEz/STGDtQHNnYgibB+TxcROXxAFJLdy856iKKRQasolwAtgoBjDVxmgOGQ21NMXFa+VgcthNTiOAs8bFwQ8IUkpH9DpOV1oBV5CtgK/0A68grwJBYE7CJTHDYcpvvW1UQsQ6DBWBu1YwYcxiCEQa3IoKoAGy5FrAO7wEGywpgE/Z22LKWr0S9wCusrhnL8zk1ZywaJulYCGD+gipklcrF5q/ZB7Q1wDU22MyOBDuOMJEfz+Yr11t8tgGbwRgDNvNsWNVI/dhe5cgKn5dpDHMTrYKkdjTIqkgo5qskqV8ErJqEl1WU1C8DVlVSP+ZXWVK/EMioqrrqPzaEi4K1IU/EvDbklwV5bcgBeW3ILwLy2pAnaF4b8guCvDbkps9rQ/6nvDbkiVsURnUvlIwpfMqSPR3NciYW7NgTuhTs2I4OOySxY3eTXZu4XjsyzArYsSe6lSqFwV3Ejn2eMrDj7lMM7NiPLytXgPlsE1HiG6wJUeJ5UROixI+1KogSX14VRIlvuyIyzZEuYkN+3NW1ITtATITN3Bi1wGbDL6bKWE43scJmw2ersJmbyModIsj1Nths+sTTr3Tsu4ZLMhR5K0F2HQTBL5JsVKsek90F12p6WvMdmNy8PnuGWVGxa6Hqgtnok08OT9dlXtqeHZ4fXnx2ePHLj8fD85vrdy9vPn9zfHv48utvtsPTV1vxIZ9++vFHO2bH7Jgds2MeBWOldmGe3gLxcvqQqdbtvA24DWx1JKDPboeCAHm2KJAQhIJSyBQKhUqhUegUTgpnCIWaCzUXai7UXKi5UHOh5kLNhZoLNVdqrtRcqblSc6XmSs3LC2c8NO/20DwDG/d4qKU75rwTvGN2zI55bEwn5vY8L+mBed7nnuf/P5h7q2tlpWosUI0FqrFANRaoxgLVWPoaS19j6WtU2Fn6OjV3au7U3Km5U3On5k7NnZoHFQ4qHFQ4qHBQ4aDCQYWDCsc4nwFjfqiFQaHfmanykKlAez3uOnfMjtkxO2bH/OHqOFlyJkvOZKWZrDSTlWay0kxWmsnSNaMoens0BKGgFDKFQqFSaBQ6hUGBmoWahZqFmoWahZqFmoWahZrlfHX05t+HemXH7Jgds2N2zH8cc19182dc1pmvLBnKkqEsGcqSoSwZypKhLBlkaP3RliWQqhVStUKqVkjVCqlaIVUrpGqFVK2QqhVStUKqVkjVCqlaIVUrpGqFVK2QqpVylofGYyzprvs4PQO7h3GRep5ZvQe8Y3bMjnlsTLuHWc0PzPN2nln9U9tjxzwEc291ZQ9Q2PoTtv6ErT9h60/Y+pPKSlVZAytrIKlaaayB5GyFnK2QsxVytkLOVsjZCjlbIWcrpGqFVK2QqhVStUKqVkjVCqlaIVUr/Y57x/6Aa55xD7NaHjLVhkcvH3WdO2bH7Jgd8+fH3Fu12GQTNtmEvTVhb03YWxP21oS9NRksKYPFihSqkEKVydpCLlXIpQq5VCGXKuRShVyqkEv1x89DEApKIVMoFCqF88/WaPrwJ6Z2zI7ZMTtmx/zhGqNsXimbV8rmlbJ5pWxeKZtXyuaVsnmlbF4pm1cq1CzUTI5TyXEqOU4lx6nkOJUcp5LjVHKcSo5TyXEqOU4lx6nkOHVxnLfbc7Gd5+9p6hlYucsNG34LdH7OO8E7ZsfsmMfGVGLO5Hl7YJ4vpui/zx7/W5h7axybWspelrKXpexlKXtZyl6Wspel7GUpe1nKXpayl6X82YHyZwdKylH5swMl96jkHpXco5J7VFKOSspRSTkqKUcl5aikHLWd59C05Q/3QbunLvaHTLXhl52Pu84ds2N2zI7502PurVHsESl7RMrWkLI1pHycX9kjUvaIlD0iZY9I2SNS9oiUPSJlj0j5OL92aiblqKQclc/1K7lHJfeo5B6V3KOSe1Ryj0ruUefZJy9Otnn+48Xl76zD4Ycv/bf3v4KUBr349s3xNpvGnWTcNUZT70SgxvZY/9mQC9KTt6Gs0LRLjidmcvT2clCiJW5JS1TrEtuucctbo+TXmL/FDXSLK4kWDuhx893jmqOHz0bcnY+4KBnh1Bm37zOuWubpRxy8WU68fkgnFpj341JOPccTjXu6QDqFI72+KONvtt974IvXr95d3+oCqbf+3kLZSvzH1fUPP31/PN7c6r/TzPpvM0t/D//t1dUPt8J/i3pvxIvr4/HZ1dXN4dnVm+NXFz9ui6k4PL24Pl7ir1s84OVqhGF7+uuT4883Xx5/2SRUf2G6Lq9ujocn/vL55Xe/fnhhQ7+9+vnw/Pjy5vC348V3x+slO4by3y/fvL48Pv/+wlfoX/zl0jRc3Ly+uozP1zev/3lhAj6dNv3Z1ct3b21N75nRFnlz+Ori5fXVe5//+r29vvf5s9cXb65evffF8zevvzu+N3bNY8NeXV+8DffGXp+8e/vT12YRrb+x7pOLt8efvl4fT5l36mnzuGL/ILoGZHbI5/Co4QHDY4WHSRwhWwSEvce4aFBotCX8vy9b7xrvJd5bvMe4SLYc/FaOpMzBZeVgsHIkcQ62Ksf+cqw/x/pz5iER4+K+I8d1em78vOyQ4/TOkbSZh0zsN8e+ctirRG+lxDpL5HiJeUvcPJS4QSjxJEKJw62E3hLdnxI9nxJ2q8JDKw6r2GcNUq1Wvsf3MV+NM6IOHnI13uPojUO1CQ+/Fu9r3hZ2bIWHYo/3tZ4WcdQijloUuxZ2a1HGWtSsFodsDz/38G8Pu/WgFnvhYcvPa94ed1q98xAOPeGfHnYbEU8jismI/Y3wy8g8tEu8x/iIh9F5mMf4OIZHxPWMPtmMOJ2xjxn+npmHf473GB/XErOzKMS4WP8MP83Isxl5NiM+ZuTZjDybXE/E4zz9lCLxJxls9iX2+BJ/JpFIMCfyyol0ciKLnEgeJ3LGiVRxIkOceKgk3hkn3gcnlq906mbynlt4ySSny5h8usM+XWiFW2LEiRtgk/RUgD7+6F/Oet6mDQplbmRzdHJlYW0NCmVuZG9iag0KMTI5MyAwIG9iag0KWyAyMjYgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDYwNiAwIDUyOSAwIDQ4OCAwIDAgNjMxIDI2NyAwIDAgNDIzIDg3NCA2NTkgNjc2IDUzMiAwIDU2MyA0NzMgNDk1IDY1MyAwIDAgMCA1MjAgMCAwIDAgMCAwIDAgMCA0OTQgNTM3IDQxOCAwIDUwMyAwIDAgMCAyNDYgMjU1IDAgMjQ2IDAgNTM3IDUzOCA1MzcgMCAzNTUgMCAzNDcgMCA0NzMgMCAwIDQ3NF0gDQplbmRvYmoNCjEyOTQgMCBvYmoNCjw8L0ZpbHRlci9GbGF0ZURlY29kZS9MZW5ndGggODI2NDEvTGVuZ3RoMSAxNzY5NTI+Pg0Kc3RyZWFtDQp4nOycCXxTVfb4z30vSZs96ZK0TdskTZMuaZPuULaG0paWUugWaYFCSwFxQRAoCIpUHdGpIK7gMgru46CSBsQijKLiMqOoM8O46+Ay41plRh1nwDb/c99JSosy/9GZ/8zn//v1tud93z13P/fc++5LA8AAIB4vMqivaKqZGmxJuwOEm+YCJL1VWV7RnFw74SjAfRoA9R2V5dOnJH6R/T7Anc1YoG9qRWXVh099xUC44VwA8fOp9TObPmhlWwGCAWC3vDO1yV8uyrNOgFB3DUDVGzObvAXfqh7dA8Bew1bbO5d2LB/rmPIAQEYfln+uc/Uqm7emuAZgWh6AInrx8jOX3vFJOaa7uwGUsWd2rFwOCeDA9iuwvOHMc9cuvvXqRzFePxYg7fMlizoWHmu5Cutm2H8oWYIK7WbFQYzfgPH0JUtXXXCZWv0SgID5nd3nLFpx3so5a2YCXHsBtj/j3GWdHU9sOewFWJkJkFq/tOOC5clgSsby2D+wndexdNE71Q0bAW54DkA7d/mylatCFsD4nek8ffmKRcufPbbKA1CE7cX/DLht5Y++2/RU2/z5+glfQ2I08LD/04te4HxplfLNE28MbFZ+FvU05lWCABSwnAIGgR1S7TjxxvGNys+kmoYF8Wau0WfATJBLCgEM4IV2AE0ntitlkU0TDmBqtPxmeSFWmUoUX4ZHBYgGQR8liDKZKMiOghDywQMhahegrslmAxve7KA+RN0uuGzAtkuVHpTr+Eixdt3J3jC0qOx1MMOPCLIJOIZ/IogfwuYfU38kyDUnywtpP74uccH3l1UMwmZ55fenyc+C+h/Shqz8ZD2yS0bWKT4HZd/br7+CZkSbpbDph7R52r5komeNhtFwmiB+CVN/aBlZLVwstkL1P5m3dkQ8Cqb90Pb+pwT2DZzzQ/IL6tCbp6nn4tOV4XNz2rS6f27Ovq8u4bXT1/uPgvDMj3uu/L8O4q/AdNq0X58+bTSMhtEwGkbD/44g3Ap/+m/34f+3IF4Ka//bfRgNo2E0jIbRMBpGw2gYDaNhNIyG0TAaRsNoGA2jYTSMhtEwGv5LQQxLcvjbYd9iDO+Ej0AGRzGeCTa8418500IaTIYpUAk1UA9+aIVFcDacC8thBayC1bAWdoRCUh1aLEM5q2E6NGLODjgLc543IicLfQ0Qeir0UujVcF/s/MKwNyyJudg0NiPUGe5VejhHGt7lIPNgLF7HjhyJOE3chqlemAQV2HYtzILZMA8WwhImMD0zYK2prI2dxVaz9eynoGCfSeX+fOr34jAuhL9FJ8A/DmxYy/9KkKHEAJ8FHvgYeDg5DoiMJJx/3SndGBpfOI6jxOsyFBorsE0ot6AclNKf/Zd6+58I4r+1tv/hvuyrmj+vbe6c2a0t/uamxob6mTPqptdOq6meWlVZMaV8sq9s0sQJ48eVjh1TUuz15OZkupzpjjRrQpzRoNeqVcroKIVcJgoMciodVe22gKs9IHM5qqtzedzRgYqOYYr2gA1VVSPzBGztUjbbyJw+zLn4lJw+yukbyskMtgkwITfHVumwBQ5XOGx9bHZDC95vrnC02gL90n2ddC9zSREtRux2LGGrTFhSYQuwdltloGr1kp7K9gqsr1etmuKYskiVmwO9KjXeqvEukOlY3ssyJzHpRsisHNcrQLSWNxsQnZUdCwP1DS2VFRa7vVXSwRSproBiSiBKqst2Fu8zXGXrzTnYs6nPAAva3ZqFjoUdc1sCYgcW6hEre3quCBjdgSxHRSBr3QcJOORFgRxHRWXA7cDKahuHGmABudPgsPV8Ddh5R/9nIzUdYY3Cafga+C0f4pCZMD1yD9g37CGOz27nfbmqzwcLMBLobmihuA0WWILg87pbA0I7TzkYSYn385TuSMpQ8XaHnU9VZXv4d/WShED3AltuDlpf+nXiL6bbAqKrfUHnEs6ORT2OigqyW3NLwFeBN76O8Fgre/O8mL+jHQdxFjdDQ0vA61geiHOUUwZU2PgcnNXUIhUJFwvETQlAe2e4VMBbWcH7Zavsaa+gDvK6HA0t+6AwdLS3yGbZXQhF0Mr7ETBNwUlxVfa0LFwcsLZbFqJ/Lra1WOwBXyuar9XRsqiVz5LDEMg6is3ZpRalUji2U3JHMvORRzmjbS2CRWzls4UKWxVeHOUTMMGA0yVF+YyWT7C1MAtEsmEr4Rz8bkQ9GBGdU6p5ksiLTqm22FvtFP5BlyzhPsmdgehhdRlQMdQnaue0XaPcvENZtspFFcM6OKJSebiD4dq+v58Ct0W4YSwRzaezOpIkOnHlok7AaiQVn8UEWwDqbS2ORY5WB/qQr76Fj43bWprf2iZHbcPsFmm2w17SPCJG6WMpFgA7JkciwhT0wSq3JTKtUnyqFB+KVp+SXBNJtvVEO2qbenjljnCFYMMVhINWuGo6rhobU4RLswp3N0dVh8NmsFX1dPSFuhf09Pp8Pcsr25eM43U4ahb2OJpaJlikvja2rLes403FQC2rbS7PzcG9p7zXwa5s6PWxK5tmt+wzANiubG4JCkyY0l7e2puOaS37bAA+SStwLVfyiI1HeE2NGImW8lv2+QC6pVSZpJDinX0MJF10RMegs08gnSGiE1AnI51P0vGAk5SwBE2M222lbSGfnotal/S0t/LFBSacSvxlAeaYBAHBMamXCQpNQOVYVB5QO8q5vozry0iv4PoodAxmYmgcvif1tDtwn0KHagELI1cUeZW2vlCoucV+2NLfakdXm4syuyWgdOPeL3dOw3xTubSjemqgu7OD9wP8LbxslLOmsxXdNlIhZqkJKLEGZbgGzFElleHuiIU6cW5wAqXy3RgJdLcGWt280ZazWiV3NgSg2jEOp53qlLt4Q97WnhhHgbQ2cSmonFdwKLFv0NRCGgtGsbFWMlKUBnve6cCkznYbWlsGnU3o6rSXqiykWYRbosy1SBKVJZwIfFiiU61VBZQerBB/+b3aw5ek3BnV2kqdl2JXhDNg24aAGnvkGmbKcAG0DibV8L7g7xXYVZ71CV5NQx80Oi7AnYV3WqopCpMDWmdNB27+VF6NGsfYSOFovkeow3UcIm0UH7kG7S46m/tC9znW2oeF3BwHfzhwxwTLPnRsaO05VRGY487NiT5Vq5XUPT3R2u8vQPaK1g4RldCrFPuEvwdTU6x9wt+CqW7EN8HUHMRfCV8TvqK0Lyn2F8KfCccIXxA+p5z9hM9I+SnhE8LHhI8IHxL+RPgj4YNgqhLxPsXeI7wbTIlBHA2mJCL+EEzxIt4hvE14i/AmZXmDYq8TXiO8SniF8HvCEcLvCL8l/IbwMuElwovUicOEFwjPE35Nzf6Kcj5HeJbwDOFpwiHCU4QnCU8QDhIepzofI/ySlAcI+wmPEvYR+giPEPYSHibsIewmBAm9weQCRICwK5hciHiI8CDhAcJOwi+CyfmI+wk/p3L3Ee4l3EO4m3AX4U4qfgdhB2E74XbCbYSfUdW3Em6h4jcTbiJsI2wl3EjlbiBcT7iOcC3hGsIWwtVU9WYqvolwFaGH8FPClVTgCsJGwuWEnxAuI1watBQhLiF0EzYQLiasJ1xEuJCwjrCWcAFhDWE1oYuwirCSsIJwPmE5YVkwqRhxHmEp4VzCOYSzCWcRlhDOJCwmLCIsJHQSFhA6CO2E+YR5hDbCXMIcwmxCazBxDKKFMItwBsFPaCY0ERoJDYR6wkzCDEIdYTqhljCNUEOoJkwlVBEqCRWEKYRywmSCj1BGmESYSJhAGE8YRygNJpQixhLGEEoIxYQiQiGhgJBPyJMgsmCCB2NeUnoIuYQcgpuQTcgiZBIyCC6CM2gej0gnOIJm7tBpQfM4hJ2UNoKVkEpIISQTLIQkQiIhgWAmmAjx1EIctRBLyhiCkWAg6Ak6gpagIagJKoKS6owmRJFSQZATZASRIBAYASSwEGGQMED4lnCCcJzwd8LfCN9IzbK/SiNiX5PyK8KXhL8Q/kw4RviC8Dmhn/AZ4VPCJ4SPCR8RPqT2/hQ0ORB/JHwQNKGDsfcJ7wVNYxHvEo4GTVMQfwiaKhDvEN4mvBU0VSLeDJqqEG8QXie8RlW/SniFKvs9VXaE8DvCb6my31C5lwkvEV4kHCa8QHieyv2aqv4V4Tnq/LOEZ6i9p4OmcsQhKvAUNfQk9foJquwg4XHCY4RfEg4Q9hMepar3UdV9VPUjVPVewsOEPdTQbkKQ0EvNBgi7CA9R1Q8SHiDsJPyCcH8wHvdd9vNg/GTEfYR7g/F1iHuC8TMQdwfjZyLuCsY3Iu4MxvsQd1CWHZRlO2W5nbLcRmk/o5y3UuwWynkz4SYqsI2wNRhfj7iRit9AuJ5wHXXpWsp5DeXcQrg6GN+A2Ew5NxGuIvQE41oQPw3GtSKuDMbNRVwRjGtDbAzGTUNcHoybg/gJpV1GOS+lLJf4diGP6SutX+iqrUc1M6xPojyBchDlcfUZ1iBKL0oAZRfKQygPojyAshPlFyj3o/wc5T6Ue1HuQbkb5S6UO1HuQNmBsh3ldtUS6y0oN6PchLINZSvKjSg3oFyPch3KtSjXKJdYt6BcjbIZZRPKZKXwrXAczgCrcAK5BKxsQzCWL8eLgzHctVYRVgaN3LVWEM4nLCcsI5xHWEo4l3AO4WzCBML4oIFjHKGUMJYwhlBCKCYUEQoJBUE999N8Qh4hhmAkGAh6go6gDeKk9DENQU1QEZSEaEJUUMunWuGbg/wcpR/lM5RPUT5B+Rin8w8o76C8jfIWypsob6C8jtPyGsqrKI+h/BLlAMp+lEdRbsOp+BlKH+smS68LGrnLryXjXEBYQ1hN6CJMIZSTHSYTfIQywiTCRBpyPCGOEMuxTxRFIeiz3v2YKMAelEMoogjUlwsJTTTrjdSzBkI9YSZhBqGOMJ1QS5hGqCFUE6YSqgiVhApCGsFOnbcRrIRUQgohmWAhJBESCQk0TDPB5LsVOYDyLcoJlOMof8cJ/hvKNyh/Rfka5SuUL3FW/4LyZ5QPUf6E8keUD1DeR3kP5V2c3cMoL6A8j/JrlF+hPIfyLMozKE+jHEJ5CqUP5RGc8b0oD6PsQdmNciuffWGAbLyecBHhrKARj0JsCeFMMstiwiLCQkInYQGhg9BOmE+YR2gjzCXMIcwmtBJaCLMIZxD8hGaCl+AhU+cScghuQjYhi5BJyCC4CE6am3SCgyAnyAgiQSAwWpHguxMZQhlE+QgN+wrK71GOoPwO5bcov0F5GeUllBfR0PtQLhed1p+IHutlzGO9tLrbf8nObv+G6vX+i3eu96vXj19fu15Ur7cgLly/c/2b6xUXVa/zX7hznV+2Lm6doFpbvcZ/wc41fvUaplld3eVv7vqg66suMa6ruWth16quG7qOoCLq7q49XYe6xL7QQV9M19jxVd1d13QJcZguQBfTc7W9S62rWlW9wr9y5wq/bEXRCmH8VyvY0RVMyFvB6le0rxAw1+4V6ZlVPHfxClNSlWFF3grfCvH86mX+5TuX+WcuW7Zsw7Ltyx5fJt+wbMsyYRfeCb5lSm3VedVL/X9YyuCAEAIDykEhFBRVy/YLg8DgC2HQF2LnoAHORkOc5TnTv2Tnmf7FnoX+RTsX+js9C/wdnnb/fE+bf97ONv9cz2z/nJ2z/a2eFv8szH+Gp9nv39nsb/I0+Bt3Nvhnemb4Z6C+zlPrn76z1j/NU+2v2Vntr69mUz1V/kqxxIpPEEjF3+Wp3anHUmXq9pTlKcLylKMpx1LE5cnHkoUNFqZP2pC0JUnU40WgS6I1cUvi9sRdiXK9dCNqlsd0xwjLjd1GIc/oM75sPGqUgXGHUdBv0W/X79KLM/Xz9V/oQ3rZLj3bpXtc95JOnKmbr1umE/U6HhcNPp0nv0qvtWp9U71acYJXW6adqRW3aJlP6ymo8mnTM6rKNDM18zXidg3zaVxZVV+oQirBp8KEL5QhpRBSMhCZjTFgBoQYzeeIxVur0B93m5ic4dGit7nJ7a7tiwo11gai6+cE2JUBZxO/+hpmBxRXBsA/e05LL2NXt/YyYUpzII5/cCzFL9+8GcpTagMpTS2BHSmttYFuvPHxmxDeQEqvCcpb3fNWdq1cucq90o0XlHkrUbOqC38lMLwiu1bxlFUrAbO4TxN4jpUcXVKmlV3zu7AOTED1SknNY/OkLKer4z8aTjuS/0Rg/83G/3eHhPnzAKJuBxi8fthfvC/Bn5/BTngYHoUn4NfwO/iSqaAdLofH4X34BP4CJ3CZRrF4lsyy/uXvAwyFwcvkS0ErHgQF/x8iQsdDHw/eH/oYQK4bprkeY2aZ66QmFBPqP1U3eP1g3+CLCjUYpLIG4XnUHmP9oeNCGY+HSnhcuILfSyWORd0+uGtw+4ju8O8fdMEFsBbWwYWwHi6GDXAZbIQr4Er4KdpiA95fBZtgM1wNW+AauBaug+vhBrgRtsI2uAluhlvgVrTjbXA7bA+n8fjt+LNVSuUpd8K9cD88gLwL7oZ74D74OcZ/gdZ/AB5CHWko/iBqdsAdqL0XtTwX1+3CnwD0QhB2wx6cM4pHYn1wEPbCI8h9OJv74QD8Eh7DeTyIM/ukpOOaSPz0Oen6FByCp+EZeBaeg1+hZzwPL8BheBFe+lEpTw9peOxl+A38Fn3tCPweXoFX4XV4E96BP8BReA+97rPvpL+GOd7APG+Hc72Luf4IH2POfsxJ+SjPW1LqR1INR7DsUfiARcPXTIATEMI7PntbpRm6WZpHPnt8du6W7MznYxfG+QzdNzQ3D6KNH8T55DF+f0t4Nh7CvL1owYj9vt9qL4Znh+x9APNwW/CUw2FbPBueCV7PY0Nln5fSglK5J4dqPWlRGuHvh1nnrWE2/CP8SbIMWY9ST1qP5/gA83Ar8zpG2vY9LEvW52W5fngZnvYGxj/G3eEztDTnp9JMfAofDt1/GE7vh8/hC/hauh6DP+N+8iV8hfG/ouYYxr6rPVXzDf78Df4Ox3EGv4WBYbGBU1IGYBDnGBhjAhNh8OTdSa0kMjxiKHBPi2ZKpmIapmU66bs9UaekqIdSjN9J0XxPmlLSxLBYFof7pZklsCRmwX0zhaUyK7OztGFpiUMpNkxxsHTmDKeZpJKJQ2WtmMM8LG8Wy2Nr8OpmHubF+3xWxIrZGFaKmlyMF2B8HKblSSyHelgA58Jx+UfCC1h/HO4qvfz/nRtcKb6JO6YIUVAKdTADmg+Alt2G2+o49vyeioro3KjHMCqAjT0P0Wi+23yxMkFrsZQ5ihWbxAZjTVnUJqEZygbeefsZvByOKfUeZt63+1/pNww8Yyz19h/pz89jRrtRkjidEBWlUDjSPEJxhquksLBgklBc5HKk6QRJV1QyZpJYWJAqiHERzSSBx5n45rczxcqBdGGtfXxTvpy5nWZrbHS0aE3VOgtt+to6R0lmklwWrRDl0VEZJeUO/5ppaS+qEjKSUzISVMiUZOTAk3Ld8b/IdSdmySpOHBA+Km2ZlK5Yq1ULcmX0bZmp8en5yRNrtXqtXGcxJyVHRRt1quzqjoGbk5xmlcrsTEp28rqcA+PRIubQcdlT8jhIAxe8y4+f/pZ9kB76aI9az6Y7+kIf+VL5nVOjdSRowcR0Jpda5UhTgU3mYEaHy4mvdL5Unxo0LEbUaDJS0h2OVJXWBI60hKiYlMYYv9wPCWVlZTHm0rHGQiNadv68tsKkuv4Cluid15aUcLigcP0Vhw6xhEPz2ug2Pw8PqZaR3XiY3/wrreXnud2tTpOJ5i1DtEfpREeay1UyhtFkmaMcol3Wq1GYxuYXlqZqZLMGkxpl2pRit6coTqFhWxQGx6TC8VUZRsWT7BG2bEF6drxcVBq0TDagi1XLFOZsh+wiY7xaFNWm2GcG3sA3q5mhT2UauQO98iqybTAZ3I8Jz4IOElgH2MEVHqKLv5fHNsnwpfuR4rwErsrjL+4+5Rk4nqS6AfeR/jJ+YeiLaCDLgR9bQX5eqzNOR85bFFNSgkNXxIf9lHtwfFyqwB2am0SmERUqU9mcrorLX9la33L725eXLPRXWFQKUabSKfWemkVVdWv9Od5ZF9ZVLa7xalWaaNmhREdijDndbmq866s772Hw0OyYFJclJtmVnJqdpHG4HWVd9y5Zcd+5xfZMW3SCm3//dTOAuAnXbw4EyEq9SRl9wnU+vTLWFmsDJSQlaHE8SY/iqQ3Hu1fL6lwuRWJfeOiJfczjU2obMqRRZ/DPH3yKZmnU/e6yfjc6gbvfzbzemNJSr9fAXcGy999RJZlScNjTXMXGopJCO5pMMqXdeMotDk+lVw6stufm2oWNSp1KLkcDDhawK5R6fq9XDq5lv+X3Z+JCV2fkyJbkZKgSM1JxuasHD6nNuAG4zKrB69UJGZLFcNVuwFXrhZcia9YbOrpbz+qcfcT0MNVhqsIE5B6kQ8P/HmxOVyNwPZmzG9OlsabvZ53gAw0u/Dge12usGkGDa23E6pKWlVsyBvMe6S8w0PriweJT/ui6Igblvokb7dBtePuMR13kVrZBm1rgyihM0Q4ma1ILMlyFqVptaqEroyBVwz7QphRmuApStekqg0qhwIugHvg6ci97JnI36GRvRu7JquxGtGo8ZEesCsIND/tUhkbqLPNiN9F7dkcUIzoc6Rq7URvpkLWAd+hkN042HfH7ZmwvCWoj7cULN+BsKPWN8ZIF4/knc8M8j3kP8/Z9p80w0iWHzMZdsBndTDWwy54bNpOWbUOF/LzULIsGHW5bpGcnvlAnZpE1FOfjqpwAr1PvfGptXp7Z61V5EhKS+oSFe9LzNRoV3jwC6SUNiRp1wn6Wi/PtCR3bY3AI0/P7Qsd8Nn5nNvCrlq5mb16+R2HNbLD6h5yA79fcefhGXVBAPmUsNPCLsXSit7DQWIjDfvjf28qIyXMw/jjABwNzDPM7/mzHJwMr5M8IyZaK89Upec70vGSNMPhTWYw1Ly0tzxojDm4V1Kle1KeoS3If8JTn2TQsQcbStNassc5eS0biMB9IOfGB1qgS5WqDWpZ84v0h/SWFJXpHafa3AyLLHpeu12GpyFrvk8fARHiY5mFvhl7l0evj+N/NUz0FiD2QOrYxixsiRu8SpmdletI0Bn6nUSv0fWz9I7iXpDUk+j38o+Qhb+Frr7TfWFrqxudk6cmV7DWSuYP/hjojNibTulwZDpMp/rsGjk0VzYWuYS4r6zNYnLHLHYXuzMTBx5LHmQWZTG3xpDs8SaoxmZtdRVnpsd+a3JmuGCaKmmRPeponUTXXjPuOzllWILSVrB9fvWX6wByVQa1QqNG4V3m92tTijMEMd1NTfWbVTZXCfJVBI5drcCkKUB/6WJ4od0IsZMD5ZOXHIU54El+nU/GqgsSTD4a5uPqaHAl0MOGrT37GyQcDo6MiHl7+2RJoIXbKMVFeNPJRLE+sv/3jm7e9u7UWecv1726rG/zMVtfd3nFpvd02vbuDU9h6x2Bv28w7j++87URg3ow7v9m7+L41k2vW3TXn7PsvKKu+6B4cJfckEVd0MmRBd/hJm67YL1wPRkgRnvApweiUeonHLPduhULj6Bs6gTH3Hl98g0ZaSLznuG3z0R7pDz9Pf1jByKBHrjXcpmTS2B1GPmyZWHHpL7vPDW+mmvxMlu9pWrWmOWewP6+qLmv56jJ/SbJ4+dKfr5ww2Dm0ijZ5vVHmSfM3LKhoyVYP1qRN9IdHXocjL4EKuI1GvsfgMWap9gvP4ByPEW4NZpUZpW9IeQyRvhv6mHO3z2eeGFFM7GNZe332BnNkQxkaTynOe8ERnHru9WiO3h9Xy7AdKUP0iN8xj8mcKvJTRRQuF7PJxIpcGS5XxFp10anjCrILUjSyVfGZ+b7sxojhcu1sZmG5Zcb6WR67b96ElMLczNiletXgg+PK4wpzV28c2zw2OU2tV+EKM2qYPX96YdJg7JA9t+VkyER1yaw1dZPPaZ4Uq8ssrfGEXA5xoa8lRq4YvNaSX8F3qbLQx3jIcUIN7I88yyYL2x5OL0gv0Fj4N9dA4+Eb9xhQsdy9xjH4Y5oQMcmEPpbr00y2yLOaTJIfmfifm4YtE76puI10fDP0c7eTznL90kHY82+q9uRKlEVWIr3ZeRTh+KkHZYW4afqlD3VOWdkyPkktw+ObrrB+WU3e9OLkvLoFSxbU5VV2bW/1zK2fFBclF8QorVqdVzV3jNvnjvfOXLhk4Yw89pPFt5xZZLKmJeV7rNlJanum3Zw9yZVTlu/Om+hf1dC2uc2jS0iN05kdSSmZSZpkuyXeWZTipvSVaHdN6Lj4CXp2GvjDKxoUfcINuxOMipiIHWL62Jw9vpRhi7CAeQ8NHOaO+g9zRSwy7Chmj+xT0pniE+noeoCfKPh5Z/CAio62KvEafpiV3ZmSlag50T/kTLGaxKyU1OxEtToxm3vNptDHsgfxBOSGWdT7A2ATrsEVacJTqUblajQ0WqSZs/C/TQ6bubLIRutT/4NMw/fWk6eh8K467GHzYNWVz1267smNUzXWAunc6JraOXHSggqnhg8sH0+U7605cGnFxIv2XSQOrYwBWd3505yumnMqRPXwU50B95oEHFM21EVWglm4MajV2Ph3GbMtgNPjU/k0zkaLIqZRIVk7plQ6Ww6Uvt1veIUP65FTUvlITk4CPkilFzd8cJpM5sKSkjGx/B0WX26jhJvoeGfVDN4eqzZPGuMZY9NHXROfFS/EZsZeLdenFrlLy8yaGPbpYGmk2+xZ4QlnVrxcpo7RDT7pWTy2ZLGHTTDEamTy+Ox03D+n4upeLb4KheBjWeE3WaW5qE+YswcyMmBcn1DpMxhFM/vSzMx9miL2bREr4n+lVGq0bHpRkWdydh9L8FmOpjFxfdrmNMGXVp/Wnibq06xpgkaWliZLwfcSn06Ds5iSYGB1Kcc90/iO6VNiZOIHPk2dDBK8kWemm14a2trmt/Ed1+tuO7+/7Xx0iUOl/P2O78A+/X+5N9Jezj9swGNNcfjDIu5whcXhp3tYI5NcMIp2FFNhQckYcXWcOzs3yzhm8xlT18zKm7h2z5pZxozJeWWd0wsNaqNaoUqumrds/Fk3tud80z7xjJLEqWXFrR6rzhAVZdBNHV/urDm3esbK2vSS7LLsuOS0ZF2Sy2xNT3Gkxmb5N859Iya90D7WV1LE/2Xqxbj+QL4cfXUibA3Pq8pesl9ox5cgt/ATPBLEq0qK7TJ5XmSbyOtjtT6ta5qlyjC9VFp2pfzLHD553dCy4y/I5tLw4YBPxt4fW8ewBZwR/92VTB/cRI5LUUaTSXoSQtGCLXNyZ0ytTMdtJtWalajS4JndmZeiSauoqM7s7JmVOXjCmD2lMDGvsCS1uKM4vyI3jn225rGN1UbXuKwO6Vmo0qvljsjxcTAWT/m6mRt3d5We3ZivSyvJHHytYmpB/WJc79WhT0S7+AoUR04WwWTIeExYJX3GYwXr0MdY6fzrKrHTZI+yashHb1SrWV1+jjT8HP6dF5+yLvJRjXvow55DBeEPe/61mkZ86hN5linoUaYY/pEPDkUelTBu2izPmdvPHTPlgrsXZNZNKTYp5WKcwegqqi5YsCSpsK6wqHasS6vURMkCSY4EvdmeZPCt37Nq41Pdk/BxZdInOBLHedH1tl1Xfd40p9VlVVmyub/V4j7ygnwpuKAUbgxbS20p3S/Mwz3fK6zwqWLtVerSDItMlx1xFlyrNT5lwrQiaXxFGNvj09XJp0eeUuQp9ECgpa/8sXUMfyMcvmbx4DXkdKLLNfxsPkZ8QZWQlWrLTFRXbpu7eHNrZuGC6+bXrpugllwuWXO8pLMkf6o7Piaroigpv7DElhZxr85pjehRndztJo5n70d8baCoojq/cVHx2LObCvRpYzK53aah3fbi/uuGIiYnu+2OjbXn8O9ou4tkfdxydjEnNkew5Dwl41udWcvqQGaQCdPrZe0yYYcsIMNXqGQvWoR/DMTps2Ee7weuaQl/BZ1BJxhFnTJBw+qUCZhB+XdfcsSJ3Edwe+sP73Rt589rc/fPa+Mn3rfxGOaVLP6fbVvaFhQO+zC/jR/p3UJ8Rok0T1Hi3qz0gXct49smly+sydMrNdGiIIvWjpu9qnzN7gvGT1p9/9nLty/O+0qcMz9vqjdRYMc9OaVtk9NizbFRMfZEk9Wk1yWYjRPWPbp+zeOXV5V37ZhnO3tt+sQmL87LOaHjbLN8Bm6WdqiMvDeahMfxFSse91AVWNmFD/sSDTXkaq+gr518Q/xu2vd+nBTL16mrGF8ACkxsXWQnizB2UrN//ER/84Q0FX2SqBLXoW+hJ+lVLG/6uLE108eXghB6c/B6tgN7mg55MD9yLnEKjwfdGjyQzN+TmAgF+Cp/4e5Ma00c/86dTz4z/Er/Sr+xsJBvRVK/d/9fMp4cQ/gUbRp52BoxnM3pNedNyxqXpJIJYrQqWm79P+x9C3hU1dX2PnNm5sw1k4TJbYhhIBASCAkEhAAh3BQk4RK5aVEgk8yEjOTGZHI1Ny/1QvkptbZaPkVt/dRqi4jW2tbqQDBBBLSAY6KQhoCgNNqIEvNBzPnfvc+ZySQEpd/f5/n+5/kyy3effc5ee+2111p7r30mxIRa4iINhmh5bnRedH5K570/mqQ3hEbcEBE9LlynCo6dkcb//OppYjeug0eqkdHCyFz5WyuTMYzDBqnXcUbC6ZWYbTb9Sm+RZHb5Kz2Wv9ePfNX3eOgv9q6yvt/o/alC0oE/htWaQu6Rz+QTRtCUGkP0io17SQzeDbtexZbN3hEN0jvisnn6eZMyJkSNXRK1VFKBHvvo3iS/Zc9kMRP8L/UcOAu21wtXf6saJp0lw/hjhugpY8dNiTaMGDszbnLOjb5Z6iwJo6wTInQZv1p1R+2yMf5Jc9/Nz7jxhkULv3vZH3s1vtqmrKy0TVttWCO34IyhhDUGfbdSxr5bKRv43YplntaU4f+mJDrwRHCN71a+t8d1fLeiVKZVv3F3xR536pzqP95duac0te+7sJRVc1NXTx8ZPmV1+szV0y3c5643H8pYUPdGueuvD2bMr3vjngXFK5MSVhQvxnVSwvJiepLq+4WSYJaBJ6nR03W+k9SPv+8ktSR4xf/zSeqHZASepIYIgWudpJDMNoyfPyfN6o+FqIRRMThRjc9cvio5h56kLockLEyJmkJPUtnTptycGMZ9UfH2A7eYRiWN6rvT//1bmy8wnPFzEszLHthbMdO5coqJnqQ+Xrgk5dY8ad0o/sLeMkrkdRNnwmqdZyAWk26ULlnHG3kdTSJ6+vMMbhXeoiZmxJnCrEvClkrvSVLcb6TZ6YC8YnQ/zB9gG2n217CPWvEXZA6dxhwVExo2YRIWyqAFEpuemhptjLFG6lXY0DLHJll0gkYIGZuW+N2Jq5dIccr8OBMvaHWGsAmYfYTYqdiufIXMIj+XZv/HkBDj7AQSO4n+NlmEcZLP55Nw+ns19pYbjL4HRnocjLhlCv330/ME2fNw+xG2aKZ+l3IgJURK1H8ik/47QqR9RCl/U053b+lFxmcdKQGr6fdV4b6ErNiuD41NnhGdWXTLmM0jzHTCd+lvkPaX/dQE5hGNSbPN1qgQQa1Xq6oTk0dgP49bUbmSezd5xg3xEbpmBI9KheBp1kXE3zAjuW/9kiWCVhDCxsJa4dhjX+WbSKLve4+9waNHvaG4//V5YaOt6tGxbyjWzzPMI9bR8UtG6y1L9Et9r9lRyZbIU5ha6ExL8CkLLvRtexCTHBCC/2cC/ftHxIgI6WUbR+VXOV6l7PtGFTJ+4fQbF8aFqPq+UQucPnrKuAT6Ndx7avVB3hidHDcu2aLjn1IFhYQH9baGhOGt2hAWzI83W4PUMIRSpQ0xfLclKkrxU0OIVoWTIc1j4X2/4F/D/MaSfPlbf06rDSKWkW8oFrw+b6zFqrNEvqEonWeaF2QZtSRKN2KJLlO5gmTKP+hgE408EThP+m8a6FnNMCQ7pjyal468M0bExY3n4qb5vmKYOoKl8XCzoLivQJu1LH5ypEKoMIap+o4YI/G6mxIdJBzjPeoRiTMmzhyp6TsQFS4ER4ZwE9VRQfy02HFhGt4QFfHdSwqbJUSjCR8XRU+058SvFESVj80xgYx6E2emN4gVZ6btr+tV40YuC15E5s49dVTe8X1u4PvPEIP+XcVpThc1EUswSsdZDKNujI+fNsqoMo6enpAww2o0WmckJEwfbeRe8O1G/Daj2agWjCOMV1YkpI4xmcakJkyYGWsyxc6kulXxdsXHqgqfbmEKNdGT0Qr16wmqkXGLgxdDtyMp0I1+U+PPL37l/NssH8fsFqZo1IaNsYyMNeOEOzLRak0cqesr0JpjLSPHhGm4CI4+nD+F3+7/NuZtX+D3zR/4LCyM/Qu/XRJxy76H2q8mRdX3Ez+W0Z3fSy/1k7JYNTqAHh2a1CGM9ksk1AXQKYk0i6+DXhmmQNI+eS3SzdV9eDXpt0hkmPM/So8MTUZ1AN0ygN4PpKAF16CzlEy530OX/30UfNcA+niYhul/O4XE/39LFcM0TMM0TMM0TMM0TMM0TMM0TMM0TMM0TMM0TMM0TMM0TP/7iLC/QMRnoNzKEyKQNKIkoSL9202Z4lmUdjEbZb54CmW1+COi5HaK+1B6xKMom8VGEgrOr1DaiY5EE6V4HmWo2IEyE72iyQaxk0RzCvFTlMG0lbPQVi5GbENZy8qd7IlHfA9lM8p0SDiPMlM8idIu3oUyHyOmQ4elJB38rSg94l6UzeLvSSbGPYvSLh5HWS2+TW7DkzKUdvEyymrxa3IbdGhBGSx+jNIC+bdBh7+jrGXlTmJC2YxyHUb/CmUmNF/H9F8HObSsRt916NWBsha6rYMOX6JsFi+QDWzuGxjnBnC2kg1o/Rxls3gG1lGKG1GGQkM7JL+LcoPYjdJOoogdujlQBovLUVrEApQx4gqU5eJjKGtZ/WFW38ZKj+hB2YwyH5LfJdUob0UZKu5BmSm+inID9KyGZDfKYHElSotYjDJGvBPlevE0Sqd4DGW5+ATKWvEOlA+z+jZW7oTNqzHWX1A2i3/gFHjyBUqPeAZls/gJZ8KTHpQesRtls3iJC8aI36CsxZMYtF5E6WH1ZvQtZxLKmYRyJqEW9csom9HrYSbtYcb/MJO2DdKOowwG/zbqNZQx4ucoa1ndQ0JRNhMttxOcnSiDxU9RWsCzE5znUday5zvFzzgPeDpQIg5RWvDcA54vUNaycifRofQQzIdGAtcM/tMog8VzKKnMZjZ6M/gvoKT8zYy/Gfw69u8zJinGEN9fn7KzkmerLIjd0bqCaPgJxPeX05J4pVxXkkjeItdVqKfIdTXqGXJdIOV8jlzXkAmQKtW1xMq3yHWd4mn/WHqylu+R6wYyQblcrhsVjysr5XoQKRCC/X/DLEWokescEYTdcl1BlNoQ318rIxGaPrmuJAatVq6rUA+T62rUR8t1gczWTpLrGhIm3CfXtSRYmy/XdVyWfyw9maitlOsGEqb9jVw3cku1b8j1IDJdr6R/aU6ple0s1SU7S3XJzlJdsrNUl+ws1SU7S3XJzlJdsrNUl+ws1SU7S3XJzlJdsrNUl+ws1SU7S3XJzr8lVpJCJpMpZBpqy4iT5BIXKSalQB5x49lC1FykhJU2PHGiVkSS2N8RKwBZyUo824SV70YveufA1QHucpR2cC5EvwLw5OCZExxOxmcDCiHLzniLcFeKZ0WsTervhAZWwAY++jfKqnBXgZobY1GeMkh047kDd1TnMvS2o70I2lApxbJUNzgK5TEphxVzLGZj0lFK2VyWsLnm4QmdYxmeO1gPF3tSwLR2y/PIRUsik1zInhQwiTbYSHruG6UQcgqYxUpkLYvwpJCNKsmk83QHaEBHLGFzkezts7akOx2pGBawYv6SxalWheC1YXw3u6Mzdvv9IdlMGsXKdC+S51XMbJvDOPs1DpwRtVol6yfNejPuk1g8BHpzPJNWyCRUMTuUyZ4PtDf1mDR/B9Ofzl/yi4tFA71KI1JfWyGjxD8bScdNMk8p7qpl6W7MQvJQud9LNhYjNjwtHDAvXzTnQhMbGz9XHj9piKifddU8rWQB2pAJyVo5apxyfN0ICTPI1EH8k/z8145+N9PDzqKT6rTZ7xefvYZaj5vkWC/xc9NolqKgCPwOFk9LwZFL4pmdE8BjZ/IWs77FTL4bVIKZJoMqGCWxdTZwvCRZejLqVSwqNzGtSyChCk+pFfOYJWj0DpTqe05XsDT7zX55P2JzkCKninm8lGnoZrFdytai1NvK5kDXhYN51cnGcDC/5rC+PmvdTNZg3vPlvq6AFmlN2ZlN+tdJBRsrl62jocaV7ilvLjxYxmxo98ednbXTlS3NwBdrJWymRXK0SbIcrKSrZ/C8abu0SuPRi3qKRkOOf6ShtCq6SvL126hfum+ntMp7nZvpnTtgz7l67r4dZrBeswMsQGcizUXaeX25w+Xfxe1sHyti+5ntmjOV7GwbYFNpFyiWS2lWUr2MRV4Z62lnewKdjcMvh3IWsFXzfR76d62L/jWRzLSha0DKBknMVyWk8rfWlMlTplmXOXNdxaXFeW7rwmJXSbHL5nYWFyVZ5xcUWFc6N+W7S60rHaUOV7nDnrTQVuDMcTmtzlKrzVpYbHe4iqyltqJSK9qdedY8W6GzoMpa4XTnW0vLctwFDquruKzI7izaVGotBqvbUYieRXZrbrGryOEqTbIucVvzHDZ3mctRanU5bAVWpxtj5JYmWksLbdAg11aCOu1SWFbgdpZAZFFZocMFzlKHmwkotZa4iqE3VRvSCwqKK6z5UNzqLCyx5bqtziKrm84DmqGLtcBZhLGK86w5zk1MsDSQ21HpRmfnZkeSVZ7m+FJroa2oyppbhslLervzMb6jwuqyYS4uJ6aNjrZCa1kJHQYSN+FJqbMa7O5iTKicTslmrbC5CqWxqJlz820uKOZwJflNP8s3pnVBcYF9LUyDyVhvTJoxVX4+iT4fYH63y2Z3FNpcm+lcqF79ftwEq5fQx7nFMEGR01GatLQsN95WmmC1O6yLXcXF7ny3u2RWcnJFRUVSoa9fEtiT3VUlxZtctpL8quRcd15xkbtUZqX1PBuG30z5flRcBuNUWctKHRgcCtFmqw2+cLgKnW63w27NqWJq3bxm6Xy0utgNPGUvk3xSke/MzQ/oi6uzKLegzI6usJ3dWVpSgAGo1UpcTjDkgstR5E6y+sYuLoJL450JVkdhDu3UL6rIxzykRoydBiUcVOp2OXOlyPGPTgPGJ2s2UyDeiVEQvHR1uGiI24srigqKbYGDQmebpClCANOFjWmlzF1S5obZy525DsqT7ygoGTSh6/EF80Sy3ZFnwzJIspWWVPr+oq8YSR64+v/Dy95XeJzPdXiDF0QRpUJ+EyFcPK6PE+J/xxn6o+QfMxg4Tv4bx9fFbzRSfsXt18tvMjH+ruvlDw6m/PxD18sfEkL5ldbr5R8xAvxK9renNXgvovz0bdQq/z1pI4kmFpywx2NPnUbSkelvIsuR9XNJJvbT20gtWUe2kg3kMey4z2IffgUnxbc4BXmPMxEvF0zOcBbyJRdDrnDrOTXn5MxcMTcW7/1T8L6fhjf8xXh3X4138414396Md+hyPoO7j3+M2wHVHx+oF/fEv1Gvs9Drn9DrO+ilgV7h0CsOek2DXnOhVwb0ug165UCvYuhVDb0ehF6/gB5PDtSLnxmgVwT0Gge9pkKv+dBrBfRaD73c0Ote6LUDeu2CXr+DXn+GXgehlxd6nYVeXdBL5CycnotBuR76OLkbMfpi6LUWeuVAryL6vQf0ehh6PQa9fgO99kKvfdDr0EC9VHyAXlHQKx56zYBei6DXGuhlh1610OuX0Otl6PUW9DqCpyeh1z+g12VOwWk5ExfGBXPjoNEU6DUfei2DXndCryLoVQdttkKbX0Kv/4Rer0Cvt6HXe9DrY+h1AXp9PVAvdXeAXiOh10ToNRt6rYVeedCrHHr9DHr9Dno1Q6+PoNd56PUtyecEUs2NgV4p0Gsu9MpiloqBLuu5u6HXT6DXLuj1MvR6E3q9C71aodc56HWJa1Yo+AxFKP+YIhZrMHGgXtoxAXrdAL1mQa9M6JUPvaqg11bo9TyeHIBep6HXRbIBXrNzOOdwU6DXcui1EXoVQq966PV/oNdT0Ov30Ost6HUMep2FXhe5hxWE26YI4XYqRnEeRTL0WgS9cqFXGfSqp/uWRhA1QmRk2ti8urw8jYpo1CUHPfgcLGE3PR4P/vP0aASi0TQ1NfUBTRr6fYdH/miURKOS610aLdHo9jWcAX3b8GHDqYZ3QVLfc+e83qNHm9hNTRP71LAhulpaWrqoIDWU6Tl8uKfl8OHDPk26KiMfL6Et6t7J0seniSSAthw+XFlJW9QqolZ3RVa2tFSy7tCnhcpWK4laVUL1k+YUSVnAxPhLWjC/Sq2CaDEjIk1Dz4taPjubZEsfz4D5SqNQAS2yAHyoYPkppqLmiVrZzrgFpSgos7uoGEk/cGSVSOysOjk7W6PgNErGjfF5ntOonn76aTbN1NSCggKYXKPmNELlAcpyAHPjAvyCFg3s1XuYGm2AXyibXO/RaDmN/mq/cBptv19w4/cLHQ+uONzD/MJdl19kTeinkvlyCL9o1UQrUIUoV0+AY1iDwWCooQ01ajVRC5WHez2emu/3jNzqcw3txkQfliXIushPMRs2ZFd/4Gb/gG+02Jok3zDnqIiWNmm1RKuNxtKdDsoF1ZN9DfsatAKn1aTlMO6cNK2a0wq9HslRvbRN2+RbQQFi8dGqOK3PVZ4erZ7TGtvx+ar9b9mfgA5lHwVpNZxW13jm6+OfvPd+cyO7S8trpJ88NpTGN0WP/455jAoX4LH2klS4jNnZ57LJksxGnxQN0Woa8/LS0iLxEdREECq3UY/U6NScTuNz2+EeQcUJ0jZxsIQ1+Rx3uEZQc4IGdu9FoOoUnE7pd53HyBOdst938J7M4PuwvtIQh31yqAN1/c972JLiBNmFsBzRwoc9TF6qIEDlpiasmdRUXUA9cvJkOpRvl4JCShWnE+hq1emITmcgMaCpIFtDPYgy6QTMK62ug9Y76tLYNHvhzR6o0Nur03A6ZjhRpOWgiVBmwXcDZgOnC2ov6cKndQ+l9ye/P7kJpNNyOv3phq9AraAjoGZQYwNrSEdUnWnYJ9OZhnqkB6qVtpeGUF+vrCS77YV5mpqYkpW9Bzw9NYZtvZU6DdFpRDFS/vh1xuc8ZkRbGwPcTY3cCz/21ugFTq+lup9kI52k/hYq2X5TydrU+JSztnLJUb1weG/NDzi83aNXcPoAO3kEgRO0bJCmJlavYUJrdP7nfScpG403uk/LHlfD49TllamChgi+SegC6vA4HcvncdnleuZyvZbodb7FO50tXmn57mvQazC59PrTrM/p+nQ6WU1fH3UiHvT16bWcXu/ziAja56cBw9GdSo3h/He9vXojpze1p7andlV2sfRz5PEjj7//eHNkcyST2h8G7wYEgl7H6Q1zSX3D6QDRpz31DXMJc0R/KHio7jp239vb1NTYSBVgwdBeGU2jQa8h+oBoiBwwl4FRRlm1/aERybb2yt5tWOO9BQaBM/QHBxwkJScM5DnQW8la/eGB+JDySl9Tn2d/X43sf1+AeIKUol45eTLx7UeTu9oNCs4QGCIeJuBk3zkWJD5pLEr0UkuTL0xYxmvpaZfWoIrofHGCQNFokE7plOic9IE3CBWDQmHw779yrBhYrBj0xGAIIkE4P1Ka0jClod5T78n24L9sg5Yz6EbBOdkN6OSnbOwgowgzBA0dX+wYdJzB0D8tEdT/obMOjB4P7a7pv0X3IM4Q0h7dHt2V1pXWUtBSQLfD5m3N2xoNjQaDnjMY25HKurJbsk9mH85uym7Obsze176v3dPOGqGmrLWPsjEPqKnBHHr7mhsbm6UwopPS9xGRNDLqI72kidVoeLBJpdXtR0ylBakfgLs1xKANCKrIQbMcGLJssIC4imRJsabvAXUdDRWjhjPqpMg6T/eovpMsk6XWnMWzszWprJ3HZ3Y9a6+fLWXBuvONIl2tshH90eUxKUWDKjC8EF9GBWccYGkPE9ImnpF2Rr9Itkka6J1fHY+UqgVfjHn0dE/xBRmijJ0LqKFy2amAbi90ozEM9dgAigQZFQpjf/BR7VUqzqhhB0wiv1nryK/x5s/nVrkKiHmTy7GZzCqwuYvIUrRwq1YusEIOEUX2TqHGO6tZvuOIgNgNY8+lJzghEhMJB/FLsrJuIWNXrlhmJZNXr8y0YuFLPPS7jWD2t4JE1HUkxC9dSfTsHU+6U2EGI/B2PDK3pLSEPMvKF1m5h5Wvs/JNVu7f7HAVkYOsPMrKE6z8mJXtrDzHyk76xRu5SEtOzUoLK5NYuYCVa1l5V+Hmws1cHSsfYOV2Vv6SlbtY+Rwrd/u/ofihkrvOUgNL8rABDkmo05/K/s89U8APxn/5GoQjTxJZyX56cy95hPya7CX7yTHSQS5yOFWzmWrk2XYS+rNpHv3MiFyOvjdys6TrQyek65M7A/og3s5bBtxzKvfAe/WugffarQPvDaED72PKB96PHtQ+5pGB94kvEK0i4H5SQUC7mnBzXxt4fzNelRHrKhJPsjCfIPS5F6aarMgi9YpnFR+Rp/kn+SfJCaVb+Qz5UHVc/RDH61bpbNyfdA/qOe6gIdhws2Kh4Q7DLkWV0W68S/FXY71xm+JAkCJIozgW9G3Qt4pWwt2TRW2jPm7cMyQdAp0wtgXQWZkODUFfBkX7aQxoGigdZGf0yGAyHgp6Imh38A6ZdgbQs4wuD0UhypAMP90fst1PXRKFhg9B8aAk86MBtEsi1jKIzL8z7/fTwbCPQe2M+oai0PhwQ/iYiPtl2hpAjzLaPyR9EHHZR5HmSIufbpIpY0jKYrRWvg6kBrmkfE2MTvhJ6t0W2RU1IcoetSvqBUqDpUftHook6VFvRHXI9E0/0VGiLrOxGihuWBqb5Kd5sYv8dLtMG0Du2A1j40DTxo0Zlxq7AeWYca/HvTn+EKPP4peD7AkWkDXBm9AJeBMuTnhz4iOUErwT90xsA/UkKhI1ibtBB5NSQDclLU/eIdPeKe6plqknpz0wPR6UMsMwY/mMgtTnZNqT+ufUg7NiQImzymcfTuumNKdmzm5Gn6XHpD8q0645n+H+0fQWdteSfgH06FzzvPJ5z84Pv3keqGlx1pwaiRvXFolrSRzlWzItQwejxmXsyAxilJq5ktE3SxVLI5eOyfwGtSxQ3jKyTL3Mvqx7Wffy6OXnwJe6YvWK1UuzUObQGih/hWtFQ5aaUWLWckbZWUVAdlZl1r1ZlWh3ZbXcuu7W7Fsv3npxZfDKXeBLRBtrWdmTVbkqZ1XBmqO33XS7d/2O9TvXP7vp3k0t+WvzK33X/BfzX3ROLtpe9HRJ9xayJX1L9pa7tri33Ltlz5b9W85u+XJLj0vtMrsmuKa5FriyXF+WBpfGlZaU1pXuKG0qbXfPcq9273W3l1nKTpRdLp9cnldeWb6z/LUKS8Xqir2V+ZVbK1+rPFrZXqWriq5aVLWj6lD12OpF1fnV1dX3Vz9Xvaf62N3muxfd/fjde+8+XKOuiazJqLHX7K75rHZCrbt2d217XUzdtLq76h6q89ab69fVv1B/riG64a1r7Fp7Bu9MA/edhrP9RHeUe4L6SdpLrrH6MgavuYErRYr1Ifcf3x4UQAN3kXum9RPdH+5Z0E/SzkB30+BnI5siHsWOfCK9Bfsn243ZFTtvSAZ22keCngjeYTzk2z1DthtPhHTF3k77GvcEPdK/i0pWwj6dznZiiSs66Amf9ehTtitT3hO0nfHLFoTcPcY27OlPoMcJJu0QtNuB6wlG/Xni7KD8kB6QEfpzwhNU76vywLOD8wD2fqW879/v2/GZHPQOSkf9Ed9eCH+8IPsLu5O0A0k7nOxH7IrYA6nXbvfvjz6PYpeLzKD8/R6OXQQ5tP0bPM+K6sD9VdGAPfBEwG46xB4buKdevZ/Ku3YTiyNpB53n2zvpno4ni6hc3C+KzJoev2J1WJ+UydgVWSviMnJVX7gBeUjOPL6MEhoe1teffaR4pPmN8of1UQ703h9uoC30CctleELbQsONh3xxGmlBeztGgIyI+9kde96fUQNzKtWJ5U9fBvXnUORMwxA589GrcuYHUqZEjjT75oL2y5IeTJP7M1PDPo68CboN8Aa14uCV67O4tCKpbaWIib0d1s+gvqV2icwyP8o8/wL1VMDqToraHRruz7UnZKkNUjxQv0jxFbV73JixcRKkrDY2jmWiAKJZTcpoLCf+N4nl0QC6moNl1wCSs6yfru7Bsuu/RCz/Xjf5s/Q1aLClKPlz9zWIZfPrJnbCuE4abB12Lgmgq+3HzisBRCNd8vS/RldL/mHtro8kO9PzStATad0ZujmfGU/Qkw6jGvokrZuebujdnJoMHT33SG2UcGpKpCcl6SnLRRckYieieew0Rc9NLekt7ExEz00t6FHDziNq/7mFUmKWekVOlpqeWdhdonyykeqJOPfk0yfsdIN+9EqJ8qOHmknLZq2JtIzaDe5Een4KN2QGrcihZy16zmKUyp4E0XMWu0tdkUN3IrkNRLcJeiJjJzQFO5uBKD960BMcOOlprP98lpmafoHZ4zNqiVsvSnZI62azgb6SnkuzqGR23lNQWZLcgevwan8GRsH4Q9IdUdPfPuGXib/j15Ao/nZi4l3ief4tkkDobya8h7sWVuvk14jnCYfyv4gC5XH+dvE43s1fErvJAbGbyyaxnI2s4XJwzSXxnJ3EcJtJDDhvBedGvkB8l3CQ8ylRgtcE3hjwmsCrY/I6wfUV0XIbiAXtk9C+Ee3JaJ8EWSmQFY/ezzN99PS3VaBvDF8j7uNrxaeg71T+jPgMf5ZM4j8lKfx5tH0utvAX8Lbr07aDKFEbhVoMtHkJko6TSmIiN5JgYBYZTWYDdsh3AHlAqXiKuKFVGVAOVACVQBX7/Z13yN1ADVAL1AH3kShyP/Bj4AHgQeAh4GFgK/ATYBvwJ7yB/xnoQb0PEEkURwAOyCKp3K3ASmAVsBpwkhVcE4nAjDfya0kafwcx8BuBAlLE12Om95BY/j4So3xKfEf5NPAMcIxEKY8DJ4APAS/wEdACtAIfA58AJ4FTJEoVLLao2sV3VP8gSlUn6l8AXeI7ahW5UZ2A61QyWj0d1wKxRV0IFAHFQJl4Sl0OwDZq2EYN26irAdhG/TJJVe8B/gh8S1KFCSRCmAhsJFFCNpADbAFcQBXQANwDwEbCDuBnwFPAMyReeAnXL4AvgS7gK+Ai8C0AG2pyATvgAMpIhJaQVK2ZRLDY/RJxrWO1z+H1HhKGqD2EqD2EaItFtGUi2u5FtK1DtG1EtGUh2m6hvxWEeFnAr0Ws3Ca+iLhZg7h5CBLc/FviTv4M4uxTouPPiW/zn5NMFmfnwXWOhPhXxQaSFiB/I+SXQv4ayJ8P7hxZ9gH0mgPZT0P2S7K8LBIUIEUHKTMgpQhS0iAlTV4TM6DleUhaBUk/g5QsSHibzfSPrBYJGX+FjL9CRjy3Ufwz5KRBjhNyMiFnHeQsor+3BFlp3OPiH+jvJ0FeKORVQbNSyLRAsypIe4TvEL+Cdgf4z7CyPkfMXZBXrDFgxU6C1BR59dMV+yF6nsLKWyY+ifjVSzsM/U4Xz1vJr8h9Yie5H/gx8ADwIPAQ8DCwFfgJsA04JF4h7wGHgSPAUeB94APgb8Ax4DhwAvgQaAFOiX2kDfg70A6cBjqAM+IH5CzwKXBR/Ih8LZ4m3wCXgG7gW6BH/JD8F9b0ZeAK0At8B/RBF1Hs5AjAsV3xHL9O7OLvFLv5Dbhmi93KY2Kn8jhwAvgQ8AIfAS1AK/Ax8AlwEjgFfCZeUX4OXAD+AXQCXwBfAv8EuoCvgIvA18A3AHRR9gEi1myo+IEwT7wi3AxkAJnAcvG0sBrXNcA6tN8BbBDfETaKnUI2kANsRtsWXF2AG/UKoBKown0Nrg243gM8gPqDAPwg/BTXHbj+DPg56o8CvwB+CTwG+U/h+a9Rfxb1l1B/GfW/APCRAB8J8JEAHwmfiH3CSQA+EuAjAT4S2qHjaaADgI+Ez8WPhAvAPzCXTuAL8UPhS+CfkN0F2V8BF4FvwAvfCd14/i3u4SNNLmAHHPCXgmwnZnjqMuHJdrHVn71UuPsT7rbhrhZR3sK/T8YQDk+7yU2ITC8i04vI9CIyvYhMLyLTi8j0IjK9iEwvItML7jZE2hVE2hVE2hVE2hVE2hVE2hVEUSciphsR042I6UbEdGO8IxivnV+PlWADcsRP+VzxU0SNF1HjRdR4ETVeRI0XUeNF1HgRNV5EjRdR40XUeBE1XniyG57shie74UUvvOiF57rhNS+85oW3uuGpbnjKC6944Q0vrH4FVr8Cq1+B1a/A6ldg1U5YtRMW7YZFu2HRbljRCyt2w4peWNELK3rZij1CBNgyFStZjdz7JHLv4/wHZDT/NxLKI9sw+56X7Xua2fdh3M3E3ULYt5KeLcjtyJNm5Ekz8qQZedKMPGlGnjQjT5qRJ83Ik2bkSTNGmoRcaUGutGDNtmHNtmHNtmHNnsKavYQ1ewlr9hLW7CWs2UvIpyas2Vas2Vas2Vas2VasWfgbu+1aEo91+gXWaSfW6RdYp518Dknkc4ECYpfz6CjkUTNypxm504zcaUbuNCN3mpE7zcidZuROM3KnGbnTjNxpRu40Yy22Yi22Yi22Yi22Ye1dwpprw5prw5prRY4zI8eZkd/MyG9m5DUz1korcpsZuc2CtdKK/GZG/Lch/tsQ/22I/zbE/ynE/ynE/yXE/yXkPxPynwnx34qYb0PMX0LMtyIHmpH/zMh/ZuQ/Mzx1u/gFjXrMEWsbp7Tt2L3XIHetFduwq/8H2h+CP/6A1ucQ8yn8MdSxKvkPkceoDz8C9ylwtWCn3i7W4a4KfVvRlz61y3nwCPpOQt+j6LeIqMH5HDhrwdkBzr+D8y52yqKR8yKTdAfal6H9KNppjCyApG1ofQaS4iHpACQlMv5Odlo8w8pu5D8TzoLrgAKgECgGSoAtgAtwA1tJMgnhPGytPwHpj9DRmWefBv5CpvH7gA6cc8+QRTgrmpC/zTgrRvGf4fo5TlYX8OwfOJnx6HkUPcJxsoyimR39C+jvc/PrcO66g2TxG9gZDFkamsVDs3hoFg/N4qFZPDSLh2bx0CwemsVDM0QfxrgDJ7YNuG4kRaynGT3N6GlGTzN6mtHTjJ5m9DSjpxk9zeiZgp7z0TMFPeeznib0NKGnCT1N6GlCTxN6mtDThJ4m9DTJPTPlnvSMcgc8thHritr4z+ykcBnW6qC/M4pcfiuwElgFrCZanOC0OMFpcYLT4gSn1dLfM1XS3xNGn7tg4aXsPE59dJac4OLFM1wCMAGYCCQCk4AkIBmYDEwBUoCpwDTgRmA6MANIBWYCs4DZQBowB0gH5gLzgPnAAmAhcBNwM7AIWAzcAiwBMoBMYCmwDFgOrAB2ih3cfwBPALuAp4CngWeAXwO/AZ4F/hN4DngeeAH4LfAi8BLwO+D3wG7gZWAP8AqwF3gVeA34g/g1LNLB7RNPcfuBRuAA8A7QhOfNopc7CLwLHALeAw7jPHEEOAq8j3W7DpG7QTyufEf8WtkENAMHgXeBQ8B7wGHgCLLBUeB90asKETtUZvGMKgwIByKASCBKPKP+KfArsUMNG6h3iZ3q58Sv1c8DLwC/BV4EXsPzRlwPAO+g/oHoVR8HP84t6m7xjHCD2CHEAKMAKzBa/FoYA8QCY4FxQBwyx3ggHvtWAjABfBOBKUAK7qeibTayTRquK8WvNQrxjIYHlIAKUAMCoAG0gA7QAwbACAQBJiAYCAFCgRGAWezQhAHhQAQQCUQBFmAkEA1Afw3010B/DfTXjAbGALHAWGAcEAedUnBumArMROabBczGs3nAImAxsBHj5eCah7ZN4MsHnMBdQBlk1AJ1QD3QAN6f4vlvwP88+F8QT2l+i/sX/y9v9x4fd13ne/zXmXSS5kIFyqWAAoIIKHIHBRTR9YJc1N3VbfGs5pwFtIjghQaClmsFubUItIBFLBIKvSwXoezSrHTDpTbUpqEhaaNNk6Z1LmYy00l+TW1Y+Z7nzEYO69l97NnH4zz2j5dz+83v9/m835/P5/udoRMx4rldYfuUSWFwilyn7Bt6pshjyn4hP+UwNXRN5Rf2SVRhMlKoRg2moBZ1aED5d/h7Yx/si2nYD/vjAByI6Sj/Ur/8O/1DcRgOx3txBI7E+3AU3o+jzZpjcCw+gA/iOHwIx+MEnIiTcDJOwak4Dafjw/gIzsCZOAsfxcdwNj6O8jz7BD6Jv8Cn8Gl8Bp/FufgczsP5uAAX4vP4QshN+iL+En+Fv8aX5Pdl/A1mYCbKf5HgOlyPG3AjbsLNmIsf4hbcih/Bp45Jd4fxST/GPbgX95X/P+2xEPej/PcKFuEhPIyfYTEewc/xKFrwGJbgcTyBpbAaTlqOFfh7PImn8DSewS/wLJ4r/w0Fs7wNL+FlvIJXy38lAWvRjtewDr8OBVOkYIoUTJGCKX2rKX2ldWC6yX+WdWC66X+Wqb2pysSrMvGqTLwqE6/KxKsy8apMvCoTr8rEqzLxqky8KhOv6skwXPUUnsYz+AWexXNYiX/EC1iFVvwTfokXsRr/jDa8hJfxCtZHU6s6sCGaOnnvqHbytGivyfthfxyAAzE92it1ZxhO3WUKzXd/ofsPhEzqwag2xQPTrJBa7DW5pB7zmphTYk6JOWVKp54KudTTEG9KvKZcIfW84//Bcy94fRXEmxJvSpwpcZp+hdSvHPOa19Z5/GusRwc2oDOamupybZ/wUj7hpXo8tymMm5SF1G/E5lNdKuO9Q+7n3bfHTtljp4rwySVVcvwIRhFjF8bktjvkqvcKw9VT8S7sjQPDePV0HISDcQjeHdVWvweH4jAcZVf4fhyNY3Ci505yezJOMXlPx5mhUH1WNLUmEe1Vk0QVJiOFatRgCmpRh3o0YC9MxbuwN/bBvpgW1dbsh/1xAA7EdByEg3EIxFkjzhpx1oiz5nC8F0fgSLwP5kzNB/BBE/E4fMj9E0zOE90/KRRM4kLNKe6fhtPx4fJklscZON/9C3BhyNR83vtmhvGar4ntUq993fu+gVm4DD7p1thX1lyNOa57Ha7HDY6/zfX0vEldqFno9gHnehA/wSI87nxPYKnXl2G552LH7fLeN8P4lCjkpkyKaqfUmNw0nFLrdm/P7xtNNc0LU6xKUw7w3IGYHoanHIRDyt9Ilrt7Yi91m64crOzLVr/9/FzP31z5BqW8xypFkxOfDV9OXlD+ZiqqLX+rVXntg4kTQjpxCk4PmcTZbj8b3kicG15NnIcLQqczbbajSNtRpGtnhFdrL8Kt7v8It+F23IE7cRfmYT7uxo9xD+7FfViAhbgfD+BB/ASL8BB+iofxMyzGI/g5HkVLSNd/IKSjpEjHEjN8Gi7Hf6b4Y/HHiTPCZvHHiU+6vS1sS9wetplbh5lZhzny1dq/Cptr/xpfxv/A34VttZfhclyBb+Mq3BpiucVyi+UWyy2WWyy3WG6x3GK5xXKL5RbLLZZbLLdYbrHcYrnFcovlFsstllsst1husdxiucVyi+UWyy2WW1z3ubCt7jycjwtwIT6PL+CLYZvcYx6eHjZxaHOi4mNorXwXcajcl8t7eeIroTVxMb6F20I7DdrLn0bkvlzuy+W+XO7L5d4u93a5t8u9Xe7tcm+vvSa01jbj+7gRPwyt4moXV7u42sXVLq52cbWLq11c7dE5HGjiQJPY0hxoEt+4CiqpoJI4fyOSQZEMJr/01m7xTp34NHPcxKeZ4ya+I9ysukqqqyS6QdENim5QdIOiGxTdIGeaONPEmSbONHGmiTNNnGniTBNnmjjTxJkmzjRxpokzTZxp4kwTZ5o408SZJs40caaJM02caeJME2eaONPEmSbONHGmiTNNFBikwCAFBikwSIFBCgxSYJACg5xpij5JhUYqNPJiAxUa+bEh8dnoINnPlP1Mbn3Ip9dHJj5Dnzyxrh4/sa4eP/G5uJFXG3i1gVcbeLWBGjOpMZMaM6kxkxozqTGTGo3UaKRGIzUaqdFIjUZqNFKjkRqN1GikRiM1GqnRSI1GajRSo5EajdRopEYjNRqp0UiNRmo0UqORGo3UaKRGIzUaqdFIjUZqzKTGTGrMpMZMasykxkxqzKTGTGo0RtVqoSTjY2R8nYznyHg/GV4pw69E02n0DH2eoU0nbTrpMJUG5f9+tEz+z8j/Gfk/I/9n5N8p/075d8q/U/6d8u8UR6c4OsXRKY5OcXSKo1McneLo1CuzKP1v591IdFzii6p0hlk3y5y7zIz7Ji7HFaG78s3Fn2bdHDPj+vBq3fdDuu4HmIPrcD1uwI24CTdjLn6IW2A21pmNdWZjndlYZzbWmY11ZmOd2VhnNtaZjXXmYp25WGcu1pmLdeZinblYZy7WmYt7TUEt6sy8SZVvv8qxx3q8V4/36vFeutXRra7SPdeEXr3bq3d79W6v3u0Veyz2WOyx2GOxx2KPxR6LPRZ7LPZY7LHYY7HHYo/FHos9Fnss9ljssdhjscdij8Ueiz0Weyz2WOyx2GOxx2KPxR6LPRZ7eWbNCFuovZnCrW/PrHJGW6KTZNTi9d95fZwbY9wY48aYY3/j2BMce5ZOqZXp0TqlVrZHq6O7yrOfQ2McGpNliyxbZNkiyxZZtsiyRZYtsmyRZYssW2TZIssWWbbIskWWLbJskWWLLFtk2SLLFlm2yLJFli2ybJFliyxbZNkiyxZZtsiyRZYtsmyRZUt0qkyaebOeN+sTs6L9+bNeBpfogLwO2C6Tu2RyiEyOlckhMjlWJvNk8jTv1vNuPe/W824979bLqllWzbJqllWzrJpl1SyrZlk1y6pZVs2yapZVs6yaZdUsq2ZZNcuqWVbNsmqWVbOsmmXVLKtmWTXLqllWzbJqllWzrJpl1SyrZlk1y6pZH8+o9PGHZbFRFs9N/PfY8r5iSVQn33b5tsu1XV77yWk/rzwln3b5tMunXT7t8mmPUonZPG5SwVeHXGKud99lfVhQ/o7ds3sSc8NYNMn/7o6OccTuxDWea648vyFxSzQlcat328snFkbvSjzg+QfDnrqDcQjejffgUByGw/FeXIxLcCm+jm9gFi7DN3E5voUrcCW+je/gu/gersJsiK/uaoipTkx114Y9lXz2iDSdmBOKcskk7guFxP3ivyjxXXPte5jt2Wtk2Yzrw8bEDbgRN2Fu9O7ELeHFxHzH3R36Ej/GPbgXD4S18ltblzDLkqjCZKRQjRpMQS3qUI8G7IWpeBf2xj7YF9OwH/bHATgQ03EQDg4lGpZoWKJhiYYlGpZoWKJhqe6MsLHuTJyFj+JjOBsfxzn4BD6Jv8Cn8Gl8Bp/FubhYHpfgUnwd38AsXIZv4nJ8C1fgSnwb38F38T1chdlowtW4Bs24NqyNqlTONioOUDGXWBjeVEtzw+/Vye7oC1yIuRC/o5K6rTgFK07BEQUqx4nyLu3vQsEKU7DCFKwwBStMwQpToH5M/Zj6MfVj6sfUj6kfUz+mfkz9mPox9WPqx9SPqR9TP6Z+TP2Y+jH1Y+rH1I+pH1M/pn78n1bw58RxHs7HBbgQn8cX8EVc7ByX4FJ8Hd/ALFyGb+JyfAtX4Ep8G98BbagbUzembkzdmLoxdWPqxtSNoxrq9qvwMRWeT1ynhudG06g9SO1Bapeib9O4jcZtKj3tyA5ap2mdTlyrU+dw4jrvvD7sVPk7Vf5Olb/TWVJ8WMeHdXwoJuaZmHeH7Tpguw7YrgO266U3zIZ2HnXzqJtH63i0jkfreLSOR+t4tI5HbTxq41Ebj9p41MajNh618aiNR208auNRG4/aeNTGozYetfGojUdtPGrjURuP2njUxqM2HrXxqI1HbTxK8yjNozSP0jxK8yjNozSP0jpkpw7ZqUN26pCdOmSnDtmpQ3bqkJ06ZKcO2alDduqQnTpkpw7ZqUN26pCdPF7H43U8XsfjdTxex+N1PF7H43U87uZxN4+7edzN424ed/O4m8fdPO7mcTePu3nczeNuHnfzuJvH3Tzu5nE3j7t53M3jbh5387g7msXBPAfzHIz53crFmHNbOFfkXIlzJc6VOFf2/wD+v8C9PPfyiTs8dxen54cnOTjMwWEODnNwmIM7OTiqTrq4mOVilot5Lua5mOdinot5Lua5mOdinot5Lua5mOdinot5Lua5mOdinot5Lua5mOdinot5Lua5mOdinot5Lua5mOdinot5Lua5mOdSiUslLpW4VOJSiUslLpW4VOJSiUslLpW4VOJSiUslLpW4VOJSnkt5LuW5lOdSnkt5LuW5lOdSlktZLmW5lOVSlktZLmW5lOVSlktZLmW5lOVSlktZLmW5lOVSlktZLmW5lOVSlktZLmWjE7g0xqWxSjfOjaZyocSFUS6McmCMA+XPTaPUHaXuKHVHqTtK3VHqjlF3jLpj1B2j7hh1x6g7Rt0x6o5Rd4y6Y9Qdo+4YdceoO0bdMeqOUXeMumPUHaPuGHXHqDtG3THqjlFnlDqj1Bmlzih1RqkzSp1R6oxGx5oM4ybDuCm8w3pem7hDFndW6kf07i/EA15/MIzruHEdN67jxnXcuI4b13HjOm5cx43TepzW47Qep/U4rcdpPU7rcVqP03qc1uO0Hqf1OK3HaT1O63Faj9N6nNbjtB6n9Titx2k9Tuvx6Bu0HqD1gIjzIi7Pr4wuyOiCjC7IVPT/UwfMV+V3m4Y/xj24F3bwifI3G/9xtQ/wY4AfA/wY4McAPwb4McCPAX4M8GOAHwP8GODHAD8G+DHAjwF+DPBjgB8D/BjgxwA/BvgxwI8BfgxQME/BPAXzFMxTME/BPAXzFCx3Q0Y3ZHRDRjdkdENGN2R0Q0Y3ZHRDRjdkdENGN2R0Q0Y3ZHRDRjdk/h+6Ic2hNIfSHEpzKM2hNIfSHEpzKM2hNIfSHEpzKM2hNIfSHEpzKM2hNIfSHEpzKM2hNIfSlTW+aFe6LTrt7el1n4ljL0n7PO3/eybKxbgEl+Lr+AZmgedyzMsxL8e8HPNyzMsxL8e8HPNyzNeVa2E2mnA11Jsc83LM2+M2yej/9Exex8fmbbnTx8zUsf+sR+zdm+yx56rjW9TrHe7faa8036fvhdE+0YWUK1CuUNmVz8F1jprr9jZz/3b43Kc3y6tzybuOqexuF7j/QBih8IjqLqruououqu6i6i6q7iLlC5QvUL5A+QLlC5QvUL5A+QLlC5QvUL5A+QLlC5QvUL5A+QLlC5QvUL5A+QLlC5QvUL5A+QLlC6qvqPqKqq+o+oqqr6j6iqqvqPqKnBnhzAhnRjgzwpkRzoxwZoQzI5wZ4cwIZ0Y4M8KZEc6McGaEMyOcGeHMCGdGODPCmRHOjHBmpPJpZTel1r39uaUUJSufa3yS5tKb0Zdo20PbHv4V+Ve0lu7y6hZO1NE3S99sZf7N59J9JsoCO6UH7GAfDDm6ZumapWuWrlm6ZmvLa0Mi9NC1h649dO2haw9de+jaQ9ceuvbQtYeuPXTtoWsPXXvo2kPXHrr20LWHrj107aFrD1176NpD1x669qipopoqqqmimiqqqaKaKqqpopoq0j1L9yzds3TP0j1L9yzds3TP0j1H9xzdc3TP0T1H9xzdc3TP0T1H9xzdc3TP0T1H9xzdc3TP0T1H9xzdc3TP0T1H9xzdcxWNy7oP0fgP0T6JlSq5LbyaeEldvhyuSvwqPJoYDb9J7Aq3J/aE15MNYTB5XBhKHh+eSJ4SBt7+d8pfjg5K/k00deLfKw9yq4UbT+qwl1T/y/awr3DiVfxKp63lzDr3O+xF3+Bkt9seZKP9Ejmr2C7vG/P+3Rh3tSj0J6tRA2ujq2eSJ3r+JJyMU8PO5Jlhe31jyNdfEtrrvwnzof5Kt9Sop0a9eVD/fbdzQrb+OlyPmz13p+fuwjz4vFN/r+fuw/3uq576h5yjJYzVL3X+p/B0GKp/Br/w3LMev+BWTvWdnnsdG7HJ4834rftbMOC44dBfP4rdob9hWsg27If9cSgOw5Gevyy0N9zovrgabg25hrvCUMMCPIhH7Vg+N6HqNh69SdVNVO2jah9V/0jVLVTNUHUTVUeouomqm6hZoGaemnlK5imZp2SeirupWKJiiYolChYpuI2Cmyi4iYLbKLiJghkKZii4jYKZP1NwGwX7KNhHwT4KZii4jYLbKNhHwT4KbqJekXpF6pWoV6JckWIlipUoVqJUiVIlShUpladUnlJ5SuUpladUnlJ5SuUplafUpgmltlGqj1IlSpUoVaJUPjo8sSzMSqwMKyi1Rg3+C4WepEo2sTV8V53dkMiFJSp7ViIOq1T2ReqsL5kMm5OpsChZH35UqfRp4fjkodFlyfeFW1X9J5IfCn9HtZdU/vlqrjX5sfBo8pxw8cQ3Un0T/yr5suSssFoXtEb1rt7Dpx5X/7Wr7eBFh6sNOnveGUedrcfZSnroTD10TrSXuMe8a6N37fGucn+Mifck79480YFZcQ2L6xBn6HGGtDN0Rw2VTF+2c/pVeNo7TvaOba63xbu6ZPSmd27zrkMn3rXZu/qjd6uooncVVNKoShpVRUOqKFZFOdfepYpyqiinKnKqIqcicioiVhGxaohVQ1E1FFVDUSWMqoRRlTCqEmIVMKoCRlVAjmM5jhW5NWrGZ6MjxdIg3xb7umWu+49ieAFrwx8q/4Z3hgq4JhScP+38aedP1z/o8cOh4DzpqMq79oj8Uu/oLjtrbiwLr/G837Pdnu1IqK6KflvNi2m0+1Lodt7uaIarznP0DXop7R1Pu/ocV5/jnbspsYsSu5xhU2Kdz+YdrvMGRbrd9mBzWO6MK1XQxkReNdRiWrgmaU1NWlOT1tTkEeHm5JF4H4+P9vgYHGd/dQrfz3b/nBCL5lzRnKvn0tTdQ909ei5N4T31346m1X8HdmpUmFP/fffnhHmUmEeJefouTe1d1N5F7V31871+r+fuw/0eP4AHve8h53rY7d9T7km0hpvrX3H7a6xHB3rxG/R5rd/tNgyGmxui8FLD5LC8IYVqHO7xUbgs7OHAPL2X5uauhoUcuR8P4Cf4aVhuRW6rVOIgpz9t6rxl6rxl6rzF9U/q8Ld0+Fs6/C3d/FZ0CD9KtM/TPk37tHc1vHM2yb0k95LcS/JOyzst73Kuabmm354r/85MEWtJnOl3zohJta44WwX8kPuruH8z929O/JKjL6JNt74S7Z94Fb8yQ9ap042eL8+PzVbFXp++f4PfYgv6sDXcmuh3O4jt6m+H298hg2x0o2r5ReL37g8h7xzDbgsouu5OlNwfwWi4xkzqMrEzJnZG984qz6bEm577F/wxvJF4y23Q1ZOQQHluVam2ye6nwlMq8qpkXaXrr9f1A8mp4b7ku7A39sG0cI5qvUi1XqRaL7KmrkgeFBYnD/baITg0+tvk4W7fiyPCBSr5ApV8XfIoj9+Po8MMFT0jeaz7H8Rx4S/NxqtMlfVcW8a1ZVxbptq/YE6uSp7mmNPx4fBs8iNuz8CZoSV5ltuP4mNhnq64KPlx988JN+iMS83TbeZp+V9mX5u8KHpP8quYFTaUvyOvnxU21l+Gb0d76ZK9dMjNOmQvVTJblcxWJbPrb/T6TfgRbsPtuDPav/4uzMN8xy/w3ELc7/EDeNB5Fnn8sNufhfvqH8GjaAkr6h8Li61iLfXLPF6OFfj7MENXzbCytajAZSpwmX3BCqtbS/1z4dn6lXjecS94rjVcUP9P7v8SL3r+Fe9TW/Vrnfc1z63Drz23Hh3odK7XsRFdjt/k2M3o9dpv8FvPb0Gf824NXTp3htWzRfdepHsvqN/uOTVYrwbr01CH9VnkQne9OqxXh/V5qMH6InaiJO8RjLn/h/BG/R6Mu/9HqLl6NWcqXNWg7hrUXUMyvNFQ5Xay51KoRo3HU0yPWqjBhvrQ3dCAvdyfind5fm/sg309Py1krPAZK3ym4QDnO9Ax03EQDsYheLdjD/X6YTjcNd7rORPWNLqq4fqwUYfPbrg12r+B1w28buB1wx24E3eFZQ33hsU6f5lJNcOkmmFSzTAFlplWMxoWOc9Pnednzvmo87d4/BiW4PFwc2Un8Q1T4llTod1Oot9E+KVJ8Fsdf5vO/p7OXq5rV+jaNuttrGP/Qcfu0JWbdOMruvBpXbhR152rsy7RSY/qmDt0zLM6ZpsuuUOXrNMFL6r+RRO/cXpe9T9f+W/a3w0bov9lXi0RyRIr1trEU9bolWGdufWoufWoqMrT8x9Nz5dNz5etXEsn1vA2a2BWtDusXm1Wrzbza6nIXzWn0iLvKK9gos6YNzvMmx0i32pe94l8zMzuM7P7Jla4x82CpWbBUlHuEuWV5V9pWL3W1v9Pe9xLQpsVrM0KttYK1vb2HqHJ42vCoxN7hSX6c4n+XGIFW1vvc0f9D3EH7gwvm+ovm+ovV/YO93r9Ptzv8QN40Dkect6H3baGpep+qTpfqqbT1pM+60mfuk1bU/rUanpi9VqqLpeqy6VqMa3Wdqi1HWpth9pKq620utqhrnZUVrcj7ST/dYVrU1NLrHBrrRwvq4+l6iOtPnZEs60Sa6wSa9TDarXwGKWLVoc1auHzpnmXaV6e4q9StY+qG6m6UU38wuTup2ynSd1F2U7KdqqNUmVC7x/eMI3fMI3fUCMnqZE9pmyvKds7sV/rNFlbTdZWk7VVzWwwTV83RdeanG+YiGtMxDVUL1K9SO2iCbjGBFxjAq4xAdeYgGsoWzT11ph6a0y6NSbaWlOs1xTrNcXWmmKtplirCbbWBHvdBHvdtHrdtOo1nXpNp17Tqdd0ajWdWk2nVtPpdVOp11TqNZVaTaVW06jXNFprGr3BnU6Tpctk6eJSJ4c6TZd+06XfBOk3LbpMi/Jk6DIZukyGLk5t5NRGTm00FfpNgC5ObeTURp3fxalOnb9Gx6/R8Wt0/Bodv0bHr9Hxrbq9Vbf36vZe3d6r21t1e69uL3f5Rl3epcu7dHmXLu/yOThrZ1zeU58SxqNTdVmsoxp11AIdtUBH/YrPLbpmN1+X8HUJX5folgxfC3xdztPlPF2uI2JdEPOihRctOqC8U25R8bEqX6DKF6jyBbxoUeWxKi/vlBeo8gWqeTe9ltNpuWreTavltCrQqqCqd9OroJJ302cJfZbQZwl9Cqp5t2reTaMlNFpCn+WqN1a9C1TubjkvkePL4RYVu0sGT3k0KvZd4WG1uTk6SGZFj3pl1i+zfpmlZfWaOZCR2Wsye0105U9nr4nuNdEVRfeaqIoiKoqoX0T9IuoXTVE0RdH0i6ZfNK+JoiiK/uhQVxqtfC4Zc7XdGLdL/KN9clTZvZRcrcvVyqvVqKuVa6bL1UZdrbwqjdJi1FVHaTHqyqOu3OvKva7cS4tRVx919VFX73X1XlfvcvVRV+/1GWFreEjmG2S9wZVLrpg2y35u4m4ycTeZaT81cddFKUeNTXx+Kk38Yum45IzoiOhoXZ7R5RlH9Dtix58+XTuyXyZjMunQ5WXdOmTSIYsOHZDRARnZdMikQyZjMhmTxZgOyOiAjA7I6ICMDsj8m0++Bzjm3Z770yfgI9w/MnSo5kz5065qzqjmjGrOqOZMxdvfiuwPFW8nezRS+U5lD8ZNklT510h2VafZVZ1mr75ZDvkw7LW8WT9sdg6bnTvMzh1mZ3k2DpuLw+bgDmfbWqmbNypnSlYULEVHOcdKr7zA3SHnWuWInW/rYg9BkyF6DNFjyDVWTfwby2YuD9FniC5DXB6izRB3h8SwSgwrxbBSDCs5PfRvNDnY40PwJ00Od/yRHh/l9qeO/1nlO5N8NEn2pegA8Q1NrHNbxLSl3LliGhT978Q1KK5BcQyKY1AMg6495NpDrl2+7hbX3eK6W1xvi+ttca1B1ylfY0t0pLM/LvtVMm99xxpQ/qy/ypUKlZlfW/mXOvdOVNqWys72u+bjxGyUcaurPu6qj7vq4//uXCzPwcMdV56BR7ktz7OfOvbP59kU0fyDCLZWvm1IVX4Xe5krb3DlDRO/E1oTnSTuzY58mWsdPrWkxb+WSquptIpK5difUdFlpZ7jdXlXUKDWc9R6Tj5rnfURZ1vFxQ47y/JK/BwFn+NkucqfU+UZVZ7haIf81qr2jBw3y3GzHDdztcMOMW2HmLYbLK/Qqyi9itKrVH2Gyx1c7qD6Kqqvkvtayj8n97Xy3szlDg6sig6meifVO+XcLoOivP9Z1GXlO0VcEHFBdAVqd1K7U5QFERao3EnlTip3UrmTyp1U7qRwpysVKNxJ3U7qdlK3k7qd+mtXuIc2G+mRU2FWBP10vDX71PCHKGmvtL7y7dqpYWt0uEe7Kt9aHmHGHYkTw4h1fMQ6PuKIMWv4kB1VceJbxiHr8JB1eMQ6PDLxLeNQ5VvGVnPvX79pHLH2jlh7R97xTeOIdXfErmjUujtkZzRqHRyxDo5Y+0aiKXYau0XykJ1FqfIN7ikh66rlXyQ8wcEnKt/a1tiLlJLTxHxc5fvB7ZXvK0717i9FnzL/3hNVOcf2yjmOD2+Wv3eVLf8cP+jYbVSYJqNTw+6KHi+6V4j2c6/0Z980FpIX2fl+NWyTcUHGhXd8M1j4D74ZLLzzE3x0mCuVvw0epusOuu74s2+Es64yTNNhVxh2heF3fHM77CrDNB2m6Q6aDv/Zt7fDNB1++9vbPscMeDxoEr7jG9lokqzj6MhkQ8Xxx+zhRu3hRu3hRsX0vJiep9Ru+7iifVzR0SOV7/rO9vo5lV/5raT8SnP4MHO4/O+pM/ZiRXuxoriet+cq2nMV7bmK9lxFe6yiPVZRPM/bXxXtrUbF9Lx9TtE+p2ifU7THKUbVovmFK8eVbxjLDp7jyl8Kba7WFh3h1W102yrGLWLc4sjyN+q/p1+Ofjn65eg3QL/d5e+paLiVhrtpuJuGORrmaLiVhrtpuFWsW2i4lYY5GuZomKPhVhpupWGOhjkxb6HhbvFuoWGOhjka5qL9qdZPtX6q9VOqj1J94t4i7s2U6qdIH0X6qNFHjT5q9FGjjxp91OijRB8l+qnQR4U+KvRRoS86SJ5ZOWblmK2ocbwzn2hFPgkn48P65Wlz6hk85/5KtIas/e6IXDrk0iGXDvvbEXl0yKNDHlk5ZOXQIYcOOXRUfsNZ/tfG06MHootNgktwKb4XnoiuDXdH38cPMAfXYXt4LNqB32HEMXvC/Ggcb+Jf8Mcwf9LRoWvSMTgWH8AHcRw+hONxAk7ESTgZp+BUnIbT8WF8BGfgTJyFj+JjOBsfxzn4BD6Jv8Cn8Gl8Bp/FufgczsP5uAAX4vOYFZX/f2/bJ7WFVya9hJfxCl7Fr7AW7XgN68IrVT8Ld1ctxiNY73EHNkCuVW8hhPmT3xWWTN4nPDZ5WuiavB/2xwE4ENMxEO6enHfMMHaGu1PH4DRcHpakvoUrcCVmhydSTaB7an7oSnWGV1Jjoav6qPBK9ftxNI7BSTgZZ+Gi8Fj1V/DVML/6frRgwONtGATPqnPhierfo+i12OOxML8mEbpqkrC+10xGCvavNfavNdbvGut3TR3q0YC9MBXW9Bpreo01vWZffCS8UnMGvub+pW5vcPu42yewK3RNca4p+4ZXor+N9lFx+2Ia9sP+OADvx9E4BsfiAzgP5+MCXIjP4wv4Iv4Sf4UvYyYuDitU7gqVu0Ll3h5d5TPCbDThalyDa8OTqvlJ1fykan5SNT9ZdXvoqLoDd0JXVM3DfNyNH+Me3Iv7oGOqFuJn3rcYj4Qnub5i8qbQMVl3Te5DPwY8n3abQd7rw9jpuT+GjlQK9tWpKajFgZiO9+Eo0CFFB9XxZOoUt6e5PdPtZ/C3+Cq+hkZcHlaonBUqZ4XKWaFyblc5t6fkm5KvCnqy5sqyNtGP7anuwb24DwuwEPZbUXm/9QSWYhlewzr8GuvRgQ3oxOvYiC68gW5sxvaw0kxYaSasNBO6Ip95ohi8j9Ru5LOPObHanFhtTqw2J1abE6ursqGrKoffYwh5+MxUVYB9aJV9aJX9ZZVzVjlnlXNWld/3FkJYrd9WVpsF1Xq/Wq9X6/VqfV6tz6v/Gl/CRY75Cr4aVld/0+OrMBtX4xr8ALfgVui3ahpV06iaRtU00k+rq3/utsXtU25bQYdqOlTToZoOem2lXlup11bqtZV6rUuvdVXLqVpOem61nltZTQ99t3rSh6Iqu5HJSKEaNZiCWtSh/H+w0YDy35w+IzouOhMXh0VqfJEaX6TGF6nxxWp8sRpfrMYXq/HFUXO0jzqfq87nqvO56nyuOp/7X/hbUidFq7A9LOToQo4u5Ohyjr7I0Rc5+iJHX+Toi9Efor25Oo+r87g6j6vzuDrvv+t38YkToumJE6PjEqe4PRufDYsS54aFifPwxejAxKywLHFZuCnxTVwebrJnuyL5lfAj+7Yrkl9ze5VPMrOt053R1OTr0bRkF7qtsj3Re5Lbw+rkDo9/Fx2dTFf+qsMRyd+7HYqmVl0VvadqNppwNa5BM67F9/EDzMF1uL7yd7TmmhdzzYu5/9W/o6Xa56n2eap9nlmzqPKb/H3CQjNm7uShaB/zZZH5ssh8mTv5zeg9qSTUVmof7IsjcEyYmzrW7Yk4OTrOTJmbOt39y8Mi82OR+bHI/FhkfiwyPxaZH4vNj8UptZS6Fmrp7d/6d4XB/+t3++Xf4l8YXtRpC3XaQp027+2/w/Wnv8FV/ttb93v+X//+1km6aV7lb3ANOH4bBqHmdM5ynbNc57yoc16sHo72ri6g6PjY6+pPB80r/52u/2+/0X/n3/p6x2/ty7+jr50RFtbKq3ZOuKn2euibWn1Tq29q9U2tvqnVN7V3YR7m427It/Ye3Iv7sAALcT8ewIP4CRbhIfwUD4M+tYvxCH6OR9ESTa/7fnRg3Q8wB9fhetyAG3ETbsZc/BC34Fb8CLfhdtyBO3EX5mE+7sY9uBf3YcH/Zu5MwKQo7rBf3dXT1dPTs7PALrCAy7EcHiFRJPGJR6JGJZ9olHiEgCIKRlHwgAUFOUQ0gCegAgoeCGriGjXGaxc5FDWiySAgMB7jscAO4HI0wnIsTH2/rl2JRoma+DzfN/O83T3VdXV11ft/32HpAdPBDDAT3CdaBkeIkoK4aFngg4RoiVpcxipYa55issw8+aTUvg42S8FmKdgsBZulzC8mxEH0e48JEIAkKABNUbfNQBEoBs1BC9AFoKBRAFkUQBYFkIX5ymC+MpRADiWQQwnkUAI5lEAOJZBDCeRQAjmUQA4lkEMJ5GDJcliyHJYsF5fjtAaBK8CVYDAYAq4CV0d/qw6uBUPBMD3yGxl1lO4Bm/aATXvApj1g0x6wqQ+b+rCpD5v6sKkPm/qwqQ+b+rCpD5v6xN0a4m4NcbeGuFtD3K0h7tYQd2uIuzXE3Rribg1xtwbmLYN5y4i/IfE3JP6GxN+Q+BsSf0Pib0j8DYm/IfE3JP6GxN+Q+BvC1lNh66mw9VSR07ViA9gINoHPQC3YDLaArWAbCMF2/SzMXgmzV8LslTB7JcxeCatPgNUnwOoTYPUJsPoENH0GTZ9B02fQ9Bk0fQZNn0HTZ9D0GTR9Bk2fQdNn0PQZNH0GTZ9B02fQ9Bk0fQZNn0HTZ9D0GTR9Bk2fQdNn0PQZNH0GTZ9B02fQ9Bk0fQZNn0HTZ9D0GTR9Bk2fQdNn0PQZNH0GTZ9B02fQ9BnrbFFi9QK/BeeAc8H9Ok0kShOJ0kSiNJEoTSRKE4nSRKI0kShNJEoTidJEojSRKE0kShOJ0kSiNJEoTSRKE4nSRKI0kShNJEoTidJEojSRKE0kSuMlqvASi/ASi/ASi/ASi/ASi/ASVXiJKrxEFV6iCi9RZf1D+NY/QRosEz5RLEUUKyCKpWz8DpEsZeNpiGaVRLOBRLOBJpr11bX2QDBIz/hyVLOHmKe79CCyXUFk60Fki56S9LQcph+X84liC0VSvqInymX6GaJciijnE+VyRDlfrtHVRLqKxmcXlZrnXG4i/TMRI8qliHIpolyKKJciyqWIcimiXIoolyLKpYhyKaJciiiXQknnUNI5lHQOJZ1DSedQ0jmUdA4lnUNJ51DSOZR0DiWdQ0nnnBk6dGaC+8D9YBaYDR4AD4KHdA8iZw8iZw98VxW+qwrfVUUU9YmiPlHUJ4r6RFGfKOoTRX2iqE8U9YmiPlHUJ4r66MwQnRmiM0N0ZojODNGZITozRGeG6MwQnRmiM0N0ZojODJ2dutapA7vAbrAH7AX1YB9gTRCZJxCZJxCZy4nMaSLzVPxfBv+Xwf9l8H8Z/F8G/5fBJWRxCVlcQg6XkCWC94it0yFOIYtTyBLJy4nk5TH6FKNPRPQeRPQUriEby/NZ69AVwAI2kCJFpE/hKLI4iiyOIoujyBL5U0T+FM4ii7PIum3IewgoI60TnzsDuBaXkUUZ9EAZpNwjOX8U+6NFGa4ji0LogUJI4TyyOI8sziOL88jiPLI4jyzKoRzlUI5yKEc5lLvwqAuPuvCoOwyUg+F6JGpi5AE1AYfiZzMoiTRKIu0+KHz3aVHiPgOe4/hF9q+zf0dXoTLSLvcS35txoydyHqLTKI40iiON4kjjhavwwlV44UV44UUokDR+eBF+uEodJ3w8cRW+IMQXhPiCEF8Q4gtqUCmV+IIQXxCiVqaiVqaqC3StuhD00xPwB6EazDFrSl0FrgbXgGupcyjguvAONXiHEO8Q4h1CFI6PwvHxECEeIlS3kv8282TDENXj4ydC/ESInwjxEyEqaAIqyEcFleErQpTQBJSQj7cI8RYh3iLEW4R4ixBvEaKQpqKQpqKQpqKQpqp11L0e1AC4XsH1qKZnUU3PopoqUU2VqKUJqKWpqKVK1NIE1JKP18/g9TN4/QxeP4PXz+D1M3j9DF4/g9fP4PUzeP0MXj+D18/g9TN4/QxeP4PXz+D1M6iuNKorjepKo7rSqK40qiuN6kqjutKorjSqK43qSqO60qiuNKorjepKo7rSqK40qivtdaNPR4Of6yrvWHARdQ/g80BwKfgDaZexvxwMAleAq3UOhZZGoaVRaGnvRsrcRfrj5P2TXuT9meMnwE6diQtRgoJLx7m2eDNdFS8Wvn+OXunjC/3zQW89EGU30L+A4+t1rT8S3AC+UHrjOb4FTBQpFF8KxZdC8aVQfCkUXwrFl0LxpVB8KRRfCsWXQvGlUHwpFF8KxZdC8aVQfCkUXwrFl0LxpVB8KRRfCsWXQvGlUHwpFF8KxZdC8aVQfCkUX+r/oeJLfUXxFYs79WlWP9HH6g8uFtdbl4iLrQHibGugGGj/WpxsDxLHy/P0+bK37iWrdJVcqAfKar0SbVgk15lnvM6RG3RabsRLbcJvfabrRFtxZ36DqNDrxGt6HbWf0PhE2rOp/SRqP6nxSbJ10bOiaaWEVnxaOYFWetDKFPmyfksuAAu1Lxezf0Wvla9S+xL9EK3PoeV6ud60fhatz6Z1n9afp/WVwpNpcrxDn3DycgV9X6mXyndJW01EXEOOgL69Td/eJmd/Ymea3HPIPYncxeSuIPf5xNFFlBhLiQmiffR8SXr7MNH8R0TvQfaZRPJB+nb7quhvO0V7e4kebv9dz7E/EsfZO/GjRejnn+gX5MtE34XiSK7gTVqqwo/6coXxommidIra67miT4jUkxojtd/oSX2uLJQbuSrzpEG91fqdcPRjIgZcoIAH4sCP/nc2CEASFIAUzr4QHKvT4jgwQU8WN4NbwB/BRDAJTAa3gtvA7eBOvVhU6udElX7OstE/EjggBlyggAfiwAcJkASFgDhpNQXNAFxiwSUWXGLBJRZcYsElFtxhwR0W3GHBHRbcYcEdFtxhwR1WZ9AFnK1XWr3AbwFr22JtW2PAWDAO3AjGg5vABHAzuAX8EUwEk8AUvdSaCqaBu8E94F4wHczQS+0j9WS7O/gl6MXdm6zT9q3cmYX6t9yVWuZZHXPsGe5EbcMzH/lcl39V7tJFcnc+K/fkV8q9+SdkfT4j9+Ur5X6dkHnSdb7WieVfdVxd5Kh81vHyK514/gnHz2ecRL7SCXTCSZJeQL5y/ZgzHIwA14HrwUgwCtwARoMxYCwYB9C2DtrWQds6aFsHbeugbR20rYO2ddC2DtrWQds6aFsHbeugbR20rYO2ddC2DtrWQds6z4OX9EqnElSB+eBlsAAsBIvAYvAKeBUsAa+BFXqysxK8C1aB1WANyID3wPvgA/AhyOrJsXr9mCsB89eN6Qq3KftmoAwcDo4CR6MLjmF/u17pTgcz+cx1uo9yzPW4XI/L9bhcj/s0ac+AZ8HfwIugkvQqMB+8DOi7S9/dtzh+G/yD43+CNFgGVoM1eqn7Pudy4DMQgu3gc7AD7AS79EpVAFKgEDQBLfVSVQJagdagDeiOTjkGXKsnq6HgRjAeTAUPgTn6OVXBfpee7HXRK70jiHE/Zn8k+9+Aszj+vV7qDeD8QHApYD56M0m/D9wPZoEKUK+XxoVeGW/CnvUVZ13FidFx4rM/AFwBBoOrwDWgHLDefda7z3r3We8+691nvft3gDvBXWAKoL/+NHA3uAfcC6aDGWAmuA/cD2aB2eAB8CDgGv2HwRzwCJgL5unJidN1OtETnAHOBFxr4ixwNugFbtBzEqPBGDAWjAM3gvHgJjAB3AxuAX8EE8EkMBncCm4Dt4M7wJ3gLjAFTAN3g3vAvWA6mAFmgvv0nOAIPbkgrucU+CCh5wgH9n8G5s/JVcSyNcSxe8Uo+PMGMBqMAWPBHrh0L6gH+8B+uOpQHeKfQ/xziH8O8c8h/jnEP4f45xD/HOKfQ/xziH8O8c8h/jnEP4f45xD/HOKfQ/xziH8O8c8h/jnEP4f45xD/HOKfQ/xziH8O8c8h/jnEP4f45xD/HOKfQ/xziH8O8c8h/jnEP4f45zB6Hpj1hs7iWWvxrLV41lo8ay2etRYf+ig+9FF8ZxbfmcV3Zu15upqI9hiRbINdpzfbu/Rm8z+bXsF3LiMavaOzRLDH8HAVeLgKPFwFHq4WD1eLh4v8Uxr/lMY/pfFMIZ4pxDOFeKYQzxTimUI8UgU+qAKfUoEnqcBDVOAhQjxC9ATREB9Qiw+oVYfrrDrCPA00ehJopOXT6Ow02jqNFk6jgdPo3xD9G6J/Q/RviP4N0b8h+jdE/4bo3xD9G6J/Q/RviP4N0b8h+jdE/4bo3xD9G6JXa9GrtejVEI0aPaEziw4N0aC16M4QvRmiN2vjRTqLxnwUjfkomjKLpswGY3R1MBaM09XJIr05WQyag7agHRhP+lzz103r9GPEdTSmrBJHy/ligFwkOsrFohXj+w/5qiiWS0QXmRY9GeuextevECfh7VPyXdGNca+NvsVG51STulZ0RS/0NN9hR/+fYSOqpeG77G609IquJH+lafMZzo0VkvYOJW1llFMkrLOFb/UCvwXngHPBINEN9+bj3iLn5uPS/Hj0q6sO/SlldRxvnolMPKQPDSmlRMscqYcSLSuIliuNHsSN0/JalNBGcZL5TjHK240+RL+HUEOPG56fbJ4qHWmi6N9NzPPneuvlspyxeYU5dIJIUba3XsGnD8m9AC24WO/kUzWfBlNusd7DpxWii3CoPQZcoIAH4sAHCRCAJCigxfNEE9lH/132A4MZxfl6NTV9TE3vOOWimzMcjADXgevBSDAK3ABGgzFgLBgnuuHlu+HZu+HZu+HRu+HRu+HJu+G/u+G9u+G36YvpaxWabj5jtUB/Khexihbr92hxPup2C9deLo5gTjThbBjNBa69SDS13hGHWMtFp8a/S7tU9iFXw5Oaj4ie1CwHm//T9bYcgb6dLg6TM0CV3sid7oCSedb5uTjcOVZ0YrT6igJKFNDOT7ib5dyBBXoLLb1tWkrSwme0kJYX0P6FKND+7C9mX04r7+gP0ci16ON9Zv6sFjFK+cKNfo2F3CXkLCFnCTlDcuwUzcVaWBQNJdY3PL3PtDiCPTzBXY/BuBnq2wHr7qREGNUZKeJYU12Hh6/Dw9fhkevwyHV45Do8ch3et442z+Nae1NLOXcuTamotugb0xZfafMC6u8PhgjLtL2MkX+H9OW0t4JxXsnMWYUyXy0S36ndRGO71dSW4irqqbGaGmupMaRGt/Hbt5iJHwXkDmVv048s/cjKoeYel9FjJaMnNzf0pY6SCfpST+nIoYTix2KtOEasA+vBHtFZ7AX1YB/YLzpTc3/jli5gnV0ozpP92V/MfghOZig1j9BL5Gju5HRm+gxWLKqHMepo7s0K/axp7V29hjVXhMvZxxzpxhzp5lC3kwdadI41FceoPqAv6Cc6qxlgHviEz5+CakA/1VbSdrCvo29xelZHj7rSm65ca1Hj3SG6sgKie7yGORPNtEX0fxEjkyN3EaOTo0QRJbqRO04/NzMyn9PXkL7ujsbVlEqb+ck9Yi6XsXbrmM9lcjhMWC1aNOh15muOuxP9P62Neon5JZ/onmXJ5ZOyk3588YS4xr+OkcOYI9ex/jcwHzYy/m7jM+1zlIHbuIIasFFnRYkYSE8uBX8Aw8wvGNTRnzR9SZO7yOReS4vGxXFuI4xovnclLp4gSmOFOherBZt1zh0MhoCrwNVgOBhBvQWNv4sQPYkzS81ZOYwrGs6VVnPf1upNXOmehivVu+h1Pa0sNd67Bf0L6V9I/8IDq6QPNfUDw+jbcO5LNSXX0vfIRze4zejqPol+A4n+hfQvpH8h/QvpX0j/Qjf6N5WuAucuLgV/AKP4fAMYDcaAsdTc8KtJh8FRBY3PoY8Y5yQ4agaj/Dyj/Brzsop5eTzz8jT5BPO1mp6t5dpMb4hTOe7ZBp1lTh7DnDzGOUFnnIdEV+dhMEd0jRWK02KfsK9lvxlsE13dw6J/+wSDxWnuEHAVuBpE/fMa71E0Z2KNcyZm7lWNmRGh+fahgn4/1pirpDFXCf0OydnN9C26/64cnH9c7tZb8XpZR+mteLmsc2j+Tfo8OP8JqXWk1DmH6h9R6+D8GlnHnaqn9D5q2q+rnZje4/i63kGPkLOanEeZsk9xNkNKhtp2mrJpuReeiMruZzZoysSFMmUDPFgB+0N1qWhKzjdppR5XGtKzWhn9VXg9re7Teym5nJJ1tFqPGw3pca2DKqKWPfRgLzUtpyb6m/+UOzUYH9tQy05qqaeWfNRn03ZD6Z2Urqd03vS9oQ8x0ZySg+lDtdzFmO1mv4fxQyU3XnlG7mdN5/V6atpDX6odV5RQWzW11TlxonzDiHD9Iu4k9Xpq3kOf7oiiZr6aGqMxyMk8MUeZ6885SY4P1cLkeNrckb0mV8NdiZtc0Z1Zwej+2/1CTzTeJ0p/y/0xec19Ie+33A9R+L/eBxF83/FnFv/A484cP8h4mzPfOM6iwCkSnlNMrS2F77QCrSnThvKHcIxaddpyrgPHHUEnznXmXJdIVTrNqaM1Z9ux7xSNgVPEJzyD04I8rczZ0NRVSnpbjttz3NHkDqN6hGtytzSt7jQ5OphWdoqm9CvG2VqnOSktQEtRSv9S5KylzlL6R72gLZ/bcb496EB6R/J0Iq0zx11oo4BacvQ1usKYU0LrrYRsrCUqnaP/0RXGnDLOdeRcQ+mYKKQPPqU3myttSb2tyNWa0WtDekP7PjVsNiPQgfMdSevE+c6kR21zFdRfzNnmepvTIrpWZpzpA/eyDe0eQlopedqS1o487aMxII/pC3k6k6cLTBfdp5QZ15aiqPE+1dOPIvpRQD9SZmw78LnhPtXThyL6UBDdFTN6scZSO77S++i6G0rsONDr1H87J1i173L0b/OC1d5WJL/v3KBUGav0IPODs7Zo9kPNEWorJuW/nCeUDkST/3WuUEvz6Ip+mPnCnZhn7uN/NWfMFSW/77yhzd2o2br8criwK4zjwGpHyb35hbBaa7kvvwT2+bnM5+thtUInll8ON3aFjRxY7Sgnnl8Iq7V2EvklMNPPnWS+HlZjDebfY0RaMSJJRiTptMy/yYgUO63yNfSqI6PiMCq2U0q+tuRrR572oAP5ysjXkXydyNeZfF2YNXGcWgqPdZqMfkVoiVH1RajcUlRFt+h7e9ReifkloyqrnzjO6i9Osy4Wt1mXsB9Aqeh3h87Xr8vfoYZ669nm1/EO+w+5Xje5vvjFpdkHPj1z4JNtJXHAXYUQx4pfisPx3CeJI0VPcY44Spwvfkfq79Ftx4vLxe3idHGneEJcLarEQj4t5j1VvCVWi2kig+d4SOSslPiL1dpqLVZbpVZXscY6wzqT1LOsc8VGq491gdhqXWRdJLZbF1sDxefWYOsqscsabs0Ue637eZdas3m3tR7k3c76s/WE1d5abC2zyuwj7W7W0XZ3+xjrZ/ax9rHWsfYv7F9ax9m/sk+xTrBPs0+zfmn/2u5pnWifaZ9pnWL3ss+xTrXPt3tbv7b72n2tnvZF9kXWGfZA+1LrTPsy+zLrLHuQfZV1tj3UHmGdb19vT7T62pPtO6wr7bvs6dY19kz7Put6e579V2uU/Tf7dWuS/Xd7tTXLzthrrQp7g/2Z9aK91d5mzbe327usBfYeu95aYmsprDekLaX1plQyab0lU7KptVwWySJrlWwuW1mrZXvZwfpAdpSdrKzsIg+zPpY/kl2tavkT+RNrnTxKdrPWy+7yZ1ZOHiuPszbJE+QvrFp5ojzR2iJPlidbW+Up8hRrmzxTnmWF8lzZ29oh+8gB1h45WA6h6aHyOjsmR8vRdkKOlWPtQE6XM+ykfEo+Zafkc/I5u1C+KF+0m8hKucRuKtNyjX2IrJaf2V1kndT2UU7MKbCPc4qcQ+1TnROcE+w+Trkz0e7r3Oo8b1/tvOQstGc5/3SW2Y84K5z19qPOBkfblTE/5tvLY0EssFfECmNN7ZWxlbH37NWxD2Of2NnY2thauzpWE6ux18Y2xDba62KfxbbZNbHtse12bWxnbJe9ObYntsfeFquP1dthbL8bs7e7yi2w691Ct1BKt6lbLB23pVsqPbe9e7RMuT91fyo7uMe4PWSZe5Z7nuzuXujeJI9zb3b/KC92J7u3yYHuXe5d8jJ3qjtNXu7e694rr3BnuLPlle7D7sPyWneuO1cOdR91H5XD3Ar3b7LcfcF9WY5xF7mvypvdN9w35CR3qfuOnOyudFfJqe4aNyPvcd9335fT3Y/cj+UMN+dukve5obtPPqCEsuWflVLt5JOqs+ou31DHqhPkKnWiOlG+p36lesj31enqN/Jj1Uv1kuvUuepcuV6dr34na1QfdZHcoAaogXKLGqQGyW3qSnW9DNUoNVZqdaMa7zjqj+o2x1V3qZlOoO5X9zvN1Ww122mhHlQPOS3VXDXPaaUq1HynjVqiljpd1XK13emudkBy53udvc7OJd6h3uHOAO/H3k+cP3jdve7O5d7PvWOdQd7x3gnOld6vvdOdId4Z3hnONd5vvLOca71zvPOcYd7vvd87I7wB3mXOdd7V3rXOaG+UN8oZ543xxjg3ejd6NznjvYneZOdm7zbvdmeid5d3lzPZm+ZNc271pnuznNu8x70/OVO9Cq/Cudt7ynvKucfb7n3u3Ovt9HY6M7zd3m5nZhwyc+6LO3HHmRVXceXMjvNyHoin4oXOg/Fm8WLn4XhJvMSZG28db+PMi5fGS53H/HP8Ps7jfn+/v/O0P9Af6DzjX+4Pcv7qX+lf6fzNH+Jf5TznX+Nf47zgj/BHOC/6o/xRzkv+aH+cU+lP9J90FviL/Tedtf4q/0On1v/IX+/s8PckWjn7EmWJKbHSxLTEnNjtiRcSC2OzE8sS22OPBipoGVsaHBGcGvsg6B1cHqsLrgyucVUwNCh3k8GI4Hq3MBgVjHKbBaODW9yiYFJwp1saTAmmuJ2CacE9budgevCwe1jwSPCI2z2YFzzp/jR4OnjO/UXwYjDfPSVYECxw/0+wKFjknh68Erzp9gz+EaxwzwneDd51+wSrg4zbN3g/+NjtF3wabHMHBp8Hu93yYG+wzx0V5JPCHZO0k7Z7Y9JJuu74ZDyZdG9OFiabu5OTLZMt3SnJVsk27tRkabKje0+yc7KzOys5LjnOnZ0cn7zFfSA5KXmH+0hyavJu90/Je5PT3Yrkfcn73L8kZyVnuU8lH0jOcZ9Ozk0+7j5XYBcUuJUFTQtauG8UtC44xP1Hwa6Cve4yYcdvIqKIRFXhy6KLaCt+kJf+SH8suuKshF7+jefr9Z36Kd51+no+XaQv1U/q5zmqNmerdY7tp415675WOjqb0yHvf50r+lqureDmb+3pJPDXL33OUHtx1MJBX77eG/VOf85x9DeyPURnPmcP1LDhwFH1N7S3XH+oN+q3eVfrbaj1//XVgjofNjWv1bV66Ret69qvtVxrRq1WZxn9i0VrRuywqOeNZ+u/rSG9U2/R2/UGvf5AUjNSt5hzz3H3UvoFjtZ9Y1ly6c20Xqc3imjUSkWZOLGh95xZrVczWz6Ojg7S9oN6dnSVejj4jT5Zj9cTOfr4wPnPvnyV/1a2nrH+iLZf0a9z9SF3KtZ45r1/y/nGt47BDtE40/QUsw31VmpvnIVfGpkv8u9kxLbr3XoV+U43V3scI9/YS71Jb2K7sTHv7q+V3sqY1URzpHFd1IlWZr/y4Fd7kH5nv/Lpyi8dv/zdauD143+1yB1bKWJ61be0Gq3ATY0fDhfd/2Pex/T90TyJ5tD3f+n10RUyuz782plPv7XsNjDBHD3573cwYqdvKb0WVBlGev9fK/+7vpjVO8125TecTH2nGraDT75vu41lFzfun/8vyj5gtm9E1/8Dv4791rY3NNxXvQcu3fI9a//Po3oMOM+08WnDtuHdePabouNhvNvyPuwrPXzMbJc1vP9D6aO+sXSN2W7WO+CuHQfrKuciVtukP4jWYVSmgcMbYh5s95p+S//9oKW/FFX1ZNEeRj5TnMXxn03KSuLUyzpz0NJfilt6GnGgRJyK82QFmZQPWAuv/YudD9Z2FEGZR1Hp7rjWxnRdqV8kxh6Ul/7F9Y2vFOPXh/SR5uwC/ZJerBc25t38tdJfiuyMVMrEoSiqnGFSXqP1Kl110LYPogvykSJ4W/9e99JX6vMa836NyfRkxvVN/U/98Vd4xhb9xAQcusCv3xX9rxPxpAjEU+JFcaiYj3fvZrz7z8QSvPsx4j28e09cuiV6W/2t/mIY7vm3ojzyzWJE5JjFdfYV9hAxEu+bEWPsD+yPxFi72l4rbsIHbxA325vsz8QtkRsWE+06e5eYbNfb9eK2yA2L2yM3LO7EDSfEFBk9k+heeYG8UEyX/eXFYqbzgvOCuB8fqcWsWNNYU7HUfd59XrzlLnAXirfdD9wPxT9d7WqxLPJP4p3IP4lV6mzVS7wf+SfxYeSfRDbyT+LjyD+J9ZF/ErnIP4kNkX8SdZF/EvWRfxL78U9TLanuVjMtN3JRVhC5KCsZuSirIHJRVmHkoqymkYuyyiIXZR0euSjrDE96Mau353m+1dcLvAKrn9fEa2Zd7BV7LayBXiuvjXWZV+q1s67wyrxO1hDvF94vrWtwTpdaQ3FIk6zhOKTbrOsiD2RdH3kRa2TkRaxRiRsSU6yxkcOw7gkKg5bWS8GTwZPWK8HaYJv1aqTxrXcijW+tjjS+9V6k8a0PI41vZSONb30SaXxrfaTxrdpI41ubI41vbYs0vrUr0u/W7ki/W3si/W7lC+IFCVsWFBe0sN2C3QV77TjzZpWZN5aZNzbzZjpKfoa4H30zS8wj5VHeSjwmnhCeqGBWuWZWucyql0VcLGBu+WZu+cytpaS/Jd4VCWpdRdnVvJPMtg9FgciKatbYWmZeO5ETIatmO+/24nOxS3QQu3mXiT1iv+go8szLJmZetjHzUpp5GZh5GTAvB4tCewizMzCzsymzMyua2x8xR5sxR6tFC3stM7W1mamtzExtYWZqsZmpJWamNrO1rUUzKZivRcxXmy0vUcysVRxz20VLGWcGF5kZ3IoZfIHoJC9kHndmHvfn+GJmc2czm9swm7PCcj5y1gvbqXFywnU2OFtEwtnq7BCHODudOpFydjn7RKmzn3nf0cz7dmbetzHzvo2Z923MvG/DvP+VKFKnqFNEQp2qThWOOo2VEGMlnE5KT9WTlDPUGUKpM9WZwlO/YYV0YIWcTdlerJO4WScJ1sn5Iql+x2opYLX0Fe3UBepCkVL9VD/RUV3E+mli1k8Ts34s1s+VlBqsriHPtWooKcPUMGGrcjWcVkaoEdR8HWsswRq7gVKj1WjSx6gx5B/LqkuaVWex6iaSZ5KaTLu3sgJTrMC7SJmiplBqqppKnrvVdFJmqBn0ZKaaSQorU/jRyhTRynyQUg+ph0ifq+ZSzzw1j5wVqoKUJ9VTlH1aPc04PKOeY2SeV5X0s0pVMSbz1Xx6tUS9Tm/fUEupc7liTqpVitmo1qj3qe0D9bFoqz5RaxmTdWoDbW1Um0R79ZmqZSQ3qy2iTG1VW2lxm9pOn3eoHeTcqXZytk7Vkb5L7aInu9Ue6t+r9lJzvaqn5n1qn2im9qv9tJ5XecpqpUUi4hHRJuIRtvAIW3iELTzCFh5hC4+whUfYwiNs4RFhwSMT2U7yJgk7YhPhRGwirIhNRACbjGY7xh8nCiNOERJOWS2CxJpERiQT7yW2i8KIX4SM+EW0hF/WimbBumCdKArWB+tFMqgJakTzIBfkOLsh2CBaBBuDjaJ1sCnYzPGWYAv5twZbybMt2Eaez4PPOd4R7BQlQV1QR55dwW7y7A32crY+2CcSQT7QokWS5S+aRczF1kk6bGNJVzSFv3xRnEwkE+QJkknRGi5rRkpRsrkoiRhNNIfRWrFtnWxDntJkW1GUbJdsRw3tkx04LkuWkb9jsiPH8B3p8B0pDyQfpP6Hkg9Tak5yDjXPTc6jzkeTj4viiAGFYUBRGDGgKISl/tLIgFN4ywMMOJPjWXCfNNwXg/me5Pgp8RLbSlFlGHAxx6/Ce1K8DvdJuG8VXLlarOE4w1sZ7pOG+4oM9xUb7osb7mtuuK+F4b6WhvtKDPclrJSVEoHVx+rDdrAF01lXW0PZllvlbG+1boX7etm9hG2Y0YMZB7KNmNE3zOgZZkwaNmxm19rR70ZEDNjEMGBTe7+9XxQY7ktJRzqiCazncexLXxTKPrKPaC37yr7iEMN6bQzrlcp+sh/pF8mLSI8YsI1hwFJ5iRwgWh1gwJyQcN8OoWC9fSJu+K7E8F1x9K0o6/NkdbKQhtcUjNaTbcRl0nBZzHBZC3WWOouUiMukOkedw/ZcdR45IxYrNiwWNyxWAov1Z21foi5hO0ANIOel6lK2l6nL2EaMpgyjxRsZrVyVkzIcRosZLlNqpBppGG0U+SNGUzDaOI4buOwmNYHjiNGUYTRpGC2uble3U+oOdScpEbspw26JRnabpqYJaThOGY4rMewm1QPwmmzktYfVwxzPUXOEqx5Rj5AzYjppmK7kS0wnDdMpmK6K44jdlHpZvcLxEvUO24jdFOz2PscRrxUZXis2vBY3vNbc8FoLw2stDa+VGF5LqM/V55SK2K3YsFsLw24ljey2DxaThsUSnuVZQjbwkX+9P1J4/g3+DWzH+GOE74+DfXx/vD+elFv8W4RnmMhOTEvcJ2zDKc2CzbBJKggD+NQwSMpwRzO4YxfHu4M9ogDWyLOSI9YoTMqkFAXwhRJJwxdNDF80gymachwxRdNki2QL8kQc0Sx5SPIQ0tvCEU3hiPbUEHFEE8MRKcMRhYYjmsARD1DnQ8mHKDU3OZf882CHJoYdbGF37R19m3nU3uNvxpGcezAd///zS2/X1RHMcfjVb24O5KnT6//jd5QHqzv6RvYjsNR8+uiLtMi9mG8H66NvyBq+L6IX4Ve/wTy4H2w8v6Jx/4fv37Mf6qX76tlmv/075a7W6cjtfdfv0Q5aT+1Xj/8vdd8DH8OZ///sbGZ2ksxGREoS4UiDiH8RaZomBOHUqVNV55yqbJLNxkW+u5v9x8nWzm5SUk1VVcmpU1XnVFWdqqqqqqqqOnU4dU5V1U9V1amqOnXm+34+u4lFaUXr9/uN1/OeT555nmeemZ35PO/PPDNv/Dlr47Oy04j6Dmsf8bOpfdhY6tKvF3pyTeecqwG0Zc14acq76tn3z7pEhXoSvtdmLJ/yDl3562snr37ehavnb9p72rdNuTZ/eNF2htafhq7kU2Hbvm7oPfXie35P7cD330s/Sc9uuGVtoTaX1me1nbgyPkBaoc3WdoV+98b+05PFnbiGtjbpfj/BwmYhgvMmYVvrtFPwIydCZ/QY70lY5Yar4ZsfsZ9z7HtnO252wS95qfdncK5OIvGnRt9eVur41TX/X1san3l9/uOulZv1SNdt+/ueNl+79BbtFW2ztpL7KdjBJ5u7Q88oP28sdfSSb7uBtv/Fn1+GfN9xmgH6Ch6Ez4qsCLaPv9/G+l2eYF/2PFN7gXH/lNlwVPC6u+Gl+rL22ofBmQDtU20HrWc0POG7uSV8dis4e6S92Pj3n7Ry7RHNpL0Je2xjboFWob1GI80VZ/37vBSOYJ32Jq7xaz47bWK/T5OnCfWe94TOePio9VX4k3Ft/3Vb2/rT9u5GFnij0Pyb5rpiy2bt4Ua7cQTDFcH9xRGMrNc9pmvsjXtM/lvQuaHr83joPAE1N+3HQPPBV47U8fSWVnhbnAEcxJgVxVsKcYP/hLZ99UPn/Ef09ZKnDJsFa/CNQT4CH/8Z7euyK4/ut8+uGt9PNHVeqalLkJWG/X1N9hM+gxmW+/pP25+wln9zA4VpnkerDc0pnsUdfZTPEGortReCM4WXje9fha6yNdqqJvRrPXjBqyF7K3w0zefy+5NfA+AYh0NzKmfJs+4LsYugFzVe0dab5HteIT//ZnAORNt2WYn/3ngPQzV3sbDZ9pDn3EU+6E2y4QvJb74VvAqCM5LBuyO05ZfaQPrrDc2CM1mOFNAew/plyt182d5exll3aSOa0E+bNp/7bhz/J7AegOVHhDBfW4YxcKZ2nzaLRwzI5THDS9pzwXtGK6PK8Q3zqaG2duNuB/NnaWQHo6wQ++KzevT+CL8+mvAOCF01jTPbwbE4ZH/EQrHPpTiOXc7N2l353sPPv4RzSD4np33JR/3r1riC39+a5bJ5TZpZ1768PhOjs3xrozQWfj5x/ZwjHvXN9eMD8jFN6Oe1559voI1ben60BVqNNkPzkH0Y0egS7Y+hLSe0PbT+Ep74y0vMrUl7KdAW3GQ//4XYa0foScwRba+2PewdMuLViHg+0L5ufH+gaXv5gWc21637KefeWF9E2g5+HhoN6H0D/m4PMf5rvbN16xZ4bZPGNY0T6K+J+NuJSIUiZ34GtO+0V7UntFyMITvgwxc27ZfT6ml1+031NPi7vh36KxTFBp8EsLBo6uaXG3iv61otnKIzyP3w5+CrV/3K2L6fR30/daxyowuY1efoRTAePY7r9FTYNhplcB1vxx227Xur37IF/Xwh/N0V+KW3/+/15vsWrVQbyz0kj2eAM/D3Su1vZIciPlwHr2rDtTrG469DTbvGbvXvgKvjP7d2jze2NHh97Yur3x+9gVZ+1mdgIUZ5AmPWv2/uOV9Tnx3w+YkfWfIletv4yrfEbnRpf5P1f/SCMf4mnvVpT/x0PbnGHkL+XTt5M7/8Tzm2XXMfH2nnb/UzixtftLUUM9zs+ej0k3TmZ1tu9ssGjDRNmK2hZ8mNT7/oHeGGeyvq2ncZceTb2RhmaMIeTzTFa/Nf/1K8FnoW+OPeHlfoHeX/H5bEplTiz/CbUGtX+MjCv+PAOHX255mF/DkW8NczPzxiaRea0PLupryhT8z/88v+ajiXkdepxa/gRHYPrtFbvPBotNH+nOKAT67vgeh5+C1+bhPey5tq55NQeueqTZ1D3xLEh313cCMtf4Dz9kHDXrhFqeFbiIb95dGeLutP2F/TLrUWSkuC67CFf/PQk6+1dcH3NW6wn0tQb0nIJouefa8LHUNDD3pe0c8lN76nxrqHvv9Lxh+o9c/wI+ctXD37cs2lSU8a8Csd/eFSV9X6PHS/05w/zQc1vE8RdZ0vUPhxJLL+TbnftaM/9AT4e2vtD6XgrAZ/un2ShWY3rlMr+LQ08fL7T9unHaOvPTuzZKxpbhSjD7EOupp+d+P9u27f3yJsjPm1yZpJe1abS7PDl+6ZB7RFtP7u6vcuvucLwa+0L3+ep/n0RkhwrmofOM5uRKf7wK8bv4yhGRv+JL+fNor+3qY5UKpc24ojelWzh55rXjanReNIqTasCb2pQKv3hmyy6Lvhudor2kbtKa1Q20xXRCLNbO9qiKi0/+F5rAOfHdKcmo3yzuKcf6wtxLG8oq3Ung/N4Fz2DIvGhse1J5vQz8XalsaneVu0Z4HLQnzkU22V9iTyToWKRoZF/kEPmHrj+7vVy62YkaGrKvi+wlXX+y3Y+0dNmo/7nIU9gQldfT/cTnOkODaI7FTw+ttZCj9+3Fn8f/jJYWnwR4eRPsPd9xnunKHwE820XlQ+unFvD2mDQmZw5nlz4/echuDbL6Fya6/R96DHmwt/TyOO5tPu0yqRHmYpWh4VCfl3+gK7j1aglWkPwnqDJ/RvobZMe4/evQnurR3ryGKwpm/LccW/8IPn4eo+rQym0F/rcExh8xiht2sywTR/wfj/xdfwHfmGsDItL57WFG2AdgR+6U3NhjbqtRk4rnXaY+FnhTV8zx0I+ocb7OcfcL0EvxEWYdm032uP0TW0j974NAZ9flgkRF+eB98M+NE84PI9Hr/6m8YfUeur0L1LES7N3XzNJNrU7DrjO6+RyHrj9xfYOz+gOzQmpDsUYL/SCbrbmJk0hSaRplAtaQpN143RPchm6n6v+z2bTWpCT+ncuumsXlenm8tWcE0hto5rCrHXuaYQW881hdgburd0H7A3hQyhJ9shZAnZbCfXFGK7hb5CX7aHawqxfwi/Eu5hHwoOwcn2C5OEP7ADwkzhSXZQWCwsZoeFvwgr2KfCGuFV9oXwmvAa+1JYL2xgJ4XNwjvsK+E94T32tfA3YQc7I+wU/s7OCruF3eycsFfYy/6jV/RGdl4fq49jF7guENNIF4iRLpCoT9Wn6gykCySTFlC0PlufrTOSFlAMaQHFkhZQHKkAtdCP0T+gi9eP0xfqWvJvL3QJXKtHl8S1enTdI16N2KAbw7V6dMVcn0dXyvV5dBYxVmyuKxPjxUTd77lKj87GVXp0Hq7So6viKj06L1fp0T3EVXp0Pq7So3tY/Eb8TjeVK/PoHuPKPLo5XJlHt4Ar8+ie4co8uue4Mo9uGVfm0b3BlXl0G7gyj+4Drsyj28uVeXQXuDKPTuPKPILAlXkEPVfmEUSuzCNI0kLpOUHhmjxCLNfkEZpzTR4hiWvyCO25Jo/QgWvyCB2l3dI+oTtX4xGyuBqPcIf0mfSFcCdX4xF6czUeYTBX4xHu4Wo8QilX4xFc/GsMYZIsyILwB1mSDcJkOVqOFrxyMzlWeEiOl+MFn5wgJwqq3EZuIwTk9nKKUM31c4SHuX6OMJXr5wiPyD3lnsKjXEVHqOMqOsJjXEVHeFzuL/cXnuBaOsIsrqUjPMW1dIQ5XEtHqOdaOsLTskUuE+ZzLR1hgeySXcKzXFFHWMQVdYTnuKKOsFh+RH5E+ItcJ9cJS+XH5ZnC81xRR3iBK+oIy7mijrCKK+oIq7mWjvAK19IRXuVaOsJarqUjvMa1dITXuZaOsJ5r6QhvcC0dYQPX0hE2RiZGJgtvcxUd4V2uoiNs5So6wk6uiiP8naviCN9yVRw946o4epmr4uhjo0dGl+gz+Zcc+gKuiqMfohiUZvr7uR6OfqzygDJeP5Hr4egf5no4+ke5Ho5+BtfD0T/B9XD0s7gejn4+18PRP8f1cPSLuR6O/i9cD0e/SlmsvKB/mevh6F/nejj6t7gejn4L18PRv8v1cPRbuR6OfifXw9F/yPVw9Pu4Ho7+X8onymH9J1zNRv8pV7PRH+FqNvrPuZqN/t9czUZ/mqvZ6M/ECDGy/psYJSZGfyEmLiZer3EFmwgh5tuYbyPEZqyZLkJigu4teKgYeKJmLJbpMLY2Z3qMrq2Qm8Baw/Mmsw7I74h/BtaJdWEy6wqPFokaeRj7erM+GFPz4d0U8m4KeTcjvNso1Pot/jWDj3sQbY9jJahhDvk7B/bjxL8+zMUmsRbsD/gXzyazKew25oM3bAlvqLBWOqMuhiXQ12GJulj4xyT4x07ISdOlsW66zrp05HfRdYHdFX6zFfnN7vCb9wKHw3v2I0W2VroH4UN7kA/tQT40Az7Ui/yHdNNYT12trhZtPgKvmgiv+jjL1M3UPcV66ebAw3YnD9udPGx38rDd4GGfh70MfrYb/Ow7bKBui24Lu1P3ru59lqPbDs97F3leAZ43C3gH/K9E/jeG/K9A/jeG/G8c+d988r9dyf9mkf9tDf/7PGsrLBOWsWThBeFF1k5YAY/cnjxye/LIv4BHXg98A365Dfnl28kvJ8Mv/w24A975F/DOO4F/h49uQz66DfnoFPhohaXqjfDUHchTdyJP3RGeOoF11ifqE1m6PkmfxPpyrw0bXpulwWt3AqbpO6MWfDfrwn03auXqc4F5+jxs7aPvA8zX56MM/DgQfhw5/Du7AvrObgB9W1dA39YNoO/p+sOn+1huhBoxjeng2WcyY8QTEXPYHRFzI+pZ84g/Rixg2RHPRDzLbotYFPEiaxWxIuIVlgDv/yrrwfXaWE8+BrAcPgawKD4GAGPFWNZbbC42Z935SMB6YCTYw/TiP8R/sF+Ie8W9zCh+KH7IIsR94j+ZiBHiAHI+Ej9CzkHxIDOIH4sfM1k8JB5iLfjIwaL5yIEyx8RjrJn4ufg5i8X48QXTiSfEL7Gvk+K/WXPxlHiK3cZHFOzrG/Eb1lI8K55ld4nfit+iV+fEc+jJf8T/wD4vnof9nfgdyxX/K/4XLV+UBNZc0ksRLFcSJZHpMA4ZGNy4JLNoKVKKYkYpWopmekmRFNZSMkpGdpcUI8WgDMYq1gxjVQvUjZduQ90EKRHlk6TWLFZKltqg5bZSW9RtL7UHpkgpaOF26XaUT5VSUb6DlIbynaXO7DYpXUpHfhepC4uQukpdmSJ1k7qj/R5SD9TNkDLQWk+pJ8pkSpmo20vqxaL4uIh93SndifwcKRcl86Q8tNBb6sdEqb/0S5QcJA1iBulu6W70+V7pPhzXCOk3aP9ByYS9F0nF2EuJZEE7ZdIElidVSDbWW7JLLuzRLXlYH2miBL8h/UGazOKlKqkKvfVKU3AsPklFO37JjxYCUgAt1Eg1aP9h6WFsnSpNRfsYm1kiH5tZN4zNT7Ce0ixpFsvgIzRrhRF6LrbWS/UsQfqjhHtfelp6muVI86X5OM8LpYXAZ6VFrAdX1kN5jOJo4QXpBeByCVemtEJagbovSStZP+mv0l/R8irpZWxdI61B3VelV5G/VlqHkq9L61HyTWkjtr4lbWKZfOxH/nvSeyi5TdoG+33pfZTZLn2AMjulnejJbmk3erVH+gf6uVfay5KkD6UPWS9pn7QPtcAVUP6gdBCtfSx9jPKfSZ+hnWPScZT/QvoC5b+SvkGZs9JZnIFvpW/Rn3PSBdaK8wmWAT5hhB1jaM56GuIMLViiId7QimUaEgzJrJehjaEd6w620YnlGNIMndlAQ7qhC7vT0NXQFTndDD3YXYYMQwZa6GnoiZKZhkyU6WXoha1Zhizk5xpysZc8Qx5K9jb0Rn4fQx/shX9DquOshfXgrAUI1gIEawGCtQDBWoBgLUCwFiBYC0vgrIUlctYCBGthSZy1wAZrYTmctbBWnLWgPFgLbLAWbAVrAYK1sEzOWlgvsBYLypfJZewucBcbM8p2uRJlwGBQFwwG+WAwKKnKKtrxy37YATmAfLAZ9ARsBuUflx9nPeWZ8kzUAqdhGeA0c5AzV8bVJdfLT8P+i/wX7GupvJQN5CwHOafl02jha/lrlAHXYd0412GJkfzBR79IXaSOteKMBzlgPEAsrBsYD8bHyNjIWJYJ3tOC5UTGR8azjMjbIm9jd3E9QdYzMikyiSVFto5sDTs5MhntgBWxnmBF97OYqJFRI5kU9Zuo38AeFTUK9m+jfgt7dNQYFsc5E3KmRS1mQtSfo5bDBnOCDeaEMmBOKPOfaB0TooXoJJbP+RPLCn4Jy/kTEzh/AoI/AR9QHmDJylhlLPuF8qDyIGumjFPGsbZKoVLIUhSTYmLtlSKliOmVYqUUtkWxoHyZUoYy45XxKDNBmQC7QvkfdrtiVawoY1PsKONQHNjqVFysDTjZRORPUiYhH8wM6FW8wIeUKay14lNU1k7xKwGUrFaqUbJGeRh7rFUeRU6dMgMtg71hL7OUWcAnldkoM0eZiz7XK/Vo54/KPNhPK0+j/HxlPuw/KX9CmwuUBdj6jPIM66gsVBayNM75WCdwvsUsXfmz8mfWV1miPA97mbIMZV5QXsDWl5SXgCuVv7IuyiplFba+rKzG1leVtayz8pqyDjmvK68jB0wRCKYIfEvZxFKVt5XNKPOOsoV1UN5V3kXJrcpW7GW78gFydiq70CZ4JNrfq+wFfqjsQ5n9yr+w9YByAO18pByE/bHyMesJfvkJWjusHGYdOctkbcAyA6y1sdpYw9obHzbiLIFx1rIuxkeMOFfGOmMda2t8zPgYcp4wzmLpxieNT7K+nIkiB0yUdeFMlMVxJsoEzkSBYKKMmCiL40yU9QAn6kpMdAAxUYE4aJBxBrlmdBizNLLf4Z+ROOUviVPeHcYpf0WcMp445W3EKVsSp0wIUz0QSfVAItUDkVQPxJDiC1c9EEn1QCTVgyhSPRBJ9UAk1QORVA8UUj0QSfVAIdUDkVQPBpLqwSBSPYgl1YPBpHowhFQP7iHVg6GketAKHDcajNOoMxK7TQS7xT+WRRw3Gxz3XrBJzmLv1f1G9zvkcxZ7l86is7A7wF/dQI9uMsvVecFl7wCXrWV5YLGPwH5U9yjKcy57B7jsXNYHLHY+ywd/XQ18RfcK66tbo3sTWzl/vZ/4az/ir/2JvxaAv2awCOKvEcRcmxFzjQBzxS8E5vor1kK4B/y1BekyBBVrYkiXIYZ0GeJIlyGG2O2vid3eKTwiTGe9ueowG04cN5kYbRfhJeEl1llYC0Z7O3HZDsRlOwnvC++DuXIW217YJexC/j/AXNuT1kNr4Z/CR+CyHwsfA7nuQzqp4KQJR4T/g5zPhM+AXAunDelBpAhfCidhc1WIVOEr4TRsrg3RUfhOuACbK0S0FS4KGmtDOhHt9Dq9AJurRaTqRb0Im2tGtCPNiBR9tD4aOc3Am7sRY+5JjLkXMeZh+tb6ZORz3txNfzt4c3d9R/DmbsSbe+jT9emwu+oRSYFD92KZ4NB3ws7R57Cu+rvApLsRk87Q9waT7qbvq++L9jmT7kYc+j7i0COIQ99HHHoEsecB4M1zwJvngis3J67ckrhyInHl7Ig14Mp3gStvZnkR70RsZ32JMfcPU7IQSclCISWLWFKyGEoc+m7i0PmkajGImHQO8WYDMWYDMWYjcWUDceWW4hHxCHjwUfEz5HB+fBvx47vD+HFL4scJ4hnxDJAz4AHEgA1hDHgAMWBBksCADcR9DcR9E4jjDiB2awjjtQnEZQcQizUQi21JLHYAmGs3bL3EWQcQW42WsqQslMyWslGSc9YBxFaD3NRAfNRAHPSXxEHvDuOgvyIOGk8c9DbioC2JgyYQ10yQ6qQ6MNfHpMdYFnHNHOKXudIcaQ7yOb9MIn6ZLy2QFrACYpZZ0iIwy1xilonELPOkJdIy1hf8cgVyOKe8l9hknrRaWo1anFNmEae8F5xyLeq+BmaZSMwym5hlnvS2tBktvCO9g/LvSu+iPGeWicQss4lZ5hGz7C/tknahBc4v84lfZhG/zCN+2Yf4ZQHxyyTpI+kjbOXMsoFTnpBOIYczy2xiljnELO+VLkoXWS5xylzilHnglK1gczbZh9hkvqG9oQPrS5yyP3HK+4lT9iMGmU8M8n5ikP2JQSYa7jTcCeQMsoAYZH9DX0NftMn1VhTSWxFJb0UhvRWF9FbEMO2oIaS3IpLeimgYYRiBvXPVFZFUVxRSXRlEqiuxpLoylFRXWpHqSitSXRFJdUUk1RWRVFcUUl2JDVNdUUh1RSbVFYVUV1qR6opIqisKqa6IYaorIqmuKKS6IpLqSiyprrQi1RWRVFcUUl1pFaa6IpLqikKqK0NJdUUk1RUxTHVFJNWVKFJdUUh1RSTVlaFhqisiqa4opLoikuqKQqorIqmuiKS6opDqikiqKwNJdWUQqa7EkurKYFJdGUKqK/eQ6spQUl1pRaorIqmuDCLVlSGkujI0THVFJNWVVqS6IiIGAIsF4+/A8onf95U7yZ1YHlh+GsuVu8hdWLbcVe7GssD4uyM/Q84I8f4sOVPuxQqI/WfJ2XIOkMcA/eU8OQ/t9JP7AQfJdwMHy/egtaHyr1FmmDwMMcO9iAfy5N/Kv0U+jwf6yIVyIXpSLBejfFCbikcI/REhlGMvwQihUnagBafsRC237Gb95InyROQ8JPvQfx4n5FBskEhaVlkUIeTKM+QZQB4nFFCckCs/JcM/UJyQRRFCnvyM/AxynpOfw955tNCfooX75eflZajFY4Y8+UX5RZR5SV4J5PFDX/mMfAYt8PghR/5O/o71ofjhXoof8il+yI2UI2WWRfFDTmRUZBRsI+KH3Mjmkc1RnkcR/SmK6EdRREFky8iWiDFaRSagZCJiiWyKIhIj20W2Y30RRYxkzShyaIaYYTRrETUGkUOLqLFRY5FTElXCekeVR5UDK6IqgNYoK9AeZQe6olxArrATQwo7MaSwE0cKO3GksBNDCjsxFIFEUIzx6+jW0Snszugh0fex3tHm6MlseEgJjEcdekQaXVgExRJdKJborJRSLPF7pRxMl8cP7Sly6ILIwQbbrlSCwXsUD3J4zHC7UqVUIechxQc2z+OEDhQndKE4oTPihOnIeRTRQmeKFjopjyuPozyPE7ooTylzsHUu4oROiBP+iNZ4nNCB4oT2FCHcThFCN+VZ5Vngc8pzQB4h9KIIYZjyPCKEDEQIy5H/orKC9aAIIYMihEyKEHohQngZOauVV1hXZY2yBiVfU15DPo8TuivrESd0UzYoG7B1MyKEHhQb9KLYYJiyTXkfW7crO5DPI4RMZbeyGyV5bNBL+aeyH/n/QmyQidjgI7R2EBFCG4oQeiiHlEPYL48TelKc0F35VAHXIs2jdNJRS1OOKyeQw/WP2iknlVOwuQpSKqkgtSMVpHRSQWpHKkhtSUetjfJf5b9AroiUrmgKmBjpIqWAIIOJkTpSW9JUa0MaSa2NslGGzZWSUkkpKZ2U1dKMMcZmyOeqSanGFsYWyOHaSR1JO6mtMcGYhK1cQSmdFJRSSUGpIykopRjxD1u5jlIq6Si1Ix2lFGO5sRzxD4+IOiAi8rNkRES4HozTjNNYJ0REdcjnUVAmxT/DEP88BXuOsZ71oCgo0zjPOA8212NKJT2m1qTHlE56TB1Jjyk1qNbGdK1PJ6tYK/rp7GPGTGOQTEgWpAokB9KkxrWucgnWU0J5NUjTkWYizUGaj7QIaSnSCqTVSOuQNiJtQdqOtAtpHxMCVkrMdJCSEHAhTYZ9BOk40imks0gXGCsSkGSkmOC+i+KRkpDaha07hv3dNdhWUSZSDlI+0sCw9RCk4UijQnX4eixSMdJ4JPSryNW4FgIqJV3lcqRVsKc25gVTHdKskD0ZqT5kLwilxaG0DGkl0hqk9UibQmW3UnlWxPvM11OR6pBmUb+CZXdQOVZUj7QAaTHSMqSVSGtC+9sDez3SJiRedgcSz9sf2r4/lA4hj6ejOJ61SBsaj4UVnUA6jXQO6SJjxRFIUUixwfNe3BIpObROubRuLJ8WvAb4msrHBv9u3N4dKQspF6kf0iCkoZfW/PcrHoE0Omw9Dskcti5HsjeuhcDRYL+LPcFjK/aG2gncWKLrOjzVBBPvx2Xtjbgi1SLNCK1rr2pHCPC+zUaaF/xtihciLQlbL0daFdG8MNc6yOcyHbRd4GgXCGXgEXsM8Lg9HnjKngQ8a28HvGDv6HPxWuqZIsHeVT1f2M861De5cJB1hE8tku2ZhDmNdow936fyrX5WONQ62je1KN4+0Dc1aIdwhHWcr64oyT6EcPgVdjv7KGBH+1hgV3sxMNM+3lfHa/mlwtFWs29W4Thrua++KMduBebbXcCB9sm+ep7vVwrNVrtvQdEQuwocbp/qjysst3p8i4tG2esIZxHWA8faFwCL7YuB4+3LgFb7SqDLvgY42erxJxSp9vX+toV2q9e3rGiqfZNvWaHHGvCtLKqzBvyphV5rrW9N0Sz7VmC9fQdwgbXWn160mPIXcCwMWGf41hfWWmf7NhUts+9pxJX2/b5NPN+fEcIZ1nm+rUVrsJXjoUZ7vf0ocJP9BHCr/TRwh/1cI+6xX/RnF+2vjPD3LpxtXejbUXSoMsq3g1rbE8o5WhkLPMGR5/gLCudZl/j2F53GOec4pMHm+f7BhQuty32His5VtvQd4rZ/WNHFymTYS6yrfEeLIypTCNMa7ajK7sDYyixgy8pcYHJlP2BK5SCyhwLTrKv8IwuXW9f6ThSusm7wnS7uXjnCP+YyzKoc7R9TuNa62XeucIN1m+9icW7lOEJzo92vstx3sXCzdacaUTyo0t6IQys9akThNuteNap85eSThGcIzwPXVDHg+ioJuKlKAW6tigPuqEpQo3itmmHle6raTltauNN6QI0t3Gs9rLYs31+VCjxUlU7I7aNVGWpLvnXaisID1mO+leUnqrJ9K4N2CA9bT6rJ5aerehMWXGGfqxoMvFg1TE2eEFE1EhhVNUZN5rWmrS48Zj2jphSetJ5X0ybEVpmALasswOSqCjWN509bV3jGxtTuE1KqHMC0qknTNhaet0lq1oTuVVMIawinA7OqZgJzq+YA+1XNBw6qWgQcWrVUzeK1pm2ZMKJqxdTDJmYarOZOGF21Ws01STZF7cdx2naTYotTB00YV7UOaK7aqA7iOdN2BfNDGGdLUIeaEmxt1RETyqu2NKK9ars6gudP2xfCtrZUdfQET9Uuwn2NtrfqIDBQdQRYW3UcOKPqFHB21VngvKoL0w5OWOgVph0xpdrS1XETlnhldRy1Zg7lLPfGNCDPmXbclG7LUMsnrMJvB/TGN9g8f9opU4Ytmx+XNwn9hz1t14S13naws229VfuEDd6OhF0b7c3eTOA2bw5wpzcfuNc7EHjAOwR42DtctfO6086aetsKVI+pwDZY9U445h3ViCcJz3jHql6c22E4w4NtI9XAhPPeYsLxDXYF81rVQOEx2xg1pULyuhpR8U5WU0zDbCa1tnhEpZcw0GiPrqwFjqucATRXzgaWV84D2isXqrW8lt9U7Klc4reYRtos6gzTGFuFOrvYW7kcGCCsJZxRuUqdzbf6K0wmm0OdZzJVruXI7eLZlRvU5SaLbZJvVvG8ys2E266wF1buBC6p3AtcXnkAuKrysG8Wr+V3mCpsU9SFJoetRl1SvLbyGHBD5Ung5sozwG2V59Ulpkm26ery4p2Eex3MP8k0xTZTXVV8wCERKoRx6irTFEcC7MOOtsBjjlTgSUc6z7fN9E8pPuPIQM55R7a/xlRjm6OuLWGO3kDJUaCuNU23zVc3lCi2+f7pJXGOweoG00zbInVVSYJjGLCtYyTaQY5/CuHM4FbTHNtSdbNpvm2Furwk1TGmEdMdJpwZ5PvnlGQ4LP75Qdu0yLZa3VaS7aggdDRib8ckYIFjCnCwowY4zDEdONIxEzjGMce/qMTkmO9finbWqTtLLI5F6k7YG4FLbVvQwwrHUsIV6BVy0M8Vtu3q3hKHY/XlyPP9K0omOdb5V5dMcWxUs0yrbbvUAyU1ji3qAW7715lWO7bDXmfbR0e0i/CSne44CJzuOAKc6TgOnOM4BZzvOIvfaLbjAo4ddXG8G20HfftNW2xH1MMli5xCIy4lXOGU1cOm7bbj6jHTLtspfg04YwjjG7BktTMJ18A+21n1ZMk6Z7tG3OjsCNzi7OrfWLLdOsi/pWSXMxP8hHOD7SX7nDm+upKDznzgEefA0Ai+i4+D/n0lx51DfFtLTjmH+7bSSHSw5KxzFB+VnGN9R0suWLf5j5gFZ7Hvoll2jvddpPvluDnGacW9w6/bU+Z4p8s3y5zknAxs51RD19hZ/vv6L5g7Oqeq20yLnHVAnIeAYO7qnMXPibMeSEdqznQuAOY4F6tL+Igz7UJFnFfF6APPXytUJHinqskVbb11wFTvrKB/rpW5l6uNqUj31qujKzK8C9TR3M/Uxldkexdzn+NdBoQnqU2q6O1dCe9R4F2jBviV759izncuU4eaBzpXBmTzEOeaQIx5uHO975B5lHOTTzWPdW71TTUXO3cE4lFmD8qMd+4PJJmtzkP+OLPLeVSdbZ7sPBFoZ1adp3315qnOc74T5jrnxUBH8yxXRKCrud4V5VtpXuCKDWSaF7taBnLMy1zJvq3mla6UQL55jSstMNC83tU9MCTIN8ybXFmB4eatrtzAKM4o/MPMO1z9AmPNe1yD+K/gGhooDo7s5v2uEcBDrtHAo65xgfHmEy5zwGo+7SoPuMznXPbAZPNFlyeglka4vIGppVGuQKAuyGmLRrlq8esTdwqylNJY14xAI290zfbVl7Z0zcNIjWsjUF+01bUwUF+a7FoSWFCa4loeWFya5loVcJV2p5JZrrW+TaW5rg2BZaX9XJthD3Jt87lKh7p2Ake49vrqSke7DgDHuQ77FpeaXceA5a6Tvq2ldtcZoMd13rej1OtmwIBbQn9q3QpwhjsusLJoiDvBt6B0trttYE3pPHcquAfOQGB96UJ3eujaNpUucWegneXubN/F0lXu3oFNpWvdBYGtpRs4wyzd7B4c2FG6zT0ssIffF4H9pTvdI8HSwdUDhwiPlu51jwky8MAJwtOE5wgv8r1URwSx9IDb5JtVethtwbEfc1egbyet9uqo0jNuR8iOJWzJ76/q5NLz/ExyPlydQpjGeW91dwtzT6ruTnYWYa5Fck/xrbco7hrwYbDi6n6WOPf0IAeuHkQ4lHBE0VH3TN8OS4J7DrAtR85aq0cTjrOkuucHmWq12ZLuXuTbb8lwLwUiHznZ7hVB1lpdTmgn9PC7vtpLGAiipbd7te+EpcC6trrWMti9znfaMsy6oXqGZaR7o++cZYx7C9Dk3u67aLG4d4Fb4nepnk04z1Lh3heIKbG44RUtDveR6oWWSe7j1UuQA69omeI+i57XuC9UL7dM9wjVqywzPbK6wTLHE1O91jLfE1+9AflJ1ZstizztqrdZlno6wquT97as8HSt3mlZ7cmEN97lyaneG/SElnWe/OoDlo2egdWHLVs8Q6qPWbZ7hleftOwiDnDAMwpjQXCUIb8dHKMt+zxjMeJjtK0+YznIR1vLEU8xRjp4rerzJYM946vPW457rDXMcsrjUtdaznomVx8OjsslqR4Vx3LBM5VzCU+dWlsmeGbxMd1T75tVJnsWNIy2ZTGexXz88ixTt5XFe1YiJ8mzBtjOs75hpCjr6NlUI5V19WyFnenZUaOU5Xj21MTxo6tJKMv37A95WkfZQM8htDPEc1RdUjbcc6Kmbdkoz+maVJyZczXpZWM9F2syyoonRtRkl42fGFXTm5+3mgJqZ3AJmxirri2zTmxZM4z78JqRIbYDrBlDaGpgNTZHjYWQeE6Ng3AS70PNFMKaMtfEZHVh2ZCJKejJZM5GylTb9IBQNnViWtCumU44k48FNf/L3vcHxZFcaWY1rabFMAzDaBjMMJhhMIMxxjLGWMfKGMsYyxrUdDcYa2WGYTHXXVVdv2j6R3UBPS0MTQtzCobVYlaHsU7L6QhZZrFCh2UdlmWOZVktgQnM6lhCp8BaBcY6QtZhzHKyAt/LrGpoIY1Hjt3/7HjxZVZXZWVlZb73vZepLNGLWbet195Fehiii7Z+kp4j8cOGvcebC/4CjtuGSNpr7/PmBybsA95CiCggrmgbtg96i9UoolWH07bLJO3+eoa3NDALV8sgveC1ah5/A6dtV+0j3mOql2+7bh/11gRu2se89ZDCeTgz7mVVL982SdJpks5hP9W2QNJukt62T3kl8N3gwb9Rb5/xesBTgx9vu2uf9zYHVuyL3tbASt2ENwS6cdV7KnCf9Pk9kj4g/XDZvuQ9HbhlX/aeCdyxr3rPgk8nUah9zXs+kM8dbh4LpXGm5vG2R1xl81QokzvePNM+xdU2z4dyOFvz4rsjHNe8RMosQxln8yrEvXLzWiiP8zdvhg5wbc1boSKus0UfKuG6W2Kght6W+NARrr8lMWTmzrWkBIq5oZb0UBU33JIVquYut+SC37zakh+q4663FL67yk22FIdodXbATbeUBkq5uZaykMBNN6d1zHELLdaQi7vdcgx71ZaakKLF4Xdb6knKQnqvRQoFuActnlCQ22hpDnVxj1paQz28riUU6uONLadCA3xcy+nQoDoDdeS2nIE5lzrTIXMKfl/L2dAFdZbHJ7echzSt5SLMCLCvH3GEWi6FRjhDy5XQKJ/Zci0U5HNaJkJdjnhSMq/lRvASf6BlNjSmzrPYkRaY8/JFLbdgPrvWcieQwpe0rMC8MrflfiCfP9KyHn46b255CG0gsyS+yo9gxqS2p9pvgLTOHxsad6T7EwK5PO1PCk3xgj/13R7cA6EZ3uXPUGOVjsu84s+G2gL+/YFWPugvCM3zXf6DoUV1Psj3+A+Flvg+/+HQMo5zQqv8gN8Efg1m1qE1km7yg/5Kdb4c2sLpN7JweiIDpyf1+CknybNOxnOxfuh//oIf5sL8iN8WyMXz35OJ/Kif045TSJqO46WT4Z6E2evJXJLm41adLOTH/M6TheS4mKSl/LhfDpTxU34/zF5hDnuyjJ/xt6kz1pNqeoykMK/0d0KPzfu7wymeY554hNOT9fyiv1edV55k+SV/f4Dll/3nIIXzcGbVP6TOMeHpOC0mKZlpniRzxpMekjbza/5hmDnC/PFkK7/pvwzzRJhFngzxW/6rgWJB778OaYx/EmI8g386kI7H5eQpkp5+Z90/d/KMEO9fCJQKif7bgWYhxX830Cqk++8FYuyb3ouBkK3TewlYa8t7BWJUGVjxIq33XvvGLTrGO9G2Qcd7b5zopRO9sydkOsULc7ft9FbbIzrde6ddB+kKSe9DmuVdbzfSud6H7XF0vncWInYyp7N1yghqLpQN7fvoYjm2PZkulRPa02xDmD9xCk8pk5PaM2mrc397Dn0M0ry6dRlmcHSNnNF+gK6Xs9uLaFbe315CS3JB+xHaIx8MTOC03Yx5sr1Km1uRlG6WD727SbeKl9ur6ZB8uL2OPiWb2mn6tFzZLtBn5OPtLvqsXAvpGdnWrtDnZa49QNIgfVF2tndBKkN6Sfa3jkDa1jqCubS9h74id7b30dfk7vYBekLubR+kb8j97RfoWflc+whm0fZR+qY81D5G35KHAxJ9R77cPk6vyFffXaTvy9eBA4/Ik+1T9Lo83T6jeiicts/XLnjG2xdrF+S59iU1cvuPN+SF9mX6oXy7fZVB8t32tXdOyffenWIM8oP2TSZW3mg3Mgnyo/YtJsmna61iUn3GoJ7J8MUFY5hs375gPLPflxxMjKyNKfClBVMgzQymMwd9OcEs5pAvL5jLHPYdCOYzJl9RsJCp9JUEi5njviPBUqbWZw6WMTZfVdDKcL7q4DHG6asL1kBKB+sZ2ScEWcbvcwUlps2nnLAxnb5A0MN0+4LBZqbX1xVs1dJ+X08wpGpL3bqvL3iKOecbCJ5mhnyDwTPMsO9C8Cxz2TcSPM9c9Y0GLzLXfWPBS1DPONQz6ZsKXmGmfTPBa8ycbz44wSz4Fk8MMbd9S8Eb9i3fcuAGc9e3Cuk931pwlnng23x3CdItSDcUffAm80iJCd5idUp88A5rVBKDK2yckhK8z+5T0oPrbLKSFXzIpim5AZbNVPI7EJujFAZusnlKcfsme0Ap7TCwRUpZ6whbolihbeQp7BHlWEcsa1ZqOhJqK5X6jqTaWoUNnGGrFKkjtbZX8XRk1PYrzR3ZkLYGZtlqJdSxH9JTHftrh5XTHQVsnXImkF67oJztOMjSyvmOQ6ygXOw4zLqUSx0mVlGudFQy55Rr0EuQdhxXZ/1sQJnoqGWDyo0Osm7TQWKVDifbJfo7ZNXicIxxIltbqXjcOq6qawXqykB7D9ujzHb4sX/vaMNz8I5OTSfJ6hBeWzjRy/YpNzu61UiMHVBuQTqo3Dnh1FZvyLoKrRe5jl5sHR396qyfvaCsdJwjs84NpEOvUA+o/4sQ9RsKflEPqd8iPfU7HYUMuj06A9qre04Xi57TxeteRM/rXtYlohd0ybpX0Yu6dN0b6CVdlu6j6GXdt3XfRq9EHY76MkraU7rnSyh5j3NPI0rZ85M9P0GpcSDow3FpcUdRWpw5rhqZ4t6Ja0dfi3sv7seoNW4qbhV9P+5+3Aa6Ca2xID35fjUOvYD2ohdRJXoOVaE6VI7q0TdRNfpP6BRqQ93oZyiI/gn9HN1A/0LFoP9FxVLPo99RL1AvUxSVTGVRRrx/kXqFOk7ZqRSKoYJUNhWiTlOHqT7q29RXqP9O/ZT6WtT3or5HefQuvZvy6gP6VsqnD+m/STXr39O/RwX039L/NXVC/x3931Bt+mH9CHVSP6r/IdWl/7H+x1S3/u/0f0+9R77+O62f0/+M+pb+tn6J+mv9sv6XVL/+V/pfUWf1v9H/K/Vf8G42anDPS3teov7bnp/t2aKGDHsMGdS84U3Dm9S64aOGXOo3hs8YCqnf4i8VqN8ZvmAo0ekNpYajOoOh3FCtizP8haFel2KwGZy6NIPb4Nd93HDScEr3GUO3oV/3WcN3DOd1R/B3ADqrYdjwj7oKw4xhRtdgmDUs6JyGW4ZbuibDkmFJ12z4heGergXvl9KdMPzasK4LGjYMW7pQNIp+XvdedEL0y7rvRL8S/Ybub6Izoz+tG4n+fDSnux7dGN2jW43+q+i/isJ7ffqjno/+bvRw1Ev478FFvRL9g+grUSnRV6N/EpWK9+tEZUb/U/RCVH70YvRy1IHoX0b/a9QXjZnGS1GVxl/vfT3q53G/jfutHn/xxaEQpLEoFX8R/PkHgEcIHcoDZKJM4dyXWWFIGBYuf/micFW4LkwK08KcsCAaLS4xTtwnJltGxTQxU8wR88QDYlHZw6OpXzpnGhNuH0XCXeGe8EDYEB6JuqOpb3WBVulBxx8QHf8NoqjfUb9DOtDoeBQF114jO0KR7ru67yJK9z3d9+DaiO77KEr3I92P0B6yI9Sg+6nup8hIvmXaq/uZbh7FkL2gsWQX6PO6n+t+juLI/s8XdL/S/Sr817+iqChq+68d7okyoETy7VNSVGJUIvpQVFJUEkomOzZfjcqKykKvke+aUqMORh1EaeQrptejiqM+j9LJNx4ZZM/GR6D9sVQC6TmcIiEFQfwgpAtZQq6QLxQKxUKpUCZYhWOQ1gj1AitIAI/QLLQKIbh2SjgtnBHOCueFi8Il4YpwTZgQbgizwk3hlnAH0hXhvrAO19aFhyISISoTId4SIdoVIWp6TK6LEAuJEPdsi0msFI+LtRFiEznRKcqiH8ruyKQ4DWmb2Cl2i71i/7acE4fEYfEykatQ3xycKxAX4Oi2eBeO7okPoM4CcUN8JOnETnh/ai+nsQb+rvxF0idJIFEoBUSPMtGbaA/KAYlGnwAxokKQveggSAwqAnkOlaAvku8H3wLWUb8c/HN0nHw5WAP11YO8hGiQfagRudDLyIcU9Ap6F+RD6BsgycBH76FX0bdAXkP/GSQV/Vd0Hn0YfRfkdTQMko5+CPIG+h8gGehHIB9B/xNNQPtugGSRv9/5UbSA/hllo/8NkoP+BeTj6BcguWgN/Rravon+H/ok2gL5FKWjolE+FQPcV0j2cf8ZcF88Okj2cRdRqdTr6HPUG9Qb6Avki8USYEMz+iL5O3el1NtULfoSVUfVobfInu4y8n3iUYqjOGSiREpE5ZSb8iAz1UK1IitwZxAdA/Y8if6c+ibVhb5GdVPd6G3yfWINMOkV9A51lbqKvk5dp36C6qlJ6u+RjfoH6h8QTf0jNY0Yor8OYIEsxBmzjdlIJLvnJOMnjXmogeyYazQWGguRy1hkLEJu8r2Mh+yP8xprjX+BfMavG7+OmmBsl9EG0f0C/P/d8AmAJEAqIAOQrWG/hgLAQfRVPolP5TP4bH4/X8Af5A/xh3kTX8kf52t5G8+BOAEy7+fb+E6+m+/l+/lz/BA/zF/mr/LX+Ul+mp/jF/jb/F3+Hv+A3+AfCToQoxAn7BOShTQhU8gR8oQDQhE/KZQIRwSzUCUsCdVCnUALguASFCEgBIUuoUfoAxkQBoULwgjIqDAmjAtTwowwLyyCLAurwhr+u2h76vYw4ATfjqsBjdWBfv576fdRkBeIlscTLX+RaPlLRMv3ES1/mWh5ItHyJKLlyUTLXyVankK0PJVo+YeJlqcRLU8nWv4G0fIMouUfIVqeSbT8TaLlH0XTINlE1z9GdD2H6Hou0fVPEF3fT3T9k0TXP0V0/dOg6zpUQPT7M0S//wP1GpUKeo81+yDR7M8SzS4i3yl8jmhzMdHmzxNtPkS0+QugzS1gA+9S74IN4K8VvkS0+TDR5iPUX1J/CfaAdbqMfKdwlGiziWizmZoGPbZSM9QMqjB+xfgVVGk8bjyOvmJkjAz+4jg+EN8J4xQLff8colyXEOI6Ad2AXkA/nLsC+TnAEGAYcBnOXdO/yHW5eoWM3w9SJtuTy/W4+rk+1zlh/+PA57gB15BQADjoycfgBl3DwqHfD1yGu+C6zI24rgqHd4B/c6Ou64IJUOkp5MZck8Lx3w9SptZTzI27pgWba5qbcs0RzLgWBA7g9JSSY9lTJvg9Vm7edZtbdN0V2nZAfnd6jnFLrntC9weg11ND6lh2PSBYdW1wa65HQr8KfMxtunXCuR3g39yW2ygMuY04x+D17jhh+IOBy/Ex7n18vDtZuPw4+ER3Gp/izhSuPg4+3Z0jXN8Bn+XOexY0nlam+Vz3AT7fXfRUFLpLMBrPKHMYfLH7yDOh1G3my9xV74fGs8oCb3VXPwucg75b/DF3HUGNmyaodwsYjeeV2zh3ziuxjReVuzzrdvGSW9kN54hvhfe4Ax+ExkvKvcYrygO+2R0kaHV38SF3z2M45e57AqfdA4/hjHvwmXHWfYE/7x55Ahfdo/wl99gT2N3XV9zjzwJh0lPPX3NP8RPumacCrgnTHlaY80ik3A33/DNh1r34VN3B9S0Abns8/E330rNAuOtp5m+5l7dxx726DXz9HuCBp5Ucb3hCwiPPKX7FvUbauwuiznOaHN93b34QRKPnjBjnOftYHevurcfw0KPfDXGf57yY7LkoIE+MmOa5RPJMz5Wntef9IBg88UKsJ/EJJHhShCRP+hNI9WRFQszxXAtz+2NcrHFlmOPEPM9EmIPEA54bkTyyrSeR4xoel3AfFXlmt/u2xHMzsk2ES64Bp4A+Nk6oetl4Q7NhbFezgJvKBtb3xluAO8qjsD43rkAOzxGPeG6JZs8dscqzIlZ77ot1nnXsX0Ta8xCfJ+8GPkIUvAj7EtHlNYiKN1YMeBPEoDdJ7PKmij3eDMzt+J3FPm+2OODdj/lZHPQWiBe8B8UR7yHCy8DpuC/EUe9hzJ3imNeE6xXHvZXilPe4OOOtFee9NnHRy4lLXqe47JWJj8Q+CPsE3IernlxxzevHfkzcBP8T7uctr0nSe9twHfiaFOPtlOK93cT3hH1txBht14mh+ZSwL8Dtwr5RSvT2Sinefinde257nHF5GDs89lKWd0jK9Q5L+d7LUqH3KjlXDD68RwX219hvP4ZB1S9Lpa7LxB/Dc8K+GOcEoD/k3Xb5WJxjSGWu2xjYP4b9ahiS1fUAY9tHYp+p+cZIXxnpI8N+MgzpGPhB8IXE94E/lGrcaRhEb7GfS1ch1XuvY72UWO+kJHmnybHHOyc1exeIzgJ/SK3e21LIe5dcO+W9R/LT3gfSGe8GtlvprPcRtifyXudlnXRRNkqX5DhiF2E70HgRc6l0Rd6HeU66Btyk2Yg0ISdj3sL3hznwCdvaZVfb/KLZFq4D86Z0w7MuzcppuI3b90N5bG/STTlTuiXnSHfkPGlFPiDdl4twuzEn4XeQ1uUS6aGs+oYP4iCtXQ1I4/EwLy1ElNHaTN51Fx9vvw/m4TDe71nvw6cNBi2P9cTgsQjjCZ6M5ErMj2GOjOBDXJbUg8tgboI+aEjwXGy836TDY9y43mTE79n4sCnOhZr2uQxNyfg84SxJGXLFNqWR+AX0Dpd1JTRlkngD4g5XUlMOiSmA01ypTXkkTtNiAldG0wFXdlMR9v+u/U0lmOtcBU2EC10Hm8wY2EZdh5qqXIebql2mpjrMw67KJtp1vEkgMRnwpau2yUXutTUp2zETjnm0GIXUpdWBr7m4pkCjVekk7QrHduHYwLrDwQThGEaLPXBdpA5nU9CZ7LOSe8L34/KYo/FvrBe4D/C7yU1d5ByOG8PQ4sTH8CyxIG5bOKaLiOu2geO5MHbHdeEY7Smxmcuv4gNjMxx7RcZfOOYKx12RMRZuK74Xlwn3iWZbDUmymeSpclVDhlxNdBXHPGG7ypbrGvbLNEGBLDQclF0Nh2Sl4bAcaDDJQYJKuavhuNwTqe8NtXIfgU0ewPbVwMmDDU75QoMsjzT45dGn2hvMDxra5LGGTnm8oVueauiVZ8L21tAvz28fn5MXCYbkJQxie8PycsNleZXkV+W1sA02XJc3GyblrYZpn37b/sCuGuZ8MaQ9C754zFkNt32J2PeEgWPKhru+lIZ7vnTyzg98WQ0bvlzMXZg/Gh758rFPCZd36nyFTqOv2BnnK3Xu85VhfXSm+Y45M301zhxfvTPPx+K4wHnAJ+F6cP85i3weZ4mvmcS2MP7OI75Wp9kXIqjyncJ9jvvOWe077azznXHSvrNOwXcec7fT5btIyiu+S86A74oz6LuGY0Bnl28izM3OHt+NsF9y9vlmnQO+m3g+4rzgu4PnFM5R333nmG/dOe576JxSEO5H54xiwPMR7Ludi0oCrsO5pCThcXYuK6nYrpyrSoZzTcl2bir7nVtKQaNeOdgYoxzC/h1fa4xXDmObI+Wg3Y2JiqkxRalsTFeO47Y3Zim1jbmKDY95Y77CNRYqTvxejcWK3Fiq+BvLlDbCCRrnYp5sPKZ0Y1/ZWKP0NtYr/Y2scg7zXaNHGW5sVi5j3cX9hY8bW5WrRJ9BFxpDyvXGU8ok7kekQ1RcMK4boT/9C8of0b+grKK1nX8HYMoQx0iMh2lmWpkQc4o5zZxhzjLnmYuQXmKuMGWaeAiuMROMVZMbzCxzk7nF3GFWqsaY+8w685BFrKFqmY1lE76ayCZVLbGpTL0qUALAZrDZDKtK1dRX49n9bEHVKHuQPcQeZk1sJXucrWVtLMc6WZn1s23MsbBAiU62m+1l+5kaVdhz7BA7DOUuk/bhFuGS+Bp+IjwBr/M/fwF0+8v/LuugR8E2ykFeJOugCWQd9CWyDvoyWQdNRDRi0SuIA0kmq6GvktXQ18hq6IfJamgaWQ19nayGvkFWQzPIauhHyGrom2Q1NIushn6UrIZmk9XQj5HV0BywuWmUi2ZAPklWQ/PIauinyGrop8lqaAH6Bfol+gz6PyCFZE30z8ia6GfJmujnyJpoMVkT/TxZE/0ClUqlohKyJvpFsiZaStZEv0TWRA+TNdEvkzXRI2RN9C2yJlpGtVDvIhN1gjqBLGRN1ErWRCvImuhXyGpoFVj6D9BXqR9SP0THyZro18ia6NtkTfQdfaf+m6iW/F95dfor+h+ierDrSWTTr+h/iWiw3w2Ex09G/h1dpfehPHofnUyn0Zl0DkgefYAuokvoI7SZrqKrifTQffQAPUhfABmhR+kxepyeomfoeXqRSB1N0wLtIvfn0ApJA3QQ0jqQLixYb3QfA735uKY3CeT5WGN0MEZvgvZgXdFD/+eB9mBdMRBdiQZN+SLoEF4z3wvacRx0COvHc0Q/Ysk6+fPwXg7QJKwN8aAL74E+YT1IAC04D/qENWAf+j7Iy0QDEokGvALjPwF6i9fDPwRj/s+gYXjUXyWjnkLWwF+Dkb+HUskYp1HxMMavk9FNJ+P6BhnRDOodqhZ9hIzomzCiEsqiPDCi2WSV+2NUF4xiDhnFj2v/jyRe0/4E9QPqCtqPKGOB8eDOeNir9C/aq3YL3UqH7NX2OnuXKvQpezV9Goud3i30Gbtgd6lCn7UrdoU+D2d2CX3RPmAPgARB1DovkbzH3hcW+gqUeULoa/ZBqOGCfUSTUVXoCZLegHTsSaFn7eP2qW0J2ibDsl1zcLeI1x2n7DP2+bCIk/ZFTZZ2izgNrVpWRZyzr9pX6Rg4s0vEBfG2fU28a98E2cIi3hNm7Vu0no4Ji/iAjt8t0Dsh+yBz0D5PJ6pim1NF3KBT6BTxHp2y086IFj+yddPpYbFv0llhgRrVunPpm7vkFn0HnpO/LSt0IRZb95NvTd+3J9PF24LLJdKlu2Qd8JAuI2KlrQxSzzMGJhbyY2rtWJgEJomueVKYVLqeyaBZoi8BJhu/MRZmP1PAHLQ9Yg4xhxnTTj0RNVba5iL0SaI9zHFV6GZVmFqs34yN6K7AcIwT6wIjY51h/Fg/mDb6JtNJ3raU6WZ6SYt6Se39tIf2YE2RdKQ/BiWjFId7VdqHe19Kxj3NnGOGmGHmMnOVuW6vZibhvmmoe45ZsLuY28xd5p49yDyA9g0wG8wjVsca2Th2H5vMprGZbI59wHadzWMPsEVsCXuENbNVbDW0WIBWjrF1xMqCLM0KrItV2BK7iw2wQagLWy15I1JygNgJvBHbZVfYHraPHbBXsYNQ9ySUqwNbGmUvwFE1O8KOQjrGjrNT7Aw7zy4SW1ZUYZfYZfy27Cq7xm6yWw49WCuWPkeMI96RSHQcnuRIsY860rE1OrIAuY58R6Gj2FHqKLOPO6z2KccxXAu2PEeNo17VVDrfwTokh8fRTFsdrXaXI+Q4RdfTKY7TjjPQy82Os47zjouOS6CvpTAChY4rjmuOCdA5q+MGyCxd5rhJNDCXzlXHipSrwRqDx8pxC3DHseK4T+c61uGKx/EQnLqBi+US6HwuiR3gUrkMLts+z+3nCvAd3EHuEHcYxER0vJDpJGcrueNcLW3lbBzHOUFkzg86jKWQa+M6uW5odb09wPVy/XQKdw7rKTfEDXOXuavcdW6Sm+bAarkFex93G/RRwu/G3eXucQ+YQ6ChHjqX22CuQ9+MMofA4halNOCuGmFWypRy7MtSHujzln1TOgBMES8VMXelErDledukdESYFWaxXdtLJDOdJVVJ1VIde4RJFWOhtwexVgKbYX7axI+FUlACfk1JAjAV5juiwWpJzDBkXErsq5LL1i0poOMBOJ8F5eaBr1IkfMeM1CX1QBv7pAFpULogjUijhAVXpTHMgNK4NAVPm5F6pHkii8BzepXr2FGJPA1rsNRnm5OWMZtJy1AzLrkqrUmb0pZ9XOpSmYtwV7ykA+mDPk3HLXGscI94/F+8Gfk4fh8w1BCfzCfbhkBXzvJpfCbmJHsdn8O6+Dy6kD/AFzla+RK6lD/Cm/kqvpo+xtfxNFwReJdjhVf4AB/EFst38T18nz3gOMMP8IP8BX6EH+X7+DF+nJ/iZ/h5fpFB/BJgmV/l1/hNfkvQszlCjBBvv8AvOlbsY0IilK62LzlC5ArZk2N34V05jkvMEN6ZYx/Y3ptTI9TblwSW7M7R9ubYt/DeHH6euavtzzllH3/qHp0V4T4/L6yDrW0ysXiXDhMrGkBPraCvJhj5EdojJgA3Ztkmd3buMOAtxAI6XkxyxGu7drTdOnS9WCnkajt1UslenZ2dOeEdOVc5J4mmPv6nGeYf0QyTRhLZ1ZAIKbLdRZQ9D+2zLYEs25bfrn672rYK0mfrI8drtrW3l95esm2CbNm28Dm7HiTGHoPPVfur/fZ4kER7Yk1+Tb49BSTdng7P0cWZ4srhGfFkRoPIjEZH5jJRJObVk7nMHjKLMZCYN5rMYoxkFrOXzFyeIzOXWBLzxpGY9wUS88aTOcuLZLbyEqLi6+MF8k5k36GtHlG2EOQwR7Gd0r94ZMvW+iwo67e1vqUHxLwP4lWUDat4K/EZkQJIfwqyVJRNQp77bCibgzxfQ6GGYhW2GjUvuwd4AMelgLInUfYIcusH46hRq+OYBlx//S6wT4G0C54/AM2A1qcgBDj1FJzehTPPBqsB8rOA8++DiyqssSreuvSMuAK49v6wJkA+8WywYN25oWFWw00V1iQ1t8D4WFPh+BbgzpOwYD1b+WBYMwDZcHxfwzrg4eMoQ0+BYRdi/wBAX5QlPQXwPmUZT2J3X5dlPxuOHoB8P6DgfQDXjhYBSrRyB58Rh56uO6QOXKcZ8sPPhqNVkJsIQiSvjEC4TJ2W0wABjo/vPCsSR13ace0H46gCCOyqw7YL3JM4GgR0wbETeKdezY/2Pb097wsZ4H8K2gCdT0H34zg6sMPdj/FtmC/DPDa4wy9HLzzOH9t6Ejmu4XEJ99FIRN+OPt6mbU6J1M2wDYdtC9el6by1cpde4/EcA4wDpgAzttZy3AbwL0cX1fP4nbCPOLpkI77EBhx7dBWwBtgEwPubsN8qU9/XBL7KhH0VjIsJ7jXBPSbMA5LG6dAPpiyVL025ar0m8Cc2uG4C/2ECTjFBXSZc1zGtf8P9CfdiP2nC3I/rLNzpZ1yXyaPWga+ZgMtNrWq7nhinXWO07U+0ccJ1Yd9oAt43wTiZTkfcb1XHDv82Qd+bgMdNYHemi1oZfQTin4LdfjnrKci17fjXCB+7jdII7PaxYX/5b/GTzbbHfWHItuMDI/yd6aaqlybgf9Md7Rh0znRf01nQNxNwuemh+rscaTlwdXmsarflCao94fcqB/4tB/4tz9DsImwHGi9iLi3P1niucsdGygtU/sL3b3PgbtvaZVfb/KLZVrnGxVj/yw+pbdy+v1a1t3K4vxw/B55dDvxXXqu2m/ASvEM51FfOafd9EP/s4vGnlgm3+Sl8vI3jEXi/Z30An+JxeAy7eTKSK9siODKSE/dr9/q1a9kqR1tr1TG22tT3tMLzrFDOKqvnMWdZQHescB+JX5rVslZ4Bok3IO6wYq67o/FZt6abWkxg7QUAJ2D/bz2n8dyQWq91WAW2UetlwFXAdZWHrcBp1mmNP4EvrXPavQu2nZhpNoJHh3fqILHUbWj3hNau3Ty8i4O3Y5gwDw9rddy1tZq7tHvC96+o3Ex+n1f7gLzbPe3c2QhcfAqeJRacsO3EdLO27bhuG7cisDuuC8do/5bYLMH2ePyVatuOux7zZde0e5N2+iRsW+WdWo7trte2E/NodlUOOlF+TgPoQzn0eTmMXzmMX/l1DaAD5dOP63v5nIYF1b7KYZzLYZzKof/LHzzd3jA3lm8AYG5j1gGMO/Zmjos43qchWQW2PXMaIFPLc3Zs0JwHAL4zF0XYH7yzuURtj/mIyllms+p7wsAxpRniOXO1+s5miNvMtMpdmD/MgupTwuXNEK+ZIQ4zQxxmDqr6aO4BQDxlhhjHPKjGBeYLWj3Qf2aIScyjKh/j8TdDDGEe1zCl9jnuOzO+bx4AsYR5SeVu87JWHmIIM8QQ5k01BjRv2ba52aLf8UsWiCcs8ep8xJKiziks4CMt4CMtEDdYCtV+tBSr8xHsuy1lah0WqzrOlmOqXVlgDmkBf2gB/2fBdYOvszSr/p1ca1VtDh/jdltgXC3g8yyn1bZbQP8sZ9Uxt+ByF9X3smAOA3uzXFM5YZtzgcMsN1RfaQE7s+A50y2V7yy4PfdV3cX9hY8t66o+Y12wQL9akdqPeDfG8+PP/92fdmP8Ma2V6bP1E/hfVHU30N8iFJ0GyATkAPIABwBFEXmJlh8BmAFVgGpAHYAGCAAXQAEEAEFAF6AH0AcYAAxquAAYAYwCxgDjgCnADGBee9YiYAmwHJGvRvxeA2wCthAy6gExEXk8IBGQopbHuTEdkAXIBeQDCiPyYkApoAxgBRzTytcA6gEsQAJ4AM2AVkAIcApwGnAGcBZwHnARcAlwBXANMAG4AZgF3FTfy3gLcEfLVyLycPn7ap+SfFG7j464vg54SP7EN9prAIC97k3YyXH/7E0CpEbkGYDsiHw/oGAnx23eexBwSLv/8B8GMmaROKICP/+x+pJ2wQSo1HLTk/XsPQ6oVft7rw3AReROgIz+1tJp6bb0Wvot5yxDGAbZMmy5bLlquW6ZtExb5iwLltsGznLXcs/ywLJheWTVWY0gcdZ91mRrmjXTmmPNsx6wFllLrEesZoIqazX5XWelrYLVRaBYA9agtcsybe0xcNY+64B1kOCCdcQ6ah2zjlunrDPWeesi3LdkXbauWtesm9atCn1FTEV8RWJFSkV6RZbVVZFbkV9RWFFcUVpRVmGtOFZRU1FfwVZIAA++p6K54v8zd95RVhZZu683nrbBo2AjQUSQpkdbYpNRESUIgoTutgUUBBoYohIUFBDQIasoBmAQhY8xoIMoiKgEs4CYoUVklCTwgSiMAyipT996fnXWvd8f99+71l0snnlm165du3bt2vXWew7HhwtmFcwteLpgUcHSgpcKVhSs5u87Be8VfMLfrQXf8HdHwY/83V9wuOBYfH/ByfSfs/+biZ8tNOk/sf1TPv90YUUr/9H9KaxSWMP+rVKYbf/k2j8NC5sVXldwsvAm/S3sWNjVnglV/6+/uGDSv7iQwS8uZPKLC+X5xYUkv7hwsa9fXKjILy5k8YsLl/KLC5X5rYWqyZrJRuayZONkO1MvWZwcYm5IjkiONu2T9yYfMJ2Tk5NTTI/ktOR0U5Ccl1xvbktuTL5npia3JI+ah/n1hZf+P/bM8yp6o/i+yjpzjTG1d6T/2p1ee3/67+H032P/g+uv3d21z6b5fv2H2x3PjtN/y6f/2p2ebXdQtt3d2VYpO9fpZjdM60vW7H/8/+vS/3tT+m/H/zNmdlf3/7MLzTU9YvunfI+KPar0qGH/ZPfI5U/DHs16XNfjph4de3TtUcif3j369RjcY0SPMT3ut9LJPaZZNsf2yE3vRrcftROX9Vhn1+oifmnD8BsbPr+xESTzknkmTLZPdjBRslPyVpPg9zbKJ+9KDrDrMDQ53FyeHJMca2omJyQfNFcmH07+zeQkNyQ3mKuS7yffN1cnf03+anL/H1v3UneE11rsHQ2zWA6eCW8CbwJvDG8UdhVGU+H3WsyLFsCvhQ+DXwPvTK+6FuunrRVgbbJa0b8zvEoY5etbT9EEy7PCbGF0n8XV6CxR31J46UbsPIx8uPMq7VtrLI+Fd0QOj/oL4wXIr0dSbO3sk4ele6OeeNuaGbm+16BzB942xWYxvCV8KJ63ZXZD6CveKChDUg++DwvlaO2IfCSW2yIfDb8IfgM69Rn9Tka5iFFugLeFO/1m6A+22BDeEJ4XtgKbYQEJ2Bh5c6LUPBrOKK3QEW8cLKTXJjTvxfIy+FL4V/BH4RvkQ6oN+q2RNwWnWWwANma9GoftwZb0Gsi4Q8F3jeePiOZabB3Nsjg9sqP74+CVwQDcGS2yOEOaXgVwEb3yQCMMpqC5LHrE4proWYu1JPEOiHvnaF2Mfh/0l8KbgFnYPIJO7fBzi9XDTy3mhyUaRdz7FtyMfHD4vcWu0vQywL708uEbhUE2msXIR0rfS2HhbfhGWotorYZ+e/oeAs+E91h5l0iap8O7LY+j7YqG5N6AaKvFg6HNHL+OdMy5aKOVJMGjaYnF4Ebs1AFz6DsCXAjWiv5Ca39FSeifg+8AD4ILwju1RonLQV8YnwdLkNQB+9ixJrsVRHN6XKp1hFd2SK/K9KpMr8rovEHrG0h2IpmB5L+UCV4FcYu+UBYsliCpAy8lH2x++gPRn0TfPCQGbqL9oCRXgcuQL2Mua+BrHMfDNXi4Bn/WxLZ6BF8zr1pkYC30m+LVAfCcw+hJZReti7G2GGuLsbYYa4sVJZuB1oeAcQM3Yha9spjdEawdYV5n7HFnMToAbgFfB8/TavdaUJV1PI3mLvAYeDraRm78oZyRxO6jLeDr4Hlwm1YZ/YPYPOgk6uVdiFcNxc056diM2gK+Dp4XhrYa+J7LPXEvibWj0cdCScy5RG/098kfPKmjGfnn8SEHSQ6SHDzMwcMc14r/OeExO9O7XCZHJ5XDjLKQvi3wfBhYKx6HzhbwdfA84zZVbks/iBwSz4PgAqwtIGJbtbNsRVpGVr9HrjokA+FrHGJ5MTwL/SzWPUsSuzojiTyo2dkYjmS+7FmhHf0A8ZdkBfnTEuxEDawavWzxSNzF4lzkJ4QeaHfHy6zyK9qtSHai2YddkAU2wU6eMJgLXxbNx3PbK2iK/cfp2wb9ffD64Lsun6mcb1NF97ALEpLHZ5Ub8XLFLbpcfcPhil68RzzuKh68Q+Z3IJ+/EyZCzTd+Otwrb8muacRtrPyx+7ErMW8AViXmDcCqRL4BWJX4NwCrsh8bgFVZiwag9E/h/zwsV2fuI6gta8AsV7via6hUTSzWkCfeOXHvQ1a2deJqVTD0A/hOes1wNQrPZ7B/81ydUWswhX09BZ1lYC3wBnb0AYeJt4T2rq4R1dqHzOlDZVgqiT2bZL8jrU1claDvkcTtZIjdBX4DsFX4A9VJOtcjqRPuYQ/+abEN++U/sT15/Y8ltzviTyq/3RFeMXyVKnx0iH1hpB8VUgeOI6lKzdnMXrsgYeuh9z77JWT1z2o1bUU6Tp4fZ6cfZ+ce1z5NI3sQXhKyN2XHHxn9bvEiobWwjV6u/qjCHGMuk+Vz0DV632I3V+s4H0cyrwEJ+wTlT3GzVs2xljtp7rJvK08dnYDM4sZ0PdyGP8KFDuOnwJNUj6U8LagWnaN1RxpVJQriv1FDmrJnhW0TV3JS76FG7SGS9qT2Pgl3M9bv1M8/FRla30LzMngulbNBNNPyX8JbLP47HM7aqYo2Zdym8AT4FPP9CvSjU3ZGGdEoznfZacJTSjaxasco28Ev0P8cC5+7ysno3cFTWgvvKipnH+r5p/AnweLIPmH6PbFfxKrVxM4BJFR+bxc4Ef0VmrV3NhzLHCdazA13qJ6g8yIzOio/veexsFRzj5oqSlGOMFignLR1yVoLjouH4+Hj5XnQg1WuSqX6M12plFeXyFpwhTy0p6FmXZF5/RT+aHmj8DPL30DSDE9+Bx/Eh13MqxW8kL7tw9UW24U6qZ8Wt+eOYvUjmjlBJct/w9o58FXkbbHQPJxh8Xewc2T3uB/i2+WM+Db6K8PNyjdsngVnID+FhVZY2wbvj3xTtBuflfnT9bRmn8rGW5yvSm7l7az92+PGVn90qD01TGifD9WrPfF5KfqMfTeRDBR+qqd3v3Z8O3gtmAtmgr3AeRbds24+mk3A/LiuKp64920ac8FMsBconcHoz8XaXCRdkfSLVGMz6Juh0S3mgplgL1D6zdHsi+ZGhzzLFWOnGM9HwkemeS6YCfYCi6gzfW2UbuDZO4XNFNbedjbDV5Xh2CnCThF2irBThJ0iolEka0F7aQbdwF54fgg7h+Cb4Zvxv3a8nWg4dDPdjldgVB6b2+l7LSj5xMje+PwkWMne6VUP21LlbJXwuyH/u9DbDB8atWN3C1cg2YFmJWZaPXzD4mRx3xcGHeHF4Ej1CioI7emjvhXptRH7vyIZpZ3oF0UtyGHF8AlFLG6jmcafCMPn1Cv8U0/I0VHxeBpPHc2J4QRi66Pfhr472b/NuPt0133WxqqYKBUTpWKiVMxKFRMl8U/xpz/6Abw2cR4ptNEje6NuylLd3O0sdBb8PfzASqqn89ZlZibZ6HIyl+zK1H2NNc1GXozNFPh2GnXSvZ0Yh750qmnVbD7UZXYOXT7URSeX1nlI5uHtfbbGTgvsfkx1DU4Io1rGK/1a7z1Kv44esvrP6oYebI362Xi2VIUPB4kHq8CnkC+PxlhcIk0PfXv6WwyvoG9nYTwczQ/1diLcrHcXwV4s3Kb3IeHFtL5JrxeFicuQX4qF8+AK9PtxM52sdQ/eUvUOdsNvBhsLw5q6z4ZXci7PQv99VvYHYfQCOo3Fw2rSDGZTVX6DD6P1alqrCON2WHA36BVgR8a6QTUwWKI3HkEHnbPBzzwVzOJe8Ime24NNuhHbZyer481VPL1lRHUSkul6QoiOYec9sAT8DvwBOwfAr8DxYRny/nqaFUYfwieD73Jf/oPb8Zt66gtv4NlvfZr7Qj25WSxBUodWe7LEzYn/SDTLgy3jByx+gIVHwd8cyoLFEiSysArNZ+l1XpLwPBKePKNnOB+f4Yn0E3AiuIsnzG95kvyE59gl3KBTeqq0uaQn5EOMWAi+pUobVcVmVfWNJsAnOC47FkuQWDvR33RTTvjMK4gutXgrdn7Bz87a7+FrWEimUXaS2EkSn9eYy2uKT9RSPHFf/HfwfuUGdh5wSFQvwP4KzT0YxzPe9w71/GZxC/g6eB4dW8fitqz1w2h2iOyNI1oQX2GtXa+bZrBW8rCyQ1mw+Dp4Huyq2dHKDTrYJEmwjL6HtSu9H3lOfhCcD37E8+RU7qQzuZM+xPPSXJ4NuKd7x/QE6C/FchX4N7o1B62jlPYO8sayE+6X/yHP3uEgh8gH4e0gvB2Et3PlVThWd+f4S3oZnhirM3fu3UEB+A7PCW8yo/ncoOfxJPYF9us5ZJR6jFKPUeqh/4WiGs7UWHGTaBK4hTcb6lXJIZJuROMPInY62sNeaEVWO1R+1tfd2eablcSjInIDPpQZPcCeegD976MjrIhDRbiG7tFhKEk0INyAh+JT4ZXwvxKSimTjQrBnlGWtHdBdOLoxnmsl2yWPFtPaXhish5+QTliBu/Mn6JRIP8pk71wB9uIu/Bq34H8Lo6p6TosmqFfcmlHaYPMzzsefsLwKaw+DSd24w7W0vshuygIvUesFvCnK6M3Nq0xVOipWfUt8SA3vIO7/i7t5c/bUefbLEreLkcRYOCebGb3D522vCpwCZ+ShjbxWp1T3aFuvqrIuDUDdr5/nfv1PcavZAKzKTm8AVmW9GoDq+2KsOrAXH3hTERbG1XXGUa82gw9QQ7J1Ew/36fYdrhbac1DZtTV+kTzXHv8Efp5ZLKHvXmrjW5LE21Qr4uHIPwQHUh/20vc28LdEI3CGTkBJooQyKnEZ+peCL2KTihos1107vFn3jrA/mMWJfHu0hOw6Cbf6cU/k/bl/refGV8xe+zmuytln5RE3WbsHdT/6lGeq49IMH6IOTNPTfmIR+/G01jHuwmo+I0ncNlJ8qutWazNcNY13ff4SYWKRzqBgm3ZfME63bIuaxVr4Wnb3LHHb16Fa69F6BTvL8QfkQ9hYo9iz1d7Iwuu4l33P+5wSod1Br3OSnuQM1Y1pvOYSfaUTNi6kuv7Ok8AybjFDuLWd0T095N1jsFQ3dH+mKnw8TD5Hx6gJ71Fd+xOB78T9A+BXtBbEF4GjNKKyyK7FAZ3ItE4Gj1Fn3qUXb0GDyrqz24q0Cs9XqcrFNufDC1mLeuAAVm1SqHr7KVjG3A+yOjXQ4XYfzANngz2QF3GDK9FMw05IasObhl9jX/c+4ub9i2iUJxqXcxOfplt8ODH81Xo4iF6d9XwVHSZbPgnvoBZpvuvpu56+ncmW6kT+KDgLf9axdpdxf3yMFX+XU2Y5a90ayeu6R4TcRsP30O+AtTeF0Xb4Gmp7DJ/MndpZaAU+rDt++BN7+RI9tYbd5WcURYtVMfBzEdmyjmfFKcEmKz+gSMbfKUvtSSScIQx/DrUuL1LnJ4pHRyKd9W9xWu1BZwiV8Cx1cgCtFYXB33VKRnPkYXwrEfgJb3fq1h+W060/GMsN+je86sqsr2Be7eVV9DkRuB35as0i+Ci0t4bwOX3iFi4OfsAHy+Pvsb8D/UGs8iC9B7B5rhG/RV4b/mxaRzYf1XuA2AjDpXobEOZLHo/Hh3noV9fbAP/f2O8L5iPfh4Xu4tFT8DpuFN7O1WNXcj7G/yJW60CehINXwUmg24+VeI7dSDyD8F+W5+pUCj4hegt4/1mRUbqAbYjYVipDKdXsNPGZDd5MjtXnrrQObJbm14K5YCbYi1Z794ke4xn+VzQfAd+Kllv7reD1wLlpzAUzQVm4Gc0a3DSnSBJOQXIpkmPccOdwx1wK9gK/4S6PP/7L3Pie5N3CSd3O7F6zvfyX0DzJuA/qiTdchs1l6htOhx9K47VgLpgJypPf9U7A3nz72kjWY45v6xPt4L+xmQv2Az/UzTe8Cmuz03gtmAtm0toLtBELv5bl+AN96mfxJWvhY3plp1FRWo3ljoqGjXM3IiZ8nLnX0PsEOwsriX7S2wY7iviP8GxGz5YkXIlv1wmDE6G9Xwejw/e1L6JHqWxqPU3rKXAYkgd1sw5WgsMlidqhfz+xvQI8KbSV4Q2dzvBl4CH1ikqF4Q5sFksezMRyTfBX6sPscI3F3rQ2JcJLwXnSychRBDKIQ/Q4980TnJ47xBP3cIaupPUxIjyF6F0PTifH5mMhRzYzVuuJKH6S2+j6cL1tvT+d2/YeHbyezs9i7lDKnJni1k4xK15MhMWb6u1EOJ5Rnpcd+9xYX5lA3lYDs/FnCWMNjCpYzBMGXYnnZNZ0Nzgc/SnoXwkfz+rfJkmcrQyJXkDeGKyCn7PF/d+w8Eh8J/gfrR06D2r143a0bkRyHTZXIOmB5+OJ+YeSxx/EF+LzhURD375oXGZPAROUfQZ/Td8fAPPKXoZfDc7StxHSra+AfJegbALcYRVwHnLXdyV8JdZWgD8h+Qm+Ex0r90eU6Z1na3A6OA6sDAbgTnCG0KsgNCkkeaARBlPgy8A1YC3HU3pffYC+55AsBvvQaym8CZiFzhF4bbA6mI/8W3AzksFgVyQZ+PMbEh/JRixnIykGRyJ3Po/En7fhRWA19Nujcwg8g7wL/DQ8htcFD6ZUD+swLjPykpJ4R7FzI/o5YB3kC9Fxnjj9HeACJCNSzZWrLv7ifmVwJ/hfLubwgS7mcAMuA9ektJe/djGXxHsaPEfrYuyvcfOCV4WvpjUAG7q5wD03FyxclJ6F5PvcvFJfWgt3YWEw8hZudujnpWpayYBUEbMowvMiPCzCE2EW8jPwWkI7bhGWixhL2JKxOhHPy7B/AqzGKC5PyJlgLng182pKr8fBNin7fOI5n+uD74IXgwlhooowfloYfgm21NzjfyDPEA/eSedwczJzkD6BdZmZ0udWp+DzUtmW/5FqxmoeYh0PEX/hRLfKpbu0y5hd69Ro7TL4OMdLt8LLETfhDFpnpArAckRS8u7I8+hl4CbNy2kPIlmWxtGgehUgKZDEO0D8z6VxNFiO1ekAivdRa7AUnSNplLUGRP4kM7re7Z2U3oC1Qf6fdLbYyPgfu6woPWf5eDJqlSTRWXTWSRJVYR91KuV7C0R4QepiPe2nWmiflupZnQz0nlNsvbVIJgutZd2eqABBN+yfJtoL0VxAZtbG5plSfSJQP6WzpguziIlG7DiRr8asLwQDsE6qE1iO/JTkAuJwVL0McQtuTGesYngXuBCdh8BiJOPT1hTby+Au8gvSKJ1PUvZM8ZPM9C3i43I+F/9/ISb/Tse2peXkuUW9RSeTvafAr0CfuX+kGFoPW4KSUA+DdtjZDn6BNeq/94N0zDEyuXaqtsXuyBci/1QScxj5RWB5VuGZ9N7XevXEZk1XIcFd4C+p88y0BajPazhBvA/BFchdVrg6mY/lo3jyPPKGyrGQ/AkPSD/KKbMxCVz9/Fb+BMcVw3A8fDwz7UGrq3V/ujqg+VqUt5egcwXyiuj8BG8EfyNdD623XjMkv4OuhjAvvxVYCHJ2+C621BPvR5BTyXsVeVuwOYg1v3PKPin51JPgcjRXgpyz/jawPzgL+RNoOh/WI5kHngc/S59NWp35zmfx8DX4JHqNBoe5042siMmxumBM3wPwHbQ2ha9K54A46LtTuCaSb5G0BvsxVgbyXeBG5JwO9uT9xvpPVfdStE5EXpTerUVYK8JCEXWjiFZJDsHdqV0JdM8bQ7H2OejOxDFwnhy8dUSsI5o/cUZUcCuu08GvAR+F5h5wL5V/CMgzTzgc5GyNiHzMk1Lg1nEks9hcNpjd3V7xcavm5Ol56UTIpzptBG9Ap3bpYc6RInA0VV28A9X+IPgtFaMr8q6pG8ByxKcc8Zc8lxqykShtTHOdBQ1oLU7jaLwtx26Sztvp2HYAJe8HVqPyd8Pa5jSqb1twBJ+MnOATkGd5W/tsQid+Q3jD+Kjt2wj+F56BX+a7Q134pLJVVKZ58T7noLj/A/x97uzu2x0pvoNRm89PN3Pr7MlnrD3j21QTkB8V9x0/EbVXTeOz16q6HZg8v5XlcyK9uWoSDtUdP/yHxa3i/jehvk+yWhj8J9R9sESa5pDQG0KvjsLoPWEYg/VDvRXsiLV87Czn3Uhr7JyXTlxI33w3rtDfBbYLq1k8HUwE7VN3MBg+DnlPYTAq2C25uNkm9OrSuksYZaEzDVwRPGbRx0K70GMukk8AsRbNdyOCu8Gp4OpAb1Nzhf7T8JpRb8sPiHsn9Y1i66G9EQTlJTFbAntzND8K/Q2Smy3SjzrQ91JnQXI/I1ivPRWsVbUPliFXr2NqjTLRWQ4eQ54jtHJZaCKMluLVabAVOFV2/J5pn62+FwrDncIgH1yBh4HvCfVWx/hw3/cl8d6jlXuWt59vTf+qHPbnqF75MzUvX58pPy/unfD1Pb0dvt4tP+pPtjjDt/XZqyB9bz64CAyEwRQsLPNnW1zjK8NrBfr2UZtgtqqoJN45dBYzYh96LYU3AbP8DKtzBJ3avrK9un+JVtbXp40dxb3N4Ar9Nxz9rn4meKkqADgGfAJMCoNsLBSL+yP9GtpTvs1V/x5xv6L/k/Y+8o1oFqFZjb7tPT2J+Vg75P1Tz05ejpXU8X6xvMSzu9uv4Ombh4G4V9dviId2LuZsmKUTU61eBM7xm0niv2Mtd6ZvHTAnzXdZTAjNKawtBBtiv473MzG08fHPeZO0LkgOYnkBOgmhOaZe5k954v9gDP/GoZEw7iPU9+et5A34Z/BT8KHwZ2xG/RC/YHESeJ0wKicM/htcgaQqWF7oXwm+hH4/dAYI4xQ67cGhtN4EfxD+EJpbwD+Qt0S+XphoAx8CXoXOdvjNYAskn8PnwR8HeyJZjD8Xg27cCH4erzoi2QzuolcpfDdYB8k94EQkzDdsSt858JDWL8ETSDrDe8ETjDVL6P0Jd9H7HgsPo3Mr8p3IG8E3wT8jDkQjeA3cCtan1w+JEfrcwa2LeFQOvNytDrwqWB5s61ZHPPzMrZF4MAAcDY7D2mS3UvSq5dYLPsatFJpbwD+QtxQm2mD5KuTb8a0x+swlfMxFBp3+8MDFRBJ/LP5Ux3PXehbsTZTeg49CpwJ4mF470HfrWAOsjLesdUSUIpcDzvOnQOfVv/Dc5fDvaI7Ft3XYHwy6fBtIBuJbPAxNxgq+Bj9C505wEJKj8KQwY7dsZpDJ8dX0HYk1dBLdkTfBk6vdfiF6R+n1KTpZyA/RtzYca8Gv8A7w6fBMuMuoSdhZwSqkmNdN4HpwCPgkmnfRay2cDInvZu5uPx5g3JnwVsh/Q5NoJB6A+/Qqgt/rcpvRX3FxBq+g7wtw1ssnevFz4BIkrlbMc/sFC41Y5U1gBXzugk4xyJ6KsuGsS9gNbI6F2+B9wVvQKQH30jocdPK/gNQQn70c/hPshP0PwZfBhehQD/2l9PqFHD6GhLXwmUu4CmTPhjeiuQb8DlyJtXrwU+gUgn2QUGNj9GNqUeIO9KmrYQxnlJi6Gp4E2SPBcTgzisYjoX6GaAZE2CcDg/1wdln0FjrLQVfTZiN3lfZdkHUMXFRngFTF6Gf4AvACvLoWTbIoYF8EeBhwOoT30ctlwh7kxCFBBYjykW9Azh4MrgfZ+/Hr+DwCJHNCZhGysiFR9d0s3PpyOsRU2tCtF31DKkPgxnoH3Aa6LHIVxlVCdx49gm+cKaE718iK4EJ4JZCdErvKfDPZ+zh5ezF5u4s9jp2QXRkR5+BLWqnw4TWgqwOsb0Q+B/Px537sPwGSCcEE0J3O++BnQCxnUF0z8Dl6k17suISraa8iZ3ViWsOP6UttDO6RV8aUtQKrgK/pxEnp071J4HXCqJww+G9wBZKqYHmhfyX4Evr90BkgjFPotAeH0noT/EH4Q2huAf9A3hL5emGiDXwIeBU62+E3gy2QfA6fB38c7IlkMf5cDLpxI/h5vOqIZDO4i16l8N1gHST3gBORMN+wKX3nwENavwRPIOkM7wVPMNYsofcn3EXveyw8jM6tyHcibwTfBP+MOBCN4DVwK1ifvk1ovRxsix30g9HgOCSTaa0FjqFXY+TYDx8D+4MB444Fq2PByc+Cven7HnwUOhXAw+AO9F08a4CVGZGYR3gbubXAh/Ap0HnyL1pdLv0Ox4dwHZYHg27dB5IJ+BYPQ5Oxgq/Bj9C5ExyE5Cg8KcxgNTPIqPhq+o7EGjqJ7kiQZ3yKJIu+h5DXhtM3+BXeAT4dngl36/gkeBeStXDWJb6bWbgMP4DNmfBWyH9Dk3klHoD79CqC34vmK/Ar0H8BTrR95h4/By5B4nYcuyDsAi8GycAoG070wm5gc3rdBu8L3oJOCbiX1uGgk/8FZMf5ZH74T7AT9j8EXwYXokP18JfS6xehdwwJMfTxOVwFkuHhjWiuAb8DV2KtHvwUOoVgHyRUpBj9mJ2buAN9qlAYwxklpgqFJ0EyOTgOZ0bReCRUmxDNgEj65EmwH85eiN5CZznoKsBs5K4uvQuS1YGL6gyQGhL9DF8AXoBX16JJhgRkb4CHAbU0vI9ebsX3ICcOCfZIlI98A3J2SnA9yA6NX8fnESAZEjKLkJUNiarvZuHWl1oaU5dCt170Ddm/gRvrHXAb6LLI1QFXbVz1fgTfqMChOwXIiuBCeCWQXRC7yuD0XSSpdeE1IPsxZO0icjWYz1j30/cJkFUOJoDunNoHPwNiM4PKloE/0Zv0YtckXFV5FTmRj2kNP6Yv1cl8HQRG78T03ZXsKJO3Mfr33R15IzQ40Kfey3iP1InW56PI6A1SlsWFvEnzJfGPIJ8reRhL0x5Ckd6cIL9TGG0ThvWRn8TCKFoPC+Mx8MFgR2wec5qMPkf/Fj4orzdm/vNIpqffd+nt3ynent3Cm7Sz7o0ZkhfUy/8GiY/+MXA5cywv9Kcy00LeiW3ibVUTeJPgbfWSjimT3Lsk/ZbMotnHO7E87OTTqx1vrlpJ4l0SLjZ6V7ZCu4bW58GewtSoMv3L3O5l+qbQhjK9meypNxj+N+JeXXhvWtvBN8J3ojlJ3EthIYfWj+m1A17RWUOyP7UMifo2BAcgT0nTO4vk7+hn0/dFWpvBc2mN4X+Fz0SzFaP/gOYvtN4vnsqXP2EXNwuj77ueFg8uYqwr4aMMb1aRhEi2or9LGIdGuYEnQS46VeA+uBvNDHh5eFehzSHx5Yy4Gv40fDmal4LLeDt0CD4YnXH07a0Rg7Vpn9U6gXG/wM+d8JPpEZWNDeF3oj8gtV5v3iQ321J6i9sRm/NpnUrfCxR/W/F4L4rkCVZkBPa7pF7GB+n3F/c3yfOgrrjN6eY6DenVXhLb9znb+lxqrY0VGeK9k9Lb0ZVqtbXrZearGeViYb/J5B3+Wmqg/p3mlW4UfQvCeivPX0VehchXYo7fyGZ0P/aTqWeszhp0nkgp8y/DZpLWj8BG8spb5KKn2XkzwDzp+zmpDxh3q1ZH3N8AzwEzwIZCO9YG+AeMtUR5yIjTTJb2jsb1N5iL9GaSiB1jxHzkB8BNrPJSeq3At71gG7KLXIoGIklJP9hdpk8Tqpf9avEENke4Udx6sb9Op3eZIjMHnhDqt79sdSWLwlngTcqBuJlao+/lQ9S97CxrsQpcwU5U38ucJ+I2MorVqbIjPB09zQ5lXGJVXWvnzcC3dkjGae38OcRtObxVqrXikxqMzmBapzGLabJfehzJYT53k4XyYDtJ/Kv1yU7YgggfQ7IpNUHZq7l4v7AWe9HPAOuk9CsEEZ8HLZZvQVbqH4w1ih1Ros8I8Nbg4eUpfSo0uEzfBMhgjm8w6wuUV94t5OpgRSB8w62XRvfecdklzZgcs7P7gJNdMcymzux3dUN70M5OMTyp1nilRvFKsNkFr3oSz4r0bcheqCi5vbXxiYMwypSHQTf2Zk+tlzmrCNiYrGAVbkVTM+qa+h7cx4i5ZLLsTEw9Tl/FfIxiYvE1+u6m72EyXHleTTHxqqT4HIfWO1Kn4PosJiTmH6GzEv0XHBKTRXx/aQGtz2ChJTOazVgt09/x+IAnK9lZ7b7vhP1ifM4g5rezIsuF3hPE5wuTb2NyMfWhIZKpQrNF0bARm0sde0Z7jZrTRnbsGp3Dt4jTR/gF+scUyWgpmMfaVaM69ZO+jbYyIWaUXcT8aepbqPy3NY1qxvr2pNrMkMTwXTLzI7iGWK1kV+aQh3PR3+B6McpA/PmF+bZOV+DriK1G2UjOPOFmgZ0Mye0JFfFNFe3iDho3flK/4GQzXP/O7lPTWndARjnA7h5FpmVjf4XGtRl+jvy8iKqVxVmTxanEyUL+J8mTkCrUF/0/qGZz8WSXyaPuPYrP4gvtiWTznGhUIVd92Q/uJP7vuOqUroodOIWbU8FacF7L/mI0TxKN4ViYlp6F5bGr50+4vZY+3fRvDKf6n8N1ImwhVs2YaUnqa6r0VnbfeuKgf9laKIz+zXfS1mLhaTJ8BJLWxHCWrNm9vIq4aa0Pg3PJq0nIL2bfTSUrJoibPznRvkIyCf2S9I5ewZnlan6eqgr5UF4xNz8yr75u9TmvX3Ct1NUd7I4qVNGp4AgkKc7HS3mKaMWZ8h4San70KhmSRyQn8Gn+OHK4OicCT2sJnmfsCc5zBWNVUayCknS2l1A91lIDDbNwlbyEOiDsi84HqUVGn9GPwivVmQIsdEVnOTk8BEkO+l+kcRTrMopsL2Gmo5jdWk7hZfhsJakzZfvJhHzme7fVfMWdmPQak34qc09uysNP6TvV1LD8A+a4Dv/3CFONZK3sD/0WlsUBVmc07/cO80aOt6AZfPZkMqVjcQCf1klisHBHpO+m9o5P6XfS4JnwRvBG8CbxLiRLkZTAZ+p7rfEKeAm8lNYLxRNN9QtpSJrY1ZOF79AJ+W2074XxafmQkJ2suL0wMV+/kKZ/zZdakliuX0gTL90onno4XqRfSEsc1yfLicrgaX4J7aDsO65ft7D8DHJ+/SzxCvwm+BD9Tlq0Wb+T5uYYH5B+RkXxRCaa5/G2MXb6o1ON1o7MqwV4hlnPpXUD/DTyHCRfgfq30nkZtbB5HaMP4zPxEriPzt+wvIoolTCiz+iz4W/Tt5W+jexQ/tsY7pU8IwlvhQUnz8OHfvCW8L9iYR/6F+EPiD95zp/4afz5SL9sxqybp2fdGMv90bkD/dnwFmCCXjfA+Q26xHA48010YxYapYnBE351rXEc0doTHjLKb8RkJpLGtNrVSTUAGycC8FF0DoLb0SxD3gif1+Eza8e3B4PSY/DmYJFGKd0kH0q/hu8RpgaAvZEclmbpGkU4Lb8PLAdWwk4l+ESwOb3W0etn+GbkxKd0CWO9i/xz8ZSPBVY87cN/0NlNr1ruU3ST6c3K+MUExQ+MGWGy/jpm0HAzeUT/e+82q3UCFeTfVNPYulhWZiqZ8iY21U1tU9HUN01tfNuYW8ztpo+10cNMNA+ZYjPU3GPuMzPT+heahLncZJtLTAPTzFq50XQ2PU1fO2q+mWQeNgPNMDPKjDOz+O/Xuj5Jk2ErTh1b0Rvac+1ac5PpYnqZu4xvCsyD5m9mkBluRpvxZra51ASdunfvaG7J73ZrTTOgML9zTbMQK5X5PeorbE3PsRYb2SeBtuZmc6vpbfqZwJ7whWaymWYGmxFmjLnfzKHPBaam+Yu1mWeuN+1MV3ONeQR5FXOxjUMtU81cZe02Ni3sU0F709F0M3eY/tbvuuY2M8VMN381I81Y84A9x50HFUw5c6W5zFxtLTQxN9iTupPpbu40A+xZUs8Umalmhhliq/C9ZoJ+J7s4b2xxUAT2BQeDd4PjwMnF/UfcG8wAnwAXgS+AK8F3ivuPHRR8BG4BvwJLwF3g3uLikaOCQ+BJYeiDF4M1wLpgq4Ejhv417AB2AfMH3n3P/2LvO6CsKLa1967qPnVOd589wzBDGILkHIY0kgRFREAERBREQYkCgiAMoF4QRZAghquASBZJAmJCUBQkByWpSA5KzjnHt3tPi8zIfXL13rf+9S9Xrfl2VXefPl1fVe39VXVPn45WY8Fmgq0E2wt2Fuwu2LNNl+YtrT6CgwWHCY4TnCo4U3Aen7i5tVxwteA6wc0dnu7W0fpZcK/gYcGTgucFr/poWx06texgO4KxglkEc/LOLnY+wSKCSYLJgpUFqwnW7OSfp65gQ8Emgk8IthHsINilU5dWT9vPCr4g2Lezv32Q4JuCwwRHCY4XnCI4oyu3kT1TcI7gQsHlgqsF13dt93Qbe6vgTsH9gkcFTwte7NqxZecQCDqC8YI5BQsJlu7aNalUqLJgdcE6gg0FHxNsxVg61EEwRbCnYF/BwYJDGMuERglOEJwuOFPwa8HFjGVDKwV/ENwouF1wt+DBrt1adA0dFzwreNlHowTDgtS1W+euJl4wUTCXYAHBYoKlU5hJU16wimB1wdqC9QUfFvRXbhT7nvh/w2oe59kg+5/Kobxk+39HG/x1rxD7xfB/rGRJKTWPcNvvMHqLqNnPufI+/7+SQ/beN8e4W0YlLaL4rH4Jgzjlo3PLmOGWMcfvMPaWMZdcqRaLN6Bfgxu30R+i5kiVCbL8m7nMklMcn/L8WzavvP751m1+KPBvWORI+sf4x5wgR/A/xphbwlKsNlI46g+BCTATFsM62A2n0cJ4zIdlsTo2xFaYgn1xCE7AmbgY1+FuPK0slVPVUc+rQWqEmqrmqG/VZnVQXdSOTtRFdEVdWzfR7fXzepAeoafyGPS/K5zaZ3XddOUW6cqD05Vfv6Fspdsf4mG+EQzeUHbKpi1749N+ns6mPX98k7TlBEh7/oT4dOUC6Y6vma78WLpyuvokbE5bzlQoXbl+uvKzaa8/+7i0+3N8nbacv1i6cokbyjz+8iel299Hyor9Q1xqDQvWT7WFUmtucZ/LxL6qQLB1bWA3B3Z3YI/f7OgiZQNbJbA1A9sw7VUUGZS2lkWT05ZLXE17fMnGacul0rVC6dLpymXTldemK/+Qrnw4Xflo2nKZuBt6GWeS49OVk9Men1w+XTn9/trpynXSleumbcUKtRmJmWmJQ6ENjhJv24IT8Egd4j+RYWeQWBEHIa8WLfVq0mKaTwt5SwiP4BE+7jgeB8STeBIUnsEzoOkuugssupvu5rjp9wel79F+eykVpxJ4C3+3Jv96dJQ/WYLLmXg20gVGwVL4GS5iPF9DmK8q3nsAlFfTa8BYy3uQ0a9dLPvkXDxbSOI5T2XaD1rF8jUdELuUeKalErh8SOxSWg+KSxsZl9JmxuVgSQ9NhDz0M1/rfN77i9iltJPtQi7vErv0hiN3B0fuCY7cGxy5Lzjy1+u9T663jlzv/XK9v+6pK3vqyZ76N+6hb+UKV8oVrpYr/HXPWtnzg+xZJ3sUGMWJh5mr/P8yiVWxzGoCs6q9Gt69zPp8mg8hvqaFzBTPsv2xqOV+If8V4s/34Vr14WIMxkBvTMQc8KL8VnJfbIKPQT/sgB1hgPw+8iB8BlPgVRyEg+ANHI7vwpt4Ak/AW3gWz8LbeAkvwRC/a8BQFVIhGKY85cE7KoPKAMNVJpUJ3lXZVDYYofKqvDBSFVaFYZRKUvVhtEpR3WCe6qF6wHz2/s/DAtVLvQALVV/VFxar/qo/LFFD1BBYqt5R78AyNUFtgOU6yr3msi6ry8JVXU1Xh2u6lq6FSo/Wo1FbKdZ7aNkt7ZZY2m5tt8Yy9pP2k1jWbme3w3J2V7srJtvd7G54u93D7oHl7R9DA7CC86DTHI85/V3Eq16sd496znvUG6M+iraKtlenor2jg9VFUhTWYcpNuXUM5aW8OpbyU36dgQpSQR1HhamwzkhFqaiOp+JUXCdQSSqpM1EpKqUzU1kqq7NQMiXrrFSeyutEqkgVdTaqTJV1dqpCVXQOupPu1DmpGlXTt1F1qq5zUU2qqXNTM2qm81AraqXzUhtqo/NRW2qr81NH6qgLUCfqpAvSM/SMLkTdqJsuTD2ohy5Cz9Fzuij1pt66GL1EL+ni1I/66RI0gAbokjSIBukkeo1e06XoDXpDl6a36C1dhobQEF2WhtEwXY6G03CdTCNohL6dRtEoXZ7G0BhdgcbROF2RxtN4XYkm0ARdmSbRJH0HTaEpugpNpam6Kk2n6fpOmkEz9F30CX2iq9Fn9Jm+mz6nz3V1mk2z9T30JX2pa9BX9JW+l+bRPF2TFtACXYsW0SJdm5bQEn0fLaNlug6toBX6fvqOvtN1aRWt0vVoDa3R9el7+l4/QD/Sj7oB/UQ/6QdpA23QDWkTbdIP0Rbaoh+mHbRDN6IjdEQ3puN0XD9CJ+mkbkKn6bR+lM7SOf0Yd97m4r9APBfiRbzIXuwaXmPvYSueB8g4s2WchWScGZWoEiGs8qg8EFGFVCFw/F4Irt3CbgGe3cpuBVG7jd0GyG5rt4UYu4vdBWLtFDsFMtjd7e4QR7koF2SkPJSHx3g+ygcJVIAKQCYqRIUgMxWhIpCFilExyEolqAQkUhIlyW+glIHsVI7KQQ66nW6HnFSBKsBtVIkqQS66g+6A3FSVqrK38v1vXvG/+eheuhfyU1NqCgWoJbWEgtSaWkMhepKehMLUgTpAEXqanoai1Jk6QzFKoRQoTt2pO5SgZ+lZKEkv0AuQRC/Si1CK+lJfKE39qT+UoYE0EMrSYBoM5eh1eh2S6Z/0T7id3qa3oTwNpaFQgd6hd6AivUvvQiUaSSPZX4+m0XAHjaWxUIXeo/egKr1P78OdNJEmwl00mSZDNfqAPoC7aRpNg+r0IX0I99DH9DHUoE/pU7iXZtJMqEmzaBbUoi/oC6hNc2gO3EdzaS7UEf93v/i/uuw7F0M99p1LoT4tZ+/5AH3L3rYBrWRv+yCtZm/bkNayl32IfmAv+zCtYy/biNZzzGhMGzlmPEKbOWY0oe20HR6V3x95jI7RMWhKJ+gENKNTdAoepzN0Rta9UudXCGXF1xbmvmVjU2zKm1tja0BrtjUbVOhK6ArocJVwFfbDf/e+v3vff7r3JUrvK+KrLWwX2vJ3H/u7j/2H+hja7VnPx2IeVVbXsBpDdqgI1aA2NIAmPF9oz/r9eVaWg+AtGAHjYSp8CnNgIXwLP8Bm2AkH4SQre8AQepFnQUe6RlIiz4ntFnlebPfIP8T2iPRim8K5F8SmRHqL7RZ5UWz3yEtie0ReZtuNj+srNiXST2y3yCtiu0f6i+0RGci2Ox83SGxK5FWx3SKDxXaPvCa2R+QNtj34uDfFpkT+KbZb5C2x3SNvi+0R6QmK9/Zh7BYZwNg98jpjj7/AyFCpedfIsICZdwJmhgfMvBswMyJgZmTAyKiAkdEBI2MDRsYFjLwXMDI+YOT9gJGJASOTAkYmB4xMCRj5IGBkWsDI9ICRDwNGZgSMfBQwMoTr3zUyRhiZIIxM/YuMfBIw8mnAyGcBIzMDRj4PGJkdMPJF0Fe+DJiZEzDzVcDM1wEzcwNm5gWMfBMwsiBgZGHAyKKAkcUBI0sCRpYFjCwPGFkRMPJtwMh3ASMfCyOzpKfMF0aW/kVGVgWMrA4YWRMwsjZg5PuAkR8DRtYFjPwUMLI+YGRDwMimgJHNASNbgr6yNWBmW8DM9oCZHQEzPwfM/BIwsitgZHfAyJ6Akb0BI/sCRlYKIz8IIxulp+z8i4wcCBg5GDByKGDkcMDIkYCRYwEjxwNGTgSMnAwYORUwciZg5GzAyLmAkfMBIxcCRi4FjFwOGLkSMHI16CvXUplxIJUZB1OZcVQqM44OmNkvjBwVRk4LIxf9nuL/BrB/3bKa1hgK4w9qrK6j6+k2+kndXj+lu+puuod+TvfSA/RAPUi/qgfr13gWvFPv0rv1Hr1X79P79QF9UB/Sh/URfVQf08f1CX1Sn9Kn9Zlosv8bfbgW1/IXjPH/N1/fp+8DpevquqB1K90aLN1Wt4OQ7qK7QFin6BSI6O66OyuBZ/Wz4Oqeuid4+gX9MkT1SD0SMuo5ehXER8tFy8kqQyI4Vk7rNiuXldvKY+W18ln5rQJWQb9mfEVnZHU9Va9kD9Ymivr7+DOpa9eoO1w/olBwRDF/bUp34D1gxVv+e3wLWYXAveFzqd8bbyVYmazMVhYrq5VoZbOy87G/fa+CfBBjxVkZLdsKWcYKWxHLsVzLs6IWWTFWrOWvd1lct958kf5nlHWHVQU86y7rLiDelwxZ9CQ9RU/XH+nFeoleqpfp5XqF/lZ/p1fqVTdj3F8t0xP1RD7jZO0/bzVNT2O+Z2j2o8zcIv6+nfrQ9bNP5KOm8d45+iv9tZ6r5+lv9Hy9QC/Ui27WxnL2SXoSn32K9t8WMl1P57N/pNk78xWu4rP79fDPXgLib3rWm9RDONsZcOZ/7hZ7l3zO7w38OftpNRNehr7QD16B/jAABvK4fhUGyy9XvwFvwj95lL8NQ2AoDIN3YDi8y2N+JIyC0TAGxsI4eI89wPswASbCJJgMU+AD9gfTYDp8CDPgI/gYPmHv8BnMhM9hFsyGL+BL9hVfwdcwF+bBNzAfFrDnWASLYQkshWWwHFawH/kOVsIqWA1rYC18z17lR1gHP8F62AAbYRP7mC2wFbbBdtgBP8Mv7HF2wW7YA3thH+yHA+x/DsFhOAJH4RgchxPsjU7BaTgDZ+EcnIcLcBEuwWW4AlfhGndjVA+oBupB1VA9pB5WjVRj9Yhqoh5Vj6mmqpl6XD2hmqsWqqVqpVqrNupJ1Va1U+3VU6qD6qieVp1UZ/WMGqc2qk1qs9qitqptarvaoX5Wv6idapfarfaovWqf2q8OqIPqkDqsHXVEHdWuOqaOqxPqpDqlTqsz6qw6p86rC+qiuqQuqyvqqrrGLsj/XwytLW3rkDY6rCP6Ad1AP6gb6sd0U/2Ebq476md0X91Pv6L767f1u3qU/lh/oj/TM/UX+ku9Wq/Ra/X3+gf9o16nf9Lr9Qa9UW/Sm/UWvVVv09v1Dv2z/sWqZFX2fxPcWmf9ZK23NlgbrU3WZmuLtdXaZm23dlg/W79YO61d1m5rj7XX2mfttw5YB61D1mHriHXUOmYdt05YJ61T1mnrjHXWOmedty5YF61L1mXrinXVumZH7Thzl6lm7jbVzT2mhrnX1DS1TG1zn6lj7jd1TT1T3zxgGpgHTUPzkHnYNDKNzSOmiXnUPGaammbmcfOEaW5amJacWnN6klM70948ZTqYjuZp08l0Ns+YLqarSTHdTHfTwzxrnjPPc+ppepkXTG/zonnJ9DEvm76mn3nF9DcDzEAzyLxqBpvXzOvmDfOm+ad5y7xthpihZph5xww375oRZqQZZUabMWasGWfeM+PN+2aCmWammw/NDPOR+dh8Yj41n5mZ5nMzy/9dcfOlmWO+Ml+buWae+cbMNwvMQrPILDZLzFKzzCw3K8y35juz0qwyq80as9Z8b34wP5p15iez3mwwG80ms9lsMVvNNrPd7DA/m1/MTrPL7DZ7zF6zz+w3B8xBc8gcNkfMUXPMHDcnzElz3lwwF80lc9lcMVfNtTCE0Uw0k8xkM8V8YKaaU+a0OWPOmnPOs85zzvPOP5yeTi/nBae386LzktPHednp6/RzXnH/4fZ0e7kvuL3dF92X3D7uy25f9xW3vzvAHegOcl91B7uvua+7b7hvuiPcke4od7Q7xh3rjnPfc8e777sT3InuJHeyO8X9wJ3qTnM/dGe4H7kfu5+4n7qfuTPdz91v3PnuAnehu8hd7C5xl7rfut+5q9zV7hp3rfu9+4P7o7vO/cld7250f3F3uXvcfe4B95B7zD3hnnJPu2fcs+4597x7wb3oXnIvu1fdax546ClPe5ZneyFvl7fb2+Pt9fZ5+70D3kHvkHfYO+Id9Y55x70T3knvlHfaO+Od9c55570L3kXvknfZu+Jd9a5FIYpRFdVRK2pHQ1ETDUcjUSfqRr1oNErRmGhsNEM0LpoxGh9NiGaKZo5miWaNJkazRbNHc0RzRm+L5ormjuaJ5o3mi+aPFoiOjI6Kjo6OiY6Njou+Fx0ffT86IToxOik6OTpF7j7L2r6ssfdWYxV7UFk5f0/X5vj+k76f4/sG3UQ/Cpt0M/04bJFouk131p1hO0e8l2CHfku/Bbv0cD0cdktk3yNxa6/ErX0St/ZL3DqgZ+nZcFAixGGrglURQVbgle3YDibZsXYslpI19tKhX0J7cb9JMmXxqKy3n3L6OyOVciY636jMzgrnvCotq+4tZL19Ekf7kxCBLJCHY35dVkAjOALMY+/MX+H2A0UrJDddcv49mljIBNndZVze4C5n3OSuYNzirrx+7AbOLYAw64kskJMVQJHUu0fuJn+7u4XxO3cb4yp3B+Ma94j/SUrwz0iZ/DNSZv+Mcq4rctZf79FEuLSEHMZl5KbZEyN7YmVPhjR7ssierLInUfYoiHCrJXHblVf+c+aVVCVQqoaqAVrVUrXAUvVUPbCdt523IeTMdmaDcY47x/l8yp6ivv8vxdi0Efb/7/j6fxNh/Rh6q3Hzvxkz40wr08a0Nf/gCORHzns4ZtaRaPYAR6bXJU425hjpR8fU2Nj6FqNizz+Ih7+Phu9yHPwtAt4YXf5fi4bXox3HxeEcv2+Minex+vC1R6ry8HVHfVYeFwLdcYlVxyOsOMaI5hjLiuMi99qHuac+7vfLX2On6pg2bnqxXgYvzsvoxXsJXiYvs5fFy+oletm87F4OL6d3m5fLy+3l8fJ6+bz8XgGvoFfIK+wVuWm07XfzeEsRcsi9pag7/fdxl2IoljL8Lvouc5e7KyQGr7xpFN7AcXiTu8Xd5u74NR5TJsosMfnIv4zKV34flykLZaXEPxWd08Rm78r/QXSuiwoTeCqbiIUgHutjQ8gr99wLYTNsDUXxSXwSymA7bAdl8SnsCOWwEz4P5bEnDoXqOAJHQzP8HNdAC9VFpUAv1V31ghdVb/USDFAvq/7wqhqoXoM31RvqLRgqd8/fVcMUe3uZ44/Rno6DsTpex8MknUkXgcm6mC4JX+tSujrMl4i/TiL+TzJ7W2+Nt9bAQTuDnQGz2Gfts5jVPm+fx0T7on0Rs4WYLsweGhh6DXOE3gi9jXlCQ0PDsWBoRGg0Fg2NDU3FkqHpoZlYKTQrtBSrh5aH1uJDofWh9dgstCm0BR8PbQvtwBasDa5g69A11gZ9TLKphF+YO0xVnBcuHC6CC8LFwiVxUbhUuBQuCyeHk3F5uEK4Aq7w75/ht+E7w3fid+Fq4Wq4MlwjXANXhWuFa+HqcJ1wHVwTbhhuiGvDjcKN8Ptwk3AT/CH8eLgl/hhuF26HGyM87cdNTgunJW52WjttcavT3knBn53uTnc8xHF2JB7mOPsNnuE4ex6vusp9VBm3qfu8au6N9Xaq3tHXoiPUotTnW3g2OkPuuDTFNsGWWTdsQagIoUB7FGBNU5b3T+Tk4wxWBRPF+qW5QWkul7Zx8p+yKYpFudeUQP9XEMtjeT7nvXgvB5f78D6wcDgOl6dslkNzO9HOZme3c9g57dvsXHZuO4+d185n57cL2AXtQnZhu4hd1C5mF7dL2CXtJLuUXdougz/iOvwJ1+MG3IibcDNuwa24DbfjDvwZf8GduAt34x7ci/twPx7Ag3gID1vasvRZfU6f1xf0RX1JX9ZX9FV97a9ss7gqlpKVBkv+WyGDrP1k4aQhOyeLmSvINS0G/nNpJTmFmdWKrBMrc3KgCicXqsM94MF9nAgacYqBR6AJ68NmnOKgFaeM0JZTPHSFFEiA5+B5yAy9OWXl0akgEWMwFrLxGE2EHJgTc0JOeTrmNh6v9SEXj9cmkFvu6uaRkZoXO2AHyCfPy+THbtgdCmAv7MVjeiAOhML4Kg6GIvgmvgnFeASPgOI8gj+HEjgfF0BJXIrLoBSuxJVQRtabysrISxZNXVtWnZrJqtMT19fCFgdrYcWZqRyqlCrFijHZfz+kqq6qs2KsrWqzYmygGrBibKQagc26pzWEWPE8xYpxgDMIws5g501wnUnOZIh1PnCmQ5yz3tkAmZxNzlbI4uxwdrGW7um+ALk5evSFfH5kgMIcGd6Dor4fh5Lsx9dDKfbe26Ace/AdkMw+fBfczn58D5TnudU+qMC+/ABUZH9+CCqxTz/i/7coX18l9dj1unwb1KUE1yVnmrpUUBX4WL9GWtXnuYwlNbKlRiHWd03ASL3CrN6egYjUy5F6RaVecVKveGeG8zHX6FNnFmSTOuaSOuZx9jkHoIBzyDnG9fJrWkJqWkpqmiw1Lc/xbyLPDybzLKOq1PoeqfW9HJfOwn0cla7wzMSvUS3VPrj7WofHZyupUUm/jthAxj1c3wKylqmwLd55fZvChliMS/HXj+MRcBMuKqvKzIXPiCVtbAsvIeHFCC9h4SXCurcpOMKOK63uCUdR5xHnESCemb8AMTz7eovbfogzErLzHGwW5HO+cL6BZJ6JHYMqzgnnPLRmDdEfOrJaeBOeZ3UwHfpw7P8chnKs3wSjpe2/kLb/kiP4LzBHesBX0gO+lh4wV3rAPOkB30gPmM+R/Rgs4Oh+AhZyhL8Cizieh2A1a5wssJ51TW7YzlqmCOxlVeLCUVYXGeAEx/hEngGwJ+QZ0jMA/gwSqvmrDPCA/9wWPOj+w7sHVvNncuC78pSj/q1FQP4rkmd7fq+rf0OLJP3WItDQ/0/kYJuCO+Xuefz14xRoZ5Qzgb95vrOce9sF1++/vFXm2anXk1uuJCn4dsXfkvhnPCt/MkH8EIgfQvFDWvyQJX7IFj8UEj9kxA+FxQ9FxA854odc8UOe+CESPxQjfihW/FCc+KGM4ofixQ8liB/KLH7If2PGQq6Bp2rqOczEH92HUehgHF9lHiyCpbEiVsPa2ICvrgW2x87YnbVLHxyAr+MQ/tZxOAmn46f4Bc7DxfgtrmVutjIP+/EonsaL7PxDylNxKovKqfKpIsxuMhbh2hdiLoqLbcLRz7dNsYLYZlhR7ONYSewTWFlsc7xDbAusIrYlVhXbikeeb1vjXWLbYHWx7bCG2A4cUX3bCeuJHWFn9q01y84idrad1bd0Kez61s4Y9nwbmhCOip0bJrHzwjFir4RjxV4NZxB7LRznW1YvGcVWjUH5nvZYmD1BDMd5xaVijE042vvagf0B15L7INexFOMTWJqxOZZhbIGsI7hu5RhbYTJja7ydsQ1W85/9wLsZn8J7GDuwXlBcq5qMnbEW4zNYm7EL1mEcgfczjsK6jCPteFBc3wTG2ba/8nEpzA3DNeVezfW0GOeGWW9wHUP+00xhw3g1HGa8Fo6A4rqx+glXhcI8qh7jeNuB42xP8P//fgiMggkwHWbC1xzHVsI62Moz/8M8toP7edyTsnBfz8d9KQmTsTL3pppYlz1kE653G67FVGZrBDM0TWxTnC62GX4o9nGcIfYJ/EhsC/xYbEv8RGxz/FRsK/xMbGucKbZNOIdvuY45fcu1vE3s3HAusfPCucVeCecRezWcV+y1cD7fco3zi62KY6T9xkrLjZOWe09abry03PvSZhOkzSZKK06SlpssLTdFWu4Dvz3C8cJ4gjCeSRjPLIxnEcazCuOJwng2YTy7MI5gxYA81a3FV4CMdIzx/0XDf493XXmmvhCU5lgcrERhJulrmaWPZPG/2z8LZr2ea+v3JN/3sj8ZJn1F0L9DhrHsoQAT0P8Vet8TKfEvfkzLAgPxIWyEj2BjfBjbOo05+jRJXRdW3dQLaoAaqkfoD/SndJmu0FW6xv51tDPGGeuMc95zxjvvOxPY1y5wFjqLnMXOEmeps8xZTudIkSaLbAqRobBzwbnoXHIuO1ecq841l92e+0/3Lfdtd4g71B3mvuMOd991Z7mz3S/cL9057lfu1+5cd5672d3qbnd/dne6u9297n73oHvYPeoed096xgt7Ec/xXM/zoh55MV5Rr5hX3CvhlfSSvFJeaa+MV9Yr5yV7t3vlvQpeRa+SV9m7w6viVfXu9O7yqnl3e9W9e8ijKBHFUUaKp/N0gS5SNspO/j3IAjLrA5np2awc7uOY1l514KidwjM6T/XiGV1Unn4mmb/FyKwsVtZeM+hP9CcQF/oo9DFkDM0OzYaE0LnQOdZtPFeBzP5chfXNdmcPFPZnLKxmBnDsrshz9s/hbp5tb4I6POPeAvdL7K4rsbuexO76ErsfkNjdQGL3gxK7G0rsfkhi98MSuxtJ7G7sXuWo/YgXy5G6hUTqXhKpX6QEjtQvcz3nQJNbadE/14L/lXb6tYUcYROEzYjwGCc8ZhMe80nNi0vNk6XmD0jNG4pGaZQ687MdOyqjsDb467rVIOeN/T99L/7X/TG17/AZMkhPAekpWlo4JO1J0p4x0p6x0p4ZpD3jpD0zSnvGS3smSHtmkvbMLO2ZRdozq7RnIrdbZsgWXL1r0w1XT6w3gxHrj3nppyD9FKWfKumnOvisZ8fc8NksrEque4FfR7p4DhkF0pNt6clGenI4dRaLJ/AsXgrUQAaVSWVTeVVhXctuabe2n7Tb2V3tbnYPyk15KT8VpMJUlIpTSSpFZSmZylNFqkxV6E6qRtWpJjWjVtSG2lJH6kTPUDfqQc9Rb3qJ+tEAGkSv0Rv0Fg2hYTScRtAoGkPjaDxNoEk0habSdJpBn9Bn9DnNpi/pK5pHC2gRLaFltIK+o1W0hr6nH+kn2kCbaAvtoCN0nE7SaTr79zOXfz9z+R965lJBLGv+NnZGusQxv+otPVPOIxHbh7be8ARw2H9WJniq5n99Rub6czR8DnWHanZ9zp665T72QL/OeRWe9n8tQpVT5fmIu3lbPfWAelg9oh5TrdhXdWav18u/p3Wz5N/HujHxWdKm8r9P/l2vG5N/j+ym6e50qYZ/By1Nqvf75N9NuzFxXf5F4niQJnGd06ZHbpY4fqRJzFLa1EzSb+VW6dKTnNr/i9T5Zsm9mjZx1EqbsqZLedKmoH6p1ytn+Htt4l+sTSBs5/hZmWN9TVbZDeU9KL++/cR/E8ogeBOG8exnPEyBGTz/mQPzYSnPgH6Ajcxfktzr/Xex/J/Cen8Gb7r+kbo64rEZ5s974C5/LsCxLpPMHvx7HIiFeR6tONr77ycchu9wfjj677ccwzMvhZ/jMc4fxxM8XznJ3gQ5Wp7l/Dm8IDHzEucv41XOX1P+7w8pZfnvS1Qhzhv5BR9X8fxbRVWM/Cckz7FVnPLfDpegMnE+s/LfOZaosnE+u8rN+TyKZ24qnyrI+UKqMOeLyK8FFVVFOV9MFeN8cVWc8yWU/66wkWok50epUZwfrUZzfoy+V97lWwu0rm1n9N+YanN97UT/97PsGva9oO2adnPOt7Dbcb69/0v0HKt7cP5Zuy/n+9n9OP+KPd9/97W9gPMLw+yZw4pnkSpcIPIUYKRDhJVepGP0A8Do1CjPeqPTogs4vzC6hPNLWaki5WSdoVlNXpMZHnvlGBVTIPV/nKVlFLQI/jP3Nw2CokFQNAje8B+kKBoERYOgaBAUDYKiQVA0CIoGQdEgKBoERYOgaBAUDZJ6hUqUCIoSQVEiKEoERYmgKBEUJYKiRFCUCIoSQVEiKEoERYmgKBEUJYKiRFCUCIoSQVEiKEoERYmgKBEUJYKiRFCUCIoSQVEiKEoERYmgKBEUJYKiRFCUCIoSQVEiKEoERYmgKBEUJYKiRFCUCIoSQVEiKEoERYmgKBEUJYKiRFCUCIoSQVEiKEoERYmgKBEUJYKiRFCUCIoSQVEiKEoERYmgKBEUJYKiRFCUCIoSQVEiKEoERYmgKBEUJYKiRFCUCIoSQVEiKEoERYmgKJFf3w9y/W0hicvYxstWSPwmqU/iV6FIkVdqvnIuikaN65M4nTdNUYil3KRIyC5KWiXakNQ85BQNoYV9bldojXsw6YGkYjdsyT4+54vZ5XZOZagHLaArdGIn2hpS+M+/vVMlKfcNJ7Pie3WfXnHaoz1arZ158dH3y81bO3ynNXVcn4Q+SX2sRUl99LRxWqFSGcvwJZbZU/CV96l2kRflgsskRa9fLdp8XT3kMvVDViijeujBUhmTMviFcEanUfOubds9/WRKp6dLxSaRv9FkNA1at+rY6elWpXImZfe3OBkT7m/Xskunrp3apOS6u1OXzp26NP+f6s4zrqls68MphCo1AkrvTUJOEkroTbqEOtQg0nsxhiZFiICoFEUQBMEAgqAgVQVBvRZUiqCIlSZNEKQIKk3kHrAxXufO3A/zzu/9lKy99tnnZK3/erL2zoeQfcArhAHBdT8cue2H39onwANlRXYJCBYy19UGBLiZMTgAh1XCAgAei3MATXlA8bsJxNX+LU/GDDCt+5mQNKZm5pYYSUD8iykQqOsT7O1BEtpppSekZ0VQ0VfA4lE4JSUlFF5bSREjDoh++UR8v/xEVh6kUB83D4ACFdkcYSgCAqeAlALHGWEUKBTS2t+6nVXwpA3F+bkOtps+4HLev25NReEv2OEq/OLM65OEGZ0qs1DHHO7dlqvZ1e1GtlsdaD5s/ZCpffV0PHtEeZGwSADu1cV+cS29dAKzG/2Oo0p9ZnS+vTKdbA5ptk556svcbrC7wRqNIlOO1QvYqyN7myLWFtve2GqSI1/PRUfZ2qHLu1hKXyS90BJUEdEeYpCAUdtHxTuSvQ4O6C8mmN5+6Slwb1+Mal0od0kxlUr+rXR0zzZtV/w9D/0LNFyeNhNLJW06nU7W7ui4xU48hJXNb/CgXIqG4VsjG+O3OT7v21jZVujkjV39oSmB94TiW4mP3E4JpDq9ZS3mMjzv1y+MhsHBOiqiQBnAiCAAfjCk/CxgO74VYserMdX8jvbEdYy6Yl05kxN2Nm5DQ/yiNNsArtitovKLLyz1gxmntFZCV2p3VN1WqGUFrNcnCNKYAiaAEdWAqpeo600mB6ug0W4kf7mAb3mScwsKQAf7+ayPooNJQe4hbuR96O9pXM/iRhJBVcqBUwA7WnqwMBEIOiiUZhdgDBh+swFYotrXG4SFhf3qBh6k/7IyGUCuP684zRaA8duScPqfChK+rhLY2nAyfGImBt/QEHVG1fLg2WVRfDe83tf+0sSroCT4+yAL30yVkIRxvl66ZkIeb2mHmMFWMTOFsOrTTZKRaU5mn2iPZmUtSecuaPFbxqWGGsJj5nK5r1x84Shy3E0V66ywcve4WvsMy6lYDdrjeOT+Lbuu43puTFVo343iFYtC9jJ+MjkihOBnOHxcmY4gTOj3jwpuvPBOKHUxO3xP79GMTo/rJ4+xUk/HTxEvRWlTXVDXdL08eGQo3eeO2C9gh4vGmlNqRBrTpZ5XJVuleRsYFDyHVr1z4bzDXYAaVvE3C6pUn+6XrtrZdjvd6yqkgzWVfeYRjIIxysjOszAMr+B/qnUZxNhbEGPdmzBWxV7JePSh6pm+DQxX/YyxiL8FFqKA8Jei59nsd/cQsvLxCgRX3QQyDFYei8XhcMpfQCb/3QTiDv5fgOzrdPgfTP9TMI1XEguFmBelopoQkQcqpidDy6WsNFV6tKJrU3GvbTWLLTjlrYs7646WaZYqDaLMpxS4CDOm+3uQoUlVsrP2xLLJwWfSISO8CZK584uofG3FHUxaK9dVrzYQQ05wWZq04pqVquYnY0o/aHMS6T34hZVmZa+KMLFVs+WFiSTER5k18B6r+lD0+ej7LTkE6ocWRuGh88NQRYNVNMU3Dv6hTKE3wzZvxaSbhdKDT+P4PPx0PznJfdD1jriczMW8bYIsApdvVYrVsZg39fOdIBqVRFy63NOxFBwpBY2vl5HuvFGGQAy+Yt1rulpBFD0oPXmv2fj+uGT845i7ukyZEES1mcfe5m9g2gNGhPirQoVvopX93hIHnOnLbLrYtXiB64eWSFjtOcBi3c1OA/LirD6w8+f8gApZNxFIGRxGQVlhh7yniyfgqoRBubjjlFDyLi44lIsiaCopuroBClicvLyL++8A2MY+3tpVx2UHbVGSw3FxNezKYRQEbL4A0AwAEUgFEZio9z8BENQyqGRQxM4A+F2HQWEBDLCBQIdNCCQAIAQ3IVDjryHwD9Ym/4p3mGeBMhy2uLgneXcnl1S6d5rS50/vHvB1vBLRCTvdFOqdf6zgNNPtA4XJ70yvZiqvML8azH3vJMbKm5LEqRLVU9FR2+J/VVlWL1qM3VoCYGZeM5iA042OeDrJRubxl7Et81WR58x8/PLLxOJfTp2kDuw7O+PLU27imv8u6l9bDxg+MK3ZuTSrdiJA5/l41Gtuaq63N4PUEixrhh1+1cuy4uab2n0lXW4PjIc0RuYJq2sFrxphSFUnof7fNIsuHtPC4EOkdtOU6Qe8/rA/Quua4INxvScXh5w0PoTce+3ptqf9SU78oRQxYGFG/qEbf7WOlzGLyQ0VlpnLmSrn8CPi6fQlSZ5g24ZoAnl39gvvGF1wEjwb3RrmZ8w5b9CDkSFd4vCJOVl36HYuOBh4zHaA+3eDDN/zgkEBO75wQewHFyyDgkA4gIny8fRxcyF7CGmHkL2DSD7kiA2YgQ0YDoPFYpRxWBBm2K8mdt38Jzn7ZwSrIdkTtwPuN/hz9ggJ6ZwKtfLX4H0a1N72bsLvcxYX26sBFfJBnitoKvbtWv8tHYLoExKkR8GW8XDrRSGj97Pe5aYmKcXXIkz25hrQvVwVH8gLSeo8v2/ngWdxPfPX5hTPthD1eisr1F9JeWfxnCsm7bN5x50xsqqQQaI+DXUWCNM7mIDnerjPEQFKJqW4xgf9cjvT53Sy9FAo2rpvK2C/2JXiutrW4qyPMW+QRI5oAZ0kaTYpkXtKBHUqVv3YgwI8bQKRYEORkkFgr5g8M3Mb60K5vtNTHyunh3zUL8h/5JgsYTW+/7zxnH6nkho+vy6MWMydn9LGnmajdrOcwRn++BvBdoMRcQBY18mABLe9NAgADr5sotcvSbIOK35WGhpQgYkABy3D160JJ5QGsbEw2P5+H4Otr7L6CEN4LHEkczB7j2opJqhErek5Ctj+fdJWGM0WAUaIFSQE3M7oQrR/xzKWcsoeLRvJrFFx5CeZQUarTPuRs4D5F5YZAQaAHlWXqp2o+ddZ9t1NAqW9jqANillvopghAEJ5E8Xw/0sjt14wul9W/U9+waAQe2WNAxL6lZNBWtXYS76TLOjAUqOFSeeQqV2qqGe6FUyf296gMEWi7VHm2bHCTuXq6F1XC0ttTg8HN9bXLUZcMiItaExoH2gd3MLt01Z8Wgi1zGR+x+YBati4qyl4rJS5EF5s86r+iIntXKbO6XfzM9PDiYLyavU2ObNWogkyZyl8J4Yy6PjnhgiLyQWt48ji44T7vF1ppEyZvQG5PIt8s1ZPvdpF1oj8DwqTr0nWRLjZ7Cy0eLD0psjOpi8XprcT7fz+5cVuCjbw09lM5Mikz1hZoez1+zvYWDxST/V8KFzmkGDwwGe82y9o3Pho0Gb8YfjJbcQWBS7nvhP8Rqmo6xXyO/mm2Th5IE59Co7CHdn3GKYTWJLNAliQBPUoacPTpEfz/q033wYX2abbRmekUHkN4Q4LnUVejORixSkUmvv+a5ISx/ugajUvypJlTQqOy0OA5UgfW7/7+6AO/e7H3G8i7tDUPV6RHRA8kl/OuIKU1KoYWRosO6DfSLfHwGOPFqFK5y1hqjY04jmjPEMAXyxGcIjFum+0YGXUgK3CPXvNnEsu6gZCeP9Qprakz+0TaZktKc9zhS8yE0/PFl5M9D64xRfVGOoH4T9ZMccV+ZHroFhDUqdvqQEGndM7vFf9GSTG1eBRR1JL/bZlFlLKzSL1SpiW75pP7skhtlK2OiVz+qe31QEKLR3I75lv/Obylt/gN98/wW9ACZAHQGIr4ID1ZhSL2TDBrTZo/nPb/T+j95kC/+qBHsN0mSg/ue2D14aGm09ZiJpXdPRtI4ixTj8692hXBRkQYp+ke2KdyWmUwauTfjGbCEi8hPiNR157e5iOdYGFJnv2cLtgG07sUN7cey8+2U+RY0n8E2OEooKbolatKct6nQwPd1c+rNKhKVwq8T/h9UyqV9+qKvHhqJS+nGR5otlvlltG4LIrvseOAYGH5u2BvOWYp1m148JZMYtdyHn6K1YBlnV6x84YQowNPNklpT1Ls0Ye08YZFy7Fn2M32MpAORM/9Vv4Z2gOvzl9AoQN0J+60i+q33gHZX2mUiBcGxPWnjugevBEgQvsEj9z9aeF3Bpoh4iJ9doS4vYtIaZv9L4ARuTcf6P3LzfCv6M322Z6r/+1PRCX/QW+cceAuJRf47fA7azL3y5PCltEBVeBMbW4Ytc+u/d0SDmP/zfU/0tbdzDWbFlHbhPhOxX73tRVhPV0RFiYQqvlyHsdA7YgL3Rcj0yrl+vmKEwOcK23hbURhJDmp/r2aw3ZNlba5fAN8kMTyxvD544+fKsKnR66nsaIuJ9iODRrxdlndiF9ZCzF90nszdcZc7ToBPib4zJiIsErHz+NhJ+SY16gGwpu2kbIS/VjJGXWFyif9kI1W7BMuBI1ubKPCmkO0fFgl9oxxqEY9R0kpvsTweprCYzIgVuMLqmzz+q5JwlHDzQr7NhddGOyKZpJJ7LbiiQ8DbQ2hnsQHaHcjFtZul5uzf6g1uBpV4tCjy0lJLZb2IznBWf4lyvv6v4YceP8tv2u0jOFudLytGE8ri3qAgGClFmme7KNnbq1o0tvoy8Nny0lK9QTmveKckiEMqlZJu910Nfd2lRbW2Xqdf+MzlpshHBsPifgOa7DsZvnfr6I8EPdNzveNL43bJftfo6N3SUhYyjm7DBhM1PSfyqvVSXoWpwkmZZ9OlT4Ri7lpqT15Wpf9cMFoS51gQXIkhvnDWY5glaPYP1rPg9Y3E8WbfG8lsd/iMMdpo6qtE+rHxEevVTV6lYXbo3o1pYzL8+oKg6/UEs9GcLzIv0QMkQEjS2lD6Q6JovfoM7Etwo/nRQwa8mZNnq1APUIOswUfd/n/uvAiXNZHRjpNZZmR+JzU96C58vofE2537j8WpBFqxgKDVjCNOdgUCgAlts/1y//+tjkxyEyNe7Oerv2Vb8McMyWzSfU4AP8sJgwLMBmL+d6M/jtQhoMCKVzkfF18t1mnQ/5LnRxZhVmx0rnJwLumy7ZgrEBrKkysVIQU4gPxA1CggRtHHJ7QsgQIYg1JAISDFpe4LgL+M4bElEgESv2h8VKjggO8iK5BHtHCP30pUJDgUJ6o4Q1eufJzMcOBcRkhaMl9tPTZasq+eI5P8Q91kZYdqkhoHD5cK4kznlVq/HH2WJuktGayHDysrnWvpGi6aFYRdNUNujTxs81J5b756nNoVOk/YJyCeedF/jHZ3vwZTqjtl25d8ipHM7o64yeTNRS3yY/7PDtAWl04IR88Ue7C+RM9yrsUVoDNWOXhJsLRez1bgGPJ9vLVuk4EOItxa3JHR79cfaurf3qyjHU/sg1vbFoeW1hLFe9gIzEkvoZPMzgY3SVdeyHAita/VHqZHGO44OFccsLnWnKNUbAzQHceFZgssTysiE969rT14aYqWU7kV3BtCYVqJorSXLLRqrqBRSYFECBif3IES2GAuMEh9g3VJn6j3UBv/5FYpMmnYBtmyXJ9OOXFSh48+8eBIb1yykbRgmjpIDH4R3+Q5Eet4IsJuVbFhzL/Gp53Ai+fEr+UT/xel0rDkPJZx367TGP1ee5xQOpI1daDObvaqhBtEiqp17jP/rZcwhcK+/NEtsZPWXTkWb4akvHWsn2w0fGBm0u5Dnf3r006q4rmBz9IrxemdeYzTYmDJl7q6HOqUpMqhzhuTBE6yRSbgLcOlzrrgoj7auCaEqVou7d8kYrPnjStyq3tcEyXYtuLq9HDy0LydLWHIvXSsrSJ95ZtW7KGTrILMOs/SjsauH5B9CpRiMbQ48Xgp/jPg/2vSBWRwgcqTRMv1f1Ck2M5NOqWWtQOmXq1ED4GEJMy9Rt6DsZceAQXufN60fpY3AfC3F6TnHHl9f0X6q7WJ46P7nHaYKE7S1xjvjUE3PgySLk34XDukoNCmVuZHN0cmVhbQ0KZW5kb2JqDQoxMjk1IDAgb2JqDQpbIDI3OCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCA1NTYgNTU2IDU1NiA1NTYgNTU2IDU1NiA1NTYgNTU2IDU1NiA1NTYgMCAwIDAgMCAwIDAgMCA3MjIgMCA3MjIgNzIyIDAgMCAwIDAgMjc4IDAgMCA2MTEgODMzIDcyMiA3NzggMCAwIDAgMCA2MTEgMCA2NjcgMCAwIDY2NyAwIDAgMCAwIDAgMCAwIDU1NiAwIDAgMCA1NTYgMCA2MTEgNjExIDI3OCAwIDAgMjc4IDg4OSA2MTEgNjExIDYxMSAwIDAgNTU2IDMzMyA2MTEgNTU2IDAgMCA1NTYgNTAwXSANCmVuZG9iag0KMTI5NiAwIG9iag0KWyAyNzggMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMzMzIDAgMCA1NTYgNTU2IDU1NiA1NTYgNTU2IDU1NiA1NTYgNTU2IDU1NiAwIDI3OCAwIDAgMCAwIDAgMCA2NjcgNjY3IDcyMiA3MjIgNjY3IDAgMCAwIDI3OCAwIDAgMCA4MzMgNzIyIDc3OCA2NjcgMCA3MjIgNjY3IDYxMSAwIDAgOTQ0IDAgMCAwIDAgMCAwIDAgMCAwIDU1NiA1NTYgNTAwIDU1NiA1NTYgMjc4IDU1NiA1NTYgMjIyIDIyMiA1MDAgMjIyIDgzMyA1NTYgNTU2IDU1NiAwIDMzMyA1MDAgMjc4IDU1NiA1MDAgNzIyIDAgNTAwIDUwMF0gDQplbmRvYmoNCjEyOTcgMCBvYmoNClsgMjUyXSANCmVuZG9iag0KMTI5OCAwIG9iag0KPDwvRmlsdGVyL0ZsYXRlRGVjb2RlL0xlbmd0aCA3NzI1Mi9MZW5ndGgxIDE2OTEwOD4+DQpzdHJlYW0NCnic7H0JfJTV+e453+xbMgnZB5gvDglLIAHCEhZhIAv7GgYTQMgkmSQj2ZxMCCBoBEQaUHEXtYq7FpfJ4BJ33K11r63WFVtrbStWW3eF3Od875wQqPrz3n/v9e//zvl45nnOe97znuU75+TQjoFxxlgqPvRscUn5nFkZM949wpQNPYxlvVk6s2TZlycWnsLY7o8Z4x+VzpxffPv62dczdu7NjCmzZ5WUlv3lsU85U9qfZkz30azFi8qDtVO2MHbBQcavtM8q983U6YZ/xZT8Dxkre31RecHYr97smYtYr6HVqpomf6tze3YWY0PRnhKpWRdWI1c8/jJjJ13EmGFgXWt90+efL7AzNqKBMUtWvb+tlQ1kHrR/Geo76xs31BmPXOBgbFWEMWNaQ8Bf+3HHzqcQfxXKJzTA4LjN+DryiMeGNDSF12f26F5CW0WM5XSuDYSa+fv69xk7MwPlgxtbavwDX3PvYKwa4xm8uMm/vjV77JDdqI/+MbXZ3xTIuvXU0+GP+o5prS1t4V4X247+rBflraFA69o7lCOMFW5Dc04m5tZw37t7o9unrEmc+hnLNDOR7v/7pmcFvxC2vPHN14d3Wj403Y2shSmMEuoZ2RHGH7fu/ebrr/daPtQi9Uu6PcKSOJQtYgbNoDAnK2ABxpJ2o13NRZ/Hd6PUbNhjKETIwcS6F9l2hZmZkmhQFEWvU/QHmdLrZbf2UruMLShXVeaFCFEfTFcpuSrjV2tB7zEkiJEiegKLp37J+Cq79afuQzzF0/+0pB/Hqn7qPsTTfz0pz7A9P3Uf4ime4ime4ime/l8l5Qpu/T+qZ2CX/qf78nNJuvFs50/dh3iKp3iKp3iKp3iKp3iKp3iKp3iKp3iKp3iKp3iKp3iKp58o6WIYGPt2WCtyUMoqpmfLkHfi0WklDnYCy2cLWC0L9fbGLNn9LLz3M4Qa0fsFu5tnxaLZ+zU0V3cpM/IPtcwnx38XDXkl9s01hf1w4v3iffeQKn7EuL8/lfzvOGOk31+267/Uj597+r+wfryzatesPnnVyhWVFb5l5UuXLF60cMH8eXPnzJ5VVlpSPHOGd/q0E6dOmTypaOKE8QX5o0YOy80Z4jnBnZGS5Ex02KwWs8lo0OsUzkaWesqq1EhuVUSf65k9e5TIe/ww+PsZqiIqTGXH+kTUKs1NPdbTC8+64zy95Ont8+ROdSqbOmqkWupRI8+VeNQevmJJBfQ5JZ5KNXJI0ws0rc/VMg5ksrNRQy3NaChRI7xKLY2UrWvoKq0qQbxum7XYUxywjhrJuq02SBtUZJintZsPm8Y1oQwrndytMLNDNBvR5ZT6ayOLl1SUlriysys1GyvWYkWMxRGTFksNij6znWr3yANdu3qcrLoqz17rqfWvqojo/KjUpSvt6jo7kpQXGe4piQzf+F4GhhyIjPSUlEbyPAg2b2lfAzxiyHF61K7PGDrvOfThsRZ/zGLMcX7GhBRD7JsmlEvN0Df0EOPLzhZ92dnjZdXIRDqXVFBeZdWuKPMW5FVGlCpRckCWpPpESacs6ate5ckWr6q0KvZnXUNGpLNaHTUSs6/9ycEflKsRXW5VdU2DYH+gy1NSQvO2rCLiLYHw+mNjLe0eXQB/fxUGERTTsKQiUuBpjaR4ZpIDDKp4B8HyCq1KrFokpTjCqmpitSIFpSWiX2ppV1UJdVDE8iypuJcV9h7sHqe69heycaxS9COSVoyXklvaVVFbF3FXuWqxPuvUCld2xFuJ6av0VAQqxVvyOCPDD6K5bK1FrRbGdpy3dBYjN+WY1QrFpasUbwsGtQwfnplTUeDE69Ky4o3OnKpWcBeTbmgl5iHUMXGQ0eUUzxZFOlG1eLYruzKb0g90yRXrkyEnYu4XywlDX5+one/tGnmLDg1XSwMl/Tp4TFBDrIOxaN/dT0XMRaxh1DCL1zlbFulysHNhUxBGM4m3mKFG2GK1whPwVHqwhryLK8TYxFxr73deuWfekhUV2tuOrZJlx+SovIhyEZaNYplRirEGy/Jc8rVq+Vlavi87+7jiObJY7TJ75pV3ieCeWECmYgdh0MbcOf6dRcnjsDXLcLp5yvwe1amWdfl7ejuru7q93q7W0qqGySKGZ05tl6e8YqpL6+vSis2ujaKpZDaPz1s2c9RInD0zuz18x5JuL99RvqLiXidj6o5lFVGFK8VVMyu7h6Cs4l6VMa9mVYRVGEVGFRkRaSkyZs3fda+XsU6tVK8ZtHxND2eazSxtnNX0KGRzSpsCm55sXs0mEl5SRgOmGMdtqVorXs+myoauqkqxuVgaXiX+8Aj3TGMRxTOtmytGe8TqCcyM2DwzhX26sE8nu1HYTVgYPI1jcsSZ1FXlwTmFBVXBXJyWok6EVHt6e5dVZD/nOlSZjaW2ClhREbHk4ew35MyF3yyBKphnRTpr/KIfzFch6ppy5tRUYtnKgHCZE7EggiUWAR5lWh2xHFGpBu8GL1Cr34lMpLMyUpknGq0IVmrL2Rlhsz2T8doppiFXNFRQ2ZXsGavtTWwFa87ZgizoGyuvIIsLWTRWSZNksqPnNR4U1VSpmG09qynHUqez1OoiSwBHoj43oMHqihUyMSxdjs1hjVjyERB/hLbliy1pyDFVVlLntdzZMQe07YzY0KPcflMZq4DZQdEc0Rf8ORtdFa6PiDBLethSz3qcLKLTWiQTiiOOnDl+HP5U3waLp0hWNoszwhaL8ThZTWLkdsy7LmdZT+9Nng3Z/dKokR7xw0EsTOa6FwubVXYdb4iszBs10ny81aGZu7rMju+uQPNldvSxMKql+KnBWNSiU3uUbXdaMvhciK1SbJHiTCk6pThDitOl2CzFJilOk2KjFBukWC9FhxTrpGiXIixFmxSnStEqRYsUzVI0SdEoxVopTpEiKEWDFPVS1EkRkKJWihopqqXwS1ElxRopVktxshSrpFgpxQopKqWokOIkKZZL4ZNimRTlUiyVYokUi6VYJMVCKRZIMV+KeVLMlWKOFLOlmCVFmRSlUpRIUSzFTClmSOGVYroU06Q4UYqpUkyRYrIUk6QokmKiFBOkGC/FOCkKpRgrxRgpRktRIEW+FKOkGClFnhQjpBguxTAphkqRK0WOFEOk8EhxghTZUqhSuKUYLMUgKQZK4ZIiS4pMKTKkSJciTYpUKVKkGCBFshRJUjilSJQiQQqHFHYpbFJYpbBIYZbCJIVRCoMUeil0UihScClYTPBeKY5IcViKb6X4RoqvpfhKii+l+EKKz6X4TIpPpfiXFP+U4hMpPpbiH1J8JMUhKT6U4u9S/E2Kv0rxgRR/keJ9Kf4sxXtS/EmKP0rxrhQHpXhHireleEuKN6V4Q4rXpfiDFK9J8aoUv5fid1K8IsVvpXhZipekeFGKF6R4XornpHhWit9I8YwUv5biaSmekuJJKZ6Q4nEpHpPiUSkekeKAFA9L8ZAUD0rxgBT3S3GfFPdK0SPFPVLcLcVdUtwpxX4polJ0SxGR4g4pbpfiNilulWKfFL+S4hYpbpbiJilulOIGKa6X4joprpXiGin2SnG1FFdJ8UsprpTiCikul2KPFJdJcakUl0hxsRQXSXGhFBdIcb4Uu6U4T4pzpThHil1S7JSiS4pfSLFDirOl2C7FWVLIaw+X1x4urz1cXnu4vPZwee3h8trD5bWHy2sPl9ceLq89XF57uLz2cHnt4fLaw+W1h8trD5fXHh6SQt5/uLz/cHn/4fL+w+X9h8v7D5f3Hy7vP1zef7i8/3B5/+Hy/sPl/YfL+w+X9x8u7z9c3n+4vP9wef/h8v7D5f2Hy/sPl/cfLu8/XN5/uLz/cHn/4fL+w+X9h8v7D5f3Hy7vP1xee7i89nB57eHytsPlbYfL2w6Xtx0ubztc3na4vO1wedvh8rbDi/cLgVtzdPA0N+7M0cGpoC2UOzM6eDKok3JnEJ0eHWwHbabcJqLTiDYSbYgOmgFaHx1UDOogWkfUTmVhyrURhch4anTQTFArUQtRM7k0ETUSrY0OLAWdQhQkaiCqJ6qLDiwBBShXS1RDVE3kJ6oiWkO0muqdTLlVRCuJVhBVElUQnUS0nMhHtIyonGgp0RKixUSLiBYSLSCaTzSPaG7UNQc0h2h21DUXNIuoLOqaByqNuuaDSoiKiWZS2Qyq5yWaTvWmEZ1INJU8pxBNpuqTiIqIJhJNIBpPwcYRFVKUsURjiEZTsAKifKo3imgkUR7RCKLhRMOIhlLoXKIcijmEyEN0AoXOJlKpnptoMNEgooFELqKsaNZCUCZRRjRrESidKI2MqUQpZBxAlEyURGVOokQyJhA5iOxUZiOyElmozExkIjJGMxeDDNHMJSA9kY6MCuU4EdOI9xId0Vz4Ycp9S/QN0ddU9hXlviT6guhzos+iGctAn0YzykH/otw/iT4h+pjK/kG5j4gOEX1IZX8n+hsZ/0r0AdFfiN4nlz9T7j3K/YlyfyR6l+gglb1D9DYZ3yJ6k+gNotfJ5Q+Ue43o1Wj6SaDfR9OXg35H9AoZf0v0MtFLRC+SywtEz5PxOaJniX5D9Ay5/JroaTI+RfQk0RNEjxM9Rp6PUu4RogNED1PZQ0QPkvEBovuJ7iO6l6iHPO+h3N1EdxHdSbQ/mjYdFI2mrQR1E0WI7iC6neg2oluJ9hH9KpqG85rfQlFuJrqJym4kuoHoeqLriK4luoZoL9HVFOwqivJLoiup7Aqiy4n2EF1GFS6l3CVEFxNdRGUXUpQLiM6nst1E5xGdS3QO0S7y3Em5LqJfEO0gOptoezTVDzormloN2ka0NZpaB9pCdGY01QfqjKbiMOZnRFMngE4n2kzVN1G904g2RlNrQRuo+nqiDqJ1RO1EYaI2Ch2i6qcStUZTa0AtFKyZPJuIGonWEp1CFKR6DUT11LM6qh4gqiXPGqJqIj9RFdEaotU06JOpZ6uIVtKgV1DoSmqogugk6u5yashHUZYRlRMtJVoSTfGCFkdTRAuLoilieS+MpmwFLYimjALNJ5d5RHOjKbgX8DmUm000i4xl0ZTTQaXRlLNBJdGUM0DF0ZRO0MxochloBpGXaDrRtGgyfr7zEyk3NZpUCZpCNDmaJJbGJKKiaNIs0MRoUgVoQjRpBWg8lY0jKowmjQSNJc8x0SQxsNHRJLE3C4jyqfooamEkUR4FG0E0nIINIxpKlEuUE00SszSEyEMxT6CY2RRMpShuosFUbxDRQCIXURZRZtR5Migj6lwNSo8614DSiFKJUogGECVThSSq4CRjIlECkYPITp428rSS0UJkJjIRGcnTQJ56MuqIFCJOxLy9idVugSOJNe7DibXub6G/Ab4GvoLtS9i+AD4HPgM+hf1fwD9R9gnyHwP/AD4CDsH+IfB3lP0N+b8CHwB/Ad5PqHf/OaHB/R7wJ+CPwLuwHQS/A7wNvIX8m+A3gNeBPwCvOda6X3WMcf8e/DtHo/sVR677t8DL0C858twvAi8Az6P8OdiedTS5fwP9DPSvoZ92nOJ+yhF0P+locD/hqHc/jrqPId6jwCOAt/cAPh8GHgIetJ/qfsAect9vb3PfZw+77wV6gHtgvxu4C2V3omw/bFGgG4gAd9g2uG+3bXTfZtvkvtW22b3Pdrr7V8AtwM3ATcCNwA22Ue7rwdcB16LONeC9trXuq6Gvgv4lcCX0FYh1OWLtQazLYLsUuAS4GLgIuBC4APXOR7zd1oXu86yL3Oda693nWG9w77Le5D5Ll+Pepityb+VF7i2+Tt+Z+zp9Z/g2+07ft9ln28xtm12b520+bfO+zW9s9iYbrZt8G32n7dvo2+Dr8K3f1+G7T9nO6pSzvFN96/a1+/TtKe3hdt2n7XxfOy9p56PbucLane1qu84e9oV8bftCPhZaHOoMRUL6KZHQwZDCQtza03tgf8g1uAzs3RRyOMtO9bX4Wve1+JrrmnynoIPBonpfw756X11RrS+wr9ZXU1Tt8xdV+dYUnexbve9k36qiFb6V+1b4KosqfCfBf3nRMp9v3zJfedES39J9S3yLihb6FsK+oGieb/6+eb65RbN9c/bN9s0qKvOVYvBsoHOgOlDnFB1YOBA9YS4+c7TL6zro+tilZ66I64BLl5yY5c5Shidm8uJFmbwl84zM8zJ1iRkvZCjejOEjyxLTX0h/J/0f6foB3vTh+WUszZmmpulSxdjSFiwr03h6CfGY8dpYF6R5cssSU3liqjtVKXWncpZ0MOnjJF3qw84XnEpiIk9M7E1UvIlwT0xwJyjiozdB500YM7Es0eF2KOKj16FL8zpgERGH2hcvK0u0uW2Kb7ptkU3x2qYXl3lto0aXMR1XOWfcCdKZRS94qrsM+3p/Gjdw/DzvXlaelzevx8yWzouYF6+M8B2RnHLx6V2yImLcEWG+FSsrujk/t7KbK8XLIini/7HV8medcw6bOWheZFB5RWTvoMp5kU4IrxC9EGxQdxqbWZm3uq29LS8vvBofq9vCedof5Hi7yOUJo/jTFkZePO1anuX9YCI30Jo2pLA0hn+41n/3xH/qDvz8UzcTXzKY0atsY7XKVmALcCbQCZwBnA5sBjYBpwEbgQ3AeqADWAe0A2GgDTgVaAVagGagCWgE1gKnAEGgAagH6oAAUAvUANWAH6gC1gCrgZOBVcBKYAVQCVQAJwHLAR+wDCgHlgJLgMXAImAhsACYD8wD5gJzgNnALKAMKAVKgGJgJjAD8ALTgWnAicBUYAowGZgEFAETgQnAeGAcUAiMBcYAo4ECIB8YBYwE8oARwHBgGDAUyAVygCGABzgByAZUwA0MBgYBAwEXkAVkAhlAOpAGpAIpwAAgGUgCnEAikAA4ADtgA6yABTADJsAIGAD9jF586gAF4ABjtRw2fgQ4DHwLfAN8DXwFfAl8AXwOfAZ8CvwL+CfwCfAx8A/gI+AQ8CHwd+BvwF+BD4C/AO8DfwbeA/4E/BF4FzgIvAO8DbwFvAm8AbwO/AF4DXgV+D3wO+AV4LfAy8BLwIvAC8DzwHPAs8BvgGeAXwNPA08BTwJPAI8DjwGPAo8AB4CHgYeAB4EHgPuB+4B7gR7gHuBu4C7gTmA/EAW6gQhwB3A7cBtwK7AP+BVwC3AzcBNwI3ADcD1wHXAtcA2wF7gauAr4JXAlcAVwObAHuAy4FLgEuBi4CLgQuAA4H9gNnAecC5wD7AJ2Al3AL4AdwNnAduAsVjujk2P/c+x/jv3Psf859j/H/ufY/xz7n2P/c+x/jv3Psf859j/H/ufY/xz7n2P/c+x/HgJwBnCcARxnAMcZwHEGcJwBHGcAxxnAcQZwnAEcZwDHGcBxBnCcARxnAMcZwHEGcJwBHGcAxxnAcQZwnAEcZwDHGcBxBnCcARxnAMcZwHEGcJwBHGcAxxnAsf859j/H/ufY+xx7n2Pvc+x9jr3Psfc59j7H3ufY+xx7/6c+h3/mqfKn7sDPPGWsWc2Y6SrGjlx4zHeyF7NTWBvrxLOdncMuZA+zN1g12wq1h+1lN7JbWIQ9wn7NXv1PfhH8yAZDE7Pr7mFGNoCx3q97Dx25EegxJPSzXIjcAL161NLr7P3oONtHRy7sdR7pMSYzq1bXobwM67/44d6v8fMV+d4JIq+cDZ2o1fjEdNWRO47cdNwcLGEr2Eq2ip3Mqpgf469lDSyImVnLGlkTa9ZyzSirx2cdcmvghbNE00e9WlgrEGJh1s7W4WmFbovlRNmpWr6ddeBZzzawjew0toltjn12aJZNKNmo5dcDp7Mz8GbOZFs0JZksW9k2dhbe2tlsB/vFD+Z+0ae62E62C+/5XHbe9+pzjsntxnM+uwDr4SJ2MbuEXYZ1cQW78jjrpZr9cnYVuxprRpRdDMvVmhKlD7An2V3sdnYHu1ubyxrMGs2InJc6bQ5bMQebMMKt/XpM89fRN1unY+xibF2xka6HfUu/Guti8yg8t8KTotB7EFE2HzcTuzEG0kdHRLmLtfEftfaflR+yyvm4st/MXKHlhDre+n36EvZL7MBr8ClmVahroUldren+9qv6fPdq+evY9ewGvIubNCWZLDdC38Ruxt7+FdvHbsVzVPdXxLez27Q3F2HdLMr2szvxJu9m97Aezf5DZd9l3x+zR/ss97L72P1YIQ+xAzhpHsUjLQ/C9nDM+rhmo/yj7DHkhRflnmRP4YR6hv2GPcteYE8g97z2+TRyL7KX2W/Zq9wB9RL7Kz4PsxcN77EENkP8Em3M85VsNR4DTqU23cs4RXTMxCaxBWwhW/kAc+DHfRqbzO+6K7WkxDzK9BB+lCtMxWXAzDgv9ibqFcc9WVnTPfeMN56jS5rTw0fdOd10Dq650w+/ffj5gsNvH0qeVHCIF7z17tvvOj95PmlSQeG7r7w7ZjRPyk7SkJKgmEwpRs8J+cr4obkTCgvHTlPGj8v1nJCgaLZxEyZO0xWOHazoUqRlmiLyXPfytyt0iw4bldM905cXGgZnJaY4jAZlYEbyqKk5zvKVOVPzB5l0JqPOYDYNmzjzhHmNpSe8bkoalJo2KNlsTh6UljooyXT4DUPC1/80JHxTrG/85iKdccqq6UN0l1nNit5o7BmckTliSvac5YkDnHrbAGdSmtmUnGQfVrLq8PbUgSLGwNRUinV4AePs1t6vjXmYwansVq+zalrrNMUxenR6QYE1PyMjq6f3g/1OvgD88f7EGDs0/ny/XeMP9tsEK0newUPG2O3WDLhbnYniA45WK7ysGXCx3oe/g7DeA95MZNiQCUtsGemOgowx+Ub3sCVuX7LP4GPTkZLTJyUVTucFr+S9q/0IHJtU6OxTSZNOLCgsTCocM/rkHDmxSR6eoBNqKPck9RnHiXcyWEnnhRwvQshUY545xZ2Znj3ArBwp1NlSB6WkDk6xKUdmcXOKmpmhDjCNdDWoo4dkWHiHgW+3ZblzM5sSXQPsWWa7yWAw2c36+m8uMllNOr3JasTE7+mz3zhiiD1rmOvbk3Q3Dh6RabMMGJSKBVfVe0h3JX5m5mJl7vS6p0/hNtckMSuTxKxMcjrFB2ZqkpifSffjb1CMFfQeFBNcEJv4gtjEa2yP2W2CFavXOiC7zDZpqEufMEL8T9AZc8f1cP3+hAWG+ZjJQ9MPYSoxkTR5r8TmcFL/qRtvNB5dm2npSbE1mqrL1VZyaspgRSzsiborTUkDU8TimbVnZc2uk4aNrT5/zaKtXlOKOyNTTbbcWLy5ZHrFxMzUcctnZJ/oLRuaiZnR6zEzHQuWL9jaXR2+f9us0mLFZnKICXOYDpeWnzS1epO3ZEvgxOQRxWPEfw24Bz/9b9I9wwpZzZ2t43luYmyNJcaGDP74zkQnn58YW4SJPfxLbzLzDsB68ibhQ4WRZVl7eI7Xkjc3NzFVnZMqpiJ50qTp2MyPY/zaLIg54LE5EOM09Vs2sRlI1XavUblJMVrM5vRBQ1IzR4+f7DEn00IxJg9MTxvkNOXMmDxpkCN7yCC7Xsd11WmDkywWizklf/7EwxGzzazX40O3zWyz6HQWm3nrhJKhiTqz1WpJcDGmcGvv5/xNw2qWyoazhLsMOa4FzjJ0963ncdDIHulyYz0acPxB8qBJbOSByaYkbk71DHR5Us0JlsxhbvfwDIslY7jbPSzTwtvNdtELu1l3nz3ZbjDak+zfTMrOc9lsrrzs7FGZNlvmKMz9pb1f4G9kB5mNpXczY0/vgbsx8UaLDrP3HC/Ie2TM6Bxx2OXiXMNC4c0F06bmCzTNKsgvBcR/7blTV6dcbmiXo3HlznLOwmieG9t/NLHOm46zpKUqW43O9OTkjERjujUlOz0jO8XCj5x9jG10rm67HA5/QaojY461OZ3a7fCa/x4PXxh/fjbPn//nP8rq+BN/4s9P8lz3A88TP+Wjs8Wf+BN/4k/8iT/xJ/7En/gTf+JP/Ik/8Sf+xJ/4E3/iT/yJP///PYx+W3GW9tuN7ULzXTyr9z2+S1fRO1b7/5tHKScwFvsNubXap06rlaDlhFZYgk7P5G9qHqJLjml9Px8Dy9BNiGljP7uJrdMtjGkzG4ES0ham6h6Paauyt8/fxpbr3otpOxuhnxzTDuUyvfRJYI3Gb/t+f/NYU0NMc2YyXR7TCjOZ/xbTOpZslr/vWd/Px8DsFl1MG/vZTWyKJTGmzSzV1BLTFua0zI1pK1/c529jeZYVfb8vONVyVkw7+HyL9ElgE6zvi99srbfE5pk0zTNpmmfSNM+k9f18aJ5JG/vZaZ5J0zyTpnkmTfNMmuaZNM0zaZpn0jTPtzCVjWWj2Rg2DmqB9m3KEGthbUAdC8NWrH0Llb6L6oclCNXM8lEygzXiUdlS2OpZA8ratFwAHID3OnzWwrMY9RrhUw1bEB5Bzc8PNCFWrebbjFwbbM1aGdUPogcq4IdfEBE2INcBFUZbqvbd12roRviqWp/bUbtW+25tvRalJRY1DI+mWJvCQ8UYW7Q2A9p3aMVY5mhjrYPFr323M6SNQtXYr41StEvjqEHJSC1yk2Zp1CL6MUdkl600IU6jNmOtsV42w9KktUoxxTjD/XogWmzVxiK/+0uzTX0XLbVgBlTtW6/12iwEte+5iu8Ph7WcGHG4733QnFErqtb35ti4WrS5rdY8j/a4/4jErK3X6tGo1yKfr62H/m9zqBatSYuwQZuH9tib7z/f4o3R+ANa/8X46b2EtNUgmFoU71pFjNa+0VAf62M+bchtjEUPYxT0htb1vSW/tkb8sDYdMy65mmvQE7/Wfk2s/XxtxdZr70qU/PsemPxvo14eWznB2BobjygTWeEPrPSw1matthJFK2v73oGcm+/ae/Wxdd3a5y1WLr3xZvgHtLUzHx41bJg2p8PhU6vFm6XVbdHih/G0YhwFeDq0J1/bU8e2lx+LXgC9QVuB9VqvWxFhA6xixuq0EYuVemxUaa/TvvEe0taLjFepjYFWyQbt7bZpPQxr67hN23dUW9XGIPZAQHuDQa2NgPYOq7W6crZKmQ/jnhGrG+pXQvunVpuTo3uiI/ZN8YbvaZfywrcGb7Bdm8PavjVWq5W3aitkQ7911aqNtDm2sihWQPsUO+X4cYty2pHDUEu8KbEaqvta+q5eNf9b5B8/R0ejy1NRjZ1rYa3fNcecL/8+dnmaHN+vKf1mQIyExkKnrPw5Eeo7sWu1M6tZO7v83ztSmmf/MXNKO74l9kmjIt2urbx2rWattv/FaAJ9cYRno7ZrfugN/af2xdE9UaD1RuwBOvnztXfVytbfoo4dPWacuiBYE2ppa6kLq8UtodaWkD8cbGnOV2c0NqpLg/UN4TZ1aaAtEFoXqM0v9jcGq0NBNdim+tWmltpAqFlt8ze3qSgP1ql1/qZg4wa1IxhuUNvaq8ONATXU0t5cG2yub1Nb4BoONKFmc61a0xJqDoTa8tU5YbUu4A+3hwJtaijgb1SDYbRR0zZSbWvyowc1/lZoUaWpvTEcbEXI5vamQAiebYGwFqBNbQ21oN+i24je2NjSoTag42qwqdVfE1aDzWpYjAM9QxW1MdiMtlrq1OpgvRaYGgoH1odRObg2kK/Ghjm0TW3yN29Qa9oxeOp3uAHtBzrUkB9jCQUxbFT0N6ntraIZRKyHpS24Ee7hFgxonRiSX+3wh5qoLTHNNQ3+EDoWCOUvDdS3N/pDfW9gsmx6OSYHw1HH508sPGbSwyF/baDJH1orRiB6c/Tt1WOuW4W5pgUDbw4G2vLnt9cM87cNV2sD6qxQS0u4IRxunVxQ0NHRkd8k6+XDvSC8obWlPuRvbdhQUBOua2kOt8Vcha7zo/m1wq+ypR1TskFtbwugcXRIFKt+vIFAqCkYDgdq1eoNWrdKffNnoDSkZfB+atvpTXQ0BGsa+tUFB5trGttrURUzVhtsa21EA2KuWkNBONTAK9Aczldl2y3NeJHDgsPVQFO1qHQ0VLN0/s4eae5iKeK1tIVDwRpaL32ti2UiY03ROjAsiFawZMWeCImFXdvS0dzY4u/fKPrsp57ixWO4mGMh2sOt7WFM+7pgTUD4NAQaW48b0I95F9qbKKgN1Pmx+PP9ba3r+/7exHoz2Pbv/E/PODxw82YDmKm3lyXG/m0ZIwqGgUezvn9N5ntSie5Su53Dh1f8WH+HQ/Pf8WP9ExM1/54f6+90av4f/Fj/pCThr2T8WP8BA+Bfov3bOmb83Uf4i799GsW/i8Oz8LeqXSxLN5fl6CrYWHgVMfHryY/1L+nnnwp/D/zz4T8VXjNRNvc4/3P7+afDPxf+Y+E/A16zUbbkOP93+vlnwn84/MfDvxRe81HmO9afj+vn74L/SPhPgr/4F4SWoGzFcf79+zMI/gXwPxH+i+C1HGVVYh2ZzdxsfeyxG5D27DEbuNlkNq/fgbTeqONG/cFOkcycm/Wa6mSdHEnXqdNxs2Hv3r1mCzfbHul8pPNaPBfh2YHHYuAWxJGB9NxoiBwQtS2cW2KB+keyiEgWK7fYDyBd473Ge4H27MJjNXKrWa/Xh3dt27ZtV9ik56ZYsE4rV6yGvmidCucKguv13GrcjWS1cavjQNWBKgTfe756vtqFZxsem5GL/zjhO2PauGKTMY8NatOC2hzclngg40DG3mF7h+2evXu2GOJZ5rPMW8x2E7dbFKTJZVuQyiab9dxsjMXttHPFbuz8zsh2k4hsT+B258GBBwd+PPXFka81vtb49Pxnn31811O7HrM/ZneYucOqQ5pS/5hI9VO0OX7t4AFKDkVxGA/0JXbggOiI4cABg5E7zM+KFNs1VnatUsF0Nf+LuDMBj6q6+/+ZucPMJDOJEAIkgELYZBMQUCzIoqKyGSIKpdjqFHEZRMpOAAPRIO7ighSXuiBFihYtU21dOo0YMQTBgJkkzVBCEoYJ401IQu7NGKnn/dybIQS0T+3/ef7v+5znM3fucs6c3/f7O8tNabtqyQKRfM+Su+4Toxf8etlCMi5eWG6ZcW1PwRhjlmkZLQkiOXZmEQ7e5TuZ11uuWMm0i0RnijI5I2OS6DNj+k09xbBbZ0ztKcbFnjHmrfaii3mm8AsdWlu3CZdIEqmxs3bCzexGXt+5aOkisc383Gl+vmd+fmB+fmJ+7rmPTYrINz8Pmp9F5meZ+XnM/DxhfqrGsioajE+L3fzsan4OMT+vNT9nmZ/z77/v/vssa83PDebn0+bnZvPzVfNzu/m5q3X2+U+flp/46URJBQ3sKOwUxl9V/u+uGX/fS/ivj4niEvP91ngje0g8J7aK3WKPOCwqRYPFKuLMSJ2xaFVh/G1JoV6y+f/WxhxkGd1yfHRDy/F30TZ1yLfareedW9xnzj9P7Hf+eYek8887vnT+ed/vzz/vf8H9gV3PPx85TMRZ2543trlvF5Ybrz7/fNrjHOPJ6f4iw/h7HHUeQqph1gyxzrrNWiJeV36n/E4U2ZbZ3hCBdl/bH7Uo8bfE/9ryYfwjLosl393efb31Ovdt7letqxLmJcy3/i1hXcKT1rxEa6LTejixKbHJ+g9hydYNbezFCR/8aCmklCUcb1MisVL4I6UxsVdr6U8ZTZlImW+WLReWhMLErYl/br85Vl5vU3YapYP40RLfIaO1PN5hU2vRW0pS9x8pQygjk19qU7a1FPPOBSV5d3J+aznY6RjlhFE6236sJA3pnNS5f5fH25RNZtnzo6WwS/PZkpKc0rW1TIyVKT9aMswyK3Y8v2THPo3n9pqlqLW01D6aUpc6MHVe6qupO4xyYeupu36stLSe+tfUylhpPFeMX0ltNn8r2+Diab1Ht5ZpvWe0lnmxMp+S3Xt+n+GUCX2H9J3Yez6fQ/ru6Zd/abFZGvvPoSwa0I8yeEDlgChUDvh+YP6gV40yoHLQJ4MigyKDbYMTBycP/ohSNGQcJWPInKGvxIr/8uwR/UZUj3zuypGUcaNSRs0ZlXnV7lj55Kq9VxWNHki5avSGMUfG2s3yzNg9Zjkz7spx78TKB2PPcP7OuDrzrG68dbx13DvjB094esIn1wy5fjbl6I33jn2m5WmOdS1PTR5nPDd52pReU4ZNGTdlx9R+ZsmYOt8smVM3TH2Fz8ypBZRj01ZPy5529KZFlM3pHp7KSD+YfnBqAZ9HjG+UynQ1vXl6tlm2T//SLEenq3B0up5hm65zX82Yk3Eko/LmZZTnZvTkue3T9ZY7M1ZP12ccn1E7M2PW3tmzf5X0q+6/6neP7Z4595Te03z2eO9gyu6F7Rf2WpS56KFFuYsqF6mL9MW2xcMXT1x89+JFi1cvfnTx5sXvLP5gcd7iw0sWLXluyY4lDUvF0qSlk5bOXfrJ0uJlI5fNXfbK8lnLH13uX964wr5i8IobVryz4sTKiSubM7tn3pDpyVyS+UrmrszSVb1W/XLVB6tKVzWvdq/uvPqq1deunrd6++rSNQPXTFxz+5ota3auObJGf2DCA6sf+CTLnjUha0nWe1l7s86s7br23rXb16rrRq/LXLcrO+PfzFUfXDgfnT/bZK84V4x5JPv1c6VlBvk3Y2/KhSPu/HHSkuk/OuucnXnalPPnjuy954oxO2QXnSst84Ixh7bfmbK3yybm4bJxdcya5hxsHplvO2Qwv25J3Np+c0Jh65zJsx303vOMugkfJG45N3e2qMTsPNGcf1ue6pW49ax6xlVjLjafLTPum8/HFKTdDxKOM5NvpUaZ2VohvdvMscws51aHyAWrwsQ268C5lWCr0e8fzP47fzD7x8fm/MfN+d6c5c12qJ04ke9bzs6E+LEj5hdzU8v80zK/xXxkTmQGNFyb1zo7nnWUOS5lSnalUeOcx71nZFdmV9Ka8VQj9zJSK3vP+GFOMA8WtZlRf2SebTuv/nBOjc3ce81saplFp52dP415nSv8araauoMrM1IyrhyZfrCzrWUdM4+sWV2aOx0jq5LOrj5nV5Wk7p1t51aglqw01jbzaZvxBHX3dE4y7hhXjKeM60ndEwrPZmpK16TurIBJRn3je8vVc+to25XU6Iu5asbWzTYrZxItXLhObjpvdSyMrYzJZ3vP/eaWXzd+f2pGp2MpE+nPeeobqhka41SbEXtW45aRaKjZkim956H3FMNNQ4mUjOSXTL93GN60GdWjU3cR69kVtqil1Ww1JTtbbSnGLxjH3jMMV4xvLZlmHLPVvkP6DG+hZYXrM9xcldoUY4VrWd3M9fH/sZhrapvywyfMlbZNia24reWHNYyV9r8r5lr8k0vriv1vyoVKGaV1Hf83xVzZf3Ixdxs/sVyojrlHaVN+qJ+5d2lTjLxvcfq/Kz9s+T/37qeVFp2NvUvi1rH2Kb3GnkkoM3Y9ZnnGvGI3djrm2TNTehl7oNg9Cjuoq4xdU8tVY+43vhnF3B3NNndWxh6qblyduT9id8S3PWOfMXcn2a27GKNsn56dfmR6trGDMc+2x/Y5Ld+3swuqNK4YOxqjXnqsmDueZebeiGfNu9uNz9RdPL3d2E0xW/RLP2LuuzJjJcO80s/YdZlnGelHjHkpdo/Czm0YezVjh2bU22B+o5j7tEXmfo5nzZ1a635tasZ4q6nIGUOLm5e1KDHWbsZDj1t6OrXAbNv4pQ1mW2a754/EHzraNg8uLW45E3ZLrixTbpKfKDPFRcps4VaWyHrFL0YJK3cKOQuZ31RlpjwuLHw2CSuf+5TZspA39LflGZEnz1g8oqPl12KGZa5Itdwp0izzRAfLfaIDT47kyfHKAvl3YaGdKmHjWTfPduBZN8/Gm+2FeKpWxFluF92535v7M7l/Mfd701Zf2kqj9sv056hw8W03/e2gPEA/suRf6O9opUr+VjkuhikhMVwJi0HKSXlIiRj/7+e0XkjrlcLGN6sy+/vv6M0mWvpMZIqLxBTRHkaLAWIMzJOHxF1wNyyVYbFMNorlsAJWQiasEm6xWh4Wa+AByIK1kEP99fAwbIBH4FF4DB6HJ+BJ+FBcKz6CKN+/BykGWARYIEOMsdwMM+AWuBW8Yrplr+hBxF5llrhauU04lTtggXhUWScuUR4UPZUccYntNXnY9jq8AYfFANvXUAQBKIYSKIV/QBkE4Qj8Uwxo114eandMHm73jXC3U/leA3XysL2dmGIfwHGEGGC/kuMCech+PyyE38ByGbavALSxo40dbeyrAW3s74ox9vfgL9AkxjgGih6OQXCHGODwwFxYDEtgFWTDg4BGjmfgWXgN3hDXOt7mWAO1UAf10ABNgIbOO2Ee3AXLRY84IcbEJYseZu6eIK/jzW8ncb1JdCJrfWStj2zrR7ZdQ7Y9RLbdQrbNJdsmk20TeHob+TJEmSWfVn4uV5NBV5A3L9CCR/HL7UoVeRYSinKCHDwpbjPz7DhPHWGbeXZU3C6Gtml/Eu2voP3raX8UT8+h7U20/RdqjaDtzbT9Mu19QnuzRCKtnKKVU7TSnlYupZWFtDKUVobSyiBauZReHqWl/rQ0z/i3b7Sww4x0H9/eFSm08Xfa+Dtt9LfcIT+inaG0cwftjKSdW2hnvMUrv6KtoZYt8q/U/Jj2bLS3gp7dTZsd6VkOrT2hVMpGelegVDNaT4rLlEhsxHag1YG06qXVUbR6Pa32ocX+tPY1Nb9m5N1ElDOFKzbD/IuZxJhZXhQ5UhXr4WHYAI/Ao/AYPA5PwJNQIKNiP3wJB+AgfAWFcAgOw9dQBAEohX9KKY5CORyDCqiEKrlfHIcQNMigOM04bwQNdGiCKLPbt9xvhu/gDPwLvqcvUqoWARZzVqxS5pBhv5SnlNs5euQp22Gp2r6GIghAMZRAKfwDyiAIR+CfUC2jtpMQgW9AhRqohVNQB/XQAKehEeiL7XuQcn+7JLnfMUFGHdfDFJgK6TLsuJXjTJjD/dvgdrhDqg4PzIX7uLeY4xJYxveVkAmrOH+AYzbHB2ED3x8BfHBs5PgMx2fheb5vghdgM/yW9l/j+la+b+P723x/l+8fAx458MiBRw48cgSldBwBPHLgkQOPHMeoUwGVgEeOkzLoiMA3xKJCjSx01MIp7tXRdj00QCPneOfQOTZxjkfOO2Ee3IVfVvG0SDZXLkU8Te7OJIeN1asdZ3/kbApnk8nyPOUrMUhYuKqLiWRmkMwMkplBMjNIZgbJzCCZGSQzg2RmkMwM8nSYTIuSaVEyLUqmRcm0KJkWJYtUMkYnY3QyRidjdH4vl98LKr8S7ZRfw1wy6E5ZRdYEyZogWRMka4JkTZCsCZI1QbImSNYEyZogWRMka4I4qeOkjpM6LgZxMYhzOq4FcS2IWzpO6TgVxJUgbgRRPYrqUVSPonoU1aOoqqKqiqI6iuooqqNiEBV1VAyiYhAVg+aILRMOtLyGkexk7f0ba+/7SiFr7SFWIVYbU98IER4iwgpT3wc4S+GsO/o+RAslYjbrZBrrZBrrZBrrZBrrZBrrZBrrZBrrZBrrZBrrZBq/dCVrZR/Wyj6M2SLGbBFjtogxW8GY1RizGmNWY8xqjFmN9TSJMRtizIYYsyHGbIgxi99iKuvmSMZpBeO0nHFawTgtV+aKfsqdsECsZx3twTrag3W0G2tnGmtnGmtnGmtnGmtnGmtnGmtnGmtnGmtnGmtnGmtnGmtnGmMxxFgMMRZDjMUixp7GmCtizBUx5kKscWmscWmsb2msb2msa2mMlRBrWxprWx/GSoj1LY38LyL/i8j/IvK/iPyvIP8ryH+N/NdY/5JY/5LI/xA5X0TOa+R8iDUwjfUvjfUvjfUvzch32YDWDezPnpYP48Ak5vMK5vPlODEJJ37P3SfJ9uuVw+ykiuT3SkDMNd0L8nQZT5WyYj4t13I2l7qHqfs1VydQ92nqfkHdKdQtot4vhD02jn7OkwGeLOLJKeb+ysiZt8yW7uL+eO4f5H4x98fQ0mPcfY+WrqWlAloaZj7/D3OfeNT81EW85SLRwzIHFsD98BtYBIthCSyDx1npO1hyRQK/8hCtZ9LOPnNv9LroonwsrlA+xf9K0ZtV+xZ2iUms3F3ZJfZWqpkZTtKDCNe+EVewni+Rn1KjM3vKXsaaTv0FYjIr2Bxy/jYxWbnd3H1NFon0rBs960bPutGzbvSsGz3rRs+60bNu9KwbPetGzWRqLqRmMjUXmjUTqJlAzQRqJlAzgZoJ1EygZgI1E6iZQM1+1Lycmv2oeblZ001NNzXd1HRT001NNzXd1HRT001Nd6zmyFjNkURymxjIt4Gmxj5zj9CEWkHj33zDzTADboFbRTx7t3j2bvHs3eLZu8XHGf85rQ2FO1InI7bTyDM9qhBFlv6y0jIABsIgGAyXwRAYCsPgchgOI2AkXAFXwii4Cn4Go2EMXA1jYRyMhwlwDVwL18FEuB5ugBthEkyGKTAVpsFNkA7T4SV4GV6BV+E1eB3egK3wJmyD38N2eAt2wB9gJ7wN78AfYRe8C+/Bn2A3+ODP8D67tVyOn8oyyx74DPLgc9jL9S9kwJIP+6AA9sOX8oTlAByEr9hBzOFt5XZZaPucncRe+ALyYR8UwH74Eg7IgO0gfCUD7TrIynbJ0Ak6QxdIgVRZad8ILwIa2F+VJ+zb5Sn7W7AD/gA74c9c/4wju03753wvlAH71zxfynddVjouhkugB/SENHnK0Qt6Qx/oC/1kwHEp9JdljgFALjjIBQe+O4ZzPoJ7Y+QJx9UcZ8hTTqusdCpgg3ZgBwc4IQ7iwQVuSIBEuAjaA/E6k6AjELeTuJ3E7SRuJ3E7idvZFbpBd6D/TvrvpP9O+u9Mg17QG/pAX+hHn4bLE84R8DMZcI6GMVybADfAjXAHz83leDf37uG5e8EL82E597JgLayDbNjI9Td5/i2e3yHLnH/gfCc0cE2TlXEWINa4jjIQRxxxneSJuJ7k0BoL6lhQx4I6FtSxoI4FdSyoY6GGBXUsqGNBGUt7GbZ0gCToCMnQCTpDF0iBVOjKnvUS6AE9IQ16QW/oA32hH1wK/XnLHgADYRAMhstgCAyFYXA5DIcRMBKugCthFFwFP4PRMAauhrEwDsbDBLgGroXrYCJcDzfAjTAJJsMUmArThPE/U+uypMN0yJDHLTfDDLgFboWZ9HsW/Bxmwy8gS9ZY1sI6yIYH4SHIgfXwMGyAR+BR4H3D8oxssjwLz8HzsAlegM1g/C9zvsQc+TK8Aq/Ca/A6vAFb4U3YBr+H7cAKaNkBf4Cd8Da8A3+EXcBca2GutfwJdoMP/gy5zOWfwh74DPLgc/gC8mEfFMB+uHAWmSl/zSw9m3XgImb+q1kHLmL2v5pZ+5CNGc/GjGdjxrMx49mY8WzMeDZmPBszno0Zz8aMZ2PGszHj2XbxjvIuvAd/gt3ggz/D+/BXWWP7ED6Cj+ET+Bv44e+QC5/CHvgM8uCAcNsOwlfC3a6DiG+XLFztOkFn6AIpkCpc9idljf0pqdo38n0z37fIsP1F1iQ8MGez17lHLPbfc48+2+mznT7bmaXt78rj9vdgN/d8YMxyH/D8X7j2Ifc/go85/wTop51+mrPfF5wXcG8/xy+5dgAOwldQKNz2r/lt3u3svNvZi7lWIpvMmbKMvvE+Zw9Tl3cWu8p3dtd2dtf2U8A7i513FjvvLPbT0Aga6MTWJI87EmWN4yJoDx0gRTY5UqErdIPucLGId1wCPaAn9BNux6XQHwbA5VwbznEEsMo6WF1bZl3hdlqFy6mADdqBHRzghDiIBxe4IQES4SJoDx0gCTpCsoh3doLO0AVSIBW6QjfoDvTTST+d9NNJP51p0At6Qx/oC5fKGucg3tEGw2UwhHN2Cs7L+X52Jh7J9ythFFwFPyOO0TCN7zcB77nO6dTLkHnOm2EG/EI2Oe+gn3fz3IWzNO+7Tt53nSshiz6shXWQzfOP8duMf3PW3sxxC+2+CC/By/AW7e2As7P421zDQ6dG3e9kU5yQx+Ms7JWcUo1Dz7h4jh243lG4zZmdFSquC9dSIBWYj+O6G3+XNEZ6bF+VxQgNmHu0Pa3XF3J9lfl3FGO/VSvaWSfJXyo3yc/YncYbf9viXo0YbB0mI9aRMArGwyR5yDpZ7rdOhZvYlc+UR9ldHGF3cSR+ttwfPwcekZH4R+ExeByegCfhKeBdLn4jPAPPwnPwPGyCF2Az/Ba2wIvwErwMr8Dv4FV4DV6HN2ArvAnbZMQ9SEaEQk9162zeiZfwDj2G/mv0X7OOliH6r1mv4/iYrLA+zrvLbeIy5q/LeHJ//C0yFH8rzIJfwp2yIn4+LICFsAiWwSNSIzaN2DRi04hNIzaN2DRi04hNIzaN2DRi04hNIzaN2DRi04hNIzaN2DRi04hNIzaN2DRi04hNIzaN2DRi04hNIzbNNUVWuKbCNLgJ0mE6ZMDNsoLYNTwcJUtw6Eur6aPMN/9y2IPYdxD3Duttcpd1HtwPj8lcNMg13r+JfQex7yD2HcS+g9hziT2X2HOJPZfYc4k9Nz5T7opfBWvgQXhY7qJfufQrl37l0q9c+pVLv3LpVy79yhXX4IAXB7z0rQoHvPSviQxqJIMa6Wc5PSmlJ6XKzO8bldnfa6wuCTgzlNUlAXeGxt7x88iuRrKrkd6V0rtSeldK70rpXSm9K8UZL854ccaLM16c8eKMF2e8OOPFGS/OeHHGizNenPHijBdnvDjjxRkvznhxxoszXpzx4owXZ7w448UZL854ccaLM16c8eKMFwVKUaAUBUpRoBQFSlGgFAVKUaAUZ7ziOlTwoIIHL/ahggc/9lkniYuJPp3o02N/b30i9j49EBU6o8IIVOiMCiNifyX+BV7tw6t9eLUPr/ahRjpqpKNGOmqko0Y6aqSjhgc1PKjhQQ0PanhQw4MaHtTwoIYHNTyo4UEND2p4UMODGh7U8KCGBzU8qOFBDQ9qeFDDgxoe1PCghgc1PKjhQQ0PanhQw4Ma6aiRjhrpqJGOGumokY4a6aiRjhoe4SAXGonYTcTPEvEKIk4iwrVEuFKkolEe+uShTTHaFKNDEhokcfd54s8j/jzizyP+POIvJv5i4i8m/mLiLyb+YvpRTD+K6Ucx/SimH8X0o5h+FNOPYsaKV751wXzXKC6z3swcNxu8zHPzmePugwVA2/T4WOtcl8WcsU7ud62REdcDkAVrYR1kw4PwEOTAengYNgBzo4u50cXc6GJudDE3upgbXcyNLuZGF3Oji7nRxbzoYl50MS+6mBddzIsu5kUX86KLeTExDuLBxZxnzOwRs+8aYzzEGA8xxkPoZryn9+PuYcZuiLEbYuyGGLshxm6Ivmv0XaPvGn3X6LtG3zX6rtF3jb5r9F2j7xp91+i7Rt81+q7Rd42+a/Rdo+8afdfou0bfNfqu0XeNvmv0XaPvGn3X6LtG3zX6rtF3jb4bc9Zs+Q/U/hKFP22ds4yIysVwIvJxv5L7TbhxBjfO4MYZni3nWSfPuhgp8UQ6hJEST7RDYn8D2otDZ3DoDFH6iNJHlD6i9BGljyh9ROkjSh9R+ojSR5Q+ovQRpY8ofUTpI0ofUfqI0keUPqL0EaWPKH1E6SNKH1H6iNJHlD6i9BGljyh9ROkjSh9R+sQVRJKDN/l4k2/1iu74k08EdzICvmUE6ESynki6xP4y08X4ywyR/Nb4axbe5eNdPt7l410+3uUTVQ5R5RBVDlHlEFUOUeUQVQ5R5RBVDlHlEFUOUeUQVQ5R5RBVDlHlEFUOUeUQVQ5R5RBVDlHlEFUOUeUQVQ5R5RBVDlHlEFUOUeUQVQ5R5RBVDuN4tjmOryKKr2L/mdMN9Pp5er1buIj3APEeINYDxNWJmDpx5wXiOUA8B4jnAPEcIJ4Dwm5djq8r5LfWlfKEdT158ZSstb5g/KWdq83W9VIXFj6/FQN4QrdmkhGrYL0MWDcIp/URaj8pq62bjf9evvzO+qL8zsX+1sX+1nUxXAI9oCekQS+YxzN3wd1wD9wLXpgP98ECuB8Wwm9gESyGJbAUlsFyWAErIRNWwWr5nRlPMz2tsmbJMLEct26Sp6y86Yk51iVk+1JYztVMolwF62ShNRsehIdgvehk3SDftW7kuWfkMeuz8Bw8D1vkh8T3ocsqv3QpYIN2YAcHOCEO4sEFbkiARLgI2kMHSIKOkAydoDN0gRRIha7QTdaiYS0a1qJhLRrWomEtGtaiYa1rtCx0jYGrYSyMg/EwAa6Ba+E6mAjXww1wI0yCyTCPOO6Cu+EeuBe8MB/ugwVwPyyE38AiWAxLYCksg+WwAlZCJqyC1fJDYSNzjqLi16hYYd0s68ml9bKBPGkSGbgQxYUoDjTjgJFhFaw4OiuOzhM6KkdROcoKo7PC6KwwOiuMzgqjs8LoqB9F/SjqR1E/ivpR1I+ifhT1o6gfRf0o6kdRP4r6UdSPon4U9aOoH0X9KOpHUT+K+lHUj6J+FPWjqB9F/WbUb0b9ZtRvRv1m1G9G/WbUb2aV01nldFY5nVVOZ5XTWeV0VjmdVU5H3SjqRlE3irpR1I2ibhR1o6gbRd0o6kZRN4q6UdSNom4UdaOoG0XdKOpGUTeKulHUjaJuFHWjjLkVZLcxFrPQdC3ZvV4konYValei9imxCI39aOwn06t5Mh+tq9C6yrqa8yx5kloNZL5K5qtkvkrmq/jwL3zw44MfH+qtT8svGAEljIASRkAJI6CEsfQlc8NePArgUQCP/HjkxyM/HvnxyI9Hfjzy45Efj/x45McjPx758ciPR3488uORH4/8eOTHIz8e+fHIj0d+PPLjkR+P/HjkxyM/HvnxyI9Hfjzy41EVHlXhURUeVeFRFR5V4VEVHlUxQlRGiMoIURkhKiNEZYSojBCVEaIyQlRGiMoIURkhKiNEZYSojBCVEaLisR+P/Xjsx2M/Hvvx2I/Hfjz243EAjwN4HMDjAB4H8DiAxwE8DuBxAI8DeBzA4wAeB/A4gMcBPA7gcQCPA3gcwOMAHgfwOIDHAeHFwRAOhnDwNH7vwcVTOFeGc9/gXC3O1eJcLc7V4r8b/3fjnop7qvUJrj2F0xvlH3GwGgercbAaB6txsAYH68mTv+FiOS6W46KKiyouqrio4qKKiyouhnAxhIshXAzhYggXQ7gYwsUQLoZwMYSLIVwM4WIIF0O4GMLFEC6GcDGEiyFcDOFiCBdDuBjCxRAuhnCpFpdqcakWl2pxqRaXanGpFpdqcakWl2pxqRaXanGpFpdqcakWl2pxScUlFZdUXFJxScUlFZdUXFJxqRyXynGpHJfKcakcl8pxqRyXynGpHJfKcakcl8pxqRyXynGpHJfKcakcl8pxqRyXynGpHJfKcalcDMMlHZd0czS2uNCIC/W4UI8DOg4Y7031qFuPuvWoW4+69ahbj7o66uqoq6Oujro66uqoq6Oujro66uqoq6Oujro66uqoq6Oujro66uqoq6Oujro66uqoq6Oujro66tSjTj3q1KNOPerUo0496tSjTr0YyMxwhpnhDKNfZT2Ptz5BFE8Shdl7vm+GLaz3L7Jud2NX1x0uhkugB/SENOgF83jmLrgb7oF7gR0kWjehdRNaN6F1E1o3oXUTWjehdRNaN6F1E1o3oXUTWjehdRNaN6F1E1o3iXvRuhqtq+mxSo9VRkGEURBhFEQYBRFT/7MjAN1/kPns4K3GXzb+fbZX40c1flTjRzV+VONHNX5U40c1flTjRzV+VONHNX5U40c1flTjRzV+VONHNX5U40c1flTjRzV+VONHNX5Uo6CKgioKqiiooqCKgioKqiioMhoijIYIoyHCaIgwGiKMhgijIcJoiDAaIoyGCKMhwmiIMBoijIYIoyHCaIj8hNEQwaEIDkVwKIJDERyK4FAEhyI4FMGhCA5FcCiCQxEciuBQBIciOBTBoQgORXAogkMRHIrgUMRc4+vM/xTySrxS8UpltlGZbUJor6K9obGKxioaq2isorGKxioaq2isorGKxioaq2isorGKxioaq2isorGKxioaq2isorGKxioaq2isorERo0qMKjGqxKgSo0qMKjGqxKgSo0qMKjGqxKgSo0qMKjGqxKi6jFxYDitgJZBvxKgSoyraMxdr548ZMu0Jc6TrzKn6fxoj7N1XsEflzZTR5ma02RltFYy0Toy0eJHeOqMsZzXOgrW8l6/ntx6TdWR2HU9HGZt1rM6N1BqCwjoKN7bZNdWR3XVkdx3ZXUd215Hddf9Ls00d2VdH9tWRfXVkXx3ZV0f21ZF9df9fd0XG20oUpb5ofW9pFErsWhSXvhMz0bYAbQvwrwb/atDWeLMpw4l26BtG37A5/23kfBPvCC+wU9rCtRdlGF3D6BpG1zC6htE1jK5hdC1A1wJ0LUDXAnQtQNcCdC1A1wJ0LUDXAnQtQNcCdC1A1wJ0LUDXAnQtQNcCdC1A1wJ0LUDXAnQtQNcCdC0gp2rIqRpyqoacqiGnasipGnKqhpyqQfcwuofRPYzuYXQPo3sY3cPoHkb3MLqH0T2M7mF0D6N7GN3D6B5G9zC6h9E9jO5hdA+jexjdw+gedhlxLocVsBIyYRWslmFT429jIyEqOlrfF52tn7Lj3ENefiazrV/IHdbT7DM0udH6rSxUmDmVy3h7HSrfVUbKUOu/Vp4l2is/F+7YvymsdgflQRzbRru7YA8j4DNZZM0j0z+HL/jNfI77ZdB6kDfdIn4twLEYqkWc9SQjVWOPq7MTaoJmWa8IeUxxgBNSefsfKquUy+VpZTiMgCukroyRlW6PVN13yQPu+4A5wv0bjotk0L0YmBPcazhmcVwL7KHdOcCK6X4KGJXujdx/nmvMfe7fcr4FXqGNbfJb9x9o/114T552/wl2c83H+YccicldyLVDcBhKOC+FIN+PwDGeq5HH3KehSR5LSJa1CZ2gM/B2mMDbYUIfrs+XBxLY0yfQr4RHZGPCU/J0wgvwIrwpa8WUmKpl+BRF1RJUrUHVGlQ9g6rHUbUUVUtQ9TSqlqBqCWrqqNmAmg0o2YCSDSjZgIrfoqKGihoqaihYg4JlKFiCgiUoWIaCJShYioKlKFiGgqUXKFiGgjUoWIOCNShYioJlKFiGgjUoWIOCJahXg3o1qKehnoZyNSimoZiGYhpKaSiloVQNSjWgVANKNaBUA0o1oFQDSjWgVANKNaBUSUypMpSqQSkNpTSU0lCqQfSy7pRrrO/L91DKTw5+h0LbUeUb61F5D3m23HpSvkZ2z7I2stP+Vo4jz/YqisxT7PJpxS0Xku0BJVmmKT3E3UpfuYzM76UMkdei2ptk/w3k3MvKOLlWuUbeFvvXWeXKz+Xrymw5X/HKvxn/fomoPmJO+pRV4jP4Qv6TXzyBH0f5xRC/cJJW62ixkhZPMZbGMJbG8ka4E8c+lYeoZYyXL80xUi0uofZhau6j5nH6FqJvLlooMsfDSFlEzU/lPmqdoNYH1OhIjQp+r9wcv7xVm2O4B+P0Ms6HyqPUOkYv88TFZNZps2YemfU55JMx+6l9kKwqYhcZ4Fgsj5Mdx8mO42TGcTKjgsyoICsqyIrTZMVpsuI0GRElI6JkRJSMqCATomRClEw4jnPHce40rhkzf7VIpD92er6N39vJ7/6VWD+EfNmMrkfQM+TOlDrtN9B+A+03uF/k/FWp006DsFGrkZ4voUalkffshHcyl7xPLJ/JQq4GrYeYRwwNj8oIuh2i3RLaLRGz+dWNPJ3NmKoys+WvMotfz6JmPUo0o0QzLVShhESJxti4akSJRmup3EWLPjKp0KqSPfGQLO9SOuNGF0iB3nKp0gf6ym+U/vg8AC7DPXRXxnP/GvPfLl9Oby5n7FWhbiPqNjL2qlC4EYUlCkvGXhUqZKG0RImNKLERJTYy/qpQuxm1m1G7GbUl46+K8VeF6s2o3oxaWSjfiGJZ7j8yE+2Cj+VSd97/EHfv0VFX5/7Hv8lMZpLJRBQRFK2KIt56UWttxVp6odaeVlvb2mO1Wntq64FCKwpaQATaqm29X0GRqpUiahVqar0A3q1aG0jIAMMk0Mg9IXxDIBCu2b/XjOn52f7OWWedy1q/P97rO9/b3s/e+9nP83lmwcTxL6jDIqxAASvd+6vju9pYHa6qicKfairCUzUppDHI+RCMFKGmhtvswTVWc3fNvWF1zTRMx/2YGZ6KqnnkVt642kp/VPTZJ/rsE332WfWP2+n77PR9dvo+u3pfdJj1KK7lDnO/xdxv8VZKjOoUozrFqE5j7zL2LmPvMu4txr3FuLcY6xZj3SK+dIovnWJLp9jSKbZ08u9OsaWTrV3s3CJWdIoVnWJFZ1lGj1N5wL1W/2Wrf6fVv7N8oRV9Ea+EN8tflxXfwJvhEV6wp3yJ6zm+lQ/jyleEBeUFNKEZK7Eq3Fj+V8fVWKPNtY7rsAEbo6m8pba8zedNaOd5mx1jdISryreg0+et2BZGiE31Inde5M7bwd8UoxaV73FvL/aFheU9jkEWLkM5ivErydsqfE6JU5kwJVHtczaMLsWzPo774wD0Rb9wBm89m7eezVvPlltvSAwM1yQOde8wHBF9KzHI8SgcLeYNxjHh24khzo/Fcc6Pxwk+fxAfCp8TI78rsjxp1aZatalWbSpvP0e8vCVxmmc+jk+EnyZOdxyKM8LkxCcdz8SnwsV2xdmJT/v8mXClnfHN3n8x+6Qdck3iwujgxCUYERaLr7/Ljgj12ZG4IuyxS/bYIXfaIXt4yVReMpWXTM1Odf+n+AV+iV/h5qh/9hbcits8f49r92Ka8+m4TzsznP/a8cEwOvswHsGscEP2t+Ea2Wxy9nHnT+B3eDKcZVedJcNN5oFTeeBU+uAGWW5y9g/hp9ln8EfPPe/afM8t8HkhXnT9dedvuv6Wdv/s2jv4i2t1WIR6bTVgCRo9v9yzeaxwrwDRm3dPtWvPyq4KC+zcs2TRyXbv2XbvWdk1rvHBLB/Mrgc/zG5Ea3g5yw+z/DDbDj6Y7cAWdIoAW7HD551hYXYXdvu8D3wuy+dEhSk1/K6G39UkwsKapGNFGCdKjBMlxtVUOq8SPTLggzXZ8HJNDfbzuQ/2d/0A9MWBrvcLeZk+L9PnawZo72DPHIKBOBSH4QOePcL9IzFI/0e5JsKKRlNqJod6O3xqzY1R/xprXWOta6x1zU24Gbe4d1e4xs6fKlKdJVKdJVKdJQpMFa3OqpmhnZnsflCbj2h/lvPfYjYeDVdFg0SJK0WJ35cy86ulfP6GSLDBjr/Nzr7Yzn7Grp1r174t5263Y1+yY9fYlQ1245/twoV2YaNd93k76xI7aa4dc4sd84Yds8EuuccuabQLXuT9v+X9X+H9L/P+4v9UOI3HL47+Rbx6jCW/k7GWlM+VpZ4RE55z7Xm8Ks+95t7rYZnouUzmelnM2ixzPSMHbmZtq+z1jOz1jPg1i+VviFOtLF8kFr3O6rx4s1q8Wc3yDeJ1juUdYnZOzM6JJ6+z/kmx4Emx4ElW7mHl14qaR/Zakv2uSPv98IwM9owMtkQGe8be3GxvbpbBltifj9mfm+3Px+zPx+zPx2SwJdmfe+963ISbwzJRfZmovsze3CybLZHNlojwy0T4ZfbmY7LZM/bmY/bSk/z+SX7+JJ9ulU9y8kmO37bKKTm+2spPX+eXs/jlLH45iy+28rXVfG01X1vNt1r5Viu/Ws2vVvOr1+WiHJ96XYZ7hk89JsMtkTmW8Y9Z/KOVf6ymIBfygxfxCoX2ZnjOTK+VHRr4wmdF82bRvJk/vGNWW8xqvVmt5xPPityrzOxbInWzmX3LzL7FNzbxjfWicaNo3CgaN/KRD/KRblG2IMoW+MoKfrJOZK0TWetE1jo+s1Q0XSGK5kXORhGxQURsMOtrzfpas71WBGwQARtEwAYRsEEEbDCza0W9BlGvQaRrENHyolhBFCuIYnlRrE4UqxPB8iLYChFshWi1QrQqiE4F0akgOhVEpzrRqU50qhOdVohKBVGp0BuV6kSjgmiUF40arc5bIkuzyNJsld6yQm+JLqtEl1UiyCrRolm0aBYZmkWGZpGh2UrVW6l6K1UvKqwSAZqtVL2Vqrfzm63UW3Z+gx3fYMc32PENdnyDHd9gx9fZ7XV2e8FuL9jtBbu9zm4v2O3NVrHeLm+2y5vt8ma7vFlNvJE6LurqU8Pe6GN2WbHO+qEdNd2Omm5HvWqdp9g1u6zrbOtaa11r7ZY267rGuj5lTZ+ypk/ZETvtgp3WYoq1mGIH7LQeU3j8Tl4+nZdP5+XTrcUUXr6Tl+/k5dN5+XTevMt8PWWenuLNu8zVU+Zqjblaw6t3ma81PHmX+ak1P7Xmp9b8rOHNu3jzLnNUa45qzc9TvHcn753Oc3cZc60xvhZu4bHdRrDQ2Ta2bw+P881V0UAj2+ZsnZG1GlmrkW0xqjpxoM3I6oysjnXbWFfHujrWbWNdHau2sWgbi1pZ1MqiVtZsY8021rSyppU1dawo1rKt0RF62q6nFXpap6d1etpoDos1ar3euvRWr7d6vW3XW73e6vW2XW/15mKrudiq1+3mYquet+t5nZ7X6Xmdudiq9+163673dXpfp/d6vRfrw3VqhFXi5baw2KgX67lLj81i2fMi7nIRt1gfPFuKuClPdfXWUG29/4fpI8VfhyzNXIs7ze60lM6Ktd2e0jxW9L611Vm79pdpv5MaztO07WZ4t3FmzESECpo0hTQGOR+CmWGLNlaVVqbB002ySNHGrmiINt5w5znzt1VbL3hi/d/q+1K+icSXNCqRCS8Y1XlG8z3zuNU8rjKPq8xjsb5eZf62suEFNrzBhjfY8Ia5/Pu6+1Ac9r76e5DnB9uLQxxnev5B14o1d5kxx9EA9nWyqZNNm9i0qfcbnA7Wt7Krg10d7OhgRwcbOvTdqe9OfXfqd5N+N+l3k/426W+Tvjr006mPTdFgrc83+j8Z+Vvvi7I58/yknnaUomqm9C9Fru9dyxVGP6L4L3r+Fn2M+C29ztfrfL3O/3cjTzHSDPJcMcoMcSxGjJme/ceIUVXKotvogF1q65R1PT9c0fuvOxbr+VulfzF6CrtXefJZq1anLljG/pfM0tz3RZBiZsibqZnWuph315utmWZrpvG8pNWbtPaUVayj3ZaZwZlmcKaVrDOLM+2IvB2Rt6J1xveSXZE3xlXGuMoYV1nVOhpsGQ22jN5a9g+RI2+V66xy3b9FjkHaGBxmGvtLxr3KKteVosehZr3JrDeVvo3YLorsCq+xerOZb2LxZhYXv8PZbLabzHYTKzezcLNZbjLLTWa5ySw3meUms9xkhpv0tNkMN5ndJrPbZHabzG6TXbVd1N0t+/EeHrY9vBSVy4K7KaVdUYIaedNZp7MN0SBnsRpmJ30S0yexTNktU3bLlN293xG20Sxb6PidMl6bTNcm03XLdN30+k7Zro1G30lXxDT5TtmtW3brlt266e6ddPdOma1bZuumO2KZrY32iGWabpmmW3bpjqrk8l0seUDujuXsoq5br9fYCj5iBR8pRZUq2b4r0U8k+VBoN4JWT7UnPhb1EWHUPNHJ+slHSe2s1U7xO9edxREYcbb0DUJb8Xkz0c9++ljY6XrxW1lPeG91dJCz4ui7jL7L6LtKI7+QVrgkLH3fyLuMvKs06nrHBixBE5phdEbWZWRdRtYVHam3ReZ3u/ldbn6Xv78y13e7XtaZ2+16WKeHdf9WjT9d+sZvnbndbm6Xm9vtf1ehL3eeL30LWKrUze1yva8zt8vfX61HZUa+PRqcqPGpX3iQWoqppZhaitn0Rzb90Wxtp5haKabit2ubzdMmyii2AnutwBNW4Al1ZF91ZPFfRxZVTyvV08quP1I3rdRNK3XTSt20UjOt1Ewre/5IybRSMTGb/khRtFIUrRRFKzXRGqVZ83s9b9PjTj1u09suvb2jt3eio91917xtYOMKNq7w5I7e77D/7wp9jLI7g19/xjzMChvM4W5zuPvfVulp12qdP+84n9J60/H9q7bceR5/W72Vnmnx/Oqw4u9Wsb9ZazFrLWatxUy1mKkWdv+19zupFjPSYkZazEaL2WgxGy1mo8VstJiNFjPRYiZazEKLWWgxCy1moSUaaJwrjXGlMa40xg5jzBljozE2GmMjpVr0ukbjaaQq26jKNmNZSVkWPbDRWBqNpZGSbDOORuNoNI6VxrDSGBqNodEYGkv/i/LoxHeio6Pp0WXhvuj7+AGuCg9FE8Id0URci0m4DmvC9Ggt1mGrZ3aF26Pd2IO92BduLzsu1JcdjxNwIj6ID+HD+AhOwsk4BR/FqfgYTsPH8QmcjqE4A5/EmfgUhuHT+Aw+i89hOD6Ps/AFnI0v4p/wJXwZ5+BcfAUjogFlL4eXyl4Jz5a9itfwOt7Am2Fh2Vt4G3/GO2Fh8sFwR/IhPIw654uwGMaa7EEIt1fsH+6r6BumV1DZFVR2BZVdMQAH4xC0hDsq2j2zGVvCHanjcRpGhftSo/Ej/BjjwkOpq2HeU7eF+lR9WJhS8aSHhIXpY3FceDZ9PE7BR51/EheG6emLcEm4PT0Ns9Di/F2shjVLt4aH0m3ocK/L+Y5we2V5qK9MIIkKpEApVlKKlVXIoBpZ1GA/9MH+OAB9cSBODwsrh+I7Pv/AcYrjo45zwrOV20N9lbaqDqSPL476hkXRgRD9ooPQHwNwLI7D8TgBJ+JL+DLOwbn4Cr6K8/A1fB3fxLdwWXiA5z7Acx/guddFY8PMaByuxjX4CSaEObx5Dm+ew5vn8OY5yV+FRcmbcDNuwa24DbfjDtyJu3A37sG9eNB7D+HhMMeqP1CxPCyqaMZK/BUtrq933IB29zdji2v7wqJUCmlUIYODcQiOwRCYh5R54B1zUqc6nuZ4huMXcDEuwXdwKUaFB3jOAzznAZ7zAM+5judclzLelPHyoDmVPy7OTXRHqI/uxF24G/fgXszGo5iDx/A4/ox38BfUYREWox4NWIJG5LAUeawJT4sJT4sJT4sJb0fb0IXt2IFu7ApzxYm54sRccWKuODE3uTHUJ1vRhk1oh+okGaMDW9CJrVCxJLtQfK8HIcy1355OiwVpez9tr6ft9bR9nj43vJ3+huP5uNAzF+GSMDf9Q+djMQ7X4Ce4FjfgRthvaXOUNkdpc5Q2R/bT3PRvHGc5znWcD/OQNg9p85A2D/ba0/ba0/ba0/ba0/ba2/ba2+lNaEeHd7tcNx/23dyyD0fJ6ICoAimkUYkqFH+9uxrZ4k9MYj8MjfpHZ+CyMJGPT+TjE/n4OD4+ko+P5OMj+fhIPj4yGq+FCWE0Px/Nz0fz89H8fHT0s6hP9HNcjxtwI36BX+JXuAk34/no8OgFrAkTrOgEKzrBit5tRedY0TlWdI4VnWNF50TFX5DeFSZZ1UlWdZJVnWRVJ5XdH5aWzcAD+DUexEN4GL/BI5iF32I2HsUcPIbH8QR+hyfxFOZiHn6Pp1GLP4Sl5SdFfcpPjvqXn+o4DGeHieVfDFeVfwnnOR8RppaPDKPKf4hRYRTN9qXERWEs3falxHccx4Y/J8aFhkR9VJFoiPolGqneparyZVEmsSbMSaylRdZFxyXWO24o/jaQ46aob3JsdEByHK7GNfgJxmMCJuJaTMJ1mIwHw2jxYrR4MTq5JOqTbEQOS7EMy5HHChTQhGashPnk7ZN4+ySxZmLFAWEpr58gxoyu2BRlxJeJ4stE8WV0xZ7ogFQCfCvVFwfiaBwfRqdOcDwZH436iymjUx/3eVSYKH5MFD8mih8TxY9x4sc48WOk+DEyxZdSE8CXUveFpan7S/+Dfmn6AzgcR+BInIxzwxw7bYKdNsFOm5QeE/VJX4kpmIo7MM31Bx0fjg63myaln/C5xfPvYjX4nJ1zt51zt50zx86Zk94cVaVjdHi+y33+ZwdNSndHfSr7haWVB6E/BuBgHIKBOBSHga2VbK1kayVbKwfhKByNwTgG39PWZfg+Jjm/DpPD0qqysDRzQbgqcyEmhVGZybBvMvZNxr7J2DcZ+yZj32Ruwa24DbfDeDN34i7cjXtwL6ZhOu7D/ZiBBzATv4b5yTyEh/EbPIJZUZ/qibgWk3AdJsPcVpvb6p/C/q62v6vt72r7u5qd1eysZmc1O6vZWc3OanZWs7OandXsrGZjNRur2VjNxmo2VrOxmo3VbMyeGPXZrwoZVBf/KkpisZ2yRjQqfir+9siA8mtEs2zprwukkEYlin+tMINqZEu/YJ8VzbIUQIECKFAABQqgQAEUKIACBVCgAAoUQIECKFAABZHvQJHvQEqgjRJoowTaKIE2SqCNEmijBNoogTZKoI0SaKME2kTJy0XJy0XJy6N/DXE0AiPxQ4zCaPwIP8YVGIMrcVUYIaJeIaJeIaJeIaJeIaJeIZoOF02Hi6bDRdPhoulw0TQjmmZE04xomhFNM6JpRjTNiKYZ0TQjmmbk3WZ5t1nebZZ3m+XdZnm3Wd5tjorfd8zBY3gcz0eHiLyHyL+x/BvLv7H8G8u/sfwby7+x/BvLv7H8G8u/sfwby7+xaD1GtB4jWo+JNqhlN6IVbdiEdmxGjA5sQSe2hmki+2yRfbbIPltkny2yzxbVx4vq40X18aL6eFF9PE2fp+nzNH2eps/T9HmaPk/T52n6PE2fp+nzNH2eps/T9HmaPk/T52n6PE2fp+nzNH2eps/T9HmaPk/T52n6PE2fp+nzNH2eps/T9HmaPk/T52n6PE2fp+nzNH2eps/T9HmaPk/T52n6fNlXo/5l5+Fr+Dq+gftDTibKyUQ5mSgnE+VkopxMlJOJcjJRTibKyUQ5mSgnE+VkopxMlJOJcjJRTibKyUQ5mSgnE+VkopxMlJOJcjJRTibKqSVq1RIL1BIL1BIL1BIL1BIL1BK1aolatUStWqJWLVFb9pcoU1aHRVgcZWSxrCyWlcWy5UOL/0fV8XOOZ4fJstm5stm5pWx2UWgvvwwjZLf3ZbXy0aFdZjtTZhsps50ps41Ui9+WuCo8mZgfXk28GO2XeEX2W6yeb1CnN0YDZLk2WS6RWK6+fy/TVch0g0u/Mdnm+iaZZ2yUleWyslxWlsvKcllZLivLZWW5rCyXleWyslxWlstS0m2UdBsl3UZJt1HSbZR0GyXdRkm3UdJtlHQbJd1GSbdR0m3JaSFOTsd9uB8z8ABm4td4MAyXOYfLnMPVXbXqrlp1V60smpFFM7JoRhbNyKIZWTQji2Zk0YwsmpFFM7JoRhbN0JkxnRnTmTGdGdOZMZ0Z05kxnRnTmTGdGdOZMZ0Z05lxcntoT+5AN3ZiF3ZjD/bCnpCZx8vM42Xmy2XmnMw8Rv2XV//l1X959V9e/ZdX/+VVCQVVQkGV0KZKKMjgwyvWhlilUFApFGTyy2XyyyvYVMEmGX24jJ5VNRQqepyHEKcilKEciSgr02dVFAUVRUFFUVBRFGT+rMyfVVkUVBaF1GGe/QCOdu0Y50Mg1qoyCpTBcMogmzrJfT5IHRyo6ihQCMMphKzKo6DyKKg8CiqPgsqjoPIoUA6XUw6XUw6XUw6Xp8TRlDiaEkdTV2EsxoUR1MQIauIKauIKKmK4ejZPSeQoiVzq16VfZOqfmoc/lH6VqX/qDcf6UEtl5FLWUt2bT3VH/SmOHMWRozhyFEdOLVyrFq5VCy9QCy+gQHLq4QXq4dr0GVFGTVyrLojVBbG6IFYXxOqCZipltrogVhfE1MoYamVM+tuhPX0xLgnj1QdxepTP9lT6R/gxrsAYbV4J41I7NKsdYrVDrHaIKZwMhZNRQ8RqiDj9K8/fVPpVwZjqyagnYvVErJ6I1RMxFTSeCspQQYeoK2JKaDwllFFbxGqLWG0Rqy1itUWstogppDEU0hgKaQyFNCa9VtvrsB5ifVqsp5qmUU3TqKbZVNNsamk8tTSGWppNLY2nljJq/bxaP6/Wz6v182r9vFo/r9bPq/Xzav28Wj+v1s+r9fNq/bxaP6/Wz6v182r9vFo/T3XlqK4c1ZWjunJUV47qylFdOaorR3XlqK4c1ZWjunJUV47qylFdOaorR3XlqK5c5Sls+ihOD7WVQ/EdbX/P+WX4Pn7g2uWO/4oRGIkfhzYKLUeh5Si0XOUU79zm+qOenRMWVD7m8+PYHvJVUdSfgstVGVvVgaG26qAok/l6WJP5Br6JC8K5lN25mW/7/JPQnhmPifib0pvq8/W4McpSfFmKL0vxZSm+LMWXpfiyFF+W4stSfFmKL0vxZSm+LMWXpfiyFF+W4stSfFmKL0vxZSm+LMWXpfiyFF+W4stSfFmKL0vxZSm+LMWX/f+o+LJ/p/gOim4Nnyy7JDqn7NLo62XfjX5S9i/R58u+F32y7LLon8vPji4oHxF9M3F++GzigvCZxAthduLFcE5idXibNuyXEOES68MdiY3hzURrdGiiTb21KeyIjohu7XkteiIsiV4PS7T+qd5fgz1N6ydq/UStf7psRNght67Ti2pOVXZ+GKqXM/UyLrEgzE8sxIs97YmXwzNy3PLEq+GNxGvhVr3/XM87E+vCBr0P1fttek/o/dd6fy2qTCwKsxL1bFLJJ5aE7yUaw/OJnLeWhSZZcSWd+kT4E9v+5MlvyZ2LPD3N0xMTS3p6PP2wp78ojz7jjWu8cX/ptx0/wtpJsvkHZO8vlp8jk48II8p/FCXKH6eTXwv/Uv5mmF6+KvpY+XYZuV/UJ/GR8NvEgigrS3/ECH6vpzfVo4nEErXm0vAHWbpC6z1GlJOpJ/Zm6kRvTZowsg2JVqNqc31T2Fz2z1EyPB9VIIU0KlGFDKqRRQ32Q58wP9ofQ0NTdAZ+FuZFP8f1uAE34hf4JX6Fm3AzbjWHz4eG6IXQUFYemsoSSKICKaRRiSpkUI0a7I8D0BcHoh8OQn8MwME4BIfjCByJQTgKR2MwjsEQHIuvhpVl5+Fr+Dq+gUm4DpMxBVPxU/wMP8f1uAE34he4PawouwN34i7cjXtwL6aFFeUnhXnlp2IYzgvPlf8yFMp/FQq8/Hyr0s7P9vKxeVainY99hY/tTezo2ZjotiN2hnRiV093YndPU2JPSCX29mxI7AvDEj2uh3BIsqJnYzIVPptMh3Sysqc7WdXTlMyEVLK6Z0MyG4Yla1zfz3Njw/PJcbga1+AnGI8JmIhrMQnXYTJ+E5qSj2AWfovZeBRz8BgexxP4HZ7EU5iLefg9nkYt/oBn8FxYmXweL2A+FmAhXsRLeBmv4FW8htexJMxLNiKHpViG5chjBQpoQjNWhnkVe8LzqQT4b6oizE/1dTwQR+MEnIyPhqbUxx1vDitT92K6c+NM/dZn40kZT8p4UsaTmuvaPDyNWjyL511/AfOxAGxPsT31Z5/fwV98rsMiLMYyLA8rUgX3NmATOrEV29CF7egOK9P7oQ/2xwE4OKxIH4KBOBSH4dTQlP44xoR56SsxBVNxBx7Ew6Eh/YRjd5hXeWxYWXliaKr8sONJjufiKz5/K6yo/J77l+H7+KXr012/D/djBp7AnrCiKgorqw5wtL+q7KuqgTgsNGW+FwqZkRiFH+EKjIX9nrHfM/Z7xn7P2O8Z+z1zC27Fbbgd7M3cibtwN+7BvZiG6bgP92MGHsBM/BrGmHkID+M3eASzwrzqfwqF6i/hyzgH5+Ir+CrOw8TwXPW1mITrMBlTMBU/xc/wc1yPG3AjfoFf4le4CTfjFtyK23A77sRduBv34F5Mw3TcF57Lnhjm7VcVntsvg+rwXJSUK+aJ/G2JpdGHxeW90T3RhDAjmohrMQnXYVcoqJ8L6ueC+rmgfi6on2P1c6x+jtXPsfo5Vj/H6udY/Ryrn2P1c6x+jtXPsfo5Vj/H6udY/Ryrn2P1c6x+jtXPsfo5Vj/H6udY/Ryrn2P1c6x+jtXPsfo5Vj/H6udY/Ryrn2P1c6x+jtXPsfo5Vj/H6udY/RwXf4Wr7E/sfDO0q1nb1aztatZ2NWu7OnS6OnS6urNR3dmo7mwsnxU2lv595Hv/6ujd8u7wrmyWl8VmJBZHR8iXLTLYzWq4GWq4GWq4GWq4djVcuxquWD8V1E8F9VNBzRSrmWI1U6xmitVMsZopViPNUAfNUKfMUJPMUEPMUEPEaoR2tUGsDmhXB7SnTwiF9Iml3+Nsp/2LWr5AZxdo6wItXKCBC/RvTP/G9G9M/8b0b0z/xvRvTP/G9G9M/8b0b0z/xvRvTP/G9G9M/8b0b0z/xvRqO73aTq/GNGp75ThtT/H50eKvpoWY3ozpzfaqfvbTBWE6jTmdpmykKRuzk8LG7HWYHDbW9Avv1hyE/jgCR2Kq64+Ed6NyWeV38jodl3ghOj0xP7o48VJ0auLl6GDz+2ziVUrqtejYxKLoXHN9rrq+gmL4lNq+byIXnWLe/0o5HE7nrHZ1TXQCvXAuvTAksTE6S7uv9n6XfaKeXglPeP6uUp/z3BtJVcyP9nPtbWeLi79L+f/+lm7ZiGjYv/97uuw52e74pF6/LB9+kQ3vXTlZtux29bOy5XzZsq30G8Wbin+N0tXDnH2q9J3iAM8ew4bi3yJYH33IEx92tjgaZoT93DvcWIu/+nZBqEuMjYay/9XkmfRauStvOXvH03ITTdjhbKWzUVGNs93O3oqOjZLRsKgCKaRRiSpkUI0sarCfHs+PDkpcSONdglHGNJ8OfJnOfCU0JMdGw5LjcDWuwU8wHhMwEddiEq7D5GiYWn6Ymn2Ymn2YGn2YGn2YmnyY+nuY2nuYentY6e9f1FC3XXpaaRTrEy9ZyeJfM3kl/JG63WTsY83JC+xa6CmjNfaaqG9ZfXR0WUN0kpm5xDx8LnGhpy6KLkpcUvqNuYsSo8IrxV8lSlwdVifujU5LTIs+rp/YSh9DyTyVPD06JTk0OslsXRQd7o3D9XOq1RwbHamnzcX+Sz3V9P5dkzcT3/b2xZ6/1PG7jmN5WH1YQSO308e7Sv6zLKr0ViJKFf8Siqf7e7K/J6s8GXuiI+ofrRFFaahoHd10pZ6Ka3p1aKS72616HxG3odRezgou9ZY2i4q4om/Yq4bfq4bfq0beq0beq0beq0beq/bdq8/zw8bi/3jS4gl2SrrU2tLQFQ34uz6/LWZditHGNpYSXxw6WddhHDGPO0jf2731hn6r9bvzP+23Wr+ri3+bRWt99Vuhxe1abNdilxartNbZO4q99tn5rhZ/L/DblPyluNKdsdEh3qxiccqbO7y515s1bOkpzpo399gVa6IvRGuxDrt49m7swV7sEx3OV7lcEE5KfFu0uDj6TuJSx+86jlb7XMmeq8MjiWv5xb3RJ/jDJ814vR6HltZmSZhZ6i0Xltlz/VQ5u3t95JSktpM9CNGxFX2jL6QvxEW4JDo2PQ2z0OL8XawGO9MdrnU57mBb8fcfO1i2y5h3sewE497FshOMe6BxFyNGpfFmjHVDYnm0f8nrFnjjVW+s9cZAb6z1xkBvfMLT+7N5fcnzloQ97N7pzbWlt3Klv0twof4u4smXOH7HcZyouDo6SsTrEGMyIuMhIuMB4t2C0l/UKa5fwVMJVzqsw/k+XVDaG8Vfw+ufuIpXXSPfrWf3Rj22hrjkby3eW+u9jNYrtVzuTiE6JLosdEbfxw9wldU/33peyK5LMI5nFp9ew0vWm+kNbGpVX7ZpZZM8eWY0oGL/0FnRjs2hMzUKo/Ej/BjjcLV29+v9m0B5LRe0XEhcZVTjxPzV1nENL1prB5VGKw5vNEet4S+lWnwA+/awbw/79vSOvvid8iqtrNJKuVZOYOP+WunWSo9Wir80X6mFd4t/j4h9e9i3h3172LeHfXvYt4d9e6IPRZdFX46+jx9gQjQ8mohrMQnXRcP12EePHxSzKszweWJWhVk+T8x61Ew/baYX8tM3+ekXi3+1PfF4uMOY3pEhhrxnjbxVtGYjNXF6NJSPDk2eGfLJB6PhyYfwcDS8Yv/oyxUtju2Om7ElGp46HqdhVPTl1Gj8CD9G0b5KVu3o9ZvyXr8pL61VcQZbw4bStxFPsXt271P9e5/qz+7Yk6eUvoFoDY08Y1TPa2rBzWq/FrXeZrVdS/K4nnV8bVRP7GqHKx3J48KntDqqZ1Vih3ne4+29YsO+sChZEbrVhTuT1aHLk4s8eVbp3VfcbXClwZVM6d04sVt/e8zKvrBUjdmTrIpS3u3x1FK1ZI8nh4lLo3rW66VHldrFsvbELsc9et3LM997c69ee1SnXSxuT1Y6ZlhR7fp7Le01gu28bpS6tjsq00qHVnq0ErSwsdR3Kirzdoe3e7wdvLmx14bji/PUczsbVnv7aG83eXtHYrcdW7R+Lz/ex+N66IQQ9rFltdaO1lqT1nYkq0KuNKpq65yN9lcpt2l5H5ueLGbRUK7FnexYmeiJyr21U98rkzU+HxcGFZ/oWeyJDforzlTBExu0WZylgja2mN1/WC+r37tO3v5P1qf0bGldPPufrIcx/g/XQTz9L86/KPO/PO/G+B/Md+nOvzvP0X7JflFV8iD2HRxlkgO1dqh3DqMZPuDz4e4d4d5R7g12fox7Q9w7Vj5IJvvr4VB3j3Q8xppkk/2cqSGSA/Q/UA+H6qnY1uGuH+H6INcHu36M69qxCsWniz0f2vtEsadiW33ZVe7uumR/Vwbg4Ohw9vX15DptHs6+cvaVe2td8kj3B+Eo1wd75hjXhvh8bPGvkmtlJVuLIyxPHsLWgVFFbyvFt1eyvzjC8uTR7g127723y423Hw7ie/3ZfLB2BxrLoVb/MH19oDgu949w/0j3j3J/sGvHuD/E/WONzyiszUHa7e/qABwclrGhx+ysTh5mLT9gzId75gjPHOn+IBzlmaM9M9gzQzxzrMxWXKdsaV4PjvqxozhjO9nRjx3V7MiW5vYo54NLM7iTDf3YUF1clShRGvvA3nl+z/ri7CVK437vjY5eq8ujPv9dn7BrY/P3D35ht38kqvmv+oa3TorS/5F/uHtMdOD/lo9o7YNG/d/0E28fFx3wP/UVrZxeHNH/jr9YiT+X1vG/5TOl3FDzX/WbUlQ/LrGjp1UkvVTEOUxUOyexu6dDVPt8Ym9Pm+hzmah2pKg2NFnR0yqiXioaHSaqnZOs6ukQ1T6frO5pE5kuE9WOFNWGJvv1/B/qvgO+imL7/8zM7szem9kkJAGS0DsIKCBFKQp2RR767CCCFQuoDxERKYKNpjQFFKQIqIAPOygo2FCxK1JEOtJ778z/O3NvYmICoT39/Xc/O5mdPVPu7pnvfM/M7ske3JHquCNVcEeqeOk4zzDVcEcS0aqauCsVcVcqeCWRXgpypSFTBkdZnJeDXHnIVYBcRchVgtZEYLlp2FznC/t/fT6nVLDdNDDd8mAV54ArzAbbS3L/W2g6u4UasDZ0CbuV+rHb8Pd2WO7XmZHietgiN5jpYB4j3X+qq3IMqdlOyv4PpAUuNevsrewzDkt+JvvEvOVi9r/brUQsCVZydSKqD5v0DGqCvQY1pWuoJl1PNyD1JnC5hnQ39acr6DmaRA/QdJqJs0+wD6JvaD4NpoXYR9MSWCdjaC1KnMiKsWL0CyvJqtNcdiVrRqtYc3YtrWYt2M20kbVmrWkLu5XdQVtZO3Y/7WQPs+G0h72EPZONxF6MjcJenE1kk1gJ9gn7kZXiNXgtdhavzeuxWrw+r8/q8vP4+awev5BfxM7ll/BLWAN+GW/KGvJmvBlrzK/m17Am/Hp+I7uIt+Qt2aW8NW/NLuN38DvZ5bwtb8ua8nv4/exK3oF3Yv/mnfkz7Abehz/L2vIBfChrx4fzF1lHPp6/zTrxd/ls9iT/is9nw/hCvoq9xtfzjexdvpVvY1P5Dr6XfcD384NsJjeC2KeCC8E+F0qEbLZIEinsO5Em0thPoojIZD+LMqIsmy/KiwpsoagkqrBFopqozpaIs8RZbJmoKWqx5aK2qMtWivqiAVstGonz2FrRWDRm68UF4gK2QVwkLmIbRTPRnG0S14ob2VbRQtzOdol2oj07IjqIRziJrqIrl6K76M6VGCqG8UBMEVN4VLwn3uMJYpqYxrX4UHzOQ/GDWMDTxUqxkZcVe4Th1TzfS+R1vTSvMm/sNfIa8eu8jt4z/Hqvr/c+v9f7wJvJh3rfez/yl71fvNV8jLfOM/w9P+pH+Xe+9jX/3k/2U/gP/lz/N/6zv9hfzhf6q/xVfIm/xl/Dl/rr/PV8mb/R38ZX+Dv8HXytv9vfy9f5+/39fKN/0D/IN/mHpc83SyUT+R6ZLJP5EZkiC3Mj02VJIWQZebaIyjqyjigh68lLRUnZXF4nzpKtZC9RVz4pnxY3yz6yn2gtB8gB4jY5SA4Wt8sX5AviTjlMjhR3yTFyjGgnx8lxor2cICeI++Vk+a54QE6VH4nOcpb8TPSQX8qvxBNyjpwnnpIL5EIxWC6Si8TzcqlcJl6Qa+UGMUxul4fECEWKi9eUUqXFJFVR1RZfqHNVIzFXNVaNxUJ1obpU/KauUP8SS9XV6mqxSl2rrhV/qOvV9WK1aqFaizXqdnWH2KTuUfeILeo+1VlsVV1Ud3FYPa56elw9rZ7xPNVX9fOkGqCGe4F6Sb3kpaiRaqSXqkap0V6aGq/Ge0XUZDXDK6o+V3O8yupnNd87S/2udnh11C51wGumDinjXRtUDCp6NwaVgzO8m4Izg7O8m4PaQW3vluDcoL7XOmgYNPJuDRoHjb3bg8uCK7w7giuDK722wb+C5t7dwTXBdd69wU3BTV774PagrXd/8EDwH++hoEvQxesUdAu6eY8Ejwe9vM7BM0Ef77GgX9Df6x4MCAZ4jweDg8Fez2BoMMLrFbwWvO71DiYHk72+wZRgitcv2BHs9PoHu4Pd3nPBvmCfNyAC4PMGRryI5w2OqEjUGxLRkaLesEhGJMMbFykWKemNj5SOlPZej14TbeFNjLaJtvHejt4RvcN7J3p39B7v3eh90fu896Pto/d7U6MPRh/0Poh2inbyPox2iXbxpke7Rnt4M6LPRN/wZkU/iX7trY7Oiy72tkSXRld7e6L7EzK9IwnlEgb6pRMGJ4z1n0uYmjDTH5XwY8IO/zWtdLr/ra6qL/aX6Bv13f4+fZ9+UEZ0B91RJulOurNM0V10F1lYd9VPySK6t35OltYD9UBZSQ/Wz8vKeqgeI6vqV/Qrsq4er9+Q9fSb+j3ZWE/TM+Ql+mP9sWyqZ+lZ8kr9qf5aNtPf6V/kdfpX/au8Wc/XC2UrvUgvk230Cr1N3qV36n2ykz6gD8mu+khIskfIQy57hV4o5RNhEIby6TA5LCL7h+lhuhwSZobF5fNhybC8HBZWDCvKUWGPsIccHfYMn5Jjwt7hs3JCOCgcIieHL4RD5ZTwxfBF+VY4Ihwh3w5fDsfKd8Jx4WtyWiJPTJQfJaYkFpVzEosllpA/Ju5NPCB/IR4FfyfSFxS6iipTaTpNm5luVpk1VMOsQ/z3fCWOmBHmTexbTV+cXWVaIs9sxNbFr68zGxCuiJ/tyZPfXt1gdmH/85rKp56dOJ4vsL2P4fg4V8pS1FDE1nLUDZYX5H4zBxHXGMlvphDnq3K3MevX5FPnd2a52WK+Rwkr8WvXFtTG49gClDo0XvofZpOZbVbHz3bkqX0jjiVmmZlr9pkrKIJ7dwaVyXH9SEGVmd14drtQwp8tx/0HY4ldnWAmkMaR/Qz/knszjtVmEcpYilMfPKsinYdYKXf1C/ODmQ/9ge7Abs+//knmFTMKf3vjON+caR42HRHLcR+zfj1im/LkPmK+NGuhQV+ab9EOPAd793Lnypb9roBbQbBTiRJd7Ll4yhaU/X2WbubUinjKLvzyHbj3v5ud4PtJSKqNp5Bdu9nontDGLOk8+TeZ9ehjW7LuuJ0ZdX8X55QpqN1xuUW5zv6T6+zr4ysDW00nH9c0swDPLzALCqh5b46+XZPOKUD6DfO67dHmy+NuU+78a6x2WJ3Nc2XeceTGLzNPu9jUv/Znc9tx5IeOmPccbi21z+1ENzPRoelE3Ne8W3BcJWw10x1qHqde5FPCjuPXqnxyxxHW/HJSud9y4QKLHKd9O/s46l8TG8vMQejRzhOuQR/zaiUc/3a1ZI14K2J7/HqpfPJUwV4Ke5VcrXw1/vfH2H6M/DXzzR+/u9CS3UCn3UdrMPBzs9kOBFvu+pTV6n0ufYi7XNJ8YmaaX+2IfpT8h3LE+1EG8P8Gam57SDxtCcaGGXmxODvPwRzxgRh5kuhyaoP4lHjaKty9n48+qmbV7zT6ReSPAH06xJHcpr9j3iRhph01/1+10Ad7aov0Z+PXvzZf4f5/Ez/Li98HcsT7IncGNSPLhM6Pp31sPkQJ/z1q/X/kn34ET8zio7na/MvcYZrHpUfnyd8LKDbB/Nf8ZH7NkcypFT1B/RF7jgbYb2boDWjuFJoGdjiDZlItN6tQlz6n+VSPfqPV1JTWMkY3sjasDT0Ei/7f1NHa8tTJWvH0CL+Xt6dHYY8vpG78d76KuvN1fB09wzfwjdTb2ubUl+/he6k/P8gP0nPWNqcB1janQbDNE2iIKCVK0XBxs2hFL4o24lYa4U31ppK1ag2N8lP8FPpOvi/fp+/lx3Im/SB/l4vpJ2mkoV+sTUdzrU1HC9VV6mpaYm06Wgab7gZabm06WmltOlpnbTraYG062mhtOtpvbTo6ApuuHyNYc4OYVEPUcBaxNh1LsjYdS7Y2HSukxqnxLNXadKywtelYRdh0O1h1WHOGNQ9E4LOWQRBE2S2BDhLZrUGhIJXdERQOirK2QWZQnN0blAxKs/ZBuaACezA4LzifPQSr7U72MKyz3qwzrLN+rIu1v9hj1iZiXa1NxLolPJYwkPW0lg4bppN1Opuh39BvsC/0Kr2Nzba2BptrbQ32m7U12GJra7Bl1tZgy62twVZZW4Ott7YG22ZtDbbd2hpsl7U12EFrR7BD1o5gh60dwXliJDGBq8TCiUV5NHFf4gFu1xQWOI1hTmM4NGYoLIph9BJ0egSNR8oE7IpepUkYpSZDn6TTJwl9+gi97mNoVdRpVRRaNQfp39CvlEDzsHNo2Xyw6t9oMdjVElqJPrYKOleG1tJ29Pgd2MvSTtpL5Wgf9vK0nw5TBToCjSzkNLKE00jhNFI7jdTQyHaUzNtDL7XTyxTo5RIqwpfypZTKl/EVVJSv5Cspna+CvhZ3+lrM6Wu609fCTl8znb6mcsMNpQrQf0qD1nKE2KgwdFchjodPGSICPU5zelwMenwzVRStoM2VoM1tEL8VOl3J6XQJ6PQSYt5SbzVxb423lqS3zttCCd5WbxeV9HZ7eyjJ2+sdolLeYWh/Baf9ZZz2l3DaX8Jpfwmn/SWg/RdSmrpIXUQJ6mJ1MXnqEvQHH/3hCqQ0VU2RcqW6kpRqpppRoP6FflIO/eQq5L0avSXiekuCnQGhUN2APpOIPtOSyqibVStKUreoW6iCao1eVMj1okKuFzH0ovuQq516EDL/UR2Q8pB6iLjqqB5GLZ1UJ5T8CHpaAnraY8jVVXVFejfVDfLd0fdC1/eYnU+BTG/VB/X2Vf1wdYAagJSBaiByDVKDIDNEDUXKMDUMLRmuhiMF/ZOitn+inFFqFHKNVqORPk6NQznj1XhITlaTkfKGmoK8b6o3cR/eUu/hzryvPkQ7p6vpuCcz1Ay06nM1G639Us1BmT8raKaap6CTaoFahNJ+V8uotFquVuGe/KHWoa71agOVVRvVJtzJzWoLlVdb1VbUuE3tQJt3qV2Q3K124+oetQfpe9VetGSf2o/yD6gDKPmgOoiSD6lDlKoOq8Oo/Yg6grxGGfv/VQOfSlg0QQg0QQg0QQg0QQg0QQg0QQg0QQg0QQg0IQY0eQZh76A3cYsp5FlMIWYxhTQwpSvCbtEelGyRhQSQZT7phAUJCylM+C1hByVblCFhUYYygDKrKFX/of+gNL1ar6ZQr9FrqIheq9fi6jq9jtL1er2eiusNejPiW/QWyG/VWyGzTW+DzE69E/Fdejdl6j16D2T26n2QOaAP4OpBfYgS9BFtKD20pnWqxS+EXugh9ENJKUCxgIqGkTBKhcOEMAGSOgypOHAtFSlpYRHKtOhGRYBumQiLhcUhUzIsRWlh6bA0yikTlkW8XFgO8uXD8ogD+5AO7EPKy+Eo1DI6HINcY8OxKHlcOB5lTghfo8IWDUlYNKRki4aUDMR6O46GA7ELh4Y+0HA44iOAg8LhoAQKvoH4FPoA4YcEbQMafoL4Z8BAQbOBgwI4OA+IOR/4Ktz8feBwUDgcLOxwsIjDwajDwaIOB9MdDmY4HMx0OKhZEkuikLVgLRC2Y+0RPsA6IOzIOiLsy/pSCJS8mrhDyQhQ8g6EFiUTHEpGHEomOkxM45v4JirkcDDF4WAqP8wPU5JDwGThCY9SgH0B4lERpUKihWhBxUVL9yabxb4SDvtKiVvELUhv7d5uszhYwuFgKXGbuJ2KZePgWhJAwF0UAPsOUdShXqZDvSJ21hb9s4lqgt57gbqAhMO4QF0KjPOAcU0Rt+gmHLpJh27pqrlqjhSLbkJdo65BeK26DpIW4zyHbkUcukUdumUC3dqQVrep2xDerm6H/J3qToRtVVuEFukCh3TRONJ1VB2R8jCQTjqMC9Sj6lHk7aK6QD4L6XogHsO4XuoJxC3SBQ7phEO6qOqv+iPXs+o5pFjUCxzq6TjqDVaDkW6xL3DYl+lQTzjU89TLQD0RR70xagziY9VYINor6hXIWxwUDgczc+CgcDgYAAenIx7Dvo/Up4h/rn5CaLEvAPYtQtyiXmGHekUc6kUd6hV1qJfuUC/DoV6mQz2tdqqdyGWxr4jDvnSHfZlx7DsEjBMO43TAAkYihlbRztFHKRJ9LPoYwm7RbpQQ7QFsSoj2jPZEylPRpyjicIonDE54kbhDnDS9GViTrLfrHZTi8CXZIUsakGUv4vv0fkoCphxBP7eYUigUoaAkoImiRIcjKQ5H0oAgKYhbBEkNi4ZFIWOxIy0sEZZAeqk4dpRBCRY7Uhx2JDvsKOSwIwXY8TLKHB2ORq5x4TjIjwdqpDjU4MRrbbMzr/XWXFiXrqAbj8bz///YzDqz3h7xs+X52V12nsfN9Z1o2X/YGS5neX/izn/PqtOFP8Wtz03W/nS26CKz0qzNPaNTcL1ZM3TmwRNv4endTFNYnvbvUW3vPDnWwdL+6uTnZbLL2fTXM7PdhfF02Iq7cGdXmi04smf2cliiaTlyL4LUQrLzHkURi88wZlnXf9MWzW5Nzno13eTSNuY3u2A25J2bMzvMCvMbruRZhTjZLWuWPPeZ7T9xrc4xX4C2i+z4pqM9ZbMs76zm6dryX8EpMNd4M9b9PeRmw7+2h50fMhMRmxOXydIs24N3mx+z0k+onj+cjq7889zOgpklOSSedfNBdq58mYv9gdbkRKj4/T3e5+tmrVcWLHfiGzQtR7lmjzmE44Cd6zKHc8kda13q/9j2N/f549jMyFPIfFU+5a2kytDBkqdQ6rG3yuSw1eKpw9R8N2DDca8hnvpY8ZfycrUqZ987zvzvmJnmrfj6QJoZbWa61FV2dM85ep8Uf1gIbFzu+MNax00cmtkxySzH38lxqS1uve0bHLOxr809c+2QLIOy5ma/wFgwx/yMYyRSrzBzzbcu/dcYi3Ar2jedeEvztHx9rjM3hpq3c6Tca8aZ9qaPneU3HbJTGyDtA9vv8q46kl1zzbsWusF8gt+y6PT11Cx9sOMYECyLF86h+PpszjYAl7PXRuwaSwElf3+62niyG+5S6P4OsuvNea52NF/kko39XYLRbZXVkJOob57Vese33H2yMYxvy+N3DaG5x/zgnvdeEvmMYSHVyFPmFvSDzfHVJQHkyFp12hu7eurj25/r0LnXK7NYiuVebtz+A/uWPNxzmeOe+fR29ObTjF35bX/Bs7l5rh/6a0o8/T/5p9OJrKOf8GbuOsEMsXcsepun3N+tDgHetQdir5upsZi7lsXP3HonntSHJ9G6d8wHQMz342dfmElk3w+aZuM4gJxAsS+AElkseCvQ99s4TsTWzxLzlPmVed/MipeZZs/i6bnQwZgTb63Lh15qfss+y7JdVthYll0ZY+IO0eZY/Yi9IxLvPzscIrcyV7mzWWRX8x7E8QhiA81wjHWPxEvJ8W4L7sAM0+UkWnur6WZeMe0R+wy9+hXT1uHDsxiNXsF9nmVGmrsxtm61a4Dul003U8yYWM3xUSPTfPaXMtea+bAqYz23TnYszjvN/thx/Iw5V9m7XH/Pfiso9yjlxulsy9cx3+XuvYecb1ycmfuNlb9ry72K695g2lxwS9wvyvP+1d+x5bZk7V2FDu8sCD/d0zltlu6JbDn5B3qDtbIW4O9RVrqzJTecenvNy6aredIMc/Efoe9j7Zsy8XEoxhd3m/dwzDy1elxJNWJvspxSGavMGoyEbnzEM10DPczm3LGnbraBc2zLjwGecF0nwblz5P429lTRFouD38fPlsX7T7zV/0x/zm8zd5k7zUdmKnF31s10Alq3iTECM83sw1l/8x9zrikHHK1tHjH3nEJdMf5Y+pTaG8ekmE2b/b7h2NxXT+dmxp+GMqz2zo+hOvhtnqfvrq80v/w5Cv+zG1rzO/qcm/OEDltLMdtSiTFdXP0Kx1HeVf27N7T3uZw9F/xq+j/ZnqNv6G0dLXeKvelqHgI7+hW9L3Ztlgt/Nx+alqYPYgPM4ljaSdb11am39wRr3JXzPa//u1s2x91x6m9X5veu++ncYuwQ/Hs1Rr3TMGNR0DvKx8x7nBpl3nRz+xtPvqYcW8ZpKeW4NnChU2auZtDpaEkBdcSRDuz2lOflT9NTKqiWVWC2/+Oecvo2sJ5dp+3OpJxCO05Hf/8b1yNORhvBe1bGcsa/7MiaF/nBrTP8cMzM98dl3zrxev/u7WS+gchTxlFXQ46Rx83W25mimCUcm9HJXguOHss+dnO7GdSe5InX6/KfxFdeZq0bO/78lixrTu54bbsEuvTEa/1HtyInm/HEV57IvtVg16WzLXszw4Wbgc8Frkb8X9vA+3cf/ZuJHHL7/vdtOb7t+BDyZEf1fL+VKrAu9wbBn98OuhWLbM2K5pspS9bOVRWnluhz/8CWm7vHUAPWUwE461Zi/oH5PrP9NJa1guIzyvl+cVTFfeVkV9B/zOdqQWXb76hWZOXMirkZ/hXxlKw6G7i6/tKuHGfP/FlmVlvs91p5WmW/yqppV2lOxmo3I82rZnr2d2DxmGUE8TnNH7PbUTNPe1898fpy5T+JN4XML25V4pvsc/cOEPimPO6VvuP4eu8odef7bXIBeda4WSs7kjsscGdfoO/FkCF6LH7pRpQkOu/4vtfMJ//JvP8w135v6Y49sXMXxmfNj40O8d9SPPf7RtCv7eZnd4ykouCk6+OrSctjfdrp2r0n3tICfkdshS2HtW7amEfMa2aU8xuQ/U6PaWreOcGSv/h7GLNt49HrMUfyW1WOrSj+JW17was4J7u5d2TiyGx2gE/sAD9aaBb9iURmE9LsmvE55np3/i40YL5pZWbbczPLPG++tDPm7tqQXGUvyUo/oRY1N+1NT3NF/MzFoIFtXfxVM850gB6MBFubjpHXSkw175v34qO2nZ0vQjXcmnNn086lxd5HHAVe/bJ9HtZLQvZbQLnmgsz+rK/5T6i9L5qJsNVeip/94Ooe6XD+B3cP7OrrW2aX+dQJxL7aj79hENfiOide6z+1/U++xs5by4osxIqtO/9T28msU+FJb6Ycsw7ZHhKOZ+xJJfv+zjUuXpxqw/Ys7fKuButY7UaTYnS2mYceavclZqk5F/2lLWkTG9fjdip6Z8ymKho/fye+UsEp+4tpl/7GMX6He7fCdME4F5+BNE1MaxxNzV2UamJjcJYPjW44LjYNzHUm/mWD+dosdm9L2B67AWPSirj9WpUqu5GzqpM69uxG/u0aa8YhnJh9Pt3acrnerLg2HmlJ/6ZzqJbzE1PBXcn526NHfjEJR/a6kfIjc595145hprt5wsZQat9c1cbeAbvvJNrbzjyA3/+AOwkQa+dw8wk3Uv+MZ7n2SOxL+mnOK0jW5u6seShexnHYePnWvb5gmTx5Nrk3AixPcNrktPkLnHvusj4m37G5kqghWs9pbgF+7FrE/dj1ossZZ4XpDuedrrPzTtfbeafry1qwVjSQ3cPuoeedX7oX2MOsLw1n/dkwmmK909F0652OZljvdPSR9U5HH7NP2Y80i9fgNekHXpvXpZ+sdzqay8/n59Ov1jsdzeOX86a0gHfgD9Ei3pk/Sov5QD6ElvLxfDyt5K/xKbSKT+XTaCP/kH9Im/lHfCZt4V/w2bSdz+FzaCf/nv9Au/hP/Gfaw+fyubSPz+fzab/QIqQDIlmk0CHrYY6M8zBHzsOcL8qL8kw5D3OB8yqXIOqKuix0XuUSnVe5ZOdVLsX5k0sVLURLliZuEa1ZEfutHEu3Xt9YpvX6xs70pnkzWQvr9Y3dZj29sTutpzd2l5/sF2Jt/TQ/g91j/b2xB/zF/grWyfp7Y12tvzfWzfp7Y92tvzf2uPX3xp72d/sH2TPWxxt7zvp4Y8Osjzc22vp4Y2Osjzc23vp4Y5Otjzc20/p4Y7Osjzf2k2wln2YLrHc3zqx3N+5Z727ct97duLLe3Xggx8hxPNH6deMp1q8bT7V+3Xhx69eNl7N+3XglOUcu5FWsRzd+rvXoxuvLtXIjb2g9uvEm1qMbb2Y9uvGrrEc3fq/16MYftd/H8e4BDzjvEchA8ceDhCCB9wqSgmT+RJAWpPGngvQggz8dlAhK8N5BmaAs72M9rvF+1uMa7289rvEBQc2gJh9k/a7xwdbvGh9i/a7xF4LGQRM+zPpd4y9av2t8pPW7xl+2ftf4aOt3jb8S3BW05eOs3zU+IegYdOSvW+9rfKL1vsYnWe9rfHLQJ+jDpwT9g/78zWBAMJC/Zb2v8Xes9zX+rvW+xj+03tf4jODdYCb/KPgkmMu/DuYHC/ji4Lfgd740WBKs5SuC9cFOvsl6ZeN7rVc2vi8wEcb3W69s/JD1ysYPW69sgkUyIiVFaP2xidRI2UhlkRapGjlTFIvUitQSpSJ1InVE6Ui9SANRJtIocoGoGLkocpGoFrkkcpmoHrki0lTUiDSLNBe1IjdEbhR1IvdHOoh60dLR8qKh9e4mmljvbuJy661NXGG9tYkHrbc28aj11iZ6Wm9tok/CtQm3i8n2qz0xw3prE59rpZPEd9ZPm5inW+q7xTbrp00csX7aPM/6afOU9dPmRa2fNi/B+mnzCls/bV5x66fNK2H9tHmlrZ82r6oeryd71ayfNq+29dPm1bd+2rzzrZ82r7H10+Y1sX7avMutnzbvKuunzbva+mnzrtUr9EqvhfWy5t1svax5rayXNe8262XNu9t6WfPus17WvPaJPDHw7k/UiYnew4kpiWleZ+tZzXsscW/iXq97EiUxrwdxthKolwiLL4mSiVEh7IJSMA57lI6x28eoXgHpFbErqoRRMKBqQMkI8LABaeCh/T8P57n/gGERM9EhZhIQ83rkugF7IeBmK5R4C91OjekOYGgTYGgHMIeHsF9AHakzFaZHsRehLtQdNfcAwqYDYTVlsJAlUqb7QrgYSwbmVgfmVkJKZVaZarAq7AykV2VVEa8GLM5wWFwTWNwc4VVA5Iudv9AM1gq4XMvhci2Hy2cDl7sivRt7hmqz3qw3yuwDpC4GpB5AddlA9gLVY0OB2jUdatd0qF3ToXYNoPZExCcBu2sAu2djPPiSfUkN2FfsW2rIvgOaN3JozoHmtRHWAaZLh+nJDtO5w/Rkh+lpDtMvdJh+lsP0cxymFwemT6RSfBKfRCX4ZP5fKsOnAOXLOpQv61C+NFD+I4QfA+tLOqwv77C+BLD+e4Q/APFLA/F/QvgzcL+kw/2SDvfLAfc1VRAh0L+iQ//KDv0rAf3T6QyRITKoqsgUmXSRHQkQx0hAVTASVEJYWVRBLowHVM2OB8hVX9RH2EA0wNVGohHC88R5kMHYgBBjA1Lst9aXum+tL3PfV1/qvq++zH1TfQnGiR50nve49wwxjBYDKckb5A2lc71h3nBK9V70RlF9b7Q3lop6r3j/pQxvivc+ZWJEmUa1rDdRqm3HFWpoxxXSdlxBmOwnUxO/kF+IatrRhWphdPmVhD/Pn0el/fn+fEryF/gLyPMX+r+Rj1FnMVKW+EuQstRfSspf5i+jwF/uL6fC/gp/BSXYMYlCOyZBcp2/jgr56/31lIKRaSMxf5O/GTVu8bdSqr/N30ZF7ViFGnf7uynd3+PvoUb+Xn8v2rbP34f27Pf3I37AP4D4Qf8gnecf9g+j5COSU6oU0qPzpC99YhjhFGGwkAGFMiKjlCQTZAIJqaWmdBnKkBrJRJkIGYyC9r+6y1TkTZOFkTddZkA+UxajFFlclkDJJWVJsh5QyyAsK8uihHKyHOTLy/KQryArQ76KrEJF5RnyDKRXlVXJk9VkNUqU1eWZKP8seRby1pA1UFpNWRMytWQt5D1bnk3ajrioq56sh/RzZH1INpANUEJD2Zh82UReDMlL5CWk5KXyUrS5ubwav+vf8jqU30q2Qe23yttQy+3yLpTTVt5HjWU7+QA1kQ/KjqjxYdmJLpCPSKCHfFR2oSLyMfkYWttVdsdv6SEfRzk9ZU+U0Ev2QglPyCcoQT4pn0QtT8mnIPO0fBq1gAFQMcsAqAYYwCCqLQfLwXS25QGUAR4wDFeHy+GUKV+UwAE5Qo6ghnKkHIm7PUaOQThWvkK1rA9YyIMroITJcjLCNyS0VE6RU5D3TfkWXSzflm+j5Hfku7g6VU5F3mlyGtI/kNMhOUN+BMlZ8hNc/VR+RnXBML5E+lfyKzoTPGMO5L+R3yDlW/ktJL+TP0LyJ/kT2vOz/AUyc+VctPBXOQ9tni/nU3W5QC6genKhXIi84CjItVQuRcnL5DLkWivXorR1cgPkN8qNkN8ud0Nmj9yDu7FX7kXb9slDlGF5DJ0NHhMinqgKUW2VolKpmEpTRamuSlfFqZ4qoUpTTbCcStRQVVZV6HJ1hqpKDVQ1VQ0p1dVZ1EjVUDVQQk1VE5K1VC3InK3OxtXaCrYjuNG5VEfVV/VRVwPVAPINVUNcbaQaoS7rU4BZzkS1LGdCCM6EEJwJITgTQnAmhOBMCMGZEIIzUablTFTMciaE4ExU3XImxMGZqKHlTJRhfdXSmUGToAlygTkhBcwJMmBOCMGcqK5lTlQPzAmWQNA2aEuNwJ8eoKTgweA/kAGLQl6wKKSDRUHy8eBxlNMz6Il4r6AX0sGo0B4wKsgPCAZQ7WBgMBC5wKvobPCqoUgZFkDrguHBCMRfC15DXa8Hr9PllmkhBUyLopZpIQTTQgimhRBMC+H6YDudH+wIdqCWncFOlAPWRTUs60LcBMb+760I0cURFmGUYRkYFQMDUwiDSEB1ItioRiQaiSKuI4kIkyIYfyPJkWSqGykUSUFKaiSVGkbSIml0dqRwpDA1ihSJFEV6RiSDakcyI5lUPVIsUgzx4pHiqKVEpASuloyURAq4HeLgdmgJuB1CcDuE4HYIwe0QgtshBLdDCG6HENwOIbgdQnA7hOB2FLXcjs4Ht7uGkqPXRq8lGb0ueh3i10evR/yG6A2I3xhtQWmW+SHlmeh44tEJ0TcQB/9DHPwPMuB/kNmfwIgn8IRMutCyQDon5rvBskDilgUiBAtE2FK3pBL6Zn0zldatdCsqpG/Rt1Ap3Vq3pnK6jW5DZfWt+lYS+jZ9J+J36bsg31a3hczd+m7I3KfvQ7ydbk/l9f36fsg8oB+ETAfdAVcf0h2pJJjlI0jvrDsjHfwSYVfdFWE33Z2K6x76cSqje+pekHxCPwHJJ/VTqLG37oeU/vo5lAwOiloG68EIh+jnITNUD0Obh+vhKOdF/RLiI/QIyI/UIxF/Wb+MMkfpUbg6Wo+mSnqMHkNVLHOlymCu46mqnqAn0EX6VT0R8Ul6EmQm68m4+qZ+E+Fb+m2qpt/R7+Dqu/o9XJ2mP6Az9Id6OlJm6BlIAd9FCL6L8FP9GVXQn+svIDNbf0kV9Vf6K0h+rb9GLd/pH5Hyk/4FZYINo/z5ej7CBXohZBbp33F1sV6McpbopYgv08uoNljyCpS2Uq+kSpYrU0lw5V5UPHwifJLKhk+FuEvgzb2pWtgnxL0K+4f9qVT4bPgsUgaFg6lqOCQcQhdZPo0U8GmqZvk0pVk+TdzyaYTg0wjBpynN8mmqBWbX2PHpSxyf5o5Jx3hzFmO2/DjR8eNEugl7omPGlzlmfIVjximOGV/pmHERx4yLOmac7phxRg7/Pb7z3xM4/z2+89/jO/89Uee/x3f+e3znvyd0/nt857/Hd/57fOe/J8n57/Gd/54k57/Hd/57Lnf+e5o6/z2pzn9PM+e/51/Of09z57/nKue/JxNMPQG8OWSh4+gZVIdlskxwaMvUzwFTb071HRe/hl3HbkK65eIN2F3sLjDsh9nDCDuxLuDNXcHI64GR96ZG4OJ9EO/H/h9r3wPVxnWne2ckDRMsA8aEEEwIIYQQQikhhFCKCSGEUEIIJYR4KUVCCCE0IyGN/iCEGP1ByK5LWeJ1Hernuq7j5+eljuv1un4uz3Wp1/V6XY7LIa4f9XMpdVnX6+NHWZeyfo6XvN/9SSFOs9vmnfPOPd+ny50/mhld3ft9OjMfX4f1qSJ/HhT5O6QCtPge8iKo8OPAP2B+QCqZE8yPYSlV4W+hCn8JVXgVqvCXQYUXEAWqcMV9+lsB+vsl1N9fAv39KqpwmjCkxIShDZgwtAEThh7EhKENqNG/jBr9C+zX2O2knCb7k6aoUqe6/Gn2++z3yVPsSdDlj6MifwIV+ZPsz9ifgf6mWvwxdoadgfZfgP5+DFOLHmF/yf4KFPmv2V8D0wSjPEx1y2UX2H+Glt+xvwOm2W7pmGyUxf5vdhHqNN8om/1X9jbUacpRDvsBew/qNOvoUXaV/ZCkY+JRpoJRsFCnuUfZCpVCBXWafpSJ6UdZinWKddASD+o/H3V/Ier+ItT9jYpNijRop+o/X/E4qP/PK7JB/eej+i9Q5CpyoZ6nyAN+RvEseRacwPNQL1GUkM8pvgB+IB/9wDOKMvAD+YoXFC/A/qkfyEcn8CY6gWZ0Am+iE2hGD1AN6n8XiQPdv5ckouJPQcW/CRV/ifIEKP4vguI/SzYrf6qcIpWo+6vuy2RSYSZTPGYybcRMpgZ0ArXoBF7EfKZX0Q+Ugh94n3DoAWJUvwQPwKEHiEEPEIfqPwbVf4pqQbUAKv+66nfQQnU/h4r/IVT8taj4E1Hxp6Dif1i1rFoGppq+GjV9DGr6RNT01ajpWY4DTR+Daj4G1fzDqNqrUa/HoFJPRKX+MKrzatTlMajLU1CXV4MWB9/L5YMi51CLJ6IWr46q8CKuCNYv5ophfarFq1GFRzR3DOrsGNTWNaita1FbJ6K2rkNtnYza+iHU1imorR9G9fwwN8wNg6b8BvcNUJNUPZeiYi7jdnG7oJ0q5udQMb/I7eX2go6kWrmY2w9auQy18ibUypu5g9w46PjvgUrehCr5DdTHm7nj3HHYiqrkYlTJb4BKPgnb/hC08ibUyiWolTdz/8CdhT38lPsprE+1cjGq5E2okktQJW9GlVzFzYBKLkOV/CKq5GJUyZtRJVegSn4ZVfJz3K+4X8FSqo8jyvg57ha3BC1UH5egPi5FffwGt8qtgkKlyrgMlfFmUMYPQZ1q4grUxC/GPBbzBKlEZVyFyvgtVMYvoQ5+EXXwW6iDq1AHb4p5PuZ5YKqAX0YFXBXzQswLsE+aKBaPWWIqzBKLxxSxeEwRU2GKWCymiNVjipgKU8RUMY0xjfDuNEtMhVli8Zgi9iqmiG3EFLEGTBFLxRSxVEwRU2GKmApTxFSYIhaPKWIb70sRi8cUsVhMEYvHFLFUTBFTYYpYPKaIqe5LEVNhilg8poipMEVsI6aIpWKKmApTxOIxRSz1vhQxFaaIxWOKWAOmiKkwP0x1X36YCvPD1mN+WDzmh6kwP6zhvvwwFeaHxWN+mArzw+IxP0yF+WEqzA+Lx/wwFeaHfQnzw17F/LCNmB/2GuaH1WN+2OuYH9aA+WGpmB+mwvywVzE/rB7zwxruyw9TYX5YKuaHqcDDbCSl4FieIC+iP6nkn+SfBG+Qw+eA1n+af5qU8Hn858Bv5PP50F7AF0R9SzFfyD9LXkb3UswX8yXA1MNU8V/kvwj7oR6mkq/mXwGu4V+FvdXxr8E69Xw9eY5/HZzMZr6BbwSH8Bb/FiylfqaC1/AaOB4dr4OtIkmM1OFUgcMxwXtRhxPH23gJ9mPn7bCVk3eSl/hevhdaBngfnAX1OaXobTZhcmMxOpwyfoQfAaY+52X0OWX8N3kYJdDnFKPD2cx/h/8OtLzLvwvvTt1OFbqdt/i/5cdhK+p5NvPv8e/BOt/njwL/PTifdfwc/1vgfwbPsw49zyvoeSr5ZX4Z9kw9Tyn/Af8BnB31POvQ87yBnudF9Dxl6HaK0e2UotspfmA9OJwycDgbSAU6nCp0OC+hw3kZHE4yuKCHHkiBNR8Gh1OC3mYT+plK8DNPwrvkgp9ZB36mCLj4gVLgzeBh1qGHWQce5nVg6l7WoXtZh+7lFXAvTVHHQr3KFvAhLehYWmNboaUjtoOUx5piTcBirAhsibUAW2OtwI5YBzDNotuAWXQbMIvuQcyiexCz6DZgFt0GdD4K9DZfXrdpXSb5wrradV8m5ev06zykCZPqlOh2lOBwngYXQT3M0+hhnlJ3god5TN2tNoFSp77lMXQsT4Nj6YG6VW0D5+BSu6CFepXH1f3qfmgZUPvApVB/8gT6k6fRnzwF/mQ7tHwdXMpT6FKeVP+1+q9hfepPnlZ/U70Llr4D/uRJ8Cffgr1Rf/IE+pOIM3kcnUm++rvq7wK/q34XmDqTInQmjeq/BWfyDDiTw9D+nvoIKUBn8gw6k2fRmRSBM/l7aDmu/gH5nPqE+gSs+UP1D6Gd+pPPq0+BP8lXn1afhqVnwZkUoCcpQk/SqL6g/hksnVJfhHbqTJ5Vv69+H9aknqRI/Uv1FWj/X+BJngVP8ivY2xw4k3R0JgXqefU8vC/1J4XoTz6v/q0aNB6mA+ZhHmmu+qb6FrTQpMBM9aJ6Ceo0LzAb8wIzMS8wD/MCMzEv8FHMI01X/7v634FpdmCe+kM1KEBMEMwCYQ4KEHMEH8Vs0nRME3wEs0nTMVMwGzMF8zCbNHd93Pp4aKf5gtnrN67fCC00ZTAHUwYfXZ+yPhWW0qzBPMwazMaswRzMGsxan7k+E5bSxMFsTBzMxMTBrPWm9SbyGDqxJ8CJBdCJQX9Yv3X9VnBo28B9PYHu61n0XY3gu74J9V3rx0gBuq9n1+9evxvqNLkwG5MLH8HkwjxMLszB5MJsTC5UEmbT7TQ/iF+1Yjv5NSHaFoAWYACIAAngXntlrOPwKgNCgO2AUcAuwB7AfsAhwBHAccAEYBJwDjAFmAHMAuYI67+AINoFBOufBlyG+k3AEmAFcI+QdhbAA+IASYBUQEbkGNqz/5PXvMi+2gujoNuUAMpxGWmvAtRGjhe32R85x/YGQDOgNdIefWX9VxGM9SjgBNSvrbVFcAOwGK1fBixH63cjCJAoOIAakAhIAaRH1g1k4fqkXQcwRq5Tu2XtmkfWzcX1SLsD4AH4AeHoOQxH3i9QED3XHYAxwN7o8gPR5cVRlEEbfI7t9HxOAc6snUvknE8ATgHOAM4DLgIuAa4A5gHXo6+37nv9aP3bgDvR1yvR7e7ct3yVEJ0SEAtIACQD0j5+pZ+fLhOQ85lf2UDlx58VPTddfvSz/n9F6ieB/Xt75H2wX6VG1sP3vR9FgNKPX9f2EdkvG6iB9gpAdbT/wTJd3cevukbAFuWGtnlz7cC0NtRDkDlkNfD2nkTg0Z4U4F096cB7erKA9/fkDkzTrXyt2kM9BT5d23Vzw8Dltlvm5oGr2iM9xchla/XjPZUDV+lSn7Httrl14Jp2oqdm4FqkHuU7Zt3ADe1kTz1yE/A5rJ/D+lRPC/BMjxZ4tscAPNcjDtygW/kswEaor5otA4vahR4J+GaPG3ipRx5YpO0+h0Zpdgwsa1d6QsD3erb7PJpYs2fgbjvbM4q8C3kPMN9eBRzXsx84qecQcGrPEeCMnuMDd+lWPn97ds+EvEeTYPbLcGV7JmWiSTaHZY6yL6xJMw/L6vbCnnPAJT1Tspq2+IYj7VHONO+QEzU55jE5pb28Z2aNq3pm5RTa7tsR5XzzXjm9vbZnDnkBuAHrzT03gVt7loB1PSvAxp57a2yxsr6xdoeV9+3VFJkPyFntHmucnIV7y422+K1JHzFt8R3QlJrH5YL2sDUVOeOjOm33jWsqzEfl4vZha7ZcTOu+o5oKax7Uq80n5LL2HdZC5JK1+pi1HHivtQr4gLUWeNzaAHzU2oz1VrmMbus7oakzn5IrNY3mM3JN+wmrbo1PWXW+U+1nrEa5RrPFfF6u17SZL+IxWJAda/XzVg8cid58SW5qv2j1r/Ela1hu0pjMV+SW7sk+P3IYeRj4XN8O4Km+MeCZvr3As30HgOf6xuUWutWQp3uh7+iQX2M1z8tajct8XTZ03+w7AbzUdwqZ1lf6zsgGunQorPGab8lc972+8zJnYs23hoYjrAmab8uiie+7iHwJOA7rcVhP6rsCnNo3D5zRdx04u++WLNKthnYA34H6NvOqLJny+m4DF/bdAS7pgxbaPjSmGbEoZbep3EO5yhM7tFez0xIry6ZaTwJlUxjrycANnjTgZk8mcKsnB1jnyQc2eopkmW41dMBk8ZQOjWt2a67JIZPDUyGHNPssCfJ2yoEszUFLsjxq8niqgf2eOnmUtgwdjbRH+bAlTd6lOWbJlPeYwp7GNR72bIHvDrQPnYjySUuOvN+0w9OGrF+rj3lMwHs9VuADHhfwuMcLfNQTBD7h2TZ0ynTKM+LTaU5b8uVDpjOenUNncG9Hoi3nPbuBL1KmLUPnNWctRfJx0yXPPuSDH9Vp+9BFzQVLqTxhuuI5LE/Q+tAl07zn2NAVzbSlQp40XYcrD+w5uVa/5TkNfNtzFviO5wLwqmdanhSUnsvAsZ6r8iTddmhec9lSLZ/TXLXUyVNCgufan3Cy54Y8pblmaZRnNDcsW+RZIc2ziLy8Vs/03JVnNYuWNnlOyOkna5zfz8lzmmWLXl5ov2IdRt4BPI/169Yx4FvWvcC3rQeA71jHgVetR+UFupXvjE5pPeE7r7lrMck3tcRilZd0sdZTwAnIychp1jPyEl3qu6jlLC55RctZz1OmdV2m9aIvTqu2eOV7uhzrJeQrf1LPt84DF1mvA5dabwFXWG/L9+hWvkvaREvQx2pTLNt8vK7aege4zroK3GhTAm+xxfp4bbplxBena0PW2xJ8V7RZlp2+JJ3JloychpzpS9Jm2XKgbrXlA7tsRcBeWylth/XndUFbBbRss1X7rmtzLbt9qboRWx3wTlujL1VbYNknz1D23dLttm3x3dYWWw7C+vtsbbCHYpueMrTMR9qjXGY57MvQVlqOwbEdtJmADyMfs1nhytD2O7qTNhfMnljX1lhO+rJ1p21e5OAan7VtA75gGwGetu0EvmzbDXzVtg/4mu2gb1V3w3bYr4T9nPbladNtx4ArLWeB6y0X4DgXbSeBlyljy7y2yTLtK9TdtZ3+JNN2P9hW21lfdgdnu+BP0LZYLvtKOtS2aV8JrfuTtS02aNFqLVfxvCJ87aN6R6LtBnCKbRE43bYMnGW7C5wrEeACiYNzp9ve0Ros13zlWtFyw1fVUSyp/4TLpERflVayLPpqtW7Lsq+ho9K6g7KUssY1UrqvQStb7vqaO+qlLOAm5BYpF1grFfjTqCbxZ3YYpGLQJ6AN/DkdolQ2cKNDkiqB3VJNZAb359N50F/UIUv1cnpHSGqS0+lM5C/t2C610FlJ0gLDXOOv6BiVDHJxxy5JhPkFvi/+6o49kiQv0H7rr+vYL7nlex2HJBn4iBSK9DF/I/18/Vs6jkvbfdnaGmkUGK6Dv61jQtpFr4m0BzhyppPSfuBz0iFfA84414WifjXMPnTkvyWU9ifKolDRnwJc3Z8eHZ9v01Fu6I5Q158l79ec7M8FpuPMqtDYX0DHnP5iYBhJwkphS38ZjB5t/ZXyLPb8+Y4p6Yhf3zEjHfebOmalCb+1Y06a9Ls6FqRzA1c7bkpTA9c6lqQZvxfWmYV1VqQ5f7DjnrTg36ZnpZv+ET0vLfl36uOklYFFTZ10T67UJ9lZ/259qp3379NsscfJ9foMe5L/oCbHnuo/rMm3Z8jp+mx7tu+8Ps+e5z+mL7QX+k9G9Ia+xF7iP60vt5cPTFNF4T+rr7JX+S/oa+219FOwN3w0s+sb7M3IrcDNcGzT+la7zn9Zr7Mb/Vf1RrvFf01vsTv8N/QOu8e/qPfY/f7liKZtZ+1hUHERHYUqRe+3D4N2Rd2oD9t3AA/bx0DF0b5xt11nB9bvsB8IEP2YfTzA6ffajwbU+gN0TY3SfmJgWT9uPxVIjCg37R77mYFp/VH7efiOo0bVn7BfHLjRnmq/NHBXf8p+Bd7daJ+H63DGfh34vP2WnKW/aL8NGmzcfgeO55J9FfiKQ+kf0a44YmH/846EQIr+uiPZP02vQCBdf8uRFunbgSz9bUcm7OeOI0cu1q868gO5nUpHUaAgojA7Yx2lgeLOBEdFoIx+LwKVncmOalDpoNUDNRHuTHPURRR4oP4+bkJuwXfRIhs6Mx2NAzc6cxxbBhY78x1tA8tUUQfEziKHPlqXkN30+xWQo1cS9HAghLydHlVgtLPUYQqMRurIuzorHFY5sbPa4QI9DKo4sKezzuGNaODA/vv4EChVh5zV2egIAm+hTFVr4EiEO9sc2yJKNXC8U+8YkQs6TY6dwNAOLVbH7ohq9Vd8zIEJ+q0PTCKfi3Cny7EPtCgo0sBUp9dxEJQn6NLATGfQcViu79zmOAZsdZwEzXnRcRq0Jf1cZiPcOeI4G5jTZTouwLebjsxxnTsd0zB7ZjouQ32342pgQZvuuEZnBMeNwM3OfY5F3+3Og47lwFLnYcfdwErnMScJ3Os86eSCbHRsx9Fb2+JUB/nO085EGI3dzpRgXGQk7DzrTA8mdV5wZgVTO6dt1cGMzsvO3GB2RAPoTM4CmAtwlum8SsftyBzdec1ZHMzrvOEsCxZ2LtLZtnPZWQmzHoxawRLdtLMmWNJ513opWK7b6az3pRqIsymYGp2XDzpbfHEGzqmlWsJpkBcMaqdI53SnJN8zJDrdviRDilOG973qDNH5ywljoCHdOQrtWc5dvqSOAueej2YKQ65zf7DKUOA8BMcGWiKQaCh2HvFP07ML1hrKnMcjI63vkqHSOQH7qXFOwiwAc26wwVBvORZspvNUsNXQ5DwX1BlanFNBo0HrnAla6HULOnA/HoPBORv0G0TnHHgcGMOD4Yjaoexvi/BHqsbiCg5TjrQEdyCP0WMI7kU+YJCcCz7W4Hbe9PEGmaoRqkz8bYaQcylSh/kOGLaCuSA4Tkfd4Lhhu3MloiuCR6MMZ+FvNIw678F8gXU8r3HDLhfryzDscfGgKEBXBE8Y9rviIioCjmqNg2O6g64kX57hkCsV+IgrIzLjw36Ag6cMx13ZkVk+eMYw4crzFRomXYXA0A4t51wlkVk+eP4+vkjnqeAl5DHkK4YpVznM3TCDB+cNM64qmKlhHg9eN8y6an21hjlXA/CCqxlmsXpXq68Zr/kt5NvRK3PTpfOVGJZcRl+VYcVl8TUY7rkc8kIX6/IE7wj6/ppwrGDqrw/VC9b+JmBXf4s8Knj7tbJBCPYbZE7Y1i+GE2AdCZaO9LvDycLOfhmW7u4PhdOEff3bw5nCwf5RcEP7+nfJ24XD/XvCOZqd/ftlWTjWfyicL5zsPxIuEk73Hw+Xwow5Ie8XzvZPDm4TLvSfC1cI0/1T4eqIO9Bc6J+RJ4TL/bPhOuGq51i4UbjWPxfeItzoXwAfd6P/5poOX+xfCrcJy/0rUL/bf2/wmEi8bFgvcl4+bBLV3riwVUz0JoVdYoo3NewV070Z4WDEgZpqvdnguSJOBz2FmOXNC2+LuDwxF1okscBbCJ4L5vrwiOmAtyQ8IuR4y8M7xWJvVXi3WOatDZtMeXRNzYi3QXaLld7m8L6Iz+qe9LZ+5GcjHlOsQV9Za7pOHZ9Xt/bu414jMHolsd5rAccU8Tir4DEnxab+pUCZqdzrgP23eD3hg6LW6wefBVcgfFg0eMNRrbJDFL3D8n5R8u6QZ0W3dyx8TJS9e8MnI35QDHkPhE+L273j4bNU54QviKPeo+CpwVmHp5Evi7u8J2DWAAcN8wVw+CplH3rq8DX6LuEbERb3eE/BGe0HzyWJh7xnZDf1v+FF8Yj3fLS+jHyX6qWtJHolwb1u5aIMR7VVLR73XtyqjtSRE8UJ7yV5lzjpvQLuFTzs1hTxnHc+4li3pt/HWabz3utwxaa8t4BnKFOP6d8SYXHWezviK7fminPeO/JxccG7Cgzt0HJzQBnxmFsL7uNiquK2liFXRlhcGogF5wj+cWuNuDKQAD4RXOTWevHeQLI8Y2YH0oD5gUx51hw3kBNuo5/L1ibkFs3IQH540Zw0UCRPmFMHSuUpc8ZABayZPVAtt3TxLn9wFb0Dzkc4doFn6YpzhQeVXUmu4cFYLefaEUjsSnWN0bnDtXcwoSuDMtQPDCZ3ZbvGB9OAj65xnuvEYGZXoevUYE5XCWzFRzxdV7nrzGB+V5Xr/GBRV63r4mBpV4Pr0mBFVyodP5HvdDW7rgSW6Gg5WI1cpwu65n1JXa2u64ONXTrXrcEt2mLXbd98l9F1Z7Cty+JaHdQjm+g4OWiNeivgQVeXo1c56I34rC5Pb+xgsMvfmzC4rSvcmzw40jXcmza4s2tHbybwWG/O4G46Zg7uQz7Ytbc3f/AwcJGP7TrQWzp4rGu8t2LwWGRO6TraWz14sutEb93g6a5TvY2DZ7vO9G4ZvNB1vrctUIajKN91sVcvG7ou9ZoGp7uu9FoHL3fN97oGr2rFXq+vqut6b9BX3nWrd5t8PDJDUR68ppVhNoR670jQE1FunQm9OwdvdN3u3T24qCW9+waXu+70Hhy827Xaezi42pXXe2ww06jsPTmYb4ztPR0ixoTesyHOmNx7IaQ2pvVOy6PGTNdYKPH+vRlzei+HUoz5vVdD6cai3muhLGNp741QrrGidzFUYKzuXQ4VG+t674bKjI1uEqo0bnFzoRpjm1sdqjfq3YnAJndKKDHKVne6vGB0ubNCTUavO3cwaAy6C0Itxm3u4pDWOOIuCxmMO92VIdG4210Tkoz73PUhN/18Q7LxoNYdChkPu5tC241pbhjzjcfc2tBo5LMznnQbQruMp92if8R41i2F9hgvuN3A0245tN94GTY9ZLzq3h5M0ta4wWEZr7l3Ad9w7wkdMS6694eOG5fdh4Dv9paGJrqJ+0hgrptzH5e5brV7IjTZneieDJ3rTnGfk8XudPdUaKo7yz0TmunOdc+GZrsLLNOBsu5i99xgaXeZeyE0B2vehDUr3Uuhhci7dNe4V0I3u+vd9/zT3U19bGhJyxlz5JXulj4+tKIt64vzZXRr+5JC97oNfalDbLfYlzHEd0tG7xCvbeqD2bnb3Zc3BFqur9DX3C33lQwldYf6yodSu7f3VQ1ldI/21Q5ldxX2NQSWKA/lRVx/966+5qHC7j19rUMlVL0MlVOVMlRFf0UZqo184/AXjOHoLxWf/Hacjv5WgL8MDDV07+/TDebQ+X2omXrwoVbaG4d0kV+HcHy4033INQb7RyXWfaTP6LvUld1n8V2K/nqDv6t0H7dYh4xdt/scQ5aI6++e6PMMOehn7W8kLHmIWWL+lRDmj8wKYZm7zAdEyXzIMoRjVSxHHmDXsWqyjk1gN5D17INsMolnU9lNZAObyT5ONrI57FPkQfbb7LfJQ4oaxZdIiqpa9QpJVUkqO0lT/UT1E5IeB4U8GpcR9xrJiGuIayX1cZq4IfKVuLfjfkyCcefjbpG/i1uMWyGX4Wi+TJT43w/iSDx5gGwgTWQdaSY68jrRk6+TVvINMkJCZJS8T8LkF+Q35AL5LRNL/iejZtaTD5l45kGGYegzTjy9b5J5iGlhupg0ppsJM7nMNmYnU8OMMd9m3mR+wPyc+YriPcV7jEvpUDqZXqVfGWT6lNuUX2e8yreVbzN+5TvKbzEB5XeU7zIh5RHlUeZryhPKHzLDyh8rf8yMKn+q/EfmbXwec6dyRvk+845yTjnPfEt5XfkvzB7l75W/Z/Yp/6j8N+a79C465oBqo2oj899U76tWmUOcistiLnFPck8yy9xTXD7zR+55rpT5gD7hwXzIvcRVsUqumnuN5bjXuVY2jmvn9GwaZ+AkNoNzcjL7Oe5r3Aj7PDfK7WE3c9/hDrK19MkJtpE7wv2MfYO7yF1kbdw0N8tK3FXuKtvPzXPzrJf7HXeTHaD3Y7EB7g/cMhvmVrhVdlsMiVnPvh2TGPMg+52Yh2IeZ9+NyY55jj0a82KMyE7G2GN2sLdivhnzTYU65p2YPYr1Md+LOaLYSP+vquKhmP8ec1KRFjMR8xNFOr0fSJEd84uYWUVRzJWY64qSmH+J+TfFy3w2f0zRxP/hgccUv4n7IO4DJX1eTiTbgNUknT5tXHk0Ch6QR7JFXc0d0VhV86XLVQWiRXSInpp50S+Gq8SGUfGEeEo8UzUhnhcvipfEK+K8eL0uti5THK5ziTtern3ZKI6Je8UD4rh4tC7z5SroVUro40vYx/9IGOZD5kPCQo9OIApY9gjeiUrY77HfIwz7HvseLDvK/h1RsD9if0RUeCcqx/6c/Tnh8UmwB9j32UskFu9BVePdp+vZ37C/IXF432k8+3v29/DtoHeWJioYBbP2X4NVCo4k45NjKYpkRTJ5WJGiSCGpeKfoJkWOIoc8gk+FpSvKFGUkA58Be0xRoXiRZOJTMVl4z8YTcPxqJhGvHGUinCVe4axwQZgWLgtXhWvCDWFRWBbuikRYFjlRLSaKKYh0MUvMFRbFArFYLBMrxRqxXmwSW0StaBBFURLdoiyGxO3iqLhL3CPuRxwSj4jHxQlxUjwnTokz4uz9xdwszokL4k1xaa2siPfMrJm/r8SZk8yp5gxozf5EaTVnw7p55kJziXjvo2IuN1eZa4FpaTDrxCWzEda1mHVmh9lj9pvD5mHYZ7Z5h3nMvNd8AM6feUCMjhr0mfUNeE1SoChIGhQlySZPEhXJgxJDPg+FJ6VQHiBlUGJJOZR1pIq8jHeXvwqjDn3uMp78FWkhCaQNSiKMO3qykRihJBE7ceATlx581tKHd5QPklQYj94mm8g7UB4h/wVKOvmv5CB5lHwPymPkCJRM8kMoj5P/ASWL/AjKE+QfyFk4vgtQcvC/YT9FZskvSS75FZQ88lsonyO/g5JPbpM/wLHfIf+HPENWoTzLsEwMKWJiYewrxfvHvwhjXwIpw/vHy5l05jHyAvM48zh5CZ/3rILRsAGf6Gwh1cxXGS15hdExOvIq3kteh093vsaIjEjqmR6mh7zOOBkXaWAGmCBphLEzTLbA6Pk18lfM15lh8hVmlBklX8WnO9tgJD1JNMwEM0E6mEnmJ0TPnGP+kRiYf2L+iRiZnzFTpBv7rwCjQA4R+Vw+l/Tg3XlW/hm+kNjwjjw7X8qXEgdfzpcTJz5J5ML773p5Ld9O+vgOvoP0w2d7naxg3y+myRKm44AJwCTgHGAqipkoZgFz5C3ThGnSdM40ZZoxzZrmTAumm6Yl0wrwPYEVeChxQpKQKmQI2UKeUCiUCOVClVArNAjNQqugE4yCRXAIHsEvhIVhYYcwJuwVDkAZF44KJ4RTwhnhvHBRuCRcEeaF68It4bZwR1gVt4lKMVZMEJPFNDFTzBHzxSKxVKyAUi3WiY3iFihtol40iVbRJXrFIJQRcae4m/4HUZVO1Q2T4Ffj2jBf4eX/b/37NSjx2MsTsJdvwF6+EXt5EvbyB7GXJ2MvT8Fenoq9fBP28jTs5enYyx/FXp6BvTwTe/nj2MuzsJc/gb08G3v5k9jLnyJTUHKxrz+NfT0P+3o+9vXPY18vwL7+DPb1Z7GvPwd9nSXF2L+fx/79BeYRJh36Pe3ZZdizN2PPLsfnI17A3lyBvflF7M2V2Jtfgt48AN8BH+OD7wB9SuIV7M012Jtrmb9h/ga+D7RP1+HzEa9hb67H3tzATEE/bmQuMhfJG/yb/JukiW/hW8ibfDffTZ/XTvAnbIfPSQ3Xfh1hbG3Q7woBJYByQFW0rRbQAGgGtNI25QZTka1YmPnzwHVmpUumUluZqcJWKcx9ErTNVG2rERYAN6UrFKY6W72w9OdB1zE12ppMW2wtwsrHoH+b2mxa4Z5NK7LSvElvM4j8nweuEyddN5lsophkE01Wm4Rw2dxiKiBDsmA9W7ol5km3TV6bbAraQmLhx8C/S6Q7pm227WL5X0CVtCrW2pWmEdsoYqdtl2m3bY/YEAGt03MTmz8Gnus+236x1bafviIO2g6Jur8Mup7psO2I6ZjtuGj8JEwnbRMf7fd+mE7bJkXLxzCdtZ37LLC2uXabLtimTNO2mf8Ql22zFFa9ax+F6apt7jPhmm3BdMN281NYtC1RWE32EdOybeWzwGp1HTTdtd2jEIjEIjiJp7C6XIfpa4/FOS5oJZ2gluKERCnpT2H1uo4JKVLqX4I16DqJ+0iXMhBZUraQK+V9AgVS4adQLJV8AmVS+WdGpVQl1Ei1n0K91CA0Sc2fQovU+gnQ8/4MEB32WMEgGQVRsvyHgGWix54g+u3JuJ4kOT4T3JJHkCX/p0D3FwYM29OEkBT+LBB32DOF7dLwGkalHWugy8cAe+05WD9gzxfH7UXCLmkMj/dPIB61l2J9j7T3L0E8Ya8QT9mrP7GP/dKBT+CQNP4p0G3P2OuEI9JR8by9EV//L3vfAx1Vde19Z+bOEBFGxJQ/MdCYIsYQEALSiBQojSFk/oAUkUdTGDP3zj/JZEhmBqQ0Ao00pZQCH1JERD4exZgiRYopxICUh0Dz0gg0AlLk5UOKKaSRB7xA+TB8e//OmTCEuLTrfd9a31rtOmv/7mbfffc9Z5+99znnxjXWl0zvrD9fSDuLq56vLq65i/YV73/+YPHhu6iuuD6eZjeUzIzV9vhaHKuV7TXuVInWXoMaSwLxdaQ9TuLnNTYvMR+dLwm1+7a5JBrfJ9SScqoplPuh5aIGhFaL/EVerStOwrpB8R7aSLQlujcWz6GtdKX38P3Zl0sWzL5esnh2W0l5oVqynNeXwq4lq1nOYyvsUbKusFfJRq6vhcklW7hOFqaWbC1MK9nBa0DhkJJdXNsxZor3whEle2P1uXBUyYHCcSW1PO7CnJIj7ItCe8lxrp1sEzSl5HTh9JKzhTNLmgq1kpbCQMnVwlDJjcJoWGH/Yg1iX5IPCxfQOinXs8LFtP5IPxeWk53lYQvbwL3V4W6F68I9ed1pX2vj5qjdJpNcU2JrAfeJ18bCjeE+6NuWcP/YPEOfaz/NPdZlWvMwtq3hASwr3EFr+ChBvF6zf+8gu1iXeb3Cekzvia3FfAVR/GBsHdZYvIuocNecUiZeY2PraowK985ZwdS+RvKaKdfG+LXyjjVSrpMxKjxA6yDNMdY+Wg8La+dUMyFueZ3bK6i9ZhEVHgmn43o8PLTwdHgk5FQ/Cs+GRxc2hccXtoRzC6+GnZBzDvNawnlLecT5VHgjPDWohGdwLQpawi7kRSwPZF1EbJEdrnPBblSbZI5gvqhu8fOxGnhXbnXIq/b6Eus/2eC6GewZ9vCcB/uEZ7c/z/qUb8H+4eLggPA87ncwPVwaHBouQw3n8dAYgiPDS4Ojwyvw3JfVH9mv4HhZx2M5viROR/YZY+1Qj9vHw3U4Rl/0ri+op8FceXUWb+cxtVPHOhlfK7k+xmpkfE0kXdhhHb5HPghOLbGHdkQPhHZFa5l4b8PzjX3N3ugRyKhmBY9FrKED0eOx/UuoNno6WBbehzpG+47QkehZ7CmopgW3hS8ES8PVsT1B6Hi0CTWN13/eN3CtOx1t4TU6dDZ6NdQUvRHcF74ZapmrhK7OtYRuzO02R5nbc45lbp853eb2x55M1ks8y3szuW/Cnie2R2Fb0gbfm9Nz7gCul9yv9r1dbB929XYNBsX2MHLvwbZ4Pzanz9x03u/M6T93aOx56NN48G/yF/KExjZnwNyRkPG+MUZyn3gHddwLyr3fHST92nFf1068F4tRx31dbI/Wyd5sTrqgL92b8d4rfv/Fe67Yvituj8V9xbOsI31yV25R/gVnhNfclVeu8PrYHivoCW8Kzg5XcC2K6QWLw9s4roPzwjsRT7E6wDqccxR/uC4NHwyuCNeBXxM+FlwfPskUn2/BTeEzXCOCFeFziM+d4Ut37WOIgtXhVhDFIxPykOvWwYgR17pIQiwHOSeCJyOJwTORpPb84xp0LpKCWnMhMjB4KZIRbI1k8toTIx4vn7GQfzTm4M1IVpExMga2qX4UJUSyMU6pX2SN5BUlRiYXJUWmFaVE8rkWFQ2MFBRlRHxFmZFgUVYkzOsf1kCuT7QnKBoTmV+UHVnI9bgoL7IEZxZaC4smR5YVTYusKsqPrGV/FRVENhT5Ipv5nFAUjmxnPxXNj1SxftHCSE3Rksj+omWRw7wH5Pofq81FqyL1RWsjDSCyx+sMx3bRhsgp9nvR5khjUWXkPMdZ0fZIM2oYzWNRVeQy7tVErsPG/kgb1/Kiw1G1qD7atagh2qPoVLRXUWM0ueh8NLWoOZpWdDk6hP1bdD06AnWMx98WHcXXkBodx/EQ6hrNCfWI2kO9olNCydHp7fFDe3Def4RSozNDaVEtNCQagFzW3NCIaCg0KhrF/FGehMZFF4RyootD9mh5e6zGzgGxNYr40JToctYJTY+uZpliVAzWJdYVivLPv6D8A/0FpVm5fPvvAFqrMltP0lP0gXqGnqln6WOmqnq2nqdPJpym52utoukpTHqB7tNuiqYH9bA+X1+oL9GX6av0tfoGfbNeqW+fulyv0mum7tX364f1et0q2ypQg35KT5StUT+vN+uX9et6m0f1dPX08PTyJHtSPWmeIZ4RnlGecZ4c3RhrpGH3TPFM98zUE0TzaJ6AJ0R6UfSQe8SafI/fR2/g7/zdKym2J/5f+Q7qoNyYRO1+fAftie+gD+A76NfwHbSX4lMCSm9lNrUkfA19EF9D++Fr6NfxNTQFX0MfwtfQb+Br6AB8DX0YX0MfwdfQNHwNfRRfQ9PxNXQQvoZmUM7VKUOUemrD8DU0E19Dh+Nr6OP4GjpS+VT5i/JN5SK1Ufgm+iS+iX4L30TH4pvoOHwT/Ta+iX7H0N/QX8nGN9Gn8E00B99EJ+CbaC6+iU7EN9E8fBO14Zuo3fBDw4uK07DIsEh5Gt9Ep+Cb6HfxTfQZfA2dRpn+W+VZw27DbmUGvol+D99Ev49vorPUpepPFRd+abBA3aXuVjTK64OKR21S/6L4KH9byZcGZZ5SejtW3TRi93H3afdZd5O7hdpV9w1yvEXrpvXU+mj90TzabK1Ym6eVUivTlmortDXaem2TVqFtQxugpWtDtZHaaLTxwFzNSThVm6G5uHHcGAdR3AyWcdMT7+eIMdIcPULRw7Gikv8zKXo4ViyIlS4UKU9RDPE383soOmZQDHF83Iv46Ibv5N1pXM9TJHE09KBYWEnxxHHQk6JgC8UTR0Ci8ja1ryECeiECetP8H6C45e/hfWnOP6II41l/ELOejG/g/WjmLyj9Mccphh40xw9hdlMxr9/AjA4wzDK4lIcxo4/QjIaUNEOUZjQdX7kHGZbRLGZgFgdjFofgm/Zjht8adilDFUPCyITRcfORrt7vTu/YtPnaQvdQ98hY0wa6R8s2vmPTlrhz3U7RtGXuqe6p2iqSdGjaWm2DewY1FzUPN20zrrPdxbGmVbrn3d207bAwz10qW5loWpV7qXupVkO44u6m7Xevca9vb5tYV7YK2bZ1bP5t/p3une7qWPNccu+T7WDH5q9218Xe5d/nPkZtE0k6NH2Eu9V9khq/7ww3X5pmpes5PIGmt9xt3X3QlwMLB2OedV8QzX/Qfcl9yV9B2Hp389fR+G62N6dmbG8JonXiqcNavWbVEttbg5aEduq2J2JNa9RStIGxhhk/r2V0aM1El7VMtCxq16W8TVcJx7SPyOku1btq2Xc3vYeWp/fSJmvTuOnJWr5oeqoWJEmBVqCnaQVxdtqbPsR9QfO1t6AWjjXhffcZmhGKb30UYjdXH6fncIzpdvaEPoXjQ59O3EyMNkPX9AB6FMBYhSWOlGOYpTr/Sf8ZRMM5eP8CPN2shyh3hpL/RrpH61F3hb6AvGzVF1P/yvXlFMsufTXF+zx9nWbUN1Isrygo17doWfTe5RQnZaS7Vd+h73Lf1PfqB/Ra6jHH/wr9CEbpohk77C7Tj5OGUz+tnyVbnLUYETRFrvDslrmn6k3U/xYa81WSLyW9kZR1S/UbxA3VZ3oU92iPxdPN09PTx9PfMwC5PFU0T7pnKOerZ6RnNLXxnlzK1tkiYz1Oz1S8jd7kmeEu87g4Jz1kmTRne4o98zylnjL3Gs9SmX+cgRWeFZ7ZFGtWxFsS3V2j5WlZnvVakmeTp8KzTcv37KT5pdnSl3uqPfs8B8lzGVo29WmNVu+p8xwj7ZPUzmiZnmpEII8Sc8V61Chi2Euec0QXtGzK4RWeVpKHPTe9Rs8Zb4KX3u1N9CZ5U7wDvRnk64A3k+Pdm+Ud48325nknc4yTZzHn3ml6GkVbljffM9tbQM3nDWpjuNG9sDfTO59GkKdNozsLtXzvEo5TwgLvMu8q71rvBs8A72b3BW+l5vNup3gM8ti8Vd4aemcBRWiYx+e/5N7pb/VpVBn2+W/S/Jyh8WRTvKwIGAMJVAUqAlaqFAc9a7zNgUR3H3d1Qa13ciApkMJ5TTFD3goMDGQEMj0VgazAGIpQrhytVM3YOxX+an+10HCv8B0JZJMtrneIYGiKKkMRTLaOBfLcawKT3dsC09wHNSPpVVN/LgXyidvpzQ8UuPfpo7yZvlEBXyAYCKMKykoWmO9HZfVm+Y/5jwUWBpZQnTsnal1gWWAV3kZvCqx1Xwhs4GpGeCmwIbA5UBnY7usVoIruzReVC7UrwX8hUBNYpuUH9nNPvPtpnjh28r2HvfUcP6Lpy6nfB70NXJO8p2iOG7XJNDvnKa4yqB5keJvJ15u9l7Ux3uveNrfTp/qo7rjP+Xr4ehXUFtT6kmkGN1PcXHLP86X60nxDfCN8o3zjtALPGfa7e6eW5cvx2d2XfFN80z3nfDMpe5ZSgQloQXr/GVofz/vGUQZbqWYV0J2QL+pboCX5FvvKfct9q92lWoJvnW+jb4v7mG+rb4dvl2b17SWrVt8BX637JFk+4ztCfbJSX477TvvO+pp8Lb6r1Mc6sp3gvkSaN/yK3+Je6u9G1aYn5ZKT4qYPPZNBsZLl70/x2+wf4N7mS/M2e5v15d5G9xnPMX+6f6h/APnB6B/pH+0f76nz5/qd/qn+GX6X3+PP1fLoOtvT6i/2zyPtUt9yb72/zL9UC/tX+Nf41/s3+Zb7K3QNu6nB/zxh/gOdMH1KCP9VQy/+v8m4KhTDc0Yl0bWZWiW17dSqqNW4amZQc+137Z91ctZJ12Fq9a56yBqonaLGskZq56nRc9Nbpre4mqlddvEZ1mh1WifRO3rgRKPgRGPEWcaEPa+Ks4wZpxgL9rxdcIpJwCnmHpxc7sXJpRv2vFbsee/DnrcHziz347TygGLoofUIYkz47w5dIxSDy07XUXSdot6fu8WV81UoL4+uW4l2fAHtEpSXLyh371ekA0S1ndARQXlhuh7/apS3kK6nJZ2V1CRo4hlxzVtLtIH4FqKrd1NeJV1vfDnlVRHVkF1FkoWo252EsXWgiT07UJ+/g/oTDeiE0juxyzS0A438auQkv08cTTT+CyhXkPO4oInOr0hTiWZ0Qi5BTpq3iZ6vRk6a24mzJRVLmifI2SSujka6HiMqJSq7m5wUAxOXfjk5r0obKyStIVrfgTZ1QhUdaNvfQTuJqjuhfUQHO6G6DnTsq1HeebqedCE/OiW6l9dMdFnqnfuKdIHoUid0Utpso2vrVyObStebtynPeJvadXrIay+iZLqXcPtd8WRLle+3fjnZ0oiG3Pl8XmIHSuqE+NkRdE2h6yh5Hdd5f76I8gYSZXRCmURZndCYO8mWE1e/4+ttrF7KOmazu9rri22K6876EYuT+HmV/m730fQ43868s0/tNSW+BsRyWOYWrxmxmJ/Up0NMt4r7No0oQBQSNYLXF9sCIecx2RYTlYv66uL5ojppW020TqwBto2yvt8Q8W4jn8Tqs43WNNsOMV7bLukHssn1km2C2C7Np43qoo18Z6M+2Nhuk/Sv9Cc/i3UytoadjfMz2bErwgbfs9N6Ye8m+9VxnjrMUfuaEpuncrE22nuKvtn7xD1/Q4wF/94h1z76t72/lG2No12dUMd1+UgndDxufY1bY9upJY46rK/t6+V/Z53s77pzLUx33V4D49a79ppFZB8vr7Ru2Z0yx6h+2GlNstMaZKf1x+6RcsphXj+Qtzkin+y0ztiLRS2yz5N5IfMgVhc5ttgO1znUp1iOlIu6xc+318COudUhr2L1pT23ymX/y+ScL739PPQp3+y0NtnXiH7baU2y8xp0RtYkHgOtQfZt8rkvq0Ed63hnOrE+d1KP2+8l3KYvrHVfVk9T7qS76mR8rcyMq5Fx9RC6KVInS/iAa/Qkip9J6YJ4b8PzzXuaSUOljGLFkU081zG5f5lEeyN7q6xjNKeTOLbKRD1zsO/ZX3JPMClX1jJe/9fIOsfxR2v0JLI3iew5qL+TKG4mkb1JFGeT2CbF2KRSWT9j9XKb3JvF9k3Ft+sobEkb6GOZqJfoV8c63KEGt+9hYnWYx8m2+B7F1KQVcc8vleMZKfyFPReNbdIaKRsdR7mdUMe9oKsTkn7tuK9rp9I46rivi+3R/jt7s52uO/df+1y3913xeyyXfLY6zicdc4vyz17nuiuv7Mdc7XssO+f1GVGL2uvVORHX9gsynmJy1mmV8cdXqisOmXcOyjGHVVB8vjkSRY1wJIn4dAzsZB9D5MiQlCkIdZDtZ8nrmNs5yDnhoLXOMTku/0jPMU3km4PWaEcBkU+sPTFCPaoUfuIxO4JEYWmbxuGYL8cp9R10pnMsIVpGtMqFWuRYS0RnOMdmokqx/jGhTtKewLGdqErUY0eNiFNeCx37iQ4T1Ut/NRCdEucEx3nhJ0ez0HfQ2uG4TtQm9oBc/2O12UlrgLOrILaHdYZi29lD+N1Je1BnsogzZ6rwI8+jM03eGyJtjBC13El7RCftD51ce2g/5qR9mJP2VU7aTzk14V9nQNYxGr8zJK9REQ9O2gs5aQ/kpDXCufx2/HDt5v2Ak/ZCTtoLOTdKuay5TtoPOLcK+5wnTvKRk/YAzr1xsRo7B8TWKOKdB4SOs1bI+L/G6L6/+/v//K8x/pG+lanp6gH+i6qxVvm1onRJIRpIlEGUSZRFNCbumk2URzSZaBpRPlEBkY8oSBQmmk+0kGgJ0TKiVURriTYQbSaqlLSdqIqohmg/0WGieqIGolNEjUTn5Tubv+B6mei6JNZvU5QEVcgTuhL1kH1rllcaQ0IvomSiVCFvv6YRDRF9TRhxe8wJo4jGEeUQ2YWdhCnifQnTiWYSaVIeIAoRRYXdhAVEi4nKiZYTrSZaR7SRaAvRVnndEXeN6e8i2iuvG+Vze+PuHyCqJTpCdJzoNNHZ21f2T0ITUcvfcY354qrw499LmIN4miyI7WO+GqVuUwe6If6387Fr7PmY3XssRN3kfJP8np63r/f0Ieqv/NqWa3Paptpm2Fw2D2i2rdg2z1ZqK7Mtta2wrbGtt22yVdi22Xbaqm37bAdtdbZj1E7aztjO2S7YLtlabTftRnuC3WpPtCeBUuwD8e8Mapn2LKIx9mx7nn2yfZpthT3fVmEvsPvsQVDYPt++0L7Evsy+yr7WvsG+2V5p307/rrLX2PfbD9vr7Q32U/ZG+3l7s/2y/bq9zaE6ujp6OHo5kh2pjjTHEMcIxyjHOEeOw873ST7FMd0x06E5Ao6QI+pY4FgMKncsd6zulNY5Njq22GY7tsq2g1pn/C5qex0HHLXEH5HtuOM06Cy1JmotjquOG07FaQF1c/akNaFvp7+4oMhfXEjALy50xS8udMMvLljxiws98IsLPfGLC4n4xYVe+MWF3vithb7WFOsw5UHrcGu2MtjqtvqUsdbZ1jnKU9aw9QXFZi21vqg8bS2zvqR817rS+q7yjHWPda+y0HrYelFZjF9f2PL/cc8Mhp6GEP57lWr+v8mnZkqiypI6RlK2pLw4nomyJnWa5FkvX/IFknySqOqmUtVNpaqbSlU3dYnUXSb1WbYq7t9r5XWDpM1x76yU/96uDMqrpXYk73je6byz1JqAZ/NaqF3Nu2FTbBZbN9Hyam09bX1s/W0DSJpO8v62obaReWdto23jKSeRlXlXKS+dNhfN1X34pQ0Fv7FhxG9smKyZ1kxFtT5lzVHM1olWh9IFv7fRzTrLWkDz4Lc+r/SzFltLlBTrfOsPlVTrYuuPlIHWGmuNkmZ9z/qe8qi12dqspP8/tm5o+576HcIZFB2GtnvBdwU/DPww8MPVXMIR5jDkBZD/Avwywkzz2+BzwYtnh4GfjGcfIxwC+Qg1CDv8bCbs56vDGc3f4//2yTyf+ER1PKM5QrgDOq/zez8H//ke9GEx5M+DHw5+OPgRorcS5wPnQIdsfv6/1EGEjXJEg3D3e+gVRqo+gXH50XMf86aT4BNwV8FTb0JSiGdtkNwHfiyenQtr96EnY4Fm6IyEjodwKPih4DPVUZAHwI+EBciBw3E3E3e/qT7JaH4ePRkFTeaHmy5DR/hhGazVwBrPxWNqBeQCs4BToKPBZhVskjeMT/MbjYPNLsKXzJTdxij4scCT5mLCUtYxGIEvQx/9NCqMJg80Xza7CbfA5v0sMZxg3nAFd1dC/yno/xx8IqxdATZC/4b67yQ3qu8TTlEb+C3MGz6DxKOeIBzNOkoroyEP+DfgHkaTCZoTYecZ1jd8AgsV4N/C3QnQvwX9dPDngfuB70D/olpEmnbzvxF/nePWaDG/R3wbyw0F5lrCsypFgjGJdZSL5kWE/8VoOC8lhKZM2EkCJuNZHbgS2Fu9hbvPEf8Bo/E0+BrgEeDLaj7PkeUisApYCSwHtjB26UPvGiFmEJovWfg3VArAjwV2l1gJLAfys72heQB3t0NyEpJSSDaKeWeesApYCSwHtgBZfyI0F+ApRaD5FY4K8C+j51vAVwO3SEklsBzYAsymsewzlyOKfIx4+wngFTy7UmIVsBJYDmQLK+GNn7OOaS3w5+jzFWAj7DRynw0XzXWEV4EXza8BQ8BZQESCuZks9MZ8XYdmI/CCxEWIgf0cG5C0wUIbLLTBQhui4izunoXkrJRUE5owlofMBxAzdcAQcBbwKCMioVHEGPMUaWztKPiLtKfnPpDEOEoijcV4iKPUmAxJMiTJyO5ktkz4PrAakbmVxjhfxCcsrwCulM9yXpQg5nvz/4mb3vUaMAScBXwf2Axkm6fx7Gl44wisHQH/MvjXJbL3atHPp7uwte4CRaSB3yLQ/C5mNoR55LtXwF+0fIs9LJB7pUBCZ1rGJMiPYGaPQLIDOTIQmIIqNAz17SVLGuGLkH+KWnQV/CpeQQx/Rk3rLuohaxq6mr2ED6CalQF7wxvboJOBXPgQ/NPAClkDaX0xwL6xC6PlKM++5afsDTNqqepin1h2MW/JYN7UhNiuQJxkInrr8NQu8w5+Vt2GXvHdgKjnFq6cgxgpNxuQUw3II86Oh8GvxN0/yzGWoD8ePPsr6P8KfkaFMTexfxipVjOK+RpsofXRGIV+d/AHoF8qq0cl6kA5rw7IQQ/kLwPvBz6Mt5wA3uqSy7PZZSvey3ef4lmmzGU+USLbfFzW5A3E90FMHoUkBXjK8iDPL+rt64jnZ1G3d3IVNR9DTB5hTXMaYi+BJTR3HMOJXM8NdSKL6axMKwLm5Rh7mOpANWKsGlkp8H3kSzXwfawgXKuT+Fny53t4ahEyaBHikN8S4V6ZJvJd00RRVVTaqxj6IcfH46ldlmuoD6yfxb2lSGbJec50ivAPeWVBzzNl/VkETX7LZuBK4H7LI8xbfobMncSrDDL3NO7WSBQZyvxUyyDcbYakGf1nD4+0HOVah96+xquh4Q9YE5PQ288hfxs+7wc+BWM5yzsl42SV7derVsIm3j0a+zLSfC1CVeFZW4cxbuBcMw3DOvgooylFJYnx97D8KjSvwPJ/gP8P8BNgv449T8iW89DnIKOyHfwF4LPmrgrvK9j+k5ipdFioF+sv76Non/Acqh9H+FLsXi6oAYyC4+0buLsOPT+Kd+2BtSQeqfpH9oYZPlGvYX6jvL6berE104fMq0+Cz8F4WzCKa6gV15CJSegnqr2xhntoGoGx3yN7yz1JBZ+h0t7VcAij/q1Ku0HDOPTtMJ5FtBtHqbM5x/HUVN4DG6ea/kq4Wn2KLI/BPO5UNY5P46vEN8DapxLZ2uuw8zhsZqoq4SeMFHX9FN6VkQdMXeCHN/BUMXAFYqBJZe9tg4U04C9gxwk+grG/Bj+PxxgDeOpT4Gmgnz1GuywexWLetRJ/D0cF1qBCWCtAP6fCjsW8hiuAjEYe3bvozw3LAEbzFeCHwD2QpwLzuCaIPSdrGocCR5lPYB1hPkfsQmHnKPAQ7ByCnUOw8yfoe6DvYYkxBMloSJxi18q80so9IfwQuAfyVPCs313sbPGWPQKxj5oIOxP5WeMz4J8RPNsh3AN5KrAfJMmIH+w3YPMTWLsKrAC+Bdyq8go4ATYnwOYE2JwAmxNgcwK8NIEtm9JZ05QOD+yHhf3g3wH/Do+CvLoB/Wf8jRgv89S3DbCzAU9dgQWWZKGf1yTWIrO4D1PMjyFbeXYWqbzb3CdPB/yW99XjyFmcDlhTETv5c9jb98UpIBf4e1jrC/utwOPArXh2OjAHz+6C/FNgnUpRaknlcVkqGdUA66j15t2U6XiXpdjM61Q+fBWCB/4GfSt71VKJvB6G3h5FnHwCXCHPKScwOwcRkycwayfgGcQnZxl5YCDPlLk34XqciYzQ7A/No+DL8PbRIt4wF2+yxGTCTJkgnwj9T4DXgBXAg9jJV1jO4y0sucXzQvPL/HmJmGvwu0TksIQiIQ8zmIcZp3O0Umb6I50rneZ7GS10bv38A87Ezz8w0yybXsVOqZZ9oj7B646qM296G/g/IK/g/Zj6Oqoi9GlvzPuir+NZG/ZFz0Pzd3zeVA9xlTbh/Gh6hs/Lag/c/Q2e+iVjlwch7wULN4Fboe9CnJTyXJjeYd+azoCfABzOqKbwHKmpiI1y6L+HiPqI0bwZOsMRFUmsafoJZvav4AO4+yju9kG0ZMOCOKtuBebiXWOxK3gdK2AOe8z0CVaQctTGA1g1DvL+xLQRO9LlWIM2YX+4AJKXsKtpgZ29wAbgh8CPYOccsB44F2vTR1hndzGafwe+FLgb1bUVa9CPef+mDsIu7iPJVwErgeXAFr7LJy/zBfh/IjS7AZ+w/AuhOJHhhGjaLbESWA5kC29Dcx6eeoclhCyZzBLzTERFPva6c4E2YAg7w2LsP3NwJsUOVh2I+HkX74KmqZxrqQoJIY+iCZYfllgFrASWA8ma+VE+k1reQ8wcMveip+6FtY1ANxDnUzURY38BfJXEKmAlsBx3eVwvsK/UPcx36Wd5BTid7eMpVSL7B2cE01b2g2ksdn0LJL4GDAFnARFLvHOzdMW8fx+aOVwbzQ+bDxH/mfl3hK9AflxiCDgL+D7wMY433D0IyUFIfsJ7XdOvOUMNP8Reuj/wW8C52Fum4Bz0BPauGdgVL0dEzUXELud9oDEHln8D/gWcXneibx9D/jHbUW3o/xmWqA9KfA0YAs4Ccn49wr1Sv85nWMsbIuY5I4znYO1e4EbsEBYijxKxf5iD+F+Pux9JfA0YAs4Cvg8d8qf6EL/F/Dv+rkjIOrvx1G7wifBAK7x0ylyJXOjPdwXixHqeT6xqE0vMe7gnahX4z8CriBMV+gvMFzELAvn0+gGfXskbHBX16kL0jSNWAb8bPd+Nu6KKjgHea04kVHi+zH0tTxO/ieXmhxDJHwNfkLWUK08NaulK6CyF/pvIuL8ij+5FRc1CBV4H/l2uwBRX9JR5H+blIGzi9GpaBcuFsDYIfBWff+mEy3dD0KxhTNjDEZ6g4LT1C1jGN5Muotr/O0435cjQC8igd5AdjwNxOja9BQtvwJqivkRP1cDOb7lvKr5TqTgR01zwGqrjLFzCPFloATYgr1uADcjWFmADevsb4n+GN+6Cl27yHsD0KqrTIaCKvr3LZ2T1X4FhRhO+nJhqLUt4vUMWrwT/DvRfx7M/Q6aXs8Ti42pgeR7y30G/EfgMcKOllbHLDF7poPNLjpwuD4LvBRwOazehvxp97sqrg9qTv1Opj5mTED/MG7lv5maefbUncmeBOG8iHraaD3OcsFz9RJ6p+YtlJc44TyCvJ/Aa0SUXc/chZupJ5i1dzd3p7nWsWbv5REzRyzUhm+92ycXKspGziepVNfB91KVqIK+hefiONAjyM5CfgfwzyM9B/hHk+bD2Md4iTl4LsDI2AHfze82NPCILvseaduDEvQlr3FrWN/4bn6+pys2Ch6+hz1yXnuCztqU7sr4F2b2XkTxZhzrzGHrCWI+792JfdC/vfKgefo5ceA0Vg++WAstl9eCnTqBuvMfnbtJZB/k69B/1yvIi8VXo81Pqg4T/k1FNgf+3Y6R/wuxEofOs1GRJf5yDfs9jVO/nM7IJX5VN4tR2Eqe2w6jJP4AfkjHvg3EuewXR0sdMtciSgKeuYYfwaz6PmwMqnSzU5aixQTwbxLPLwFfwu4zfxBsLMC+v49SvYUQ/xgm3ARmhQvIzPpWrg9DP70H/Et6IXpnLwC/gs7mpCLzQKYSFkcDv836J9o2clbvV3rwuoIefIs7FafrbiIQJGPtjphoa1wy2YwkD5zOqG9W3UDk5I77DvHmeeR56xf6cCh3x9449qGZmvmsq4VXMbICdHvD/bvTwl3zuNp0C/xmf1k3DwE/g07rpVxjLfdwTMzJIfVbtS5IN6P9C02eEL5ooEtQL/Fcey79iT/gcn9ZpdNyfB/nMbloKmyUS2Yfdgc/yOd28G/gvfI4w/W8eu6UXPJCHM/hZPOXic7rpa+D34u5V9Ocv6OEOyP8Tf8tIYc9Y0vD2McBZGO9s4Ei5t+RVtS+equOTu/GPfHI3/Rj+6Yvvh43o4XPAPMzOTzCPNp41il5C41uQJKOf63CKWQkcK3icUFYi11bipLOST1V0l04i5kewo94HzR8B3zG/hHrIvBVoEwgLNliwwcIEaLbgrDeIJeogSE5Ask6lGTfgWeMA4BKcl7+L8/J3cQp7Aue7V/isRJFA+kYfND/CG3th/zkY1gbzs2o2+EUCIVnE1gj3QJ4K7IeVnTxjPorRBVQ6FZrWw+YTsC9GNwb4Az57Uv8xCtgcBJuDMNIWjLSFfaU+y5Yt2eZjwB9xFMHCdoHwTwH4XPhhrMUOXzFOwvn9FJ/faRR2/valHsV77cigP8HCFViz82rFvaLKw/iq+jDhTHUxyeehouK8TOdrvvsTYDIkY9Qy4kMq920wJKi3aj/MxV+B/8loqmU01zOqg4GL+FnzELzla7A5ETgKuBnWyoWvYOEzYBo8/AKwkCtel0PsgQQn/Hkd577n8ZW+kPkuFqx6z/Fd8yPwcC00s8HrzHc5xNYSnLwzMbfhPPgExiViIwuznI15WQ8+ERZGQ+dX/H3A5GL/q0mYhe2IjYd4FTOd59GZ3gLfA3wpdM4AB+OpVGAiZrMXP2vexDNu3gz5cGi+gVn+CfPGv0LyhGUkcDXHGzT78mxSnLyEGsh4BDa3gn8YfU6ED3/ActK8jt5eR4biL/W33lQMiunW78G/xX/LBmbeegP8o8By/iu5vPsmcBP054MX2Ae4EnLx7Dbw22BtK/BjSD4GfxI6JDc+fYu/iA4GvgSMAscCTwJLGQ1GRuUqJJlAhdHkAf8ycAvwfsnzXw1O4NkrkKwEPoWnfg4+EXcbgTcgwVuMUyD5DLywPxpvbwV+hLt/A+6BNRN0JgKfgfwTyXMfKiB5C5IJ4G/hqXTw54H7ge8AL0LTDv46eAv4NmAf4Nm2dN4Zoj/QV/6LJSbhmWRgEksMGLXhWeAHkJ8GXwM8Ah3hvafbvk0WRoi5YN44FrgBuFHMAvhMoAJ8GbiljXen+4T/WWL4NfAK7v4BlteK0YHvLTwPnTboPCTGAkkjenUe/FE5lm9jXAn07Hw8u4AlCvxjeBGamW1OjGIder4OvV2HvjGuhOQK8CIkDzEqgk8GJgHP4Y0DgSnAYcBP8S4RgavA/xmY1DaecCr4BzCzZSImWW7cBj6jjU/fH4IfBTmiwtiF0YJIs8xlVHfDwufsAUsh8+ZazPUW4Zlbr/JfG6H/UxEbsLYKfbgGnb/BV09zVlJO9UH8M64Qs/z5Zc44jDQq0QhMIewNHAssxd1SWCtlCfmT5TmQZwIViSm8LoB/WSJrOuHtE9LzKZiFDUDmn2K56ee4exVPPY4eigi/ihHB/4ZTYkYw0tdFPIPXoLMTXjomqgf7Sm2Ax0T+JoJPhmf2Q39/2zj+KgU+CjsR8K8xmpDFpomIwOvw20rcxWwa+kF+kX1ouIk+W+C9JIwoAV5qY6S4EjyPEb4y/BQo4vA5iSl4dgPssP4HsHkMd98Ewp/KJYz6AvA14B9uPUD4OcbYFZK3wfcDn4JZmwy+Hj1vwt2+zFPFqCDJONwtAa7D3Q3wAKLdNAy8yPQk9pjxUchFRvwe+Cos67Cgw/Jx6SXmRWWrQ14fQLZ+illAVTGo8PyTsCMqYT3wL7eGsyfB14oaCM2l0PyGqIF4y1HIkX3qQuTOIfDXbk2gfop1ZBOqzYfsK/VJ8DmQt8DONfCohMZ7gIOAqSJnoXMI+FtZnR4nxEphOAydnSKjgagAxtXw0hjoNABF3UDcGrEukFfpTGFC7hveABYDRa1IA/4CGIE8DH48MIAIfAHyN+VawPG8WPLsAbF25EMfNcRYINYUzKYF/u8D/D/sfQl0FcXW7u7a3aeS032KCAEBESOTgIoBIiIiCqICIkMERSZlFDAgQhhEBARkiIgoqMgMAiKToijKJCIERCYRmWWeZ0JADMnJq/q67/0lv+td77v3f+utt+5i8fXuXbt27dq1a1d3dZ/OO8AtwOVA5HNrEcYrF/QyYBbqbvXHCzQ8aV0A3RHYAF66CjqC0hWg6wKbRq8aC8E/Ap1jgAuA84P567dlIn8dIv8qZkRT4OPgrwZdFfKvQxvWHWstWo8iNrAyWsjkXASSKxAtoK2ryMY7QM8HvxloP69i9ENzEVFxwCHIMLg+CRWHNj8jNYW1X+ZOMs+YoCE3+ib6q9FKB2YhDycjkywAtoZkFvKwh77461R8kFcTENsmM1QHpzq8Vx1Z5Sr4EfhhRYAm9zIk6wZoNMxB6YIAE7DupMCHCbDT5KUElG4Efom6jbDHmIk9/GLYaSwW+kJLesHbNebtlKp4JycHe8vlzFuO1haDYi6e/67FvSd2qKxjtnkzZxXuyPC0RdQOuWam4wnOZkOL70Bn2Ltwr4pnXub6nJqLMmZczI4El7c7m9btj8w1hqHFefuSiUaDnGHPJrO/pCVpn0GrE2rVMejMxZ5GCFjB7m/mJjTMsfV1L7eEhmxTGmqCWsnAJLyfcA0YYxc1I86vGo/xGiNjaDHI/MJFpBjk7rwf2rQkrTdolfBrgbPNoH3WoO6FwRn8lukF9NQ2uwoi3deD0mYGncHQcA24H5gG/JzNfk55g2I5m7v7BHNfL66Bk99pDjvNW2Se4dA2Q9M+g1re0OuNvFMdehJQK5HN+3tleLwZfZ4B2+abPW3U+hxYDZyyRt5ZiVpHA0tMaTNwpnA/k23ArxGgeY/IDrTNMF6CbV8Z2joIe1hYBp1M89Ub0EIIw7FWotS8gVzZOow3Zs1bbY1Emsa7za6LWC7eNllXDDeWi1lmXhtaDBPDNA4Q5um2MPLWO8Bkg/wiZN4TeNdRjNF4D4/UuAj0Xfwx9GjaugxJ1BWPou7boAtA22UTpdYBtJ4lCpi5LExUNBOFYWeciX+Bp/wipDk1RT4zl8UdZi4beasBsLFBumKQGRrqQFtTUcTkTLEFOg19VRwxqwbo+ZCsDw1R1L0N9HHgd5bx8GLYcNoqqSUrWGaHU+dFzcm2zFPmHCvTrAUi0eRVMQhP7c2XZc9YB409Bq2aopDhiK/NymUdM2susBiwgkGtTSMdAT0GmN/aD8n9ZqaD3mf1M6sJdG6xZmocZ+0165GxhE5AwxVjicgmMm+h2xcNhuJBHwIdwdvpLuj7wP8UHK3Hnh7SOu3mwNrAswb5JHCBQccDP9ugsIFvgVMWMq0MhnZCsjywPkpLgG4Luhkkj4MDvp1mUBYHfQdKvwVmgoNW+EfQHUAPAjYCZzCwr0EL1ooaKP0B9EHYE4LMO8C5KF0LehHoc8CGwGfBR484B3V9bRuBQ4Cdgb9AMgk0+sXX0eLLoNfAnh3A0+B8BG3tUasqJDeAfzvohaAnwydfg+4DnAosh1rTpV59Qrf4o2No+yww1x8jQzseONmgH/bHCJx3/ZEyNLcCtgV2h7bW/nihlvRHDTR8ErrgjxrkFwCPo7SEQVkcnG9h2z2QHAXs4vsHrT8CC1f5PjEcvSYa2vcY/GzPAFZHi/C2dQml8KRYDg2IOmccMB3y04DbgE8C0Wvbj7TJsHMA5EtDA3zuKNiA+BFlEHuxkD8KmXmgH4KkH2O1gMpgzDxTN6Yg7GTIPA4NS4Dx4N+CXpeFZzZA/j2UYo7Y21GrFNqCb3mcP+/gw52oC9/aacA7oOcLyCRCP/wpaqLuYvAxyxw/VjuhLX8mFvdjD3o2gYakGIlaZyAzFuhHCLzHPfxIRru3w1cLDVqXwJmItvw4vBf4ALAx6m4FXRkaKgFPAH8Hfxjaagf6KehBvxy07lSB5GjoGQ8anhfID/ZMYG9gU8j4Lf4M9CNkGUpfBGJcuAhafAkIz0tw7MtosR/4fk7DHLT92Y2Z6+QDJz8QmYERFQxtws9UyCriIuRR104FfgKcA76fG0HzFnDWgd6P1hFXjLkjMlALUef4s8nv0QrIhCE/CRx/3FeCnwwsCoTNjJwZGgGdvlWICnsvEHPKRmxYsDw0ELVehXwWaMxEuz9wF/gYU4b/nZbgI0fZyFo24kEgq9sdgUshn4mYGYT48fPVXCBykYN5xEPA8TPnedT1xxTjzhipEGKJWwAx13gMENErNxuMQVQ4WL8cRHsI3pboewilNuQZOYrvBzY0rROZexB7etQ8LWoOrA08a5BPAhcYdDzwsw0KG/gWOGUh08pgaCckywPro7QE6Lagm0HyODjg22kGZXHQd6D0W2AmOGiFfwTdAfQgYCNwBgP7GrRgraiB0h9AH4Q9Ici8A5yL0rWgF4E+B2wIfBZ89IhzUNfXthE4BNgZ+Askk0CjX3wdLb4Meg3s2QE8Dc5H0NYetapCcgP4t4NeCHoyfPI16D7AqcByqHsL6uZC5mHQ76K0O+jW4Esg+hK6ALwHpaOAXYCPoNYqtFsMFvqWo7/2DGB11EWvrUsoRY/EctTF6DvjgOmQnwbcBnwS6Fvoj7jfrwHA0tCAvjsKOjGOogxiIBbyRyEzD/RDkPTHuhYQtWJQGlMQdjJkHoeGJcB4lL4HGpFpb4dMKWiGZxj28xcoTYQeeEbUBH8x+Ihex4+BTtDmR7gfq5vAh4wYCc4ZlI4FYnQE/MA9gBOhzR/He4EPABujdCvoyqhVCXgC+Dv4w6CzHeinoAeWO2jFqQLJ0dAzHjR8JTCz7JnA3sCmkPFb/Bnoj+kylL4IhCe5CFp8CQjvSXDsy2ixH/h+NkD02v68QMw7+cDJD8ScYowjQ5vw5zjmo7gIedS1U4GfAOeA72cV0LwFnHWg96N1RAIjwkUGaiFOHD/m/R6tgEwY8pPA8Ud2JfjJwKJA2MzINqER0OlbhXG39wIxC2yMvgXLQwNR61XIZ4HG3LH7A3eBjzFl+N9pCT5mt41IEMiEdkfgUsggqm0/k5wH7Y8URpPh/xAihFsAEfM8BojYk5sR/xhrB/ncQayG4EOJHoVQakOekR/4foO0V+wmsyuyWZeW8vcxeLTm1MF9d0ez28AzsJNQF6VTzG9jOcG8n8bjsZciDEecAn+04ZsXLMj82sJwWhp0thm0K4CfibrdUXrSYKgH6I7AOtB23pdEu82C3YxSZPYozL3hFHDeCHY8KuC3dWYXpR72T7KwHxKPvZH54M80dcVWcDqi9H3QAhrOA3sD56DvnkExCB5oYnZIRDp2LZJAJ/ESU9fIUC72KwoE+yca6ZCRcSpBTzJq1cYOSTXDsQrYkzS/ULA3Mh97IPOxH6Ix+m6u2adqlLvZ5F7Qzcy9rdhqaOtR0M1RWhv0CtC7INkfdAzoaij9HrVOg5Pf1wbO4ai5078LMvlRKxHYFqU7fERpUdBZKP0QGkqBPwv8KqDLozQE+gXQw30bDG3t9m1AaV9DR5Nzr+pIKAPO51RE4x7QUwzN+XAvn2uQawAzwMkCPR6SBww62wzaFvgCOB+lMQatTNDngYmQJ8iMBpYHDkVpb9gwDnRb0HPQ4hnI9AO9HqUp0BOG/tXAmYHlxpIu4HwNznJgGhA95TooVeAMii7DX2E3mldGzU5gAjR3C2ww/H1mjLiGQdqHuguBY6ANOx7iKDhNjIxdJmreVXsIpTWjH2uMUn3Nj4NMRcMRF32boXmGsSF0KzgrDG2NAT85usjEp5G316B0hynVfTej40FzMviFofNt2H9Lbpa2czCsvQLb9phaTnf05Tj40xB1A0wtqwra6ge6BPQkRrPxBCHb+BOYZlBfTRk8CE4xyBwHnd8gPwKrkjBq6WirLzR3hIUHDYZs+LasHyG5TU3UGRmR33DM93d0hsQss+NMX0KFIX/c0M5jkPHAae7HIbxdDK148Ex+4zFrGHrdLGr2ZlNg4RzQ4egzJsaiZrezALABWk+HNx4F3dZIWpmolQj6KiTToWEM6FHg74A3NoJfBpzLKH0HnD3Q9g44D0HygkGdcTBefhzC/vroyyHYcBCR4EfyONNrfRewH17CuAMHYaQyIR+FhgpoqxpKExE/B8GvalDndzMudQMZg0cRA9ugeavv/8AbxvLa6MtB+KoQ+BFgM0imBO1mY15kI/YyEAm+pPFbcUPr2M5AJBuZ1sAx4DwDyaJoqygkN6NWOmQmAL9GaYNg/lbSfQnB5sXo4ybwiwG/hT2dfEn0t5vfayOpowi71oioUODVGYhqeMN4xuoEze8jD6yE91YHbRk9lTBShfxMhVrnUWs1JKOI9kRILkZkxhs6VILyIdKWYcSN/ZP8GR3MEaOtJcaoFPB5WHg2yHhFsNaYVjYGc3a8Lv3Mn8tGm86W78OqSqjl51WjeSh2ic9Te8RVe7Om5zbW9NOIutOQQR5gfx6NQt0G4kdE/jKMpunjKj83QnIg+E3g+XEGdV5ahlxhsoo/InOAMShNQK9rob/7gaOB2dBcG+P1MLAEsF4gY7LcgGAcTWYba3KmjodlmE0fIyqy8SQ3G7GajXjOxlgY+hr8NihYxYqAY3o9AT2t7q9iyDnnMTrLDUpEkcQqwych2R6INY4umjjU18C/IgdmIAeaDNMEdlZDlCYihrciqpGLtOQMSBr5T8FPgWQd0E+APxOW7wA9H/zHotuB3TH7Msw1uWklOj73MMYr2cxWjOmT6FcJf12Lfo/n9QWNtbB8MPqSAMnkKK55ULcYFdc6iwYjq+mcBUYzEb7zRrb5nU6w02iQwuCHDZ/IcKItzFvW0ebmTfgofg8SDYOuCLoi6MrmPe1oknmXXvO7gz8X9HPm/THzZr6m14I+D/qsoc2veHTdpeYrN+AnmbcBtZ55+DbLFXzfZrlB8zsCIvM792i8+TVHNN78HiT6eSjFfOVGvm6+cmPonBWGjg4OvW2+ciMvGv2howblBdB7jX55EvR10L5MY2BlSLYBtjffvTG25Rz0bQ59APkZoP1ap2FzJvilwI8zKB9G7yoAL6C/Q1G6GCjBvw+StdDWWfA3QGclcKrBMz4nC6UtIJ+GFjfAS1nAgWi9JiTvRF0jmQg6EXSl0Hrwr4G+E3p8fhlY8jTocqCfhZ6dBmMkaHzJJyYGpS3AGQlt35hv4EDDfdBQEXRF0JXN7+W1/E+gCwELotajsLkSbG6LUZ6Mnl5BKWwLzQbnOeBaYCZKb9Z4j/wU9GfQuRL0KMh8ARwL/mLQ20BfNhaar3Boa00cVsZzec7JBQ2/mSfp0Yo5p4w9ORgL8+RdczJMac4K40mfEx0ITACiFjRUzFkDSdTNQa9zJoM+Cp3fg94B+jxKEVE5u8E5AT3mDRyisDUi5jRxu1d6pFD8Cz06vEgDUtqkdqPPSd/5PZVcK4H0nUVuLhUkj0JUjEpSfqpA99L99DDVo2eoldbRmF6l16kddaaXqBcND+QjJOlWKkUF6B6qorXUpCeoGbXWrSZTfxqsM0cX6k69aQT+xqBfR1GMzhmlKZ4S6T56gGrp7PwsPUeCnqLXaAh1oBfpZepDI6kQcd1GjepQveSGTyZQ2ybJTyTQeGi5Gd8MvU3n5jJaY0WqTo/Q4/QkNafniak8NaEBNJQ6Ugr1oL6UhjqxlEB3kFnpHqTa1IDupDfBL0xx2g+3U1Eqq/VWpqpUgx6lOtSQWlAbbfdd1JQG0hv0AnWlnvQKjQosuIlcKkG3UDmtIYkeoseoLjWiltSWHLqbnqZBNIw6UTdKpX7mW6btKvVsx08DWwM7ArsBewMHtGuTksrDgGOAE4AzgQuBX7dr07MDrwauB24GbgfuAR5s165rdz4OzDRoC2AcsDjwLmC19imdX7AfA9YHJrfv9lJXuxmwNbA9sAuwO7A3sH/HHm3a2YOBo4DvA6cB5wIXA1dqxW3s9cDNwO3APSndenW1DwKPA88CM4DXgFGDjp3yUrsUJwyMAxYGFteFPZxSwPLARGAVYHVgLWCdl4yeBsAmwObA54EdgSnAHi/1aN/N6QscABza3fDTgGOA7wMnAWcA5wAX9tRj5CwGLgWuBq4Hbgbu6Nm5W0dnH/Aw8CTwPDATmNWza7vuIQKGgfHA4sCywEo9eyZWDFUH1gbWBzYBtgS211gplAJMBfYHDgWOAo7TWDk0CTgTOB+4GLgcuEZjUmgjcBtwF3A/8CjwdM9ebXuGLgKvArMNSgGMAaqevbr3lPHAosAEYBngXcBKqdqTsiqwBrA2sB6wEfBpoLkaFzr3xP8TR9bz/BYq9n9EWfhw6P8eHZ0xHJ1FJcX8285snPm0pbNeXoz8RWSd51x8c/lfoSydvf8c8/9lFBgRobWaM+z2mPXBXCX+ZbzpL+Ot/w3j/jImwFLG0foDmh78kaf+IbJeqQpR4X+SuhmU0OtTiX/qWJJK/VPH0lTmnzhaeiX9x/iPfWLpFfwfY76/hBX11UaqXvXH0UxaTGtoOx2lTMu24q1SVpJV22pitbdSraHWOGumtdhaY223jlqZwhbFRX3RT6SJCWKuWCo2iD3itMjiMBfl8lyN63Fz7sL9OI0n8Fw9B01bMX7McoM8523znI/Kcz76D+d2nvKQnua7SFp/OA8n3Xjuzbixvrp6o/745jeeF6Qb9ReMz3NeJo98nTznLfOc5+lPwT03nhcqm+e8UZ7zvjfaX2zajeW3Lr/xvPRdec4r/OFcz7/SiXnKB+Nc6PyQ3+/hHY38Y1m/57aOuUI6V5UJuFuD457geDQ4Xvwz6fJJwbFGcKwTHJvcaEX5tBt7eWeVG88rRG+Uv6fZjecV84xCpUp5zpPynG/Nc74tz/nZPOfnbzyvnP8PUaaJKvF5zqvcKF+lap7zvOX18pzXz3Pe4MZRvL+eRqU90856jzpak5Bt2+p/pGfqOLKcOOcmrBX5KeTVVeleHbVGrVKrNSdknbPOabmL1kWyrAwrg4R1xbpCrGqqmmSrR9Qjet008SD4UTbjJUR+UVBzzC+IlLGHI7pmBX1eSN+N9KBJlE4HKcuK1zbEaKvivcYkvDpessa63lMaTe/idE5O0HcLifqep7o6SSzitE2ncExX+k5LFNTnZ3BMVztI6LNdGtPVHo3rdV9NhBalEuqgtnWVLj2EY7o6rI+r9fkRHNP/IHk0kDwWSB4PJE8Ekn+z9wnYWx/2Pgl7/1bSACUNUdLojyVqAyzcCAs3w8K/lWxFyTaUbEeJICn0Pz3NXGHe3I4TcdqrBbVX2XvMe1x7fZVaRSFt02rtKSaz4luMHSb9v6yuP1j3arA+zWflo4FWUetWGoS/ZznUam61pDesFKsrjcDfsEyzXrZS6U0rzUqjt63x1oc0xrpkXaJ3ravWVRprXbeu0zgTGvSeCIkQvS884dEH4iZxE40XhUQh+lDcIm6hCaKkKEkTRTlRjiaJRNGIJotU0YtWij6iD63S2b8ffSdeEwNotRgqhtIaMVwMp7VinBhH6eID8QGtEzPFTlrPER012ZzESRTlWlybcrku17UET+bJFtup9nTLdto57axKTgeng1XZecF5wUpyOjudrXudnk5Pq4rTy+ll3ef0cfpYVZ2fQyOs+8NPhdtYF8LDXcuKenHeo+IVr4U3RXwaaR/pIi5HBkZGiSwlVAzHqNvV7ZxPlVQlOU6VVqX5JnWHuoPzq3KqHBdQd6o7OV7dre7mguoedQ8XUhVVRb5ZJakkLqyqqCpcRFVVVbmoqqaq8S2quqrOxVQNVYNvVQ+rh7m4qqVq8W2qtqrNCaqOqsO3q9aqNZcwf1KYS6qOqiOXUp1UJy6tuqquXEa9pF7iO9TL6mUuq3qpXlxO9VF9uLx6Rb3Cd6qBaiDfpV5Xr/Pd6g31BldQI9QIvkelqTROVG+pt7iielu9zZXUu+pdrqzGqXGcpN5X7/O9arwaz1XUBDWB71OT1CSuqqaoKXy/mqamcTU1Q83gB9RMNZOrq9lqNj+o5qg5XEPNVXP5ITVfzeeH1UK1kGuqRWoR11JfqC/4EfWl+pJrqyVqCT+qvlHf8GNqmVrGj6uVaiXXUd+p77iu+l59z/XUWrWWn1Dr1Dqur35QP/CT6kf1IzdQm9Qmbqi2qC3cSP2kfuLG6mf1MyerX9Qv/JTaqXZyE7Vb7eamaq/ay0+rA+oAP6POqXPcTF1UF/lZlaEyuLnKVJncQl1Vv3FLHbxtkL8ImcuysqwsncVyrVydPRyh7wMwzxzMsxDmmRRFRVGKESVECYoVZUVZCnMdnd1cp63TljynvdOeIk5HpyMpp5PTifI5PZweFOekOql0k9Pb6U35VYJKoAKqhCqh53gpVYoKqjKqDBVSZVVZulmVV+WpsLpL3UVFVAVVgYqqRJWI79RXpmLqXnUv3aruU/dRcXW/up9uUw+oByhBPagepNvVQ+ohna1M/i2J/FtKPa4ep9KqlWpFZVQ71Y7uUB1UByqrXlAvUDmVolKovOqmutGdqrvqTnepVJVKd6veqjdVUH1VX7pHDVADKFENUoOoohqqhlIlNVwNp8pqpBpJSWqUGkX3qtFqNFVR76h36D41Vo2lquo99R7drz5QH1A19aH6kB5QE9VEna8nq8n0oJqqplINNV1Np4fUR+ojeljNUrOopvpYfUy11CfqE3pEzVPzqLZaoBbQo+oz9Rk9pj5Xn9PjarFaTHXUV+orqqu+Vl9TPbVULaUn1Aq1guoj/z2J/NdA58411FDnznRqpNbr7NlYbdDZNllt1Nn2KbVZZ9smaqvOsk3VNp1ln1bbdZZ9Ru3Qa0YztUuvGc+qPXrNaK72q/3UAt+Ib6kuqAvUSl1Sl6i1uqwu03PqirqCfS///sqiJOTacjq2HKuV1UqzO1gdyLKX2EtIhHJCOcQxNWJq6Dz874k+nQP/E33/ib4g+ooi+sqbqy2rc2jvf2LsPzH2b4oxy+mir+fjrBIiiR+zm1Exqka1qB4lU3N9v9BFX7/301eWafQuTaAZNJc+p6W0mjbQNtpDh+k0Zegre7JClhfblzi2Z2xq7Cs49orth2Pv2Fdx7BP7mj6mamoAjqmxA3HsFTsIx96xr+PYJ3aIPvbSckNxTI19A8descNw7B07HMc+sSP1sbeWS8MxNfZNHHvFjsKxd+xbOPaJfVsf+2i5MTimxr6DY6/Yd3HsHTsWxz6x/Uno0sEae8WO0Ng7drTGPv+CR95Dz3vGvh945oPAM+MDz3wYeGZC4JmJgUcmBR6ZHHhkauCRaYFHpgcemRF45KPAI7MCj8wOPPJx4JE5gUc+CTwyL/DI/MAjCwKPLAw88mngkXG6/z1jp8AjM+GRuf+iRxYFHvk88MgXgUcWBx75MvDIksAjXwex8k3gmaWBZ5YFnlkeeGZF4JmVgUe+DTzyXeCR1YFHvg88sibwyNrAI+sCj6wPPPJD4JENgUd+DDzyGTzyFSJlFTyS/i96ZFPgkc2BR7YEHtkaeOSnwCM/Bx7ZHnjkl8AjOwKP7Aw8sjvwyJ7AI3uDWNkXeObXwDP7A88cCDxzMPDMocAjRwKPHA08cizwyPHAIycCj2yER7bBI7sQKYf/RY+cCjxyOvDImcAjZwOPnAs8ciHwyMXAI5cCj2QEHrkceORK4JGrgUd+CzxyLfDI74FHrgceyQ48khN4JBrESq7vmTD5nglbvmfCwvdMmAPPnIRHzsMjmfBIlokU83cajd3YTWtG5axtYirX54bckV/gLvwi9+Re3Idf4dd4BI/kNH6TR/Fb+i74MB/ho3yMj/MJPsmn+DSf4bN8js/zBb7IlziDL3MmX4lUMX9HydpqbdUNTDG/zuUn+AkS3IAbEHN77kA2d+LOFOIe3INiOJVTKZZ7c299JdCX+5LL/bk/eTyAh1CEJ/JEKsBLeRPFR+6N3ItdhqIUtovbt9kJ9u12CbukXcoubZex7zA90xZdwe66f71SLNibuNOU6Tr+3rXFKX+XKBtI3GX2pjhFl5Adb5svgJW1y5L7h3p+u/F2QbuQfbNd2C5iFzXfvtOy/9WuoFKUz85vF7AdO2RLO8aOtcO2a3t2xFZ2PjvONvtdtu7bQG2kqSPsB+0a5Nk17ZqkdFkVKsyzeQ7P5095Da/ldF7H6/kH3sA/8kbe9GceN7tlPItnaY0fm9818zyep/29kHUe1Z77Xrd3mM/8XfssLTVPly7lZbycV/BK/pZX8Xe8mr//szGG9tk8W2ufw3PMG5k8X2v/lHV21hZu0tpNP4z2ChT/p1r/pB/w2eHAZ6beX4wu1DPRoOs53cRiGkJD6Q0aRsNpBI3U8/pNGoW/Lvo2jaF39CwfS+PoPXqfPqDx9KGe8xNpEk2mKTSVptF0nQE+opk0i2bTxzSHPtH5YB7NpwW0kD6lz2iRzg5f0GL6kr6iJfQ1faNzxTJaTitoJX1Lq+g7nTm+pzW0ltJpHa2nH3Qe+ZE20ibaTFtoK/2ks8rPtJ1+oR20k3bRbp1j9tI++pX20wE6SId0xjlCR+kYHacTdJJO6fxzhs7SOTpPF+giXdLZ6DJl0hW6Sr/RNfqdsug6ZVMORSlXh7ElGotk8ZRoIpqKp8Uzopl4VjQXLURL0Uq0Fs+J50Ub0Va0E+1FB9FRvCA6ic6ii3hRpIiuopt4SXQXL4tpYpfYLfaIvWKf+FXsFwfEQXFIHBZHxFFxTBwXJ8RJcUqcFmfEWQ6Lc+I8u+KCuCguiQxxWWSKK+Kq+E1cE7+LLHFdZIscERW5OgWZt+2ZbXY4xJJjOJYbczI/xU24Jbfi57kNd+WXeSi/wcN4OI/lD3kSf8aL+AtezF/zN7yZt/BW/om38c+8nX/hHbyTd/Fu3sN7eR//yvv5AB/kQ/YDdnXzd1vt7fYv9g57p73L3m3vsffa++xf7f32Afugfcg+bB+xj9rH7OP2Cfukfco+bZ+xz9rn7PP2BfuifcnOsC/bmfYV+6r9m33N/t3Osq/b2XaOHbVznYiTX9aUteQjsrZ8VD4mH5d1ZF1ZTz4h68snZQPZUDaSjWWyfEo2kU3l0/IZ2Uw+K5vLFrKlbCVby+fk87KNbCvb6X8d9L8X9L/Osot8UabIrrKbfEl2ly/LHrKnTJW9ZG/ZR/aVr8h++l9/+ZocIAfKQfJ1OVgOkUPlG3KYHC5HyJEyTb4pR8m35Gj5thwj35HvyrFynHxPvi8/kOPlh3KCnCgnyclyipwqp8npcob8SM6U8+R8uUAulJ/Kz+Qi+bn8Qi6WX8qvzN9+ld/IpXKZXC5XyJXyW7lKfidXy+/lGrlWpst1cr38QW6QP8qNcpPcLLfIrfInuU3+LLfLX+QOuVPukrvlHrlX7pO/yv3ygDwoD8nD8og8Ko/J4/KEPClPydPyjDwrz8nz8oK8KC/JDHlN/i6z5HWZLXNkVObGUIwlZ8nZ8mM5R34i58rLMlNekVflb+G+4VfC/cKvhvuHXwsPCA8MDwq/Hh4cHhIeGn4jPMx91e3vvuYOcAe6g9zX3cHuEHeoO8wd7o5wR7pp7pvuKPctd7T7tjvGneBOdCe5k90p7lR3mjvdneF+5M50Z7mz3Y/dOe4n7lx3nrvAXeh+6n7mLnI/d79wF7tfut+6q9zv3NXu9+4ad62b7m5wf3Q3uZvdLe5W9yd3m/uzu939xd3h7nIPuUfcY+4J95R7xr3gXnIvu5nuFfeq+5t7zf3dzXKvu9lu1M31yLM84bFne44X8o54R71j3nHvhHfSO+Wd9s54Z71z3nnvgnfRu+RleJe9TO+Kd9X7zbvm/e5lede9bC/Hi3q5EYpYERHhiB1xIqGIjMREYiPhiBvxIpGIiuSLxEVuiuSPFIjERwpGCkVujhSOFIkUjdwSKRa5NVI8clskIXJ7pESkZKRUpHSkTGRiZFJkcmRKZGpkWmR6ZEbko8jMyKzI7MjHkTl4+oy9feyxDxRThc6g2DmfzvX0+v4LP6nX953cnFvQbm7Nz9FerKa/cnfuTvv1ivc6HeB3+V06wuN5PB3Fyn4M69ZxrFsnsG6dxLp1ir/iJXQaK8RZ+367mkXYgRdO2AlbiU6cE2dVxB57pdCh0HHrpEyUSdZ57LdfDg8PTxQiPCv8rbg5/EP4mqiEXfe22G+frVf7DIqlwlRCr/kN9BXQBL0CrNTZWTfhvkFC/QBqPijzjCaOClExd50+3+mu17jb/UHjXnfj32V3auo7itHXE4WpuL4CKO8/PXJ3G767V+OP7q8aN7kHNG5xz5maqqDRqAoZjepmoxG6cqD1b89oYvXZWhXWuE65N5TkQ0kcSm66oaQwSoqgpChKBMXqUUvUY1dVmL+W9IB4gIR4TDxGLOqKumSLhqIhOeGx4bEUCi8JLyEZvhi+qPUJZ4746X9ojb1xhf3/e339v7PCmjX0r66b/5NrZn7ZXnaUneSregUyK+ejes2sj9WssV6ZRmOdbKbXSLM6+mtjh7+4Kvb/B+vhf18NP9Tr4H+tgH9cXf5fWw3/vtrpdXG8Xr//uCrW1Fcf5trDv/Iw1x2N9JXH78F1x3V91fGsvuKYgmuOqfqKI0tH7dM6Up8zcfm3tVN0vXHd9OK8m7z8XgEv3ivoFfJu9gp7Rbyi3i1eMe9Wr7h3m5fg3e6V8Ep6pbzSXhnvf7X3HWBRJFvbdXroYegZmhwkCYKSoYeMgpGgqIiCIIiBDCoSRBTDKpgDq6tiQETA7GLEHFddc845o2LOEYH/dJlw17137/3/+93nf57PeqxT3TP09Klz6j3vqaqZtlbYKGwVdj+MtmN+HG95NZ7j5X8r6pb/Oe7yGrwmr/Wn6LtffkB+kMbgIz+MwucxDl+UX5ZflV//Eo95fd6AxuTHfxmVa/4cl3lDvgFv9G9F5+9is6LmfyA6BwMDepjKGoEN0YUQCCOWdM3dBnpCArGHJEgirpACKcQN+kIqcYc0GEK8YBgUED8ohHmkJ6yH4ySWyWSyyHAmmxlORjIjmFwynhnFjCOTmAlMPpnKTGGmkQK6ej6Hmckg2tMcv1iikGiT+RJdiS5ZLNGX2JElEgeJM9kmUUr8yG804p+hEf8szd7OqZSpHCcPWC1WCwzZN+wbaMC+Y9+BEfuB/QDGUuwuMJFOkOaDqXSKdDo0khZIZ4O1tFA6D+yl86XLwVlaLl0HzaQbpPvAT3pAegK6Ss9Jz0FP6UXpZeglvSq9DrHIDWogQVqH3CBP1UO1GWxS9VVtATtktjI72CVzkDnDHplSpoT9Mg+ZBxyQecu84aC4fgaHZC1lLeGwrLWsNRyRBcgC4KisnawdHJN1kHWA47IwWRickEXIIuCkLEoWBadkvWRxcFqWIkuBC2qY9sNFLpaLg0tcApcMV7g+XBbc4LK5bHiIcXYuPMI4uxNeY5x9B7VyRt6dUZX3kA9hYhTzFbeYEer56oXMnk/7WzAbXUlXXHpA4uczG+qdAdKUSD9zjybIadzw9UVYxHolsoJFVIpH2z8fbcejq1jEXTb2YI9e4wROGO68wAuvGQiBGFzaQ3uiArNhNt1lc4DEsEasMWvCmrJmbEPWnLVgG7GWrBXbmG3CWrM2rC1rx9qzDqwj68Q6swKrZF1YVzgNZ+AsnIPzcAEuwiW4DFfgKlyD63ADbsItuA2VcAfuwj2ogvvwAB7CIxWJiorkjeSt5J3kveSDpFryUVIjqZXU/d+cU0FVVBg606BCv62gRed+DLFIiAkWFew5a9TUgYj70pyxyLBXmyJP9MHCkeZY5MSP+BMFaY+FJxFYNEgkiUJ+2BOLNonHokOSseiSASSL6JEcMoQYkBFYGuDoZIgRaIAmMcYxakRMwQzMiBndHdMQx2sIMcfxGkUs6KpuIzpSLaEf9CNWdL9MYxgI2aQJDIfhOKYnwARiC5NgMrGDqTCVOOAILiSOOILXEyf4DXYRZ9gH+4kSjsAR4krnm9zoyPOgnDqIzjr1pLNOvb/Ohf3+eS7MEXvKlFEySmSMHoyH+N0wxg8ZYxAThIyxC9MFGWMEE0FY5D0JRIqMpy8yxvHcRCLjJnNTiZxbzC0hmtwyrpxoc+e480Sfu8hdIYbcde42culh8p+IBUaP0cRKjAzEFiNDKbEXcZw4I46fI0pE76vEHRH8OvFADL9NPBHH7xAvzK3uEW/E8vukKeL5Q9IMMf0x2kjc/9WMif6qy6HPujihLmbf6eLNeON7RY0kTAjmMipUI5ZqJEV+F0VUqV4yZG8ZRI3qxVG91Kle2lQvXW4ltxo1WsttIMZUR3OqYyPuHnefNOEeck9RL1FTJ6qpkmrqQTX1wvi3CPODJZhltKBa+1OtAzEuvSHtMSrVYGYiatSO6fN59VX8lmM81chZ1BG60HFPvp4hdC6TgWRo+fUcA2HggEe6X9+HI+AHfeHD+GBfiD2iQm3M0n6R0n5Rpf0io/2ihry3B+Fo78ip1RW0j9S5SC6S8JiZ/0Q0MPuahrafwc0lJpiDbSBW3CZuJ/HATOwpac49596RBOQQ40gqsoWpZAiyg3KSh7F/PSnAWH+RzKO230Rtvxkj+E2yhXrAVuoB26gHbKcesIN6wE7qAb9hZH9KdmF0f052Y4SvIXswnkvJMeQ4huQc8hoLcg25jB25i6xETp4gu9AizzHGG2EGgEiIGVIGIWIGSVqLswyks7hvi4TKhyr8yTH8G1OYQ3c5Sr5ZhMTSfhWo14XUs4jwzSIkjDT/eo4hLenque7X9zFEwhVxC/GTf+MOoLe9l4v+i2dpnv3pfizonQifP53BTzH6d5AV/1KP4hChOAQUhyQUh1QoDrEUh6QUh1QpDskoDqlRHOIoDskpDikoDvEUhzQoDmlSHNKmOKRDcUiX4pAexSEDikPi94p3owYKpq1kC/bEP1uHYYADbbzLRmAHLtAUWkMQdMG7i4U+kA7ZyF3yYDz8DDPwU0tgMZTDWtgEO+B3OAQnsG+uYD9UwRN4BR8Q/KWMgtFmDBkzxoqxw971ADvU3gb7wpHKKIx+ouwB3lT2hKZU9oJmVPYGHypjwJfKWGhOZRy0oDIeR54oE6AVlYngR2UKBFDZDyOqKNOgE5WFrIEoVTawhlRuZBuIkq+WyUXJ6sgUopQulKlTuV3GU7lDpkFljUyTylqZFpV1Mm1RInvRobKFBtDP6QO2iAQaGOcZPHLAOgqjvcgdEA9QS/RB1FGJdW9wwToGXLGOBeQRqJs71vHggXUCeGKdCK3FvR/QBuu+4I91P+QLDGrVFut0aId1BgRhnQkdsC6EjlgXQTDWc1ldwqC+elhvZMWZj2oZGgY1Ra9GPVWw3i5DvoE6SsXdTDJVrGtlMqzrZGqEQd2Q/chaEFscVdEYb/thnB1GRpPJZAYpIgtJOVlHtmEcO0LOkCuY+T/Csf15PQ89yRB93Qp9SQAP8EFvagvBiJBRqHciarEce6sQe+hXKntAOZU9YQWVvWAllb1hFZWxsJrKOFhDZQyspTIeKqhMgHVUJspMRYk6mokStWxI5XaZOZU7ZBZU1sgaUVkrs6SyTmYlStS4MZUtoJjabz61XAm1XCm1XBm13AJqs4XUZouoFRdTyy2hlltKLbdMtIdMl/a4Hu1xfdrjBrTHDWmPN6A9bkR73Jj2uAntcSAqGoTu6pZQrCB0pIOG+BUN8Zd8g+meehvigrH480wU6FNfM6A+Yih+tngVaPC1lSx6koi9iCczqa/QWlwhA01EKAJ6mNMARSKG4osY0wzJBOgKERAJ3SAckrluGH2iPs0LMwOZn5jxTIGkULJMspb/yNfwtXwd4us8rpibz5VwpVwZt4BbiFi7i9vN7eF+5/Zy+7j93AH+Lc/wEl6FZ3kpr8rLuPfcB66a+8jVcLVcnRxhT/6LfJp8unyGvEA+Uz5LPls+R75BvlG+Sb5ZvkW+Vb5Nvl2+Q35JfkV+TX5DfkteKb8rr5I/kD+SP5E/k79QqCpkCjUFp5ArFAp1Ba/QUNgrHBSOCieFs0JQKBUuCleFm8Jd4aHwVHgpvBVNFc0UPgpfRXNFC0VLRStFa0UbhZ/Cn1fw6jzPa/M6vC7/jn/Pf+CNeRNeXINsQrM+QjM9FplDe4xpfZh+GLWzMKNTMMMxo1Onu595mr9p0KxMk869aknWSNYQbekq6WqiI90o3Uj0pG+lb5G3Ya5CDMRcBfnNNe4OsRUzFmQz4zF2N8WcfT1pg9n2RdIBM+7LpCON3cE0dneisTuExu7ONHZ3obE7lMbuMBq7u9LYHU5jdwSN3d3ktRi1IxWaGKljaaQeTiP1SF4PI/Uo1HMLifo7Fv33LPgfsdMXC3G0NwntTTXaj9q0H41pP1pRzR2p5h5U885U8zDKUSI+ZX4sfdIftoOIOK/bmpjV9/8/evFf++Mn38EraFFPIdRTJNTCUmpPntpTg9pTk9pTi9pTm9pTh9pTl9pTj9pTn9rTgNrTkNqzAbWnEdrNgBh/vns5y9e7ex755ucRK4556qeE+ilQP2Won0o+/62C1aj3t4bISr6iwJeRTpGDjgLqySz1ZFXqybJPWSw8hzdQ/ZkNaDH6jDFjydhK2rFxbAKbxKawA9iB7CDegrfkG/PWvC1vzzvyzrySd+M9eC++Ke/DN+db8q15P74t35OP5xP5ZD6VT+Mz+IH8ID6HH8Hn8mP48fxEPp+fwk/jZ/Az+dl8IV/EF/MlfBm/kF/ML+WX8+X8Sn4NX8Gv5zfym/mt/A5+F7+H38vv5w/yh/mj/HH+JH+aP8uf5y/yl/nr/GP+Gf+Cf8W/+d9d5f+75/L/0Z5Lhmgi509kdfhqjPkt/taechyJ0Ed6pd4OYJm4V+bzrpp/uEfm6z4avAbjy/T8mrN/OtMeEehLzsvAK/IWObo744XvaIPnOjGdmXAmkolm4hGr0hH1hotrWj8q4jpW/YJX+b54/bmIq171i7hG9sPS5g8lQFxB+650+nMRV9PqF9TlLwrGg+8K6vx9ifxRwfjxXcFe+r70pOXbcfwfShKWPn9R0n9U5LXfF4xa35cGfyiNvi+f9ft0v/QK/zs38RdzE0CuYfz0wVjfFll2GP0dlC+/fiL+EspEMpXMxOynjCwlKzH/2UJ+I/swAzpFLmD/CXSt91+tvf6tutO/U/9w/uPT7IgCxUwx7yGtxFwAY50+zR7ENQ4AW8yjGYz2BdieCbOwPRvEp3cXY+bFwHp4Kv4CLDzHfOUFfQbGa3iD7bfwnsbMamx/hFps1zHiE0gYRgV9jmWk2FZlxF9NlTOYfzPq9Hkemgzm2Iw2o4ttPUYf2wbi8zkwrhpj24SxwHYjBjM3xkp88gfGWFts2zF22LZn7LHtwDgQ8Ykmjth2YsQn8cxl5mK7iCnC9jxmHraLJYH0V1zbEYkkiNURfyeORX1ZI9Zf/GVDNpBI2LZsjPg73WwKtvuITwXGWD0I24PFX4xix7BjsD2W/Y2ITzjehe3dMkRmGYNZJCNrotaXgFo/NWR6aqnqywioL1fHrFf9V/Vd2N6tvhfb+5CpAm+GPEOCbLKOZniIyhqMRpNP33GmlmFI7Odv5n7jIEA5CFAOAvW+QQqUgwDlIEA5CFAOAvR7H0A5CFAOApSDAOUgQDkIUA4ClIN8ukOGMhGgTAQoEwHKRIAyEaBMBCgTAcpEgDIRoEwEKBMBykSAMhGgTAQoEwHKRIAyEaBMBCgTAcpEgDIRoEwEKBMBykSAMhGgTAQoEwHKRIAyEaBMBCgTAcpEgDIRoEwEKBMBykSAMhGgTAQoEwHKRIAyEaBMBCgTAcpEgDIRoEwEKBMBykSAMhGgTAQoEwHKRIAyEaBMBCgTAcpEgDIRoEwEKBMBykSAMhGgTAQoEwHKRIAyEaBMBCgTAcpEgDIRoEwEKBMBykSAMhGgTAQoEwHKRIAyEaBM5Mvvg3z9tRCj/Sh16VlitFPIM9oqVbMb23bsW3VQZUryjMrx1FIGQCkX1KSsPS9hjFgixEg5eymoQJ4nAyoloUJnwaHeGZMys5EmdDnHh3QisWQASUMQTSBZ+F9c3mkuWNS7mIquZ4daFZ2y3Mx+fYf6R11+3uuWZHNSSZ5enpCnskfIk/xaImGAYXRc8RY7lFZ1PLIua2gzesMdBPWvdwss3tcgepuSripSHaZrqFJH0BIPZDpcRMyA5JT+SVlp/ZWaAi+eVNVR7ZIQn5rWP15pJpiIZzgdvY4pcZlpA9ISs8zbpGWmp2XGZKXgX1gIDcXXJTqG314PS0lNcAzNiklNNw9p00owM1BXuirxn4uLEhtReOguuHw9FHIr/iN3pi7IxdflOiodO4V0UVoLjT8dmvVvk5KenJBp7hfqb+4fGty0jRDg5ugqeHk4+vkHeCkbC5afNDL5oUahCZnZKXEJQh40qt/D4kOn8hCl8DzH5AGQNRc+GEvtBy2tnNFjmMbdIYunPZkYZrrw/eiBY2YdORw988T5gY4XZdXdTz1xbLzPs/nrX38yCr0TsaNv1c5DM7krAc+jzJozp9beaPIziR+6w2f6u24uOeNOGfWw3FbU+XcNzQ8q3dbrZ/d/tG3fnR0fV5TvanV5+bGc1yZr57RaMqSxfd2vg9W7NV3TM+RafIcbh/Tsri++X7sw0bm7pppaE4szLdSdU0+9GzRV0u+arvaiyfc8Gr4at2h1K4O02x2zEnfXlGUEuHc+0tegc9wHvRnTCnu1t9lyV9+/3X2H9bWTxq36uCi1zZXFwgdbm6dz1R2iR13Tzu+z7nLG02jdKDtLm7rc9Ijnk1ULdS7YhTISHEcL8kANe4QVTLFLTXmk47qb1VdUdHx1ab7RWusmXdXN/S7MvvWK+pCppYqhoD9S19Lt3cUuAenc45bV2dUV9qv3uFdoCGHiGxqqdBTaC+1KAkv8x7ZJzspKb+rsHJfZzyn1i52c4tJSndP7pohnndMz0+IHxmUNcP5qRtGK1IjolU74FqGbVIYDk2VVAVQ6CEFC2y/HAjPW5/MHDBo06EcfkJD5D66cJeiI99tYRSFwXy4pkf1hQEpEL1GbGCxdVfU477ip6k/n7ZZYyR1XFXa3GjEjQ9F1vJVRF724W1M7skGzg4qqby5JTe6at9n2QcqytWdvKy6dPDeksefgJBNF9WXbKKNZXnbe4QHV7rmbK30Don6u/DjQs1tku0nBl3305g3o0v7hUEXT3Y67KuZ2cbzhvnfzroiKKt9SH78Xlvpm3PJIT+sTBV16Lh3RIuxZ7s0rhdsTzg5+87aD99arN8558r8Ujps84F5GfJe3zSUX9h3N3OTmNrv75NOvZYsfDt7XuUSdT3vV16elUW99h2XSLvNMdKYeS2PMHgwtqnjzblbvFwknTzYc13TXwGet84c8npy5dmi1w8R1vwSG3XJKOaIfZhSJMPYIYexMPRhbrbWKm3Si2fyrFIZX/xHGcv4jYGEpWHwa9Eb1X49PMA9NSeqPV/0GZILSxc3FxdXV1VsEMjfB7euhkDvqfwLIPr9d8hdv/6fAVLUqusxc/Z3NsG3s0BErnjzMLrcJbdH0csvhFT+73o1osaiznlvYouPrJi1rsdTzpmPIY3f94Kcdh1zWyR6/2uFZZPSyhzfP2w6sNB5jPfflO8fiVh728pbVO5pt2Rw9cLp+l/aHXPd6rn758Kelr1vpRcsSTC08nzlsaSTXXKM5b1CjMaOHddpsPHX16wW1k14pCoNLXh/kLG4tvw0egTXOeX1yJa+XuV+ZETGvuv0ZPu+y1xTt2tvnhmSNj78Z+3tjJ7uV8wwb8mYbdq+yWseHbLtmMj263eKc9RsuH3ufPtQGRm+ysz2+cxnL3ryhkdGxZkW05Sjbh/v3Bh2osh59+qd9beQFhF3TKSFj7xdg6o09Ev2jgSqph1aRGYujXDtemq06sm602Y5x7zNdWr0QOosva6kgXiwMEPz+aB/0EPGQ1bFzVbp7u9u7JcYkCrGeSseYeFdPR7eYGFfHGA889PSIjRPcXVzd3GLivwPAw1pVh06t0+8GBz2dXPX1N3co5BoK4Z8AsJOAEFiCEDjW/18CQPRl9GR04l6Cl6Or0tFFUAoUAqPqQWCwgCBYDwKb/z0I/ItrZ/0I75Tn+9tpR7jmnp237+H7pmf8OsqKn/S83qf7xpzjTNG27OTiqaVF8j0jyiY/77ilwLta/cbNua96WGkY54/Xazrs8opjFQf7bfF28B9upRXWRFBXrwt8IFG9U5nYw2HoPNNlmh9MVme96JTSt3iZ1ehLj2eWXB+w8Gkfo/L2scXPh/2mO6Lt0Y5r/d4/85me2vpC1bC7BiVzk5PVbN4zs55qSbYkdVmx637FgMWn4o4G3Wpe+TK4pq70xlZGp1kP82tdWyxYObWl0mugTU+VZQGpd18PyWm5veHRKv+zK2/1aP564P67iXG9j5wtHD0u30p4+9TtRJzpmtZJQXz7nU35pxsKmi7xqmw8TbZ4fCLSNnYb4t3CT3jHxbg2MaJsTflHmOtF0YNTm9ZkwvQXDvHQQF+CHa9sIBh8d1Ltq12UjoL9J1yw+oYLXdLSEBzQUCmJKXExWQnmrQZmJadlpmTlUDATBC9XkYZ5u7ogmLl8PnQRD/+bOPvPEGxtZmR0AyF+p2lhb3Pz1nOyQ/s1Nz6XduTw8wd9a2fpa9643jRrlNFG5xKXR3XXdrcOtjybSS67R3ATDq00b/fqWXJ5x/b5i7bntM+YG6h6qabx9XkDxx9fPsBvxPncyy+3v/BYeDDa/8qqFb43bJJnGS1ZlDkg/LnBjMoa9xmZJeeye5kN8h81xkv/xIDuLLpM/qK1Kc6XGshrp2XZ3sp2DruqK0S+O5UfW3P4YK8AZchma53KlsLxTFtNm0b7PYN9S1x8px4t9ZKOiQ4Oz7OxY102tj/fKe7eKcfY5/6+98pl5E1AafHJ7pObhFYNWR70IuC4p49X8bpB0YsMivMPa00J99lVrtZLcvoLgvXEHokSNERk0BEfZ8sKEhT10OuHSCKClamGigp64FhBW6r2OTXRAxWWXhjp79dzjHiVmpPK4NNNJhbcnN272VJl2mKfbRcchQZf36TLqCjMOBJKBmI604a0+g7L+PK83i3DrWfdaazz0e4mF1oQWblQCPmEZe2EQMG/pE1Jq7Et/j6WfX05E11bhCCKYmH1UKytgKBcD8W8/hUiJw6YNp+u+mf8YoBEejcf0SRg1cO0lmtc1vd5yDv3X9ru7cNeAx93aOZ4vs0Kee3h+47KBZZHhoXMHmnRo9zXucOWsqXhRbfTt25a9y5nfbvMt80ftBpx6KbCIOXwoiJzxw/ykN/DjzreDjq1Lf3eUvUyyaLwG5smto94UdC66PnLp09uj23o5rMpvPBZqOUYu4V5JtNvzVA1fXEr+N3k0kNVOot+CT5gfGpKZoFdRupco3cmz0LPJR1pVBdterRs8nbrtTlx4X5lnY++v7+gW/jVuYy/n3OvV5dWnslz6f9xYYFO5cOUe8vKHHYcsNfkE36ec/l12QftJmoJXjOeD2kYtPXkzfCqE4NnGkYfdNfvdXW6abufHXescPMzeaKpZ0R6XHXvbnFs9n61J2P4yZ1SeZ1g32G2bYsyT77sd2jXo/QFEdMihs/ILzFuK4l6e3xBEpe1yOOxo7PBgbuZntqv0tb4JOW977I231U/wYyfeFXzWvyrtGMBZ04b3M/5XWXd6WqH6w0nFpdz1TrWLVdUvr+5bETAVtXegQm9Wwavbv0o+HFFds4Fzk0t1WSksuEtPuzqndLqO4GaK+Jn14XoOw3byVoMuVXQyjplz/QpBQfzL8y1WKkeXfSsbOXY5FGKPo5bs/sS05krXugPfaM/ymrz+ON9lgYqnQuv3M7wPU9+ig08eWz8wU2GH/jM/F0LfFcxLfvUpcydeUtzqeY6zxDZuT2+Qp5UFfH76Rf81k92o/ht8t/Ab8FTcBMQsd1dBZGMuijpoasgHv730v1/ht7zS/utuX657TS7YX2dGtzcfuv23jmdLUNWHLtqGGyl8eTkkpMdVmQJ5loPVc+GFei1m2HcetrK2dFCk0ukb9XQ7Y8mqGq85VVmP5twpOFhV6tx8168SjJx+Dj03njTB/eCF5Tusgw9lP/B/7jaiZ6rTqxurVL2fnG/6Unnba4EhK4ee+KOTYCTdfnYTl27KColDtV9pk4V+o97GSnM+/DTuVkVVRazfnp3SuelbGNoapd1/lPntyVBgYla1raJS2dVnpbmBpW9H71EK1BXLW/+6MddB9dCoWmIbAzRFAIeb7xmGbD1d8ew+avMBrdSDjoy93qzUdNLY5j1puprPr6duxaONWofVvee3bPbXP4FvX/FHlnyj9D7h4nwd+itWR+9xYdbC7mzP4Fv7lQhN//H8FsatzDmP+6eeZo5K/RLg0oWregwoNsrVR2nhP9vUP9vpe7Y15qzJu6Jlvh5XL2/bsWgy8dyOneENU5ZGd1TFTq/HtsxdMompzPaZZNTYzdFMIeDzXVC5lwd0vJWxNZV3QpNbprC2PKtg19MOvGoGTy5tWMKxx7Ib3vrWaje1U6/Tqu8l9/n7Mhdd2e8kDqPkdz/xc6qUXr1m4+Vg+c4qb9VvZW+zTB43s99ucyCTaXeRUmOezvzD2KjW+jPnmTe4paqkcv7I8qgbKWvfab8wIN037oxnM713VzMz8/ObzJ4GDxpxF53+54Ldj7cNlzeeuiZ0EyLJ8KhrYMToruDAafLn7qkO/u1z+bEbhWOzvfejxl7pHN41bz0Gf3KvTuceZOzc7nhkFjbp2Vzbd2kg4xiD/qapTbMeybf77D1eJuKO+8fDV9/e+HSLPdNwXszLLWbZMt9ukzOiApoo7utomJ1x6QD81vXjcyxGFmsJyRWtdbuaXSguJHFiTb37e9vfdX2iMOZCy4jOzSxa2vVK+pB+NPF1+bMO9Q0bXuudZZU60m2xc65ebuswzas6eM7oTQ7Zl3/Up3FO5cHPtNOq5no0m9t7fXOByZbHkzcPs90nHY84+u4KnLKpkqLO+tXH4pbNziMPdPKKaR8xupFg3+tKJk50OjitHE6Axs5uyyV9S/pPrnxzpKnow9ZnHto1ulg4ZN2N95CQtoE+fADKQfu9n+wZNYxpW0dv7d79IWOxqUXPjgXt3Dqqt/3oM6CGmWeCg5hlSUMgIDD7b/Hl388bfJtErkk93eRrn32XzWJUlF/hhpv4NuRXMkL9V/VE8nglz9UUSIo/VJrZLnqfHru+kG/uewvumB3ueP6NUJ8vT9RKMOFsBK7kTakI0khcSSTpNFJ7kSSRcxJGMkh6XiUhOdjsJVMckqbjLT6y8GalZOelpQZk56cY/6HoKKSByTgt1460rDwdjXXGmhscWXOPLRfEnfMqeCj5mDr+3qu67KdArPuhq489aq/pYHW2Le9qx74v9fuG63z8Y5yd26kziqjza652sT06oJXCttCl5PhF6LGHnzJ7cnTyWh9IH/oykGx86+4+6r2G7Dh0pRhu8vaPPWNlucZx4W92ahMuXhzaaMALiBef3KD7Rt91qufnhhmvWjQgjXS1ccyPR6qHx+XEFRx57RqdNWhwdsK1OMdLS52Ckj2rh6s9WsLw/C9WkmVib2Hris9uUa9zGdiN12XV6lj0me6rizOVr8W6HcgfnDvtMede8q9CxoEdrOJXNB+8bnbZ0KPxJ96nHRjePbsRkOKTPK2fzw6LqM0j7ER8hirbzaSKvMYPTylRb3y5/8aC/jxikQ9n+whGNZ3Sfm3lRXAD//6CqvU+DTLpvRUerp7uXpF/ckjD2Q9SlyXNsPEqN11h90nXRLiKhI9/oDXoq/kzi09Op918vHzWuvecPOWqStya7k1FjVvK6fvbbH7asI440bXbIyF4m4DziTlLDh7sdOKqoyUjNV7d9hm3ta4M/IQdtW4c3m6/rsmGS/dfsLit/jzmw3tx15eU1k8yu7UuNvehatVE95Ejra+8MHA/W7x09TGXFfLM5sH6L55lrrZsW3p4cGXGoZYbit4P8/0dlFGsbwuvPPuIuPbshGcIjF/xKvizQv3LP7Q0mB0Qq993mdULB4XtfeO0Bi6w9fRbrem/6AdH0cH/J5iPznxF2OttyFFk3YHbjmt9AioSAya23h0u7zIacXD773s90DjpXXyL4vsktbOCT0QuK3mSE6KTPOXYdzGlgXx5p3J/wF3GpjGDQplbmRzdHJlYW0NCmVuZG9iag0KMTI5OSAwIG9iag0KPDwvVHlwZS9NZXRhZGF0YS9TdWJ0eXBlL1hNTC9MZW5ndGggMzA2OD4+DQpzdHJlYW0NCjw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+PHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iMy4xLTcwMSI+CjxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CjxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiICB4bWxuczpwZGY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGRmLzEuMy8iPgo8cGRmOlByb2R1Y2VyPk1pY3Jvc29mdMKuIEV4Y2Vswq4gMjAxNjwvcGRmOlByb2R1Y2VyPjwvcmRmOkRlc2NyaXB0aW9uPgo8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIj4KPGRjOmNyZWF0b3I+PHJkZjpTZXE+PHJkZjpsaT5BbmR5IFNlbW91c3U8L3JkZjpsaT48L3JkZjpTZXE+PC9kYzpjcmVhdG9yPjwvcmRmOkRlc2NyaXB0aW9uPgo8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIj4KPHhtcDpDcmVhdG9yVG9vbD5NaWNyb3NvZnTCriBFeGNlbMKuIDIwMTY8L3htcDpDcmVhdG9yVG9vbD48eG1wOkNyZWF0ZURhdGU+MjAxNy0xMC0yMFQwOTo1MDo1MiswMjowMDwveG1wOkNyZWF0ZURhdGU+PHhtcDpNb2RpZnlEYXRlPjIwMTctMTAtMjBUMDk6NTA6NTIrMDI6MDA8L3htcDpNb2RpZnlEYXRlPjwvcmRmOkRlc2NyaXB0aW9uPgo8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiAgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iPgo8eG1wTU06RG9jdW1lbnRJRD51dWlkOkFBRkRERTdGLURCRTYtNDk2OC1CMDFDLTA1NUU1OTk2QzA1MjwveG1wTU06RG9jdW1lbnRJRD48eG1wTU06SW5zdGFuY2VJRD51dWlkOkFBRkRERTdGLURCRTYtNDk2OC1CMDFDLTA1NUU1OTk2QzA1MjwveG1wTU06SW5zdGFuY2VJRD48L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCjwvcmRmOlJERj48L3g6eG1wbWV0YT48P3hwYWNrZXQgZW5kPSJ3Ij8+DQplbmRzdHJlYW0NCmVuZG9iag0KMTMwMCAwIG9iag0KPDwvRGlzcGxheURvY1RpdGxlIHRydWU+Pg0KZW5kb2JqDQoxMzAxIDAgb2JqDQo8PC9UeXBlL1hSZWYvU2l6ZSAxMzAxL1dbIDEgNCAyXSAvUm9vdCAxIDAgUi9JbmZvIDMgMCBSL0lEWzw3RkRFRkRBQUU2REI2ODQ5QjAxQzA1NUU1OTk2QzA1Mj48N0ZERUZEQUFFNkRCNjg0OUIwMUMwNTVFNTk5NkMwNTI+XSAvRmlsdGVyL0ZsYXRlRGVjb2RlL0xlbmd0aCAyMzk0Pj4NCnN0cmVhbQ0KeJw12nf0lvMfx/H71UCEstKQrEKRrUVGRiiFiEKhUlSoUPYe2SpEkbKSURqEZBTJyoishlFoUUYZ/b5dj+/v/uN+nOs657rO/df9PO/z/pRKZZ9161L2Xb1UWs9YLCrI7IKK1QpqDMb0gm37FtTshuEFtVoV1G6EuQV1phVs17OgbqdSqUKpVKlyqmJTbIbNsQk2xkZllGr9/7lqZW9p3qu4KrtZB0EFVEQlVMYG2BDl76yCjbEJqmJT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Zg0KMDAwMDAwMDAyNCA2NTUzNSBmDQowMDAwMDAwMDI1IDY1NTM1IGYNCjAwMDAwMDAwMjYgNjU1MzUgZg0KMDAwMDAwMDAyNyA2NTUzNSBmDQowMDAwMDAwMDI4IDY1NTM1IGYNCjAwMDAwMDAwMjkgNjU1MzUgZg0KMDAwMDAwMDAzMCA2NTUzNSBmDQowMDAwMDAwMDMxIDY1NTM1IGYNCjAwMDAwMDAwMzIgNjU1MzUgZg0KMDAwMDAwMDAzMyA2NTUzNSBmDQowMDAwMDAwMDM0IDY1NTM1IGYNCjAwMDAwMDAwMzUgNjU1MzUgZg0KMDAwMDAwMDAzNiA2NTUzNSBmDQowMDAwMDAwMDM3IDY1NTM1IGYNCjAwMDAwMDAwMzggNjU1MzUgZg0KMDAwMDAwMDAzOSA2NTUzNSBmDQowMDAwMDAwMDQwIDY1NTM1IGYNCjAwMDAwMDAwNDEgNjU1MzUgZg0KMDAwMDAwMDA0MiA2NTUzNSBmDQowMDAwMDAwMDQzIDY1NTM1IGYNCjAwMDAwMDAwNDQgNjU1MzUgZg0KMDAwMDAwMDA0NSA2NTUzNSBmDQowMDAwMDAwMDQ2IDY1NTM1IGYNCjAwMDAwMDAwNDcgNjU1MzUgZg0KMDAwMDAwMDA0OCA2NTUzNSBmDQowMDAwMDAwMDQ5IDY1NTM1IGYNCjAwMDAwMDAwNTAgNjU1MzUgZg0KMDAwMDAwMDA1MSA2NTUzNSBmDQowMDAwMDAwMDUyIDY1NTM1IGYNCjAwMDAwMDAwNTMgNjU1MzUgZg0KMDAwMDAwMDA1NCA2NTUzNSBmDQowMDAwMDAwMDU1IDY1NTM1IGYNCjAwMDAwMDAwNTYgNjU1MzUgZg0KMDAwMDAwMDA1NyA2NTUzNSBmDQowMDAwMDAwMDU4IDY1NTM1IGYNCjAwMDAwMDAwNTkgNjU1MzUgZg0KMDAwMDAwMDA2MCA2NTUzNSBmDQowMDAwMDAwMDYxIDY1NTM1IGYNCjAwMDAwMDAwNjIgNjU1MzUgZg0KMDAwMDAwMDA2MyA2NTUzNSBmDQowMDAwMDAwMDY0IDY1NTM1IGYNCjAwMDAwMDAwNjUgNjU1MzUgZg0KMDAwMDAwMDA2NiA2NTUzNSBmDQowMDAwMDAwMDY3IDY1NTM1IGYNCjAwMDAwMDAwNjggNjU1MzUgZg0KMDAwMDAwMDA2OSA2NTUzNSBmDQowMDAwMDAwMDcwIDY1NTM1IGYNCjAwMDAwMDAwNzEgNjU1MzUgZg0KMDAwMDAwMDA3MiA2NTUzNSBmDQowMDAwMDAwMDczIDY1NTM1IGYNCjAwMDAwMDAwNzQgNjU1MzUgZg0KMDAwMDAwMDA3NSA2NTUzNSBmDQowMDAwMDAwMDc2IDY1NTM1IGYNCjAwMDAwMDAwNzcgNjU1MzUgZg0KMDAwMDAwMDA3OCA2NTUzNSBmDQowMDAwMDAwMDc5IDY1NTM1IGYNCjAwMDAwMDAwODAgNjU1MzUgZg0KMDAwMDAwMDA4MSA2NTUzNSBmDQowMDAwMDAwMDgyIDY1NTM1IGYNCjAwMDAwMDAwODMgNjU1MzUgZg0KMDAwMDAwMDA4NCA2NTUzNSBmDQowMDAwMDAwMDg1IDY1NTM1IGYNCjAwMDAwMDAwODYgNjU1MzUgZg0KMDAwMDAwMDA4NyA2NTUzNSBmDQowMDAwMDAwMDg4IDY1NTM1IGYNCjAwMDAwMDAwODkgNjU1MzUgZg0KMDAwMDAwMDA5MCA2NTUzNSBmDQowMDAwMDAwMDkxIDY1NTM1IGYNCjAwMDAwMDAwOTIgNjU1MzUgZg0KMDAwMDAwMDA5MyA2NTUzNSBmDQowMDAwMDAwMDk0IDY1NTM1IGYNCjAwMDAwMDAwOTUgNjU1MzUgZg0KMDAwMDAwMDA5NiA2NTUzNSBmDQowMDAwMDAwMDk3IDY1NTM1IGYNCjAwMDAwMDAwOTggNjU1MzUgZg0KMDAwMDAwMDA5OSA2NTUzNSBmDQowMDAwMDAwMTAwIDY1NTM1IGYNCjAwMDAwMDAxMDEgNjU1MzUgZg0KMDAwMDAwMDEwMiA2NTUzNSBmDQowMDAwMDAwMTAzIDY1NTM1IGYNCjAwMDAwMDAxMDQgNjU1MzUgZg0KMDAwMDAwMDEwNSA2NTUzNSBmDQowMDAwMDAwMTA2IDY1NTM1IGYNCjAwMDAwMDAxMDcgNjU1MzUgZg0KMDAwMDAwMDEwOCA2NTUzNSBmDQowMDAwMDAwMTA5IDY1NTM1IGYNCjAwMDAwMDAxMTAgNjU1MzUgZg0KMDAwMDAwMDExMSA2NTUzNSBmDQowMDAwMDAwMTEyIDY1NTM1IGYNCjAwMDAwMDAxMTMgNjU1MzUgZg0KMDAwMDAwMDExNCA2NTUzNSBmDQowMDAwMDAwMTE1IDY1NTM1IGYNCjAwMDAwMDAxMTYgNjU1MzUgZg0KMDAwMDAwMDExNyA2NTUzNSBmDQowMDAwMDAwMTE4IDY1NTM1IGYNCjAwMDAwMDAxMTkgNjU1MzUgZg0KMDAwMDAwMDEyMCA2NTUzNSBmDQowMDAwMDAwMTIxIDY1NTM1IGYNCjAwMDAwMDAxMjIgNjU1MzUgZg0KMDAwMDAwMDEyMyA2NTUzNSBmDQowMDAwMDAwMTI0IDY1NTM1IGYNCjAwMDAwMDAxMjUgNjU1MzUgZg0KMDAwMDAwMDEyNiA2NTUzNSBmDQowMDAwMDAwMTI3IDY1NTM1IGYNCjAwMDAwMDAxMjggNjU1MzUgZg0KMDAwMDAwMDEyOSA2NTUzNSBmDQowMDAwMDAwMTMwIDY1NTM1IGYNCjAwMDAwMDAxMzEgNjU1MzUgZg0KMDAwMDAwMDEzMiA2NTUzNSBmDQowMDAwMDAwMTMzIDY1NTM1IGYNCjAwMDAwMDAxMzQgNjU1MzUgZg0KMDAwMDAwMDEzNSA2NTUzNSBmDQowMDAwMDAwMTM2IDY1NTM1IGYNCjAwMDAwMDAxMzcgNjU1MzUgZg0KMDAwMDAwMDEzOCA2NTUzNSBmDQowMDAwMDAwMTM5IDY1NTM1IGYNCjAwMDAwMDAxNDAgNjU1MzUgZg0KMDAwMDAwMDE0MSA2NTUzNSBmDQowMDAwMDAwMTQyIDY1NTM1IGYNCjAwMDAwMDAxNDMgNjU1MzUgZg0KMDAwMDAwMDE0NCA2NTUzNSBmDQowMDAwMDAwMTQ1IDY1NTM1IGYNCjAwMDAwMDAxNDYgNjU1MzUgZg0KMDAwMDAwMDE0NyA2NTUzNSBmDQowMDAwMDAwMTQ4IDY1NTM1IGYNCjAwMDAwMDAxNDkgNjU1MzUgZg0KMDAwMDAwMDE1MCA2NTUzNSBmDQowMDAwMDAwMTUxIDY1NTM1IGYNCjAwMDAwMDAxNTIgNjU1MzUgZg0KMDAwMDAwMDE1MyA2NTUzNSBmDQowMDAwMDAwMTU0IDY1NTM1IGYNCjAwMDAwMDAxNTUgNjU1MzUgZg0KMDAwMDAwMDE1NiA2NTUzNSBmDQowMDAwMDAwMTU3IDY1NTM1IGYNCjAwMDAwMDAxNTggNjU1MzUgZg0KMDAwMDAwMDE1OSA2NTUzNSBmDQowMDAwMDAwMTYwIDY1NTM1IGYNCjAwMDAwMDAxNjEgNjU1MzUgZg0KMDAwMDAwMDE2MiA2NTUzNSBmDQowMDAwMDAwMTYzIDY1NTM1IGYNCjAwMDAwMDAxNjQgNjU1MzUgZg0KMDAwMDAwMDE2NSA2NTUzNSBmDQowMDAwMDAwMTY2IDY1NTM1IGYNCjAwMDAwMDAxNjcgNjU1MzUgZg0KMDAwMDAwMDE2OCA2NTUzNSBmDQowMDAwMDAwMTY5IDY1NTM1IGYNCjAwMDAwMDAxNzAgNjU1MzUgZg0KMDAwMDAwMDE3MSA2NTUzNSBmDQowMDAwMDAwMTcyIDY1NTM1IGYNCjAwMDAwMDAxNzMgNjU1MzUgZg0KMDAwMDAwMDE3NCA2NTUzNSBmDQowMDAwMDAwMTc1IDY1NTM1IGYNCjAwMDAwMDAxNzYgNjU1MzUgZg0KMDAwMDAwMDE3NyA2NTUzNSBmDQowMDAwMDAwMTc4IDY1NTM1IGYNCjAwMDAwMDAxNzkgNjU1MzUgZg0KMDAwMDAwMDE4MCA2NTUzNSBmDQowMDAwMDAwMTgxIDY1NTM1IGYNCjAwMDAwMDAxODIgNjU1MzUgZg0KMDAwMDAwMDE4MyA2NTUzNSBmDQowMDAwMDAwMTg0IDY1NTM1IGYNCjAwMDAwMDAxODUgNjU1MzUgZg0KMDAwMDAwMDE4NiA2NTUzNSBmDQowMDAwMDAwMTg3IDY1NTM1IGYNCjAwMDAwMDAxODggNjU1MzUgZg0KMDAwMDAwMDE4OSA2NTUzNSBmDQowMDAwMDAwMTkwIDY1NTM1IGYNCjAwMDAwMDAxOTEgNjU1MzUgZg0KMDAwMDAwMDE5MiA2NTUzNSBmDQowMDAwMDAwMTkzIDY1NTM1IGYNCjAwMDAwMDAxOTQgNjU1MzUgZg0KMDAwMDAwMDE5NSA2NTUzNSBmDQowMDAwMDAwMTk2IDY1NTM1IGYNCjAwMDAwMDAxOTcgNjU1MzUgZg0KMDAwMDAwMDE5OCA2NTUzNSBmDQowMDAwMDAwMTk5IDY1NTM1IGYNCjAwMDAwMDAyMDAgNjU1MzUgZg0KMDAwMDAwMDIwMSA2NTUzNSBmDQowMDAwMDAwMjAyIDY1NTM1IGYNCjAwMDAwMDAyMDMgNjU1MzUgZg0KMDAwMDAwMDIwNCA2NTUzNSBmDQowMDAwMDAwMjA1IDY1NTM1IGYNCjAwMDAwMDAyMDYgNjU1MzUgZg0KMDAwMDAwMDIwNyA2NTUzNSBmDQowMDAwMDAwMjA4IDY1NTM1IGYNCjAwMDAwMDAyMDkgNjU1MzUgZg0KMDAwMDAwMDIxMCA2NTUzNSBmDQowMDAwMDAwMjExIDY1NTM1IGYNCjAwMDAwMDAyMTIgNjU1MzUgZg0KMDAwMDAwMDIxMyA2NTUzNSBmDQowMDAwMDAwMjE0IDY1NTM1IGYNCjAwMDAwMDAyMTUgNjU1MzUgZg0KMDAwMDAwMDIxNiA2NTUzNSBmDQowMDAwMDAwMjE3IDY1NTM1IGYNCjAwMDAwMDAyMTggNjU1MzUgZg0KMDAwMDAwMDIxOSA2NTUzNSBmDQowMDAwMDAwMjIwIDY1NTM1IGYNCjAwMDAwMDAyMjEgNjU1MzUgZg0KMDAwMDAwMDIyMiA2NTUzNSBmDQowMDAwMDAwMjIzIDY1NTM1IGYNCjAwMDAwMDAyMjQgNjU1MzUgZg0KMDAwMDAwMDIyNSA2NTUzNSBmDQowMDAwMDAwMjI2IDY1NTM1IGYNCjAwMDAwMDAyMjcgNjU1MzUgZg0KMDAwMDAwMDIyOCA2NTUzNSBmDQowMDAwMDAwMjI5IDY1NTM1IGYNCjAwMDAwMDAyMzAgNjU1MzUgZg0KMDAwMDAwMDIzMSA2NTUzNSBmDQowMDAwMDAwMjMyIDY1NTM1IGYNCjAwMDAwMDAyMzMgNjU1MzUgZg0KMDAwMDAwMDIzNCA2NTUzNSBmDQowMDAwMDAwMjM1IDY1NTM1IGYNCjAwMDAwMDAyMzYgNjU1MzUgZg0KMDAwMDAwMDIzNyA2NTUzNSBmDQowMDAwMDAwMjM4IDY1NTM1IGYNCjAwMDAwMDAyMzkgNjU1MzUgZg0KMDAwMDAwMDI0MCA2NTUzNSBmDQowMDAwMDAwMjQxIDY1NTM1IGYNCjAwMDAwMDAyNDIgNjU1MzUgZg0KMDAwMDAwMDI0MyA2NTUzNSBmDQowMDAwMDAwMjQ0IDY1NTM1IGYNCjAwMDAwMDAyNDUgNjU1MzUgZg0KMDAwMDAwMDI0NiA2NTUzNSBmDQowMDAwMDAwMjQ3IDY1NTM1IGYNCjAwMDAwMDAyNDggNjU1MzUgZg0KMDAwMDAwMDI0OSA2NTUzNSBmDQowMDAwMDAwMjUwIDY1NTM1IGYNCjAwMDAwMDAyNTEgNjU1MzUgZg0KMDAwMDAwMDI1MiA2NTUzNSBmDQowMDAwMDAwMjUzIDY1NTM1IGYNCjAwMDAwMDAyNTQgNjU1MzUgZg0KMDAwMDAwMDI1NSA2NTUzNSBmDQowMDAwMDAwMjU2IDY1NTM1IGYNCjAwMDAwMDAyNTcgNjU1MzUgZg0KMDAwMDAwMDI1OCA2NTUzNSBmDQowMDAwMDAwMjU5IDY1NTM1IGYNCjAwMDAwMDAyNjAgNjU1MzUgZg0KMDAwMDAwMDI2MSA2NTUzNSBmDQowMDAwMDAwMjYyIDY1NTM1IGYNCjAwMDAwMDAyNjMgNjU1MzUgZg0KMDAwMDAwMDI2NCA2NTUzNSBmDQowMDAwMDAwMjY1IDY1NTM1IGYNCjAwMDAwMDAyNjYgNjU1MzUgZg0KMDAwMDAwMDI2NyA2NTUzNSBmDQowMDAwMDAwMjY4IDY1NTM1IGYNCjAwMDAwMDAyNjkgNjU1MzUgZg0KMDAwMDAwMDI3MCA2NTUzNSBmDQowMDAwMDAwMjcxIDY1NTM1IGYNCjAwMDAwMDAyNzIgNjU1MzUgZg0KMDAwMDAwMDI3MyA2NTUzNSBmDQowMDAwMDAwMjc0IDY1NTM1IGYNCjAwMDAwMDAyNzUgNjU1MzUgZg0KMDAwMDAwMDI3NiA2NTUzNSBmDQowMDAwMDAwMjc3IDY1NTM1IGYNCjAwMDAwMDAyNzggNjU1MzUgZg0KMDAwMDAwMDI3OSA2NTUzNSBmDQowMDAwMDAwMjgwIDY1NTM1IGYNCjAwMDAwMDAyODEgNjU1MzUgZg0KMDAwMDAwMDI4MiA2NTUzNSBmDQowMDAwMDAwMjgzIDY1NTM1IGYNCjAwMDAwMDAyODQgNjU1MzUgZg0KMDAwMDAwMDI4NSA2NTUzNSBmDQowMDAwMDAwMjg2IDY1NTM1IGYNCjAwMDAwMDAyODcgNjU1MzUgZg0KMDAwMDAwMDI4OCA2NTUzNSBmDQowMDAwMDAwMjg5IDY1NTM1IGYNCjAwMDAwMDAyOTAgNjU1MzUgZg0KMDAwMDAwMDI5MSA2NTUzNSBmDQowMDAwMDAwMjkyIDY1NTM1IGYNCjAwMDAwMDAyOTMgNjU1MzUgZg0KMDAwMDAwMDI5NCA2NTUzNSBmDQowMDAwMDAwMjk1IDY1NTM1IGYNCjAwMDAwMDAyOTYgNjU1MzUgZg0KMDAwMDAwMDI5NyA2NTUzNSBmDQowMDAwMDAwMjk4IDY1NTM1IGYNCjAwMDAwMDAyOTkgNjU1MzUgZg0KMDAwMDAwMDMwMCA2NTUzNSBmDQowMDAwMDAwMzAxIDY1NTM1IGYNCjAwMDAwMDAzMDIgNjU1MzUgZg0KMDAwMDAwMDMwMyA2NTUzNSBmDQowMDAwMDAwMzA0IDY1NTM1IGYNCjAwMDAwMDAzMDUgNjU1MzUgZg0KMDAwMDAwMDMwNiA2NTUzNSBmDQowMDAwMDAwMzA3IDY1NTM1IGYNCjAwMDAwMDAzMDggNjU1MzUgZg0KMDAwMDAwMDMwOSA2NTUzNSBmDQowMDAwMDAwMzEwIDY1NTM1IGYNCjAwMDAwMDAzMTEgNjU1MzUgZg0KMDAwMDAwMDMxMiA2NTUzNSBmDQowMDAwMDAwMzEzIDY1NTM1IGYNCjAwMDAwMDAzMTQgNjU1MzUgZg0KMDAwMDAwMDMxNSA2NTUzNSBmDQowMDAwMDAwMzE2IDY1NTM1IGYNCjAwMDAwMDAzMTcgNjU1MzUgZg0KMDAwMDAwMDMxOCA2NTUzNSBmDQowMDAwMDAwMzE5IDY1NTM1IGYNCjAwMDAwMDAzMjAgNjU1MzUgZg0KMDAwMDAwMDMyMSA2NTUzNSBmDQowMDAwMDAwMzIyIDY1NTM1IGYNCjAwMDAwMDAzMjMgNjU1MzUgZg0KMDAwMDAwMDMyNCA2NTUzNSBmDQowMDAwMDAwMzI1IDY1NTM1IGYNCjAwMDAwMDAzMjYgNjU1MzUgZg0KMDAwMDAwMDMyNyA2NTUzNSBmDQowMDAwMDAwMzI4IDY1NTM1IGYNCjAwMDAwMDAzMjkgNjU1MzUgZg0KMDAwMDAwMDMzMCA2NTUzNSBmDQowMDAwMDAwMzMxIDY1NTM1IGYNCjAwMDAwMDAzMzIgNjU1MzUgZg0KMDAwMDAwMDMzMyA2NTUzNSBmDQowMDAwMDAwMzM0IDY1NTM1IGYNCjAwMDAwMDAzMzUgNjU1MzUgZg0KMDAwMDAwMDMzNiA2NTUzNSBmDQowMDAwMDAwMzM3IDY1NTM1IGYNCjAwMDAwMDAzMzggNjU1MzUgZg0KMDAwMDAwMDMzOSA2NTUzNSBmDQowMDAwMDAwMzQwIDY1NTM1IGYNCjAwMDAwMDAzNDEgNjU1MzUgZg0KMDAwMDAwMDM0MiA2NTUzNSBmDQowMDAwMDAwMzQzIDY1NTM1IGYNCjAwMDAwMDAzNDQgNjU1MzUgZg0KMDAwMDAwMDM0NSA2NTUzNSBmDQowMDAwMDAwMzQ2IDY1NTM1IGYNCjAwMDAwMDAzNDcgNjU1MzUgZg0KMDAwMDAwMDM0OCA2NTUzNSBmDQowMDAwMDAwMzQ5IDY1NTM1IGYNCjAwMDAwMDAzNTAgNjU1MzUgZg0KMDAwMDAwMDM1MSA2NTUzNSBmDQowMDAwMDAwMzUyIDY1NTM1IGYNCjAwMDAwMDAzNTMgNjU1MzUgZg0KMDAwMDAwMDM1NCA2NTUzNSBmDQowMDAwMDAwMzU1IDY1NTM1IGYNCjAwMDAwMDAzNTYgNjU1MzUgZg0KMDAwMDAwMDM1NyA2NTUzNSBmDQowMDAwMDAwMzU4IDY1NTM1IGYNCjAwMDAwMDAzNTkgNjU1MzUgZg0KMDAwMDAwMDM2MCA2NTUzNSBmDQowMDAwMDAwMzYxIDY1NTM1IGYNCjAwMDAwMDAzNjIgNjU1MzUgZg0KMDAwMDAwMDM2MyA2NTUzNSBmDQowMDAwMDAwMzY0IDY1NTM1IGYNCjAwMDAwMDAzNjUgNjU1MzUgZg0KMDAwMDAwMDM2NiA2NTUzNSBmDQowMDAwMDAwMzY3IDY1NTM1IGYNCjAwMDAwMDAzNjggNjU1MzUgZg0KMDAwMDAwMDM2OSA2NTUzNSBmDQowMDAwMDAwMzcwIDY1NTM1IGYNCjAwMDAwMDAzNzEgNjU1MzUgZg0KMDAwMDAwMDM3MiA2NTUzNSBmDQowMDAwMDAwMzczIDY1NTM1IGYNCjAwMDAwMDAzNzQgNjU1MzUgZg0KMDAwMDAwMDM3NSA2NTUzNSBmDQowMDAwMDAwMzc2IDY1NTM1IGYNCjAwMDAwMDAzNzcgNjU1MzUgZg0KMDAwMDAwMDM3OCA2NTUzNSBmDQowMDAwMDAwMzc5IDY1NTM1IGYNCjAwMDAwMDAzODAgNjU1MzUgZg0KMDAwMDAwMDM4MSA2NTUzNSBmDQowMDAwMDAwMzgyIDY1NTM1IGYNCjAwMDAwMDAzODMgNjU1MzUgZg0KMDAwMDAwMDM4NCA2NTUzNSBmDQowMDAwMDAwMzg1IDY1NTM1IGYNCjAwMDAwMDAzODYgNjU1MzUgZg0KMDAwMDAwMDM4NyA2NTUzNSBmDQowMDAwMDAwMzg4IDY1NTM1IGYNCjAwMDAwMDAzODkgNjU1MzUgZg0KMDAwMDAwMDM5MCA2NTUzNSBmDQowMDAwMDAwMzkxIDY1NTM1IGYNCjAwMDAwMDAzOTIgNjU1MzUgZg0KMDAwMDAwMDM5MyA2NTUzNSBmDQowMDAwMDAwMzk0IDY1NTM1IGYNCjAwMDAwMDAzOTUgNjU1MzUgZg0KMDAwMDAwMDM5NiA2NTUzNSBmDQowMDAwMDAwMzk3IDY1NTM1IGYNCjAwMDAwMDAzOTggNjU1MzUgZg0KMDAwMDAwMDM5OSA2NTUzNSBmDQowMDAwMDAwNDAwIDY1NTM1IGYNCjAwMDAwMDA0MDEgNjU1MzUgZg0KMDAwMDAwMDQwMiA2NTUzNSBmDQowMDAwMDAwNDAzIDY1NTM1IGYNCjAwMDAwMDA0MDQgNjU1MzUgZg0KMDAwMDAwMDQwNSA2NTUzNSBmDQowMDAwMDAwNDA2IDY1NTM1IGYNCjAwMDAwMDA0MDcgNjU1MzUgZg0KMDAwMDAwMDQwOCA2NTUzNSBmDQowMDAwMDAwNDA5IDY1NTM1IGYNCjAwMDAwMDA0MTAgNjU1MzUgZg0KMDAwMDAwMDQxMSA2NTUzNSBmDQowMDAwMDAwNDEyIDY1NTM1IGYNCjAwMDAwMDA0MTMgNjU1MzUgZg0KMDAwMDAwMDQxNCA2NTUzNSBmDQowMDAwMDAwNDE1IDY1NTM1IGYNCjAwMDAwMDA0MTYgNjU1MzUgZg0KMDAwMDAwMDQxNyA2NTUzNSBmDQowMDAwMDAwNDE4IDY1NTM1IGYNCjAwMDAwMDA0MTkgNjU1MzUgZg0KMDAwMDAwMDQyMCA2NTUzNSBmDQowMDAwMDAwNDIxIDY1NTM1IGYNCjAwMDAwMDA0MjIgNjU1MzUgZg0KMDAwMDAwMDQyMyA2NTUzNSBmDQowMDAwMDAwNDI0IDY1NTM1IGYNCjAwMDAwMDA0MjUgNjU1MzUgZg0KMDAwMDAwMDQyNiA2NTUzNSBmDQowMDAwMDAwNDI3IDY1NTM1IGYNCjAwMDAwMDA0MjggNjU1MzUgZg0KMDAwMDAwMDQyOSA2NTUzNSBmDQowMDAwMDAwNDMwIDY1NTM1IGYNCjAwMDAwMDA0MzEgNjU1MzUgZg0KMDAwMDAwMDQzMiA2NTUzNSBmDQowMDAwMDAwNDMzIDY1NTM1IGYNCjAwMDAwMDA0MzQgNjU1MzUgZg0KMDAwMDAwMDQzNSA2NTUzNSBmDQowMDAwMDAwNDM2IDY1NTM1IGYNCjAwMDAwMDA0MzcgNjU1MzUgZg0KMDAwMDAwMDQzOCA2NTUzNSBmDQowMDAwMDAwNDM5IDY1NTM1IGYNCjAwMDAwMDA0NDAgNjU1MzUgZg0KMDAwMDAwMDQ0MSA2NTUzNSBmDQowMDAwMDAwNDQyIDY1NTM1IGYNCjAwMDAwMDA0NDMgNjU1MzUgZg0KMDAwMDAwMDQ0NCA2NTUzNSBmDQowMDAwMDAwNDQ1IDY1NTM1IGYNCjAwMDAwMDA0NDYgNjU1MzUgZg0KMDAwMDAwMDQ0NyA2NTUzNSBmDQowMDAwMDAwNDQ4IDY1NTM1IGYNCjAwMDAwMDA0NDkgNjU1MzUgZg0KMDAwMDAwMDQ1MCA2NTUzNSBmDQowMDAwMDAwNDUxIDY1NTM1IGYNCjAwMDAwMDA0NTIgNjU1MzUgZg0KMDAwMDAwMDQ1MyA2NTUzNSBmDQowMDAwMDAwNDU0IDY1NTM1IGYNCjAwMDAwMDA0NTUgNjU1MzUgZg0KMDAwMDAwMDQ1NiA2NTUzNSBmDQowMDAwMDAwNDU3IDY1NTM1IGYNCjAwMDAwMDA0NTggNjU1MzUgZg0KMDAwMDAwMDQ1OSA2NTUzNSBmDQowMDAwMDAwNDYwIDY1NTM1IGYNCjAwMDAwMDA0NjEgNjU1MzUgZg0KMDAwMDAwMDQ2MiA2NTUzNSBmDQowMDAwMDAwNDYzIDY1NTM1IGYNCjAwMDAwMDA0NjQgNjU1MzUgZg0KMDAwMDAwMDQ2NSA2NTUzNSBmDQowMDAwMDAwNDY2IDY1NTM1IGYNCjAwMDAwMDA0NjcgNjU1MzUgZg0KMDAwMDAwMDQ2OCA2NTUzNSBmDQowMDAwMDAwNDY5IDY1NTM1IGYNCjAwMDAwMDA0NzAgNjU1MzUgZg0KMDAwMDAwMDQ3MSA2NTUzNSBmDQowMDAwMDAwNDcyIDY1NTM1IGYNCjAwMDAwMDA0NzMgNjU1MzUgZg0KMDAwMDAwMDQ3NCA2NTUzNSBmDQowMDAwMDAwNDc1IDY1NTM1IGYNCjAwMDAwMDA0NzYgNjU1MzUgZg0KMDAwMDAwMDQ3NyA2NTUzNSBmDQowMDAwMDAwNDc4IDY1NTM1IGYNCjAwMDAwMDA0NzkgNjU1MzUgZg0KMDAwMDAwMDQ4MCA2NTUzNSBmDQowMDAwMDAwNDgxIDY1NTM1IGYNCjAwMDAwMDA0ODIgNjU1MzUgZg0KMDAwMDAwMDQ4MyA2NTUzNSBmDQowMDAwMDAwNDg0IDY1NTM1IGYNCjAwMDAwMDA0ODUgNjU1MzUgZg0KMDAwMDAwMDQ4NiA2NTUzNSBmDQowMDAwMDAwNDg3IDY1NTM1IGYNCjAwMDAwMDA0ODggNjU1MzUgZg0KMDAwMDAwMDQ4OSA2NTUzNSBmDQowMDAwMDAwNDkwIDY1NTM1IGYNCjAwMDAwMDA0OTEgNjU1MzUgZg0KMDAwMDAwMDQ5MiA2NTUzNSBmDQowMDAwMDAwNDkzIDY1NTM1IGYNCjAwMDAwMDA0OTQgNjU1MzUgZg0KMDAwMDAwMDQ5NSA2NTUzNSBmDQowMDAwMDAwNDk2IDY1NTM1IGYNCjAwMDAwMDA0OTcgNjU1MzUgZg0KMDAwMDAwMDQ5OCA2NTUzNSBmDQowMDAwMDAwNDk5IDY1NTM1IGYNCjAwMDAwMDA1MDAgNjU1MzUgZg0KMDAwMDAwMDUwMSA2NTUzNSBmDQowMDAwMDAwNTAyIDY1NTM1IGYNCjAwMDAwMDA1MDMgNjU1MzUgZg0KMDAwMDAwMDUwNCA2NTUzNSBmDQowMDAwMDAwNTA1IDY1NTM1IGYNCjAwMDAwMDA1MDYgNjU1MzUgZg0KMDAwMDAwMDUwNyA2NTUzNSBmDQowMDAwMDAwNTA4IDY1NTM1IGYNCjAwMDAwMDA1MDkgNjU1MzUgZg0KMDAwMDAwMDUxMCA2NTUzNSBmDQowMDAwMDAwNTExIDY1NTM1IGYNCjAwMDAwMDA1MTIgNjU1MzUgZg0KMDAwMDAwMDUxMyA2NTUzNSBmDQowMDAwMDAwNTE0IDY1NTM1IGYNCjAwMDAwMDA1MTUgNjU1MzUgZg0KMDAwMDAwMDUxNiA2NTUzNSBmDQowMDAwMDAwNTE3IDY1NTM1IGYNCjAwMDAwMDA1MTggNjU1MzUgZg0KMDAwMDAwMDUxOSA2NTUzNSBmDQowMDAwMDAwNTIwIDY1NTM1IGYNCjAwMDAwMDA1MjEgNjU1MzUgZg0KMDAwMDAwMDUyMiA2NTUzNSBmDQowMDAwMDAwNTIzIDY1NTM1IGYNCjAwMDAwMDA1MjQgNjU1MzUgZg0KMDAwMDAwMDUyNSA2NTUzNSBmDQowMDAwMDAwNTI2IDY1NTM1IGYNCjAwMDAwMDA1MjcgNjU1MzUgZg0KMDAwMDAwMDUyOCA2NTUzNSBmDQowMDAwMDAwNTI5IDY1NTM1IGYNCjAwMDAwMDA1MzAgNjU1MzUgZg0KMDAwMDAwMDUzMSA2NTUzNSBmDQowMDAwMDAwNTMyIDY1NTM1IGYNCjAwMDAwMDA1MzMgNjU1MzUgZg0KMDAwMDAwMDUzNCA2NTUzNSBmDQowMDAwMDAwNTM1IDY1NTM1IGYNCjAwMDAwMDA1MzYgNjU1MzUgZg0KMDAwMDAwMDUzNyA2NTUzNSBmDQowMDAwMDAwNTM4IDY1NTM1IGYNCjAwMDAwMDA1MzkgNjU1MzUgZg0KMDAwMDAwMDU0MCA2NTUzNSBmDQowMDAwMDAwNTQxIDY1NTM1IGYNCjAwMDAwMDA1NDIgNjU1MzUgZg0KMDAwMDAwMDU0MyA2NTUzNSBmDQowMDAwMDAwNTQ0IDY1NTM1IGYNCjAwMDAwMDA1NDUgNjU1MzUgZg0KMDAwMDAwMDU0NiA2NTUzNSBmDQowMDAwMDAwNTQ3IDY1NTM1IGYNCjAwMDAwMDA1NDggNjU1MzUgZg0KMDAwMDAwMDU0OSA2NTUzNSBmDQowMDAwMDAwNTUwIDY1NTM1IGYNCjAwMDAwMDA1NTEgNjU1MzUgZg0KMDAwMDAwMDU1MiA2NTUzNSBmDQowMDAwMDAwNTUzIDY1NTM1IGYNCjAwMDAwMDA1NTQgNjU1MzUgZg0KMDAwMDAwMDU1NSA2NTUzNSBmDQowMDAwMDAwNTU2IDY1NTM1IGYNCjAwMDAwMDA1NTcgNjU1MzUgZg0KMDAwMDAwMDU1OCA2NTUzNSBmDQowMDAwMDAwNTU5IDY1NTM1IGYNCjAwMDAwMDA1NjAgNjU1MzUgZg0KMDAwMDAwMDU2MSA2NTUzNSBmDQowMDAwMDAwNTYyIDY1NTM1IGYNCjAwMDAwMDA1NjMgNjU1MzUgZg0KMDAwMDAwMDU2NCA2NTUzNSBmDQowMDAwMDAwNTY1IDY1NTM1IGYNCjAwMDAwMDA1NjYgNjU1MzUgZg0KMDAwMDAwMDU2NyA2NTUzNSBmDQowMDAwMDAwNTY4IDY1NTM1IGYNCjAwMDAwMDA1NjkgNjU1MzUgZg0KMDAwMDAwMDU3MCA2NTUzNSBmDQowMDAwMDAwNTcxIDY1NTM1IGYNCjAwMDAwMDA1NzIgNjU1MzUgZg0KMDAwMDAwMDU3MyA2NTUzNSBmDQowMDAwMDAwNTc0IDY1NTM1IGYNCjAwMDAwMDA1NzUgNjU1MzUgZg0KMDAwMDAwMDU3NiA2NTUzNSBmDQowMDAwMDAwNTc3IDY1NTM1IGYNCjAwMDAwMDA1NzggNjU1MzUgZg0KMDAwMDAwMDU3OSA2NTUzNSBmDQowMDAwMDAwNTgwIDY1NTM1IGYNCjAwMDAwMDA1ODEgNjU1MzUgZg0KMDAwMDAwMDU4MiA2NTUzNSBmDQowMDAwMDAwNTgzIDY1NTM1IGYNCjAwMDAwMDA1ODQgNjU1MzUgZg0KMDAwMDAwMDU4NSA2NTUzNSBmDQowMDAwMDAwNTg2IDY1NTM1IGYNCjAwMDAwMDA1ODcgNjU1MzUgZg0KMDAwMDAwMDU4OCA2NTUzNSBmDQowMDAwMDAwNTg5IDY1NTM1IGYNCjAwMDAwMDA1OTAgNjU1MzUgZg0KMDAwMDAwMDU5MSA2NTUzNSBmDQowMDAwMDAwNTkyIDY1NTM1IGYNCjAwMDAwMDA1OTMgNjU1MzUgZg0KMDAwMDAwMDU5NCA2NTUzNSBmDQowMDAwMDAwNTk1IDY1NTM1IGYNCjAwMDAwMDA1OTYgNjU1MzUgZg0KMDAwMDAwMDU5NyA2NTUzNSBmDQowMDAwMDAwNTk4IDY1NTM1IGYNCjAwMDAwMDA1OTkgNjU1MzUgZg0KMDAwMDAwMDYwMCA2NTUzNSBmDQowMDAwMDAwNjAxIDY1NTM1IGYNCjAwMDAwMDA2MDIgNjU1MzUgZg0KMDAwMDAwMDYwMyA2NTUzNSBmDQowMDAwMDAwNjA0IDY1NTM1IGYNCjAwMDAwMDA2MDUgNjU1MzUgZg0KMDAwMDAwMDYwNiA2NTUzNSBmDQowMDAwMDAwNjA3IDY1NTM1IGYNCjAwMDAwMDA2MDggNjU1MzUgZg0KMDAwMDAwMDYwOSA2NTUzNSBmDQowMDAwMDAwNjEwIDY1NTM1IGYNCjAwMDAwMDA2MTEgNjU1MzUgZg0KMDAwMDAwMDYxMiA2NTUzNSBmDQowMDAwMDAwNjEzIDY1NTM1IGYNCjAwMDAwMDA2MTQgNjU1MzUgZg0KMDAwMDAwMDYxNSA2NTUzNSBmDQowMDAwMDAwNjE2IDY1NTM1IGYNCjAwMDAwMDA2MTcgNjU1MzUgZg0KMDAwMDAwMDYxOCA2NTUzNSBmDQowMDAwMDAwNjE5IDY1NTM1IGYNCjAwMDAwMDA2MjAgNjU1MzUgZg0KMDAwMDAwMDYyMSA2NTUzNSBmDQowMDAwMDAwNjIyIDY1NTM1IGYNCjAwMDAwMDA2MjMgNjU1MzUgZg0KMDAwMDAwMDYyNCA2NTUzNSBmDQowMDAwMDAwNjI1IDY1NTM1IGYNCjAwMDAwMDA2MjYgNjU1MzUgZg0KMDAwMDAwMDYyNyA2NTUzNSBmDQowMDAwMDAwNjI4IDY1NTM1IGYNCjAwMDAwMDA2MjkgNjU1MzUgZg0KMDAwMDAwMDYzMCA2NTUzNSBmDQowMDAwMDAwNjMxIDY1NTM1IGYNCjAwMDAwMDA2MzIgNjU1MzUgZg0KMDAwMDAwMDYzMyA2NTUzNSBmDQowMDAwMDAwNjM0IDY1NTM1IGYNCjAwMDAwMDA2MzUgNjU1MzUgZg0KMDAwMDAwMDYzNiA2NTUzNSBmDQowMDAwMDAwNjM3IDY1NTM1IGYNCjAwMDAwMDA2MzggNjU1MzUgZg0KMDAwMDAwMDYzOSA2NTUzNSBmDQowMDAwMDAwNjQwIDY1NTM1IGYNCjAwMDAwMDA2NDEgNjU1MzUgZg0KMDAwMDAwMDY0MiA2NTUzNSBmDQowMDAwMDAwNjQzIDY1NTM1IGYNCjAwMDAwMDA2NDQgNjU1MzUgZg0KMDAwMDAwMDY0NSA2NTUzNSBmDQowMDAwMDAwNjQ2IDY1NTM1IGYNCjAwMDAwMDA2NDcgNjU1MzUgZg0KMDAwMDAwMDY0OCA2NTUzNSBmDQowMDAwMDAwNjQ5IDY1NTM1IGYNCjAwMDAwMDA2NTAgNjU1MzUgZg0KMDAwMDAwMDY1MSA2NTUzNSBmDQowMDAwMDAwNjUyIDY1NTM1IGYNCjAwMDAwMDA2NTMgNjU1MzUgZg0KMDAwMDAwMDY1NCA2NTUzNSBmDQowMDAwMDAwNjU1IDY1NTM1IGYNCjAwMDAwMDA2NTYgNjU1MzUgZg0KMDAwMDAwMDY1NyA2NTUzNSBmDQowMDAwMDAwNjU4IDY1NTM1IGYNCjAwMDAwMDA2NTkgNjU1MzUgZg0KMDAwMDAwMDY2MCA2NTUzNSBmDQowMDAwMDAwNjYxIDY1NTM1IGYNCjAwMDAwMDA2NjIgNjU1MzUgZg0KMDAwMDAwMDY2MyA2NTUzNSBmDQowMDAwMDAwNjY0IDY1NTM1IGYNCjAwMDAwMDA2NjUgNjU1MzUgZg0KMDAwMDAwMDY2NiA2NTUzNSBmDQowMDAwMDAwNjY3IDY1NTM1IGYNCjAwMDAwMDA2NjggNjU1MzUgZg0KMDAwMDAwMDY2OSA2NTUzNSBmDQowMDAwMDAwNjcwIDY1NTM1IGYNCjAwMDAwMDA2NzEgNjU1MzUgZg0KMDAwMDAwMDY3MiA2NTUzNSBmDQowMDAwMDAwNjczIDY1NTM1IGYNCjAwMDAwMDA2NzQgNjU1MzUgZg0KMDAwMDAwMDY3NSA2NTUzNSBmDQowMDAwMDAwNjc2IDY1NTM1IGYNCjAwMDAwMDA2NzcgNjU1MzUgZg0KMDAwMDAwMDY3OCA2NTUzNSBmDQowMDAwMDAwNjc5IDY1NTM1IGYNCjAwMDAwMDA2ODAgNjU1MzUgZg0KMDAwMDAwMDY4MSA2NTUzNSBmDQowMDAwMDAwNjgyIDY1NTM1IGYNCjAwMDAwMDA2ODMgNjU1MzUgZg0KMDAwMDAwMDY4NCA2NTUzNSBmDQowMDAwMDAwNjg1IDY1NTM1IGYNCjAwMDAwMDA2ODYgNjU1MzUgZg0KMDAwMDAwMDY4NyA2NTUzNSBmDQowMDAwMDAwNjg4IDY1NTM1IGYNCjAwMDAwMDA2ODkgNjU1MzUgZg0KMDAwMDAwMDY5MCA2NTUzNSBmDQowMDAwMDAwNjkxIDY1NTM1IGYNCjAwMDAwMDA2OTIgNjU1MzUgZg0KMDAwMDAwMDY5MyA2NTUzNSBmDQowMDAwMDAwNjk0IDY1NTM1IGYNCjAwMDAwMDA2OTUgNjU1MzUgZg0KMDAwMDAwMDY5NiA2NTUzNSBmDQowMDAwMDAwNjk3IDY1NTM1IGYNCjAwMDAwMDA2OTggNjU1MzUgZg0KMDAwMDAwMDY5OSA2NTUzNSBmDQowMDAwMDAwNzAwIDY1NTM1IGYNCjAwMDAwMDA3MDEgNjU1MzUgZg0KMDAwMDAwMDcwMiA2NTUzNSBmDQowMDAwMDAwNzAzIDY1NTM1IGYNCjAwMDAwMDA3MDQgNjU1MzUgZg0KMDAwMDAwMDcwNSA2NTUzNSBmDQowMDAwMDAwNzA2IDY1NTM1IGYNCjAwMDAwMDA3MDcgNjU1MzUgZg0KMDAwMDAwMDcwOCA2NTUzNSBmDQowMDAwMDAwNzA5IDY1NTM1IGYNCjAwMDAwMDA3MTAgNjU1MzUgZg0KMDAwMDAwMDcxMSA2NTUzNSBmDQowMDAwMDAwNzEyIDY1NTM1IGYNCjAwMDAwMDA3MTMgNjU1MzUgZg0KMDAwMDAwMDcxNCA2NTUzNSBmDQowMDAwMDAwNzE1IDY1NTM1IGYNCjAwMDAwMDA3MTYgNjU1MzUgZg0KMDAwMDAwMDcxNyA2NTUzNSBmDQowMDAwMDAwNzE4IDY1NTM1IGYNCjAwMDAwMDA3MTkgNjU1MzUgZg0KMDAwMDAwMDcyMCA2NTUzNSBmDQowMDAwMDAwNzIxIDY1NTM1IGYNCjAwMDAwMDA3MjIgNjU1MzUgZg0KMDAwMDAwMDcyMyA2NTUzNSBmDQowMDAwMDAwNzI0IDY1NTM1IGYNCjAwMDAwMDA3MjUgNjU1MzUgZg0KMDAwMDAwMDcyNiA2NTUzNSBmDQowMDAwMDAwNzI3IDY1NTM1IGYNCjAwMDAwMDA3MjggNjU1MzUgZg0KMDAwMDAwMDcyOSA2NTUzNSBmDQowMDAwMDAwNzMwIDY1NTM1IGYNCjAwMDAwMDA3MzEgNjU1MzUgZg0KMDAwMDAwMDczMiA2NTUzNSBmDQowMDAwMDAwNzMzIDY1NTM1IGYNCjAwMDAwMDA3MzQgNjU1MzUgZg0KMDAwMDAwMDczNSA2NTUzNSBmDQowMDAwMDAwNzM2IDY1NTM1IGYNCjAwMDAwMDA3MzcgNjU1MzUgZg0KMDAwMDAwMDczOCA2NTUzNSBmDQowMDAwMDAwNzM5IDY1NTM1IGYNCjAwMDAwMDA3NDAgNjU1MzUgZg0KMDAwMDAwMDc0MSA2NTUzNSBmDQowMDAwMDAwNzQyIDY1NTM1IGYNCjAwMDAwMDA3NDMgNjU1MzUgZg0KMDAwMDAwMDc0NCA2NTUzNSBmDQowMDAwMDAwNzQ1IDY1NTM1IGYNCjAwMDAwMDA3NDYgNjU1MzUgZg0KMDAwMDAwMDc0NyA2NTUzNSBmDQowMDAwMDAwNzQ4IDY1NTM1IGYNCjAwMDAwMDA3NDkgNjU1MzUgZg0KMDAwMDAwMDc1MCA2NTUzNSBmDQowMDAwMDAwNzUxIDY1NTM1IGYNCjAwMDAwMDA3NTIgNjU1MzUgZg0KMDAwMDAwMDc1MyA2NTUzNSBmDQowMDAwMDAwNzU0IDY1NTM1IGYNCjAwMDAwMDA3NTUgNjU1MzUgZg0KMDAwMDAwMDc1NiA2NTUzNSBmDQowMDAwMDAwNzU3IDY1NTM1IGYNCjAwMDAwMDA3NTggNjU1MzUgZg0KMDAwMDAwMDc1OSA2NTUzNSBmDQowMDAwMDAwNzYwIDY1NTM1IGYNCjAwMDAwMDA3NjEgNjU1MzUgZg0KMDAwMDAwMDc2MiA2NTUzNSBmDQowMDAwMDAwNzYzIDY1NTM1IGYNCjAwMDAwMDA3NjQgNjU1MzUgZg0KMDAwMDAwMDc2NSA2NTUzNSBmDQowMDAwMDAwNzY2IDY1NTM1IGYNCjAwMDAwMDA3NjcgNjU1MzUgZg0KMDAwMDAwMDc2OCA2NTUzNSBmDQowMDAwMDAwNzY5IDY1NTM1IGYNCjAwMDAwMDA3NzAgNjU1MzUgZg0KMDAwMDAwMDc3MSA2NTUzNSBmDQowMDAwMDAwNzcyIDY1NTM1IGYNCjAwMDAwMDA3NzMgNjU1MzUgZg0KMDAwMDAwMDc3NCA2NTUzNSBmDQowMDAwMDAwNzc1IDY1NTM1IGYNCjAwMDAwMDA3NzYgNjU1MzUgZg0KMDAwMDAwMDc3NyA2NTUzNSBmDQowMDAwMDAwNzc4IDY1NTM1IGYNCjAwMDAwMDA3NzkgNjU1MzUgZg0KMDAwMDAwMDc4MCA2NTUzNSBmDQowMDAwMDAwNzgxIDY1NTM1IGYNCjAwMDAwMDA3ODIgNjU1MzUgZg0KMDAwMDAwMDc4MyA2NTUzNSBmDQowMDAwMDAwNzg0IDY1NTM1IGYNCjAwMDAwMDA3ODUgNjU1MzUgZg0KMDAwMDAwMDc4NiA2NTUzNSBmDQowMDAwMDAwNzg3IDY1NTM1IGYNCjAwMDAwMDA3ODggNjU1MzUgZg0KMDAwMDAwMDc4OSA2NTUzNSBmDQowMDAwMDAwNzkwIDY1NTM1IGYNCjAwMDAwMDA3OTEgNjU1MzUgZg0KMDAwMDAwMDc5MiA2NTUzNSBmDQowMDAwMDAwNzkzIDY1NTM1IGYNCjAwMDAwMDA3OTQgNjU1MzUgZg0KMDAwMDAwMDc5NSA2NTUzNSBmDQowMDAwMDAwNzk2IDY1NTM1IGYNCjAwMDAwMDA3OTcgNjU1MzUgZg0KMDAwMDAwMDc5OCA2NTUzNSBmDQowMDAwMDAwNzk5IDY1NTM1IGYNCjAwMDAwMDA4MDAgNjU1MzUgZg0KMDAwMDAwMDgwMSA2NTUzNSBmDQowMDAwMDAwODAyIDY1NTM1IGYNCjAwMDAwMDA4MDMgNjU1MzUgZg0KMDAwMDAwMDgwNCA2NTUzNSBmDQowMDAwMDAwODA1IDY1NTM1IGYNCjAwMDAwMDA4MDYgNjU1MzUgZg0KMDAwMDAwMDgwNyA2NTUzNSBmDQowMDAwMDAwODA4IDY1NTM1IGYNCjAwMDAwMDA4MDkgNjU1MzUgZg0KMDAwMDAwMDgxMCA2NTUzNSBmDQowMDAwMDAwODExIDY1NTM1IGYNCjAwMDAwMDA4MTIgNjU1MzUgZg0KMDAwMDAwMDgxMyA2NTUzNSBmDQowMDAwMDAwODE0IDY1NTM1IGYNCjAwMDAwMDA4MTUgNjU1MzUgZg0KMDAwMDAwMDgxNiA2NTUzNSBmDQowMDAwMDAwODE3IDY1NTM1IGYNCjAwMDAwMDA4MTggNjU1MzUgZg0KMDAwMDAwMDgxOSA2NTUzNSBmDQowMDAwMDAwODIwIDY1NTM1IGYNCjAwMDAwMDA4MjEgNjU1MzUgZg0KMDAwMDAwMDgyMiA2NTUzNSBmDQowMDAwMDAwODIzIDY1NTM1IGYNCjAwMDAwMDA4MjQgNjU1MzUgZg0KMDAwMDAwMDgyNSA2NTUzNSBmDQowMDAwMDAwODI2IDY1NTM1IGYNCjAwMDAwMDA4MjcgNjU1MzUgZg0KMDAwMDAwMDgyOCA2NTUzNSBmDQowMDAwMDAwODI5IDY1NTM1IGYNCjAwMDAwMDA4MzAgNjU1MzUgZg0KMDAwMDAwMDgzMSA2NTUzNSBmDQowMDAwMDAwODMyIDY1NTM1IGYNCjAwMDAwMDA4MzMgNjU1MzUgZg0KMDAwMDAwMDgzNCA2NTUzNSBmDQowMDAwMDAwODM1IDY1NTM1IGYNCjAwMDAwMDA4MzYgNjU1MzUgZg0KMDAwMDAwMDgzNyA2NTUzNSBmDQowMDAwMDAwODM4IDY1NTM1IGYNCjAwMDAwMDA4MzkgNjU1MzUgZg0KMDAwMDAwMDg0MCA2NTUzNSBmDQowMDAwMDAwODQxIDY1NTM1IGYNCjAwMDAwMDA4NDIgNjU1MzUgZg0KMDAwMDAwMDg0MyA2NTUzNSBmDQowMDAwMDAwODQ0IDY1NTM1IGYNCjAwMDAwMDA4NDUgNjU1MzUgZg0KMDAwMDAwMDg0NiA2NTUzNSBmDQowMDAwMDAwODQ3IDY1NTM1IGYNCjAwMDAwMDA4NDggNjU1MzUgZg0KMDAwMDAwMDg0OSA2NTUzNSBmDQowMDAwMDAwODUwIDY1NTM1IGYNCjAwMDAwMDA4NTEgNjU1MzUgZg0KMDAwMDAwMDg1MiA2NTUzNSBmDQowMDAwMDAwODUzIDY1NTM1IGYNCjAwMDAwMDA4NTQgNjU1MzUgZg0KMDAwMDAwMDg1NSA2NTUzNSBmDQowMDAwMDAwODU2IDY1NTM1IGYNCjAwMDAwMDA4NTcgNjU1MzUgZg0KMDAwMDAwMDg1OCA2NTUzNSBmDQowMDAwMDAwODU5IDY1NTM1IGYNCjAwMDAwMDA4NjAgNjU1MzUgZg0KMDAwMDAwMDg2MSA2NTUzNSBmDQowMDAwMDAwODYyIDY1NTM1IGYNCjAwMDAwMDA4NjMgNjU1MzUgZg0KMDAwMDAwMDg2NCA2NTUzNSBmDQowMDAwMDAwODY1IDY1NTM1IGYNCjAwMDAwMDA4NjYgNjU1MzUgZg0KMDAwMDAwMDg2NyA2NTUzNSBmDQowMDAwMDAwODY4IDY1NTM1IGYNCjAwMDAwMDA4NjkgNjU1MzUgZg0KMDAwMDAwMDg3MCA2NTUzNSBmDQowMDAwMDAwODcxIDY1NTM1IGYNCjAwMDAwMDA4NzIgNjU1MzUgZg0KMDAwMDAwMDg3MyA2NTUzNSBmDQowMDAwMDAwODc0IDY1NTM1IGYNCjAwMDAwMDA4NzUgNjU1MzUgZg0KMDAwMDAwMDg3NiA2NTUzNSBmDQowMDAwMDAwODc3IDY1NTM1IGYNCjAwMDAwMDA4NzggNjU1MzUgZg0KMDAwMDAwMDg3OSA2NTUzNSBmDQowMDAwMDAwODgwIDY1NTM1IGYNCjAwMDAwMDA4ODEgNjU1MzUgZg0KMDAwMDAwMDg4MiA2NTUzNSBmDQowMDAwMDAwODgzIDY1NTM1IGYNCjAwMDAwMDA4ODQgNjU1MzUgZg0KMDAwMDAwMDg4NSA2NTUzNSBmDQowMDAwMDAwODg2IDY1NTM1IGYNCjAwMDAwMDA4ODcgNjU1MzUgZg0KMDAwMDAwMDg4OCA2NTUzNSBmDQowMDAwMDAwODg5IDY1NTM1IGYNCjAwMDAwMDA4OTAgNjU1MzUgZg0KMDAwMDAwMDg5MSA2NTUzNSBmDQowMDAwMDAwODkyIDY1NTM1IGYNCjAwMDAwMDA4OTMgNjU1MzUgZg0KMDAwMDAwMDg5NCA2NTUzNSBmDQowMDAwMDAwODk1IDY1NTM1IGYNCjAwMDAwMDA4OTYgNjU1MzUgZg0KMDAwMDAwMDg5NyA2NTUzNSBmDQowMDAwMDAwODk4IDY1NTM1IGYNCjAwMDAwMDA4OTkgNjU1MzUgZg0KMDAwMDAwMDkwMCA2NTUzNSBmDQowMDAwMDAwOTAxIDY1NTM1IGYNCjAwMDAwMDA5MDIgNjU1MzUgZg0KMDAwMDAwMDkwMyA2NTUzNSBmDQowMDAwMDAwOTA0IDY1NTM1IGYNCjAwMDAwMDA5MDUgNjU1MzUgZg0KMDAwMDAwMDkwNiA2NTUzNSBmDQowMDAwMDAwOTA3IDY1NTM1IGYNCjAwMDAwMDA5MDggNjU1MzUgZg0KMDAwMDAwMDkwOSA2NTUzNSBmDQowMDAwMDAwOTEwIDY1NTM1IGYNCjAwMDAwMDA5MTEgNjU1MzUgZg0KMDAwMDAwMDkxMiA2NTUzNSBmDQowMDAwMDAwOTEzIDY1NTM1IGYNCjAwMDAwMDA5MTQgNjU1MzUgZg0KMDAwMDAwMDkxNSA2NTUzNSBmDQowMDAwMDAwOTE2IDY1NTM1IGYNCjAwMDAwMDA5MTcgNjU1MzUgZg0KMDAwMDAwMDkxOCA2NTUzNSBmDQowMDAwMDAwOTE5IDY1NTM1IGYNCjAwMDAwMDA5MjAgNjU1MzUgZg0KMDAwMDAwMDkyMSA2NTUzNSBmDQowMDAwMDAwOTIyIDY1NTM1IGYNCjAwMDAwMDA5MjMgNjU1MzUgZg0KMDAwMDAwMDkyNCA2NTUzNSBmDQowMDAwMDAwOTI1IDY1NTM1IGYNCjAwMDAwMDA5MjYgNjU1MzUgZg0KMDAwMDAwMDkyNyA2NTUzNSBmDQowMDAwMDAwOTI4IDY1NTM1IGYNCjAwMDAwMDA5MjkgNjU1MzUgZg0KMDAwMDAwMDkzMCA2NTUzNSBmDQowMDAwMDAwOTMxIDY1NTM1IGYNCjAwMDAwMDA5MzIgNjU1MzUgZg0KMDAwMDAwMDkzMyA2NTUzNSBmDQowMDAwMDAwOTM0IDY1NTM1IGYNCjAwMDAwMDA5MzUgNjU1MzUgZg0KMDAwMDAwMDkzNiA2NTUzNSBmDQowMDAwMDAwOTM3IDY1NTM1IGYNCjAwMDAwMDA5MzggNjU1MzUgZg0KMDAwMDAwMDkzOSA2NTUzNSBmDQowMDAwMDAwOTQwIDY1NTM1IGYNCjAwMDAwMDA5NDEgNjU1MzUgZg0KMDAwMDAwMDk0MiA2NTUzNSBmDQowMDAwMDAwOTQzIDY1NTM1IGYNCjAwMDAwMDA5NDQgNjU1MzUgZg0KMDAwMDAwMDk0NSA2NTUzNSBmDQowMDAwMDAwOTQ2IDY1NTM1IGYNCjAwMDAwMDA5NDcgNjU1MzUgZg0KMDAwMDAwMDk0OCA2NTUzNSBmDQowMDAwMDAwOTQ5IDY1NTM1IGYNCjAwMDAwMDA5NTAgNjU1MzUgZg0KMDAwMDAwMDk1MSA2NTUzNSBmDQowMDAwMDAwOTUyIDY1NTM1IGYNCjAwMDAwMDA5NTMgNjU1MzUgZg0KMDAwMDAwMDk1NCA2NTUzNSBmDQowMDAwMDAwOTU1IDY1NTM1IGYNCjAwMDAwMDA5NTYgNjU1MzUgZg0KMDAwMDAwMDk1NyA2NTUzNSBmDQowMDAwMDAwOTU4IDY1NTM1IGYNCjAwMDAwMDA5NTkgNjU1MzUgZg0KMDAwMDAwMDk2MCA2NTUzNSBmDQowMDAwMDAwOTYxIDY1NTM1IGYNCjAwMDAwMDA5NjIgNjU1MzUgZg0KMDAwMDAwMDk2MyA2NTUzNSBmDQowMDAwMDAwOTY0IDY1NTM1IGYNCjAwMDAwMDA5NjUgNjU1MzUgZg0KMDAwMDAwMDk2NiA2NTUzNSBmDQowMDAwMDAwOTY3IDY1NTM1IGYNCjAwMDAwMDA5NjggNjU1MzUgZg0KMDAwMDAwMDk2OSA2NTUzNSBmDQowMDAwMDAwOTcwIDY1NTM1IGYNCjAwMDAwMDA5NzEgNjU1MzUgZg0KMDAwMDAwMDk3MiA2NTUzNSBmDQowMDAwMDAwOTczIDY1NTM1IGYNCjAwMDAwMDA5NzQgNjU1MzUgZg0KMDAwMDAwMDk3NSA2NTUzNSBmDQowMDAwMDAwOTc2IDY1NTM1IGYNCjAwMDAwMDA5NzcgNjU1MzUgZg0KMDAwMDAwMDk3OCA2NTUzNSBmDQowMDAwMDAwOTc5IDY1NTM1IGYNCjAwMDAwMDA5ODAgNjU1MzUgZg0KMDAwMDAwMDk4MSA2NTUzNSBmDQowMDAwMDAwOTgyIDY1NTM1IGYNCjAwMDAwMDA5ODMgNjU1MzUgZg0KMDAwMDAwMDk4NCA2NTUzNSBmDQowMDAwMDAwOTg1IDY1NTM1IGYNCjAwMDAwMDA5ODYgNjU1MzUgZg0KMDAwMDAwMDk4NyA2NTUzNSBmDQowMDAwMDAwOTg4IDY1NTM1IGYNCjAwMDAwMDA5ODkgNjU1MzUgZg0KMDAwMDAwMDk5MCA2NTUzNSBmDQowMDAwMDAwOTkxIDY1NTM1IGYNCjAwMDAwMDA5OTIgNjU1MzUgZg0KMDAwMDAwMDk5MyA2NTUzNSBmDQowMDAwMDAwOTk0IDY1NTM1IGYNCjAwMDAwMDA5OTUgNjU1MzUgZg0KMDAwMDAwMDk5NiA2NTUzNSBmDQowMDAwMDAwOTk3IDY1NTM1IGYNCjAwMDAwMDA5OTggNjU1MzUgZg0KMDAwMDAwMDk5OSA2NTUzNSBmDQowMDAwMDAxMDAwIDY1NTM1IGYNCjAwMDAwMDEwMDEgNjU1MzUgZg0KMDAwMDAwMTAwMiA2NTUzNSBmDQowMDAwMDAxMDAzIDY1NTM1IGYNCjAwMDAwMDEwMDQgNjU1MzUgZg0KMDAwMDAwMTAwNSA2NTUzNSBmDQowMDAwMDAxMDA2IDY1NTM1IGYNCjAwMDAwMDEwMDcgNjU1MzUgZg0KMDAwMDAwMTAwOCA2NTUzNSBmDQowMDAwMDAxMDA5IDY1NTM1IGYNCjAwMDAwMDEwMTAgNjU1MzUgZg0KMDAwMDAwMTAxMSA2NTUzNSBmDQowMDAwMDAxMDEyIDY1NTM1IGYNCjAwMDAwMDEwMTMgNjU1MzUgZg0KMDAwMDAwMTAxNCA2NTUzNSBmDQowMDAwMDAxMDE1IDY1NTM1IGYNCjAwMDAwMDEwMTYgNjU1MzUgZg0KMDAwMDAwMTAxNyA2NTUzNSBmDQowMDAwMDAxMDE4IDY1NTM1IGYNCjAwMDAwMDEwMTkgNjU1MzUgZg0KMDAwMDAwMTAyMCA2NTUzNSBmDQowMDAwMDAxMDIxIDY1NTM1IGYNCjAwMDAwMDEwMjIgNjU1MzUgZg0KMDAwMDAwMTAyMyA2NTUzNSBmDQowMDAwMDAxMDI0IDY1NTM1IGYNCjAwMDAwMDEwMjUgNjU1MzUgZg0KMDAwMDAwMTAyNiA2NTUzNSBmDQowMDAwMDAxMDI3IDY1NTM1IGYNCjAwMDAwMDEwMjggNjU1MzUgZg0KMDAwMDAwMTAyOSA2NTUzNSBmDQowMDAwMDAxMDMwIDY1NTM1IGYNCjAwMDAwMDEwMzEgNjU1MzUgZg0KMDAwMDAwMTAzMiA2NTUzNSBmDQowMDAwMDAxMDMzIDY1NTM1IGYNCjAwMDAwMDEwMzQgNjU1MzUgZg0KMDAwMDAwMTAzNSA2NTUzNSBmDQowMDAwMDAxMDM2IDY1NTM1IGYNCjAwMDAwMDEwMzcgNjU1MzUgZg0KMDAwMDAwMTAzOCA2NTUzNSBmDQowMDAwMDAxMDM5IDY1NTM1IGYNCjAwMDAwMDEwNDAgNjU1MzUgZg0KMDAwMDAwMTA0MSA2NTUzNSBmDQowMDAwMDAxMDQyIDY1NTM1IGYNCjAwMDAwMDEwNDMgNjU1MzUgZg0KMDAwMDAwMTA0NCA2NTUzNSBmDQowMDAwMDAxMDQ1IDY1NTM1IGYNCjAwMDAwMDEwNDYgNjU1MzUgZg0KMDAwMDAwMTA0NyA2NTUzNSBmDQowMDAwMDAxMDQ4IDY1NTM1IGYNCjAwMDAwMDEwNDkgNjU1MzUgZg0KMDAwMDAwMTA1MCA2NTUzNSBmDQowMDAwMDAxMDUxIDY1NTM1IGYNCjAwMDAwMDEwNTIgNjU1MzUgZg0KMDAwMDAwMTA1MyA2NTUzNSBmDQowMDAwMDAxMDU0IDY1NTM1IGYNCjAwMDAwMDEwNTUgNjU1MzUgZg0KMDAwMDAwMTA1NiA2NTUzNSBmDQowMDAwMDAxMDU3IDY1NTM1IGYNCjAwMDAwMDEwNTggNjU1MzUgZg0KMDAwMDAwMTA1OSA2NTUzNSBmDQowMDAwMDAxMDYwIDY1NTM1IGYNCjAwMDAwMDEwNjEgNjU1MzUgZg0KMDAwMDAwMTA2MiA2NTUzNSBmDQowMDAwMDAxMDYzIDY1NTM1IGYNCjAwMDAwMDEwNjQgNjU1MzUgZg0KMDAwMDAwMTA2NSA2NTUzNSBmDQowMDAwMDAxMDY2IDY1NTM1IGYNCjAwMDAwMDEwNjcgNjU1MzUgZg0KMDAwMDAwMTA2OCA2NTUzNSBmDQowMDAwMDAxMDY5IDY1NTM1IGYNCjAwMDAwMDEwNzAgNjU1MzUgZg0KMDAwMDAwMTA3MSA2NTUzNSBmDQowMDAwMDAxMDcyIDY1NTM1IGYNCjAwMDAwMDEwNzMgNjU1MzUgZg0KMDAwMDAwMTA3NCA2NTUzNSBmDQowMDAwMDAxMDc1IDY1NTM1IGYNCjAwMDAwMDEwNzYgNjU1MzUgZg0KMDAwMDAwMTA3NyA2NTUzNSBmDQowMDAwMDAxMDc4IDY1NTM1IGYNCjAwMDAwMDEwNzkgNjU1MzUgZg0KMDAwMDAwMTA4MCA2NTUzNSBmDQowMDAwMDAxMDgxIDY1NTM1IGYNCjAwMDAwMDEwODIgNjU1MzUgZg0KMDAwMDAwMTA4MyA2NTUzNSBmDQowMDAwMDAxMDg0IDY1NTM1IGYNCjAwMDAwMDEwODUgNjU1MzUgZg0KMDAwMDAwMTA4NiA2NTUzNSBmDQowMDAwMDAxMDg3IDY1NTM1IGYNCjAwMDAwMDEwODggNjU1MzUgZg0KMDAwMDAwMTA4OSA2NTUzNSBmDQowMDAwMDAxMDkwIDY1NTM1IGYNCjAwMDAwMDEwOTEgNjU1MzUgZg0KMDAwMDAwMTA5MiA2NTUzNSBmDQowMDAwMDAxMDkzIDY1NTM1IGYNCjAwMDAwMDEwOTQgNjU1MzUgZg0KMDAwMDAwMTA5NSA2NTUzNSBmDQowMDAwMDAxMDk2IDY1NTM1IGYNCjAwMDAwMDEwOTcgNjU1MzUgZg0KMDAwMDAwMTA5OCA2NTUzNSBmDQowMDAwMDAxMDk5IDY1NTM1IGYNCjAwMDAwMDExMDAgNjU1MzUgZg0KMDAwMDAwMTEwMSA2NTUzNSBmDQowMDAwMDAxMTAyIDY1NTM1IGYNCjAwMDAwMDExMDMgNjU1MzUgZg0KMDAwMDAwMTEwNCA2NTUzNSBmDQowMDAwMDAxMTA1IDY1NTM1IGYNCjAwMDAwMDExMDYgNjU1MzUgZg0KMDAwMDAwMTEwNyA2NTUzNSBmDQowMDAwMDAxMTA4IDY1NTM1IGYNCjAwMDAwMDExMDkgNjU1MzUgZg0KMDAwMDAwMTExMCA2NTUzNSBmDQowMDAwMDAxMTExIDY1NTM1IGYNCjAwMDAwMDExMTIgNjU1MzUgZg0KMDAwMDAwMTExMyA2NTUzNSBmDQowMDAwMDAxMTE0IDY1NTM1IGYNCjAwMDAwMDExMTUgNjU1MzUgZg0KMDAwMDAwMTExNiA2NTUzNSBmDQowMDAwMDAxMTE3IDY1NTM1IGYNCjAwMDAwMDExMTggNjU1MzUgZg0KMDAwMDAwMTExOSA2NTUzNSBmDQowMDAwMDAxMTIwIDY1NTM1IGYNCjAwMDAwMDExMjEgNjU1MzUgZg0KMDAwMDAwMTEyMiA2NTUzNSBmDQowMDAwMDAxMTIzIDY1NTM1IGYNCjAwMDAwMDExMjQgNjU1MzUgZg0KMDAwMDAwMTEyNSA2NTUzNSBmDQowMDAwMDAxMTI2IDY1NTM1IGYNCjAwMDAwMDExMjcgNjU1MzUgZg0KMDAwMDAwMTEyOCA2NTUzNSBmDQowMDAwMDAxMTI5IDY1NTM1IGYNCjAwMDAwMDExMzAgNjU1MzUgZg0KMDAwMDAwMTEzMSA2NTUzNSBmDQowMDAwMDAxMTMyIDY1NTM1IGYNCjAwMDAwMDExMzMgNjU1MzUgZg0KMDAwMDAwMTEzNCA2NTUzNSBmDQowMDAwMDAxMTM1IDY1NTM1IGYNCjAwMDAwMDExMzYgNjU1MzUgZg0KMDAwMDAwMTEzNyA2NTUzNSBmDQowMDAwMDAxMTM4IDY1NTM1IGYNCjAwMDAwMDExMzkgNjU1MzUgZg0KMDAwMDAwMTE0MCA2NTUzNSBmDQowMDAwMDAxMTQxIDY1NTM1IGYNCjAwMDAwMDExNDIgNjU1MzUgZg0KMDAwMDAwMTE0MyA2NTUzNSBmDQowMDAwMDAxMTQ0IDY1NTM1IGYNCjAwMDAwMDExNDUgNjU1MzUgZg0KMDAwMDAwMTE0NiA2NTUzNSBmDQowMDAwMDAxMTQ3IDY1NTM1IGYNCjAwMDAwMDExNDggNjU1MzUgZg0KMDAwMDAwMTE0OSA2NTUzNSBmDQowMDAwMDAxMTUwIDY1NTM1IGYNCjAwMDAwMDExNTEgNjU1MzUgZg0KMDAwMDAwMTE1MiA2NTUzNSBmDQowMDAwMDAxMTUzIDY1NTM1IGYNCjAwMDAwMDExNTQgNjU1MzUgZg0KMDAwMDAwMTE1NSA2NTUzNSBmDQowMDAwMDAxMTU2IDY1NTM1IGYNCjAwMDAwMDExNTcgNjU1MzUgZg0KMDAwMDAwMTE1OCA2NTUzNSBmDQowMDAwMDAxMTU5IDY1NTM1IGYNCjAwMDAwMDExNjAgNjU1MzUgZg0KMDAwMDAwMTE2MSA2NTUzNSBmDQowMDAwMDAxMTYyIDY1NTM1IGYNCjAwMDAwMDExNjMgNjU1MzUgZg0KMDAwMDAwMTE2NCA2NTUzNSBmDQowMDAwMDAxMTY1IDY1NTM1IGYNCjAwMDAwMDExNjYgNjU1MzUgZg0KMDAwMDAwMTE2NyA2NTUzNSBmDQowMDAwMDAxMTY4IDY1NTM1IGYNCjAwMDAwMDExNjkgNjU1MzUgZg0KMDAwMDAwMTE3MCA2NTUzNSBmDQowMDAwMDAxMTcxIDY1NTM1IGYNCjAwMDAwMDExNzIgNjU1MzUgZg0KMDAwMDAwMTE3MyA2NTUzNSBmDQowMDAwMDAxMTc0IDY1NTM1IGYNCjAwMDAwMDExNzUgNjU1MzUgZg0KMDAwMDAwMTE3NiA2NTUzNSBmDQowMDAwMDAxMTc3IDY1NTM1IGYNCjAwMDAwMDExNzggNjU1MzUgZg0KMDAwMDAwMTE3OSA2NTUzNSBmDQowMDAwMDAxMTgwIDY1NTM1IGYNCjAwMDAwMDExODEgNjU1MzUgZg0KMDAwMDAwMTE4MiA2NTUzNSBmDQowMDAwMDAxMTgzIDY1NTM1IGYNCjAwMDAwMDExODQgNjU1MzUgZg0KMDAwMDAwMTE4NSA2NTUzNSBmDQowMDAwMDAxMTg2IDY1NTM1IGYNCjAwMDAwMDExODcgNjU1MzUgZg0KMDAwMDAwMTE4OCA2NTUzNSBmDQowMDAwMDAxMTg5IDY1NTM1IGYNCjAwMDAwMDExOTAgNjU1MzUgZg0KMDAwMDAwMTE5MSA2NTUzNSBmDQowMDAwMDAxMTkyIDY1NTM1IGYNCjAwMDAwMDExOTMgNjU1MzUgZg0KMDAwMDAwMTE5NCA2NTUzNSBmDQowMDAwMDAxMTk1IDY1NTM1IGYNCjAwMDAwMDExOTYgNjU1MzUgZg0KMDAwMDAwMTE5NyA2NTUzNSBmDQowMDAwMDAxMTk4IDY1NTM1IGYNCjAwMDAwMDExOTkgNjU1MzUgZg0KMDAwMDAwMTIwMCA2NTUzNSBmDQowMDAwMDAxMjAxIDY1NTM1IGYNCjAwMDAwMDEyMDIgNjU1MzUgZg0KMDAwMDAwMTIwMyA2NTUzNSBmDQowMDAwMDAxMjA0IDY1NTM1IGYNCjAwMDAwMDEyMDUgNjU1MzUgZg0KMDAwMDAwMTIwNiA2NTUzNSBmDQowMDAwMDAxMjA3IDY1NTM1IGYNCjAwMDAwMDEyMDggNjU1MzUgZg0KMDAwMDAwMTIwOSA2NTUzNSBmDQowMDAwMDAxMjEwIDY1NTM1IGYNCjAwMDAwMDEyMTEgNjU1MzUgZg0KMDAwMDAwMTIxMiA2NTUzNSBmDQowMDAwMDAxMjEzIDY1NTM1IGYNCjAwMDAwMDEyMTQgNjU1MzUgZg0KMDAwMDAwMTIxNSA2NTUzNSBmDQowMDAwMDAxMjE2IDY1NTM1IGYNCjAwMDAwMDEyMTcgNjU1MzUgZg0KMDAwMDAwMTIxOCA2NTUzNSBmDQowMDAwMDAxMjE5IDY1NTM1IGYNCjAwMDAwMDEyMjAgNjU1MzUgZg0KMDAwMDAwMTIyMSA2NTUzNSBmDQowMDAwMDAxMjIyIDY1NTM1IGYNCjAwMDAwMDEyMjMgNjU1MzUgZg0KMDAwMDAwMTIyNCA2NTUzNSBmDQowMDAwMDAxMjI1IDY1NTM1IGYNCjAwMDAwMDEyMjYgNjU1MzUgZg0KMDAwMDAwMTIyNyA2NTUzNSBmDQowMDAwMDAxMjI4IDY1NTM1IGYNCjAwMDAwMDEyMjkgNjU1MzUgZg0KMDAwMDAwMTIzMCA2NTUzNSBmDQowMDAwMDAxMjMxIDY1NTM1IGYNCjAwMDAwMDEyMzIgNjU1MzUgZg0KMDAwMDAwMTIzMyA2NTUzNSBmDQowMDAwMDAxMjM0IDY1NTM1IGYNCjAwMDAwMDEyMzUgNjU1MzUgZg0KMDAwMDAwMTIzNiA2NTUzNSBmDQowMDAwMDAxMjM3IDY1NTM1IGYNCjAwMDAwMDEyMzggNjU1MzUgZg0KMDAwMDAwMTIzOSA2NTUzNSBmDQowMDAwMDAxMjQwIDY1NTM1IGYNCjAwMDAwMDEyNDEgNjU1MzUgZg0KMDAwMDAwMTI0MiA2NTUzNSBmDQowMDAwMDAxMjQzIDY1NTM1IGYNCjAwMDAwMDEyNDQgNjU1MzUgZg0KMDAwMDAwMTI0NSA2NTUzNSBmDQowMDAwMDAxMjQ2IDY1NTM1IGYNCjAwMDAwMDEyNDcgNjU1MzUgZg0KMDAwMDAwMTI0OCA2NTUzNSBmDQowMDAwMDAxMjQ5IDY1NTM1IGYNCjAwMDAwMDEyNTAgNjU1MzUgZg0KMDAwMDAwMTI1MSA2NTUzNSBmDQowMDAwMDAxMjUyIDY1NTM1IGYNCjAwMDAwMDEyNTMgNjU1MzUgZg0KMDAwMDAwMTI1NCA2NTUzNSBmDQowMDAwMDAxMjU1IDY1NTM1IGYNCjAwMDAwMDEyNTYgNjU1MzUgZg0KMDAwMDAwMTI1NyA2NTUzNSBmDQowMDAwMDAxMjU4IDY1NTM1IGYNCjAwMDAwMDEyNTkgNjU1MzUgZg0KMDAwMDAwMTI2MCA2NTUzNSBmDQowMDAwMDAxMjYxIDY1NTM1IGYNCjAwMDAwMDEyNjIgNjU1MzUgZg0KMDAwMDAwMTI2MyA2NTUzNSBmDQowMDAwMDAxMjY0IDY1NTM1IGYNCjAwMDAwMDEyNjUgNjU1MzUgZg0KMDAwMDAwMTI2NiA2NTUzNSBmDQowMDAwMDAxMjY3IDY1NTM1IGYNCjAwMDAwMDEyNjggNjU1MzUgZg0KMDAwMDAwMTI2OSA2NTUzNSBmDQowMDAwMDAxMjcwIDY1NTM1IGYNCjAwMDAwMDEyNzEgNjU1MzUgZg0KMDAwMDAwMTI3MiA2NTUzNSBmDQowMDAwMDAxMjczIDY1NTM1IGYNCjAwMDAwMDEyNzQgNjU1MzUgZg0KMDAwMDAwMTI3NSA2NTUzNSBmDQowMDAwMDAxMjc2IDY1NTM1IGYNCjAwMDAwMDEyNzcgNjU1MzUgZg0KMDAwMDAwMTI3OCA2NTUzNSBmDQowMDAwMDAxMjc5IDY1NTM1IGYNCjAwMDAwMDEyODAgNjU1MzUgZg0KMDAwMDAwMTI4MSA2NTUzNSBmDQowMDAwMDAxMjgyIDY1NTM1IGYNCjAwMDAwMDEyODMgNjU1MzUgZg0KMDAwMDAwMTI4NCA2NTUzNSBmDQowMDAwMDAxMjg1IDY1NTM1IGYNCjAwMDAwMDEyODYgNjU1MzUgZg0KMDAwMDAwMTI4NyA2NTUzNSBmDQowMDAwMDAxMjg4IDY1NTM1IGYNCjAwMDAwMDEyODkgNjU1MzUgZg0KMDAwMDAwMTI5MCA2NTUzNSBmDQowMDAwMDAxMjkxIDY1NTM1IGYNCjAwMDAwMDEyOTIgNjU1MzUgZg0KMDAwMDAwMDAwMCA2NTUzNSBmDQowMDAwMDI4MDY1IDAwMDAwIG4NCjAwMDAwMjgzMzAgMDAwMDAgbg0KMDAwMDExMTA2NSAwMDAwMCBuDQowMDAwMTExMzQ4IDAwMDAwIG4NCjAwMDAxMTE2NTUgMDAwMDAgbg0KMDAwMDExMTY4NCAwMDAwMCBuDQowMDAwMTg5MDMwIDAwMDAwIG4NCjAwMDAxOTIxODMgMDAwMDAgbg0KMDAwMDE5MjIzMCAwMDAwMCBuDQp0cmFpbGVyDQo8PC9TaXplIDEzMDIvUm9vdCAxIDAgUi9JbmZvIDMgMCBSL0lEWzw3RkRFRkRBQUU2REI2ODQ5QjAxQzA1NUU1OTk2QzA1Mj48N0ZERUZEQUFFNkRCNjg0OUIwMUMwNTVFNTk5NkMwNTI+XSA+Pg0Kc3RhcnR4cmVmDQoxOTQ4MjkNCiUlRU9GDQp4cmVmDQowIDANCnRyYWlsZXINCjw8L1NpemUgMTMwMi9Sb290IDEgMCBSL0luZm8gMyAwIFIvSURbPDdGREVGREFBRTZEQjY4NDlCMDFDMDU1RTU5OTZDMDUyPjw3RkRFRkRBQUU2REI2ODQ5QjAxQzA1NUU1OTk2QzA1Mj5dIC9QcmV2IDE5NDgyOS9YUmVmU3RtIDE5MjIzMD4+DQpzdGFydHhyZWYNCjIyMTAzMA0KJSVFT0Y=";
			
			// To define the type of the Blob
			var contentType = "application/pdf";
			// if cordova.file is not available use instead :
			var folderpath = "file:///storage/emulated/0/";
			//var folderpath = cordova.file.externalRootDirectory;
			var filename = "helloWorld.pdf";

			savebase64AsPDF(folderpath,filename,myBase64,contentType);
			
			cordova.plugins.fileOpener2.showOpenWithDialog(
				'file:///storage/emulated/0/' + $scope.pdfName + '.pdf', // You can also use a Cordova-style file uri: cdvfile://localhost/persistent/Download/starwars.pdf
				'application/pdf', 
				{ 
					error : function(e) {
						console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
					},
					success : function () {
						console.log('file opened successfully');
					}
				}
			);
			/*cordova.plugins.fileOpener2.appIsInstalled('com.adobe.reader', {
				success : function(res) {
					if (res.status === 0) {
						alert('Adobe Reader is not installed.');
					} else {
						alert('Adobe Reader is installed.');
					}
				}
			});*/
		}
		
		$scope.openpdf = function () {
			cordova.plugins.fileOpener2.showOpenWithDialog(
				'/Device storage/helloWorld.pdf', // You can also use a Cordova-style file uri: cdvfile://localhost/persistent/Download/starwars.pdf
				'application/pdf', 
				{ 
					error : function(e) {
						console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
					},
					success : function () {
						console.log('file opened successfully');
					}
				}
			);
		}
		$scope.viewDocumentInfo = function (){
			var appId = window.localStorage.getItem("appId");

            $scope.isFetching = true;
            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();
			
            var db = window.sqlitePlugin.openDatabase({
				name: 'indigentdb.db',
				location: 'default'
				});
			
            db.transaction(function (transaction) {
				$scope.documentInfoImageList = [];
				
				var query = "SELECT * from assignment WHERE id='" + appId + "'";

                transaction.executeSql(query, [], function (tx, result) {
                    if (result.rows.length > 0) {

                        $scope.applicantDetails = JSON.parse(result.rows.item(0).objectString);
						
						
                        $scope.isFetching = false;
                        modal.hide();
                    } else {
                        console.log("No results found");

                        $scope.isFetching = false;
                        modal.hide();
					}
				}, null);
				
			});
			
			appNavigator.pushPage('applicationDocument.html', {
                id: $scope.applicantDetails._id,
                applicationRefNo: $scope.applicantDetails.indigentApplicationDetails.indigentApplicationHeader.applicationRefNo,
				applicantDetails: JSON.stringify($scope.applicantDetails)
            });
			
			$scope.isFetching = false;
			modal.hide();
		}

		$scope.loadDocumentInfo = function () {
            var appId = window.localStorage.getItem("appId");

            $scope.isFetching = true;
            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();
			
			var page = appNavigator.getCurrentPage();
			$scope.applicantDetails = JSON.parse(page.options.applicantDetails);
			
			
			$scope.documentInfoImageList = $scope.applicantDetails.indigentApplicationDetails.pdfImageList;
			$scope.pdfImageNameList = $scope.applicantDetails.indigentApplicationDetails.pdfImageNameList;
			
			/*
            var db = window.sqlitePlugin.openDatabase({
				name: 'indigentdb.db',
				location: 'default'
				});
			
            db.transaction(function (transaction) {
				$scope.documentInfoImageList = [];
				
				var query = "SELECT * from assignment WHERE id='" + appId + "'";

                transaction.executeSql(query, [], function (tx, result) {
                    if (result.rows.length > 0) {

                        $scope.applicantDetails = JSON.parse(result.rows.item(0).objectString);
						
                        console.log($scope.applicantDetails.indigentApplicationDetails.pdfImageNameList);
						
						$scope.documentInfoImageList = $scope.applicantDetails.indigentApplicationDetails.pdfImageList;

						$scope.pdfImageNameList = $scope.applicantDetails.indigentApplicationDetails.pdfImageNameList;
                        $scope.isFetching = false;
                        modal.hide();
                    } else {
                        console.log("No results found");

                        $scope.isFetching = false;
                        modal.hide();
					}
				}, null);
			});*/
			$scope.isFetching = false;
			modal.hide();
		
		} 
		
        function b64toBlob(b64Data, contentType, sliceSize) {
			contentType = contentType || '';
			sliceSize = sliceSize || 512;

			var byteCharacters = atob(b64Data);
			var byteArrays = [];
			
			for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                                
				var slice = byteCharacters.slice(offset, offset + sliceSize);

				var byteNumbers = new Array(slice.length);
				for (var i = 0; i < slice.length; i++) {
					byteNumbers[i] = slice.charCodeAt(i);
				}
				
				var byteArray = new Uint8Array(byteNumbers);
				byteArrays.push(byteArray);
			}
			
			var blob = new Blob(byteArrays, {
				type: contentType
			});
			return blob;
		}
        
		function savebase64AsPDF(folderpath, filename, content, contentType) {
                            // Convert the base64 string in a Blob
                            var DataBlob = b64toBlob(content, contentType);

                            console.log("Starting to write the file :3");

                            window.resolveLocalFileSystemURL(folderpath, function (dir) {
                                console.log("Access to the directory granted succesfully");
                                dir.getFile(filename, {
                                    create: true
                                }, function (file) {
                                    console.log("File created succesfully.");
                                    file.createWriter(function (fileWriter) {
                                        console.log("Writing content to file");
                                        fileWriter.write(DataBlob);
                                    }, function () {
                                        alert('Unable to save file in path ' + folderpath);
                                    });
                                });
                            });
                        }
        
		$scope.SaveFile = function (documentInfo) {
            // Remember to execute this after the onDeviceReady event

            // If your base64 string contains "data:application/pdf;base64,"" at the beginning, keep reading.
            var myBase64 =  documentInfo;
            
            // To define the type of the Blob
            var contentType = "application/pdf";
            // if cordova.file is not available use instead :
            var folderpath = "file:///storage/emulated/0/";
            //var folderpath = cordova.file.externalRootDirectory;
            var filename = "helloWorld.pdf";

            savebase64AsPDF(folderpath, filename, myBase64, contentType);

            cordova.plugins.fileOpener2.open(
                folderpath + filename, // You can also use a Cordova-style file uri: cdvfile://localhost/persistent/Download/starwars.pdf
                'application/pdf', {
                    error: function(e) {
                        console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
                    },
                    success: function() {
                        console.log('file opened successfully');
                    }
                }
            );
        }

        $scope.viewHouseholdDetails = function (index, household) {

			var db = window.sqlitePlugin.openDatabase({
				name: 'indigentdb.db',
				location: 'default'
			});
			
			db.transaction(function (transaction) {
				var appId = window.localStorage.getItem("appId");
				console.log(appId);
                var query = "SELECT * from assignment WHERE id='" + appId + "'";

                transaction.executeSql(query, [], function (tx, result) {
					$scope.applicantDetails = JSON.parse(result.rows.item(0).objectString);
				}, null);
			});
			
			console.log(household);
			
            $scope.household = household;

			console.log($scope.household);
            appNavigator.pushPage('householdverify.html', {
				id: $scope.applicantDetails._id,
				applicantDetails: JSON.stringify($scope.applicantDetails),
                householdmember: JSON.stringify(household[index]),
                currentIndex: index
            });
        }		
		
		$scope.loadHouseholdDetails = function () {
           
            $scope.isFetching = true;
            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();
			
            var appId = window.localStorage.getItem("appId");
			
			var page = appNavigator.getCurrentPage();
			console.log(page);
			$scope.applicantDetails = JSON.parse(page.options.applicantDetails);
			var currentIndex = page.options.currentIndex;
			//console.log($scope.applicantDetails.remarks);
			
			console.log($scope.applicantDetails.indigentApplicationDetails);
			
			if ($scope.applicantDetails.indigentApplicationDetails.fieldWorkerRemarks == 'undefined' || $scope.applicantDetails.indigentApplicationDetails.fieldWorkerRemarks == '' || $scope.applicantDetails.indigentApplicationDetails.fieldWorkerRemarks == null){
				
				$scope.householdmember = $scope.applicantDetails.indigentApplicationDetails.householdDetail[currentIndex];
				//JSON.parse(page.options.householdmember[currentIndex]);
				$scope.houseHoldMemberVerified = 'No';
				$scope.fieldWorkerRemarks = '';
			} else {
				$scope.householdmember = $scope.applicantDetails.indigentApplicationDetails.householdDetail[currentIndex];
				$scope.houseHoldMemberVerified = $scope.applicantDetails.indigentApplicationDetails.householdDetail[currentIndex].isVerified;
				$scope.fieldWorkerRemarks = $scope.applicantDetails.indigentApplicationDetails.householdDetail[currentIndex].fieldWorkerRemarks;
			}
			
			console.log($scope.householdmember);
			
            /*
			var db = window.sqlitePlugin.openDatabase({
				name: 'indigentdb.db',
				location: 'default'
			});
				
            db.transaction(function (transaction) {
				console.log(appId);
                var query = "SELECT * from assignment WHERE id='" + appId + "'";

                transaction.executeSql(query, [], function (tx, result) {
                    if (result.rows.length > 0) {

                        $scope.applicantDetails = JSON.parse(result.rows.item(0).objectString);
                        console.log($scope.applicantDetails);

                        $scope.isFetching = false;
                        modal.hide();
                    } else {
                        console.log("No results found");

                        $scope.isFetching = false;
                        modal.hide();
                    }
                }, null);
        });*/
			$scope.isFetching = false;
			modal.hide();
        }
		
		$scope.items = [];
		var verified, i;
		var verifiedNo = 0;
		var householdDetail = [];
		
		$scope.addHouseMember = function(applicantDetails) {
			
			$scope.isFetching = true;
            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();
			
			verifiedNo++;
			//verifiedNo = 0;
			$scope.items=[];
			console.log(verifiedNo);
			
			var page = appNavigator.getCurrentPage();
			var indexOfHouseMember = page.options.currentIndex
			$scope.applicantDetails = JSON.parse(page.options.applicantDetails);
			$scope.items[indexOfHouseMember] = "valid";
			//console.log(page.options.applicantDetails);
			console.log($scope.houseHoldMemberVerified);
			console.log(indexOfHouseMember);
			
			if ($scope.householdmember.isVerified == 'No' || $scope.householdmember.isVerified == undefined) {
				
				alert('Please verify househould member');
				ons.notification.alert({
					message: 'Please verify household member',
					title: 'Indigent App'
				});
            
			} else {
				
				if ($scope.householdmember.isVerified == 'Yes') {
					verified = 'Yes';
				} else {
					verified = 'No';
				}
				
				var appId = window.localStorage.getItem("appId");
				//$scope.applicantDetails.indigentApplicationDetails.houseHoldMemberVerified = verified;
				
				//$scope.applicantDetails.indigentApplicationDetails.fieldWorkerRemarks = $scope.fieldWorkerRemarks
				
				var db = window.sqlitePlugin.openDatabase({
						name: 'indigentdb.db',
						location: 'default'
					});
				
				if (indexOfHouseMember+1 >= $scope.applicantDetails.indigentApplicationDetails.householdDetail.length) {

					$scope.applicantDetails.indigentApplicationDetails.isVerified = 'Yes';
					$scope.applicantDetails.indigentApplicationDetails.householdDetail.remarks = $scope.householdmember.remarks;
					

					$scope.applicantDetails.indigentApplicationDetails.householdDetail[indexOfHouseMember].isVerified = $scope.householdmember.isVerified;
								
					$scope.applicantDetails.indigentApplicationDetails.householdDetail[indexOfHouseMember].remarks = $scope.householdmember.remarks;
								

								db.transaction(function (transaction) {
									console.log(appId);

									var query = "UPDATE assignment SET objectString = ? WHERE id = ?";

									transaction.executeSql(query, [JSON.stringify($scope.applicantDetails), appId], function (tx, result) {
										console.log("Updated: " + result.insertId);
										console.log("rowsAffected: " + result.rowsAffected);
									},
									function (error) {
											console.log('UPDATE error: ' + error.message);
										});
								}, function (error) {
								console.log('transaction error: ' + error.message);
								});	

								$scope.householdmembers = 'Valid';
								//alert('Updated successfully');
								ons.notification.alert({
											message: 'Updated Successfully',
											title: 'Indigent App'
										});
								/*appNavigator.pushPage('applicationSign.html', {
									appId: appId, 
									acceptedDetails: $scope.applicantDetails
								});*/
								$scope.showLivingConditionsDetails($scope.applicantDetails);

							} else {

								/*$scope.applicantDetails.indigentApplicationDetails.isVerified = 'Yes';*/

								$scope.applicantDetails.indigentApplicationDetails.householdDetail[indexOfHouseMember].isVerified = $scope.householdmember.isVerified;
								
								$scope.applicantDetails.indigentApplicationDetails.householdDetail[indexOfHouseMember].remarks = $scope.householdmember.remarks;
								
								/*$scope.applicantDetails.indigentApplicationDetails.householdDetail[indexOfHouseMember + 1] = $scope.applicantDetails.indigentApplicationDetails.householdDetail[indexOfHouseMember];*/
								
								db.transaction(function (transaction) {
									console.log(appId);

									var query = "UPDATE assignment SET objectString = ? WHERE id = ?";

									transaction.executeSql(query, [JSON.stringify($scope.applicantDetails), appId], function (tx, result) {
										console.log("Updated: " + result.insertId);
										console.log("rowsAffected: " + result.rowsAffected);
										$scope.viewHouseholds();
										
										$scope.isFetching = false;
										modal.hide();
									},
									function (error) {
											console.log('UPDATE error: ' + error.message);
										});
								}, function (error) {
								console.log('transaction error: ' + error.message);
								});
							}
						}
			/*db.close(function () {
				console.log("DB closed!");
			}, function (error) {
				console.log("Error closing DB:" + error.message);
			});*/
			
            $scope.isFetching = false;
            modal.hide();
		}
        
        
      $scope.addHouseMember1 = function (applicantDetails) {
            
            if ($scope.householdmember.isVerified == 'No' || $scope.householdmember.isVerified == undefined) {
                
                //alert('Please verify househould member');
                ons.notification.alert({
                    message: 'Please verify household member',
                    title: 'Indigent App'
                });
            
            } else if ($scope.householdmember.remarks == "" || $scope.householdmember.remarks == undefined) {
                
                
                //alert('Remarks invalid');
                ons.notification.alert({
                    message: 'Remarks cannot be Empty',
                    title: 'Indigent App'
                });
            } else {
                
                $scope.isFetching = true;
                $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
                modal.show();

                var page = appNavigator.getCurrentPage();
                var indexOfHouseMember = page.options.currentIndex
                $scope.applicantDetails = JSON.parse(page.options.applicantDetails);
                $scope.applicantDetails.indigentApplicationDetails.householdDetail[indexOfHouseMember].isVerified = $scope.householdmember.isVerified;
                $scope.applicantDetails.indigentApplicationDetails.householdDetail[indexOfHouseMember].remarks = $scope.householdmember.remarks;
                
                
                var db = window.sqlitePlugin.openDatabase({
                        name: 'indigentdb.db',
                        location: 'default'
                    });
                
                db.transaction(function (transaction) {
                    console.log(appId);
                    var query = "UPDATE assignment SET objectString = ? WHERE id = ?";

                    transaction.executeSql(query, [JSON.stringify($scope.applicantDetails), appId], function (tx, result) {
                        console.log("Updated: " + result.insertId);
                        console.log("rowsAffected: " + result.rowsAffected);
                        
                    }, function (error) {
                        console.log('UPDATE error: ' + error.message);
                    });
                }, function (error) {
                    console.log('transaction error: ' + error.message);
                });
                var count = 0;
                for (var i = 0; i < $scope.applicantDetails.indigentApplicationDetails.householdDetail.length; i++) {
                    
                    if ($scope.applicantDetails.indigentApplicationDetails.householdDetail[i].isVerified === "Yes" ){
                        count++;
                    }
                    else {
                        continue;
                    }
                }
                console.log(count);
                if (count >= $scope.applicantDetails.indigentApplicationDetails.householdDetail.length) {
                    
                    $scope.applicantDetails.indigentApplicationDetails.isVerified = 'Yes';
                    $scope.applicantDetails.indigentApplicationDetails.householdDetail.remarks = $scope.householdmember.remarks;
                    console.log($scope.applicantDetails.indigentApplicationDetails.householdDetail);
                    
                    $scope.showLivingConditionsDetails($scope.applicantDetails);
                        
                    db.transaction(function (transaction) {
                        console.log(appId);
                        var query = "UPDATE assignment SET objectString = ? WHERE id = ?";

                        transaction.executeSql(query, [JSON.stringify($scope.applicantDetails), appId], function (tx, result) {
                            console.log("Updated: " + result.insertId);
                            console.log("rowsAffected: " + result.rowsAffected);

                        }, function (error) {
                            console.log('UPDATE error: ' + error.message);
                        });
                    }, function (error) {
                        console.log('transaction error: ' + error.message);
                });
                } else {
                    $scope.viewHouseholds();
                }
            }
            $scope.isFetching = false;
            modal.hide();
        }
        

 
$scope.addHouseMember1 = function (applicantDetails) {
            
            if ($scope.householdmember.isVerified == 'No' || $scope.householdmember.isVerified == undefined) {
                
                alert('Please verify househould member');
                ons.notification.alert({
                    message: 'Please verify household member',
                    title: 'Indigent App'
                });
            
            } else if ($scope.householdmember.remarks == "" || $scope.householdmember.remarks == undefined) {
                
                
                alert('Please verify househould member');
                ons.notification.alert({
                    message: 'Please verify household member',
                    title: 'Indigent App'
                });
            } else {
                
                $scope.isFetching = true;
                $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
                modal.show();

                var page = appNavigator.getCurrentPage();
                var indexOfHouseMember = page.options.currentIndex
                $scope.applicantDetails = JSON.parse(page.options.applicantDetails);
                
                $scope.applicantDetails.indigentApplicationDetails.isVerified = 'Yes';
                $scope.applicantDetails.indigentApplicationDetails.householdDetail.remarks = $scope.householdmember.remarks;
                $scope.applicantDetails.indigentApplicationDetails.householdDetail[indexOfHouseMember].isVerified = $scope.householdmember.isVerified;
                $scope.applicantDetails.indigentApplicationDetails.householdDetail[indexOfHouseMember].remarks = $scope.householdmember.remarks;
                
                
                var db = window.sqlitePlugin.openDatabase({
                        name: 'indigentdb.db',
                        location: 'default'
                    });
                
                db.transaction(function (transaction) {
                    console.log(appId);
                    var query = "UPDATE assignment SET objectString = ? WHERE id = ?";

                    transaction.executeSql(query, [JSON.stringify($scope.applicantDetails), appId], function (tx, result) {
                        console.log("Updated: " + result.insertId);
                        console.log("rowsAffected: " + result.rowsAffected);
                        
                    }, function (error) {
                        console.log('UPDATE error: ' + error.message);
                    });
                }, function (error) {
                    console.log('transaction error: ' + error.message);
                });
                
                for (var i = 0; i < $scope.applicantDetails.indigentApplicationDetails.householdDetail.length; i++) {
                    
                    if ($scope.applicantDetails.indigentApplicationDetails.householdDetail[i].isVerified == 'undifined' || $scope.applicantDetails.indigentApplicationDetails.householdDetail[i].isVerified == ''){
                        $scope.viewHouseholds();
                        
                        $scope.isFetching = false;
                        modal.hide();
                    }
                    else {
                        $scope.applicantDetails.indigentApplicationDetails.householdDetail.remarks = $scope.householdmember.remarks;
                        
                        db.transaction(function (transaction) {
                    
                            console.log(appId);
                    
                            var query = "UPDATE assignment SET objectString = ? WHERE id = ?";
                            transaction.executeSql(query, [JSON.stringify($scope.applicantDetails), appId], function (tx, result) {
                                console.log("Updated: " + result.insertId);
                                console.log("rowsAffected: " + result.rowsAffected);
                            }, function (error) {
                                console.log('UPDATE error: ' + error.message);
                            });
                        }, function (error) {
                            console.log('transaction error: ' + error.message);
                        });
                        $scope.showLivingConditionsDetails($scope.applicantDetails);
                        
                        $scope.isFetching = false;
                        modal.hide();
                    }
                }
            }
            $scope.isFetching = false;
            modal.hide();
        }
        
        
        
        
        
		
		
		function verifyHouseholdMember(householdMembers) {
			if (verifiedNo < householdMembers.length)
				{
					alert('Not all the household are verified');
				}
			else if ($scope.applicantDetails.remarks = null)
				{
					alert('Remarks are required');
				}
			else 
			{
				alert('household Members Valid!');
			}
		}
		
		/*
		$scope.recommendApplication = function() {
			
			var onSuccess = function(position) {
				alert('Latitude: '          + position.coords.latitude          + '\n' +
					  'Longitude: '         + position.coords.longitude         + '\n' +
					  'Altitude: '          + position.coords.altitude          + '\n' +
					  'Accuracy: '          + position.coords.accuracy          + '\n' +
					  'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
					  'Heading: '           + position.coords.heading           + '\n' +
					  'Speed: '             + position.coords.speed             + '\n' +
					  'Timestamp: '         + position.timestamp                + '\n');
			};
			
			function onError(error) {
				alert('code: '    + error.code    + '\n' +
					  'message: ' + error.message + '\n');
			}
			
			navigator.geolocation.getCurrentPosition(function(position) {
				alert('Latitude: '          + position.coords.latitude          + '\n' +
					  'Longitude: '         + position.coords.longitude         + '\n' +
					  'Altitude: '          + position.coords.altitude          + '\n' +
					  'Accuracy: '          + position.coords.accuracy          + '\n' +
					  'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
					  'Heading: '           + position.coords.heading           + '\n' +
					  'Speed: '             + position.coords.speed             + '\n' +
					  'Timestamp: '         + position.timestamp                + '\n');
			}, function onError(error) {
				alert('code: '    + error.code    + '\n' +
					  'message: ' + error.message + '\n');
			}, 
                                         [geolocationOptions]);
		}
		*/
		$scope.readHouseMember = function() {
			$scope.items = JSON.parse(window.localStorage.getItem("verify"));
			console.log($scope.items);
		}

		$scope.VerifyHouseMembers = function () {
			
            $scope.isFetching = true;
            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();
				
			var appId = window.localStorage.getItem("appId");
			var db = window.sqlitePlugin.openDatabase({
				name: 'indigentdb.db',
				location: 'default'
			});
			
			console.log($scope.houseHoldMemberVerified);
			
			db.transaction(function (tx) {
                $scope.tasks = [];
				$scope.applicantDetails.houseHoldMemberVerified = $scope.houseHoldMemberVerified;
				$scope.applicantDetails.remarks = remarks;

                var query = "UPDATE assignment SET objectString=? WHERE id=?";

                tx.executeSql(db, query, [JSON.stringify($scope.applicantDetails), appId]).then(function (res) {

                    console.log(alert('Updated successfully'));
                    $scopSqle.isFetching = false;
                    modal.hide();

                }, function (err) {
                    console.error(err);

                    $scope.isFetching = false;
                    modal.hide();
                });
            });
				console.log("Android");

        }
		
		$scope.showCustomerSign = function (applicantDetails) {
			
			var page = appNavigator.getCurrentPage();
			
			var appId = page.options.id;
            //var appId = window.localStorage.getItem("appId");
			//$scope.applicantDetails = page.options.applicantDetails
			console.log(appId);
			var db = window.sqlitePlugin.openDatabase({
                name: 'indigentdb.db',
                location: 'default'
            });
			
            db.transaction(function (transaction) {
                console.log(appId);
               
                var query = "SELECT * from assignment WHERE id='" + appId + "'";

                transaction.executeSql(query, [], function (tx, result) {
                    if (result.rows.length > 0) {

                        $scope.applicantDetails = JSON.parse(result.rows.item(0).objectString);
                        console.log($scope.applicantDetails);

                        $scope.isFetching = false;
                        modal.hide();
                    } else {
                        console.log("No results found");

                        $scope.isFetching = false;
                        modal.hide();
                    }
                }, null);
        		});
			//$scope.applicantDetails = applicantDetails;
			appNavigator.pushPage('applicationSign.html', {
				appId: appId, 
				acceptedDetails: $scope.applicantDetails
			});
		}

        $scope.loadSignature = function () {

			var page = appNavigator.getCurrentPage();
			console.log(page.options);
            
			var canvas = document.getElementById('signatureCanvas');
			signaturePad = new SignaturePad(canvas);
			
			var appId = window.localStorage.getItem("appId");
			
			
			$scope.applicantDetails = page.options.acceptedDetails;
			
			if ($scope.applicantDetails.indigentApplicationDetails.customerSignature == '' || $scope.applicantDetails.indigentApplicationDetails.customerSignature == undefined || $scope.applicantDetails.indigentApplicationDetails.customerSignature == null) {
				
				$scope.applicantDetails = page.options.applicantDetails;
				//$scope.clearCanvas();
			} else {
				
				//console.log($scope.applicantDetails.indigentApplicationDetails.customerSignature);
				$scope.signatureCanvas = $scope.applicantDetails.indigentApplicationDetails.customerSignature;
				$scope.applicantDetails = page.options.acceptedDetails;
				$scope.signature = 'data:image/jpeg;base64,' + $scope.applicantDetails.indigentApplicationDetails.customerSignature;
				
			}
        }
		var activeTab ='';
		$scope.loadIndigentMain = function (){
			
			/*$scope.title = 'Tab 1';
			$scope.updateTitle = function($event) {
			  $scope.title = angular.element($event.tabItem).attr('label');
			};*/
			

			var page = appNavigator.getCurrentPage();
			activeTab = page.options.active;
			//alert(activeTab);
			console.log(activeTab);
			
			var tab = document.getElementById("accepted");
			tab.setAttribute("active","true");
			ons.compile(tab)
			
			console.log(activeTab +"  "+ "assignment" );	
			if (activeTab === "assignment") {
				$scope.assignmentTab = "true";
				$scope.acceptedTab = "false";
				$scope.closedTab = "false";
				$scope.rejectedTab = "false";
				ons.compile(tab);
				
			} else if (activeTab === "accepted") {
				$scope.assignmentTab = "false";
				$scope.acceptedTab = "true";
				$scope.closedTab = "false";
				$scope.rejectedTab = "false";
				ons.compile(tab);
				
			} else if (activeTab === "rejected") {
				$scope.assignmentTab = "false";
				$scope.acceptedTab = "false";
				$scope.closedTab = "false";
				$scope.rejectedTab = "true";
				ons.compile(tab);
			} else if (activeTab === "closed") {
				$scope.assignmentTab = "false";
				$scope.acceptedTab = "false";
				$scope.closedTab = "true";
				$scope.rejectedTab = "false";
				
			}
			
		}
		
		$scope.applicantDetails = {};
		
        $scope.saveCanvas = function () {
			$scope.isFetching = true;
			$rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();
			
			var page = appNavigator.getCurrentPage();
			$scope.applicantDetails = page.options.acceptedDetails;
				
			var appId = window.localStorage.getItem("appId");
			
			var canvas1 = document.getElementById("signatureCanvas")
			
            if (signaturePad.isEmpty()){
				//alert('field is required');
				ons.notification.alert({
							message: 'Field is required',
							title: 'Indigent App'
						});
				document.getElementById("signatureCanvas").focus();
			} else {
			var sigImg = signaturePad.toDataURL();
            $scope.signature = sigImg;
			
			 //var page = appNavigator.getCurrentPage();
            //$scope.applicantDetails = page.options.applicantDetails;
         
			console.log($scope.applicantDetails);
            $scope.customerSignature = $scope.signature;
			
            console.log($scope.customerSignature);
			$scope.applicantDetails.indigentApplicationDetails.customerSignature= $scope.customerSignature.replace("data:image/png;base64,","");
			
			var db = window.sqlitePlugin.openDatabase({
				name: 'indigentdb.db',
				location: 'default'
			});
				
			db.transaction(function (transaction) {
				
				var query = "UPDATE assignment set objectString = ? WHERE id = ?";
				
				transaction.executeSql(query, [JSON.stringify($scope.applicantDetails), appId], function (tx, result) {
					//alert('Updated successfully');
										
					/*appNavigator.pushPage('acceptedDetails.html', {
						id: $scope.applicantDetails._id,
						applicationRefNo: $scope.applicantDetails.indigentApplicationDetails.indigentApplicationHeader.applicationRefNo,
						acceptedDetails: JSON.stringify($scope.applicantDetails)
					});*/
					$scope.isFetching = false;
					modal.hide();

				}, function (error) {
					console.error(error);

					$scope.isFetching = false;
					modal.hide();
				});
				}, function (error) {
					console.error(error);

					$scope.isFetching = false;
					modal.hide();
				}, function (){
					//alert('Udated Successfully')
					ons.notification.alert({
							message: 'Updated Successfully',
							title: 'Indigent App'
						});
									
					appNavigator.resetToPage('acceptedDetails.html', {
						id: $scope.applicantDetails._id,
						applicationRefNo: $scope.applicantDetails.indigentApplicationDetails.indigentApplicationHeader.applicationRefNo,
						acceptedDetails: JSON.stringify($scope.applicantDetails)
					});
					$scope.isFetching = false;
					modal.hide();
				});
			
			/*
            db.transaction(function (transaction) {
                console.log(appId);
               
                var query = "UPDATE assignment SET objectString = ? WHERE id = ?";


                transaction.executeSql(query, [JSON.stringify($scope.applicantDetails), appId], function (tx, result) {
                        console.log("insertId: " + result.insertId);
                        console.log("rowsAffected: " + result.rowsAffected);
                    console.log(result);
					
                query = "SELECT * from assignment WHERE id='" + appId + "'";

                transaction.executeSql(query, [], function (tx, result) {
                    if (result.rows.length > 0) {

                        $scope.applicantDetails = JSON.parse(result.rows.item(0).objectString);
                        console.log($scope.applicantDetails);

                        $scope.isFetching = false;
                        modal.hide();
                    } else {
                        console.log("No results found");

                        $scope.isFetching = false;
                        modal.hide();
                    }
                }, null);
        		});
				
				appNavigator.resetToPage('acceptedDetails.html', {
					id: $scope.applicantDetails._id,
					applicationRefNo: $scope.applicantDetails.indigentApplicationDetails.indigentApplicationHeader.applicationRefNo,
					acceptedDetails: JSON.stringify($scope.applicantDetails)
				});
			}, function (tx, error) {
				console.log('UPDATE error: ' + tx + '  ' + error);
			}), function (error) {
				console.log('transaction error: ' + error);
				
			}
			*/
			}
			$scope.isFetching = false;
			modal.hide();
		}
		
		$scope.acceptedHomeAccepted = function () {
			
			$scope.isFetching = true;
			$rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();
			
			$scope.username = window.localStorage.getItem("username");
			var appId = window.localStorage.getItem("appId");
			
			/*
			db.transaction(function (transaction) {
				//select from table assignment
				var query = "SELECT * FROM assignment WHERE status ='" + 'Accepted' + "' AND fieldWorkerID =?";

				transaction.executeSql(query, [$scope.username], function (tx, results) {

					//console.log($scope.acceptedList); 
					for (var i = 0; i < results.rows.length; i++) {
						$scope.acceptedList.push(JSON.parse(results.rows.item(i).objectString));
									
					}
				}, null);
			});
			db.transaction(function (transaction) {
				//select from table assignment
				var query = "SELECT * FROM assignment WHERE status ='" + 'Closed' + "' AND fieldWorkerID =?";

						transaction.executeSql(query, [$scope.username], function (tx, results) {

							for (var i = 0; i < results.rows.length; i++) {
								$scope.closedList.push(JSON.parse(results.rows.item(i).objectString));
							}
							
							console.log($scope.closedList);

						}, null);
					});
			db.transaction(function (transaction) {
								//select from table assignment
								var query = "SELECT * FROM assignment WHERE status ='" + 'Rejected' + "' AND fieldWorkerID =?";

								transaction.executeSql(query, [$scope.username], function (tx, results) {

									for (var i = 0; i < results.rows.length; i++) {
										$scope.rejectedList.push(JSON.parse(results.rows.item(i).objectString));
									}

									console.log($scope.closedList);

								}, null);
							});*/
			var db = window.sqlitePlugin.openDatabase({
				name: 'indigentdb.db',
				location: 'default'
			});
			
			
						db.transaction(function (transaction) {
							//select Accepted from table assignment
							var query = "SELECT * FROM assignment WHERE status ='" + 'Accepted' + "' AND fieldWorkerID =?";

							//var query = "SELECT * FROM assignment WHERE fieldWorkerID =?";
							transaction.executeSql(query, [$scope.username], function (tx, results) {

								//console.log($scope.acceptedList); 
								for (var i = 0; i < results.rows.length; i++) {
									$scope.acceptedList.push(JSON.parse(results.rows.item(i).objectString));
								}

								console.log($scope.acceptedList);
							}, null);
							
							//select Closed from table assignment
							var query = "SELECT * FROM assignment WHERE status ='" + 'Closed' + "' AND fieldWorkerID =?";

							transaction.executeSql(query, [$scope.username], function (tx, results) {

								for (var i = 0; i < results.rows.length; i++) {
									$scope.closedList.push(JSON.parse(results.rows.item(i).objectString));
								}

								console.log($scope.closedList);

							}, null);
							
							//select Rejected from table assignment
							var query = "SELECT * FROM assignment WHERE status ='" + 'Rejected' + "' AND fieldWorkerID =?";

							transaction.executeSql(query, [$scope.username], function (tx, results) {

								for (var i = 0; i < results.rows.length; i++) {
									$scope.rejectedList.push(JSON.parse(results.rows.item(i).objectString));
								}

								console.log($scope.rejectedList);

							}, null);
							
							//select Rejected from table assignment
							var query = "SELECT * FROM assignment WHERE status ='" + 'Declined' + "' AND fieldWorkerID =?";

							transaction.executeSql(query, [$scope.username], function (tx, results) {

								for (var i = 0; i < results.rows.length; i++) {
									$scope.declinedList.push(JSON.parse(results.rows.item(i).objectString));
								}

								console.log($scope.declinedList);

							}, null);
						}, function(error){
							//alert('Error Loading assignments');
							ons.notification.alert({
								message: 'Error Loading assignments',
								title: 'Indigent App'
							});
							$scope.isFetching = false;
							modal.hide();
						}, function (){
							/*appNavigator.pushPage('indigentacceptedlist.html', {
								acceptedList: $scope.acceptedList,
								rejectedList: $scope.rejectedList,
								closedList: $scope.closedList,
								active: "accepted"
							});*/
							appNavigator.resetToPage('indegentacceptedlist.html', {
								acceptedList: $scope.acceptedList,
								rejectedList: $scope.rejectedList,
								closedList: $scope.closedList,
								declinedList: $scope.declinedList,
								active: "accepted"
							});
							$scope.isFetching = false;
							modal.hide();
						});
						
					
			
		}
		
		$scope.acceptedHome = function () {
			
			$scope.isFetching = true;
			$rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();
			
			$scope.username = window.localStorage.getItem("username");
			var appId = window.localStorage.getItem("appId");
			
			
				
			/*
			db.transaction(function (transaction) {
				//select from table assignment
				var query = "SELECT * FROM assignment WHERE status ='" + 'Accepted' + "' AND fieldWorkerID =?";

				transaction.executeSql(query, [$scope.username], function (tx, results) {

					//console.log($scope.acceptedList); 
					for (var i = 0; i < results.rows.length; i++) {
						$scope.acceptedList.push(JSON.parse(results.rows.item(i).objectString));
									
					}
				}, null);
			});
			db.transaction(function (transaction) {
				//select from table assignment
				var query = "SELECT * FROM assignment WHERE status ='" + 'Closed' + "' AND fieldWorkerID =?";

						transaction.executeSql(query, [$scope.username], function (tx, results) {

							for (var i = 0; i < results.rows.length; i++) {
								$scope.closedList.push(JSON.parse(results.rows.item(i).objectString));
							}
							
							console.log($scope.closedList);

						}, null);
					});
			db.transaction(function (transaction) {
								//select from table assignment
								var query = "SELECT * FROM assignment WHERE status ='" + 'Rejected' + "' AND fieldWorkerID =?";

								transaction.executeSql(query, [$scope.username], function (tx, results) {

									for (var i = 0; i < results.rows.length; i++) {
										$scope.rejectedList.push(JSON.parse(results.rows.item(i).objectString));
									}

									console.log($scope.closedList);

								}, null);
							});*/
			var db = window.sqlitePlugin.openDatabase({
				name: 'indigentdb.db',
				location: 'default'
			});
			
			
						db.transaction(function (transaction) {
							//select Accepted from table assignment
							var query = "SELECT * FROM assignment WHERE status ='" + 'Accepted' + "' AND fieldWorkerID =?";

							//var query = "SELECT * FROM assignment WHERE fieldWorkerID =?";
							transaction.executeSql(query, [$scope.username], function (tx, results) {

								//console.log($scope.acceptedList); 
								for (var i = 0; i < results.rows.length; i++) {
									$scope.acceptedList.push(JSON.parse(results.rows.item(i).objectString));
								}

								console.log($scope.acceptedList);
							}, null);
							
							//select Closed from table assignment
							var query = "SELECT * FROM assignment WHERE status ='" + 'Closed' + "' AND fieldWorkerID =?";

							transaction.executeSql(query, [$scope.username], function (tx, results) {

								for (var i = 0; i < results.rows.length; i++) {
									$scope.closedList.push(JSON.parse(results.rows.item(i).objectString));
								}

								console.log($scope.closedList);

							}, null);
							
							//select Rejected from table assignment
							var query = "SELECT * FROM assignment WHERE status ='" + 'Rejected' + "' AND fieldWorkerID =?";

							transaction.executeSql(query, [$scope.username], function (tx, results) {

								for (var i = 0; i < results.rows.length; i++) {
									$scope.rejectedList.push(JSON.parse(results.rows.item(i).objectString));
								}

								console.log($scope.rejectedList);

							}, null);
						}, function(error){
							//alert('Error Loading assignments');
							ons.notification.alert({
								message: 'Error Loading assignments',
								title: 'Indigent App'
							});
							$scope.isFetching = false;
							modal.hide();
						}, function (){
							appNavigator.resetToPage('indigent-mainmenu.html', {
								acceptedList: $scope.acceptedList,
								rejectedList: $scope.rejectedList,
								declinedList: $scope.declinedList,
								closedList: $scope.closedList
							});
							$scope.isFetching = false;
							modal.hide();
						});
						
					
			
		}
		
//             
//         $scope.saveCanvas = function () {
//            
//            
//             var sigImg = signaturePad.toDataURL();
//            $scope.signature = sigImg;
//
//
//            var page = appNavigator.getCurrentPage();
//
//            var appId = window.localStorage.getItem("appId");
//            $scope.applicantDetails = JSON.parse(localStorage.applicantDetails);
//         
//
//            $scope.customerSignature = $scope.signature;
//                
//
//            
//            console.log($scope.customerSignature);
//
//			
//			 $scope.applicantDetails.indigentApplicationDetails.customerSignature= $scope.customerSignature.replace("data:image/png;base64,","");
//
//			
//			
//            var db = window.sqlitePlugin.openDatabase({
//                name: 'indigentdb.db',
//                location: 'default'
//            });
//
//            db.transaction(function (transaction) {
//                console.log(appId);
//               
//                var query = "UPDATE assignment SET objectString = ? WHERE id = ?";
//
//
//                transaction.executeSql(query, [JSON.stringify($scope.applicantDetails), appId], function (tx, result) {
//                        console.log("insertId: " + result.insertId);
//                        console.log("rowsAffected: " + result.rowsAffected);
//                    console.log(result);
//                    
//                    },
//                    function (tx, error) {
//                        console.log('UPDATE error: ' + error.message);
//                    });
//            }, function (error) {
//                console.log('transaction error: ' + error.message);
//            }, function () {
//                console.log(alert('Updated successfully'));
//            });
//            $scope.isFetching = false;
//            modal.hide();
//
//            }
//    
//		
//		
        $scope.clearCanvas = function () {
        	signaturePad.clear();
        }

        $scope.setApplicationAccepted = function () {
			
            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();
			var page = appNavigator.getCurrentPage();
			var appId = window.localStorage.getItem("appId");

			$scope.username = window.localStorage.getItem("username");
            //window.localStorage.getItem("applicationRefNo");
            var applicationRefNo = window.localStorage.getItem("applicationRefNo");
			console.log(applicationRefNo);
            //TODO add this to the config file
			$scope.API = appConfig.emmupdatefieldworkerapi;
            
			
            $scope.API = $scope.API + '{"Status":{"taskStatus":"Accepted","applicationId":"' + applicationRefNo + '","reasonForRejection":"' + $scope.declineReason + '"}}';
            
                console.log($scope.API);
        
            
			try {
				$http.post($scope.API).success(function (data) {
					if (data.body = 'Success')
					{
					$scope.API = appConfig.emmupdateherokuapp;
						$http.post($scope.API, {applicationID:applicationRefNo,status:'Accepted'}).success(function (data) {

						var db = window.sqlitePlugin.openDatabase({
							name: 'indigentdb.db',
							location: 'default'
						});
                            
                            // do query here to check if the record exists the delete it if does
                            
                            
                             
                            

						db.transaction(function (transaction) {

							transaction.executeSql('CREATE TABLE IF NOT EXISTS assignment (id,status,objectString,fieldWorkerID)', [], function(tx, result) {
								//console.log("Table created successfully");
							},
							function(error) {
								  console.log("Error occurred while creating the assignment table.");
							});
							var executeQuery ="INSERT INTO assignment (id,status,objectString,fieldWorkerID) VALUES (?,?,?,?)";
							transaction.executeSql(executeQuery, [$scope.applicantDetails._id, "Accepted", JSON.stringify($scope.applicantDetails),$scope.username], function (tx, res) {
								console.log("insertId: " + res.insertId + " -- probably 1");
								console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
											transaction.executeSql("select count(id) as cnt from assignment", [], function (tx, res) {
												console.log("res.rows.length: " + res.rows.length + " -- should be 1");
												console.log("res.rows.item(0).cnt: " + res.rows.item(0).cnt + " -- should be 1");
											});

										}, function (error) {
											//alert('Error occurred');
											ons.notification.alert({
												message: 'Error Occurred',
												title: 'Indigent App'
											});
											console.log("ERROR: " + error.message);
										});
						},function(error){
							console.log('Error Saving Assignment')
						}, function(){

							console.log('Loading Pages...')
							db.transaction(function (transaction) {
								//select from table assignment
								var query = "SELECT * FROM assignment WHERE status ='" + 'Accepted' + "' AND fieldWorkerID =?";

								transaction.executeSql(query, [$scope.username], function (tx, results) {

										//console.log($scope.acceptedList); 
										for (var i = 0; i < results.rows.length; i++) {
											$scope.acceptedList.push(JSON.parse(results.rows.item(i).objectString));
										}

									}, function(error){
										console.log(eror);
									});
								});
							db.transaction(function (transaction) {
							//select from table assignment

							var query = "SELECT * FROM assignment WHERE status ='" + 'Closed' + "' AND fieldWorkerID =?";

							transaction.executeSql(query, [$scope.username], function (tx, results) {

								for (var i = 0; i < results.rows.length; i++) {
									$scope.closedList.push(JSON.parse(results.rows.item(i).objectString));
								}

								console.log($scope.closedList);

							}, null);
						});
							db.transaction(function (transaction) {
								//select from table assignment
								var query = "SELECT * FROM assignment WHERE status ='" + 'Rejected' + "' AND fieldWorkerID =?";

								transaction.executeSql(query, [$scope.username], function (tx, results) {

									for (var i = 0; i < results.rows.length; i++) {
										$scope.rejectedList.push(JSON.parse(results.rows.item(i).objectString));
									}

									console.log($scope.closedList);

								}, null);
							});

							appNavigator.resetToPage('indigent-mainmenu.html', {
								acceptedList: $scope.acceptedList,
								rejectedList: $scope.rejectedList,
								declinedList: $scope.declinedList,
								closedList: $scope.closedList
							});
						});


						}).error(function (data, status, headers, config) {
							//alert('Error Saving Application!');
							ons.notification.alert({
								message: JSON.stringify('Error Saving Application'),
								title: 'Indigent App'
							});
						});
				} else {
						alert('Error Accepting Assignment!!');
					}


				}, function (error){
					console.log(error)
					alert('Error Accepting Application : ' + error)
				})
			} catch(error) {
				ons.notification.alert({
						message: 'Can not Retrieve assignments',
						title: 'Indigent App'
					});
				console.log(error);
			}
			
			$scope.isFetching = false;
			modal.hide();
        }
		var images = [];
		$scope.recImages = {};
		$scope.imageList = [];
		$scope.recommendApplication = function () {

			for (var i = 0; i < 2; i++) {
						if (images[i] !== undefined) {
							if(i == 0) {
								$scope.imageList.push(images[i]);
								//$scope.imageNameList[i] = "Image 1";
							} else {
								$scope.imageList.push(images[i]);
								//$scope.imageNameList[i] = "Image 2";
							}
						}
			}
			$scope.recImages.imageList = $scope.imageList;
			console.log($scope.recImages);
			
			if (imagelist.length < 1) {
					//alert("Can not save less than 3 Images");
					ons.notification.alert({
						message: 'Image required',
						title: 'Indigent App'
					});
				} else if ($scope.reason == "" || $scope.reason == undefined || $scope.reason.length == 0) {
					//alert('Comments Undefined!!');
					ons.notification.alert({
						message: 'Reason Undefined!',
						title: 'Indigent App'
					});
				
				} else if ($scope.reason == 'Others') {
								if ($scope.other == "" || $scope.other == undefined || $scope.other.length == 0) {
									
										ons.notification.alert({
											message: 'Provide Details for Recommending!',
											title: 'Indigent App'
										});
									} else {
					navigator.geolocation.getCurrentPosition(function onSuccessGeo(position) {
							var location = position.coords.latitude + ", " + position.coords.longitude;
							var accuracy = position.coords.accuracy;
			
							var page = appNavigator.getCurrentPage();
							$scope.applicantDetails = JSON.parse(page.options.applicantDetails);
							var emmAccountNo = $scope.applicantDetails.indigentApplicationDetails.indigentApplicationHeader.emmAccountNo;
							$scope.applicantDetails.indigentApplicationDetails.imageList = images;
                        
                        
                        
                        
							//console.log($scope.reason);
							var declinedReason;
							declinedReason = $scope.other;
									
							console.log(declinedReason);

							$scope.isFetching = true;
							$rootScope.didYouKnowMessage = loadingMessageService.showMessage();
							modal.show();
							var applicationRefNo = window.localStorage.getItem("applicationRefNo");
							$scope.API = appConfig.emmupdatefieldworkerapi;
							$scope.username = window.localStorage.getItem("username");
							$scope.appId = window.localStorage.getItem("appId");

							var db = window.sqlitePlugin.openDatabase({
									name: 'indigentdb.db',
									location: 'default'
								});
						
						db.transaction(function (transaction) {
						console.log(appId);
						var query = "SELECT * from assignment WHERE id='" + appId + "'";


							transaction.executeSql(query, [], function (tx, result) {
								if (result.rows.length > 0) {

										$scope.applicantDetails = JSON.parse(result.rows.item(0).objectString);
										//console.log($scope.applicantDetails);

									} else {
										console.log("No results found");

									}
								}, null);
							});
							var options = {};
							options.taskStatus = "Declined";
							options.applicationId = applicationRefNo;
							options.fieldWorkerDeclineRemarks = declinedReason;
							options.imageList = $scope.recImages.imageList;
							options.location = location;
							//options.locationAccuracy = accuracy;
							options.emmAccountNo = emmAccountNo;
							console.log(options);
							var url = appConfig.emmupdatefieldworkerapi;

							$http.post(url, options, {
								headers: {
									'Content-Type': 'application/json'
								}
							}).success(function (data) {
                                
                                
                                //delete from mobile server
                                
                                
                                $scope.API = appConfig.emmapplicationdetails;
							$scope.API = $scope.API + applicationRefNo;
							console.log ($scope.API);
                                //old one
							
//							$http.delete($scope.API).success(function(response){
//								if (response.status == "success") {
//									console.log('Removed from server');
//									
//									console.log('Application Deleted Server')
//
//								var db = window.sqlitePlugin.openDatabase({
//									name: 'indigentdb.db',
//									location: 'default'
//								});
//                                    
//                                    //delete 
//                                    
//                                    db.transaction(function (transaction) {
//									//Update assignment status to Closed
//									var executeQuery = "UPDATE assignment SET status = ? WHERE id = ?";
//									transaction.executeSql(executeQuery, ["Rejected", appId], function (tx, result) {
//
//										console.log("UpdateId: " + result.insertId + " -- probably 1");
//										console.log("rowsAffected: " + result.rowsAffected + " -- should be 1");
//
//										transaction.executeSql("select count(id) as cnt from assignment", [], function (tx, res) {
//											console.log("res.rows.length: " + res.rows.length + " -- should be 1");
//											console.log("res.rows.item(0).cnt: " + res.rows.item(0).cnt + " -- should be 1");
//											//alert('Your application has been successfully submitted')
//										});
//										transaction.executeSql("SELECT * FROM assignment WHERE status ='" + 'Accepted' + "' AND fieldWorkerID =?", [$scope.username], function (tx, results) {
//
//											//console.log($scope.acceptedList); 
//											for (var i = 0; i < results.rows.length; i++) {
//												$scope.acceptedList.push(JSON.parse(results.rows.item(i).objectString));
//											}
//
//											console.log($scope.acceptedList);
//										})
//
//										transaction.executeSql("SELECT * FROM assignment WHERE status ='" + 'Closed' + "' AND fieldWorkerID =?", [$scope.username], function (tx, results) {
//
//											for (var i = 0; i < results.rows.length; i++) {
//												$scope.closedList.push(JSON.parse(results.rows.item(i).objectString));
//											}
//
//											console.log($scope.closedList);
//
//										});
//
//										transaction.executeSql("SELECT * FROM assignment WHERE status ='" + 'Rejected' + "' AND fieldWorkerID =?", [$scope.username], function (tx, results) {
//
//											for (var i = 0; i < results.rows.length; i++) {
//												$scope.rejectedList.push(JSON.parse(results.rows.item(i).objectString));
//											}
//
//											console.log($scope.rejectedList);
//
//										});
//										
//										transaction.executeSql("SELECT * FROM assignment WHERE status ='" + 'Declined' + "' AND fieldWorkerID =?", [$scope.username], function (tx, results) {
//
//											for (var i = 0; i < results.rows.length; i++) {
//												$scope.declinedList.push(JSON.parse(results.rows.item(i).objectString));
//											}
//
//											console.log($scope.rejectedList);
//
//										});
//									});
//
//								},function(error){
//                                    
//                                    
//								console.log('Error Rejecting Assignment')
//							}, function(){
//
//								console.log('Loading Pages...')
//								db.transaction(function (transaction) {
//									//select from table assignment
//									var query = "SELECT * FROM assignment WHERE status ='" + 'Accepted' + "' AND fieldWorkerID =?";
//
//									transaction.executeSql(query, [$scope.username], function (tx, results) {
//
//											//console.log($scope.acceptedList); 
//											for (var i = 0; i < results.rows.length; i++) {
//												$scope.acceptedList.push(JSON.parse(results.rows.item(i).objectString));
//											}
//
//										}, function(error){
//											console.log(error);
//										});
//									});
//								db.transaction(function (transaction) {
//								//select from table assignment
//
//								var query = "SELECT * FROM assignment WHERE status ='" + 'Closed' + "' AND fieldWorkerID =?";
//
//								transaction.executeSql(query, [$scope.username], function (tx, results) {
//
//									for (var i = 0; i < results.rows.length; i++) {
//										$scope.closedList.push(JSON.parse(results.rows.item(i).objectString));
//									}
//
//									console.log($scope.closedList);
//
//								}, null);
//							});
//								db.transaction(function (transaction) {
//									//select from table assignment
//									var query = "SELECT * FROM assignment WHERE status ='" + 'Rejected' + "' AND fieldWorkerID =?";
//
//									transaction.executeSql(query, [$scope.username], function (tx, results) {
//
//										for (var i = 0; i < results.rows.length; i++) {
//											$scope.rejectedList.push(JSON.parse(results.rows.item(i).objectString));
//										}
//
//										console.log($scope.closedList);
//
//									}, null);
//								});
//
//								
//							});
//									ons.notification.alert({
//										message: 'Application has been successfully submitted',
//										title: 'IndigentApp'
//									});
//                                    
//                                    
//                                    
//                                    appNavigator.resetToPage('indigent-mainmenu.html', {
//									acceptedList: $scope.acceptedList,
//									rejectedList: $scope.rejectedList,
//									declinedList: $scope.declinedList,
//									closedList: $scope.closedList
//								});
//                                    
//									
//
//									$scope.isFetching = false;
//									modal.hide();
//								} else {
//									console.log('Not Removed');
//									ons.notification.alert({
//										message: JSON.stringify('Please check your internet connection and submit your application again'),
//										modifier: 'material'
//									});
//									$scope.isFetching = false;
//									modal.hide();
//								}
//							}).error(function (data, status, headers, config) {
//						
//									console.log(config); 
//									console.log(data);
//									//console.log(headers);
//
//									ons.notification.alert({
//										message: JSON.stringify('Application not Removed'),
//										modifier: 'material'
//									});
//								$scope.isFetching = false;
//								modal.hide();
//								});
//                                
                                
                                
                                
                                // this one 
                                
                                $http.delete($scope.API).success(function(response){
								if (response.status == "success") {
									console.log('Removed from server');
									
									console.log('Application Deleted Server')
                                    
                                    $scope.appId = window.localStorage.getItem("appId");

								var db = window.sqlitePlugin.openDatabase({
									name: 'indigentdb.db',
									location: 'default'
								});
                                    
                                    //delete this
                                    db.transaction(function (transaction) {
									//Update assignment status to Closed
									var executeQuery = "UPDATE assignment SET status = ? WHERE id = ?";
									transaction.executeSql(executeQuery, ["Rejected", $scope.appId], function (tx, result) {

										console.log("UpdateId: " + result.insertId + " -- probably 1");
										console.log("rowsAffected: " + result.rowsAffected + " -- should be 1");

										transaction.executeSql("select count(id) as cnt from assignment", [], function (tx, res) {
											console.log("res.rows.length: " + res.rows.length + " -- should be 1");
											console.log("res.rows.item(0).cnt: " + res.rows.item(0).cnt + " -- should be 1");
											//alert('Your application has been successfully submitted')
										});
										transaction.executeSql("SELECT * FROM assignment WHERE status ='" + 'Accepted' + "' AND fieldWorkerID =?", [$scope.username], function (tx, results) {

											//console.log($scope.acceptedList); 
											for (var i = 0; i < results.rows.length; i++) {
												$scope.acceptedList.push(JSON.parse(results.rows.item(i).objectString));
											}

											console.log($scope.acceptedList);
										})

										transaction.executeSql("SELECT * FROM assignment WHERE status ='" + 'Closed' + "' AND fieldWorkerID =?", [$scope.username], function (tx, results) {

											for (var i = 0; i < results.rows.length; i++) {
												$scope.closedList.push(JSON.parse(results.rows.item(i).objectString));
											}

											console.log($scope.closedList);

										});

										transaction.executeSql("SELECT * FROM assignment WHERE status ='" + 'Rejected' + "' AND fieldWorkerID =?", [$scope.username], function (tx, results) {

											for (var i = 0; i < results.rows.length; i++) {
												$scope.rejectedList.push(JSON.parse(results.rows.item(i).objectString));
											}

											console.log($scope.rejectedList);

										});
										
										transaction.executeSql("SELECT * FROM assignment WHERE status ='" + 'Declined' + "' AND fieldWorkerID =?", [$scope.username], function (tx, results) {

											for (var i = 0; i < results.rows.length; i++) {
												$scope.declinedList.push(JSON.parse(results.rows.item(i).objectString));
											}

											console.log($scope.rejectedList);

										});
									});

								},function(error){
                                    
//                                    
                                    
                                    
                                    
                                    
                                    
                                    
								console.log('Error Rejecting Assignment')
							}, function(){

                                        
                                        
//                                        
//								console.log('Loading Pages...')
//								db.transaction(function (transaction) {
//									//select from table assignment
//									var query = "SELECT * FROM assignment WHERE status ='" + 'Accepted' + "' AND fieldWorkerID =?";
//
//									transaction.executeSql(query, [$scope.username], function (tx, results) {
//
//											//console.log($scope.acceptedList); 
//											for (var i = 0; i < results.rows.length; i++) {
//												$scope.acceptedList.push(JSON.parse(results.rows.item(i).objectString));
//											}
//
//										}, function(error){
//											console.log(error);
//										});
//									});
//								db.transaction(function (transaction) {
//								//select from table assignment
//
//								var query = "SELECT * FROM assignment WHERE status ='" + 'Closed' + "' AND fieldWorkerID =?";
//
//								transaction.executeSql(query, [$scope.username], function (tx, results) {
//
//									for (var i = 0; i < results.rows.length; i++) {
//										$scope.closedList.push(JSON.parse(results.rows.item(i).objectString));
//									}
//
//									console.log($scope.closedList);
//
//								}, null);
//							});
//								db.transaction(function (transaction) {
//									//select from table assignment
//									var query = "SELECT * FROM assignment WHERE status ='" + 'Rejected' + "' AND fieldWorkerID =?";
//
//									transaction.executeSql(query, [$scope.username], function (tx, results) {
//
//										for (var i = 0; i < results.rows.length; i++) {
//											$scope.rejectedList.push(JSON.parse(results.rows.item(i).objectString));
//										}
//
//										console.log($scope.closedList);
//
//									}, null);
//								});

                                        
//                                        appNavigator.resetToPage('indegentacceptedlist.html', {
//										acceptedList: $scope.acceptedList,
//										rejectedList: $scope.rejectedList,
//										closedList: $scope.closedList,
////										declinedList: $scope.declinedList,
//										active: "accepted"
//									});
                                        
                                        
								
							});
									ons.notification.alert({
										message: 'Application has been successfully submitted',
										title: 'IndigentApp'
									});
                                    
                                    
                                    
                                    
                                    

									appNavigator.resetToPage('indegentacceptedlist.html', {
										acceptedList: $scope.acceptedList,
										rejectedList: $scope.rejectedList,
										closedList: $scope.closedList,
//										declinedList: $scope.declinedList,
										active: "accepted"
									});
									

									
                                    

									$scope.isFetching = false;
									modal.hide();
								} else {
									console.log('Not Removed');
									ons.notification.alert({
										message: JSON.stringify('Something went wrong'),
										modifier: 'material'
									});
									$scope.isFetching = false;
									modal.hide();
								}
							}).error(function (data, status, headers, config) {
						
									console.log(config); 
									console.log(data);
									//console.log(headers);

									ons.notification.alert({
										message: JSON.stringify('Application not Removed'),
										modifier: 'material'
									});
								$scope.isFetching = false;
								modal.hide();
								});
								

                                
                                
                                
							
                                
                                
                                
                                

							//console.log($scope.declineReason);
							/*$http.get($scope.API).success(function (data) {*/
								console.log(data);
//								db.transaction(function (transaction) {
//									//Update assignment status to Declined
//									var executeQuery = "UPDATE assignment SET status = ? WHERE id = ?";
//										transaction.executeSql(executeQuery, ["Declined",$scope.appId], function (tx, result) {
//											console.log("UpdateId: " + result.insertId + " -- probably 1");
//											console.log("rowsAffected: " + result.rowsAffected + " -- should be 1");
//
//											transaction.executeSql("select count(id) as cnt from assignment", [], function (tx, res) {
//												console.log("res.rows.length: " + res.rows.length + " -- should be 1");
//												console.log("res.rows.item(0).cnt: " + res.rows.item(0).cnt + " -- should be 1");
//											});
//
//											$scope.isFetching = false;
//											modal.hide();
//
//										}, function (error) {
//											console.log("ERROR: " + error);
//											$scope.isFetching = false;
//											modal.hide();
//										});
//									});
//
//								db.transaction(function (transaction) {
//											//select from table assignment
//											var query = "SELECT * FROM assignment WHERE status ='" + 'Accepted' + "' AND fieldWorkerID =?";
//
//											transaction.executeSql(query, [$scope.username], function (tx, results) {
//
//											//console.log($scope.acceptedList); 
//												for (var i = 0; i < results.rows.length; i++) {
//													$scope.acceptedList.push(JSON.parse(results.rows.item(i).objectString));
//												}
//											}, null);
//										});
//								db.transaction(function (transaction) {
//										//select from table assignment
//										var query = "SELECT * FROM assignment WHERE status ='" + 'Closed' + "' AND fieldWorkerID =?";
//
//										transaction.executeSql(query, [$scope.username], function (tx, results) {
//
//											for (var i = 0; i < results.rows.length; i++) {
//												$scope.closedList.push(JSON.parse(results.rows.item(i).objectString));
//											}
//
//											console.log($scope.closedList);
//
//										}, null);
//									});
//								db.transaction(function (transaction) {
//										//select from table assignment
//										var query = "SELECT * FROM assignment WHERE status ='" + 'Rejected' + "' AND fieldWorkerID =?";
//
//										transaction.executeSql(query, [$scope.username], function (tx, results) {
//
//											for (var i = 0; i < results.rows.length; i++) {
//												$scope.rejectedList.push(JSON.parse(results.rows.item(i).objectString));
//											}
//
//											console.log($scope.closedList);
//
//										}, null);
//									});
//                                
//                                
                                
                                
//								db.transaction(function (transaction) {
//										//select from table assignment
//										var query = "SELECT * FROM assignment WHERE status ='" + 'Declined' + "' AND fieldWorkerID =?";
//
//										transaction.executeSql(query, [$scope.username], function (tx, results) {
//
//											for (var i = 0; i < results.rows.length; i++) {
//												$scope.declinedList.push(JSON.parse(results.rows.item(i).objectString));
//											}
//
//											console.log($scope.declinedList);
//
//										}, null);
//									});

//								$scope.acceptedHomeAccepted();

//								appNavigator.resetToPage('indegentacceptedlist.html', {
//									acceptedList: $scope.acceptedList,
//									rejectedList: $scope.rejectedList,
//									closedList: $scope.closedList,
////									declinedList: $scope.declinedList,
//									active: "accepted"
//								});
//								
//								$scope.isFetching = false;
//								modal.hide();


							}).error(function (data, status, headers, config) {

								$scope.isFetching = false;
								modal.hide();

								ons.notification.alert({
									message: JSON.stringify('Something went wrong'),
									modifier: 'material'
								});

							});
		}, onErrorGeo);
				}
				} else {
					$scope.isFetching = true;
							$rootScope.didYouKnowMessage = loadingMessageService.showMessage();
							modal.show();
					navigator.geolocation.getCurrentPosition(function onSuccessGeo(position) {
							var location = position.coords.latitude + ", " + position.coords.longitude;
							var accuracy = position.coords.accuracy;
			
							var page = appNavigator.getCurrentPage();
							$scope.applicantDetails = JSON.parse(page.options.applicantDetails);
							var emmAccountNo = $scope.applicantDetails.indigentApplicationDetails.indigentApplicationHeader.emmAccountNo;
							
							//console.log($scope.reason);
							var declinedReason;
							
							declinedReason = $scope.reason;
								
							console.log(declinedReason);

							$scope.isFetching = true;
							$rootScope.didYouKnowMessage = loadingMessageService.showMessage();
							modal.show();
							var applicationRefNo = window.localStorage.getItem("applicationRefNo");
							$scope.API = appConfig.emmupdatefieldworkerapi;
							$scope.username = window.localStorage.getItem("username");
							$scope.appId = window.localStorage.getItem("appId");

							var db = window.sqlitePlugin.openDatabase({
									name: 'indigentdb.db',
									location: 'default'
								});
						db.transaction(function (transaction) {
						console.log(appId);
						var query = "SELECT * from assignment WHERE id='" + appId + "'";


							transaction.executeSql(query, [], function (tx, result) {
								if (result.rows.length > 0) {

										$scope.applicantDetails = JSON.parse(result.rows.item(0).objectString);
										console.log($scope.applicantDetails);

									} else {
										console.log("No results found");

									}
								}, null);
							});

						
							var url = appConfig.emmupdatefieldworkerapi;
						
						var options = {};
							options.taskStatus = "Declined";
							options.applicationId = applicationRefNo;
							options.fieldWorkerDeclineRemarks = declinedReason;
							options.imageList = $scope.recImages.imageList;
							options.location = location;
							//options.locationAccuracy = accuracy;
							options.emmAccountNo = emmAccountNo;
							console.log(options);	
						
							$http.post(url, options, {
								headers: {
									'Content-Type': 'application/json'
								}
							}).success(function (data) {
                                
                                //delete code from molibe server
                                
                            $scope.API = appConfig.emmapplicationdetails;
							$scope.API = $scope.API + applicationRefNo;
							console.log ($scope.API);
							
                                
                                //old one 
//							$http.delete($scope.API).success(function(response){
//								if (response.status == "success") {
//									console.log('Removed from server');
//									
//									console.log('Application Deleted Server')
//
//								var db = window.sqlitePlugin.openDatabase({
//									name: 'indigentdb.db',
//									location: 'default'
//								});
//                                    
//                                    db.transaction(function (transaction) {
//									//Update assignment status to Closed
//									var executeQuery = "UPDATE assignment SET status = ? WHERE id = ?";
//									transaction.executeSql(executeQuery, ["Rejected", appId], function (tx, result) {
//
//										console.log("UpdateId: " + result.insertId + " -- probably 1");
//										console.log("rowsAffected: " + result.rowsAffected + " -- should be 1");
//
//										transaction.executeSql("select count(id) as cnt from assignment", [], function (tx, res) {
//											console.log("res.rows.length: " + res.rows.length + " -- should be 1");
//											console.log("res.rows.item(0).cnt: " + res.rows.item(0).cnt + " -- should be 1");
//											//alert('Your application has been successfully submitted')
//										});
//										transaction.executeSql("SELECT * FROM assignment WHERE status ='" + 'Accepted' + "' AND fieldWorkerID =?", [$scope.username], function (tx, results) {
//
//											//console.log($scope.acceptedList); 
//											for (var i = 0; i < results.rows.length; i++) {
//												$scope.acceptedList.push(JSON.parse(results.rows.item(i).objectString));
//											}
//
//											console.log($scope.acceptedList);
//										})
//
//										transaction.executeSql("SELECT * FROM assignment WHERE status ='" + 'Closed' + "' AND fieldWorkerID =?", [$scope.username], function (tx, results) {
//
//											for (var i = 0; i < results.rows.length; i++) {
//												$scope.closedList.push(JSON.parse(results.rows.item(i).objectString));
//											}
//
//											console.log($scope.closedList);
//
//										});
//
//										transaction.executeSql("SELECT * FROM assignment WHERE status ='" + 'Rejected' + "' AND fieldWorkerID =?", [$scope.username], function (tx, results) {
//
//											for (var i = 0; i < results.rows.length; i++) {
//												$scope.rejectedList.push(JSON.parse(results.rows.item(i).objectString));
//											}
//
//											console.log($scope.rejectedList);
//
//										});
//										
//										transaction.executeSql("SELECT * FROM assignment WHERE status ='" + 'Declined' + "' AND fieldWorkerID =?", [$scope.username], function (tx, results) {
//
//											for (var i = 0; i < results.rows.length; i++) {
//												$scope.declinedList.push(JSON.parse(results.rows.item(i).objectString));
//											}
//
//											console.log($scope.rejectedList);
//
//										});
//									});
//
//								},function(error){
//                                    
//                                    
//								console.log('Error Rejecting Assignment')
//							}, function(){
//
//								console.log('Loading Pages...')
//								db.transaction(function (transaction) {
//									//select from table assignment
//									var query = "SELECT * FROM assignment WHERE status ='" + 'Accepted' + "' AND fieldWorkerID =?";
//
//									transaction.executeSql(query, [$scope.username], function (tx, results) {
//
//											//console.log($scope.acceptedList); 
//											for (var i = 0; i < results.rows.length; i++) {
//												$scope.acceptedList.push(JSON.parse(results.rows.item(i).objectString));
//											}
//
//										}, function(error){
//											console.log(error);
//										});
//									});
//								db.transaction(function (transaction) {
//								//select from table assignment
//
//								var query = "SELECT * FROM assignment WHERE status ='" + 'Closed' + "' AND fieldWorkerID =?";
//
//								transaction.executeSql(query, [$scope.username], function (tx, results) {
//
//									for (var i = 0; i < results.rows.length; i++) {
//										$scope.closedList.push(JSON.parse(results.rows.item(i).objectString));
//									}
//
//									console.log($scope.closedList);
//
//								}, null);
//							});
//								db.transaction(function (transaction) {
//									//select from table assignment
//									var query = "SELECT * FROM assignment WHERE status ='" + 'Rejected' + "' AND fieldWorkerID =?";
//
//									transaction.executeSql(query, [$scope.username], function (tx, results) {
//
//										for (var i = 0; i < results.rows.length; i++) {
//											$scope.rejectedList.push(JSON.parse(results.rows.item(i).objectString));
//										}
//
//										console.log($scope.closedList);
//
//									}, null);
//								});
//
//								
//							});
//									ons.notification.alert({
//										message: 'Application has been successfully submitted',
//										title: 'IndigentApp'
//									});
//									
//                                    
//                                    
//                                    appNavigator.resetToPage('indigent-mainmenu.html', {
//									acceptedList: $scope.acceptedList,
//									rejectedList: $scope.rejectedList,
//									declinedList: $scope.declinedList,
//									closedList: $scope.closedList
//								});
//                                    
//                                    
//                                    
//                                    
//                                    
//
//									$scope.isFetching = false;
//									modal.hide();
//								} else {
//									console.log('Not Removed');
//									ons.notification.alert({
//										message: JSON.stringify('Please check your internet connection and submit your application again'),
//										modifier: 'material'
//									});
//									$scope.isFetching = false;
//									modal.hide();
//								}
//							}).error(function (data, status, headers, config) {
//						
//									console.log(config); 
//									console.log(data);
//									//console.log(headers);
//
//									ons.notification.alert({
//										message: JSON.stringify('Application not Removed'),
//										modifier: 'material'
//									});
//								$scope.isFetching = false;
//								modal.hide();
//								});
                                
                                
                                
                                
                                
                                //use this one 
                                
                                
                                 $http.delete($scope.API).success(function(response){
								if (response.status == "success") {
									console.log('Removed from server');
									
									console.log('Application Deleted Server')
                                    

								var db = window.sqlitePlugin.openDatabase({
									name: 'indigentdb.db',
									location: 'default'
								});
                                    
                                    //delete this
                                    db.transaction(function (transaction) {
									//Update assignment status to Closed
									var executeQuery = "UPDATE assignment SET status = ? WHERE id = ?";
									transaction.executeSql(executeQuery, ["Rejected", $scope.appId], function (tx, result) {

										console.log("UpdateId: " + result.insertId + " -- probably 1");
										console.log("rowsAffected: " + result.rowsAffected + " -- should be 1");

										transaction.executeSql("select count(id) as cnt from assignment", [], function (tx, res) {
											console.log("res.rows.length: " + res.rows.length + " -- should be 1");
											console.log("res.rows.item(0).cnt: " + res.rows.item(0).cnt + " -- should be 1");
											//alert('Your application has been successfully submitted')
										});
										transaction.executeSql("SELECT * FROM assignment WHERE status ='" + 'Accepted' + "' AND fieldWorkerID =?", [$scope.username], function (tx, results) {

											//console.log($scope.acceptedList); 
											for (var i = 0; i < results.rows.length; i++) {
												$scope.acceptedList.push(JSON.parse(results.rows.item(i).objectString));
											}

											console.log($scope.acceptedList);
										})

										transaction.executeSql("SELECT * FROM assignment WHERE status ='" + 'Closed' + "' AND fieldWorkerID =?", [$scope.username], function (tx, results) {

											for (var i = 0; i < results.rows.length; i++) {
												$scope.closedList.push(JSON.parse(results.rows.item(i).objectString));
											}

											console.log($scope.closedList);

										});

										transaction.executeSql("SELECT * FROM assignment WHERE status ='" + 'Rejected' + "' AND fieldWorkerID =?", [$scope.username], function (tx, results) {

											for (var i = 0; i < results.rows.length; i++) {
												$scope.rejectedList.push(JSON.parse(results.rows.item(i).objectString));
											}

											console.log($scope.rejectedList);

										});
										
										transaction.executeSql("SELECT * FROM assignment WHERE status ='" + 'Declined' + "' AND fieldWorkerID =?", [$scope.username], function (tx, results) {

											for (var i = 0; i < results.rows.length; i++) {
												$scope.declinedList.push(JSON.parse(results.rows.item(i).objectString));
											}

											console.log($scope.rejectedList);

										});
									});

								},function(error){
                                    
//                                    
                                    
                                    
                                    
                                    
                                    
                                    
								console.log('Error Rejecting Assignment')
							}, function(){

                                        
                                        
//                                        
//								console.log('Loading Pages...')
//								db.transaction(function (transaction) {
//									//select from table assignment
//									var query = "SELECT * FROM assignment WHERE status ='" + 'Accepted' + "' AND fieldWorkerID =?";
//
//									transaction.executeSql(query, [$scope.username], function (tx, results) {
//
//											//console.log($scope.acceptedList); 
//											for (var i = 0; i < results.rows.length; i++) {
//												$scope.acceptedList.push(JSON.parse(results.rows.item(i).objectString));
//											}
//
//										}, function(error){
//											console.log(error);
//										});
//									});
//								db.transaction(function (transaction) {
//								//select from table assignment
//
//								var query = "SELECT * FROM assignment WHERE status ='" + 'Closed' + "' AND fieldWorkerID =?";
//
//								transaction.executeSql(query, [$scope.username], function (tx, results) {
//
//									for (var i = 0; i < results.rows.length; i++) {
//										$scope.closedList.push(JSON.parse(results.rows.item(i).objectString));
//									}
//
//									console.log($scope.closedList);
//
//								}, null);
//							});
//								db.transaction(function (transaction) {
//									//select from table assignment
//									var query = "SELECT * FROM assignment WHERE status ='" + 'Rejected' + "' AND fieldWorkerID =?";
//
//									transaction.executeSql(query, [$scope.username], function (tx, results) {
//
//										for (var i = 0; i < results.rows.length; i++) {
//											$scope.rejectedList.push(JSON.parse(results.rows.item(i).objectString));
//										}
//
//										console.log($scope.closedList);
//
//									}, null);
//								});

                                        
//                                        appNavigator.resetToPage('indegentacceptedlist.html', {
//										acceptedList: $scope.acceptedList,
//										rejectedList: $scope.rejectedList,
//										closedList: $scope.closedList,
////										declinedList: $scope.declinedList,
//										active: "accepted"
//									});
                                        
                                        
								
							});
									ons.notification.alert({
										message: 'Application has been successfully submitted',
										title: 'IndigentApp'
									});
                                    
                                    
                                    
                                    
                                    

									appNavigator.resetToPage('indegentacceptedlist.html', {
										acceptedList: $scope.acceptedList,
										rejectedList: $scope.rejectedList,
										closedList: $scope.closedList,
//										declinedList: $scope.declinedList,
										active: "accepted"
									});
									

									
                                    

									$scope.isFetching = false;
									modal.hide();
								} else {
									console.log('Not Removed');
									ons.notification.alert({
										message: JSON.stringify('Something went wrong'),
										modifier: 'material'
									});
									$scope.isFetching = false;
									modal.hide();
								}
							}).error(function (data, status, headers, config) {
						
									console.log(config); 
									console.log(data);
									//console.log(headers);

									ons.notification.alert({
										message: JSON.stringify('Application not Removed'),
										modifier: 'material'
									});
								$scope.isFetching = false;
								modal.hide();
								});
								
                                
                                
                                
                                
                                
                                

							//console.log($scope.declineReason);
							/*$http.get($scope.API).success(function (data) {*/
								console.log(data);
//								db.transaction(function (transaction) {
//									//Update assignment status to Declined
//									var executeQuery = "UPDATE assignment SET status = ? WHERE id = ?";
//										transaction.executeSql(executeQuery, ["Declined",$scope.appId], function (tx, result) {
//											console.log("UpdateId: " + result.insertId + " -- probably 1");
//											console.log("rowsAffected: " + result.rowsAffected + " -- should be 1");
//
//											transaction.executeSql("select count(id) as cnt from assignment", [], function (tx, res) {
//												console.log("res.rows.length: " + res.rows.length + " -- should be 1");
//												console.log("res.rows.item(0).cnt: " + res.rows.item(0).cnt + " -- should be 1");
//											});
//
//											$scope.isFetching = false;
//											modal.hide();
//
//										}, function (error) {
//											console.log("ERROR: " + error);
//											$scope.isFetching = false;
//											modal.hide();
//										});
//									});
//
//								db.transaction(function (transaction) {
//											//select from table assignment
//											var query = "SELECT * FROM assignment WHERE status ='" + 'Accepted' + "' AND fieldWorkerID =?";
//
//											transaction.executeSql(query, [$scope.username], function (tx, results) {
//
//											//console.log($scope.acceptedList); 
//												for (var i = 0; i < results.rows.length; i++) {
//													$scope.acceptedList.push(JSON.parse(results.rows.item(i).objectString));
//												}
//											}, null);
//										});
//								db.transaction(function (transaction) {
//										//select from table assignment
//										var query = "SELECT * FROM assignment WHERE status ='" + 'Closed' + "' AND fieldWorkerID =?";
//
//										transaction.executeSql(query, [$scope.username], function (tx, results) {
//
//											for (var i = 0; i < results.rows.length; i++) {
//												$scope.closedList.push(JSON.parse(results.rows.item(i).objectString));
//											}
//
//											console.log($scope.closedList);
//
//										}, null);
//									});
//								db.transaction(function (transaction) {
//										//select from table assignment
//										var query = "SELECT * FROM assignment WHERE status ='" + 'Rejected' + "' AND fieldWorkerID =?";
//
//										transaction.executeSql(query, [$scope.username], function (tx, results) {
//
//											for (var i = 0; i < results.rows.length; i++) {
//												$scope.rejectedList.push(JSON.parse(results.rows.item(i).objectString));
//											}
//
//											console.log($scope.closedList);
//
//										}, null);
//									});
//                                
                                
                                
//								db.transaction(function (transaction) {
//										//select from table assignment
//										var query = "SELECT * FROM assignment WHERE status ='" + 'Declined' + "' AND fieldWorkerID =?";
//
//										transaction.executeSql(query, [$scope.username], function (tx, results) {
//
//											for (var i = 0; i < results.rows.length; i++) {
//												$scope.declinedList.push(JSON.parse(results.rows.item(i).objectString));
//											}
//
//											console.log($scope.declinedList);
//
//										}, null);
//									});

//								$scope.acceptedHomeAccepted();

//								appNavigator.resetToPage('indegentacceptedlist.html', {
//									acceptedList: $scope.acceptedList,
//									rejectedList: $scope.rejectedList,
//									closedList: $scope.closedList,
//									declinedList: $scope.declinedList,
//									active: "accepted"
//								});
//								
//								$scope.isFetching = false;
//								modal.hide();


							}).error(function (data, status, headers, config) {

								$scope.isFetching = false;
								modal.hide();

								ons.notification.alert({
									message: JSON.stringify('Something went wrong'),
									modifier: 'material'
								});

							});
		}, onErrorGeo);
				}
        }
        
        
        
        
        
        

		function onErrorGeo(error) {
			ons.notification.alert({
						message: 'Cannot save location! '+ error.message,
						title: 'Indigent App ' + error.code
					});
			$scope.isFetching = false;
			modal.hide();
		}
		
		$scope.setApplicationDeclined = function () {

			$scope.isFetching = true;
            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();
			//console.log($scope.reason);
			var declinedReason;
			if ($scope.reason == 'Other') {
					declinedReason = $scope.other;
				
				console.log('other');
				} else {
					declinedReason = $scope.reason;
				}
			console.log(declinedReason);
			
			$scope.appId = window.localStorage.getItem("appId");

            var applicationRefNo = window.localStorage.getItem("applicationRefNo");
            //TODO add this to the config file
			$scope.API = appConfig.emmupdatefieldworkerapi;
			
            $scope.API = $scope.API + '{"taskStatus":"Declined","applicationId":"' + applicationRefNo + '","reasonForRejection":"' + declinedReason + '"}';
			//console.log($scope.declineReason);
            /*$http.get($scope.API).success(function (data) {*/
				
				/*var db = window.sqlitePlugin.openDatabase({
                    name: 'indigentdb.db',
                    location: 'default'
                });
				db.transaction(function (transaction) {
					
						//Update assignment status to Declined
					var executeQuery = "UPDATE assignment SET status = ? WHERE id = ?";
						transaction.executeSql(executeQuery, ["Declined",$scope.appId], function (tx, result) {
							console.log("UpdateId: " + result.insertId + " -- probably 1");
							console.log("rowsAffected: " + result.rowsAffected + " -- should be 1");

							transaction.executeSql("select count(id) as cnt from assignment", [], function (tx, res) {
								console.log("res.rows.length: " + res.rows.length + " -- should be 1");
								console.log("res.rows.item(0).cnt: " + res.rows.item(0).cnt + " -- should be 1");
							});
							
							$scope.isFetching = false;
							modal.hide();

						}, function (error) {
							console.log("ERROR: " + error);
							$scope.isFetching = false;
							modal.hide();
						});
					});*/
				
                db.transaction(function (transaction) {
                            //select from table assignment
                            var query = "SELECT * FROM assignment WHERE status ='" + 'Accepted' + "' AND fieldWorkerID =?";

                            transaction.executeSql(query, [$scope.username], function (tx, results) {

                                //console.log($scope.acceptedList); 
                                for (var i = 0; i < results.rows.length; i++) {
                                    $scope.acceptedList.push(JSON.parse(results.rows.item(i).objectString));
                                }

                            }, null);
                        });
                        db.transaction(function (transaction) {
                        //select from table assignment
                        var query = "SELECT * FROM assignment WHERE status ='" + 'Closed' + "' AND fieldWorkerID =?";

                        transaction.executeSql(query, [$scope.username], function (tx, results) {

                            for (var i = 0; i < results.rows.length; i++) {
                                $scope.closedList.push(JSON.parse(results.rows.item(i).objectString));
                            }

                            console.log($scope.closedList);

                        }, null);
                    });
                        db.transaction(function (transaction) {
                        //select from table assignment
                        var query = "SELECT * FROM assignment WHERE status ='" + 'Rejected' + "' AND fieldWorkerID =?";

                        transaction.executeSql(query, [$scope.username], function (tx, results) {

                            for (var i = 0; i < results.rows.length; i++) {
                                $scope.rejectedList.push(JSON.parse(results.rows.item(i).objectString));
                            }

                            console.log($scope.closedList);

                        }, null);
                    });

                        appNavigator.resetToPage('indigent-mainmenu.html', {
                            acceptedList: $scope.acceptedList,
                            rejectedList: $scope.rejectedList,
							declinedList: $scope.declinedList,
                            closedList: $scope.closedList
                        });

                $scope.isFetching = false;
                modal.hide();

            
			/*}).error(function (data, status, headers, config) {

                $scope.isFetching = false;
                modal.hide();

                ons.notification.alert({
                    message: JSON.stringify('Something went wrong'),
                    modifier: 'material'
                });

            });*/
        }
        
        //reject with delete
        
        $scope.setApplicationRejected = function () {
            
            var declinedReason;
		
			if($scope.reason == null || $scope.reason == "" || $scope.reason == undefined){
				//alert("Please Select Your Reason.");
				ons.notification.alert({
					message: 'Please select your Reason.',
					title: 'Indigent App'
				});
				
			} else if ($scope.reason == 'Other') {
				declinedReason = $scope.other;
				
                if (declinedReason == null || declinedReason == "" || declinedReason == undefined) {
					//alert('Details cannot be '+ declinedReason);
					ons.notification.alert({
						message: 'Details required',
						title: 'Indigent App'
					});
						$scope.isFetching = false;
						modal.hide();
				} else {
					
					//console.log('other');
					$scope.isFetching = true;
					$rootScope.didYouKnowMessage = loadingMessageService.showMessage();
					modal.show();

					$scope.username = window.localStorage.getItem("username");
					var appId = window.localStorage.getItem("appId");

					var applicationRefNo = window.localStorage.getItem("applicationRefNo");
					
					$scope.API = appConfig.emmupdatefieldworkerapi;
					$scope.API = $scope.API + '{"taskStatus":"Rejected","applicationId":"' + applicationRefNo + '","fieldWorkerRejectionRemarks":"' + declinedReason + '"}';
                    
                    console.log (declinedReason);
                    
					$http.get($scope.API).success(function (data) {
						if (data.body = 'Success')
						{
							$scope.API = appConfig.emmapplicationdetails;
							$scope.API = $scope.API + applicationRefNo;
							console.log ($scope.API);
							
							$http.delete($scope.API).success(function(response){
								if (response.status == "success") {
									console.log('Removed from server');
									
									console.log('Application Deleted Server')

								var db = window.sqlitePlugin.openDatabase({
									name: 'indigentdb.db',
									location: 'default'
								});
								db.transaction(function (transaction) {

									transaction.executeSql('CREATE TABLE IF NOT EXISTS assignment (id,status,objectString,fieldWorkerID)', [], function(tx, result) {
										//console.log("Table created successfully");
									},
									function(error) {
										  console.log("Error occurred while creating the assignment table.");
									});
									var executeQuery ="INSERT INTO assignment (id,status,objectString,fieldWorkerID) VALUES (?,?,?,?)";
									transaction.executeSql(executeQuery, [$scope.applicantDetails._id, "Rejected", JSON.stringify($scope.applicantDetails),$scope.username], function (tx, res) {
										console.log("insertId: " + res.insertId + " -- probably 1");
										console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
													transaction.executeSql("select count(id) as cnt from assignment", [], function (tx, res) {
														console.log("res.rows.length: " + res.rows.length + " -- should be 1");
														console.log("res.rows.item(0).cnt: " + res.rows.item(0).cnt + " -- should be 1");
													});

												}, function (error) {
													alert('Error occurred');
													console.log("ERROR: " + error.message);
												});
								},function(error){
								console.log('Error Rejecting Assignment')
							}, function(){

								console.log('Loading Pages...')
								db.transaction(function (transaction) {
									//select from table assignment
									var query = "SELECT * FROM assignment WHERE status ='" + 'Accepted' + "' AND fieldWorkerID =?";

									transaction.executeSql(query, [$scope.username], function (tx, results) {

											//console.log($scope.acceptedList); 
											for (var i = 0; i < results.rows.length; i++) {
												$scope.acceptedList.push(JSON.parse(results.rows.item(i).objectString));
											}

										}, function(error){
											console.log(error);
										});
									});
								db.transaction(function (transaction) {
								//select from table assignment

								var query = "SELECT * FROM assignment WHERE status ='" + 'Closed' + "' AND fieldWorkerID =?";

								transaction.executeSql(query, [$scope.username], function (tx, results) {

									for (var i = 0; i < results.rows.length; i++) {
										$scope.closedList.push(JSON.parse(results.rows.item(i).objectString));
									}

									console.log($scope.closedList);

								}, null);
							});
								db.transaction(function (transaction) {
									//select from table assignment
									var query = "SELECT * FROM assignment WHERE status ='" + 'Rejected' + "' AND fieldWorkerID =?";

									transaction.executeSql(query, [$scope.username], function (tx, results) {

										for (var i = 0; i < results.rows.length; i++) {
											$scope.rejectedList.push(JSON.parse(results.rows.item(i).objectString));
										}

										console.log($scope.closedList);

									}, null);
								});

								appNavigator.resetToPage('indigent-mainmenu.html', {
									acceptedList: $scope.acceptedList,
									rejectedList: $scope.rejectedList,
									declinedList: $scope.declinedList,
									closedList: $scope.closedList
								});
							});
									ons.notification.alert({
										message: 'Application has been successfully submitted',
										title: 'IndigentApp'
									});
									

									$scope.isFetching = false;
									modal.hide();
								} else {
									console.log('Not Removed');
									ons.notification.alert({
										message: JSON.stringify('Please check your internet connection and submit your application again'),
										modifier: 'material'
									});
									$scope.isFetching = false;
									modal.hide();
								}
							}).error(function (data, status, headers, config) {
						
									console.log(config); 
									console.log(data);
									//console.log(headers);

									ons.notification.alert({
										message: JSON.stringify('Application not Removed'),
										modifier: 'material'
									});
								$scope.isFetching = false;
								modal.hide();
								});
								

						} else {
							alert('Error Rejecting Assignment!!');
						}
					}).error(function (data, status, headers, config) {

						$scope.isFetching = false;
						modal.hide();
						ons.notification.alert({
							message: JSON.stringify('Something went wrong'),
							modifier: 'material'
						});
					});
				}
			} else {
				
                    declinedReason = $scope.reason;
					$rootScope.didYouKnowMessage = loadingMessageService.showMessage();
					modal.show();

					$scope.username = window.localStorage.getItem("username");
					var appId = window.localStorage.getItem("appId");

					var applicationRefNo = window.localStorage.getItem("applicationRefNo");
					//TODO add this to the config file
					$scope.API = appConfig.emmupdatefieldworkerapi;
					$scope.API = $scope.API + '{"taskStatus":"Rejected","applicationId":"' + applicationRefNo + '","fieldWorkerRejectionRemarks":"' + declinedReason + '"}';

					$http.get($scope.API).success(function (data) {
						if (data.body = 'Success')
						{
							$scope.API = appConfig.emmupdateherokuapp;;

							$scope.API = appConfig.emmapplicationdetails;
							$scope.API = $scope.API + applicationRefNo;
							console.log ($scope.API);
				
							$http.delete($scope.API).success(function(response){
								if (response.status == "success") {
									console.log('Removed from server');
									
									console.log('Application Deleted Server')

								var db = window.sqlitePlugin.openDatabase({
									name: 'indigentdb.db',
									location: 'default'
								});
								db.transaction(function (transaction) {

									transaction.executeSql('CREATE TABLE IF NOT EXISTS assignment (id,status,objectString,fieldWorkerID)', [], function(tx, result) {
										//console.log("Table created successfully");
									},
									function(error) {
										  console.log("Error occurred while creating the assignment table.");
									});
									var executeQuery ="INSERT INTO assignment (id,status,objectString,fieldWorkerID) VALUES (?,?,?,?)";
									transaction.executeSql(executeQuery, [$scope.applicantDetails._id, "Rejected", JSON.stringify($scope.applicantDetails),$scope.username], function (tx, res) {
										console.log("insertId: " + res.insertId + " -- probably 1");
										console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
													transaction.executeSql("select count(id) as cnt from assignment", [], function (tx, res) {
														console.log("res.rows.length: " + res.rows.length + " -- should be 1");
														console.log("res.rows.item(0).cnt: " + res.rows.item(0).cnt + " -- should be 1");
													});

												}, function (error) {
													alert('Error occurred');
													console.log("ERROR: " + error.message);
												});
								},function(error){
								console.log('Error Rejecting Assignment')
							}, function(){

								console.log('Loading Pages...')
								db.transaction(function (transaction) {
									//select from table assignment
									var query = "SELECT * FROM assignment WHERE status ='" + 'Accepted' + "' AND fieldWorkerID =?";

									transaction.executeSql(query, [$scope.username], function (tx, results) {

											//console.log($scope.acceptedList); 
											for (var i = 0; i < results.rows.length; i++) {
												$scope.acceptedList.push(JSON.parse(results.rows.item(i).objectString));
											}

										}, function(error){
											console.log(error);
										});
									});
								db.transaction(function (transaction) {
								//select from table assignment

								var query = "SELECT * FROM assignment WHERE status ='" + 'Closed' + "' AND fieldWorkerID =?";

								transaction.executeSql(query, [$scope.username], function (tx, results) {

									for (var i = 0; i < results.rows.length; i++) {
										$scope.closedList.push(JSON.parse(results.rows.item(i).objectString));
									}

									console.log($scope.closedList);

								}, null);
							});
								db.transaction(function (transaction) {
									//select from table assignment
									var query = "SELECT * FROM assignment WHERE status ='" + 'Rejected' + "' AND fieldWorkerID =?";

									transaction.executeSql(query, [$scope.username], function (tx, results) {

										for (var i = 0; i < results.rows.length; i++) {
											$scope.rejectedList.push(JSON.parse(results.rows.item(i).objectString));
										}

										console.log($scope.closedList);

									}, null);
								});

								appNavigator.resetToPage('indigent-mainmenu.html', {
									acceptedList: $scope.acceptedList,
									rejectedList: $scope.rejectedList,
									declinedList: $scope.declinedList,
									closedList: $scope.closedList
								});
							});
									ons.notification.alert({
										message: 'Application has been successfully submitted',
										title: 'IndigentApp'
									});
									

									$scope.isFetching = false;
									modal.hide();
								} else {
									console.log('Not Removed');
									ons.notification.alert({
										message: JSON.stringify('Please check your internet connection and submit your application again'),
										modifier: 'material'
									});
									$scope.isFetching = false;
									modal.hide();
								}
							}).error(function (data, status, headers, config) {
						
									console.log(config); 
									console.log(data);
									//console.log(headers);

									ons.notification.alert({
										message: JSON.stringify('Application not Removed'),
										modifier: 'material'
									});
								$scope.isFetching = false;
								modal.hide();
								});

						} else {
							alert('Error Rejecting Assignment!!');
						}
					}).error(function (data, status, headers, config) {

						$scope.isFetching = false;
						modal.hide();
						ons.notification.alert({
							message: JSON.stringify('Something went wrong'),
							modifier: 'material'
						});
					});
                }
        }
        
        
        
        
        
        
//        
        
        
//        reject without delete 
//         $scope.setApplicationRejected = function () {
//
//            var declinedReason;
//
//            if ($scope.reason == null || $scope.reason == "" || $scope.reason == undefined) {
//                //alert("Please Select Your Reason.");
//                ons.notification.alert({
//                    message: 'Please select your Reason.',
//                    title: 'Indigent App'
//                });
//
//            } else if ($scope.reason == 'Other') {
//                declinedReason = $scope.other;
//
//                if (declinedReason == null || declinedReason == "" || declinedReason == undefined) {
//                    //alert('Details cannot be '+ declinedReason);
//                    ons.notification.alert({
//                        message: 'Details required',
//                        title: 'Indigent App'
//                    });
//                    $scope.isFetching = false;
//                    modal.hide();
//                } else {
//
//                    //console.log('other');
//                    $scope.isFetching = true;
//                    $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
//                    modal.show();
//
//                    $scope.username = window.localStorage.getItem("username");
//                    var appId = window.localStorage.getItem("appId");
//
//                    var applicationRefNo = window.localStorage.getItem("applicationRefNo");
//
//                    $scope.API = appConfig.emmupdatefieldworkerapi;
//                    $scope.API = $scope.API + '{"taskStatus":"Rejected","applicationId":"' + applicationRefNo + '","fieldWorkerRejectionRemarks":"' + declinedReason + '"}';
//
//                    $http.get($scope.API).success(function (data) {
//                        if (data.body = 'Success') {
//                            $scope.API = appConfig.emmupdateherokuapp;
//
//                            $http.post($scope.API, {
//                                applicationID: applicationRefNo,
//                                status: 'Rejected'
//                            }).success(function (data) {
//
//                                var db = window.sqlitePlugin.openDatabase({
//                                    name: 'indigentdb.db',
//                                    location: 'default'
//                                });
//                                db.transaction(function (transaction) {
//
//                                    transaction.executeSql('CREATE TABLE IF NOT EXISTS assignment (id,status,objectString,fieldWorkerID)', [], function (tx, result) {
//                                            //console.log("Table created successfully");
//                                        },
//                                        function (error) {
//                                            console.log("Error occurred while creating the assignment table.");
//                                        });
//                                    var executeQuery = "INSERT INTO assignment (id,status,objectString,fieldWorkerID) VALUES (?,?,?,?)";
//                                    transaction.executeSql(executeQuery, [$scope.applicantDetails._id, "Rejected", JSON.stringify($scope.applicantDetails), $scope.username], function (tx, res) {
//                                        console.log("insertId: " + res.insertId + " -- probably 1");
//                                        console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
//                                        transaction.executeSql("select count(id) as cnt from assignment", [], function (tx, res) {
//                                            console.log("res.rows.length: " + res.rows.length + " -- should be 1");
//                                            console.log("res.rows.item(0).cnt: " + res.rows.item(0).cnt + " -- should be 1");
//                                        });
//
//                                    }, function (error) {
//                                        alert('Error occurred');
//                                        console.log("ERROR: " + error.message);
//                                    });
//                                }, function (error) {
//                                    console.log('Error Rejecting Assignment')
//                                }, function () {
//
//                                    console.log('Loading Pages...')
//                                    db.transaction(function (transaction) {
//                                        //select from table assignment
//                                        var query = "SELECT * FROM assignment WHERE status ='" + 'Accepted' + "' AND fieldWorkerID =?";
//
//                                        transaction.executeSql(query, [$scope.username], function (tx, results) {
//
//                                            //console.log($scope.acceptedList); 
//                                            for (var i = 0; i < results.rows.length; i++) {
//                                                $scope.acceptedList.push(JSON.parse(results.rows.item(i).objectString));
//                                            }
//
//                                        }, function (error) {
//                                            console.log(eror);
//                                        });
//                                    });
//                                    db.transaction(function (transaction) {
//                                        //select from table assignment
//
//                                        var query = "SELECT * FROM assignment WHERE status ='" + 'Closed' + "' AND fieldWorkerID =?";
//
//                                        transaction.executeSql(query, [$scope.username], function (tx, results) {
//
//                                            for (var i = 0; i < results.rows.length; i++) {
//                                                $scope.closedList.push(JSON.parse(results.rows.item(i).objectString));
//                                            }
//
//                                            console.log($scope.closedList);
//
//                                        }, null);
//                                    });
//                                    db.transaction(function (transaction) {
//                                        //select from table assignment
//                                        var query = "SELECT * FROM assignment WHERE status ='" + 'Rejected' + "' AND fieldWorkerID =?";
//
//                                        transaction.executeSql(query, [$scope.username], function (tx, results) {
//
//                                            for (var i = 0; i < results.rows.length; i++) {
//                                                $scope.rejectedList.push(JSON.parse(results.rows.item(i).objectString));
//                                            }
//
//                                            console.log($scope.closedList);
//
//                                        }, null);
//                                    });
//
//                                    appNavigator.resetToPage('indigent-mainmenu.html', {
//                                        acceptedList: $scope.acceptedList,
//                                        rejectedList: $scope.rejectedList,
//                                        declinedList: $scope.declinedList,
//                                        closedList: $scope.closedList
//                                    });
//                                });
//
//                                $scope.isFetching = false;
//                                modal.hide();
//
//
//                            }).error(function (data, status, headers, config) {
//
//                                $scope.isFetching = false;
//                                modal.hide();
//
//                                ons.notification.alert({
//                                    message: JSON.stringify('Something went wrong'),
//                                    modifier: 'material'
//                                });
//
//                            });
//
//                        } else {
//                            alert('Error Rejecting Assignment!!');
//                        }
//                    }).error(function (data, status, headers, config) {
//
//                        $scope.isFetching = false;
//                        modal.hide();
//                        ons.notification.alert({
//                            message: JSON.stringify('Something went wrong'),
//                            modifier: 'material'
//                        });
//                    });
//                }
//            } else {
//
//                declinedReason = $scope.reason;
//                $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
//                modal.show();
//
//                $scope.username = window.localStorage.getItem("username");
//                var appId = window.localStorage.getItem("appId");
//
//                var applicationRefNo = window.localStorage.getItem("applicationRefNo");
//                //TODO add this to the config file
//                $scope.API = appConfig.emmupdatefieldworkerapi;
//                $scope.API = $scope.API + '{"taskStatus":"Rejected","applicationId":"' + applicationRefNo + '","fieldWorkerRejectionRemarks":"' + declinedReason + '"}';
//
//                $http.get($scope.API).success(function (data) {
//                    if (data.body = 'Success') {
//                        $scope.API = appConfig.emmupdateherokuapp;;
//
//                        $http.post($scope.API, {
//                            applicationID: applicationRefNo,
//                            status: 'Rejected'
//                        }).success(function (data) {
//
//                            var db = window.sqlitePlugin.openDatabase({
//                                name: 'indigentdb.db',
//                                location: 'default'
//                            });
//                            db.transaction(function (transaction) {
//
//                                transaction.executeSql('CREATE TABLE IF NOT EXISTS assignment (id,status,objectString,fieldWorkerID)', [], function (tx, result) {
//                                        //console.log("Table created successfully");
//                                    },
//                                    function (error) {
//                                        console.log("Error occurred while creating the assignment table.");
//                                    });
//                                var executeQuery = "INSERT INTO assignment (id,status,objectString,fieldWorkerID) VALUES (?,?,?,?)";
//                                transaction.executeSql(executeQuery, [$scope.applicantDetails._id, "Rejected", JSON.stringify($scope.applicantDetails), $scope.username], function (tx, res) {
//                                    console.log("insertId: " + res.insertId + " -- probably 1");
//                                    console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
//                                    transaction.executeSql("select count(id) as cnt from assignment", [], function (tx, res) {
//                                        console.log("res.rows.length: " + res.rows.length + " -- should be 1");
//                                        console.log("res.rows.item(0).cnt: " + res.rows.item(0).cnt + " -- should be 1");
//                                    });
//
//                                }, function (error) {
//                                    alert('Error occurred');
//                                    console.log("ERROR: " + error.message);
//                                });
//                            }, function (error) {
//                                console.log('Error Rejecting Assignment')
//                            }, function () {
//
//                                console.log('Loading Pages...')
//                                db.transaction(function (transaction) {
//                                    //select from table assignment
//                                    var query = "SELECT * FROM assignment WHERE status ='" + 'Accepted' + "' AND fieldWorkerID =?";
//
//                                    transaction.executeSql(query, [$scope.username], function (tx, results) {
//
//                                        //console.log($scope.acceptedList); 
//                                        for (var i = 0; i < results.rows.length; i++) {
//                                            $scope.acceptedList.push(JSON.parse(results.rows.item(i).objectString));
//                                        }
//
//                                    }, function (error) {
//                                        console.log(error);
//                                    });
//                                });
//                                db.transaction(function (transaction) {
//                                    //select from table assignment
//
//                                    var query = "SELECT * FROM assignment WHERE status ='" + 'Closed' + "' AND fieldWorkerID =?";
//
//                                    transaction.executeSql(query, [$scope.username], function (tx, results) {
//
//                                        for (var i = 0; i < results.rows.length; i++) {
//                                            $scope.closedList.push(JSON.parse(results.rows.item(i).objectString));
//                                        }
//
//                                        console.log($scope.closedList);
//
//                                    }, null);
//                                });
//                                db.transaction(function (transaction) {
//                                    //select from table assignment
//                                    var query = "SELECT * FROM assignment WHERE status ='" + 'Rejected' + "' AND fieldWorkerID =?";
//
//                                    transaction.executeSql(query, [$scope.username], function (tx, results) {
//
//                                        for (var i = 0; i < results.rows.length; i++) {
//                                            $scope.rejectedList.push(JSON.parse(results.rows.item(i).objectString));
//                                        }
//
//                                        console.log($scope.closedList);
//
//                                    }, null);
//                                });
//
//                                appNavigator.resetToPage('indigent-mainmenu.html', {
//                                    acceptedList: $scope.acceptedList,
//                                    rejectedList: $scope.rejectedList,
//                                    declinedList: $scope.declinedList,
//                                    closedList: $scope.closedList
//                                });
//                            });
//
//                            $scope.isFetching = false;
//                            modal.hide();
//
//
//                        }).error(function (data, status, headers, config) {
//
//                            $scope.isFetching = false;
//                            modal.hide();
//
//                            ons.notification.alert({
//                                message: JSON.stringify('Something went wrong'),
//                                modifier: 'material'
//                            });
//
//                        });
//
//                    } else {
//                        alert('Error Rejecting Assignment!!');
//                    }
//                }).error(function (data, status, headers, config) {
//
//                    $scope.isFetching = false;
//                    modal.hide();
//                    ons.notification.alert({
//                        message: JSON.stringify('Something went wrong'),
//                        modifier: 'material'
//                    });
//                });
//            }
//        }
//        
        
        
        
        
        
        
        
        
        
        $scope.declineButtonDialog = function (material) {
			
				var mod = material ? 'material' : undefined;

				ons.notification.confirm({
				  message: 'Are you sure you want to decline this application?',
				  modifier: mod,
				  callback: function(idx) {
					switch (idx) {
					  case 0:
						break;
					  case 1:
							appNavigator.pushPage('decline.html');
							ons.notification.alert({
							
							  message: 'Provide reason for declining this Application.',
							  modifier: mod
							});
						break;
					}
				  }
        });
			
		}
		
		$scope.rejectButtonDialog = function (material) {
			
				var mod = material ? 'material' : undefined;

				ons.notification.confirm({
				  message: 'Are you sure you want to Reject this application?',
				  modifier: mod,
				  callback: function(idx) {
					switch (idx) {
					  case 0:
						break;
					  case 1:
							appNavigator.pushPage('reject.html');
							ons.notification.alert({
							
							  message: 'Provide reason for Rejecting this Application.',
							  modifier: mod
							});
						break;
					}
				  }
        });
			
		}
		
//		$scope.deleteButtonDialog = function (material) {
//            var mod = material ? 'material' : undefined;
//            var appId = window.localStorage.getItem("appId");
//
//            ons.notification.confirm({
//                message: 'Are you sure you want to Delete this application?',
//                modifier: mod,
//                callback: function (idx) {
//                    switch (idx) {
//                        case 0:
//
//                            break;
//                        case 1:
//
//                            var appId = window.localStorage.getItem("appId");
//                            var db = window.sqlitePlugin.openDatabase({
//                                name: 'indigentdb.db',
//                                location: 'default'
//                            });
//
//                            db.transaction(function (transaction) {
//                                console.log(appId);
//
//                                var query = "DELETE from assignment WHERE id='" + appId + "'";
//
//
//                                transaction.executeSql(query, [], function (tx, result) {
//                                      
//
//                                    },
//                                    function (tx, error) {
//                                        console.log('DELETE error: ' + error.message);
//                                    });
//                            }, function (error) {
//                                console.log('transaction error: ' + error.message);
//                            }, function () {
//                                console.log(alert('Deleted successfully'));
//                                
//                                
////                                
////                              db.transaction(function (transaction) {
////                            //select from table assignment
////                            var query = "SELECT * FROM assignment WHERE status ='" + 'Accepted' + "'";
////
////                            transaction.executeSql(query, [], function (tx, results) {
////
////                                //console.log($scope.acceptedList); 
////                                for (var i = 0; i < results.rows.length; i++) {
////                                    $scope.acceptedList.push(JSON.parse(results.rows.item(i).objectString));
////                                }
////
////                            }, null);
////                        });
////                        db.transaction(function (transaction) {
////                        //select from table assignment
////                        var query = "SELECT * FROM assignment WHERE status ='" + 'Closed' + "'";
////
////                        transaction.executeSql(query, [], function (tx, results) {
////
////                            for (var i = 0; i < results.rows.length; i++) {
////                                $scope.closedList.push(JSON.parse(results.rows.item(i).objectString));
////                            }
////
////                            console.log($scope.closedList);
////
////                        }, null);
////                    });
////                        db.transaction(function (transaction) {
////                        //select from table assignment
////                        var query = "SELECT * FROM assignment WHERE status ='" + 'Rejected' + "'";
////
////                        transaction.executeSql(query, [], function (tx, results) {
////
////                            for (var i = 0; i < results.rows.length; i++) {
////                                $scope.rejectedList.push(JSON.parse(results.rows.item(i).objectString));
////                            }
////
////                            console.log($scope.closedList);
////
////                        }, null);
////                    });
////
//                        appNavigator.pushPage('indigent-mainmenu.html', {
//                            acceptedList: $scope.acceptedList,
//                            rejectedList: $scope.rejectedList,
//                            closedList: $scope.closedList
//                        });
////                                
//                            });
//                            $scope.isFetching = false;
//                            modal.hide();
//
//                            break;
//                    }
//                }
//            });
//        }
        
		
		$scope.deleteButtonDialog = function (material) {
			console.log(material);
            var mod = material ? 'material' : undefined;
            
			//var appId = window.localStorage.getItem("appId");

			var appId = material._id;
			
            ons.notification.confirm({
                message: 'Are you sure you want to Delete this application?',
                modifier: mod,
                callback: function (idx) {
                    switch (idx) {
                        case 0:
                            break;
                        case 1:
							
							$scope.isFetching = true;
							$rootScope.didYouKnowMessage = loadingMessageService.showMessage();
							modal.show();
							
							var db = window.sqlitePlugin.openDatabase({
                                name: 'indigentdb.db',
                                location: 'default'
                            });

                            db.transaction(function (transaction) {
                                console.log(appId);

								var query = "DELETE from assignment WHERE id='" + appId + "'"
								
                                /*var query = "UPDATE assignment SET status ='" + 'Accepted' + "' WHERE id='" + appId + "'";*/

                                transaction.executeSql(query, [], function (tx, result) {
									console.log(result);
									var db = window.sqlitePlugin.openDatabase({
										name: 'indigentdb.db',
										location: 'default'
									});
									$scope.username = window.localStorage.getItem("username");
									//alert('Deleted successfully');
									db.transaction(function (transaction) {
									//select from table assignment
									var query = "SELECT * FROM assignment WHERE status ='" + 'Accepted' + "' AND fieldWorkerID =?";

									transaction.executeSql(query, [$scope.username], function (tx, results) {

										//console.log($scope.acceptedList); 
										for (var i = 0; i < results.rows.length; i++) {
											$scope.acceptedList.push(JSON.parse(results.rows.item(i).objectString));
										}

									}, null);
								});
									db.transaction(function (transaction) {
									//select from table assignment
									var query = "SELECT * FROM assignment WHERE status ='" + 'Closed' + "' AND fieldWorkerID =?";

									transaction.executeSql(query, [$scope.username], function (tx, results) {

											for (var i = 0; i < results.rows.length; i++) {
												$scope.closedList.push(JSON.parse(results.rows.item(i).objectString));
											}

											console.log($scope.closedList);

										}, null);
									});
									db.transaction(function (transaction) {
										//select from table assignment
										var query = "SELECT * FROM assignment WHERE status ='" + 'Rejected' + "' AND fieldWorkerID =?";

										transaction.executeSql(query, [$scope.username], function (tx, results) {

											for (var i = 0; i < results.rows.length; i++) {
												$scope.rejectedList.push(JSON.parse(results.rows.item(i).objectString));
											}

											console.log($scope.closedList);

										}, null);
									});
								
									appNavigator.pushPage('indigent-mainmenu.html', {
										acceptedList: $scope.acceptedList,
										rejectedList: $scope.rejectedList,
										closedList: $scope.closedList
									});

								
									$scope.isFetching = false;
									modal.hide();
                                    
								}, function (error) {
									console.log('transaction error: ' + error.message);
								}, function () {
									console.log('Deleted successfully');

									
									
								
									ons.notification.alert({
									  message: 'Application  Deleted.',
									  modifier: mod
									});
								});
							
							})

                            break;
                    }
                }
            });
        }
		
		$scope.CompleteApplication = function () {
            $scope.isFetching = true;
            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();
			
			var page = appNavigator.getCurrentPage();
			var appId = page.options.id;
			var applicationRefNo = page.options.applicationRefNo;
			$scope.username = window.localStorage.getItem("username");
			
			//window.get(appId)
			//$scope.applicantDetails = JSON.parse(page.options.acceptedDetails);
			
			var db = window.sqlitePlugin.openDatabase({
				name: 'indigentdb.db',
				location: 'default'
			});
				
            db.transaction(function (transaction) {
				console.log(appId);
                var query = "SELECT * from assignment WHERE id='" + appId + "'";

                transaction.executeSql(query, [], function (tx, result) {
                    if (result.rows.length > 0) {

                        $scope.applicantDetails = JSON.parse(result.rows.item(0).objectString);
                        console.log(JSON.stringify($scope.applicantDetails));
                        
                       

                    } else {
                        console.log("No results found");

                    }
                }, null);
        	});
			
			console.log($scope.applicantDetails);
			
			console.log($scope.applicantDetails.indigentApplicationDetails.comment);
			
			if ($scope.applicantDetails.indigentApplicationDetails.comment == undefined || $scope.applicantDetails.indigentApplicationDetails.comment == null || $scope.applicantDetails.indigentApplicationDetails.comment == "" || $scope.applicantDetails.indigentApplicationDetails.comment.lenght == 0) {
				alert('Living Conditions Not completed!');
				$scope.isFetching = false;
				modal.hide();
                
			} else if ($scope.applicantDetails.indigentApplicationDetails.householdDetail[0].isVerified == undefined || $scope.applicantDetails.indigentApplicationDetails.householdDetail[0].isVerified == null || $scope.applicantDetails.indigentApplicationDetails.householdDetail[0].isVerified == "" ||    $scope.applicantDetails.indigentApplicationDetails.householdDetail[0].isVerified == 0) {
				alert('Household not verified!')
                $scope.isFetching = false;
				modal.hide();
                }
			else if ($scope.applicantDetails.indigentApplicationDetails.customerSignature == undefined || $scope.applicantDetails.indigentApplicationDetails.customerSignature == null || $scope.applicantDetails.indigentApplicationDetails.customerSignature == "" ||    $scope.applicantDetails.indigentApplicationDetails.customerSignature == 0){
				alert('Customer Signature Required!')
				$scope.isFetching = false;
				modal.hide();
			} else {
				$scope.API = 'http://webmethods.ekurhuleni.gov.za:5555/rest/EMMIndigentUI/resources/saveIndigentMobiAppDetail/';
			
				//$scope.applicantDetails = JSON.stringify(applicantDetails);
				//$scope.API = $scope.API + JSON.stringify($scope.applicantDetails);

				
				$http.post($scope.API, JSON.stringify($scope.applicantDetails)).success(function (data) {
					console.log($scope.API);
                    console.log(data);
					if (data.lastError == undefined){
						if (data.statusResponse.statusDescription == 'Success') {
							
							$scope.API = appConfig.emmapplicationdetails;
							$scope.API = $scope.API + applicationRefNo;
                            
                            
							console.log ($scope.API);
							
							$http.delete($scope.API ).success(function(response){
								if (response.status == "success") {
									console.log(response);
									db.transaction(function (transaction) {
									//Update assignment status to Closed
									var executeQuery = "UPDATE assignment SET status = ? WHERE id = ?";
									transaction.executeSql(executeQuery, ["Closed", appId], function (tx, result) {

										console.log("UpdateId: " + result.insertId + " -- probably 1");
										console.log("rowsAffected: " + result.rowsAffected + " -- should be 1");

										transaction.executeSql("select count(id) as cnt from assignment", [], function (tx, res) {
											console.log("res.rows.length: " + res.rows.length + " -- should be 1");
											console.log("res.rows.item(0).cnt: " + res.rows.item(0).cnt + " -- should be 1");
											//alert('Your application has been successfully submitted')
										});
										transaction.executeSql("SELECT * FROM assignment WHERE status ='" + 'Accepted' + "' AND fieldWorkerID =?", [$scope.username], function (tx, results) {

											//console.log($scope.acceptedList); 
											for (var i = 0; i < results.rows.length; i++) {
												$scope.acceptedList.push(JSON.parse(results.rows.item(i).objectString));
											}

											console.log($scope.acceptedList);
										})

										transaction.executeSql("SELECT * FROM assignment WHERE status ='" + 'Closed' + "' AND fieldWorkerID =?", [$scope.username], function (tx, results) {

											for (var i = 0; i < results.rows.length; i++) {
												$scope.closedList.push(JSON.parse(results.rows.item(i).objectString));
											}

											console.log($scope.closedList);

										});

										transaction.executeSql("SELECT * FROM assignment WHERE status ='" + 'Rejected' + "' AND fieldWorkerID =?", [$scope.username], function (tx, results) {

											for (var i = 0; i < results.rows.length; i++) {
												$scope.rejectedList.push(JSON.parse(results.rows.item(i).objectString));
											}

											console.log($scope.rejectedList);

										});
										
										transaction.executeSql("SELECT * FROM assignment WHERE status ='" + 'Declined' + "' AND fieldWorkerID =?", [$scope.username], function (tx, results) {

											for (var i = 0; i < results.rows.length; i++) {
												$scope.declinedList.push(JSON.parse(results.rows.item(i).objectString));
											}

											console.log($scope.rejectedList);

										});
									});

								}, function (error) {
									console.log("ERROR: " + error);
//									alert('Error Saving on Closed Locally.Please delete closed assignments');
                                                                                

                                        
                                        ons.notification.alert({
										message: 'Your assiggnment was successfully submitted, however was not saved locally data files are 100 percent full in database, Please delete closed assignments',
										title: 'IndigentApp'
									});

                                                                                
                                        
									$scope.isFetching = false;
									modal.hide();
								}, function (){
									console.log('Application Saved To Closed Assignments')
									/*db.transaction(function (transaction) {
										//select from table assignment
										transaction.executeSql("SELECT * FROM assignment WHERE status ='" + 'Accepted' + "' AND fieldWorkerID =?", [$scope.username], function (tx, results) {

											//console.log($scope.acceptedList); 
											for (var i = 0; i < results.rows.length; i++) {
												$scope.acceptedList.push(JSON.parse(results.rows.item(i).objectString));
											}

											console.log($scope.acceptedList);
										});
									});*/

									/*db.transaction(function (transaction) {
										//select from table assignment
										var query = "SELECT * FROM assignment WHERE status ='" + 'Closed' + "' AND fieldWorkerID =?";

										transaction.executeSql("SELECT * FROM assignment WHERE status ='" + 'Closed' + "' AND fieldWorkerID =?", [$scope.username], function (tx, results) {

											for (var i = 0; i < results.rows.length; i++) {
												$scope.closedList.push(JSON.parse(results.rows.item(i).objectString));
											}

											console.log($scope.closedList);

										});
									});*/

									/*db.transaction(function (transaction) {
										//select from table assignment
										var query = "SELECT * FROM assignment WHERE status ='" + 'Rejected' + "' AND fieldWorkerID =?";

										transaction.executeSql("SELECT * FROM assignment WHERE status ='" + 'Rejected' + "' AND fieldWorkerID =?", [$scope.username], function (tx, results) {

											for (var i = 0; i < results.rows.length; i++) {
												$scope.rejectedList.push(JSON.parse(results.rows.item(i).objectString));
											}

											console.log($scope.rejectedList);

										});
									});*/
										
										
									ons.notification.alert({
										message: 'Application has been successfully submitted',
										title: 'IndigentApp'
									});

									appNavigator.resetToPage('indegentacceptedlist.html', {
										acceptedList: $scope.acceptedList,
										rejectedList: $scope.rejectedList,
										closedList: $scope.closedList,
										declinedList: $scope.declinedList,
										active: "accepted"
									});
									

									$scope.isFetching = false;
									modal.hide();
								});
								} else {
									console.log('Not Removed');
									ons.notification.alert({
										message: JSON.stringify('Please check your internet connection and submit your application again'),
										modifier: 'material'
									});
									$scope.isFetching = false;
									modal.hide();
								}
							}).error(function (data, status, headers, config) {
						
									console.log(config); 
									console.log(data);
									//console.log(headers);

									ons.notification.alert({
										message: JSON.stringify('Application was succefully submitted, however could detele from mobile DB'),
										modifier: 'material'
									});
								$scope.isFetching = false;
								modal.hide();
								});
								
							} else {
								
								ons.notification.alert({
									message: 'The server encountered an internal error. Please contact Service Desk.!',
									title: 'IndigentApp'
								});
								//alert('Error detected. Please Resubmit!');
								$scope.isFetching = false;
								modal.hide();
							}
					} else {
						
						console.log(data.lastError);
						
						ons.notification.alert({
							message: 'The server encountered an internal error. Please contact Service Desk!',
							title: 'IndigentApp'
						});

						//alert('Error detected. Please Resubmit!');
						$scope.isFetching = false;
						modal.hide();
					}
					/*db.transaction(function (transaction) {
							//Update assignment status to Closed
							var executeQuery = "UPDATE assignment SET status = ? WHERE id = ?";
							transaction.executeSql(executeQuery, ["Closed", appId], function (tx, result) {

								console.log("UpdateId: " + result.insertId + " -- probably 1");
								console.log("rowsAffected: " + result.rowsAffected + " -- should be 1");

								transaction.executeSql("select count(id) as cnt from assignment", [], function (tx, res) {
									console.log("res.rows.length: " + res.rows.length + " -- should be 1");
									console.log("res.rows.item(0).cnt: " + res.rows.item(0).cnt + " -- should be 1");
									//alert('Your application has been successfully submitted')
								});

							}, null);
						}, function (error) {
							console.log("ERROR: " + error);
							alert('Error occured, please resubmit');
								  
							$scope.isFetching = false;
							modal.hide();
						}, function () {
							$scope.username = window.localStorage.getItem("username");
							//$scope.acceptedHome();
							console.log('Loading Pages...')
							db.transaction(function (transaction) {
								//select from table assignment
								var query = "SELECT * FROM assignment WHERE status ='" + 'Accepted' + "' AND fieldWorkerID =?";

								transaction.executeSql(query, [$scope.username], function (tx, results) {

										//console.log($scope.acceptedList); 
										for (var i = 0; i < results.rows.length; i++) {
											$scope.acceptedList.push(JSON.parse(results.rows.item(i).objectString));
										}

									}, function(error){
										console.log(eror);
									});
								});
							db.transaction(function (transaction) {
								//select from table assignment

								var query = "SELECT * FROM assignment WHERE status ='" + 'Closed' + "' AND fieldWorkerID =?";

								transaction.executeSql(query, [$scope.username], function (tx, results) {

									for (var i = 0; i < results.rows.length; i++) {
										$scope.closedList.push(JSON.parse(results.rows.item(i).objectString));
									}

									console.log($scope.closedList);

								}, null);
							});
							db.transaction(function (transaction) {
								//select from table assignment
								var query = "SELECT * FROM assignment WHERE status ='" + 'Rejected' + "' AND fieldWorkerID =?";

								transaction.executeSql(query, [$scope.username], function (tx, results) {

									for (var i = 0; i < results.rows.length; i++) {
										$scope.rejectedList.push(JSON.parse(results.rows.item(i).objectString));
									}

									console.log($scope.closedList);

								}, null);
							});

							appNavigator.resetToPage('indigent-mainmenu.html', {
								acceptedList: $scope.acceptedList,
								rejectedList: $scope.rejectedList,
								closedList: $scope.closedList
							});
					
							$scope.isFetching = false;
							modal.hide();
						})
					*/
				}).error(function (data, status, headers, config) {
						
					console.log(config); 
					console.log(data);
					//console.log(headers);
						
					ons.notification.alert({
						message: JSON.stringify('Please check your internet connection and submit your application again'),
						modifier: 'material'
					});
				$scope.isFetching = false;
				modal.hide();
				});
			}
		}
										  
        $scope.saveApplicationDetails = function () {

            $scope.isFetching = true;
            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();

            var applicationRefNo = window.localStorage.getItem("applicationRefNo");

			$scope.username = window.localStorage.getItem("username");
            var signature = JSON.parse(window.localStorage.getItem("applicationSignature"));
			var status = $scope.status;
			console.log(status);
			
			$scope.username = window.localStorage.getItem("username");
            //TODO add this to the config file
            $scope.API = 'http://196.15.242.146:5555/rest/EMMIndigentUI/resources/saveIndigentMobiAppDetail/';

            $scope.applicantDetails = JSON.parse(window.localStorage.getItem("applicantDetails"));

            $scope.API = $scope.API + JSON.stringify($scope.applicantDetails);

            console.log($scope.API);
			
			// Cordova is ready
			var db = window.sqlitePlugin.openDatabase({
                    name: 'indigentdb.db',
                    location: 'default'
                });
                db.transaction(function (tx) {

                    tx.executeSql('CREATE TABLE IF NOT EXISTS assignment (id,status,objectString)');

                    tx.executeSql("INSERT INTO assignment (id,status,objectString) VALUES (?,?,?)", [$scope.applicantDetails._id, $scope.status, JSON.stringify($scope.applicantDetails)], function (tx, res) {
                        console.log("insertId: " + res.insertId + " -- probably 1");
                        console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");

                        tx.executeSql("select count(id) as cnt from assignment", [], function (tx, res) {
                            console.log("res.rows.length: " + res.rows.length + " -- should be 1");
                            console.log("res.rows.item(0).cnt: " + res.rows.item(0).cnt + " -- should be 1");
                        });

                    }, function (e) {
                        console.log("ERROR: " + e.message);
						ons.notification.alert({
							 message: JSON.stringify('Something went wrong, Application Stored Offline'),
							 modifier: 'material'
						 });
                    });
                });
			
				$scope.isFetching = false;
                modal.hide();
		
            }
		
		/*
		
		$scope.API = $scope.API + '{"indigentApplicationDetails":{"geographicalLocation":"gps","originalApplicantDetail":{"contactDetail":{"cellNo":" 0730366598","workPhoneNo":"0116166868","preferredEmail":"kamil-dayal@hotmail.com","preferredPost":"none","eMail":"kk@hotmi.com","housePhoneNo":"0116153898","preferredSMS":"0730366598","isPostalAddressSameAsResidential":"yes"},"residentialDetail":{"ownership":"Owner","servicesKind":{"meterDetail":{"meterNo":"1234","meterKind":"Electricity"},"electricityAppliances":{"Heaters":"'+$scope.assignment.indigentApplicationDetails.originalApplicantDetail.residentialDetail.servicesKind.electricityAppliances.Heaters+'","Cooking":"'+$scope.assignment.indigentApplicationDetails.originalApplicantDetail.residentialDetail.servicesKind.electricityAppliances.Cooking+'","Radio":"'+$scope.assignment.indigentApplicationDetails.originalApplicantDetail.residentialDetail.servicesKind.electricityAppliances.Radio+'","WashingMachine":"'+$scope.assignment.indigentApplicationDetails.originalApplicantDetail.residentialDetail.servicesKind.electricityAppliances.WashingMachine+'","Vaccuming":"'+$scope.assignment.indigentApplicationDetails.originalApplicantDetail.residentialDetail.servicesKind.electricityAppliances.Vaccuming+'","Geyser":"'+$scope.assignment.indigentApplicationDetails.originalApplicantDetail.residentialDetail.servicesKind.electricityAppliances.Geyser+'","TV":"'+$scope.assignment.indigentApplicationDetails.originalApplicantDetail.residentialDetail.servicesKind.electricityAppliances.TV+'","Lights":"'+$scope.assignment.indigentApplicationDetails.originalApplicantDetail.residentialDetail.servicesKind.electricityAppliances.TV+'"}},"outerSpace":"'+$scope.assignment.indigentApplicationDetails.originalApplicantDetail.residentialDetail.outerSpace+'","innerSpace":"'+$scope.assignment.indigentApplicationDetails.originalApplicantDetail.residentialDetail.innerSpace+'","propertyKind":"'+$scope.assignment.indigentApplicationDetails.originalApplicantDetail.residentialDetail.propertyKind+'"},"personDetail":{"relationship":"Son","idNo":"8802175240085","maindenName":"dayal","title":"Mr","initials":"'+$scope.assignment.indigentApplicationDetails.householdExpenditureDetail.food+'","gender":"Male","surname":"dayal","birthDate":"17-02-1988","maritalStatus":"Single","ageRange":"25-30","firstNames":"kamil","personID":"123"},"postalAddress":{"houseNo":"11","wardNo":"10","postalCode":"2094","suburb":"jhb","town":"jhb","addressID":"123","addressLine2":"jjj","addressLine1":"123","POB":"jhb"},"residentialAddress":{"houseNo":"134","wardNo":"3","postalCode":"2094","suburb":"jhb","town":"bedfordview","addressID":"123","addressLine2":"11th ave","suburbCode":"12","addressLine1":"138"}},"location":"kkkk","locationAccuracy":"bad","indigentOffice":"no","householdExpenditureDetail":{"water":"'+$scope.assignment.indigentApplicationDetails.householdExpenditureDetail.water+'","bondPayment":"'+$scope.assignment.indigentApplicationDetails.householdExpenditureDetail.bondPayment+'","other":"'+$scope.assignment.indigentApplicationDetails.householdExpenditureDetail.other+'","medical":"'+$scope.assignment.indigentApplicationDetails.householdExpenditureDetail.medical+'","transport":"'+$scope.assignment.indigentApplicationDetails.householdExpenditureDetail.transport+'","food":"' + $scope.assignment.indigentApplicationDetails.householdExpenditureDetail.food + '","electricity":"'+$scope.assignment.indigentApplicationDetails.householdExpenditureDetail.electricity+'","education":"'+$scope.assignment.indigentApplicationDetails.householdExpenditureDetail.education+'","rental":"'+$scope.assignment.indigentApplicationDetails.householdExpenditureDetail.rental+'"},"fieldWorkerArea":"'+$scope.assignment.indigentApplicationDetails.fieldWorkerArea+'","fieldWorkerWardNo":"'+$scope.assignment.indigentApplicationDetails.fieldWorkerWardNo+'","indigentApplicationHeader":{"applicationRefNo":"'+$scope.assignment.indigentApplicationDetails.indigentApplicationHeader.applicationRefNo+ '","applicationState":"'+$scope.assignment.indigentApplicationDetails.indigentApplicationHeader.applicationState+'","appActivity":{"action":"none","eventName":"city","comment":"hello","departmentName":"water","user":"kamil"},"applicantKind":"'+$scope.assignment.indigentApplicationDetails.indigentApplicationHeader.applicantKind+'","applicationType":"'+$scope.assignment.indigentApplicationDetails.indigentApplicationHeader.applicationType+'","debtorKind":"'+$scope.assignment.indigentApplicationDetails.indigentApplicationHeader.debtorKind+'","applicationCCA":"'+$scope.assignment.indigentApplicationDetails.indigentApplicationHeader.applicationCCA+'","applicationCCC":"'+$scope.assignment.indigentApplicationDetails.indigentApplicationHeader.applicationCCC+'","financeDetail":{"incentiveCode":"10","expiryDate":"Tue Feb 02 00:00:00 CAT 2016","councilResolution":"none","subsidyCode":"123455"},"applicationDate":"Sat Jan 02 00:00:00 CAT 2016","applicationStatus":"'+$scope.assignment.indigentApplicationDetails.indigentApplicationHeader.applicationStatus+'","erfNo":"'+$scope.assignment.indigentApplicationDetails.indigentApplicationHeader.erfNo+'","emmAccountNo":"'+$scope.assignment.indigentApplicationDetails.indigentApplicationHeader.emmAccountNo+'","personID":"'+$scope.assignment.indigentApplicationDetails.indigentApplicationHeader.personID+'"},"customerSignature":"' + signature + '","imageList":["hahahhaha.img"],"conditionsDetail":{"clothingDetail":{"rating":{"rating":"Well"}},"foodDetail":{"rating":{"rating":"Well"}},"medicalDetail":{"rating":{"rating":"Fair"}},"shelterDetail":{"rating":{"rating":"Fair"}}},"fieldWorkerRemarks":"none","imageNameList":["' + $scope.image1 + ',' + $scope.image2 + ',' + $scope.image3 + '"],"householdDetail":[{"isVerified":"yes","workSituationDetail":{"employmentDetail":{"employerName":"investec","employerKind":"Company","employmentStatus":"Unemployed"},"skillDesiredDetail":{"skillDetail":{"educationLevel":"Tertiary","educationDescription":"none","competency":"Mechanic"}},"workTerminationReason":"Affirmative Action","workDuration":"40","workKind":"Clerical","skillCurrentDetail":{"skillDetail":{"educationLevel":"Tertiary","educationDescription":"degree","competency":"Carpenter"}}},"healthDetail":{"healthKind":"Poor","mentalDefectDescription":"none","poorHealthDetails":"dying from the shits","disability":"none","mentalDefect":"none","disabilityDetails":"non"},"incomeDetail":{"amount":"10000","incomeKind":"salary","budgetDetail":{"uif":"no","accountHolder":"Mr K ","previousWorkPension":"no","otherIncome":"no","propertyRenting":"no","oldAgePension":"no","totalPersonIncome":"no","disabilityPension":"no","homeBusiness":"no"},"regularity":"Monthly"},"personDetail":{"relationship":"Applicant","maindenName":"dayal","title":"Mr","initials":"k","gender":"Male","surname":"dayal","birthDate":"17-02-1988","maritalStatus":"Married","ageRange":"25-30","firstNames":"kamil"},"currentApplicationRefNo":"' + applicationRefNo + '","remarks":"none"}]}}';*/

		$scope.loadAcceptedOffline = function () {

            $scope.isFetching = true;
            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();
            
            // load from sqllite
            
            var userdata = {};
            
            // Cordova is ready
			
				var db = window.sqlitePlugin.openDatabase({
                    name: 'indigentdb.db',
                    location: 'default'
                });

				db.transaction(function(tx) {
					
				//check from table session
					var query = "SELECT * from assignment status = Accepted";
					tx.executeSql(db, query, []).then(function(res) {
						console.log(res.rows.length);
						console.log(res.rows);
						
						if(res.rows.length > 0){
						res = JSON.parse(JSON.stringify(res.rows.item(2)));
						$scope.items = JSON.parse(res.objectString);

						 console.log($scope.items);
						//console.log(JSON.stringify(res));
						} else {
							ons.notification.alert({
							 message: JSON.stringify('No Accepted Assignments'),
							 modifier: 'material'
						 });
						};
					}, function (err) {
						console.error(err);
						ons.notification.alert({
							 message: JSON.stringify('Something went wrong, Application Stored Offline'),
							 modifier: 'material'
						 });
					});
				});
			$scope.isFetching = false;
            modal.hide();
		}
		
		$scope.deleteApplicationDetails = function () {

            $scope.isFetching = true;
            $rootScope.didYouKnowMessage = loadingMessageService.showMessage();
            modal.show();

            var applicationRefNo = window.localStorage.getItem("applicationRefNo");

            /*var signature = JSON.parse(window.localStorage.getItem("applicationSignature"));*/

            //TODO add this to the config file
            $scope.API = 'http://196.15.242.146:5555/rest/EMMIndigentUI/resources/deleteIndigentMobiAppDetail/';

            $scope.applicantDetails = JSON.parse(window.localStorage.getItem("applicantDetails"));

            $scope.API = $scope.API + JSON.stringify($scope.applicantDetails);

            console.log($scope.API);
			
            $http.get($scope.API).success(function (data) {

				if (data.body == 'Success'){
					
				} else {
					alert('Error Deleting Assignment');
				}
                $scope.isFetching = false;
                modal.hide();

            }).error(function (data, status, headers, config) {

                $scope.isFetching = false;
                modal.hide();

                ons.notification.alert({
                    message: JSON.stringify('Something went wrong'),
                    modifier: 'material'
                });

            });

        }

	}]);

    app.controller('DocCtrl', ['$http', '$scope', '$rootScope', '$sce', 'appConfig', 'loadingMessageService', '$soap', '$q', function ($http, $scope, $rootScope, $sce, appConfig, loadingMessageService, $soap, $q) {

        $scope.loadDocumentInfo = function () {

            $scope.pdfName = 'Relativity: The Special and General Theory by Albert Einstein';

            var applicationRefNo = window.localStorage.getItem("applicationRefNo");

            var applicationDetails = JSON.parse(window.localStorage.getItem("applicationDetails"));

            $scope.pdfData = "data:application/pdf;base64," + applicationDetails.imageList[0];

            var currentBlob = new Blob([$scope.pdfData], {
                type: 'application/pdf'
            });

            $scope.pdfUrl = URL.createObjectURL(currentBlob);


            //TODO add this to config file
            /*
                        $scope.API = 'http://196.15.242.146:5555/rest/EMMIndigentUI/resources/getIndigentMobiAppDetailImage/{"indigentApplicationHeader":{"applicationRefNo":"' + applicationRefNo + '"}}';

                        $http.get($scope.API).success(function (data) {

                            $scope.pdfData = "data:application/pdf;base64," + applicationDetails.imageList[0];

                            var currentBlob = new Blob([$scope.pdfData], {
                                type: 'application/pdf'
                            });

                            $scope.pdfUrl = URL.createObjectURL(currentBlob);

                            $scope.isFetching = false;
                            modal.hide();

                        }).error(function (data, status, headers, config) {

                            $scope.isFetching = false;
                            modal.hide();

                            ons.notification.alert({
                                message: JSON.stringify('Something went wrong'),
                                modifier: 'material'
                            });

                        });
            */



            $scope.scroll = 0;
            $scope.loading = 'loading';

            $scope.getNavStyle = function (scroll) {
                if (scroll > 100) return 'pdf-controls fixed';
                else return 'pdf-controls';
            }

            $scope.onError = function (error) {
                console.log(error);
            }

            $scope.onLoad = function () {
                $scope.loading = '';
            }

            $scope.onProgress = function (progressData) {
                console.log(progressData);
            };
        }

    }]);

    app.controller('loginController', ['$scope', '$rootScope', '$sce', '$http', function ($scope, $rootScope, $sce, $http) {

        $scope.init = function () {

            $scope.username = window.localStorage.getItem("username");
            $scope.password = window.localStorage.getItem("password");

            if ($scope.username != null && $scope.password != null) {
                appNavigator.pushPage('main-tab.html');
            }

        }

        $scope.signUp = function () {

            appNavigator.pushPage('signup.html');

        }

        $scope.forgot = function () {

            appNavigator.pushPage('forgot.html');

        }

        $scope.login = function () {

            if (typeof $scope.username === 'undefined' && typeof $scope.password === 'undefined') {

				
                ons.notification.alert({
                    message: 'Username or password not provided!',
                    modifier: 'material'
                });


            } else {

//                $scope.API = appConfig.emmloginapiEndPoint;

//                $scope.API = $scope.API + '"username":"' + $scope.username + '","password":"' + $scope.password + '"}';

                window.localStorage.setItem("username", $scope.username);
                window.localStorage.setItem("password", $scope.password);
                
//                $http.get($scope.API).success(function (response) {
//
//                    if (response[0].status == 'success') {
//
//                        window.localStorage.setItem("idNumber", response[0].SAid);
//                        window.localStorage.setItem("crmNumber", response[0].crmid);
//
//                        window.localStorage.setItem("username", $scope.username);
//                        window.localStorage.setItem("password", $scope.password);
//
//                        appNavigator.pushPage('main-tab.html');
//                    } else {
//                        ons.notification.alert({
//                            message: response[0].Description,
//                            modifier: 'material'
//                        });
//                    }
//
//                }).error(function (error) {
//                    ons.notification.alert({
//                        message: 'Oops!!! Problem logging in.!',
//                        modifier: 'material'
//                    });
//                });
            }

        }

        $scope.pushForgotPassword = function () {

            if (typeof $scope.email === 'undefined') {

                ons.notification.alert({
                    message: 'Email not provided!',
                    modifier: 'material'
                });


            } else {

                $scope.API = appConfig.emmpasswordrecoveryapiEndPoint;
                $scope.API = $scope.API + '"emailAddress":"' + $scope.email + '"}';

                $http.get($scope.API).success(function (response) {

                    ons.notification.alert({
                        message: response[0].status.description,
                        modifier: 'material'
                    });

                    appNavigator.pushPage('signin.html');


                });
            }
        }

    }]);
    
    app.controller('notificationController', ['$scope', '$rootScope', '$sce', '$http', function ($scope, $rootScope, $sce, $http) {

        var page = appNavigator.getCurrentPage();
        var ids = page.options.ids;

        $scope.sendMessage = function () {

            var message = {
                app_id: "a17d1266-3037-4f13-8c29-e2203d0f3458",
                contents: {
                    "en": $scope.message
                },
                include_player_ids: [ids]
            };

            $http.post("https://onesignal.com/api/v1/notifications", message, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ODUzM2RkOWYtZWM0MS00NzI5LWE0MGItMWI0ZDU5MDQ3MDc4'
                }
            }).success(function (responseData) {
                appNavigator.pushPage('counsellor.html');
                appNavigator.getCurrentPage().destroy();
            }).error(function (error) {
                alert(JSON.stringify(error));
            });

        };

    }]);

    app.controller('loadingMessageService', ['$scope', function ($scope) {

        $scope.showMessage = function () {

            $scope.messageList = ["Contributes 6.2% to national production;", "Has a share of ±7.3% of national employment;", "Produces 26% of the total economic output of Gauteng;"];

            $scope.didyouknowmessage = $scope.messageList[Math.floor(Math.random() * $scope.messageList.length)];

        }

    }]);

    app.controller('testController', ['$scope', '$rootScope', '$sce', '$http', function ($scope, $rootScope, $sce, $http) {

        $scope.downloadPDF = function () {

            var dlnk = document.getElementById('dwnldLnk');

            $scope.API = "https://munipoiapp.herokuapp.com/api/assigments/imagelist/1000047687/index/0";

            $http.get($scope.API).success(function (data) {

                var base64str = "data:application/octet-stream;base64," + data.doc;

                dlnk.href = base64str;

                dlnk.click();


                alert('Working');

            }).error(function (data, status, headers, config, error) {

                ons.notification.alert({
                    message: JSON.stringify(error),
                    modifier: 'material'
                });

            });

        }

    }]);
	
    // Maps Functions //

    // Math Functions
    function Deg2Rad(deg) {
        return deg * Math.PI / 180;
    }

    // Get Distance between two lat/lng points using the Haversine function
    // First published by Roger Sinnott in Sky & Telescope magazine in 1984 ("Virtues of the Haversine")
    function Haversine(lat1, lon1, lat2, lon2) {
        var R = 6372.8; // Earth Radius in Kilometers

        var dLat = Deg2Rad(lat2 - lat1);
        var dLon = Deg2Rad(lon2 - lon1);

        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(Deg2Rad(lat1)) * Math.cos(Deg2Rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;

        // Return Distance in Kilometers
        return d;
    }

})();