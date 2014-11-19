//==================================================================================================================================================================
// below are the common functions
function user_login()
{
    $.post("login_success.php",function(result){
      var output = jQuery.parseJSON( result );
      //alert(result);
      if(output.stat == 1 )
      {
        $('#user_logged').html("<h3>Welcome "+output.user+"</h3>");
      }
      else if(output.stat == 0)
      {
      	$(location).attr('href',"../login.html");
      }
      else
      {
      	alert("BUG : stat set wrongly to: " + output.stat);
      }
    });
}


function redirect_new_graph()
{
	$(location).attr('href',"save_graph.html");
}




function set_cxt_menu(cy)
{

	cy.cxtmenu({
		commands: [
			{
				content: '<span class="fa fa-flash fa-2x"></span>',
				select: function(){
					console.log( this.id() );
				}
			},

			{
				content: '<span class="fa fa-star fa-2x"></span>',
				select: function(){
					console.log( this.data('name') );
					//cy.remove(this);
				}
			},
			{
				content: 'Delete Node',
				select: function(){
					delete_node(this);
					console.log( 'Deleted node with id: '+this.data('id') );
				}
			},
			{
					content: 'Modify details',
					select: function(){
						var pos = this.position();
						//$( "#dialog-confirm" ).show();
						mod_node = this;
						mod_node_id = this.id();
						add_data_to_form(this);
						dialog.dialog( "open" );

					}
			},
			{
				content: 'All Data',
				select: function(){
					alert(JSON.stringify(this.data() ));
					//console.log( this.data() );
				}
			}
		]
	});

	cy.cxtmenu2({
		commands: [
			{
				content: '<span class="fa fa-flash fa-2x"></span>',
				select: function(){
					console.log( this.id() );
				}
			},

			{
				content: '<span class="fa fa-star fa-2x"></span>',
				select: function(){
					console.log( this.data('name') );
					//cy.remove(this);
				}
			},
			{
				content: 'Delete Edge',
				select: function(){
					delete_edge(this);
					console.log( 'Deleted edge with id: '+this.data('id') );
				}
			},
			{
					content: 'Modify details',
					select: function(){
						var pos = this.position();
						//$( "#dialog-confirm" ).show();
						mod_node = this;
						mod_node_id = this.id();
						add_data_to_form(this);
						dialog.dialog( "open" );

					}
			},
			{
				content: 'All Data',
				select: function(){
					alert(JSON.stringify( this.data() ));
					//console.log( this.data() );
				}
			}
		]
	});

}



//==================================================================================================================================================================
//below are the functions used graph_viewOnly.html

var mod_node = {};
var mod_node_id,cy;
var dialog;


function add_data_to_form(node)
{
	var input_fields = "";
	jQuery.each(node.data(), 
							function(i, val)
							{
								if(!(i=="id"))
								{
								  input_fields += '<label for="'+i+'">'+ i +'</label>'+
								  					'<input type="text" name="'+i+'" id="'+i+'" value="'+val+'" class="text ui-widget-content ui-corner-all"/>';
								}
								else
								{
									input_fields += '<p> Id of the node is ' + val +'. You can\'t modify this(id).</p>';
								}
							}
				);


	var f_data = '<fieldset>'+input_fields+'<input type="submit" tabindex="-1" style="position:absolute; top:-1000px">'+'</fieldset>';
	$( "#d_form" ).html(f_data);
}


function change_data()
{
	var formData = new Object();
	jQuery.each(mod_node.data(), function(i, val) {
		  formData[i] = $('#'+i).val();
		});
	console.info(formData);
	//var j = cy.$('#'+node_key1);
	mod_node.data(formData);
	dialog.dialog( "close" );
}




//==================================================================================================================================================================
// below are the functions used by app.html 

function getNextCounter() 
{
	var data_to_be_sent = new Object();
	data_to_be_sent.graph = "abcd";
	data_to_be_sent.operation_type = "counter_query";
	var counter = 42;
	$.ajax({
		  type: 'POST',
		  url: "app.php",
		  data: data_to_be_sent,
		  success: function(result)
		  {
		  		var output = jQuery.parseJSON( result );
				if(output.stat >= 0 )
				{	//alert("returned from php "+output.stat);
					counter = output.stat; //alert('counter set to:  '+counter);
				}
				else
				{
					alert('Something went wrong in getting the counter!');
				}
		  },
		  error: function()
		  {
			  // do something if there was an error
		  },
		  //dataType: dataType,
		  async:false
	});
    //alert('hello there!! '+counter);
    return counter;
	
}


