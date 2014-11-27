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
	        var url = $(location).attr('href');
			var name = url.split("?")[2].split("=")[1];
			$('#graph_name_displayer').html(name);

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
var dialog4, form4;
$(function(){
			
		dialog4 = $( "#dialog-details" ).dialog({
						autoOpen: false,
						minHeight:"auto",
						width: "auto",
						minWidth:300,
						modal: true,
						close: function() {
							//allFields.removeClass( "ui-state-error" );
						}
					});

		});
//===============================================================================================
function show_details(obj)
{
	var output = "<table class='table table-striped'>";
	jQuery.each(obj, 
							function(i, val)
							{
								output += "<tr><td>"+i+"</td><td>:</td><td>"+val+"</td></tr>"
							}
				);
	output += "</table>";
	$("#det").html(output);
	dialog4.dialog("open");
}

function redirect_new_graph()
{
	$(location).attr('href',"save_graph.html");
}

function redirect_user_available_graphs()
{
	$(location).attr('href',"user_available_graphs.html");
}

 var native_color;
 var i = 0;
function set_cxt_menu(cy)
{

	cy.cxtmenu({
		commands: [
			{
				content: '<span class="fa fa-flash fa-2x"></span>',
				select: function(){
					console.log( this.id() );
					if(i == 1)
					{
						this.css("background-color",native_color);
					}
				}
			},

			{
				content: '<span class="fa fa-star fa-2x"></span>',
				select: function(){
					console.log( this.data('name') );
					if(i == 0)
					{
						native_color = this.css("background-color");
					}
					i = 1;
					this.css("background-color","blue");
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
						mod_element = this;
						mod_element_id = this.id();
						add_data_to_form(this);
						dialog.dialog( "open" );

					}
			},
			{
				content: 'All Data',
				select: function(){
					//alert(JSON.stringify(this.data() ));
					//console.log( this.data() );
					show_details(this.data());
				}
			}
		]
	});

	cy.cxtmenu2({
		commands: [
			// {
			// 	content: '<span class="fa fa-flash fa-2x"></span>',
			// 	select: function(){
			// 		console.log( this.id() );
			// 	}
			// },

			// {
			// 	content: '<span class="fa fa-star fa-2x"></span>',
			// 	select: function(){
			// 		console.log( this.data('name') );
			// 		//cy.remove(this);
			// 	}
			// },
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
						mod_element = this;
						mod_element_id = this.id();
						add_data_to_form(this);
						dialog.dialog( "open" );

					}
			},
			{
				content: 'All Data',
				select: function(){
					//alert(JSON.stringify( this.data() ));
					//console.log( this.data() );
					show_details(this.data());
				}
			}
		]
	});

}



//==================================================================================================================================================================
//below are the functions used graph_viewOnly.html

var mod_element = {};
var mod_element_id,cy;
var dialog;


function add_data_to_form(element)
{
	var input_fields = "";
	jQuery.each(element.data(), 
							function(i, val)
							{
								if(!(i=="id" || i=="source" || i=="target"))
								{
								  input_fields += '<label for="'+i+'">'+ i +'</label>'+
								  					'<input type="text" name="'+i+'" id="'+i+'" value="'+val+'" class="text ui-widget-content ui-corner-all"/>';
								}
								else
								{
									input_fields += '<p> '+i+' of the element is ' + val +'. You can\'t modify this('+i+').</p>';
								}
							}
				);


	var f_data = '<fieldset>'+input_fields+'<input type="submit" tabindex="-1" style="position:absolute; top:-1000px">'+'</fieldset>';
	$( "#d_form" ).html(f_data);
}


