var formulaArray =[];
var usersArray = [];

var currentArrayi = 0;

var currentUser = {
    i: 0,
    loggedIn: false,
}

//---variable--object--
function variable(_arrVarLttrs, _arrVarNames, _arrVarDim, _values) {
    this.arrVarLttrs = _arrVarLttrs;
    this.arrVarNames = _arrVarNames;
    this.arrVarDim = _arrVarDim;
    this.values = _values;
}
//---equation--object--
var Formula = function (_variables,_formulaDisplay, _formula, _frmshrt, _formulaName) {
    this.variables = _variables;
    this.formulaDisplay = _formulaDisplay;
    this.formula = _formula;
    this.frmshrt = _frmshrt;
    this.calculateEq = function() {
        this.variables[0].values=eval(this.formula);
    };
    this.formulaName = _formulaName;
}
//---user object-----
var User = function (_firstName, _lastName, _email, _username, _password, _loggedIn) {
    this.firstName = _firstName;
    this.lastName = _lastName;
    this.email = _email;
    this.username = _username;
    this.password = _password;
    this.loggedIn = _loggedIn;
}

//----Load 2 users-----
function seedWithUsers () {
    //creating firebase data first time
    var fb = new Firebase("https://resplendent-fire-1584.firebaseio.com/");

    fb.orderByKey().on("value", function(snapshot) {
        if (snapshot.val()==null) {
            var firstName1 = 'Rushan';
            var lastName1 = 'Sakhibgareev';
            var email1 = "sakhibgareevrr@gmail.com";
            var username1 = "rushan";
            var password1 = "codercamp";
            var loggedIn1 = false;
            var userdata1 = new User(firstName1, lastName1, email1,username1,password1, loggedIn1);
            var firstName2 = 'bob';
            var lastName2 = 'Smith';
            var email2 = "bob.smith@gmail.com";
            var username2 = "bob";
            var password2 = "cfscfs";
            var loggedIn2 = false;
            var userdata2 = new User(firstName2, lastName2, email2,username2,password2, loggedIn2);
            //adding the objects to firbase array
            fb.push(userdata1);
            fb.push(userdata2);
            }
        else  {
            getUserData();
        }
    });

}
//load object array from firebase
seedWithUsers();

//---show username on navbar----
function showUserNav() {
    var h2 ='';
    h2 += '<ul class="nav navbar-nav navbar-right">';
    h2 +='<li style="color:lightgray" class="pull-right"><a href="">Logged out</a></li>';
    h2 += '</ul>';
    $('#navbarname').html(h2);
    for (var i = 0; i < usersArray.length; i++) {
        if (usersArray[i].loggedIn == true) {
            var h='';
            h += '<ul class="nav navbar-nav navbar-right">';
            h +='<li style="color:lightgray" class="pull-right"><a href="">Logged in as '+usersArray[i].username+'</a></li>';
            h += '</ul>';
            $('#navbarname').html(h);
            h1='';
            h1 += '<div class="form-group">';
            h1 += '<label>Welcome, '+usersArray[i].firstName+'</label>';
            h1 += '</div>';
            h1 += '<div class="form-group">';
            h1 += '<label><a  href="javascript: logOut();" style="color: white">Log Out</a></label>';
            h1 += '</div>';
            $('#logreg').html(h1);
        }
    }
}
//show users in 'community' page
function userDisplay() {

    var h = "";
    for (var i =usersArray.length-1; i>=0; i--) {
        h +=        '<div class="form-group">';
        h +=        '<a style="color:white" class="btn pull-right" onclick="deleteUser(\"" + usersArray[i].id + "\")"><span class="glyphicon glyphicon-remove"></span></a>';
        h +=        '<a style="color:white" class="btn pull-right" onclick="editUser(' + i + ')"><span class="glyphicon glyphicon-pencil"></span></a>';
        h +=        '<blockquote style="background-color:dimgray" class=""><h5>First Name: ' + usersArray[i].firstName + '</h5>';
        h +=        '<h5>Last Name: ' + usersArray[i].lastName + '</h5>';
        h +=        '<h5>Email: ' + usersArray[i].email + '</h5>';
        h +=        '<h5>Username: ' + usersArray[i].username + '</h5></blockquote>';
        h +=        '</div>';
    }
    $("#usereditdisplay").html(h);
}
//--get user object data from the firebase---
function getUserData(){
    var fb = new Firebase("https://resplendent-fire-1584.firebaseio.com/");
    usersArray.length = 0
    console.log('Start "GET":...');
    fb.orderByKey().on("value", function(snapshot) {
        var data = snapshot.val();
        console.log(snapshot.key());
        for(var i in data) {
            data[i].id = i;
            usersArray.push(data[i]);
        }
    });
    showUserNav();
    userDisplay();
}

