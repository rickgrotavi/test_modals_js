"use strict";

$(document).ready(function(){
    let persondate;
    let positionminage;
    let positionmaxage;

    //// Есть ли разница когда грузить файл? При открытии модального окна, или при загрузке страницы? 
    //// Я выбрал при загрузке страницы, так как мы и пришли на страницу что бы пользоваться всеми этими файлами. 
    //// А еще getJson работает ассинхронно, поэтому выводим из функции отдельную переменную.

    let personarr = new Array();
    let positionarr  = new Array();
    let orgsarr = new Array();
    let subarr = new Array();
    $.getJSON('json/persons.json', function(persondata){
        persondata.sort((a,b) => a.lastname > b.lastname);
        personarr = persondata;
    });
    $.getJSON('json/positions.json', function(positiondata){
        positiondata.sort((a,b) => a.name > b.name);
        positionarr = positiondata;  // getJson работает ассинхронно, по этому выводим наружу
    });
    $.getJSON('json/orgs.json', function(orgsdata){
        orgsdata.sort((a,b) => a.name > b.name);
        orgsarr = orgsdata;
    });
    $.getJSON('json/subs.json', function(subsdata){
        subsdata.sort((a,b) => a.name > b.name);
        subarr = subsdata;
    });
    ////
    
    ///// возрат сотрудника ////
    let age;
    function get_current_age(date) {
        date = date.split('.');
        date = date[2]+'-'+date[1]+'-'+date[0];
        age = ((new Date().getTime() - new Date(date)) / (24 * 3600 * 365.25 * 1000)) | 0;
        return age;
    }
    ///// возрат сотрудника ////

    //// проверяем установку должности
    function check_person(date){
        get_current_age(date);
        if(positionminage != undefined) {
            if(positionminage <= age && age <= positionmaxage) {
                    return('person_ok');
                }
                else {
                    return('person_not_ok');
                }
        }
        else {
            return('person_not_selected');
        }
    }
    //// проверяем установку должности

    //// проверяем установлен ли сотрудник и его возраст
    function check_position(minage, maxage){
        if (persondate != undefined) {
            get_current_age(persondate);
            if(minage <= age && age <= maxage) {
                return('position_ok');
            }
            else {
                return('position_not_ok')
            }            
        }
        else {
            return('position_not_selected');
        }
    };
    //// проверяем установлен ли сотрудник и его возраст
   
    /////////////// Общее ///////////////////////
    $("#okbutton").click(function(){
        // Выясняем в при выборе чего нажали ОК
        if ( $("#singleModalLabel").html() == "Сотрудники"){
            persondate = $("#selectpersdate").val();
            if(check_person(persondate) == 'person_ok' || check_person(persondate) == 'person_not_selected'){
                ok_pers_btn();
            }
            if(check_person(persondate) == 'person_not_ok'){
                if(confirm("Выбранный сотрудник не подходит по возрасту. Вы уверены, что хотите выбрать этого сотрудника?")){
                    ok_pers_btn();
                }
                else {
                    close_cencel();
                }
            }
        }
        if ( $("#singleModalLabel").html() == "Должноси"){
            positionminage = $("#selectpositionminage").val();
            positionmaxage = $("#selectpositionmaxage").val();
            // проверяем установлен ли сотрудник, и делаем решение 
            if(check_position(positionminage, positionmaxage) == 'position_ok' || check_position(positionminage, positionmaxage) == 'position_not_selected') {
                ok_position_btn()
            }
            if(check_position(positionminage, positionmaxage) == 'position_not_ok') {
                if(confirm("Выбранная должность не подходит по возрасту сотруднику. Вы уверены, что хотите выбрать эту должность")){
                    ok_position_btn();
                }
                else{
                    close_cencel();
                }
            }
        }
        if ( $("#singleModalLabel").html() == "Организации"){
            $("#setedvalorgs").html($('#selectorgs option:selected').val());
            $("#orga").hide();
            $("#singleModal").modal("hide");
            $("#setedorgs").css('display', 'flex');
        }
        if ( $("#singleModalLabel").html() == "Подразделение"){
            $("#setedvalsubs").html($('#selectsub option:selected').val());
            $("#podr").hide();
            $("#singleModal").modal("hide");
            $("#setedsubs").css('display', 'flex');
        }
    });
    function ok_position_btn(){
        $("#setedvalposition").html($('#selectposition option:selected').val());
        $("#dolzhn").css('display','none');
        $("#singleModal").modal("hide");
        $("#setedposition").css('display', 'flex'); // показываем что выбрали на главной странице 
    }
    function ok_pers_btn(){
        $("#setedvalpers").html($('#selectpers option:selected').val());
        $("#sotrudnik").hide();
        $("#singleModal").modal("hide");
        $("#setedpers").css('display', 'flex');
    }
    function close_cencel() { //Вцелом кнопки делают одно и то же, может нужно не через id а через class?
        $("#sotrudnik").css('display','none');
        $("#dolzhn").css('display','none');
        $("#orga").css('display','none');
        $("#podr").css('display','none');
        $("#singleModal").modal("hide");
    }
    $("#cencelbutton").click(function(){ // Кнопка отмена должна скрывать селекты с опшенами, 
                                        //  так как кнопка для всего одна, то есть смысл вывести ее в отдельную функцию
        close_cencel();
    });
    
    $("#close_modal").click(function(){ // Кнопка отмена должна скрывать селекты с опшенами, 
        //  так как кнопка для всего одна, то есть смысл вывести ее в отдельную функцию
        close_cencel();
        });
    /////////////// Общее ///////////////////////

    ///////////// Выбор сотрудника //////////////////////////////
    $("#persons").click(function(){
        $("#singleModalLabel").html("Сотрудники");
        let pers_option_val;
        let pers_option_val2;
        let pers_option_val3;
        let pers_option_val4;
        $.each(personarr,function(index){
            // действия, которые будут выполняться для каждого элемента массива
            // index - это текущий индекс элемента массива (число)
            pers_option_val += '<option val='+index+'>' + personarr[index].lastname + '</option>';
            pers_option_val2 += '<option val='+index+'>' + personarr[index].middlename + '</option>';
            pers_option_val3 += '<option val='+index+'>' + personarr[index].firstname + '</option>';
            pers_option_val4 += '<option val='+index+'>' + personarr[index].birthday + '</option>';
            });
            // Заполняем селекты из массива с данными, отавляем для редактирования только с названиями. 
            $("#sotrudnik").replaceWith(
                '<div id="sotrudnik"><select id="selectpers" class="custom-select custom-select-sm col-3" size='+ personarr.length +'>'
                    + pers_option_val +
                '</select>'+
                '<select id="selectpersname" class="custom-select custom-select-sm col-3" size='+ personarr.length +' disabled>'
                    + pers_option_val2 +
                '</select>' +
                '<select id="selectpersnamesec" class="custom-select custom-select-sm col-3" size='+ personarr.length +' disabled>'
                    + pers_option_val3 +
                '</select>' +
                '<select id="selectpersdate" class="custom-select custom-select-sm col-3" size='+ personarr.length +' disabled>'
                    + pers_option_val4 +
                '</select></div>'
            );
            $("#singleModal").modal("show");
            // Ставим выбор в сосетних селектах, таково задание (каждое поле в отдельном столбце). Можно было бы вывести как то в одном поле красивее.
            $('#selectpers').change(function() {
                $('#selectpersname option[val='+   $('#selectpers').prop('selectedIndex')  +']').prop('selected', true);
                $('#selectpersnamesec option[val='+   $('#selectpers').prop('selectedIndex')  +']').prop('selected', true);
                $('#selectpersdate option[val='+   $('#selectpers').prop('selectedIndex')  +']').prop('selected', true);                
            });    
    });
    $("#delpers").click(function(){
        persondate = undefined;
        positionminage = undefined;
        positionmaxage = undefined;
        $("#setedvalpers").html("-");
        $("#sotrudnik").hide();
        $("#setedpers").css('display', 'none');
});
    ///////////// Выбор организации //////////////////////////////

    ///////////// Выбор должности //////////////////////////////
    $("#positions").click(function(){
        $("#singleModalLabel").html("Должноси");
              
        let p_option_val;
        let p_option_val2;
        let p_option_val3;
        
        $.each(positionarr,function(index){
           // действия, которые будут выполняться для каждого элемента массива
           // index - это текущий индекс элемента массива (число)
           p_option_val += '<option val='+index+'>' + positionarr[index].name + '</option>';
           p_option_val2 += '<option val='+index+'>' + positionarr[index].min_age + '</option>';
           p_option_val3 += '<option val='+index+'>' + positionarr[index].max_age + '</option>';
           });
           // Заполняем селекты из массива с данными, отавляем для редактирования только с названиями. 
        $("#dolzhn").replaceWith(
            '<div id="dolzhn"><select id="selectposition"       class="custom-select custom-select-sm col-3" size='+ positionarr.length +'>'
            + p_option_val +
            '</select>'+
            '<select id="selectpositionminage" class="custom-select custom-select-sm col-3" size='+ positionarr.length +' disabled>'
            + p_option_val2 +
            '</select>' +
            '<select id="selectpositionmaxage" class="custom-select custom-select-sm col-3" size='+ positionarr.length +' disabled>'
            + p_option_val3 +
            '</select></div>'
            );
            $("#singleModal").modal("show");    
            // Ставим выбор в сосетних селектах, таково задание (каждое поле в отдельном столбце). Можно было бы вывести как то в одном поле красивее.
            $('#selectposition').change(function() {
                $('#selectpositionminage option[val='+   $('#selectposition').prop('selectedIndex')  +']').prop('selected', true);
                $('#selectpositionmaxage option[val='+   $('#selectposition').prop('selectedIndex')  +']').prop('selected', true);
            });    
    });
    $("#delposition").click(function(){
        persondate = undefined;
        positionminage = undefined;
        positionmaxage = undefined;
        $("#setedvalposition").html("-");
        $("#dolzhn").css('display','none');
        $("#setedposition").css('display', 'none');
    });
    ///////////// Выбор должности //////////////////////////////

    ///////////// Выбор организации //////////////////////////////
    $("#orgs").click(function(){
        $("#singleModalLabel").html("Организации");
        let o_option_val;
        let o_option_val2;
        $.each(orgsarr,function(index){
            // действия, которые будут выполняться для каждого элемента массива
            // index - это текущий индекс элемента массива (число)
            o_option_val += '<option val='+index+'>' + orgsarr[index].name + '</option>';
            o_option_val2 += '<option val='+index+'>' + orgsarr[index].country + '</option>';
            });
            // Заполняем селекты из массива с данными, отавляем для редактирования только с названиями. 
            $("#orga").replaceWith(
                '<div id="orga"><select id="selectorgs" class="custom-select custom-select-sm col-3" size='+ orgsarr.length +'>'
                    + o_option_val +
                '</select>'+
                '<select id="selectorgsname" class="custom-select custom-select-sm col-3" size='+ orgsarr.length +' disabled>'
                    + o_option_val2 +
                '</select> </div>'
            );
            $("#singleModal").modal("show");
            // Ставим выбор в сосетних селектах, таково задание (каждое поле в отдельном столбце). Можно было бы вывести как то в одном поле красивее.
            $('#selectorgs').change(function() {
                $('#selectorgsname option[val='+   $('#selectorgs').prop('selectedIndex')  +']').prop('selected', true);                
            });    
    });
    $("#delorgs").click(function(){
        $("#setedvalorgs").html("-");
        $("#orga").hide();
        $("#setedorgs").css('display', 'none');
    });
    ///////////// Выбор организации //////////////////////////////

    ///////////// Выбор подразделения //////////////////////////////
    $("#subs").click(function(){
        $("#singleModalLabel").html("Подразделение");
        let s_option_val;
        $.each(subarr,function(index){
            // действия, которые будут выполняться для каждого элемента массива
            // index - это текущий индекс элемента массива (число)
            s_option_val += '<option val='+index+'>' + subarr[index].name + '</option>';
            });
            // Заполняем селекты из массива с данными, отавляем для редактирования только с названиями. 
            $("#podr").replaceWith(
                '<div id="podr"><select id="selectsub" class="custom-select custom-select-sm col-3" size='+ subarr.length +'>'
                    + s_option_val +
                '</select></div>'
            );
            $("#singleModal").modal("show");
            // Ставим выбор в сосетних селектах, таково задание (каждое поле в отдельном столбце). Можно было бы вывести как то в одном поле красивее.
            $('#selectsub').change(function() {
                $('#selectsubname option[val='+   $('#selectsub').prop('selectedIndex')  +']').prop('selected', true);                
            });    
    });
    $("#delsubs").click(function(){
        $("#setedvalsubs").html("-");
        $("#podr").hide();
        $("#setedsubs").css('display', 'none');
    });
    ///////////// Выбор организации //////////////////////////////
})