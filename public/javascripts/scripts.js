'use strict';

//init
createRecordList();

//DOM
let calc = document.querySelector('.header-button-js');
let resultPTag = document.querySelector('.header-p-js');
let resultImg = document.querySelector('.header-img-js');


//Listener
calc.addEventListener("click",controller,false);

//controller
function controller(){
    let height = document.querySelector('input[name="height"]').value;
    let weight = document.querySelector('input[name="weight"]').value;
    let invalid = document.querySelector('.form-group-js');

    invalid.textContent="";
    if ( height<=0 || weight<=0){
        invalid.textContent='錯誤！！請輸入0以上的數字';
        return;
    }

    updateBotton(height,weight);
    setJsonToLocalStorage(height,weight);
    createRecordList();
}

//計算BMI 
function calcBMI(height,weight){
    let result= weight/((height/100)*(height/100));
    //取到小数第二位
    let BMI = Math.floor(result*100)/100;
    console.log(BMI);
    return BMI;
}

//計算體位
function calcJudgment(BMI){
    let judgment = "";
    if(BMI < 18.5){
        judgment = "過輕"; 
    }else if (BMI<25){
        judgment = "理想";
    }else if (BMI<30){
        judgment = "過重";
    }else if (BMI<35){
        judgment = "輕度肥胖";
    }else if (BMI<40){
        judgment = "中度肥胖";
    }else{
        judgment = "重度肥胖";
    }
    return judgment;
}

//計算體重對應的顏色
function calcColor(judgementResult){
    let color = "";
    switch(judgementResult){          
        case '過輕':
            color='thin';
            break;

        case '理想':
            color='good';
            break;

        case '過重':
            color='fat';
            break;

        case '輕度肥胖':
            color='lightFat';
            break;

        case '中度肥胖':
            color='tooFat';
            break;

        case '重度肥胖':
            color='extrimeFat';
            break;
    }   
    return color;
}

//更新按鈕
function updateBotton(height,weight){
    let BMI = calcBMI(height,weight);
    let judgment = calcJudgment(BMI);
    let buttoncolor = calcColor(judgment);

    calc.innerHTML=`${BMI}</br><small>BMI</small>`;
    resultPTag.innerHTML=`<span class="text-${buttoncolor}">${judgment}</span>`;
    calc.setAttribute("class",`d-block rounded-circle bg-primary border-${buttoncolor} text-${buttoncolor} mt-4 ml-md-3  header-button-js header-button_border`);
    resultImg.setAttribute("class",`position-absolute header-img-js header-img d bg-cover d-block rounded-circle border-primary border bg-${buttoncolor}`);
}

//儲存Json到Local Storage
function setJsonToLocalStorage(height,weight){
    let data = JSON.parse(localStorage.getItem('BMIRecord')) || [];
    let json_dict = {};
    let BMI = calcBMI(height,weight)

    json_dict['BMI']= BMI;
    json_dict['judgment']=calcJudgment(BMI);
    json_dict['height']=height+"cm";
    json_dict['weight']=weight+"kg";
    
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const date = now.getDate();
    json_dict['date']=`${date}-${month + 1}-${year}`;

    
    data.push(json_dict)
    localStorage.setItem('BMIRecord',JSON.stringify(data));
}

//更新BMI紀錄
function createRecordList(){
    let data = JSON.parse(localStorage.getItem('BMIRecord')) || [];
    let str = '';
    let color = '';
    for(let item of data){
        color = calcColor(item['judgment']);

        str +=`
        <div class="col-8 shadow border-left border-${color} main-border-width mb-3">
            <ul class="list-unstyled d-md-flex justify-content-between mb-0 p-2 text-center">
                <li class="text-md-left mx-auto mx-md-0" style="width: 70px;">${item['judgment']}</li>
                <li class="text-md-left mx-auto mx-md-0" style="width: 70px;"><small class="mr-1">BMI</small>${item['BMI']}</li>
                <li><small class="mr-1">weight</small>${item['weight']}</li>
                <li><small class="mr-1">height</small>${item['height']}</li>
                <li class="text-md-right mx-auto mx-md-0" style="width: 80px;><small class="mr-1">${item['date']}</small></li>
            </ul>       
        </div>
        `
    }
    document.querySelector('.record').innerHTML=str;
}