//---user log out-----
function logOut() {

    for (var i = 0; i < usersArray.length; i++) {
        if (usersArray[i].loggedIn == true) {
            var h='';
            var fb = new Firebase("https://resplendent-fire-1584.firebaseio.com/");
            h += '<p>';
            h += '<a  href="javascript:logreg()" style="color:white">Login</a> | <a href="newaccount.html" style="color:white">New Account</a>';
            h += '</p>';
            $('#logreg').html(h);
            usersArray[i].loggedIn = false;
            fb.child(usersArray[i].id).set(usersArray[i]);
            getUserData();
            showUserNav();
        }
    }
}

//--display login section----
function logreg() {
    var h = '';
    h += '<div class="form-group">';
    h += '<label>Username:</label>';
    h += '<input type="text" id="logusername" class="form-control" placeholder="Username" style="color:black; font-weight:bold; text-align: center" />';
    h += '<label>Password:</label>';
    h += '<input type="password" id="logpassword" class="form-control" style="color:black; font-weight:bold; text-align: center"/>';
    h += '</div>';
    h += '<div class="form-group">';
    h += '<input type="button" onclick="login()" class="btn btn-block btn-default" value="Login" />';
    h += '</div>';
    $('#logreg').html(h);
}

//--login function-----
function login() {

    var logusername = $('#logusername').val();
    var logpassword = $('#logpassword').val();
    var loggedIn1 = false;
    var fb = new Firebase("https://resplendent-fire-1584.firebaseio.com/");
    for (var i = 0; i < usersArray.length; i++) {
        if ((usersArray[i].username == logusername) && (usersArray[i].password == logpassword)) {
            usersArray[i].loggedIn = true;
            loggedIn1 = true;
            showUserNav();
            fb.child(usersArray[i].id).set(usersArray[i]);
            getUserData();
        }
    }
    if (loggedIn1==false) {
        var h = '';
        h += '<div class="form-group">';
        h += '<label>Username:</label>';
        h += '<input type="text" id="logusername" class="form-control" placeholder="Username" style="color:black; font-weight:bold; text-align: center" />';
        h += '<label>Password:</label>';
        h += '<input type="password" id="logpassword" class="form-control" style="color:black; font-weight:bold; text-align: center"/>';
        h += '</div>';
        h += '<div class="form-group">';
        h += '<p style="color:red"><b>Unsuccessful. Please try again</b></p>';
        h += '<input type="button" onclick="login()" class="btn btn-block btn-default" value="Login" />';
        h += '</div>';
        $('#logreg').html(h);
    }
}

//userDisplay();

var selectedUseri
function editUser(i) {
$('#edfirst').val(usersArray[i].firstName) ;
$("#edlast").val(usersArray[i].lastName);
$("#edemail").val(usersArray[i].email);
$("#eduser").val(usersArray[i].username);
$("#edpass1").val(usersArray[i].password);
$("#edpass2").val(usersArray[i].password);
selectedUseri = i;
}

//adding user in firebase. this function is available in user registration form
function addUser() {
    if ($('#emailAddress1').val()==$('#emailAddress2').val()) {
        if ($('#password1').val()==$('#password2').val()) {
            $('#addUserDisplay').html('');
            var fb = new Firebase("https://resplendent-fire-1584.firebaseio.com/");
            var firstName3 = $('#firstName').val();
            var lastName3 = $('#lastName').val();
            var email3 = $('#emailAddress1').val();
            var username3 = $('#userName').val();
            var password3 = $('#password1').val();
            var loggedIn3 = false;
            var userdata3 = new User(firstName3, lastName3, email3,username3,password3, loggedIn3);
            fb.push(userdata3);
            getUserData();
            var h3='<h4 style="text-align:center">You are registered. Please wait..</h4>'
            $('#addUserDisplay').html(h3);
            setTimeout(function() {window.location.href='index.html';},2000);

        } else {
            var h2='';
            h2 += '<h4 style="text-align:center; color: red"><b>Please check that password is entered correctly</b></h4>'
            $('#addUserDisplay').html(h2);
        }
    } else {
        var h1='';
        h1 += '<h4 style="text-align:center; color: red"><b>Please check that email is entered correctly</b></h4>'
        $('#addUserDisplay').html(h1);
    }
}

