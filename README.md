Demo效果展示: [https://zhouxingzu.github.io/Validate/](https://zhouxingzu.github.io/Validate/)

## 表单验证控件
### 默认校验规则
序号 | 规则 | 描述
-----|----|---
1| required:true | 必须输入的字段
2| vEmail:true | 必须输入正确格式的电子邮件
3| vDate:true | 必须输入正确格式的日期(如:2016-10-11)
4| vIdCard:true | 必须输入正确的身份证号
5| vTel:true | 必须输入正确的电话号码
6| vNumber:true | 必须输入数字
7| vPassword:true | 必须输入密码（6位以上，由数字和字母组合）
8| minlength:4 | 输入长度最少是 4 的字符串（汉字算一个字符）
9| maxlength:5 | 输入长度最多是 5 的字符串（汉字算一个字符）
10| equalTo:"#id" | 输入值必须和 #id 相同
11| select:"#id" | 输入值必须和 #id 的select下拉选项"name"中的规则名相同

### 默认提示信息
```
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
        confirm_password: {
            equalTo: "两次密码输入不一致"
        }
    }
```

### 默认其他类提示信息
当输入不正确或必填选项的提示：
```
tips:{
    false:'输入不正确',
    required:'该项必须填写'
}
```

### 使用方法
#### 一、首先引入JS文件到HTML中
```
<script src='js/validate.js'></script>
```
#### 二、验证方式
创建一个Validate的实例：
```
<script>
    var test = new Validate(obj,divRule,event,messageClass,rightClass,errorClass,imgUrl,diyFun);
</script>
```
* obj 为传入内容，可以是编写的对象、form表单、input数组。
* divRule 为自定义规则。
* event 为触发事件类型，默认为失去焦点触发验证 'blur'。
* messageClass 为自定义提示样式。
* rightClass 为验证正确后 input 样式。
* errorClass 为验证失败后 input 样式。
* imgUrl 为验证失败后添加图片地址，没有则不显示。
* diyFun为自定义特殊验证方法。

***

1. 将校验规则写到js中，最后将参数传入到验证类中。
```
<script>
/*** 验证规则填写如下(左边ID，右边相应规则或者提示信息) ***/
var validate_data={
    rules:{
        name:{
            minlength:2,
            required:true
        },
        idCard:{
            vIdCard:true,
            required:true
        },
        email:{vEmail:true},
        tel:{vTel:true},
        date:{vDate:true},
        number:{
            vNumber:true,
            minlength:4
        },
        password:{vPassword:true},
        confirm_password:{
            vPassword:true,
            equalTo:"password"
        },
        choose_text:{select:"choose_message"}
    },
    //可自定义提示信息
    messages:{
        name: {
            minlength:"2个字符以上",
            required: "请填写姓名"
        },
        idCard: {
            vIdCard:"身份证格式不正确",
            required: "请填写身份证"
        }
    }
}

var test1 = new Validate(validate_data);
</script>
```

2. 在HTML标签中写验证属性

如果传入参数是form表单或者input元素，则在对应标签中填写验证规则。
```
<form id="form">
    <label for="Card">身份证(必填)</label>
    <input type="text" name="Card" id="Card" validate="{vIdCard:true, required:true}">
</form>


<script>
    var form = document.getElementById("form");
    var test = new Validate(form);
</script>
```
如需自定义提示信息，则将提示信息填写进obj.messages中：
```
<script>
    var form = document.getElementById("form");
    var test = new Validate(form);
    test.messages = {
        Card: {
            vIdCard:"身份证格式不正确",
            required: "请填写身份证"
        }
    }
</script>
```
3. 点击submit按钮验证提交

使用 submitFun() 来对按钮进行点击验证提交：
```
<html>
    <input type="submit" value="提交" id="submit" />
</html>

<script>
    submit = document.getElementById("submit");
    test.submitFun(submit);
</script>
```
点击按钮提交后，会先验证必填项是否都填写，如都填写再验证所有项格式是否正确。如果所有项都正确填写，则提交表单。

#### 三、自定义正则表达式验证规则
带入自定义规则参数，格式必须为 { 规则名称:正则表达式 }：
```
<script>
    divRule = {
        fournumber:/^\d{4}$/,
        telephone:/\d{3}\-\d{3,8}/
    }

    var test = new Validate(obj,divRule,event,messageClass);
</script>
```
#### 四、自定义触发验证事件
默认触发验证事件为失去焦点时触发，即 'blur' ,可自定义修改：

触发方式 | 描述
-----|----
'blur'| 失去焦点时验证
'keyup'| 在按下键盘时验证
```
<script>
    var test = new Validate(obj,divRule,'keyup',messageClass);
</script>
```
#### 五、自定义提示信息样式
把样式的 class名 传给 messageClass 即可自定义样式。
```
<style>
    .red{
        color: red;
    }
</style>

<script>
    var test = new Validate(obj,divRule,event,'red');
</script>
```

#### 六、自定义错误信息显示的样式
把样式的 class名 传给 rightClass 和 errorClass 即可自定义样式。
```
<style>
    .right{
        border: 1px solid green;
    }
    .error{
        border: 1px solid red;
    }    
</style>

<script>
    var test = new Validate(obj,divRule,event);
    test.rightClass = 'right';
    test.errorClass = 'error';
</script>
```

#### 七、自定义验证方法
如有特殊的自定义验证方法，则将方法写入 diyFun 中。
```
<script>
    var test1 = new Validate(obj);
    //自定义的方法
    test1.diyFun = function(id,toId,choose){
        var element = document.getElementById(id);
        var toElement = document.getElementById(toId);
        var choose = document.getElementById(choose);
        var x = choose.selectedIndex;
        var y = choose.options;
        var z = y[x].getAttribute('name');
        //判断身份证生日与出生日期填写一致
        if(z=='vIdCard'){
            var birthday = element.value.replace(/\-/g,"")
            var idCardBirthday = toElement.value.substr(6,8);
            if(birthday==idCardBirthday){
                istrue = true;
            }
            else{
                istrue = false;
            }
        }
        else{
            istrue = true;
        }
    }
</script>
```
两种配置方式如下：
1. 在js中配置：
```
<script>
    var test1Rules={
        name:{
            minlength:2,
            required:true
        },
        date:{
            vDate:true,
            diyFun:["date","choose_text","choose_message"]
        }
    }
    
    var test1 = new Validate(test1Rules);
</script>
```
2. 在html标签中配置：
```
<html>
    <input type="text" name="date" id="date" validate="{vDate:true, diyFun:['date','choose_text','choose_message']}">
</html>
```
