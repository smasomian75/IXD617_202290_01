
// Promise
export const query = (options) => {
    return fetch('data/api.php', {
        method: 'POST',
        body: JSON.stringify(options)
    }).then((d)=>d.json())
    .then((d)=>{
        if (d.error) throw(d.error);
        else return d;
    });
}