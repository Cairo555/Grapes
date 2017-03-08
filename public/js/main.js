$(document).ready(function(){
	$('.deleteCard').on('click', deleteCard);
});

function deleteCard(){
	var confirmation = confirm('Are you sure?');

	if(confirmation){
		$.ajax({
			type:'DELETE',
			url: '/cards/delete/'+$(this).data('id')
		}).done(function(response){
			window.location.replace('/');
		});
			window.location.replace('/');
	} else {
		return false;
	}
	
}