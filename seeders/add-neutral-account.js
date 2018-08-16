const { db, Customer } = require('../db');

db.sync()
    .then(() => {
        const words = ["Abapical", "Antipodals", "Astrophysics", "Barosaurs", "Buyable", "Bwana", "Caespitose", "Company", "Corkboards", "Culpabilities", "Delations", "Doorposts", "Downheartedness", "Electric", "Exploiting", "Feirie", "Generalships", "Glial", "Groggery", "Hexastich", "Hookworms", "Hypoglycemias", "Joyously", "Lanely", "Maltreater", "Misthrow", "Moss", "Mull", "Mycophagy", "Oak", "Overwinds", "Parbuckle", "Playa", "Postural", "Reseeks", "Setout", "Sopranos", "Spininesses", "Stereotype", "Summarized", "Telexes", "Toilet", "Toilets", "Treddled", "Unsoldered", "Uprates", "Vagabondish", "Warrantee", "Whisks", 'Stable', 'Battery', 'Horse', 'Electric', 'Door', 'Monitor', 'Mixed', 'Ranch'];
        const password = words[Math.floor(Math.random() * words.length)] + words[Math.floor(Math.random() * words.length)] + Math.floor(Math.random() * 1000);
        console.log(`Your Password Is: ${password}`)
        return Customer.create({
            name: process.env.NAME || "PlaceHolder",
            location: process.env.LOCATION || "Demo Demo Pl. Demo, NY, 10065",
            password: process.env.password || password,
            status: 'PREMIUM',
            originURL: process.env.originURL || 'https://wizardmetrics.com'
        })
    })
    .then((customer) => {
        console.log('Customer successfully created!');
        console.log('Username:', customer.username);
        console.log('PublicId:', customer.publicId);
    })
    .catch(err => {
        console.log('Error!!', err);
    })
    .finally(() => db.close())