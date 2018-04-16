document.addEventListener('DOMContentLoaded', (e) => {
    console.log('loaded');
    console.log(window.location)
    fireData(window.location);
})

document.addEventListener('click', (e) => {
    console.log('click fired!');
    fireData({
        location: window.location.pathname
    })
})

document.addEventListener('keypress', (e) => {
    console.log(e)
    fireData({
        keyPress: e.keyCode
    })
})

function fireData(payload){
    console.log('this fired', payload);
    var data = {
        payload
    }
    console.log('DATA', JSON.stringify(data));
    window.fetch('http://localhost:3000/data',  {
        method: 'POST',
        body: JSON.stringify(data), // data can be `string` or {object}!
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })
    .then(data => {
        console.log('data sent successfully!');
    })
    .catch(err => {
        console.error('There was an error sending data!');
    })
}