function saveUser() {
if (document.getElementById("edpass1").value==document.getElementById("edpass2").value) {
    usersArray[selectedUseri].firstName = document.getElementById("edfirst").value;
    usersArray[selectedUseri].lastName = document.getElementById("edlast").value;
    usersArray[selectedUseri].email = document.getElementById("edemail").value;
    usersArray[selectedUseri].username = document.getElementById("eduser").value;
    usersArray[selectedUseri].password = document.getElementById("edpass1").value;
    userDisplay();
    clearUserForm();
    var fb = new Firebase("https://resplendent-fire-1584.firebaseio.com/");
    fb.child(usersArray[selectedUseri].id).set(usersArray[selectedUseri]);
    getUserData();
} else {
    document.getElementById("passunsuccessdisplay").innerHTML = '<h4 style="color:red"><b>Unsuccessful. Please try again</b></h4>';
}
}

function deleteUser(id) {
    var fb = new Firebase("https://resplendent-fire-1584.firebaseio.com/" + id);
    fb.remove(function(err){
        if(err) console.log(err);
        else console.log("it was a Success!!!");
    });
    getUserData();
}

function clearUserForm() {
    $('#edfirst').val("");
    $('#edlast').val("");
    $('#edemail').val("");
    $('#eduser').val("");
    $('#edpass1').val("");
    $('#edpass2').val("");
}

