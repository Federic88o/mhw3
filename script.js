const Titolo = 'Titolo:';

function onJson_opere(json) {
    console.log('JSON ricevuto');
    console.log(json);
    const sezione = document.querySelector('#view');
    sezione.innerHTML = '';
      
    const results = json.data;

    const nome = document.querySelector('#content').value;
		console.log('Ricerco elementi di tipo: ' + nome);

    let cont = 0;

    for(let result of results){
      if(result.artist_title === nome  && result.image_id !== null){
        console.log(result);
        console.log(result.artist_title)
        const codice_immagine = result.image_id;
        const immagine = 'https://www.artic.edu/iiif/2/' + codice_immagine + '/full/843,/0/default.jpg';
        const titolo = document.createElement('span');
        const quadro = document.createElement('div');
        quadro.classList.add('opera'); 
        const img = document.createElement('img');
        img.src = immagine;
        titolo.textContent = Titolo + result.title;
        const visita_sito = document.createElement('span');
        visita_sito.textContent = 'Clicca per vedere altre opere!!'
        
        quadro.appendChild(titolo);
        quadro.appendChild(img);
        quadro.appendChild(visita_sito);
        sezione.appendChild(quadro);
        cont++;
      }
      const link = document.querySelectorAll('img');
      for( let box of link){
        box.addEventListener('click', link_artista);
      }
      
      function link_artista(event){
        console.log('cliccato');
        window.open('https://www.artic.edu/collection?q=' + nome );
      } 
      if(cont >= 10){
        break;
      }
    }
    if (cont === 0){
      const titolo = document.createElement('span');
      titolo.textContent = 'Nessuna Opera Trovata per: ' + nome ;
      titolo.classList.add('opera_non_trovata');
      sezione.appendChild(titolo);
    }
}

function onJson_album(json){
  console.log('JSON ricevuto');
  console.log(json);
  const sezione = document.querySelector('#view');
  sezione.innerHTML = '';

  const nome = document.querySelector('#content').value;
  
  const results = json.albums.items;
  let cont = 0;
  for(let result of results) {
    /* Posso esserci più artisti */
    const nome_artista = result.artists[0].name;
    if (nome_artista === nome && result.images[0].url !== null){
      console.log(result)
      console.log(nome_artista);
      const selected_image = result.images[0].url;
      const titolo = document.createElement('span');
      const album = document.createElement('div');
      album.classList.add('opera');
      const img = document.createElement('img');
      img.src = selected_image;
      titolo.textContent = Titolo + result.name;
      const  visita_sito = document.createElement('span');
      visita_sito.textContent = 'Clicca per visitare Spotify';

      album.appendChild(titolo)
      album.appendChild(img);
      album.appendChild(visita_sito)
      sezione.appendChild(album);
      cont++;
  
      const spotify = result.external_urls.spotify;
       console.log(spotify);
        const link = document.querySelectorAll('img');
        for( let box of link){
          box.addEventListener('click', link_spotify);
        }
        function link_spotify(event){
          console.log('cliccato');
          window.open(spotify);
        } 
      }
       if(cont >= 10){
        break
      }
    }
    if (cont === 0){
      const titolo = document.createElement('span');
       titolo.textContent = 'Nessuna Album Trovato per: ' + nome;
       titolo.classList.add('opera_non_trovata');
       sezione.appendChild(titolo);
      }
}

function onResponse(response) {
    console.log('Risposta ricevuta');
    return response.json();
}

function search(event){

  event.preventDefault();
  const nome = document.querySelector('#content').value;
  console.log('Ricerco elementi di tipo: ' + nome);
  const tipo = document.querySelector('#tipo').value;
  console.log('Ricerco elementi di tipo: ' + tipo);

  if(tipo === 'Artisti Opere Arte'){
    const api_endpoint = 'https://api.artic.edu/api/v1/artworks/search?q=' + nome + '&fields=id,title,artwork_type_title,artist_title,image_id';
    rest_url= api_endpoint;
    console.log('URL: ' + rest_url);

  fetch(rest_url).then(onResponse).then(onJson_opere)
}if(tipo==='Artisti musicali'){
    console.log('Eseguo ricerca: ' + nome);
    fetch("https://api.spotify.com/v1/search?type=album&q=" + nome,
     {
      headers: { 'Authorization': 'Bearer ' + token }
    }
    ).then(onResponse).then(onJson_album);
  }
}

function onTokenJson(json) {
  console.log(json)
  token = json.access_token;
}
function onTokenResponse(response) {
  return response.json();
}

const client_id = '5594e86468184b6193a9cb0783e3c7ec';
const client_secret = '7e860b49227d423685024219df9306cc';

let token;
fetch("https://accounts.spotify.com/api/token",
	{
    method: "post",
    body: 'grant_type=client_credentials',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
    }
  }
).then(onTokenResponse).then(onTokenJson);

const form = document.querySelector('form');
form.addEventListener('submit', search);

