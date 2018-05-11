document.addEventListener('DOMContentLoaded', (e) => {
    console.log('This Application uses WizardLead!');
    fireData({
        type: 'arrival',
        path: window.location.pathname
    })
    .then(() => {
        document.addEventListener('click', (e) => {
            console.log(e);
            console.log(e.target);
            console.log(e.target.innerHtml);
            fireData({
                type: e.type,
                path: window.location.pathname,
                info: {
                    value: e.target.value || e.target.text || e.target.innerHtml,
                    identifiers: {
                        name: e.target.name,
                        id: e.target.id,
                        className: e.target.className,
                        tagName: e.target.tagName
                    },
                    position: {
                        x: e.pageX,
                        y: e.pageY
                    },
                    html: e.target.innerHtml
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
        session: document.cookie || "",
        payload
    }
    console.log('outgoing cookie', document.cookie);
    return window.fetch('http://localhost:3000/data',  {
        method: 'POST',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })
    .then(res => res.json())
    .then(body => {
        if(!document.cookie){
            // document.cookie.sessionId = body.sessionId;
            document.cookie = `sessionId=${body.sessionId}`
        }
        console.log(body.sessionId);
    })
    .catch(err => {
        console.error('There was an error sending data!');
    })
}