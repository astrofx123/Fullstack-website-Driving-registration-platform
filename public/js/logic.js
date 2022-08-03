"use strict";

document.addEventListener('DOMContentLoaded', () => {
    let countFName = 0;
    let countLName = 0;
    let countCity = 0;

    let isValid = true;
    // To highlight the current active webpage.
    $('a').each(function () {
        if ($(this).prop('href') == window.location.href) {
            $(this).addClass('active');
        }
        else {
            $(this).removeClass('active');
        }
    });

    // Focusout event on name to validate the data.
    $('#fname').focusout(() => {
        // IF the input field's value is a number
        if (!isNaN($('#fname').val())) {
            isValid = false;
            if (countFName == 0) {
                $('#fname').after(`<p class="error" id="fname_error"> Please enter a valid first name </p>`);
                countFName++;
            }
        }
        else {
            $('#fname_error').hide();
            countFName = 0;
            isValid = true;
        }
    });

    $('#lname').focusout(() => {
        // IF the input field's value is a number
        if (!isNaN($('#lname').val())) {
            isValid = false;
            if (countLName == 0) {
                $('#lname').after(`<p class="error" id="lname_error"> Please enter a valid last name </p>`);
                countLName++;
            }
        }
        else {
            isValid = true;
            $('#lname_error').hide();
            countLName = 0;
        }
    });

    // Focusout event on city input field to validate.
    $('#city').focusout(() => {
        // IF the input field's value is a number
        if (!isNaN($('#city').val())) {
            isValid = false;
            if (countCity == 0) {
                $('#city').after(`<p class="error" id="city_error"> Please enter a valid city </p>`);
                countCity++;
            }
        }
        else {
            isValid = true;
            $('#city_error').hide();
            countCity = 0;
        }
    });

    // Sign Up Page
    $('#sign_up').click(function () {
        window.location.href = "/signUp";
    });


    // Appointment Page for G2 Page
    $('#userSelectedDate').change(function () {
        const userSelectedDate = $('#userSelectedDate').val();
        // Personal details
        const fname = $('#fname').val();
        const lname = $('#lname').val();
        const dob = $('#dob').val();
        const house_no = $('#house_no').val();
        const street_name = $('#street_name').val();
        const city = $('#city').val();
        const province = $('#province').val();
        const postal = $('#postal').val();
        // Car details
        const make = $('#make').val();
        const model = $('#model').val();
        const year = $('#year').val();
        const license_no = $('#license_no').val();
        const plate_num = $('#plate_num').val();
        const Image1 = $('#Image1').val();
        const Image2 = $('#Image2').val();

        const dataObj = {
            date : userSelectedDate,
            fName : fname,
            lName : lname,
            Dob : dob,
            houseNo : house_no,
            streetName : street_name,
            City : city,
            Province : province,
            Postal : postal,
            Make : make,
            Model : model,
            Year : year,
            PlateNum : plate_num,
            LicenseNo : license_no,
        }
        if(userSelectedDate){
            sessionStorage.setItem('userData',JSON.stringify(dataObj));
            window.location.href=`/getTimeSlots/${dataObj.date}`;
        }
    });
    // Appointment page for G Page
    $('#userSelectedDateG').change(function () {
        const userSelectedDateGPage = $('#userSelectedDateG').val();
        // Personal details
        const fname = $('#fname').val();
        const lname = $('#lname').val();
        const dob = $('#dob').val();
        const house_no = $('#house_no').val();
        const street_name = $('#street_name').val();
        const city = $('#city').val();
        const province = $('#province').val();
        const postal = $('#postal').val();
        // Car details
        const make = $('#make').val();
        const model = $('#model').val();
        const year = $('#year').val();
        const license_no = $('#license_no').val();
        const plate_num = $('#plate_num').val();
        const Image1 = $('#Image1').val();
        const Image2 = $('#Image2').val();

        const dataObj = {
            date : userSelectedDateGPage,
            fName : fname,
            lName : lname,
            Dob : dob,
            houseNo : house_no,
            streetName : street_name,
            City : city,
            Province : province,
            Postal : postal,
            Make : make,
            Model : model,
            Year : year,
            PlateNum : plate_num,
            LicenseNo : license_no,
        }
        if(userSelectedDateGPage){
            sessionStorage.setItem('userDataGPage',JSON.stringify(dataObj));
            window.location.href=`/getTimeSlotsGPage/${dataObj.date}`;
        }
    });
});