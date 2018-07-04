document.addEventListener('DOMContentLoaded', (e) => {
    console.log('This Application uses WizardLead!');
    let location = window.location.pathname;
    fireData({
        type: 'arrival',
        path: window.location.pathname
    })
    .then(() => {
        document.addEventListener('click', (e) => {
            let type;
            if(window.location.pathname != location){
                type = 'navigate';
                location = window.location.pathname;
            } else {
                type = e.type;
            }
            fireData({
                type: type,
                path: window.location.pathname,
                info: {
                    value: e.target.value || e.target.text || e.target.innerHtml,
                    identifiers: {
                        name: e.target.name,
                        id: e.target.id,
                        className: e.target.className,
                        tagName: e.target.tagName
                    },
                    // position: {
                    //     x: e.pageX,
                    //     y: e.pageY
                    // },
                    // html: e.target.innerHtml
                }
            })
        })
    })
    .catch(() => console.log('There was an error initializing WizardLead'));
})


// document.addEventListener('keypress', (e) => {
//     fireData({
//         keyPress: e.keyCode
//     })
// })

function fireData(payload){
    var data = {
        session: localStorage.getItem('wizardSession') || "",
        payload
    }
    //https://wizardly.herokuapp.com
    // return window.fetch(`https://wizardly.herokuapp.com/plugin/data?wizardId=${window.wizardId}`
    // return window.fetch(`http://localhost:3000/plugin/data?wizardId=${window.wizardId}`
    return window.fetch(`http://localhost:3000/plugin/data?wizardId=${window.wizardId}`,  {
        method: 'POST',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })
    .then(res => res.json())
    .then(body => {
        if(!localStorage.getItem('wizardSession')){
            localStorage.setItem('wizardSession', body.sessionId);
        }
    })
    .catch(err => {
        console.error('There was an error sending data to WizardLead!');
    })
}