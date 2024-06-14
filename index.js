import { menuArray } from "./data.js"

const orderSummaryItems = []
const detailsForm = document.getElementById("details-form")
document.addEventListener("click", function (e) {
    if (e.target.dataset.addItem) {
        handleAddItemClick(e.target.dataset.addItem)
    }

    else if (e.target.dataset.delete) {
        handleRemoveClick(e.target.dataset.delete)
    }

    else if (e.target.id === 'complete-order-btn') {
        toggleModal()
    }

    else if (e.target.id === 'close-modal-btn') {
        toggleModal()
    }

})

//handling the form
detailsForm.addEventListener('submit', function(e){
    e.preventDefault()
    const detailsFormData = new FormData(detailsForm)
    orderSummaryItems.length = 0
    render()
    toggleModal()
    document.getElementById("container").innerHTML += `
    <div class="after-modal" id="after-modal">
        <p>Thanks,${detailsFormData.get("name")}! Your order is on the way!</p>
    </div>`
    
})



function handleAddItemClick(itemId) {
    document.getElementById("order-summary").classList.remove("hidden")
    const itemObj = menuArray.filter(function (item) {
        return item.id == itemId
    })[0]

    const summaryItemObj = orderSummaryItems.filter(function (item) {
        return item.id == itemId
    })[0]

    if (summaryItemObj) {
        summaryItemObj.qty++
    } else {
        orderSummaryItems.push({
            name: itemObj.name,
            id: itemObj.id,
            qty: 1,
            price: itemObj.price
        })
    }
    console.log(orderSummaryItems)
    render()
    document.getElementById("order-summary").classList.remove("hidden")
}

function handleRemoveClick(removeId) {
    const removeItemObj = orderSummaryItems.filter(function (item) {
        return item.id == removeId
    })[0]
    const isSingle = removeItemObj.qty === 1 ? true : false
    if (!isSingle) {
        removeItemObj.qty--
    } else {
        const index = orderSummaryItems.indexOf(removeItemObj)
        if (index > -1) {
            orderSummaryItems.splice(index, 1)
        }
    }
    console.log(orderSummaryItems)
    render()
    if (orderSummaryItems.length) {
        document.getElementById("order-summary").classList.remove("hidden")
    }
}

function toggleModal() {
    document.getElementById('modal').classList.toggle("hidden")

}




function getHtml() {

    let html = ''
    menuArray.forEach(function (item) {
        html += `<section>
                    <div class="flex-tray" id='${item.id}'>
                        <span class="item-icon">${item.emoji}</span>
                        <div class="item-description">
                            <h2 class="item-title">${item.name}</h2>
                            <p class="item-ingredients">${item.ingredients.join(',')}</p>
                            <p class="item-price">$${item.price}</p>
                        </div>
                        <button class="increase-btn" data-add-item="${item.id}">+</button>
                    </div>
                </section>`
    })

    const totalPrice = orderSummaryItems.reduce(function (total, currentItem) {
        return total + currentItem.price * currentItem.qty
    }, 0)
    html += `<div class="order-summary hidden" id="order-summary">
                    <h2>Your Order</h2>`
    orderSummaryItems.forEach(function (item) {
        html += `<div class="flex-tray">
                            <p class="order-item">${item.name}</p>
                            <button class="remove-btn" data-delete ='${item.id}'>remove</button>
                            <p class="order-item-price">$${item.price * item.qty}</p>
                    </div>`
    })
    html += `   <div class="flex-tray bottom-top">
                        <p class="total-price-row">Total price:</p>
                        <p class="total-price">$${totalPrice}</p>
                    </div>
                    <button class="complete-order-btn" id="complete-order-btn">Complete Order</button>
                </div>`
    return html
}

function render() {
    document.getElementById('container').innerHTML = getHtml()
}

render()