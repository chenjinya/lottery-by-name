/**
 * 
 * 实用主义，勿喷
 */

var GET_COUNT = 1;
var userNameIndex = 0;
var userNameShowIndex = 0;
var currentList = [];
var resultIndex = 0;
var nameList = [];
var starting = false;

var initNameList = function(){
    if(nameList.length == 0) {
        for(var ni in config.nameObjectList ){
            nameList.push(config.nameObjectList[ni]["name"]);
        }
    }
   
}
var washCards = function (arr){
    var tmp;
    var j;
    for( var i=0; i <arr.length; i++){
        tmp = arr[i];
        j=Math.floor(Math.random()*arr.length);
        arr[i] = arr[j];
        arr[j] = tmp;
    }
}
var listWinners = function(){
        
    if(localStorage.result){
        var result= JSON.parse(localStorage.result);
        var $list = $(".j-winner-list");
        var listHtml = '';
        var keyList =Object.keys(result).reverse();
        var k;
        
        for( k = keyList.length; k > 0; k --){
            if(!result[k]){
                return;
            }
            listHtml+='<li class="list-group-item text-center"><span class="label label-danger">'+(k)+'</span>';
            for(var i =0; i<result[k].length; i++){
                if( i!=0 && i %result[k].length == 0){
                    
                    listHtml+="【"+result[k][i]+"】";
                }else{
                    listHtml+="【"+result[k][i]+"】";
                }
            }
            listHtml+='</li>';
        }
        $list.html(listHtml);
        resizeWindow();
    }

}
var setCurrentWinners = function (list){
    var monitorHtml = "";
    for(var i =0; i<list.length; i++){
            monitorHtml+=" <span class='user-name-item' >"+list[i]+"</span> ";
        }
        $(".user-name").html(monitorHtml);
}
var turnName = function(){
    var useNameWrapper = $(".user-name");
    if(userNameIndex >= nameList.length){
        userNameIndex = 0;
        washCards(nameList);
    }
    if(userNameShowIndex>= nameList.length - 3){
        userNameShowIndex = 0;
    }

    var nameInline = [];
    for(var i =0; i < 3; i++) {
        if(nameList[userNameShowIndex + i]) {
            nameInline.push(nameList[userNameShowIndex + i])
        } else if(i == 0) {
            alert("所有人都已经获奖");
            return true;
        }
        
    }
    useNameWrapper.html("<span class='user-name-item' >" + nameInline.join(' ')+"</span> ");
    setTimeout(function(){
        if(starting == false){
            return false;
        }else{
            userNameShowIndex+=3;
            userNameIndex++;
            turnName();
        }
    },50);
};

var end = function(){
    $(".j-btn-start").show();
    $(".j-btn-stop").hide();
    $(".j-btn-trash").show();
    var users;
    var result;
    if(localStorage.users){
        users= JSON.parse(localStorage.users);
    }else{
        users = [];
    }
    if(localStorage.result){
        result= JSON.parse(localStorage.result);
    }else{
        result ={};
    }
    if(localStorage.resultIndex){
        resultIndex=localStorage.resultIndex;
        
    }else{
        resultIndex =0;
    }
    resultIndex ++;
    currentList = [];
    
    result[resultIndex] = [];
    for(var i =0; i<GET_COUNT ; i++){
        if(! nameList[userNameIndex]){
            userNameIndex = 0;
        }
        if(! nameList[userNameIndex]){
            break;
        }
        currentList.push(nameList[userNameIndex]);
        users.push(nameList[userNameIndex]);
        result[resultIndex].push(nameList[userNameIndex])
        userNameIndex++;
    }
    localStorage.currentList = JSON.stringify(currentList);
    localStorage.users = JSON.stringify(users);
    localStorage.result = JSON.stringify(result);
    localStorage.resultIndex = resultIndex;
    
    listWinners();
    setCurrentWinners(currentList);
    
}

var resizeWindow = function(){
    var wh = $(window).height();
    var dh = $(document).height();
    if(wh > dh)
        dh = wh;
    $("body").height(dh);
}
$(document).ready(function(){
   
    initNameList();
    washCards(nameList);
    $("body").height($(window).height());
    $(".j-btn-stop").hide();
    $(".j-btn-trash").hide();
    $(".j-set-persion-num").val(GET_COUNT);
    
    listWinners();
    
    $(".j-btn-start").on("click",function(){
        starting = true;
        $(".user-name").html("");
        var users;
        if(localStorage.users){
            users= JSON.parse(localStorage.users);
        }else{
            users = [];
        }
        for(var _i =0; _i<users.length; _i++){
            var _index = nameList.indexOf(users[_i]);
            if(_index>= 0 ){
                nameList = nameList.slice(0,_index).concat(nameList.slice(_index+1));
            }
        }
        washCards(nameList);
        
        $(".j-btn-start").hide();
        $(".j-btn-trash").hide();
        $(".j-btn-stop").show();
        turnName();
        
    });
    $(".j-btn-stop").on("click",function(){
        starting = false;
        end();
    });
    $(".j-btn-clear").on("click",function(){
        $(".j-winner-list").html("");
        localStorage.users = "";
        localStorage.result = "";
        localStorage.resultIndex = 0;
        nameList=[];
        initNameList();
        
    });
    $(".j-btn-trash").on("click",function(){
        var _list = [];
        if(localStorage.users){
                _list = JSON.parse(localStorage.users);
            }
        if(localStorage.currentList){
            currentList = JSON.parse(localStorage.currentList);
        }
        for(var _i =0; _i<currentList.length; _i++){

            var _index = _list.indexOf(currentList[_i]);
            if(_index>= 0 ){
                _list = _list.slice(0,_index).concat(_list.slice(_index+1));
            }
        }
        localStorage.users = JSON.stringify(_list);
        $(".user-name").html("");
        resultIndex = localStorage.resultIndex;
        if(localStorage.result){
            var result=JSON.parse(localStorage.result);
            result[resultIndex] .push( "-无效-" );
            localStorage.result = JSON.stringify(result);
        }
        listWinners();

    });
    
    resizeWindow();
    $(window).resize(function(){
        resizeWindow();
    });

});