function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  var x = `
  "Gender": "M",
  "Center": "Gurgaon",
  "WorkOrderID": 10001910579,
  "LabID": 10001910579,
  "DoctorApprovedDateTime": "20-12-2019 15:43",
  "PackageProfileID": "G11S01T32",
  "PackageProfileName": "Health Kind Complete",
  "TestID": "G01S01T01",
  "TestName": "BMI",
  "TestTechnique": "",
  "TestMeasuringUnit": "",
  "TestParameterMaxRangeValue": 17,
  "TestParameterMinCriticalRangeValue": null,
  "TestParameterMaxCriticalRangeValue": null,
  "sampletype": null,
  "BarcodeNo": 6611978,
  "SamplecollectedDate": "20-12-2019",
  "SampleReceiveDate": "20-12-2019 09:40",
  "ResultEnteredDate": "20-12-2019 00:00",
  "LastPrintedDateTime": "21-12-2019 15:20",
  "ApprovedDate": "20-12-2019 15:14",
  "DoctorName": "ARUN GARG",
  "TestParameterMachineTestedOn": null,
  "TestParameterMachineReading": null
}
]`;
  var co = getCookie('data');
  co = co.substring(0, co.length-1);
  co = "["+co;
  co = co.concat(",");
  co = co.concat(x);
  console.log(co);

  
  