function change_data()
{
	var formData = new Object();
	jQuery.each(mod_element.data(), function(i, val) {
		  formData[i] = $('#'+i).val();
		});

	formData['id'] = mod_element_id;
	console.info(formData);
	//var j = cy.$('#'+node_key1);

	mod_element.data(formData);
	dialog.dialog( "close" );


	var element_sending = new Object();

	element_sending.modify_element_data = formData;

	element_sending.op_type = "modify_element";
	element_sending.undo = false;
	element_sending.counter = getNextCounter();


	var data_to_be_sent = new Object();
	data_to_be_sent.modify_element = element_sending;
	data_to_be_sent.graph = document.getElementById('graph_name_displayer').innerHTML; //"abcd";
	data_to_be_sent.operation_type = "modify_graph";

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

//===========================================================================================================
// below are the functions used for dumping changes to graph

function dump_my_changes(cy)
{
	var data_to_be_sent = new Object();
	var my_changes;

	data_to_be_sent.graph = document.getElementById('graph_name_displayer').innerHTML; //"abcd";

		$.ajax({
		  type: 'POST',
		  url: "modify.php",
		  data: data_to_be_sent,
		  success: function(result)
		  {
		  		var output = jQuery.parseJSON( result );
				if(output.stat >= 0 )
				{	//alert("returned from php "+output.stat);
					counter = output.stat; //alert('counter set to:  '+counter);
					//alert(JSON.stringify(output.dataval));
					my_changes = output.dataval;
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

	jQuery.each(my_changes, function(i,val) 
	{

		//alert(JSON.stringify(val));
		if ( val.op_type == "add_node" )
		{
			cy.add(val.node_complete);
		}
		else if ( val.op_type == "delete_node" )
		{
			cy.remove(cy.$('#'+val.node_complete.id));
		}
		else if ( val.op_type == "modify_element" )
		{
			(cy.$('#'+val.modify_element_data.id)).data(val.modify_element_data);
		}
		else if ( val.op_type == "add_edge" )
		{
			cy.add(val.edge_complete);
		}
		else if ( val.op_type == "delete_edge" )
		{
			cy.remove(cy.$('#'+val.edge_complete.id));
		}

	});
}


function versioned_dump_my_changes(cy,my_changes)
{

	jQuery.each(my_changes, function(i,tal) 
	{

		if( i == "gdata" )
		{
			return;
		}
		if ( i == "gstyle" )
		{
			return;
		}


		jQuery.each(tal, function(j,val) 
		{

			if ( val.op_type == "add_node" )
			{
				cy.add(val.node_complete);
			}
			else if ( val.op_type == "delete_node" )
			{
				cy.remove(cy.$('#'+val.node_complete.id));
			}
			else if ( val.op_type == "modify_element" )
			{
				(cy.$('#'+val.modify_element_data.id)).data(val.modify_element_data);
			}
			else if ( val.op_type == "add_edge" )
			{
				cy.add(val.edge_complete);
			}
			else if ( val.op_type == "delete_edge" )
			{
				cy.remove(cy.$('#'+val.edge_complete.id));
			}
			else
			{
				alert("bla");
			}
		});

	});
}

//==================================================================================================================================================================
// below are the functions used by app.html 

function getNextCounter() 
{
	var data_to_be_sent = new Object();
	data_to_be_sent.graph = document.getElementById('graph_name_displayer').innerHTML; //"abcd";
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

	var searchEles =$("#add_node_form input"); 
	var id_array = [];
	var key_array = [];

	//alert(searchEles.length);
	searchEles.each(function(index) {

         //alert(index + ': ' + $(this).attr("id") + "=" + $(this).val());
        if($(this).attr("id").indexOf('node_id') == 0) 
        {
        	//alert("hi there");
            id_array.push($(this).val());
        }
        if($(this).attr("id").indexOf('node_key') == 0) 
        {
        	//alert("hi friend");
            key_array.push($(this).val());
        }

    });

	var node_data = new Object();
	//alert(id_array.length);
	for(var i = 0; i < id_array.length; i++)
	{
		node_data[id_array[i]] = key_array[i];
		//alert(id_array[i] + ": " + node_data[id_array[i]]);
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
	node_sending.op_type = "add_node";
	node_sending.undo = false;
	node_sending.counter = getNextCounter();
	//var node_complete_json = JSON.stringify(node_sending);
	//alert(node_complete_json);

	if ( eles != null )
	{
		var data_to_be_sent = new Object();
		data_to_be_sent.node_sending = node_sending;
		data_to_be_sent.graph = document.getElementById('graph_name_displayer').innerHTML; //"abcd";
		
		data_to_be_sent.operation_type = "add_node";
		//alert(JSON.stringify(data_to_be_sent));

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


	//var j = eles;//cy.$('#'+node_key1);
	//alert(j.id);
	cy.animate({
	  fit: {
	    eles: eles,
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

function add_new_edge() 
{
	
	var searchEles =$("#add_edge_form input"); 
	var id_array = [];
	var key_array = [];

	//alert(searchEles.length);
	searchEles.each(function(index) {

         //alert(index + ': ' + $(this).attr("id") + "=" + $(this).val());
        if($(this).attr("id").indexOf('edge_id') == 0) 
        {
        	//alert("hi there");
            id_array.push($(this).val());
        }
        if($(this).attr("id").indexOf('edge_key') == 0) 
        {
        	//alert("hi friend");
            key_array.push($(this).val());
        }
        if($(this).attr("id").indexOf('source') == 0) 
        {
        	//alert("hi friend");
            id_array.push("source");
            key_array.push($(this).val());

        }
        if($(this).attr("id").indexOf('target') == 0) 
        {
        	//alert("hi friend");
            id_array.push("target");
            key_array.push($(this).val());
        }

    });





	var edge_data = new Object();

	for(var i = 0; i < id_array.length; i++)
	{
		edge_data[id_array[i]] = key_array[i];
	}
	var edge_data_json = JSON.stringify(edge_data);
	//alert(edge_data_json);

	// var edge_position = {};
	// edge_position["x"] = 750;
	// edge_position["y"] = 220;
	// var edge_position_json = JSON.stringify(edge_position);
	//alert(edge_position_json);


	
	var edge_complete = {};
	edge_complete['group'] = 'edges';
	edge_complete['data'] = edge_data;
	//edge_complete['position'] = edge_position;
	// var edge_complete_json = JSON.stringify(edge_complete);
	// alert(edge_complete_json);

	var eles =  cy.add(edge_complete
	//JSON.parse(edge_complete_json)
	// ,{ group: "edges", data: { id: "e6878", source: "n0", target: "n1" } }
	);

	//alert(JSON.stringify(eles));

	var edge_sending = new Object();
	edge_sending.edge_complete = edge_complete;
	edge_sending.op_type = "add_edge";
	edge_sending.undo = false;
	edge_sending.counter = getNextCounter();
	//var edge_complete_json = JSON.stringify(edge_sending);
	//alert(edge_complete_json);

	if ( eles != null )
	{
		var data_to_be_sent = new Object();
		data_to_be_sent.edge_sending = edge_sending;
		data_to_be_sent.graph = document.getElementById('graph_name_displayer').innerHTML; //"abcd";
		
		data_to_be_sent.operation_type = "add_edge";

		//alert(JSON.stringify(data_to_be_sent));

		$.post("app.php",data_to_be_sent,function(result)
		{
			var output = jQuery.parseJSON( result );
			//alert(JSON.stringify(output));
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


	//var j = eles;
	//alert(j.id);
	cy.animate({
	  fit: {
	    eles: eles,
	     //padding: 280
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
	node_sending.op_type = "delete_node";
	node_sending.undo = false;
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
	// 	alert('hello delete');
	// alert(document.getElementById('graph_name_displayer').innerHTML);
		data_to_be_sent.graph = document.getElementById('graph_name_displayer').innerHTML; //"abcd";

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
	edge_sending.op_type = "delete_edge";
	edge_sending.undo = false;
	edge_sending.counter = getNextCounter();

	var edge_complete_json = JSON.stringify(edge_sending);
	//alert(edge_complete_json);

	var eles = cy.remove(edge);
	if ( eles != null )
	{
		var data_to_be_sent = new Object();
		data_to_be_sent.edge_sending = edge_sending;
		data_to_be_sent.graph = document.getElementById('graph_name_displayer').innerHTML; //"abcd";

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
//last day modifications
var x = 2;
var x2 = 2; //initlal text box count
var form2,form3;
var	dialog2, dialog3;

		function test()
		{
			alert("hello");
		}
		function add_dialog_open()
		{
			dialog2.dialog( "open" );
		}
		function add_e_dialog_open()
		{
			dialog3.dialog("open");
		}
		function add_node()
		{
			add_new_node();
			dialog2.dialog( "close" );
		}
		function add_edge()
		{
			add_new_edge();
			dialog3.dialog( "close" );
		}
		function add_remove()
		{
			//alert(this.id);
			
		            
		        
		        if($(this).hasClass('btn-success'))
		        {
		        	var wrapper         = $(".input_fields_wrap"); //Fields wrapper
				           // $(wrapper).append('<div><input type="text" name="mytext[]"/><input type="text" name="mytext[]"/><a href="#" class="remove_field">Remove</a></div>'); //add input box


		            $(wrapper).append('<div><label for="Field '+x+'">Field '+x+'</label>		            <div class="row">	<div class="col-md-5">			           <input type="text" placeholder="Key '+x+' ..." id="node_id'+x+'" name="node_id'+x+'" class="text ui-widget-content ui-corner-all">			            </div>			            <div class="col-md-5">		            <input type="text" placeholder="Value '+x+' ..." id="node_key'+x+'" class="text ui-widget-content ui-corner-all">			            </div>			            <div class="col-md-2">			           <button id= "add_field_button"'+x+' class="btn btn-success btn-add" type="button" onclick="add_remove.call(this)" ><span class="glyphicon glyphicon-plus-sign"></span></button>			            </div>			            </div></div>');

		        	$(this).removeClass('btn-success');
		        	$(this).addClass('btn-danger');
			            
			        $(this).html('<span class="glyphicon glyphicon-minus"></span>');

			       x++;
		        }
		        else
		        {
		        	$(this).parent('div').parent('div').parent('div').remove();
		        }
		        
		}


		function add_e_remove()
		{
			//alert(this.id);
			
		            
		        
		        if($(this).hasClass('btn-success'))
		        {
		        	var wrapper         = $(".input_fields_wrap2"); //Fields wrapper
				           // $(wrapper).append('<div><input type="text" name="mytext[]"/><input type="text" name="mytext[]"/><a href="#" class="remove_field">Remove</a></div>'); //add input box


		            $(wrapper).append('<div><label for="Field '+x2+'">Field '+x2+'</label>		            <div class="row">	<div class="col-md-5">			           <input type="text" placeholder="Key '+x2+' ..." id="edge_id'+x2+'" name="edge_id'+x2+'" class="text ui-widget-content ui-corner-all">			            </div>			            <div class="col-md-5">		            <input type="text" placeholder="Value '+x2+' ..." id="edge_key'+x2+'" class="text ui-widget-content ui-corner-all">			            </div>			            <div class="col-md-2">			           <button id= "add_field_button"'+x2+' class="btn btn-success btn-add" type="button" onclick="add_e_remove.call(this)" ><span class="glyphicon glyphicon-plus-sign"></span></button>			            </div>			            </div></div>');

		        	$(this).removeClass('btn-success');
		        	$(this).addClass('btn-danger');
			            
			        $(this).html('<span class="glyphicon glyphicon-minus"></span>');

			       x2++;
		        }
		        else
		        {
		        	$(this).parent('div').parent('div').parent('div').remove();
		        }
		        
		}


		$(function(){
			
		dialog2 = $( "#dialog-add-node" ).dialog({
						autoOpen: false,
						minHeight:"auto",
						width: "auto",
						modal: true,
						buttons: {
							"Update": add_node,
							Cancel: function() {
								dialog.dialog( "close" );
							}
						},
						close: function() {
							form2[ 0 ].reset();
							//allFields.removeClass( "ui-state-error" );
						}
					});

				form2 = dialog2.find( "form" ).on( "submit", function( event ) {
					event.preventDefault();
					add_node();
				});

		dialog3 = $( "#dialog-add-edge" ).dialog({
						autoOpen: false,
						minHeight:"auto",
						width: "auto",
						modal: true,
						buttons: {
							"Update": add_edge,
							Cancel: function() {
								dialog.dialog( "close" );
							}
						},
						close: function() {
							form3[ 0 ].reset();
							//allFields.removeClass( "ui-state-error" );
						}
					});

				form3 = dialog3.find( "form" ).on( "submit", function( event ) {
					event.preventDefault();
					add_edge();
				});


		});
function set_layout(layout_name)
{
	//alert(layout_name);

	var layout_option ={
		name: layout_name,
		fit: true,
		avoidOverlap: true,
		animate :true,
		maxSimulationTime : 4000
	};
	if(layout_name.indexOf("breadthfirst") == 0)
	{
		//alert("heheh");
		
	}
	cy.layout(layout_option);
}
var j,old_color;
function change_color_old()
{
					j.css("background-color",old_color);
}
function change_color_green()
{
					j.css("background-color","green");
}
function change_color_blue()
{
					j.css("background-color","blue");
}
function query_node()
{
	//var j = eles;//cy.$('#'+node_key1);
	//alert(j.id);
	j = cy.$('#'+$("#node_q").val());
	cy.center(j);
	old_color = j.css("background-color");
	j.css("background-color","red");

	if(j != null)
	{
		cy
			.animate(
				{	
				  fit: {
				    eles: j,
				    padding: 280
				  }
				}, 
				{
				  duration: 600
				}
				// {
				// 	complete: change_color
				// }
			)

			.delay(0, change_color_blue)

			.delay(500,change_color_green)

			.delay(500, change_color_old);
	}

}


function logout()
{
	$.post("logout.php",function(result){
		$(location).attr('href',"../login.html");
	});
}
//===============================================================================================