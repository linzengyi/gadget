var app = angular.module('app',[]);
app.run(function($rootScope){
	$rootScope.webTitle = '統ㄧ發票兌獎';
	//$rootScope.Title = '統ㄧ發票兌獎';
   	$rootScope.year = new Date().getFullYear();
});

app.controller('mainController',function($scope){
    var self = this;
    
   	(function init(){
   		
   		self.create = 'create.html';
        self.winner = 'winner.html';
	    
	    self.super_special = '';  //特別獎
	    self.special = '';		  //特獎	
	    self.first = '';		  //頭獎
	    self.add_sixth = '';      //增開六獎
        
	    self.work = "info";//建立號碼 editor
	           	           //顯示號碼 info
        
        self.reView = false;
	    self.isCreate = localStorage.getItem('winning_create')
		!== null?true:false;
	    self.winning = 
	    localStorage.winning === undefined?
	    {
			title:'',
			super_special:[],
			special:[],
			first:[],
			add_sixth:[]
		}:angular.fromJson(localStorage.getItem('winning'));
   		
		//console.log(self.winning);
   		
   		self.months = [{
   			label:'1,2月',
   			value:'1,2月'
   		},
   		{
   			label:'3,4月',
   			value:'3,4月'
   		},
   		{
   			label:'5,6月',
   			value:'5,6月'
   		},
   		{
   			label:'7,8月',
   			value:'7,8月'
   		},
   		{
   			label:'9,10月',
   			value:'9,10月'
   		},
   		{
   			label:'11,12月',
   			value:'11,12月'
   		}];  

   		var month = null;
		switch(new Date().getMonth()){
			case 0:
			case 1:
				month = self.months[0];
				break;
			case 2:
			case 3:
				month = self.months[1];
				break;
			case 4:
			case 5:
				month = self.months[2];
				break;
			case 6:
			case 7:
				month = self.months[3];
				break;
			case 8:
			case 9:
				month = self.months[4];
				break;
			case 10:
			case 11:
				month = self.months[5];
				break;
		}

		self.month = localStorage.getItem('winning_month') !== null?
		angular.fromJson(localStorage.getItem('winning_month')):
		month;

	//	console.log('month init');
   	//	console.log(localStorage.getItem('winning_month'));

		self.winning.title = '統ㄧ發票'+self.month.value+'中獎號碼';
   	
   	})();

    self.editor = function(){
    	
    	self.work = 'editor';
        self.isCreate = localStorage.getItem('winning_create')
		!== null?true:false;
		var winning = {};

		if(self.winning.super_special.length !== 0){
			winning.super_special = self.winning.super_special;
		}
		if(self.winning.special.length !== 0){
			winning.special = self.winning.special;
		}
		if(self.winning.first.length !== 0){
			winning.first = self.winning.first;
		}
		if(self.winning.add_sixth.length !== 0){
			winning.add_sixth = self.winning.add_sixth;
		}

		if(!self.reView){

			for(var key in winning){
				winning[key].forEach(function(code){

					var span = document.createElement("span");
					spanAttr = document.createAttribute('aria-hidden');
					span.setAttributeNode(spanAttr);
					span.setAttribute('aria-hidden',true);
					span.innerHTML = '&times;';
					
					var button = document.createElement("button");
					button.type = "button";
					button.setAttribute('class',"close");
					button.appendChild(span);
					//加入移除元素
					button.addEventListener('click',function(){
						
						var li = this.parentNode;
						self.winning[li.parentNode.id].forEach(function(code,index){
						    if(code === li.innerText.slice(0,(li.innerText.length-1))){
								self.winning[li.parentNode.id].splice(index); 	
						    }
						});
						li.parentNode.removeChild(li);
						$scope.$apply();

					});

					var li = document.createElement("li");
					li.innerHTML = code;
					li.appendChild(button);
					document.getElementById(key).appendChild(li);
					
				});
			}

		}

    };
    

    self.change = function(){
		self.winning.title = '統ㄧ發票 '+self.month.value+'中獎號碼';
    };

    self.ok = function(){
    	self.work = 'info';
    	self.isCreate = true;
    	self.reView = true;
    	localStorage.setItem('winning_month',angular.toJson(self.month));
		localStorage.setItem('winning',angular.toJson(self.winning));
    	localStorage.setItem('winning_create',self.isCreate);
    };

    //兌獎
    self.code = '';
    self.result = '';//'輸入31065:中四獎與頭獎末5碼相符,頭獎號碼:86331065';

    self.check = function(){
		//特別獎號碼 
		var super_speical = self.winning.super_special;
		//特獎號碼
		var speical = self.winning.special;
		//頭獎號碼
		var first = self.winning.first;
		//增開六獎號碼
		var add_sixth = self.winning.add_sixth;

		//固定
		var input = self.code;
		var code_length = input.length;
		var msg = '';
		var codes = [];
		codes.push(super_speical,speical,first,add_sixth);

		var match = false;

	  	for(var key in codes){

  		codes[key].forEach(function(code){
 
    		var input_code_length = code_length;
    
		    var check_code = 
		        input_code_length !== code.length?
		        code.slice((8 - input_code_length),8):code; 
    
		    var input_code = input_code_length !== check_code.length?
		        input.slice((8-check_code.length),8):input;
    
    		input_code_length = input_code.length;
    
    		//console.log('start = '+check_code +'-'+input_code);
    		while(!match){
				//輸入獎號長度
				match_chars = input_code_length;
        
		        for(j=0;j<input_code_length;j++){
		          if(check_code[j] === input_code[j]){
		            match_chars -= 1;
		          }
		        }
    
		        if(match_chars === 0){
		           	match = true;
		           	if(key === '0'){
		             	if(code_length < 8){
		               		msg = '輸入'+input+'與特別獎末'+code_length+'碼相符,特別獎號碼:'+code;
		             	}else{
		               		msg = '中特別獎';
		             	}
		           	}else if(key === '1'){
		             	if(code_length < 8){
		               		msg = '輸入'+input+'與特獎末'+code_length+'碼相符,特獎號碼:'+code;
	             		}else{
		               		msg = '中特獎';
		             	}
		           	}else if(key === '2'){
		             	var text = '';
		             	switch(input_code_length){
		               	  case 3:
		                 	text = '中六獎';
		                 	break;
		               	  case 4:
		                 	text = '中五獎';
		                 	break;
		               	  case 5:
		                 	text = '中四獎';
		                 	break;
		               	  case 6:
		                 	text = '中三獎';
		                 	break;
		               	  case 7: 
		                 	text = '中二獎';
		                 	break;
		               	  case 8:
		                 	text = '中頭獎';
		                 	break;
		             	}
		             
		                if(input_code_length < 8 ){
		               		msg = '輸入'+input+text+'與頭獎末'+input_code_length+
		               		'碼相符,頭獎號碼:'+code;
		             	}else{
		               		msg = '輸入'+input+text;
		             	}
		             
		           	}else if(key === '3'){
		             	msg = '輸入'+input+'末3碼符合，中增開6獎';
		           	}
		           	break;
		        }else{
		           	input_code_length -= 1;
		           	input_code = input_code.slice(((input_code_length+1) - input_code_length),(input_code_length+1));
		          	check_code = check_code.slice(((input_code_length+1) - input_code_length),(input_code_length+1));
		        }

		        if(input_code_length < 3){
		          break;
		        }
		      
		    }//while end
		  
		});
  
	  	}
		if(!match){
			msg = '沒中獎';
		}
      	
      	self.result = msg;
      	self.code = '';
    };

    self.add = function(id){
   		
		var code = self[id];
        if(code === ''){
           return;
        }

		var span = document.createElement("span");
		spanAttr = document.createAttribute('aria-hidden');
		span.setAttributeNode(spanAttr);
		span.setAttribute('aria-hidden',true);
		span.innerHTML = '&times;';
		
		var button = document.createElement("button");
		button.type = "button";
		button.setAttribute('class',"close");
		button.appendChild(span);
		//加入移除元素
		button.addEventListener('click',function(){
			var li = this.parentNode;
			li.parentNode.removeChild(li);
		});

		var li = document.createElement("li");
		li.innerHTML = code;
		li.appendChild(button);
		document.getElementById(id).appendChild(li);
		
		self.winning[id].push(code);

		self[id] = '';

    };

    self.clear = function(){
		localStorage.removeItem('winning');
        localStorage.removeItem('winning_month');
        
        self.isCreate = false;
        localStorage.setItem('winning_create',false);
        
        //特別獎號碼 
		self.winning.super_special = [];
		//特獎號碼
		self.winning.special = [];
		//頭獎號碼
		self.winning.first = [];
		//增開六獎號碼
		self.winning.add_sixth = [];

		//移除元素
		var ul = null;	
		var fc = null;	
		var keys = ['super_special','special','first','add_sixth'];
		for(var i=0;i<4;i++){
			ul = document.getElementById(keys[i]);
			fc = ul.firstChild;

			while( fc ) {
			    ul.removeChild( fc );
			    fc = ul.firstChild;
			}
		}


    };

});