//--Load Initial Three Formulas
function seedWithFormulas () {
    if (localStorage.getItem('database')==null) {
        //---Transient Time Flow Rate
        var q1 = new variable("q","production flow rate","bbl/day",0.0);
        var k1 = new variable("k","reservoir permeability","mD",10);
        var h1 = new variable("h","reservoir thickness","ft",35);
        var pres1 = new variable("pres","average reservoir pressure","psi",3120);
        var pwf1 = new variable("pwf","well flowing bottomhole pressure","psi",876);
        var Bo1 = new variable("Bo","formation volume factor","[res. bbl]/[std. bbl]",1.12);
        var miu1 = new variable("miu","oil viscosity","cP",2.3);
        var t1 = new variable("t","transient time","hr",960);
        var phi1 = new variable("phi","porosity","",0.19);
        var ct1 = new variable("ct","compressibility","1/psi",0.0000129);
        var rw1 = new variable("rw","well radius","ft",0.1);

        var variables1 = [q1, k1, h1, pres1, pwf1, Bo1, miu1, t1, phi1, ct1, rw1];

        var formulaDisplay1 = "transient_flow_rate.png";
        var formula1 = "this.variables[1].values*this.variables[2].values*(this.variables[3].values"+
        "-this.variables[4].values)/(162.6*this.variables[5].values*this.variables[6].values"+
        "*(Math.log10(this.variables[7].values)+Math.log10(this.variables[1].values"+
        "/(this.variables[8].values*this.variables[6].values*this.variables[9].values"+
        "*Math.pow(this.variables[10].values,2)))-3.23))";
        var frmshrt1 = "k*h*(pres-pwf)/(162.6*Bo*miu*(Math.log10(t)+Math.log10(k/(phi*miu*ct*Math.pow(rw,2)))-3.23))";
        var formulaName1 = "Transient Flow Rate";

        var data1 = new Formula(variables1, formulaDisplay1, formula1, frmshrt1, formulaName1);
        formulaArray.push(data1);

        //---PSS Flow Rate
        var q2 = new variable("q","production flow rate","bbl/day",0.0);
        var k2 = new variable("k","reservoir permeability","mD",10);
        var h2 = new variable("h","reservoir thickness","ft",35);
        var pres2 = new variable("pres","average reservoir pressure","psi",3120);
        var pwf2 = new variable("pwf","well flowing bottomhole pressure","psi",876);
        var Bo2 = new variable("Bo","formation volume factor","[res. bbl]/[std. bbl]",1.12);
        var miu2 = new variable("miu","oil viscosity","cP",2.3);
        var re2 = new variable("re","well reservoir drainage radius","ft",580);
        var rw2 = new variable("rw","well radius","ft",0.1);
        var Skin2 = new variable("S","skin factor","",1.2);

        var variables2 = [q2,k2,h2,pres2,pwf2,Bo2,miu2,re2,rw2,Skin2];

        var formulaDisplay2 = "pss_flow_rate.png";
        var formula2 = "this.variables[1].values*this.variables[2].values*(this.variables[3].values"+
        "-this.variables[4].values)/(141.2*this.variables[5].values*this.variables[6].values"+
        "*(Math.log(this.variables[7].values/this.variables[8].values)-0.75+this.variables[9].values))";
        var frmshrt2 = "k*h*(pres-pwf)/(141.2*Bo*miu*(Math.log(re/rw)-0.75+S))";
        var formulaName2 = "PSS Flow Rate";

        var data2 = new Formula(variables2, formulaDisplay2, formula2, frmshrt2, formulaName2);
        formulaArray.push(data2);
        //--Transient time to reach pseudo-steady state flow------
        var t3 = new variable("t","transient time","hr",0);
        var phi3 = new variable("phi","porosity","",0.19);
        var miu3 = new variable("miu","oil viscosity","cP",2.3);
        var ct3 = new variable("ct","compressibility","1/psi",0.0000129);
        var re3 = new variable("re","drainage radius","ft",580);
        var k3 = new variable("k","reservoir permeability","mD",10);

        var variables3 = [t3, phi3, miu3, ct3, re3, k3];
        var formulaDisplay3 = "tss_time.png";
        var formula3 = "1200*this.variables[1].values*this.variables[2].values*this.variables[3].values"+
        "*Math.pow(this.variables[4].values,2)/this.variables[5].values";
        var frmshrt3 = "1200*phi*miu*ct*Math.pow(re,2)/k";
        var formulaName3 = "Transient Time";

        var data3 = new Formula(variables3, formulaDisplay3, formula3, frmshrt3, formulaName3);
        formulaArray.push(data3);

        syncDatabase();

    } else {
        var localData = JSON.parse(localStorage.getItem('database'));
        formulaArray = localData;
    }
}
seedWithFormulas();
//--display the input section with the variables
function displayInput(FormulaArray) {
    var h  = '';
    for (var i=1;i<FormulaArray.variables.length;i++) {
        h += '<label>'+FormulaArray.variables[i].arrVarLttrs+', '+
        FormulaArray.variables[i].arrVarDim+'</label><br>';
        h += '<input type="text" id="'+FormulaArray.variables[i].arrVarLttrs+
        '" class="form-control" value="'+FormulaArray.variables[i].values+'">';
        currentArrayi=formulaArray.indexOf(FormulaArray);
    }
    document.getElementById("displayInputHTML").innerHTML = h;
}
//--display the output section where the results are reflected
function displayOutput(formulaArray) {
    var h  = '';
    var value = formulaArray.variables[0].values;
    if (value>0) {value = value.toFixed(5);}
    h += '<label> Result:'+formulaArray.variables[0].arrVarLttrs+', '+
    formulaArray.variables[0].arrVarDim+'</label><br>';
    h += '<input type="text" id="'+formulaArray.variables[0].arrVarLttrs+
    '" class="form-control" value="'+value+'">';
    h += '<label></label><br>';
    h += '<input type="button" onclick="calculate();" class="btn btn-default " value="Calculate" >';
    document.getElementById("displayOutputHTML").innerHTML = h;
}

function displayEquation(formulaArray) {
    var h = '';
    h += '<h3>'+formulaArray.formulaName+'</h3>';
    if (formulaArray.formulaDisplay!=='') {
        h += '<p><img src="'+formulaArray.formulaDisplay+'" alt="" style="width:100%" /></p>';
    } else {
        h += '<p>'+formulaArray.variables[0].arrVarLttrs+' = '+formulaArray.frmshrt+'</p>';
    }
    h += '<br>'
    for (var i=0;i<formulaArray.variables.length;i++) {
        h += '<p>'+formulaArray.variables[i].arrVarLttrs+' - '+formulaArray.variables[i].arrVarNames+
        ', '+formulaArray.variables[i].arrVarDim+'</p>';
    }
    document.getElementById("displayEquationHTML").innerHTML = h;
}

