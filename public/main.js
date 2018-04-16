document.addEventListener('DOMContentLoaded', (e) => {
    console.log('This Application uses WizardLead!');
    fireData({location: window.location})
    .then(() => {
        document.addEventListener('click', (e) => {
            console.log('click!')
            fireData({
                location: window.location.pathname
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