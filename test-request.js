import fetch from 'node-fetch';

(async () => {
  try {
    const res = await fetch('http://localhost:3010/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:5174'
      },
      body: JSON.stringify({nombre:'bob',email:'bob@example.com',direccion:'x',medidor:'999',password:'123456'})
    });
    console.log('status', res.status);
    console.log(await res.json());
  } catch(e){
    console.error('error', e.message);
  }
})();