function displayMenu(formulaArray) {
    var h = '';
    h += '<ul class="nav navbar-default nav-stacked">';
    for (var i=0;i<formulaArray.length;i++) {
        h += '<li role="presentation" class="active" ><a href="#" onclick="displayInput(formulaArray['+
        i+']);displayOutput(formulaArray['+i+']);displayEquation(formulaArray['
        +i+'])" style="color:darkslategray">'+formulaArray[i].formulaName+'</a></li>';}
    h += '</ul>';
    document.getElementById("displayMenuHTML").innerHTML = h;
    }

function displayEditMenu(formulaArray) {
    var h = '';
    h += '<ul class="nav navbar-default nav-stacked">';
    for (var i=0;i<formulaArray.length;i++) {
        h += '<li role="presentation" class="active" ><a href="#" onclick="displayEditInput(formulaArray['+
        i+'])" style="color:darkslategray">'+formulaArray[i].formulaName+'</a></li>';
        }
    h += '</ul>';
    document.getElementById("displayEditMenuHTML").innerHTML = h;
    }

function display(formulaArray) {
    displayInput(formulaArray);
    displayOutput(formulaArray);
    displayEquation(formulaArray);
    }

jQuery(function($){
    if ($('body#calculator').length) {
        display(formulaArray[0]);
        displayMenu(formulaArray);
        }
    });

jQuery(function($){
    if ($('body#edit').length) {
        displayEditInput(formulaArray[0]);
        displayEditMenu(formulaArray);
        }
    });

function calculate() {
    for (var i=1;i<formulaArray[currentArrayi].variables.length;i++) {
        formulaArray[currentArrayi].variables[i].values=parseFloat(document.getElementById(formulaArray[currentArrayi].variables[i].arrVarLttrs).value);
        }
    var formulastr = formulaArray[currentArrayi].formula;
    formulares='';
    var m =formulastr.search('this');
    while (m>-1) {
        formulares = formulastr.replace("this","formulaArray[currentArrayi]");
        formulastr=formulares;
        m =formulastr.search('this');
        }
    formulaArray[currentArrayi].variables[0].values=eval(formulastr);
    var value = formulaArray[currentArrayi].variables[0].values;
    value=value.toFixed(5);
    value=parseFloat(value);
    document.getElementById(formulaArray[currentArrayi].variables[0].arrVarLttrs).value=value;
    }

    var calcdisplays = [];
    var formulaExprs = [];
    var calcdisplay ="";
    var formulaExpr ="";

function createNew() {
    var variables = parseInt(document.getElementById("numofvars").value);
    calcdisplays = [];
    formulaExprs = [];
    calcdisplay ="";
    formulaExpr ="";
    h = '';
    for (var i=1;i<=variables;i++) {
        h += '<label>V'+i+' letter</label>';
        h += '<div class="input-group">';
        h += '<input id="varlttr'+i+'" type="text" onchange="updateVarBttns('+i+')" class="form-control" name="name" value="" placeholder="v'+i+'">';
        h += '</div>';
        }
    $('#varlttr').html(h);
    h = '';
    for (var i=1;i<=variables;i++) {
        h += '<label>V'+i+' short description</label>';
        h += '<div class="input-group">';
        h += '<input id="vardscr'+i+'" type="text" class="form-control" name="name" value="" placeholder="v'+i+' description">';
        h += '</div>';
        }
    $('#vardscr').html(h);
    h = '';
    for (var i=1;i<=variables;i++) {
        h += '<label>V'+i+' units</label>';
        h += '<div class="input-group">';
        h += '<input id="varunit'+i+'" type="text" class="form-control" name="name" value="" placeholder="v'+i+' units">';
        h += '</div>';
        }
    $('#varunit').html(h);
        h = '';
    for (var i=1;i<=variables;i++) {
        h += '<label>V'+i+' test value</label>';
        h += '<div class="input-group">';
        h += '<input id="varvalue'+i+'" type="text" class="form-control" name="name" value="" placeholder="v'+i+' test value">';
        h += '</div>';
        }
    $('#varvalue').html(h);
    //----calculator-with-variables----
    h= '';
    var var4 = Math.floor(variables/4);
    var var4res = variables%4;
    for (var i=1;i<=var4;i++) {
        h += '<tr>';
        for (var j=1;j<=4;j++) {
            h += '<td>';
            h += '<button type="button" name="this.variables['+(4*(i-1)+j)+'].values"'+
            'class="btn btn-default btn-block" onclick="buttonClicked(id)" id="v'+
            (4*(i-1)+j)+'"value="v'+(4*(i-1)+j)+'">v'+(4*(i-1)+j)+'</button>';
            h += '</td>';
            }
        h += '</tr>';
        }
    h += '<tr>';
        for (var i=1;i<=var4res;i++) {
            h += '<td>';
            h += '<button type="button" name="this.variables['+(4*var4+i)+'].values"'+
            'class="btn btn-default btn-block" onclick="buttonClicked(id)" id="v'+
            (4*var4+i)+'"value="v'+(4*var4+i)+'">v'+(4*var4+i)+'</button>';
            h += '</td>';
        }
    h += '</tr>';
    $('#calculator').html(h);
}
//--calculator operations-----

