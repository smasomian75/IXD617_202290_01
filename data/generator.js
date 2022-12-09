
const hex = () => chance.string({length:3, pool:'3456789AB'});
const num = () => chance.natural({min:350, max:600});
const getdate = (d1,d2) => dayjs(new Date(chance.natural({min:d1,max:d2}))).format('YYYY-MM-DD HH:mm:ss');

const getUsers = () => (new Array(10)).fill(0).map((o,i)=>{
    o = {};
    o.id = i + 1;
    o.name = chance.name();
    o.username = 'user' + o.id;
    o.password = md5('pass');
    o.email = o.username+'@gmail.com';
    o.img = `https://via.placeholder.com/${num()}x${num()}/${hex()}/fff/?text=${o.name}`;
    o.date_create = getdate(Date.parse('2020/01/01'),Date.now());
    return o;
});

const getTrash = () => (new Array(50)).fill(0).map((o,i)=>{
    o = {};
    o.id = i + 1;
    o.user_id = chance.natural({min:1, max:10});
    o.name = chance.first();
    o.type = chance.pickone(['plastic', 'foodwaste', 'glass', 'paper']);
    o.description= chance.sentence();
    o.img = `https://via.placeholder.com/${num()}x${num()}/${hex()}/fff/?text=${o.name}`;
    o.weight = chance.integer({min:-10, max: 10})
    o.date_create = getdate(Date.parse('2020/01/01'),Date.now());
    return o;
});

const getLocations = () => (new Array(250)).fill(0).map((o,i)=>{
    o = {};
    o.id = i + 1;
    o.trash_id = chance.natural({min:1, max:50});
    o.lat = chance.latitude({min:33.69153651645993, max:34.2547551858361});
    o.lng = chance.longitude({min: -118.48521651594943, max: -117.83897673149056});
    o.description= chance.sentence();
    o.photo = `https://via.placeholder.com/${num()}x${num()}/${hex()}/fff/?text=PHOTO`;
    o.icon = `https://via.placeholder.com/${num()}x${num()}/${hex()}/fff/?text=ICON`;
    o.date_create = getdate(Date.parse('2020/01/01'),Date.now());
    return o;
});

const exportAsJSON = (type,data) => {
    document.querySelector('.output').innerHTML = `
    <h2>${type}<h2>

<pre>
[
${data.map((o)=>`${JSON.stringify(o)}`).join(',\n')}
]
</pre>
`;
}

const exportAsSQL = (type,data) => {
    document.querySelector('.output').innerHTML = `
    <h2>${type}<h2>

<pre>
INSERT INTO \`${type}\` (\`${Object.keys(data[0]).join('`,`')}\`) VALUES
${data.map((o)=>`(${JSON.stringify(Object.values(o)).slice(1,-1)})`).join(',\n')}
</pre>
`;
}

window.addEventListener('DOMContentLoaded',()=>{
    document.querySelector('.users-json').addEventListener('click',()=>{exportAsJSON('Users',getUsers()); });
    document.querySelector('.trash-json').addEventListener('click',()=>{exportAsJSON('Trash',getTrash()); });
    document.querySelector('.locations-json').addEventListener('click',()=>{exportAsJSON('Locations',getLocations()); });

    document.querySelector('.users-sql').addEventListener('click',()=>{exportAsSQL('track_users',getUsers()); });
    document.querySelector('.trash-sql').addEventListener('click',()=>{exportAsSQL('track_trash',getTrash()); });
    document.querySelector('.locations-sql').addEventListener('click',()=>{exportAsSQL('track_locations',getLocations()); });
});