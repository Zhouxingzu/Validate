function Validate(obj,messages,diyRule,event,messageClass,rightClass,errorClass,imgUrl,diyFun){
	var that = this;
	that.rules = obj; //验证规则
	that.messages = messages || that.messages ; //默认提示信息
	that.diyRule = diyRule || {};  //自定义正则表达式规则
	that.messageClass = messageClass || 'message_span'; //默认提示信息样式
	that.rightClass = rightClass || 'right';  //验证成功后表单的样式
	that.errorClass = errorClass || 'error';  //验证失败后表单的样式
	that.imgUrl = imgUrl;  //添加错误提示图片
	that.diyFun = diyFun;  //自定义验证方法
	that.istrue = false;
	that.isRequired = false;
	//自定义触发事件，默认为失去焦点
	that.event =  event || 'blur';
	that.addDiyRules().doValidate();

	//点击提交按钮验证
	that.submitValidate = function(){
	    //验证所有表单必填项
    	for(var k in that.rules){
        	that.validateRequired(k,that.rules[k]);
    	}
	    //如果必填项都已填写，则验证所有项是否正确
	    if(that.isRequired){
	        that.doValidate();
	    }
	    //最后验证istrue是否为真
	    if(that.istrue && that.isRequired){
	        alert("提交成功！");
	        return true;
	    }
	    else{
	    	return false;
	    }
	};
	//为验证按钮绑定方法
	that.submitFun = function(submit){
		var that = this;
		submit.onclick = function(){
			return that.submitValidate();
		}
	}
}