function buttonClicked(id) {
    var val = document.getElementById(id).value;
    var frml = document.getElementById(id).name;

    if (val == "ac") {
        document.getElementById('display').value = 0;
        calcdisplays.splice(0);
        formulaExprs.splice(0);
        calcdisplay="";
        formulaExpr="";
        }   else if (val == "bckspc") {
        if (calcdisplays.length>1) {
            var laststr = calcdisplays[calcdisplays.length-1];
            var frmstr = formulaExprs[formulaExprs.length-1];
            calcdisplay=calcdisplay.slice(0,-laststr.length);
            formulaExpr=formulaExpr.slice(0,-frmstr.length);
            document.getElementById('display').value = calcdisplay;
            console.log(formulaExpr);
            console.log(calcdisplay);
            calcdisplays.pop();
            formulaExprs.pop();
        } else if (calcdisplays.length=1) {
            document.getElementById('display').value = 0;
            calcdisplays.splice(0);
            formulaExprs.splice(0);
            calcdisplay="";
            formulaExpr="";
            }
        } else {
            calcdisplays.push(val);
            formulaExprs.push(frml);
            calcdisplay = calcdisplay+val;
            formulaExpr = formulaExpr+frml;
            console.log(formulaExpr);
            document.getElementById('display').value = calcdisplay;
            }
        }

function saveNewFormula() {
    var iVariables =  parseInt(document.getElementById("numofvars").value);
    var variables = [];
    var var0 = new variable($('#frmlttr').val(),$('#clcvarname').val(),$('#clcvarunits').val(),'0.0');
    variables.push(var0);
    for (var i=1;i<=iVariables;i++) {
        var q1 = new variable($('#varlttr'+i.toString()).val(),$('#vardscr'+i.toString()).val(),$('#varunit'+i.toString()).val(),$('#varvalue'+i.toString()).val());
        variables.push(q1);
        }
    var fDisplay = $('#frmimage').val();
    var fName = $('#frmdscr').val();
    var data = new Formula(variables,fDisplay, formulaExpr, calcdisplay, fName)
    formulaArray.push(data);
    syncDatabase();
    }

function saveEditedFormula() {
    formulaArray[currentArrayi].variables[0].arrVarLttrs = $('#edfrmlttr').val();
    formulaArray[currentArrayi].variables[0].arrVarDim = $('#edclcvarunits').val();
    formulaArray[currentArrayi].formulaName = $('#edfrmdscr').val();
    formulaArray[currentArrayi].formulaDisplay = $('#edfrmimage').val();
    formulaArray[currentArrayi].variables[0].arrVarNames = $('#edclcvarname').val();
    for (var i=1;i<formulaArray[currentArrayi].variables.length;i++) {
        formulaArray[currentArrayi].variables[i].arrVarLttrs = document.getElementById('edvarlttr'+i.toString()).value;
        }
    for (var i=1;i<formulaArray[currentArrayi].variables.length;i++) {
        formulaArray[currentArrayi].variables[i].arrVarNames = document.getElementById('edvardscr'+i.toString()).value;
        }
    for (var i=1;i<formulaArray[currentArrayi].variables.length;i++) {
        formulaArray[currentArrayi].variables[i].arrVarDim = document.getElementById('edvarunit'+i.toString()).value;
        }
    for (var i=1;i<formulaArray[currentArrayi].variables.length;i++) {
        formulaArray[currentArrayi].variables[i].values = document.getElementById('edvarvalue'+i.toString()).value;
        }
    formulaArray[currentArrayi].formula = formulaExpr;
    formulaArray[currentArrayi].frmshrt = calcdisplay;

    syncDatabase();

    }

