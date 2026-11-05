document.addEventListener("DOMContentLoaded", async function() {
    let t
    document.getElementById('ville').addEventListener('input', function(){
        clearTimeout(t)
        if(document.getElementById('ville').value != ""){
            t = setTimeout(function(){
                getCity()
            }, 300)
        }else{
            clearOptions()
        }
    })
})

async function getCity(){
    const value = document.getElementById('ville').value
    console.log(value)
    let url=`https://www.toogoodtogo.com/api/location?keyword=${value}&locale=fr`
    const json = await fetch(url)
    const raw = JSON.parse(await json.text())
    const list = raw['response']['payload']

    console.log(await list)

    clearOptions()
    for (let i = 0 ; i<list.length ; i++){
        const tr = document.createElement('tr')
        const th = document.createElement('th')
        th.textContent = list[i]['displayName']
        tr.append(th)

        tr.addEventListener('click', function(){
            clearOptions()
            document.getElementById('ville').value = list[i]['displayName']
            updateResults(list[i]['center']['latitude'], list[i]['center']['longitude'])
        })

        document.getElementById('tbody').append(tr)
    }
}

function clearOptions(){
    const list = document.getElementById('tbody')
    while(list.lastChild){
        list.removeChild(list.lastChild)
    }
}

async function getShops(lat, lng){
    const url = `https://www.toogoodtogo.com/api/surprise-bags?lat=${lat}&lng=${lng}&language=fr&locale=fr&page=0&withStockOnly=0`
    const json = await fetch(url)
    const raw = JSON.parse(await json.text())
    return await raw['payload']['items']
}

async function updateResults(lat, lng) {
    clearResults()
    const results = await getShops(lat, lng)
    console.log(results)
    results.forEach((e) => {

        const mainRow = document.createElement('div')
        mainRow.classList.add('row', 'bg-light', 'rounded', 'mb-3', 'justify-content-center')

        const firstRow = document.createElement('div')
        firstRow.classList.add('row', 'my-1')

        const row1col1 = document.createElement('div')
        row1col1.classList.add('col', 'align-self-center', 'text-center')
        const shopName = document.createElement('span')
        shopName.classList.add('fw-bold')
        shopName.textContent = e['displayName'].split('(')[0]
        row1col1.append(shopName)

        const row1col2 = document.createElement('div')
        row1col2.classList.add('col-3')
        const img = document.createElement('img')
        img.classList.add('img-fluid', 'rounded-circle')
        img.setAttribute('src', e['item']['logoPicture']['currentUrl'])
        row1col2.append(img)

        const secondRow = document.createElement('div')
        secondRow.classList.add('row')
        const amount = document.createElement('span')
        switch (e["itemsAvailable"]){
            case 0 :
                amount.textContent = "Aucun panier restant"
                break;
            case 1 :
                amount.textContent = "1 panier disponible"
                break;
            default :
                amount.textContent = `${e["itemsAvailable"]} paniers disponibles`
        }
        secondRow.append(amount, document.createElement('br'))

        if(e["pickupInterval"]){
            const heure = document.createElement('span')
            const start = new Date(Date.parse(e["pickupInterval"]["start"]))
            const end = new Date(Date.parse(e["pickupInterval"]["end"]))
            const hdeb = `${start.getHours()}:${minutes(start.getMinutes())}`
            const hfin = `${end.getHours()}:${minutes(end.getMinutes())}`

            heure.textContent = `${hdeb} - ${hfin}`
            secondRow.append(heure, document.createElement('br'))
        }


        const price = document.createElement('span')
        price.classList.add('fw-bold')
        const n = e["item"]["itemPrice"]["minorUnits"].toString()
        const decimals = e["item"]["itemPrice"]["decimals"]
        const eur = n.substring(0, n.length-decimals)
        const ctm = n.substring(n.length-decimals)
        price.textContent = `${eur},${ctm}€`
        secondRow.append(price, document.createElement('br'))

        const thirdRow = document.createElement('div')
        thirdRow.classList.add('row', 'justify-content-end', 'mb-2')
        const row3col1 = document.createElement('div')
        row3col1.classList.add('text-end', 'p-0')
        const btn = document.createElement('button')
        btn.setAttribute('type', 'button')
        btn.classList.add('btn', 'btn-success')
        btn.textContent = 'Selectionner'
        row3col1.append(btn)


        firstRow.append(row1col1, row1col2)
        thirdRow.append(row3col1)

        mainRow.append(
            firstRow,
            document.createElement('hr'),
            secondRow,
            thirdRow
        )
        document.getElementById("colRes").append(mainRow)
    })
}

function clearResults(){
    const list = document.getElementById('colRes')
    while(list.lastChild){
        list.removeChild(list.lastChild)
    }
}

function minutes(n){
    //rajoute un 0 devant le nombre de minutes si il est <10
    if(n<10){
        return `0${n.toString()}`
    }else{
        return n
    }
}