
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

// Curried function
export const templater = (f) => (a) => 
    (Array.isArray(a) ? a : [a])
    .reduce((r,o,i,a) => r+f(o,i,a), '');