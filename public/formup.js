
var mybutton = document.getElementById("myBtn");
var modal = document.getElementById("popup");
var span = document.getElementsByClassName("close")[0];
var sendit = document.getElementById("send");

const form = document.getElementsByClassName("contact-form")[0];

var suf1 = document.getElementById("suf1");
var suf2 = document.getElementById("suf2");
var suf3 = document.getElementById("suf3");

var jsondata;

mybutton.onclick = function () {
    modal.style.display = "block";
    mybutton.style.display = "none";
    suf1.style.visibility = "hidden";
    suf2.style.visibility = "hidden";
    suf3.style.visibility = "hidden";

}

span.onclick = function () {
    modal.style.display = "none";
    mybutton.style.display = "block";
    suf1.style.visibility = "hidden";
    suf2.style.visibility = "hidden";
    suf3.style.visibility = "hidden";
}

/*
// on scroll, show button
$(window).scroll(function () {
    var t = $(window).scrollTop() + 1;
    var c = $('html').outerHeight();
    var p = (t / c * 100).toFixed(0);


    
    if (p > 20) {
        if(modal.style.display == "block"){
        mybutton.style.display = "none";
    }else{
    mybutton.style.display = "block";}
    }
    else {
    mybutton.style.display = "none";
    }
   
});
 */

const isValidElement = element => {
    return element.name && element.value;
};


const isValidValue = element => {
    return !["checkbox", "radio"].includes(element.type) || element.checked;
};


const formToJSON = (elements) =>
    [].reduce.call(
        elements,
        (data, element) => {
            // Make sure the element has the required properties and should be added.
            if (isValidElement(element) && isValidValue(element)) {
                data[element.name] = element.value;
            }
            return data;
        },
{});

const handleFormSubmit = event => {

    event.preventDefault();

    // Call our function to get the form data.
    const data = formToJSON(form.elements);

    var exdays = 30;
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = 'jsondata='+ JSON.stringify(data)+';'+ expires+';'

    console.log(data);

    modal.style.display = "none";
    mybutton.style.display = "block";

    var checkExist = setInterval(function () {
        if ($('#the-canvas').length) {

            modal.style.display = "none";
            console.log("Exists!");
            clearInterval(checkExist);
        }
    }, 100);

};

form.addEventListener("submit", handleFormSubmit);
