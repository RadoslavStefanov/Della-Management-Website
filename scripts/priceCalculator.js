let serviceButtons = document.querySelectorAll(".service-selection li");
    serviceButtons.forEach(x => x.addEventListener('click', toggleField));

const calcDisplay = document.querySelector(".calculation-display");
const priceDisplay = document.querySelector(".display-total");
const priceBTN = document.querySelector(".button-total");
const calcForm = document.querySelector(".calculator-body form");

//Custom Events
const cleaningInput = document.querySelector("#cleaningInput");
cleaningInput.addEventListener('input', updateFieldData);

const repairInput = document.querySelector("#repairInput");
repairInput.addEventListener('click', addRemoveRepairFee);

const showHideBillBtn = document.querySelector('.bill-trigger');
showHideBillBtn.addEventListener('click', showBill);


//User Defined variables
let bedPricePP = 45;
let softFurniturePP = 20;
let cleaningBySize = 4;
let minimumCleaningPrice = 280;
let afterRepairCost = 280;


//Base variables
let totalPrice;
let repairFeeAdded = false;
let calcFieldsMap = [];

const fieldCreationMap = 
[
    {
        labelText: "Почистване",
        connectedField: "Комплексно почистване кв.м",
        measurement: "кв.м.",
        price: cleaningBySize
    },
    {
        labelText: "Мека мебел",
        connectedField: "Мека мебел",
        measurement: "бр.",
        price: softFurniturePP
    },
    {
        labelText: "Матраци",
        connectedField: "Матраци",
        measurement: "бр.",
        price: bedPricePP
    },
    {
        labelText: "След ремонт",
        connectedField: "",
        measurement: "",
        price: afterRepairCost
    }
];



function toggleField(event)
{
    //!MARK Add hidden field for the non connected field checks. There should be a way for the reciever to know if the required job has been marked to be after a repair and if it has to be payed with a card!
    let liElement = event.currentTarget;

    if(liElement.getAttribute("dl-disabled") === "true")
        return;
    
    if(liElement.getAttribute("checked") === "false")
    {
        showHideConnectedField(liElement, "show");
        liElement.setAttribute("checked","true")
    }
    else
    {
        showHideConnectedField(liElement, "hide");
        liElement.setAttribute("checked","false")
    }
}



function showHideConnectedField(node, operation)
{
    let fieldName = node.getAttribute("connectedField");

    if(fieldName === "null")
    {
        //FS -> FormSubmit service
        let FSFieldId = node.getAttribute("formSubmitField");
        let inputNode = document.getElementById(FSFieldId);

        if(inputNode)
        {
            if(operation === "show")
            {
                inputNode.disabled = false;
                inputNode.value = "ДА";
            }
            else if(operation === "hide")
            {
                inputNode.disabled = true;
                inputNode.value = "";
            }
        }
        return;
    }

    let roll =  document.querySelector(`.dl-calculator .row[name='${fieldName}']`);
    if(operation === "show")
    {
        roll.style.display = "flex";
        roll.querySelector("input").value = "";

        let entryMap = fieldCreationMap.find(({connectedField}) => connectedField === fieldName);
        if(entryMap)
        {
            roll.querySelector("input").required = true;
            roll.querySelector("input").disabled = false;
            calcFieldsMap.push(
                {
                    labelText: entryMap.labelText,
                    connectedField: entryMap.connectedField,
                    pieces: 0,
                    measurement: entryMap.measurement,
                    price: "00",
                    price2: "00",
                    priceConcat: 0
                }
            )
        }
            
        
        let inputSource = document.querySelector(`.dl-calculator .row[name='${fieldName}']`);
        if(inputSource)
        {
            inputSource = inputSource.querySelector("input");
            inputSource.removeEventListener('input', updateFieldData);
            inputSource.addEventListener('input', updateFieldData);
        }
    }        
    else if(operation === "hide")
    {
        roll.style.display = "none";
        roll.querySelector("input").value = "0";
        roll.querySelector("input").disabled = true;

        calcFieldsMap = calcFieldsMap.filter(({connectedField}) => connectedField !== fieldName);
    }  

    updateCalDisplay();    
}

