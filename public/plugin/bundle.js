!function(n){var e={};function t(a){if(e[a])return e[a].exports;var r=e[a]={i:a,l:!1,exports:{}};return n[a].call(r.exports,r,r.exports,t),r.l=!0,r.exports}t.m=n,t.c=e,t.d=function(n,e,a){t.o(n,e)||Object.defineProperty(n,e,{configurable:!1,enumerable:!0,get:a})},t.r=function(n){Object.defineProperty(n,"__esModule",{value:!0})},t.n=function(n){var e=n&&n.__esModule?function(){return n.default}:function(){return n};return t.d(e,"a",e),e},t.o=function(n,e){return Object.prototype.hasOwnProperty.call(n,e)},t.p="",t(t.s=0)}([function(module,exports){eval("document.addEventListener('DOMContentLoaded', (e) => {\n    console.log('This Application uses WizardLead!');\n    fireData({\n        type: 'arrival',\n        path: window.location.pathname\n    })\n    .then(() => {\n        document.addEventListener('click', (e) => {\n            fireData({\n                type: e.type,\n                path: window.location.pathname,\n                info: {\n                    value: e.target.value || e.target.text || e.target.innerHtml,\n                    identifiers: {\n                        name: e.target.name,\n                        id: e.target.id,\n                        className: e.target.className,\n                        tagName: e.target.tagName\n                    },\n                    position: {\n                        x: e.pageX,\n                        y: e.pageY\n                    },\n                    html: e.target.innerHtml\n                }\n            })\n        })\n    })\n    .catch(() => console.log('There was an error initializing WizardLead'));\n})\n\n\n// document.addEventListener('keypress', (e) => {\n//     fireData({\n//         keyPress: e.keyCode\n//     })\n// })\n\nfunction fireData(payload){\n    var data = {\n        session: localStorage.getItem('wizardSession') || \"\",\n        payload\n    }\n    //https://wizardly.herokuapp.com\n    // return window.fetch(`https://wizardly.herokuapp.com/plugin/data?wizardId=${window.wizardId}`\n    // return window.fetch(`http://localhost:3000/plugin/data?wizardId=${window.wizardId}`\n    return window.fetch(`http://localhost:3000/plugin/data?wizardId=${window.wizardId}`,  {\n        method: 'POST',\n        body: JSON.stringify(data),\n        headers: new Headers({\n            'Content-Type': 'application/json'\n        })\n    })\n    .then(res => res.json())\n    .then(body => {\n        if(!localStorage.getItem('wizardSession')){\n            localStorage.setItem('wizardSession', body.sessionId);\n        }\n    })\n    .catch(err => {\n        console.error('There was an error sending data to WizardLead!');\n    })\n}\n\n//# sourceURL=webpack:///./browser/plugin/main.js?")}]);