function displayEditInput(FormulaArray) {
    currentArrayi=formulaArray.indexOf(FormulaArray);
    document.getElementById('ednumofvars').value = FormulaArray.variables.length-1;
    document.getElementById('edfrmlttr').value = FormulaArray.variables[0].arrVarLttrs;
    document.getElementById('edclcvarunits').value = FormulaArray.variables[0].arrVarDim;
    document.getElementById('edfrmdscr').value = FormulaArray.formulaName;
    document.getElementById('edfrmimage').value = FormulaArray.formulaDisplay;
    document.getElementById('edclcvarname').value = FormulaArray.variables[0].arrVarNames;
    var h='';
    for (var i=1;i<FormulaArray.variables.length;i++) {
        h += '<label>V'+i+' letter</label>';
        h += '<div class="input-group">';
        h += '<input id="edvarlttr'+i+'" onchange="updateVarBttns2('+i+')" type="text" class="form-control" name="name" value="'+
                FormulaArray.variables[i].arrVarLttrs+'">';
        h += "</div>"

        }
    $('#edvarlttr').html(h);
    h = '';
    for (var i=1;i<FormulaArray.variables.length;i++) {
        h += '<label>V'+i+' short description</label>';
        h += '<div class="input-group">';
        h += '<input id="edvardscr'+i+'" type="text" class="form-control" name="name" value="'+
                FormulaArray.variables[i].arrVarNames+'">';
        h += "</div>"
        }
    $('#edvardscr').html(h);
    h = '';
    for (var i=1;i<FormulaArray.variables.length;i++) {
        h += '<label>V'+i+' units</label>';
        h += '<div class="input-group">';
        h += '<input id="edvarunit'+i+'" type="text" class="form-control" name="name" value="'+
                FormulaArray.variables[i].arrVarDim+'">';
        h += "</div>"
        }
    $('#edvarunit').html(h);
    h = '';
    for (var i=1;i<FormulaArray.variables.length;i++) {
        h += '<label>V'+i+' test value</label>';
        h += '<div class="input-group">';
        h += '<input id="edvarvalue'+i+'" type="text" class="form-control" name="name" value="'+
                FormulaArray.variables[i].values+'">';
        h += '<span class="input-group-addon">';
        h +='<i class="pull-right glyphicon glyphicon-remove" onclick="deleteVar(' + i + ')"></i>';
        h += '</span>';
        h += "</div>"
        }
    $('#edvarvalue').html(h);
    //----calculator-with-variables----
    calcdisplay=FormulaArray.frmshrt; calcdisplays.length=0;
    formulaExpr=FormulaArray.formula; formulaExprs.length=0;
    var calcArray=multiSplit(formulaExpr,['this.variables','.values']);
    for (var i = 0; i < calcArray.length; i++) {
        var string1 = calcArray[i];
        var string2 = calcArray[i];
        for (var j=1;j<FormulaArray.variables.length;j++) {
            if (string1=='['+j.toString()+']') {
                string1='this.variables['+j.toString()+'].values';
                string2=FormulaArray.variables[j].arrVarLttrs;
                }
            }
        if (calcArray[i]!=='') {
            formulaExprs.push(string1);
            calcdisplays.push(string2);
        }
    }
    document.getElementById('display').value=calcdisplay;

    h= '';
    var var4 = Math.floor((FormulaArray.variables.length-1)/4);
    var var4res = (FormulaArray.variables.length-1)%4;
    for (var i=1;i<=var4;i++) {
        h += '<tr>';
        for (var j=1;j<=4;j++) {
            h += '<td>';
            h += '<button type="button" name="this.variables['+(4*(i-1)+j)+'].values"'+
                'class="btn btn-default btn-block" onclick="buttonClicked(id)" id="v'+
                (4*(i-1)+j)+'"value="v'+(4*(i-1)+j)+'">v'+(4*(i-1)+j)+'</button>';
            h += '</td>';
            }
            h += '</tr>';
        }
    h += '<tr>';
    for (var i=1;i<=var4res;i++) {
        h += '<td>';
        h += '<button type="button" name="this.variables['+(4*var4+i)+'].values"'+
        'class="btn btn-default btn-block" onclick="buttonClicked(id)" id="v'+
        (4*var4+i)+'"value="v'+(4*var4+i)+'">v'+(4*var4+i)+'</button>';
        h += '</td>';
        }
    h += '</tr>';
    $('#edcalculator').html(h);
    for (var i=1;i<FormulaArray.variables.length;i++) {
        document.getElementById('v'+i.toString()).innerHTML = document.getElementById('edvarlttr'+i.toString()).value;
        document.getElementById('v'+i.toString()).value = document.getElementById('edvarlttr'+i.toString()).value;
    }

}
//---add-one-variable-----
function addVar() {
    var var1 = new variable("new var","new property","new unit",0.0);
    formulaArray[currentArrayi].variables.push(var1);

    displayEditInput(formulaArray[currentArrayi]);

    syncDatabase();

}

