import user from "../admin/store/user";

const REMOTE_URL = `http://localhost:3000`;
// const REMOTE_URL = `https://app.wizardmetrics.com`;
document.addEventListener('DOMContentLoaded', (e) => {
    console.log('This Application uses WizardLead!');
    let location = window.location.pathname;
    fireData({
        type: 'arrival',
        path: window.location.pathname
    })
    .then(() => {
        return window.fetch(`${REMOTE_URL}/plugin/data/userInfo?wizardId=${window.wizardId}`)
    })
    .then(res => res.json())
    .then((userInfo) => {
        document.addEventListener('click', (e) => {
            let type;
            if(userInfo && userInfo.submitId && (userInfo.submitId === e.target.id || userInfo.submitId === e.target.className)){
                let userIdentifier;
                if(userInfo.dataLocationType === 'CLASS'){
                    userIdentifier = document.getElementsByClassName(userInfo.dataLocationId)[0].value;
                } else {
                    userIdentifier = document.getElementById(userInfo.dataLocationId).value;
                }
                if(userIdentifier){
                    setUserInfo(userIdentifier)
                }
            }
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
                    name: e.target.name,
                    id: e.target.id,
                    className: e.target.className,
                    tagName: e.target.tagName
                }
            })
        })
    })
    .catch(() => console.log('There was an error initializing WizardLead'));
})

function setUserInfo(userIdentifier){
    var data = {
        session: localStorage.getItem('wizardSession') || "",
        userIdentifier
    }
    return window.fetch(`${REMOTE_URL}/plugin/data/userInfo?wizardId=${window.wizardId}`,  {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })
}
function fireData(payload){
    payload.referrer = document.referrer || null;
    var data = {
        session: localStorage.getItem('wizardSession') || "",
        payload
    }
    return window.fetch(`${REMOTE_URL}/plugin/data?wizardId=${window.wizardId}`,  {
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