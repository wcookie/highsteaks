

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

var Postmates = require('postmates');
var postmates = new Postmates('cus_K5vDOomds3hWb-', '2162a6d6-0229-4839-98d5-b8ae3c7d6eb5');
var pickup="2315 Sheridan Road, Evanston, IL";
var delivery="2245 Sheridan Road, Evanston, IL";

var delivery = {
  pickup_address: pickup,
  dropoff_address: delivery,
};
 
var cost=0;
 var erorr= false;

var checked=false;
var quoteID=""; 
function check(){ 

postmates.quote(delivery, function(err, res) {
	
  if (res.body.fee!=null)
  {
  	
  console.log(res.body.fee); // 799 
	cost=res.body.fee;
   quoteID=res.body.id;
   }
	else
	{
		console.log("ERROR");
		erorr=true;
	}
	//console.log("cost is " + cost);
	//console.log("error is " + erorr);
	checked=true;
});

}
var delivered=false;
function makeOrder(){
	check();

	order();

	deliveryCheck();
}



var delivery2 = {
  manifest: "a box of kittens",
  pickup_name: "The Warehouse",
  pickup_address: pickup,
  pickup_phone_number: "555-555-5555",
  pickup_business_name: "Optional Pickup Business Name, Inc.",
  pickup_notes: "Optional note that this is Invoice #123",
  dropoff_name: "Alice",
  dropoff_address: "2245 Sheridan Road, Evanston, IL",
  dropoff_phone_number: "415-555-1234",
  dropoff_business_name: "Optional Dropoff Business Name, Inc.",
  dropoff_notes: "Optional note to ring the bell",
  quote_id: quoteID,
};

var delivery_eta=""
function order(){


      if (checked) {
           //console.log(cost+" "+erorr+" "+quoteID);
      	postmates.new(delivery2, function(err, res) {
      		 
      		 console.log(quoteID);
      		 quoteID=res.body.quote_id;
  			 console.log(quoteID);
  			 delivered=true;

  			 
		});

      } else {
           setTimeout(order, 250);
      }
 }


makeOrder();
function deliveryCheck(){
	if (delivered)
	{
		console.log(quoteID);
		postmates.get(quoteID, function(err, res) {
  		console.log(res.body);
  		console.log(res.body.status); // "pickup" 
		postmates.list('ongoing', function(err, res) {
  // `res.body` is an array of Delivery objects 

  	console.log(res.body);
  //	console.log(res.body.data[0].dropoff_eta);

});

});
	}
	else
	{
		console.log("FAIL");
		setTimeout(deliveryCheck,250);
	}
}