function add_new_node() 
{
	var node_id1 = document.getElementById('node_id1').value;
	var node_key1 = document.getElementById('node_key1').value;

	var searchEles = document.getElementById("add_new_nodes_inputs").children;
	var id_array = [];
	var key_array = [];

	for(var i = 0; i < searchEles.length; i++) 
	{
	    if(searchEles[i].tagName == 'INPUT') 
	    {
	        if(searchEles[i].id.indexOf('node_id') == 0) 
	        {
	            id_array.push(searchEles[i]);
	        }
	        if(searchEles[i].id.indexOf('node_key') == 0) 
	        {
	            key_array.push(searchEles[i]);
	        }
	    }
	}

	var node_data = {};
	node_data[node_id1] = node_key1;
	for(var i = 0; i < id_array.length; i++)
	{
		node_data[id_array[i].value] = key_array[i].value;
	}
	var node_data_json = JSON.stringify(node_data);
	//alert(node_data_json);

	var node_position = {};
	node_position["x"] = 750;
	node_position["y"] = 220;
	var node_position_json = JSON.stringify(node_position);
	//alert(node_position_json);


	
	var node_complete = {};
	node_complete['group'] = 'nodes';
	node_complete['data'] = node_data;
	node_complete['position'] = node_position;
	//var node_complete_json = JSON.stringify(node_complete);
	//alert(node_complete_json);

	var eles =  cy.add(node_complete
	//JSON.parse(node_complete_json)
	// ,{ group: "edges", data: { id: "e6878", source: "n0", target: "n1" } }
	);

	//alert(JSON.stringify(eles));

	var node_sending = new Object();
	node_sending.node_complete = node_complete;
	node_sending.node_status = "add";
	node_sending.node_undo = false;
	node_sending.counter = getNextCounter();
	//var node_complete_json = JSON.stringify(node_sending);
	//alert(node_complete_json);

	if ( eles != null )
	{
		var data_to_be_sent = new Object();
		data_to_be_sent.node_sending = node_sending;
		data_to_be_sent.graph = "abcd";
		data_to_be_sent.operation_type = "add_node";

		$.post("app.php",data_to_be_sent,function(result)
		{
			var output = jQuery.parseJSON( result );
			if(output.stat == 0 )
			{
				$(location).attr('href',"../login.html");
			}
			else
			{
				//alert('Added to mongo');
			}
	       // $("#success_msg").html(output.dataval);
	    });
	}
	else
	{
		alert('cyto error');
	}


	var j = cy.$('#'+node_key1);
	//alert(j.id);
	cy.animate({
	  fit: {
	    eles: j,
	     padding: 280
	  }
	}, {
	  duration: 1000
	});

	// cy.animate(
	// {
	// 	pan: { x: 100, y: 120 },
	// 	zoom: 2
	// },
	// {
	// 	duration: 10000
	// });

	
}
function delete_node (node) 
{
	var node_complete = {};
	node_complete['id'] = node.data('id');
	var node_sending = new Object();
	node_sending.node_complete = node_complete;
	node_sending.node_status = "delete";
	node_sending.node_undo = false;
	var a = getNextCounter();
	//alert(a);
	node_sending.counter = a; 
	

	//var node_complete_json = JSON.stringify(node_sending);
	//alert(node_complete_json);

	var eles = cy.remove(node);
	if ( eles != null )
	{
		var data_to_be_sent = new Object();
		data_to_be_sent.node_sending = node_sending;
		data_to_be_sent.graph = "abcd";
		data_to_be_sent.operation_type = "delete_node";
		$.post("app.php",data_to_be_sent,function(result)
		{
			var output = jQuery.parseJSON( result );
			if(output.stat == 0 )
			{
				$(location).attr('href',"../login.html");
			}
			else
			{
				//alert(output.dataval);
			}
	       // $("#success_msg").html(output.dataval);
	    });
	}
	else
	{
		alert('cyto error');
	}
}

function delete_edge (edge) 
{
	var edge_complete = {};
	edge_complete['id'] = edge.data('id');
	var edge_sending = new Object();
	edge_sending.edge_complete = edge_complete;
	edge_sending.edge_status = "delete";
	edge_sending.edge_undo = false;
	edge_sending.counter = getNextCounter();

	var edge_complete_json = JSON.stringify(edge_sending);
	//alert(edge_complete_json);

	var eles = cy.remove(edge);
	if ( eles != null )
	{
		var data_to_be_sent = new Object();
		data_to_be_sent.edge_sending = edge_sending;
		data_to_be_sent.graph = "abcd";
		data_to_be_sent.operation_type = "delete_edge";
		$.post("app.php",data_to_be_sent,function(result)
		{
			var output = jQuery.parseJSON( result );
			if(output.stat == 0 )
			{
				$(location).attr('href',"../login.html");
			}
			else
			{
				//alert(output.dataval);
			}
	       // $("#success_msg").html(output.dataval);
	    });
	}
	else
	{
		alert('cyto error');
	}
}

//==================================================================================================================================================================
//