let k = 0

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
    let url=`https://www.toogoodtogo.com/api/location?keyword=${value}&locale=fr`
    const json = await fetch(url)
    const raw = JSON.parse(await json.text())
    const list = raw['response']['payload']

    clearOptions()
    for (let i = 0 ; i<list.length ; i++){
        const tr = document.createElement('tr')
        const th = document.createElement('th')
        th.textContent = list[i]['displayName']
        tr.append(th)

        tr.addEventListener('click', function(){
            clearOptions()
            document.getElementById('ville').value = list[i]['displayName']
            clearResults()
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

async function getShops(lat, lng, page){
    const url = `https://www.toogoodtogo.com/api/surprise-bags?lat=${lat}&lng=${lng}&language=fr&locale=fr&page=${page}&withStockOnly=0`
    const json = await fetch(url)
    const raw = JSON.parse(await json.text())
    return {items : await raw['payload']['items'], canLoadMore : await raw['canLoadMore']}
}

async function updateResults(lat, lng, page=0) {
    const results = await getShops(lat, lng, page)
    console.log(results["items"])
    results["items"].forEach((e) => {

        const mainRow = document.createElement('div')
        mainRow.classList.add('row', 'bg-light', 'rounded', 'mb-3', 'justify-content-center')

        const firstRow = document.createElement('div')
        firstRow.classList.add('row', 'my-1')

        const row1col1 = document.createElement('div')
        row1col1.classList.add('col', 'align-self-center', 'text-center', 'py-2', 'px-0')
        const shopName = document.createElement('span')
        shopName.classList.add('fw-bold')
        shopName.textContent = e['store']['storeName']
        row1col1.append(shopName)

        const row1col2 = document.createElement('div')
        row1col2.classList.add('col-3', 'align-self-center')
        const img = document.createElement('img')
        img.classList.add('img-fluid', 'rounded-circle')
        img.setAttribute('src', e['item']['logoPicture']['currentUrl'])
        row1col2.append(img)

        const secondRow = document.createElement('div')
        secondRow.classList.add('row', 'mb-2')
        const amount = document.createElement('span')
        switch (e["itemsAvailable"]){
            case 0 :
                if(e['itemTags'].length == 0){
                    amount.textContent = "Pas de paniers"
                }else{
                    amount.textContent = e['itemTags'][0]["shortText"]
                }
                amount.classList.add('text-danger')
                break;
            case 1 :
                amount.textContent = "1 panier disponible"
                amount.classList.add('text-warning')
                break;
            default :
                amount.textContent = `${e["itemsAvailable"]} paniers disponibles`
                amount.classList.add('text-success')
        }
        secondRow.append(amount, document.createElement('br'))

        const type = document.createElement('span')
        if(e["item"]["name"] != ""){
            type.textContent = e["item"]["name"]
        }else{
            type.textContent = "Panier Surprise"
        }
        secondRow.append(type, document.createElement('br'))

        const address = document.createElement('span')
        address.classList.add('fs-6')
        const link = document.createElement('a')
        link.setAttribute('href', `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(e['store']['storeName']+" "+e['store']['storeLocation']['address']['addressLine'])}`)
        link.setAttribute('target', '_blank')
        link.textContent = e["store"]["storeLocation"]['address']['addressLine']
        address.append(link)
        secondRow.append(address, document.createElement('br'))

        let hdeb = "19:00"
        let hfin = "21:00"
        let jour = ""
        const ajd = new Date
        if(e["pickupInterval"]){
            const heure = document.createElement('span')
            const start = new Date(Date.parse(e["pickupInterval"]["start"]))
            const end = new Date(Date.parse(e["pickupInterval"]["end"]))
            hdeb = `${start.getHours()}:${minutes(start.getMinutes())}`
            hfin = `${end.getHours()}:${minutes(end.getMinutes())}`

            if(start.getDate() == ajd.getDate()){
                jour = "Aujourd'hui"
            }else if(start.getDate() == ajd.getDate()+1){
                jour = "Demain"
            }else{
                jour = `${start.getDate()} ${numberToMonth(start.getMonth())}`
            }

            heure.textContent = `${jour} ${hdeb} - ${hfin}`
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
        thirdRow.classList.add('row', 'justify-content-around', 'mb-2')

        const row3col1 = document.createElement('div')
        row3col1.classList.add('col')
        const inputNumber = document.createElement('input')
        inputNumber.classList.add('form-control', 'text-center')
        inputNumber.setAttribute('type', 'number')
        inputNumber.setAttribute('id', `input${k}`)
        inputNumber.setAttribute('disabled', '')
        inputNumber.value = 1

        const btnLess = document.createElement('button')
        btnLess.classList.add('btn', 'btn-primary')
        btnLess.textContent = "-"
        btnLess.setAttribute('disabled', '')
        const btnMore = document.createElement('button')
        btnMore.classList.add('btn', 'btn-primary')
        btnMore.textContent = "+"
        
        const colInput = document.createElement('div')
        colInput.classList.add('col-4', 'p-0')
        const colLess = document.createElement('div')
        colLess.classList.add('col-4', 'text-center')
        const colMore = document.createElement('div')
        colMore.classList.add('col-4', 'text-center')
        const rowInput = document.createElement('div')
        const id = `input${k}`
        btnMore.addEventListener('click', function(){
            document.getElementById(id).value++
            if(document.getElementById(id).value > 1){
                btnLess.removeAttribute('disabled')
            }
        })
        btnLess.addEventListener('click', function(){
            document.getElementById(id).value--
            if(document.getElementById(id).value == 1){
                btnLess.setAttribute('disabled', '')
            }
        })
        rowInput.classList.add('row')
        colInput.append(inputNumber)
        colLess.append(btnLess)
        colMore.append(btnMore)
        rowInput.append(colLess, colInput, colMore)
        row3col1.append(rowInput)

        const row3col2 = document.createElement('div')
        row3col2.classList.add('col', 'text-end', 'p-0', 'align-self-center')
        const btn = document.createElement('button')
        btn.setAttribute('type', 'button')
        btn.classList.add('btn', 'btn-success')
        btn.textContent = 'Valider'

        //soumission du formulaire et redirection
        const defaultText = "Le commerçant fournira l'emballage, mais nous vous encourageons à apporter votre propre sac pour ramener le panier chez vous."
        btn.addEventListener('click', async function(){  
            const formData = new FormData()
            formData.append("logo", "link")
            formData.append("imgLink", e['item']['logoPicture']['currentUrl'])
            formData.append("deb", hdeb)
            formData.append("fin", hfin)
            formData.append("prix", parseFloat(`${eur}.${ctm}`))
            formData.append("nb", document.getElementById(id).value)
            formData.append("adresse", e["store"]["storeLocation"]['address']['addressLine'])
            formData.append("type", e["item"]["name"])
            formData.append("ing", defaultText)
            formData.append("nom", e["store"]['storeName'])

            const data = Object.fromEntries(formData.entries())
            sessionStorage.setItem('formData', JSON.stringify(data))
                 
            window.location.href = '/TooGoodToPay/malveillance';
        })

        row3col2.append(btn)


        firstRow.append(row1col1, row1col2)
        thirdRow.append(row3col1, row3col2)

        const hr = document.createElement('hr')
        hr.classList.add('mb-2')

        mainRow.append(
            firstRow,
            hr,
            secondRow,
            thirdRow
        )
        document.getElementById("colRes").append(mainRow)
        k++
    })

    if(results["canLoadMore"]){
        const btnNext = document.createElement('button')
        btnNext.textContent = "Charger plus"
        btnNext.classList.add('btn', 'btn-primary')
        btnNext.setAttribute('id', 'btnNext')
        btnNext.addEventListener('click', function(){
            document.getElementById('rowBtnNext').remove()
            updateResults(lat, lng, page+1)
        })
        const rowBtnNext = document.createElement('div')
        rowBtnNext.classList.add('row', 'justify-content-center')
        rowBtnNext.setAttribute('id', 'rowBtnNext')
        const colBtnNext = document.createElement('div')
        colBtnNext.classList.add('col-6', 'text-center', 'p-0')
        colBtnNext.append(btnNext)
        rowBtnNext.append(colBtnNext)
        document.getElementById("colRes").append(rowBtnNext)
    }
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

function numberToMonth(n){
    let result = ""
    switch(n){
        case 0 :
            result = "Janvier"
            break
        case 1 :
            result = "Février"
            break
        case 2 :
            result = "Mars"
            break
        case 3 :
            result = "Avril"
            break
        case 4 :
            result = "Mai"
            break
        case 5 :
            result = "Juin"
            break
        case 6 :
            result = "Juillet"
            break
        case 7 :
            result = "Aout"
            break
        case 8 :
            result = "Septembre"
            break
        case 9 :
            result = "Octobre"
            break
        case 10 :
            result = "Novembre"
            break
        case 11 :
            result = "Décembre"
            break
    }
}