//----deleting entire formula--------------------------
function deleteFormula() {
    var deletebool = confirm('Delete entire formula?');
    if (deletebool == true) {
        formulaArray.splice(currentArrayi,1);
        displayEditInput(formulaArray[0]);
        displayEditMenu(formulaArray);
        syncDatabase();
    }
}
//-----delete separate variable---
function deleteVar(i) {
    var formula = formulaArray[currentArrayi].formula;
    var formula2 = formulaArray[currentArrayi].frmshrt;
    var formulastr1 = 'this.variables['+i.toString()+'].values';
    var formulastr2 = formulaArray[currentArrayi].variables[i].arrVarLttrs;
    var m =formula.indexOf(formulastr1);
    var n =formula2.indexOf(formulastr2);
    while (m>-1) {
        formula = formula.replace(formulastr1,'');
        m =formula.indexOf(formulastr1);
        }
    while (n>-1) {
        formula2 = formula2.replace(formulastr2,'');
        n =formula2.indexOf(formulastr2);
        }

    var str2='';
    var str1='';
    for (var j=i+1;j<formulaArray[currentArrayi].variables.length;j++) {
        str1 = j+'';
        str2 = (j-1)+'';
        var m1 = formula.indexOf('['+str1+']');
        while (m1>-1) {
            formula=formula.replace('['+str1+']','['+str2+']');
            m1 = formula.indexOf('['+str1+']');
        }
    }
    formulaArray[currentArrayi].formula = formula;
    formulaArray[currentArrayi].frmshrt = formula2;

    formulaArray[currentArrayi].variables.splice(i,1);

    displayEditInput(formulaArray[currentArrayi]);
    syncDatabase();
}


//--Utilities---
function syncDatabase() {
    var data = JSON.stringify(formulaArray);
    localStorage.setItem("database", data);
    }

function syncuserDatabase() {
    var users = JSON.stringify(usersArray);
    localStorage.setItem("userbase", users);
    }


function updateVarBttns(i) {
    document.getElementById('v'+i.toString()).innerHTML = document.getElementById('varlttr'+i.toString()).value;
    document.getElementById('v'+i.toString()).value = document.getElementById('varlttr'+i.toString()).value;
    }

function updateVarBttns2(i) {
    document.getElementById('v'+i.toString()).innerHTML = document.getElementById('edvarlttr'+i.toString()).value;
    document.getElementById('v'+i.toString()).value = document.getElementById('edvarlttr'+i.toString()).value;
    }

var multiSplit = function(str,delimeters){
    var result = [str];
    if (typeof(delimeters) == 'string')
        delimeters = [delimeters];
    while(delimeters.length>0){
        for(var i = 0;i<result.length;i++){
            var tempSplit = result[i].split(delimeters[0]);
            result = result.slice(0,i).concat(tempSplit).concat(result.slice(i+1));
        }
    delimeters.shift();
    }
    return result;
}