function initCalcEntry(labelText="", connectedField="", pieces="", measurement="", price="", price2=""){
    let entryDiv = document.createElement("div");
        entryDiv.classList.add("entry");
        entryDiv.setAttribute("connectedField", connectedField);

        let label = document.createElement("p");
            label.innerText = `${labelText} ${pieces}${measurement}`;
            entryDiv.appendChild(label);
        
        let priceContainer = document.createElement("strong");
            priceContainer.innerHTML = `+ ${price} <sup>${price2}</sup> лв.`;
            entryDiv.appendChild(priceContainer);
        
        let separator = document.createElement("div");
            separator.classList.add("entry-separator");
            entryDiv.appendChild(separator);
    
    calcDisplay.appendChild(entryDiv);
}

function updateFieldData(event)
{
    let liElement = event.currentTarget;
    let value = liElement.value;
    let connectedField = liElement.getAttribute("name"); 

    if(connectedField)
    {
        let pricePP = fieldCreationMap.find(x => x.connectedField === connectedField).price * value;
        pricePP = pricePP.toFixed(2);

        let existingEntry = calcFieldsMap.find(x => x.connectedField === connectedField);
        existingEntry.pieces = value;
        existingEntry.price = pricePP.split('.')[0];
        existingEntry.price2 = pricePP.split('.')[1];
        existingEntry.priceConcat = Number(pricePP);
    } 

    updateCalDisplay();
}

function updateCalDisplay(){
    calcDisplay.querySelectorAll(".entry").forEach(x => x.remove());

    totalPrice = 0;

    calcFieldsMap.forEach(x => 
        {
            initCalcEntry
            (
                x.labelText,
                x.connectedField,
                x.pieces,
                x.measurement,
                x.price,
                x.price2,
                x.priceConcat
            )

            totalPrice = totalPrice + Number(x.priceConcat);
        }
    )
    
    if(repairFeeAdded)
    {
        let feePrice = ((totalPrice*1.2) - totalPrice).toFixed(2);

        initCalcEntry
        (
            "След ремонт",
            "",
            "",
            " +20%",
            feePrice.split('.')[0],
            feePrice.split('.')[1],
            feePrice
        )

        totalPrice = totalPrice + Number(feePrice);
    }

    totalPrice = `${totalPrice.toFixed(2)}`;

    updateFormSubmitCalcPrice(totalPrice);

    priceDisplay.innerHTML = `    
        <strong>Сметка: </strong>
        <p class="price"> ${totalPrice.split('.')[0]} <sup style="top: 0.3rem; left: 0rem; font-size: 1rem;">${totalPrice.split('.')[1]}</sup></p>
        <p style="position: relative; left: -2rem; top: 0rem;">.лв</p>
    `
    priceBTN.innerHTML = `    
        <strong style="color:white;">Поръчай: </strong>
        <p class="price" style="display: inline-flex;"> ${totalPrice.split('.')[0]} <sup style="top: 0.3rem; left: 0rem; font-size: 1rem;">${totalPrice.split('.')[1]}</sup></p>
        <p style="position: relative; left: -1rem; top: 0rem; display:inline-flex">.лв</p>
    `    
}

function addRemoveRepairFee(){

    let isChecked = repairInput.getAttribute("checked");

    if(isChecked === "true")
    {
        repairFeeAdded = true;
    }
    else
    {
        repairFeeAdded = false;
    }

    updateCalDisplay();
}

function showBill(event){    
    if(event.currentTarget.getAttribute("showBill") === "false")
    {
        document.querySelector('.calculator-body > div').classList.add("shown")
        event.currentTarget.setAttribute("showBill", "true");
        event.currentTarget.classList.add("light");
        calcForm.classList.remove("rounded");
    }
    else
    {
        document.querySelector('.calculator-body > div').classList.remove("shown")
        event.currentTarget.setAttribute("showBill", "false");
        event.currentTarget.classList.remove("light");
        calcForm.classList.add("rounded");
    }
        
}

function updateFormSubmitCalcPrice(input)
{
    document.querySelector("#formCalcPrice").value = input+" лв.";
}

//Predefined field
calcFieldsMap.push(
    {
        labelText: "Почистване",
        connectedField: "Комплексно почистване кв.м",
        pieces: 0,
        measurement: "кв.м.",
        price: "00",
        price2: "00",
        priceConcat: 0
    }
)

updateCalDisplay();