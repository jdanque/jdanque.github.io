
var Homepage = (function($,my){
	
	my.initDownloadCV = function(){
		
	};
	
	my.init = function(){
		my.initDownloadCV();
	};
	
	return my;
})(jQuery, Homepage || {});

var Contact = (function($,my){
	
	my.sendMessageFormSubmit = function(e){
		e.preventDefault();
		var form = $(".sendMessageForm");
		var error = $(".sendmessage-error");
		error.html("");
		
		if(form.find(".name").val().length == 0){
			error.append('<div class="alert alert-danger" role="alert">Please check the name field.</div>');
			return false;
		}
		if(form.find(".email").val().length == 0){
			error.append('<div class="alert alert-danger" role="alert">Please check the email field.</div>');
			return false;
		}
		if(form.find(".message").val().trim().length == 0){
			error.append('<div class="alert alert-danger" role="alert">Please check the message field.</div>');
			return false;
		}
		
		error.append('<div class="alert alert-success" role="alert">Thanks for contacting me!</div>');
		
		return true;
	};
	
	
	my.initSendMessage = function(){
		$(".sendmsg").click(function(e){
			my.sendMessageFormSubmit(e);
		});
		$(".sendMessageForm").submit(function(e){
			my.sendMessageFormSubmit(e);
		});
	};
	
	my.init = function(){
		my.initSendMessage();
	};
	
	return my;
})(jQuery, Contact || {});



jQuery(document).ready(function(){
	Homepage.init();
	Contact.init();
});