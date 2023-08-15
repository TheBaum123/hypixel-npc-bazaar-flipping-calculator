let itemInfo = []
let sortBy = "profit"
let showNoProfit = true

const cardsWrapper = document.getElementById("cards-wrapper")
const sortByDropdown = document.getElementById("sort-by")
const sortByOptions = document.querySelectorAll(".sort-by-option")

// this function will load the current
// bazaar prices, and combine them into
// a well formated object with human
// readable item names, item id's,
// bazaar prices and npc prices.
function load() {
    itemInfo = []
    let productsFromApi = {}

    fetch("https://api.hypixel.net/skyblock/bazaar")
    .then(data => {
        return data.json()
    })
    .then(json => {
        productsFromApi = json.products
        for(const [itemId, itemPrice] of Object.entries(npcBuyPrices)) {
            let sellPrice = Math.round(productsFromApi[itemId].quick_status.sellPrice * 10) / 10
            let profit = Math.round((sellPrice - itemPrice) * 10) / 10
            itemInfo.push({
                "itemId": itemId,
                "npcPrice": itemPrice,
                "bazaarSellPrice": sellPrice,
                "profit": profit,
                "itemName": humanReadables[itemId]
            })
        }
        sort()
        render()
    })
}


// this function will sort the
// array storing the item info
// by the value chosen
function sort() {
    switch(sortBy) {
        case "profit":
        default:
            itemInfo.sort((a, b) => {
                return b.profit - a.profit
            })
            break
        case "name":
            itemInfo.sort((a, b) => {
                if(a.itemName > b.itemName) {
                    return 1
                }
                if (a.itemName < b.itemName) {
                    return -1
                }
                return 0
            })
            break
        case "cost":
            itemInfo.sort((a, b) => {
                return a.npcPrice - b.npcPrice
            })
            break
        case "sellPrice":
            itemInfo.sort((a, b) => {
                return b.bazaarSellPrice - a.bazaarSellPrice
            })
            break
    }
}

// this functin will render the
// array as nice cards on the
// user's screen
function render() {
    cardsWrapper.innerHTML = ""
    if(showNoProfit) {
        itemInfo.forEach(item => {
            const card = document.createElement("div")
            card.classList.add("card")
            card.innerHTML = `
            <h3>${item.itemName}</h3>
            <article>
                <p>Profit: ${item.profit}</p>
                <p>Cost: ${item.npcPrice}</p>
                <p>Sell: ${item.bazaarSellPrice}</p>
            </article>`
            cardsWrapper.appendChild(card)
        })
    } else {
        itemInfo.forEach(item => {
            if(item.profit <= 0) return
            const card = document.createElement("div")
            card.classList.add("card")
            card.innerHTML = `
            <h3>${item.itemName}</h3>
            <article>
                <p>Profit: ${item.profit}</p>
                <p>Cost: ${item.npcPrice}</p>
                <p>Sell: ${item.bazaarSellPrice}</p>
            </article>`
            cardsWrapper.appendChild(card)
        })
    }
}

// when sort changes, update screen
// and change the options display
// value
sortByDropdown.addEventListener("change", () => {
    sortBy = sortByDropdown.value

    sortByOptions.forEach(option => {
        option.innerHTML = defaultOptionDisplay[option.id]
        if(option.id == `sort-by-${sortBy}`) {
            option.innerHTML = `Sort by: ${defaultOptionDisplay[option.id]}`
        }
    })

    sort()
    render()
})

load()