Validate.prototype={
	constructor: Validate,
	regexp:{
		vIdCard:/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/,
		vEmail: /^[a-zA-Z\d]+[a-zA-Z\d\.]*\@+[a-zA-Z\d]+\.+[a-z]{2,6}$/,
		vTel: /^1(3|4|5|7|8)[0-9]\d{8}$/,
		vPassword: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/,
		vDate:  /^(\d{4})-(0\d{1}|1[0-2])-(0\d{1}|[12]\d{1}|3[01])$/,
		vNumber: /^\d+$/,
	},
	//添加自定义正则表达式验证方法
	addDiyRules: function(){
		var that = this;
		for(var k in that.diyRule){
			that.regexp[k] = that.diyRule[k];
		}
		return this;
	},
	//默认提示信息
    messages:{
	    name: {
	        minlength:"请至少输入2个字符",
	        required: "姓名必须填写"
	    },
	    idCard: {
	        vIdCard:"身份证格式不正确",
	        required: "身份证必须填写"
	    },
	    tel:{
	        vTel:"电话格式不正确"
	    },
	    email: {
	        vEmail:"邮箱格式不正确"
	    },
	    password: {
	        vPassword: "由数字和密码组成，不少于5位"
	    },
	    confirmPassword: {
	        equalTo: "两次密码输入不一致"
	    }
	},
	//默认其他类提示信息
	tips:{
		right:'输入正确',
		false:'输入不正确',
		required:'该项必须填写'
	},
	//获取元素
	getId: function(id){
	    return document.getElementById(id);
	},
	//获取元素样式
	getCls: function(element){
	    return element.getAttribute("class");
	},
	//设置元素样式
	setCls: function(element,cls){
	    return element.setAttribute("class",cls);
	},
	//为元素添加样式
	addCls: function(element,cls){
	    var baseCls = this.getCls(element);
	    if(baseCls==null){
	        this.setCls(element,cls)
	    }
	    else if(baseCls.indexOf(cls)===-1){
	        this.setCls(element,baseCls+" "+cls);
	    }
	},
	//为元素删除样式
	delCls: function(element,cls){
	    var baseCls = this.getCls(element);
	    if(baseCls){
	        if(baseCls.indexOf(cls)!=-1){
	            this.setCls(element,baseCls.replace(cls,' ').replace(/\s+/g,' '))
	        }
	    }
	},
	//验证失败后添加提示信息标签
	addMessage: function(id,condition,imgUrl){
		var that = this;
		if(that.getId(id).parentNode.getElementsByTagName("span").length==0){
		    var element=that.getId(id);
		    var newmessage=document.createElement("span");
		    newmessage.style.display='inline-flex';
		    newmessage.style.alignItems='center';
		    //如果有图片就显示提示图片
		    if(imgUrl){
		    	var img = document.createElement("img");
		    	img.setAttribute('src',imgUrl);
		    	img.style.height = '16px';
		    	newmessage.appendChild(img);
		    }
		    var tips = document.createElement("p");
	    	if(that.messages[id] && that.messages[id][condition]){
		    	text = that.messages[id][condition];
		    }
		    else if(condition=='required'){
		    	text = that.tips.required;
		    }
		    else{
		    	text = that.tips.false;
		    }
	    	tips.innerHTML = text;
	    	newmessage.appendChild(tips);
	    	if(element.nextSibling){
		    	element.parentNode.insertBefore(newmessage,element.nextSibling);
		    }
		    else{
		   		element.parentNode.appendChild(newmessage);
		    }
		    newmessage.setAttribute("class",that.messageClass);  
		}
	},
	//验证成功后删除提示信息标签
	delMessage: function(id){
		var that = this;
		if(that.getId(id).parentNode.getElementsByTagName("span").length>0){
			var a = that.getId(id);
			var b = a.nextSibling;
			if(b.nodeType==1 && b.tagName=='SPAN'){
		   	    (a.parentNode).removeChild(b);
			}
		}
	},
	doValidate: function(){
		var that = this;

		//输入长度最少是 len 的字符串
		function minlength(id,len){
		    //获取输入的字数
		    var element = that.getId(id);
		    var lens = element.value.length;
		    if(lens>=len){
		        istrue = true;
		    }  
		    else{
		        istrue = false;
		    }
		}

		//输入长度最多是 len 的字符串
		function maxlength(id,len){
		    //获取输入的字数
		    var element = that.getId(id);
		    var lens = element.value.length;
		    if(lens<=len){
		        istrue = true;
		    }  
		    else{
		        istrue = false;
		    }
		}

		//输入值必须和 #contrastId 相同。
		function equalTo(id,contrastId){
		    var element = that.getId(id);
		    var contrastId_element = that.getId(contrastId);
		    if(element.value==contrastId_element.value){
		        istrue = true;
		    }
		    else{
		        istrue = false;
		    }
		}

		//验证级联元素
		function select(id,toId){
			var element = that.getId(id);
		    var x = that.getId(toId).selectedIndex;
		    var y = that.getId(toId).options;
		    var z = y[x].getAttribute('name');
		    validateRegexp(id,z);
		}

		//验证正则表达式
		function validateRegexp(id,ruleName){
		    var element = that.getId(id);
		    //匹配正则表达式
		    var re = that.regexp[ruleName];
		    //如果验证规则存在
		    if(re){
		    	if(re.test(element.value)){
			        istrue = true;
			    }
			    else{
			        istrue = false;
			    }
		    }
		    //如果验证规则不存在
		    else{
		    	istrue = true;
		    }
		}

		/*** 验证规则 validate(id) ***/
		function validate(id){
		    var element = that.getId(id);
		    var fun_arr = arguments[1];
		    //如果ID存在
		    if(element){
			    //为元素绑定触发验证的事件
			    element.addEventListener(that.event,startValidate);
			    function startValidate(){
			        //表单输入内容后才验证
			        if(element.value.length > 0){
		                that.delMessage(id);
			            for(var k in fun_arr){
			            	if(k == 'minlength' || k == 'maxlength' || k == 'equalTo' || k == 'select'){
		            			eval(k)(id,fun_arr[k]);
			            	}
			            	//如果存在自定义规则
			            	else if(k == 'diyFun'){
			            		if(that.diyFun){
	            					that.diyFun.apply(this,fun_arr[k]);
			            		}
			            	}
			            	else{
			            		validateRegexp(id,k);
			            	}
			                //如果验证不通过，do something
			                if(!istrue){
			                    that.delCls(element,that.rightClass);
			                    that.addCls(element,that.errorClass);
	                            that.addMessage(id,k,that.imgUrl); 
	                            that.istrue = false;
			                    return ;
			                }
			            }      
			            // 所有验证通过 do something
			            that.delCls(element,that.errorClass);
			            that.addCls(element,that.rightClass);
		                that.delMessage(id);
		                that.istrue = true;
			        }
			        else {
			            //不输入内容默认验证通过
			            that.delCls(element,that.errorClass);
		                that.delMessage(id);
			        }
			    }
			    startValidate();
		    }
		};
		/*** 验证规则 validate(id) ***/

		//如果传入参数为元素数组
		if(that.rules instanceof Array || that.rules.__proto__ == HTMLFormElement.prototype || that.rules.__proto__ == HTMLCollection.prototype){
			//do something
			var allInput = that.rules.getElementsByTagName('input');
			that.rules = {};
			for(var i=0; i<allInput.length; i++){
				var id = allInput[i].getAttribute('id');
				var rulesObj = allInput[i].getAttribute('validate');
				var re = /^\{+.+\}$/;
				//如果存在验证属性，则将规则添加进rules
				if(rulesObj && re.test(rulesObj)){
					var sum = eval('(' + rulesObj + ')');
					that.rules[id] = sum;
				}
			}
			//开始验证规则
			for(var k in that.rules){
		        validate(k,that.rules[k]);
		    }
		}

		//如果传入参数为对象
		else if(that.rules instanceof Object){
		    for(var k in that.rules){
		        validate(k,that.rules[k]);
		    }
		}

		//如果有一项填写错误则提交失败
	    for(var k in that.rules){
	        validate(k,that.rules[k]);
	        if(that.istrue == false){
	        	break;
	        }
	    }
	},
	/*** 验证必填项 ***/
	validateRequired: function(id){
		var that = this;
	    var element = that.getId(id);
	    var fun_arr = arguments[1];

		//必填写表单验证
		function required(id){
		    //获取输入的字数
		    var element = that.getId(id);
		    if(element.value.length > 0){
		        return true;
		    }  
		    else{
		        return false;
		    }
		}
		//如果id存在，则验证
		if(element){
		    for(var k in fun_arr){
		        //如果required存在则验证该项
		        if(k=='required'){
		        	that.isRequired = true;
		            var istrue = required(id);
		            //如果验证不通过，do something
		            if(!istrue){
		                that.delCls(element,that.rightClass);
		                that.addCls(element,that.errorClass);
	                	that.addMessage(id,"required");  
		                that.isRequired = false;
		            }
		        }
		    }	
		}
	}
}