document.addEventListener("DOMContentLoaded", async function() {
        
    const defaultText = "Le commerçant fournira l'emballage, mais nous vous encourageons à apporter votre propre sac pour ramener le panier chez vous."
    document.getElementById('tooltip').setAttribute('data-bs-title', defaultText)
    const tooltip = new bootstrap.Tooltip(document.getElementById('tooltip'))

    if(document.getElementById('switchInstructions').checked){
        document.getElementById('ing').setAttribute('disabled', '')
    }else{
        document.getElementById('ing').removeAttribute('disabled')
    }

    document.querySelector('form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());      
        if(document.getElementById('switchInstructions').checked){
            data.ing = defaultText
        }
        //console.log(data)  
        sessionStorage.setItem('formData', JSON.stringify(data));
        
        const imgInput = document.getElementById('custom').files[0]
        if(imgInput){
            const reader = new FileReader()
            reader.onload = function (event) {
                const dataUrl = event.target.result;
                try {
                    sessionStorage.setItem('customLogo', dataUrl);
                    window.location.href = '/TooGoodToPay/malveillance';
                } catch (err) {
                    alert("Erreur lors de la sauvegarde : l'image est probablement trop lourde.");
                }
            };
            reader.readAsDataURL(imgInput);
        }else{
            sessionStorage.removeItem('customLogo')
            window.location.href = '/TooGoodToPay/malveillance';
        }
    });

    //remplissage du select logo
    const json = await fetch('logo.json')
    const list = JSON.parse(await json.text())
    //console.log(await list)
    let i = 0
    list.forEach((e) => {
        const option = document.createElement('option')
        option.setAttribute('value', i)
        option.textContent = e['name']
        document.getElementById('floatingSelect').append(option)
        i++
    })

    document.getElementById('floatingSelect').addEventListener('input', function(){
        if(document.getElementById('floatingSelect').value == 'custom'){
            document.getElementById('custom').removeAttribute('disabled')
        }else{
            document.getElementById('custom').setAttribute('disabled', '')
        }
    })

    const customSwitch = document.getElementById('switchInstructions')
    const desc = document.getElementById('ing')
    customSwitch.addEventListener('input', function(){
        if(customSwitch.checked){
            ing.setAttribute('disabled', '')
        }else{
            ing.removeAttribute('disabled')
        }
    })

})
