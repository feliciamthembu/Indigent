/*global app */
'use strict';
app
.constant('appConfig', {
  municloudapiEndPoint: 'http://196.15.242.193:5000/',
  devEndPoind: 'http://196.15.242.195:5000/',
  qaEndPoint: 'http://196.15.242.196:5000/',
  nearbysearchapiEndPoint : 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=',
  poiapiEndPoint : 'http://munipoiapp.herokuapp.com/api/pois',
  googledirectionapiEndPoint : 'http://maps.google.com/maps?saddr=',
    
    //Ekurhuleni
//  emmupdatefieldworkerapi: 'http://webmethods.ekurhuleni.gov.za:5555/rest/EMMShared/resources/updateFieldWorkerTaskStatus/',
    
    emmupdatefieldworkerapi: 'http://192.168.1.109:3000/api/setApplicationAccepts',
    
    
    
    
    
  emmdropdownmenu: 'http://webmethods.ekurhuleni.gov.za:5555/rest/EMMIndigentUI/restServices/getIndigentStaticValueRest',
    
    //DEV
//  emmupdateherokuapp: 'http://196.15.242.195:5000/api/applications',
//  emmapplicationdetails: 'http://196.15.242.195:5000/api/assigments/',
    
    //QA
//    emmupdateherokuapp: 'http://196.15.242.196:5000/api/applications',
//  emmapplicationdetails: 'http://196.15.242.196:5000/api/assigments/',
//    
    //Production 
    
//     emmupdateherokuapp: 'http://196.15.242.193:5000/api/applications',
//     emmapplicationdetails: 'http://196.15.242.193:5000/api/assigments/',
//    
    // LoopBack
    
    emmupdateherokuapp: 'http://192.168.1.109:3000/api/applications',
     emmapplicationdetails: 'http://192.168.1.109:3000/api/applications/',
    
    
    

    
    
	emmloginapiEndPoint : 'http://wmdev.ekurhuleni.gov.za:5555/rest/EMMDirectoryServices/resources/AdAuthentication/?',
  
  notificationapiEndPoint : 'https://onesignal.com/api/v1/notifications'
  
})
.value('curSymbol', {
	symbol: 'R'
});