/*
建立中獎號碼：
月份:[ 1,2月 ][v]
      3,4月
       .
       .
     11,12月

特別獎:[        ][新增]  
00000000[x] 11111111[x]

特獎: [        ][新增]
77777777[x] 88888888[x] 66666666[x]

頭獎:  [        ][新增]  
11112211[x] 33333333[x]

增開六獎： [       ][新增]   
123[x] 456[x] 789[x] 

產生：
ver 1.
--------------------------------
    統ㄧ發票 1,2月 中獎號碼 
--------------------------------
 名稱  |   號碼     |   說明
--------------------------------
特別獎 |	00000000  |  八位數號碼與上列號碼相同者
-----------------------------------------      
      | 11111111  |
-----------------------------------------
特獎   | 77777777  |  八位數號碼與上列號碼相同者
------------------------------------------
      | 88888888  |
------------------------------------------
      | 66666666  |
---------------------------------
頭獎   | 11112211  |  八位數號碼與上列號碼相同者
----------------------------------
      | 33333333  |
-----------------------------------
二獎   |           |  末七碼與頭獎相同者
-----------------------------------
三獎   |           |  末六碼與頭獎相同者
-----------------------------------
四獎   |           |  末五碼與頭獎相同者
-----------------------------------
五獎   |           |  末四碼與頭獎相同者
-----------------------------------
六獎   |           |  末三碼與頭獎相同者
-----------------------------------
增開六獎| 123       |  末3位數號碼相同者
-----------------------------------
      | 456       |
-----------------------------------
      | 789       |
-----------------------------------

ver 2.
--------------------------------
      統ㄧ發票 1,2月 中獎號碼 
--------------------------------
    特別獎 :八位數號碼與下列號碼相同者
--------------------------------
    1. 00000000   
    2. 11111111  
-----------------------------------------
	特獎 : 八位數號碼與上列號碼相同者
------------------------------------------
    1. 77777777  
    2. 88888888  
    3. 66666666  
---------------------------------
	頭獎 : 八位數號碼與上列號碼相同者
----------------------------------
    1. 11112211
    2. 33333333  
-----------------------------------
	二獎 : 末七碼與頭獎相同者
-----------------------------------
	三獎 : 末六碼與頭獎相同者
-----------------------------------
	四獎 : 末五碼與頭獎相同者
-----------------------------------
	五獎 : 末四碼與頭獎相同者
-----------------------------------
	六獎 : 末三碼與頭獎相同者
-----------------------------------
 增開六獎 : 末3位數號碼相同者
-----------------------------------
    1. 123       
    2. 456       
    3. 789       
-----------------------------------

var winning = {
	title:'統ㄧ發票 1,2月 中獎號碼',
	special:{
		title:'特別獎 :八位數號碼與下列號碼相同者',
		value:[]
	},
	special2:{
		title:'特獎 : 八位數號碼與上列號碼相同者',
		value:[]
	},
	first:{
		title:'頭獎 : 八位數號碼與上列號碼相同者',
		value:[]
	},
	second:{
		title:'二獎 : 末七碼與頭獎相同者',
		value:null
	},
	third:{
		title:'三獎 : 末六碼與頭獎相同者',
		value:null
	},
	fourth:{
		title:'四獎 : 末五碼與頭獎相同者',
		value:null
	},
	fifth:{
		title:'五獎 : 末四碼與頭獎相同者',
		value:null
	},
	sixth:{
		title:'六獎 : 末三碼與頭獎相同者',
		value:null
	},
	addSixth:{
		title:'增開六獎 : 末3位數號碼相同者',
		value:[]
	}
};

*/