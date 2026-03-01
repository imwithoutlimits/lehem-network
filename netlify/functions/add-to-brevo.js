exports.handler = async function(event) {
  if(event.httpMethod !== 'POST'){
    return { statusCode: 405, body: 'Method not allowed' };
  }

  let data;
  try { data = JSON.parse(event.body); }
  catch(e){ return { statusCode: 400, body: 'Invalid JSON' }; }

  const response = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      email: data.email,
      listIds: [data.listId],
      updateEnabled: true,
      attributes: {
        FIRSTNAME: data.firstName,
        CITY: data.city,
        COUNTRY: data.country,
        ENROLLNUMBER: data.enrollNumber,
        PHASE: data.phasePull || '',
        INTENTION: data.intention || '',
      },
    }),
  });

  const result = await response.json();
  return {
    statusCode: response.status,
    body: JSON.stringify(result),
  };
};
