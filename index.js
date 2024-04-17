fetch('http://localhost:3000/api/selectAll', {
    method: 'GET', // The type of HTTP request
})
    .then(response => response.json()) // Parsing the data as JSON
    .then(data => {
        let dataContainer = document.getElementById('dataContainer');

        data.forEach(item => {
            let listItem = document.createElement('li');
            listItem.textContent = `Day of the week: ${item.day},Name: ${item.name},Kcal:${item.calories}`;

            let childList = document.createElement('ul');
            item.ingredients.forEach(ingredient => {
                let childItem = document.createElement('li');
                childItem.textContent = ingredient;
                childList.appendChild(childItem);
            });

            let deleteButton = document.createElement('button')
            deleteButton.textContent = 'Delete'
            deleteButton.onclick = () => deleteRecipeById(item._id);

            listItem.appendChild(childList);
            listItem.appendChild(deleteButton)
            dataContainer.appendChild(listItem);
        });
    }) // Handling the JSON data from the response
    .catch((error) => {
        console.error('Error:', error); // Catching and logging any errors
    });

let ingredients = ['Chicken', 'Tomato', 'Cheese', 'Onion', 'Garlic', 'Paprika'];
let type = ""
let day = ""
let name = ''
let kcal = 0

let chosenIngredients = [];

ingredients.forEach((ingredient) => {
    let li = document.createElement('li');
    li.textContent = ingredient;
    let button = document.createElement('button');
    button.textContent = '+';
    button.addEventListener('click', function() {
        addChosenIngredient(ingredient);
    });
    li.appendChild(button);
    document.getElementById('ingredients').appendChild(li);
});

let daySelect = document.getElementById('day-select');
daySelect.onchange = function() {
    day = this.options[this.selectedIndex].value;
}

let typeSelect = document.getElementById('type-select');
typeSelect.onchange = function() {
    type = this.options[this.selectedIndex].value
}

let nameInput = document.getElementById('name-input');
nameInput.oninput = function() {
    name = this.value;
}

let kcalInput = document.getElementById('kcal-input');
kcalInput.oninput = function () {
    kcal = this.value
}
function addChosenIngredient(ingredient) {
    if (!chosenIngredients.includes(ingredient)) {
        chosenIngredients.push(ingredient);
        let li = document.createElement('li');
        li.textContent = ingredient;
        let button = document.createElement('button');
        button.textContent = '-';
        button.addEventListener('click', function() {
            removeChosenIngredient(ingredient, li);
        });
        li.appendChild(button);
        document.getElementById('chosenIngredients').appendChild(li);
    }
}

function removeChosenIngredient(ingredient, liElement) {
    let index = chosenIngredients.indexOf(ingredient);
    if (index > -1) {
        chosenIngredients.splice(index, 1);
        liElement.remove();
    }
}

function addRecipe() {
    const dinner = {
        name: name,
        type: type,
        calories: kcal,
        ingredients: chosenIngredients,
        day: day
    }

    fetch('http://localhost:3000/api/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dinner)
    })
        .then(response => response.json()) // Parsing the data as JSON
        .then(data => {
            updateRecipeList()
            clearForm()
        }) // Handling the JSON data from the response
        .catch((error) => {
            console.error('Error:', error); // Catching and logging any errors
        });
}
function updateRecipeList() {
    let dataContainer = document.getElementById('dataContainer');
    dataContainer.innerHTML = ''; // Usuwa poprzednio wyrenderowane przepisy
    fetch('http://localhost:3000/api/selectAll', {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                let listItem = document.createElement('li');
                listItem.textContent = `Day of the week: ${item.day},Name: ${item.name},Kcal:${item.calories}`;

                let childList = document.createElement('ul');
                item.ingredients.forEach(ingredient => {
                    let childItem = document.createElement('li');
                    childItem.textContent = ingredient;
                    childList.appendChild(childItem);
                });

                let deleteButton = document.createElement('button')
                deleteButton.textContent = 'Delete'
                deleteButton.onclick = () => deleteRecipeById(item._id);

                listItem.appendChild(childList);
                listItem.appendChild(deleteButton)
                dataContainer.appendChild(listItem);
            });
        })
        .catch(error => console.error('There has been a problem with your fetch operation:', error));
}
function clearForm() {
    chosenIngredients = []
    document.getElementById('chosenIngredients').innerHTML = ""
    kcalInput.value = "";
    nameInput.value = "";
}
function deleteRecipeById(id) {
    fetch('http://localhost:3000/api/deleteById?id=' + id, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => updateRecipeList())
        .catch(error => console.error('There has been a problem with your fetch operation:', error));
}
