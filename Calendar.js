/**************************************************************************************************
Test calendario  Freddy Ramirez
Historia de Usuario:
    Desarrollar un calendario con css, js, html.

    - Un usuario cuando entre, debe poder observar el calendario en
    el mes y día actual.
    - Un usuario puede adelantar y atrasar el mes de uno en uno clickeando en los botones.
    - Un usuario debe observar los días feriados argentinos resaltados en color rojo y dia actual en con color de fondo azul.

Requisitos funcionales:
    - La primera ejecución del calendario debe mostrar mes y día actual.
    - No usar librerías adicionales.
    - Resaltar el día actual con color de fondo azul.
    - Permitir adelantar y retroceder de a un mes.
    - Conectarse a la API para obtener feriados argentinos.
    - Resaltar los días feriados en color rojo.

Consideraciones
    Se implementará construyendo el calendario sobre un div
    usado como objeto padre a él, se agregaran como objetos hijos
    una tabla que contiene los títulos, flecha,
    ,filas de semanas y celdas de días.

    - Se necesita una función para construir la estructura de tablas que contendrá el calendario.
    - Se necesita una función para dibujar los días y los posiciones correctamente en la tabla.
    - Se necesita una función que limpie la tabla y la deje en blanco para poder dibujar otro mes.
    - Se necesitan funciones que manejen los clicks en los botones siguiente y anterior.
    - Se necesita realizar una función para conectarse a la api y obtener los días feriados
     esta re-dibujará los días al obtener la respuesta json con los feriados.

Opcionales
    - Animacion flip para trancicion entre meses.

Notas adicionales

     La API solo devuelve los feriados hasta 2020.

**********************************************************************************************/

var today= new Date();
var currentMonth=today.getMonth();
var currentYear=today.getFullYear();
var jsonHolidays;// json with the holidays

// calendar labels
var monthText = ["January","February","March","April","May","June","July","August","September","October","November","December"];
var dayText = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];

function handleNextMonthButtonClick(){
    if(currentMonth<11){
        currentMonth++;
    }else{
        currentMonth=0;
        currentYear++;
        getHolidaysAjaxCall(currentYear);
    }
    flip("next");
}

function handlePrevMonthButtonClick(){
    if (currentMonth > 0) {
        currentMonth--;
    }else{
        currentYear--;
        currentMonth=11;
        getHolidaysAjaxCall(currentYear);
    }
    flip("back");
}

// flip animation the optional task called when the next or back buttons are clicked
function flip(direction){
		let container = document.getElementById("Calendar");
        d = direction==="next"? "flip":"flipback";
        container.classList.add(d);

        setTimeout(function(){
            container.classList.remove(d);
            renderDays();

    },200);

}

function dateForDay(year,month ,day) {
  return new Date(year, month, day);
}

function clearCalendar(){
    let selectTable = document.getElementsByClassName('month-table')[0];
    document.getElementById("title-top-month").innerHTML="";    // clear title
    for(i=0;i<selectTable.children[2].children.length;i++)      //clear days
        for(j=0;j < selectTable.children[2].children[i].children.length;j++){
            selectTable.children[2].children[i].children[j].innerText = "";
            selectTable.children[2].children[i].children[j].classList.remove("today");
            selectTable.children[2].children[i].children[j].classList.remove("holiday");
        }
}

function renderDays() { // set the days of the currentMonth in the caleandar obj
    clearCalendar();// first clear the calendar
    let lastDayCurrentmonth = new Date(currentYear,currentMonth + 1, 0).getDate();

    // set the right title on the calendar
    document.getElementById("title-top-month").innerHTML=monthText[currentMonth]+", "+currentYear;

    // filling the calendar with the right days
    for (i = 1; i <= lastDayCurrentmonth; i++) {
        let date = dateForDay(currentYear,currentMonth, i);
        let selectTable = document.getElementsByClassName('month-table')[0];
        let day = date.getDate();
        let dayWeek = date.getDay();

        if (day == 1) // week row logic
            var week = 0;

        // setting the day i
        selectTable.children[2].children[week].children[dayWeek].innerText = day;

        //checking if the day i is today
        if(i == today.getDate() && date.getMonth() == today.getMonth() && date.getFullYear()== today.getFullYear() )
            selectTable.children[2].children[week].children[dayWeek].classList.add("today");

        // checking if the day i is a holiday and if the json is not empty
        if(jsonHolidays!=undefined && jsonHolidays[currentMonth]!=undefined && jsonHolidays[currentMonth][i] != undefined)
            selectTable.children[2].children[week].children[dayWeek].classList.add("holiday");

        if (dayWeek == 6)// week row logic
            week = week + 1;
    }
}

function getHolidaysAjaxCall(year){
	let holidays = [];
	let ajaxUrl="http://nolaborables.com.ar/api/v2/feriados/"+year+"?formato=mensual";
	var ajaxRequest = new XMLHttpRequest();

	ajaxRequest.onreadystatechange = function() {
	    // readyState es 4
	    if (ajaxRequest.readyState == 4 ) {
	        jsonHolidays = JSON.parse( ajaxRequest.responseText );
            renderDays();//  re-render the calendar days when the json with the holidays is downloaded
	    }
	}
	ajaxRequest.open( "GET", ajaxUrl, true );
	ajaxRequest.send();
}

//this function build a caleandar as a child in the div obj with the id Calendar
function renderCalendar(){
    let month = document.getElementById("Calendar");
    let monthTable = document.createElement("TABLE");
    let monthNameTitle = document.createElement("CAPTION");
    let tableHead = document.createElement("THEAD");
    let dayTitleRow = document.createElement("TR");
    let tableBody = document.createElement("TBODY");

    document.body.appendChild(month);
    month.appendChild(monthTable);
    monthTable.appendChild(monthNameTitle);
    monthTable.appendChild(tableHead);
    tableHead.appendChild(dayTitleRow);
    monthTable.appendChild(tableBody);
    month.className = "month";
    monthTable.className = "month-table";
    monthNameTitle.className = "month-name-title";
    //append the title and the arrows next and back
    monthNameTitle.innerHTML = "<div class='pagination'>"+
                            "<a href='#' onclick='handlePrevMonthButtonClick()'>❮</a>"+
                            "<a href='#' id='title-top-month'></a>"+
                            "<a href='#' onclick='handleNextMonthButtonClick()'>❯</a></div>";

    //creating the days titles row with the dayTxt array
    for (d = 0; d < 7; d++) {
   		let day = document.createElement("TH");
   		day.innerText = dayText[d];
   		dayTitleRow.appendChild(day);
	}

    //creating a week rows and days cells objs
	for (f = 0; f < 6; f++) {
    	let row = document.createElement("TR");
    	tableBody.appendChild(row);
	    for (d = 0; d < 7; d++) {
	        let day = document.createElement("TD");
	        //day.innerText = "1";
	        row.appendChild(day);
	    }
	}

    renderDays();
    getHolidaysAjaxCall(currentYear);
}

renderCalendar();// calling the method to render it
