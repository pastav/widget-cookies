
const fs = require('fs');
const titleCase = require('title-case').titleCase;

exports.readyTemplates = function readyTemplates(tests) {
    const inputSample = require('lodash').keyBy(tests, 'TestName');

    const name = titleCase(tests[0].PName);

    if (name.length > 22 || tests[0].DoctorName.length > 22) {
        throw new Error('patient name or ref by too long');
    }

    const ageRecord = tests[0].Age;
    const approvedDate = tests[0].ApprovedDate;
    let genderRecord = "Male"
    if (titleCase(tests[0].Gender.substring(0, 1)) === 'M') {
        genderRecord = "Male"
    } else {
        genderRecord = "Female"
    }
    
    if (tests[0].BarcodeNo.length > 10) {
        throw new Error('barcode longer than 10');
    }

    let originalTemplate = 0

    if (tests[0].Center === 'Gurgaon') {
        originalTemplate = fs.readFileSync('bmi.html', 'utf8').replace(/{{barcode}}/, tests[0].BarcodeNo);
    } else {
        originalTemplate = fs.readFileSync('template_other.html', 'utf8').replace(/{{barcode}}/, tests[0].BarcodeNo);
    }

    // console.log(Object.keys(inputSample).filter(x => x.startsWith("Erythrocyte"))[0].codePointAt(11));
   // global.count = 0;
    let digitalTemplate = originalTemplate;
    let printTemplate = originalTemplate;
   
    
    //Ensure that order of declaration of placeholders is same as their placement in liver.html
    [
       
        {
            placeholder: '{{BMI}}', result: inputSample['BMI'] && bmifunc(
            {
                height: inputSample['BMI']['Height'], weight: inputSample['BMI']['Weight'], h: 15,
                biomarker: 'BMI'
                
            },) || {colored: '', grayscaled: ''}
        },
    
        {
            placeholder: '{{BP}}', result: inputSample['Blood Pressure'] && bpfunc(
            {
                sys: inputSample['Blood Pressure']['Systolic'], dia: inputSample['Blood Pressure']['Diastolic'], h: 15,
                biomarker: 'Blood Pressure'
                
            },) || {colored: '', grayscaled: ''}
        },

    ].forEach(prPair => {
        digitalTemplate = digitalTemplate.replace(prPair.placeholder, prPair.result.colored);
        printTemplate = printTemplate.replace(prPair.placeholder, prPair.result.grayscaled);
    });

    digitalTemplate = digitalTemplate.replace(/{{header-details}}/g, `
        <dl style="border-style: solid; border-color: #666; border-width: 1px 0; padding-top: 4px; padding-bottom: 4px; width: 87%;">
            <div style="display: inline-block; vertical-align: top; margin-right: 8px; width: 26%;">
                <dt>Patient</dt>
                <dd class="font-large" style="display: block;">${name}</dd>
                <dd>${genderRecord}, ${ageRecord} years old</dd>
            </div>
            <div style="display: inline-table; vertical-align: top; margin-right: 16px;">
                <div style="display: table-row;">
                    <dt>Date</dt>
                    <dd>${approvedDate.substring(0, approvedDate.indexOf(' '))}</dd>
                </div>
            <div style="display: table-row;">
                    <dt>Ref. By</dt>
                    <dd>Self</dd>
                </div>
               
            </div>
            <div style="display: inline-table; vertical-align: top; margin-left: 8px;">
                <img id="barcode" style="display: inline-table; margin-top: 8px;">
            </div>    
        </dl>
    `);

    printTemplate = printTemplate.replace(/{{header-details}}/g, `
        <dl style="border-style: solid; border-color: #666; border-width: 1px 0; padding-top: 4px; padding-bottom: 4px; width: 87%;">
            <div style="display: inline-block; vertical-align: top; margin-right: 32px; width: 36%;">
                <dt>Patient</dt>
                <dd class="font-large" style="display: block;">${name}</dd>
                <dd>${genderRecord}, ${ageRecord} years old</dd>
            </div>
            <div style="display: inline-table; vertical-align: top; margin-right: 32px;">
                <div style="display: table-row;">
                    <dt>Date</dt>
                    <dd>${approvedDate.substring(0, approvedDate.indexOf(' '))}</dd>
                </div>
                <div style="display: table-row;">
                    <dt>Ref. By</dt>
                    <dd>Self</dd>
                </div>
                <div style="display: table-row;">
                    <dt>Lab Id</dt>
                    <dd>${tests[0].WorkOrderID}</dd>
                </div>
            </div>
        
        </dl>
    `);

    return {
        digitalTemplate: digitalTemplate, printTemplate: printTemplate
    };
};

    function bpfunc(options){

        let x = 0;
        let y = 0;
        x = (options.dia * 2.75) - 91;
        y = (options.sys * -1.375) + 265.25;
        x_ = x + 5;
         
    

        return {
            colored: `
            <div class="card" style="display: inline-block; margin-right: 2px; width: 47.5%;">
                <span class="font-large" style="font-weight: bold;">${options.biomarker}: ${options.sys} / ${options.dia}</span><br>
               <div> <span class="font-large" style="font-weight: bold;"> Systolic: ${options.sys} mm/Hg </span>
                <div> The pressure as your heart pumps blood out to the veins.</div></div><br><br>
                <div><span class="font-large" style="font-weight: bold;"> Diastolic: ${options.dia} mm/Hg </span>
                <div> The resting pressure, which is in between heartbeats.</div></div>
            </div>
            <div style="display: inline-block; width: 47.5%; vertical-align: top;">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" style="display: block; margin-top: 0px; margin-left: auto; margin-right: auto;" height="187" width="245">
            <path d="M 19 4 L 184 4, 184 169, 156.5 169, 156.5 72.75, 19 72.75 z " fill="#D4B268" />
            <path d="M 19 72.75 L 19 100.25, 129 100.25, 129 169, 156.5 169, 156.5 72.75 z" fill= "#998F5C" />
            <path d="M 19 100.25 L 19 141.5, 74 141.5, 74 169, 129 169, 129 100.25 z" fill= "#C26564" />
            <path d="M 19 141.5 L 19 169, 74 169, 74 141.5 z" fill= "#982F35" />
            <path d="M 19 178 L 184 178"  style="fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" />
            <path d="M 184 178 L 170 172"  style="fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" />
            <path d="M 184 178 L 170 184"  style="fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" />
            <path d="M 10 169 L 9 4"  style="fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" />
            <path d="M 9 4 L 15 18"  style="fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" />
            <path d="M 9 4 L 3 18"  style="fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" />
            <text x="20" y="150" text-anchor="left" style="dominant-baseline: middle; fill: #F5F5F5;">Low BP</text>
            <text x="20" y="110" text-anchor="left" style="dominant-baseline: middle; fill: #F5F5F5;">Normal BP</text>
            <text x="20" y="82" text-anchor="left" style="dominant-baseline: middle; fill: #F5F5F5;">Pre-High BP</text>
            <text x="20" y="15" text-anchor="left" style="dominant-baseline: middle; fill: #F5F5F5;">High BP</text>

            <text x="187" y="15" text-anchor="left" class="font-small" style="dominant-baseline: middle; fill: #000000;">X Axis: Diastolic</text>
            <text x="187" y="25" text-anchor="left" class="font-small" style="dominant-baseline: middle; fill: #000000;">Y Axis: Systolic</text>

             <circle cx="${x}" cy="${y}" r="10" fill="#000000" />
             <text x="${x}" y="${y}" text-anchor="middle" class="font-small" style="dominant-baseline: middle; fill: #F5F5F5;">YOU</text>



           
        </svg>
  </div>
            `,
            grayscaled: `
                <span class="font-large" style="font-weight: bold;">${options.biomarker}: ${options.x} ${options.unit}</span>
                
    
               
            `
        };
    }

    function bmifunc(options) {
        let youX = 0;
        let signal = { fontWeight: 'bold' };
        let calcbmi = 0;
        calcbmi = options.weight/ (options.height * options.height);
        calcbmi = calcbmi.toFixed(1);
    
        if (calcbmi < 18.5) {
            youX = 5 + 6.1 * calcbmi;
            signal.fontWeight = 'bold';
            signal.color = '#982F35';
            signal.grayscaleColor = '#999';
        } else if (calcbmi < 24.9) {
            youX = 121.25 + 18.164 * (calcbmi - 18.5);
            signal.color = '#998F5C';
            signal.grayscaleColor = '#777';
        } else if (calcbmi < 29.9) {
            youX = 237.5 + 23.7 * (calcbmi - 25);
            signal.color = '#D4B268';
            signal.grayscaleColor = '#555';
        } else {
            youX = 353.75 + 5.8 * (calcbmi - 30);
            signal.color = '#982F35';
            signal.grayscaleColor = '#111';
        }
    
        const cardTemplate = `
    
    <div class= "card card-1">
        <span class="font-large" style="font-weight:${signal.fontWeight};">BMI : ${calcbmi}</span>
    
     
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" style="display: block; margin-top: 16px; margin-left: auto; margin-right: auto;" height="50" width="470">
                <path d="M 0 20 L 5 10, 116.25 10, 116.25 30, 5 30 z" fill="{{color1}}" />
                <path d="M 121.25 10 L 232.5 10, 232.5 30, 121.25 30 z" fill="{{color2}}" />
                <path d="M 237.5 10 L 348.75 10, 348.75 30, 237.5 30 z" fill="{{color3}}" />
                <path d="M 353.75 10 L 465 10, 470 20, 465 30, 353.75 30 z" fill="{{color4}}" />

               
                <text x="5" y="7" class="font-small" style="font-weight: bold; text-transform: uppercase;">Underweight</text>
                <text x="121.25" y="7" class="font-small" style="font-weight: bold; text-transform: uppercase;">Healthy Weight</text>
                <text x="237.5" y="7" class="font-small" style="font-weight: bold; text-transform: uppercase;">Overweight</text>
                <text x="353.75" y="7" class="font-small" style="font-weight: bold; text-transform: uppercase;">Obese</text>
    
                <text x="60.625" y="20" text-anchor="middle" class="font-small" style="dominant-baseline: middle; fill: #F5F5F5; font-weight: normal;">< 18.5</text>
                <text x="176.875" y="20" text-anchor="middle" class="font-small" style="dominant-baseline: middle; fill: #F5F5F5; font-weight: normal;">18.5 to 24.9</text>
                <text x="293.125" y="20" text-anchor="middle" class="font-small" style="dominant-baseline: middle; fill: #F5F5F5; font-weight: normal;">25 to 29.9</text>
                <text x="409.375" y="20" text-anchor="middle" class="font-small" style="dominant-baseline: middle; fill: #F5F5F5; font-weight: normal;">> 30.0</text>
    
                <path d="M ${youX} 30 L ${youX + 5} 35, ${youX + 50} 35, ${youX + 50} 50, ${youX} 50 z" fill="#252525" />
                <text x="${youX + 26}" y="42.5" class="font-small" text-anchor="middle" style="dominant-baseline: middle; fill: #F5F5F5;">YOU: ${calcbmi}</text>
            </svg><br>
            
            <ul style="margin-top: 8px; margin-left: auto; margin-right: auto; width: 90%;">
            <li style="display: inline-table; width: 45%; margin-right: 8px;">
                <object data="electronics.svg" type="image/svg+xml" style="display: table-cell; padding-right: 2px;"></object>
                <span class="font-large" style="display: table-cell; color: #000000; font-weight: 800; text-transform: uppercase; vertical-align: middle; width: 60%;">Weight: ${options.weight} Kg</span>
            </li>
            <li style="display: inline-table; width: 45%;">
                <object data="medical.svg" type="image/svg+xml" style="display: table-cell; padding-right: 2px;"></object>
                <span class="font-large" style="display: table-cell; color: #000000; font-weight: 800; text-transform: uppercase; vertical-align: middle; width: 60%;">Height: ${options.height} m</span>
            </li>
        </ul>
    </div>
        `;
    
        return {
            colored: cardTemplate
                .replace(/{{signalColor}}/, signal.color)
                .replace(/{{color1}}/, '#D4B268')
                .replace(/{{color2}}/, '#998F5C')
                .replace(/{{color3}}/, '#C26564')
                .replace(/{{color4}}/, '#982F35'),
            grayscaled: cardTemplate
                .replace(/{{signalColor}}/, signal.grayscaleColor)
                .replace(/{{color1}}/, '#999')
                .replace(/{{color2}}/, '#777')
                .replace(/{{color3}}/, '#555')
                .replace(/{{color4}}/, '#111')
        };
    }
    
