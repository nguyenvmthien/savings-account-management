function confirmSubmit() {
    var cusID = document.querySelector('[name="c_id"]').value;
    var name = document.querySelector('[name="name"]').value;
    var address = document.querySelector('[name="address"]').value;
    var createDate = document.querySelector('[name="create_date"]').value;
    var typeOfSaving = document.querySelector('[name="tos"]').value;
    var rate = document.querySelector('[name="interest-rate"]').value;
    var money = document.querySelector('[name="money"]').value;

    if (cusID === '' || name === '' || address === '' || createDate === '' || typeOfSaving === '' || money === '') {
        alert('Please fill out all fields.');
        return;
    }

    document.getElementById('confirmCId').innerText = 'Customer ID Card: ' + cusID;
    document.getElementById('confirmName').innerText = 'Customer Name: ' + name;
    document.getElementById('confirmAddress').innerText = 'Customer Address: ' + address;
    document.getElementById('confirmCreateDate').innerText = 'Date Create Account: ' + createDate;
    document.getElementById('confirmTos').innerText = 'Type of Saving: ' + typeOfSaving;
    document.getElementById('confirmRate').innerText = 'Interest Rate: ' + rate;
    document.getElementById('confirmMoney').innerText = 'Money: ' + money + ' VND';

    var popup = document.getElementById('pop-up');
    popup.style.display = "block";
}

function closePopup() {
    var popup = document.getElementById('pop-up');
    popup.style.display = "none";
}

function submitForm() {
    document.getElementById('myForm').submit();
}

document.getElementById('tos-input').addEventListener('change', function () {
    var typeOfSaving = this.value;
    console.log(typeOfSaving);
    if (typeOfSaving !== "") {
        console.log('Calling API with type:', typeOfSaving);
        fetch('/create/api/getInterestRate?type=' + typeOfSaving)
            .then(response => response.json())
            .then(data => {
                console.log('Raw Data:', data);
                document.getElementById('rate').value = data.interestRate + '%';
            })
            .catch(error => {
                console.error('Error fetching interest rate:', error);
                document.getElementById('rate').value = '0.x%';
            });
    } else {
        document.getElementById('rate').value = '0.x%';
    }
});